const pool = require("../config/db");
const bus = require("../events/socketBus");

// ============================================================
// GET /api/kitchen/orders — danh sách món cho bếp xử lý
// Bao gồm:
//   - Món Cho_xac_nhan / Dang_che_bien (đang cần làm)
//   - Món Da_huy mà bếp CHƯA tiếp nhận (chưa bấm "Đã dừng chế biến")
// ============================================================
const getPendingOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.ma_chi_tiet_hd, ct.ma_hoa_don, hd.ma_ban,
             b.ten_ban, kv.ten_khu_vuc,
             ct.ma_mon_an, m.ten_mon_an, m.hinh_anh_url,
             ct.so_luong, ct.ghi_chu, ct.trang_thai, ct.nguon_goi_mon,
             ct.thoi_gian_goi_mon,
             TIMESTAMPDIFF(MINUTE, ct.thoi_gian_goi_mon, NOW()) AS phut_da_cho,
             nv.ho_ten AS ten_nv_goi
      FROM CHI_TIET_HOA_DON ct
      JOIN HOA_DON hd ON ct.ma_hoa_don = hd.ma_hoa_don
      JOIN BAN b ON hd.ma_ban = b.ma_ban
      JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
      JOIN MON_AN m ON ct.ma_mon_an = m.ma_mon_an
      LEFT JOIN NHAN_VIEN nv ON ct.ma_nv_xac_nhan = nv.ma_nhan_vien
      WHERE hd.trang_thai = 'Dang_phuc_vu'
      ORDER BY
        (SELECT MIN(ct2.thoi_gian_goi_mon)
         FROM CHI_TIET_HOA_DON ct2
         WHERE ct2.ma_hoa_don = ct.ma_hoa_don) ASC,
        CASE ct.trang_thai
          WHEN 'Da_huy' THEN 0
          WHEN 'Cho_xac_nhan' THEN 1
          WHEN 'Dang_che_bien' THEN 2
          WHEN 'Da_hoan_thanh' THEN 3
        END,
        ct.thoi_gian_goi_mon ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getPendingOrders:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ============================================================
// PATCH /api/kitchen/orders/:id/complete — hoàn thành món
// Đồng thời TỰ ĐỘNG TRỪ KHO nguyên liệu theo định mức
// Nghiệp vụ 2.3.1.3.3.c + 2.3.1.9 bước 5
// ============================================================
const completeOrderItem = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const ma_nhan_vien = req.user.ma_nhan_vien;

    await conn.beginTransaction();

    // 1. Lấy thông tin dòng món
    const [rows] = await conn.query(
      `SELECT ct.ma_hoa_don, ct.ma_mon_an, ct.so_luong, ct.trang_thai,
              m.ten_mon_an, hd.ma_ban, b.ten_ban
       FROM CHI_TIET_HOA_DON ct
       JOIN MON_AN m ON ct.ma_mon_an = m.ma_mon_an
       JOIN HOA_DON hd ON ct.ma_hoa_don = hd.ma_hoa_don
       JOIN BAN b ON hd.ma_ban = b.ma_ban
       WHERE ct.ma_chi_tiet_hd = ? FOR UPDATE`,
      [id],
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy dòng món" });
    }
    const cur = rows[0];

    if (cur.trang_thai !== "Dang_che_bien") {
      await conn.rollback();
      return res.status(409).json({
        message: `Món đang ở trạng thái "${cur.trang_thai}", chỉ món "Đang chế biến" mới được đánh dấu hoàn thành`,
      });
    }

    // 2. Đổi trạng thái món sang Da_hoan_thanh
    await conn.query(
      `UPDATE CHI_TIET_HOA_DON SET trang_thai = 'Da_hoan_thanh' WHERE ma_chi_tiet_hd = ?`,
      [id],
    );

    // 3. TỰ ĐỘNG TRỪ KHO — lấy định mức nguyên liệu của món
    // LEFT JOIN + COALESCE: nguyên liệu chưa từng nhập kho (chưa có dòng
    // KHO_NGUYEN_LIEU) vẫn phải được xét tới, coi tồn hiện tại = 0, để không
    // bị bỏ sót khỏi việc ghi nhật ký hao hụt / cảnh báo thiếu hụt.
    const [dinhMuc] = await conn.query(
      `SELECT dm.ma_nguyen_lieu, dm.so_luong_su_dung,
              nl.ten_nguyen_lieu, k.ma_kho,
              COALESCE(k.so_luong_ton, 0) AS so_luong_ton,
              COALESCE(k.muc_ton_toi_thieu, 0) AS muc_ton_toi_thieu
       FROM DINH_MUC_NGUYEN_LIEU dm
       JOIN NGUYEN_LIEU nl ON dm.ma_nguyen_lieu = nl.ma_nguyen_lieu
       LEFT JOIN KHO_NGUYEN_LIEU k ON dm.ma_nguyen_lieu = k.ma_nguyen_lieu
       WHERE dm.ma_mon_an = ? AND dm.trang_thai = 'Hoat_dong'
       FOR UPDATE`,
      [cur.ma_mon_an],
    );

    const canhBaoThieu = []; // nguyên liệu bị thiếu khi trừ kho
    const canhBaoTonThap = []; // nguyên liệu vừa xuống dưới mức tối thiểu

    for (const nl of dinhMuc) {
      const luongCanTru = Number(nl.so_luong_su_dung) * cur.so_luong;
      const tonHienTai = Number(nl.so_luong_ton);
      const mucToiThieu = Number(nl.muc_ton_toi_thieu);

      let luongThucTru = luongCanTru;
      let luongThieu = 0;

      // 3a. Kiểm tra kho có đủ không
      if (tonHienTai < luongCanTru) {
        // KHÔNG ĐỦ — vẫn cho hoàn thành (không gián đoạn phục vụ)
        // Trừ hết phần đang có, ghi nhật ký phần thiếu
        luongThucTru = tonHienTai;
        luongThieu = luongCanTru - tonHienTai;

        await conn.query(
          `INSERT INTO NHAT_KY_HAO_HUT
           (ma_chi_tiet_hd, ma_nguyen_lieu, so_luong_hao_hut, loai_hao_hut, ly_do, ma_nv_lam_sai)
           VALUES (?, ?, ?, 'Kho_thieu', ?, ?)`,
          [
            id,
            nl.ma_nguyen_lieu,
            luongThieu,
            `Kho không đủ nguyên liệu "${nl.ten_nguyen_lieu}" khi hoàn thành món "${cur.ten_mon_an}"`,
            ma_nhan_vien,
          ],
        );

        canhBaoThieu.push(`${nl.ten_nguyen_lieu} (thiếu ${luongThieu})`);
      }

      // 3b. Trừ kho phần có sẵn
      const tonMoi = tonHienTai - luongThucTru;

      // 3c. Cập nhật trạng thái tồn kho
      let trangThaiMoi;
      if (tonMoi <= 0) {
        trangThaiMoi = "Het_hang";
      } else if (tonMoi < mucToiThieu) {
        trangThaiMoi = "Sap_het";
      } else {
        trangThaiMoi = "Con_hang";
      }

      if (nl.ma_kho) {
        await conn.query(
          `UPDATE KHO_NGUYEN_LIEU
           SET so_luong_ton = ?, trang_thai_ton = ?
           WHERE ma_kho = ?`,
          [tonMoi, trangThaiMoi, nl.ma_kho],
        );
      } else {
        // Chưa từng có dòng kho cho nguyên liệu này — tạo mới luôn để từ
        // giờ được theo dõi tồn kho như các nguyên liệu khác.
        await conn.query(
          `INSERT INTO KHO_NGUYEN_LIEU (ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton)
           VALUES (?, ?, 0, ?)`,
          [nl.ma_nguyen_lieu, tonMoi, trangThaiMoi],
        );
      }

      // 3d. Cảnh báo tồn xuống thấp (nếu vừa vượt ngưỡng)
      if (tonHienTai >= mucToiThieu && tonMoi < mucToiThieu) {
        canhBaoTonThap.push(`${nl.ten_nguyen_lieu} (còn ${tonMoi})`);
      }
    }

    await conn.commit();

    // 4. Emit sự kiện cho phục vụ (Socket sau này sẽ push realtime)
    bus.emit("server:item-done", {
      ma_chi_tiet_hd: id,
      ma_ban: cur.ma_ban,
      ten_ban: cur.ten_ban,
      ten_mon_an: cur.ten_mon_an,
    });

    // Emit cảnh báo cho admin nếu có kho thiếu / sắp hết
    if (canhBaoThieu.length > 0) {
      bus.emit("admin:stock-shortage", {
        ten_mon_an: cur.ten_mon_an,
        nguyen_lieu_thieu: canhBaoThieu,
      });
    }
    if (canhBaoTonThap.length > 0) {
      bus.emit("admin:stock-low", {
        nguyen_lieu: canhBaoTonThap,
      });
    }

    // 5. Trả về kết quả kèm cảnh báo cho FE hiển thị
    res.json({
      message: `Đã hoàn thành "${cur.ten_mon_an}"`,
      canh_bao_thieu: canhBaoThieu,
      canh_bao_ton_thap: canhBaoTonThap,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi completeOrderItem:", err.message);
    res.status(500).json({ message: "Lỗi server khi hoàn thành món" });
  } finally {
    conn.release();
  }
};

// ============================================================
// PATCH /api/kitchen/orders/:id/acknowledge-cancel
// Bếp xác nhận đã tiếp nhận yêu cầu hủy (đã dừng chế biến)
// Do DB đã chốt không thêm cột, dùng tag [BEP_OK] append vào ghi_chu
// ============================================================
const acknowledgeCancellation = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT trang_thai, ghi_chu FROM CHI_TIET_HOA_DON WHERE ma_chi_tiet_hd = ?`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dòng món" });
    }
    if (rows[0].trang_thai !== "Da_huy") {
      return res.status(409).json({ message: "Món này chưa được hủy" });
    }

    // Tránh append trùng nếu bấm 2 lần
    if (rows[0].ghi_chu?.includes("[BEP_OK]")) {
      return res.json({ message: "Đã tiếp nhận trước đó" });
    }

    const ghiChuMoi = (rows[0].ghi_chu || "") + " [BEP_OK]";
    await pool.query(
      `UPDATE CHI_TIET_HOA_DON SET ghi_chu = ? WHERE ma_chi_tiet_hd = ?`,
      [ghiChuMoi, id],
    );

    res.json({ message: "Đã tiếp nhận yêu cầu hủy" });
  } catch (err) {
    console.error("Lỗi acknowledgeCancellation:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getPendingOrders,
  completeOrderItem,
  acknowledgeCancellation,
};
