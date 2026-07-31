const pool = require("../config/db");
const crypto = require("crypto");
const bus = require("../events/socketBus");
const { updateBillTotal } = require("./order.controller");

const taoMaPhien = () =>
  "PHIEN-" + crypto.randomBytes(16).toString("hex").toUpperCase();

// GET /api/service/tables — sơ đồ bàn toàn quán, kèm hóa đơn hiện hành
const getTablesMap = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT b.ma_ban, b.ten_ban, b.ma_khu_vuc, kv.ten_khu_vuc,
            b.so_ghe,b.trang_thai, b.qr_code_dinh_danh,
            hd.ma_hoa_don,hd.thoi_gian_mo_ban, hd.trang_thai AS trang_thai_hoa_don
            FROM BAN b
            JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
            LEFT JOIN HOA_DON hd ON hd.ma_hoa_don = (
              SELECT hd2.ma_hoa_don FROM HOA_DON hd2
              WHERE hd2.ma_ban = b.ma_ban
                AND hd2.trang_thai IN ('Dang_phuc_vu','Cho_thanh_toan')
              ORDER BY hd2.ma_hoa_don DESC LIMIT 1
            )
            ORDER BY kv.ma_khu_vuc, b.ma_ban
            `);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getTablesMap:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy sơ đồ bàn" });
  }
};

// POST /api/service/tables/:id/open — mở bàn (nghiệp vụ 2.3.1.10.e)
const openTable = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    await conn.beginTransaction();
    // Khóa dòng bàn để tránh 2 phục vụ cùng mở 1 bàn (race condition)
    const [rows] = await conn.query(
      `
        SELECT trang_thai FROM BAN WHERE ma_ban =? FOR UPDATE
        `,
      [id],
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }
    if (rows[0].trang_thai === "Dang_su_dung") {
      await conn.rollback();
      return res.status(409).json({ message: "Bàn đã có khách" });
    }

    const token = taoMaPhien();

    await conn.query(
      `
        UPDATE BAN SET trang_thai ='Dang_su_dung',phien_token_hien_tai= ?
        WHERE ma_ban =?
        `,
      [token, id],
    );

    const [result] = await conn.query(
      `
        INSERT INTO HOA_DON (ma_ban,thoi_gian_mo_ban) VALUES (?,NOW())
        `,
      [id],
    );
    await conn.commit();
    res.status(201).json({
      ma_hoa_don: result.insertId,
      phien_token: token,
      message: "Mở bàn thành công",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi openTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi mở bàn" });
  } finally {
    conn.release();
  }
};

// POST /api/service/tables/:id/cancel — hủy mở bàn (nghiệp vụ 2.3.1.10.f)
// Chỉ được hủy khi hóa đơn chưa có món nào
const cancelTable = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    await conn.beginTransaction();

    const [hdRows] = await conn.query(
      `
      SELECT ma_hoa_don FROM HOA_DON
      WHERE ma_ban= ? AND trang_thai ='Dang_phuc_vu'
      ORDER BY ma_hoa_don DESC LIMIT 1 FOR UPDATE
      `,
      [id],
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "Bàn không có phiên phục vụ đang hoạt động" });
    }
    const maHoaDon = hdRows[0].ma_hoa_don;

    const [countRows] = await conn.query(
      `
      SELECT COUNT(*) AS so_mon FROM CHI_TIET_HOA_DON WHERE ma_hoa_don= ?
      `,
      [maHoaDon],
    );
    if (countRows[0].so_mon > 0) {
      await conn.rollback();
      return res.status(409).json({
        message:
          "Bàn đã có món được gọi. Vui lòng thực hiện thanh toán qua thu ngân để đóng bàn.",
      });
    }

    await conn.query(
      `
      UPDATE HOA_DON SET trang_thai='Da_huy' WHERE ma_hoa_don=?
      `,
      [maHoaDon],
    );

    await conn.query(
      `
      UPDATE BAN SET trang_thai ='Trong',phien_token_hien_tai= NULL WHERE ma_ban=?
      `,
      [id],
    );
    await conn.commit();
    res.json({
      message:
        "Hủy mở bàn thành công. Bàn đã sẵn sàng cho lượt khách tiếp theo.",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi cancelTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi hủy mở bàn" });
  } finally {
    conn.release();
  }
};

// POST /api/service/tables/:id/transfer — chuyển bàn (nghiệp vụ 2.3.1.10.j)
const transferTable = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const maBanNguon = Number(id);
    const maBanDich = Number(req.body.ma_ban_dich);

    if (!maBanDich) {
      return res.status(400).json({ message: "Vui lòng chọn bàn đích" });
    }
    if (maBanDich === maBanNguon) {
      return res.status(400).json({ message: "Bàn đích phải khác bàn nguồn" });
    }

    await conn.beginTransaction();

    const [idNho, idLon] = [maBanNguon, maBanDich].sort((a, b) => a - b);
    const [banRows] = await conn.query(
      `SELECT ma_ban, ten_ban, trang_thai FROM BAN WHERE ma_ban IN (?, ?) FOR UPDATE`,
      [idNho, idLon],
    );
    const banNguon = banRows.find((b) => b.ma_ban === maBanNguon);
    const banDich = banRows.find((b) => b.ma_ban === maBanDich);

    if (!banNguon || !banDich) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }
    if (banNguon.trang_thai !== "Dang_su_dung") {
      await conn.rollback();
      return res.status(409).json({ message: "Bàn không có khách" });
    }
    if (banDich.trang_thai !== "Trong") {
      await conn.rollback();
      return res.status(409).json({ message: "Bàn đích hiện tại không trống" });
    }

    const [hdRows] = await conn.query(
      `SELECT ma_hoa_don FROM HOA_DON WHERE ma_ban = ? AND trang_thai = 'Dang_phuc_vu'
       ORDER BY ma_hoa_don DESC LIMIT 1 FOR UPDATE`,
      [maBanNguon],
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "Bàn nguồn không có hóa đơn đang phục vụ" });
    }
    const hoaDonCu = hdRows[0].ma_hoa_don;

    const [hdMoi] = await conn.query(
      `INSERT INTO HOA_DON (ma_ban, thoi_gian_mo_ban) VALUES (?, NOW())`,
      [maBanDich],
    );
    const hoaDonMoi = hdMoi.insertId;

    // Chuyển nguyên khối toàn bộ dòng món sang hóa đơn mới
    await conn.query(
      `UPDATE CHI_TIET_HOA_DON SET ma_hoa_don = ? WHERE ma_hoa_don = ?`,
      [hoaDonMoi, hoaDonCu],
    );

    // Tính lại tổng tiền cho hóa đơn mới (mặc định 0 lúc khởi tạo)
    await updateBillTotal(conn, hoaDonMoi);

    await conn.query(
      `UPDATE HOA_DON SET trang_thai = 'Da_huy' WHERE ma_hoa_don = ?`,
      [hoaDonCu],
    );

    const tokenMoi = taoMaPhien();
    await conn.query(
      `UPDATE BAN SET trang_thai = 'Trong', phien_token_hien_tai = NULL WHERE ma_ban = ?`,
      [maBanNguon],
    );
    await conn.query(
      `UPDATE BAN SET trang_thai = 'Dang_su_dung', phien_token_hien_tai = ? WHERE ma_ban = ?`,
      [tokenMoi, maBanDich],
    );

    await conn.commit();

    // Thông báo cho bếp — món "Đang chế biến" tự động thấy đúng bàn mới
    bus.emit("kitchen:table-transfer", {
      ma_hoa_don_cu: hoaDonCu,
      ma_hoa_don_moi: hoaDonMoi,
      ten_ban_nguon: banNguon.ten_ban,
      ten_ban_dich: banDich.ten_ban,
    });

    res.json({
      message: `Đã chuyển từ ${banNguon.ten_ban} sang ${banDich.ten_ban} thành công`,
      ma_hoa_don_moi: hoaDonMoi,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi transferTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi chuyển bàn" });
  } finally {
    conn.release();
  }
};

module.exports = {
  getTablesMap,
  openTable,
  cancelTable,
  transferTable,
};
