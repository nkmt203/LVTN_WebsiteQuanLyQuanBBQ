const pool = require("../config/db");
const bus = require("../events/socketBus");

// Cập nhật tổng tiền hoá đơn (bỏ qua món đã hủy)
const updateBillTotal = async (conn, maHoaDon) => {
  const [sumRows] = await conn.query(
    `
        SELECT COALESCE(SUM(thanh_tien), 0) AS tong FROM CHI_TIET_HOA_DON
        WHERE ma_hoa_don =? AND trang_thai != 'Da_huy'
        `,
    [maHoaDon],
  );
  const tong = Number(sumRows[0].tong);
  await conn.query(
    `
        UPDATE HOA_DON SET tong_tien_truoc_giam= ?, tong_tien_thanh_toan=?
        WHERE ma_hoa_don=?
        `,
    [tong, tong, maHoaDon],
  );
};

// GET /api/orders/table/:tableId — hoá đơn hiện hành + danh sách món ĐÃ GỬI BẾP
const getBillByTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const [hdRows] = await pool.query(
      `
            SELECT hd.ma_hoa_don, hd.ma_ban, b.ten_ban,kv.ten_khu_vuc,
                     hd.thoi_gian_mo_ban, hd.tong_tien_truoc_giam
            FROM HOA_DON hd
            JOIN BAN b ON hd.ma_ban= b.ma_ban
            JOIN KHU_VUC kv ON b.ma_khu_vuc=kv.ma_khu_vuc
            WHERE hd.ma_ban =? AND hd.trang_thai='Dang_phuc_vu'
            ORDER BY hd.ma_hoa_don DESC LIMIT 1
            `,
      [tableId],
    );
    if (hdRows.length === 0) {
      return res.status(404).json({ message: "Bàn chưa được mở phục vụ" });
    }
    const hoaDon = hdRows[0];
    const [items] = await pool.query(
      `
        SELECT ct.ma_chi_tiet_hd, ct.ma_mon_an, mon.ten_mon_an, mon.hinh_anh_url,
                ct.so_luong,ct.don_gia_tai_thoi_diem_goi, ct.thanh_tien,
                ct.ghi_chu,ct.trang_thai, ct.nguon_goi_mon,
                ct.thoi_gian_goi_mon, ct.thoi_gian_xac_nhan,
                ct.ma_nv_xac_nhan, nv.ho_ten AS ten_nv_xac_nhan
        FROM CHI_TIET_HOA_DON ct
        JOIN MON_AN mon ON ct.ma_mon_an= mon.ma_mon_an
        LEFT JOIN NHAN_VIEN nv ON ct.ma_nv_xac_nhan=nv.ma_nhan_vien
        WHERE ct.ma_hoa_don=?
        ORDER BY ct.thoi_gian_goi_mon ASC, ct.ma_chi_tiet_hd ASC
        `,
      [hoaDon.ma_hoa_don],
    );
    res.json({ hoaDon, items });
  } catch (err) {
    console.error("Lỗi getBillByTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy hoá đơn" });
  }
};

// POST /api/orders — gửi BATCH nhiều món vào hoá đơn (nghiệp vụ 2.3.1.11.b)
// Body: { ma_hoa_don, items: [{ ma_mon_an, so_luong, ghi_chu }] }
const addOrderItems = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { ma_hoa_don, items } = req.body;
    const ma_nhan_vien = req.user.ma_nhan_vien;

    //1. validate
    if (!ma_hoa_don || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 món" });
    }
    for (const item of items) {
      if (!item.ma_mon_an || !item.so_luong || Number(item.so_luong) <= 0) {
        return res
          .status(400)
          .json({ message: "Mỗi món phải có số lượng > 0" });
      }
    }
    await conn.beginTransaction();

    //2. kiểm tra hđ đang phục vụ
    const [hdRows] = await conn.query(
      `
        SELECT hd.trang_thai,hd.ma_ban, b.ten_ban
        FROM HOA_DON hd JOIN BAN b ON hd.ma_ban= b.ma_ban
        WHERE hd.ma_hoa_don =? FOR UPDATE
        `,
      [ma_hoa_don],
    );
    if (hdRows.length === 0 || hdRows[0].trang_thai !== "Dang_phuc_vu") {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "Hoá đơn không tồn tại hoặc đã đóng" });
    }

    // 3. Kiểm tra bàn KHÔNG có yêu cầu QR đang chờ xác nhận (nghiệp vụ 2.3.1.11.b bước 2)
    const [choXN] = await conn.query(
      `SELECT COUNT(*) AS soChoXN FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai = 'Cho_xac_nhan'`,
      [ma_hoa_don],
    );
    if (choXN[0].soChoXN > 0) {
      await conn.rollback();
      return res.status(409).json({
        message:
          "Bàn đang có yêu cầu gọi món chờ xác nhận. Vui lòng xác nhận hoặc từ chối trước khi thêm món mới.",
      });
    }

    //4. Lấy thông tin tất cả món ăn cùng lúc
    const monIds = items.map((i) => i.ma_mon_an);
    const [monRows] = await conn.query(
      `
        SELECT ma_mon_an,ten_mon_an,gia_ban,trang_thai FROM MON_AN WHERE ma_mon_an IN (?)
        `,
      [monIds],
    );
    const monMap = {};
    for (const m of monRows) monMap[m.ma_mon_an] = m;

    // Validate: tất cả món phải tồn tại và đang kinh doanh
    for (const item of items) {
      const mon = monMap[item.ma_mon_an];
      if (!mon) {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: `Món ID ${item.ma_mon_an} không tồn tại` });
      }
      if (mon.trang_thai !== "Dang_kinh_doanh") {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: `Món "${mon.ten_mon_an}" đã tạm ngừng kinh doanh` });
      }
    }

    // 5. Luôn tạo DÒNG MỚI cho từng món trong đợt gửi này, ghi ma_nv_xac_nhan cho dòng đó
    // (nghiệp vụ 2.3.1.11.c Trường hợp 3): kể cả khi món này đã có 1 dòng khác
    // đang "Đang chế biến" trong cùng hóa đơn, KHÔNG cộng dồn vào dòng cũ — mỗi
    // đợt gửi bếp là 1 vé riêng biệt, tránh sai sót khi vận hành (bếp có thể
    // nhầm lẫn số lượng/thời điểm nếu 2 đợt gọi món bị gộp chung 1 dòng).
    // Toàn bộ món trong CÙNG 1 đợt gửi này dùng chung 1 mốc thời gian
    // (thay vì NOW() riêng từng dòng) để FE bếp gom được thành 1 "vé" duy nhất.
    const thoiGianDotGui = new Date();
    const insertedItems = [];
    for (const item of items) {
      const mon = monMap[item.ma_mon_an];
      const donGia = Number(mon.gia_ban);
      const soLuong = Number(item.so_luong);
      const thanhTien = donGia * soLuong;

      const [ins] = await conn.query(
        `
            INSERT INTO CHI_TIET_HOA_DON
            (ma_hoa_don,ma_mon_an, so_luong, don_gia_tai_thoi_diem_goi, thanh_tien,
            ghi_chu, trang_thai, ma_nv_xac_nhan,
            thoi_gian_goi_mon, thoi_gian_xac_nhan,nguon_goi_mon)
            VALUES (?,?,?,?,?,?,'Dang_che_bien',?, ?,NOW(),'Nhan_vien')
            `,
        [
          ma_hoa_don,
          item.ma_mon_an,
          soLuong,
          donGia,
          thanhTien,
          item.ghi_chu || null,
          ma_nhan_vien,
          thoiGianDotGui,
        ],
      );
      insertedItems.push({
        ma_chi_tiet_hd: ins.insertId,
        ten_mon_an: mon.ten_mon_an,
        so_luong: soLuong,
        ghi_chu: item.ghi_chu || null,
      });
    }
    //6.cập nhật tổng tiền
    await updateBillTotal(conn, ma_hoa_don);
    await conn.commit();

    // 7. Emit 1 sự kiện cho bếp gồm toàn bộ batch
    bus.emit("kitchen:new-batch", {
      ma_hoa_don,
      ma_ban: hdRows[0].ma_ban,
      ten_ban: hdRows[0].ten_ban,
      items: insertedItems,
    });

    res.status(201).json({
      message: `Đã gửi ${items.length} món xuống bếp`,
      inserted: insertedItems.length,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi addOrderItems:", err.message);
    res.status(500).json({ message: "Lỗi server khi gửi món" });
  } finally {
    conn.release();
  }
};

// PUT /api/orders/:id — sửa SL / ghi chú của món ĐÃ GỬI BẾP (nghiệp vụ C2)
const updateOrderItem = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { so_luong, ghi_chu, xac_nhan_thay_doi } = req.body;
    if (so_luong == null || Number(so_luong) <= 0) {
      return res.status(400).json({ message: "Số lượng phải > 0" });
    }

    await conn.beginTransaction();
    const [rows] = await conn.query(
      `
        SELECT ct.ma_hoa_don, ct.don_gia_tai_thoi_diem_goi, ct.trang_thai,
              ct.so_luong AS so_luong_cu, ct.ma_mon_an,
              m.ten_mon_an, hd.ma_ban, b.ten_ban
       FROM CHI_TIET_HOA_DON ct
       JOIN MON_AN m ON ct.ma_mon_an = m.ma_mon_an
       JOIN HOA_DON hd ON ct.ma_hoa_don = hd.ma_hoa_don
       JOIN BAN b ON hd.ma_ban = b.ma_ban
       WHERE ct.ma_chi_tiet_hd=? FOR UPDATE
        `,
      [id],
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy dòng món" });
    }
    const cur = rows[0];
    if (["Da_hoan_thanh", "Da_huy"].includes(cur.trang_thai)) {
      await conn.rollback();
      return res
        .status(409)
        .json({ message: "Món đã hoàn thành hoặc đã hủy, không thể sửa" });
    }

    // NGHIỆP VỤ C2 TH2: món Dang_che_bien phải có xác nhận từ FE
    if (cur.trang_thai === "Dang_che_bien" && !xac_nhan_thay_doi) {
      await conn.rollback();
      return res.status(409).json({
        message: "Món đang chế biến. Cần xác nhận trước khi thay đổi số lượng.",
        require_confirm: true,
      });
    }
    const soLuongMoi = Number(so_luong);
    const donGia = Number(cur.don_gia_tai_thoi_diem_goi);
    const thanhTienMoi = donGia * soLuongMoi;

    await conn.query(
      `
        UPDATE CHI_TIET_HOA_DON SET so_luong =?,thanh_tien =?,ghi_chu=?
        WHERE ma_chi_tiet_hd=?
        `,
      [soLuongMoi, thanhTienMoi, ghi_chu || null, id],
    );

    await updateBillTotal(conn, cur.ma_hoa_don);
    await conn.commit();

    // Emit sự kiện đổi SL cho bếp (format nghiệp vụ C1 bước 7)
    if (cur.trang_thai === "Dang_che_bien" && cur.so_luong_cu !== soLuongMoi) {
      bus.emit("kitchen:update-qty", {
        ma_chi_tiet_hd: id,
        ma_ban: cur.ma_ban,
        ten_ban: cur.ten_ban,
        ten_mon_an: cur.ten_mon_an,
        so_luong_cu: cur.so_luong_cu,
        so_luong_moi: soLuongMoi,
      });
    }

    res.json({ message: "Cập nhật món thành công" });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi updateOrderItem:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  } finally {
    conn.release();
  }
};

// DELETE /api/orders/:id — hủy món ĐÃ GỬI BẾP (nghiệp vụ d)
const cancelOrderItem = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { ly_do_huy } = req.body;
    if (!ly_do_huy || !ly_do_huy.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập lý do hủy món" });
    }

    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT ct.ma_hoa_don, ct.trang_thai, ct.ghi_chu,
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
    if (cur.trang_thai === "Da_huy") {
      await conn.rollback();
      return res.status(409).json({ message: "Món đã bị hủy trước đó" });
    }
    if (cur.trang_thai === "Da_hoan_thanh") {
      await conn.rollback();
      return res
        .status(409)
        .json({ message: "Món đã hoàn thành, chỉ Quản lý mới được hủy." });
    }
    // Gộp lý do vào ghi_chu (tạm thời, chưa có cột riêng)
    const ghiChuMoi = (cur.ghi_chu || "") + ` [Lý do hủy: ${ly_do_huy.trim()}]`;
    await conn.query(
      `UPDATE CHI_TIET_HOA_DON SET trang_thai = 'Da_huy', ghi_chu = ?
       WHERE ma_chi_tiet_hd = ?`,
      [ghiChuMoi, id],
    );

    await updateBillTotal(conn, cur.ma_hoa_don);

    await conn.commit();

    bus.emit("kitchen:cancel-item", {
      ma_chi_tiet_hd: id,
      ma_ban: cur.ma_ban,
      ten_ban: cur.ten_ban,
      ten_mon_an: cur.ten_mon_an,
      ly_do: ly_do_huy.trim(),
    });

    res.json({ message: "Đã hủy món" });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi cancelOrderItem:", err.message);
    res.status(500).json({ message: "Lỗi server khi hủy món" });
  } finally {
    conn.release();
  }
};

// POST /api/orders/bills/:id/request-payment — phục vụ yêu cầu thu ngân xử lý
const requestPayment = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    await conn.beginTransaction();

    const [hdRows] = await conn.query(
      `SELECT trang_thai FROM HOA_DON WHERE ma_hoa_don = ? FOR UPDATE`,
      [id],
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }
    if (hdRows[0].trang_thai !== "Dang_phuc_vu") {
      await conn.rollback();
      return res.status(409).json({
        message: `Hóa đơn đang ở trạng thái "${hdRows[0].trang_thai}", không thể yêu cầu thanh toán.`,
      });
    }

    // Kiểm tra: mọi món phải đã Da_hoan_thanh hoặc Da_huy
    const [chuaXong] = await conn.query(
      `SELECT COUNT(*) AS so_mon FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai IN ('Cho_xac_nhan', 'Dang_che_bien')`,
      [id],
    );
    if (chuaXong[0].so_mon > 0) {
      await conn.rollback();
      return res.status(409).json({
        message: `Còn ${chuaXong[0].so_mon} món chưa hoàn thành. Vui lòng chờ bếp làm xong.`,
      });
    }

    // Kiểm tra: mọi món hủy phải đã được bếp tiếp nhận
    const [huyChuaTiep] = await conn.query(
      `SELECT COUNT(*) AS so_mon FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai = 'Da_huy'
         AND (ghi_chu IS NULL OR ghi_chu NOT LIKE '%[BEP_OK]%')`,
      [id],
    );
    if (huyChuaTiep[0].so_mon > 0) {
      await conn.rollback();
      return res.status(409).json({
        message: `Còn ${huyChuaTiep[0].so_mon} yêu cầu hủy chưa được bếp tiếp nhận.`,
      });
    }

    // Chuyển sang Cho_thanh_toan
    await conn.query(
      `UPDATE HOA_DON SET trang_thai = 'Cho_thanh_toan' WHERE ma_hoa_don = ?`,
      [id],
    );

    await conn.commit();

    bus.emit("cashier:payment-request", { ma_hoa_don: id });

    res.json({ message: "Đã gửi yêu cầu thanh toán đến thu ngân" });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi requestPayment:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  } finally {
    conn.release();
  }
};

module.exports = {
  getBillByTable,
  addOrderItems,
  updateOrderItem,
  cancelOrderItem,
  requestPayment,
  updateBillTotal,
};
