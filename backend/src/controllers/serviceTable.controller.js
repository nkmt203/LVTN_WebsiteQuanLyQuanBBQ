const pool = require("../config/db");
const crypto = require("crypto");

const taoMaPhien = () =>
  "PHIEN-" + crypto.randomBytes(16).toString("hex").toUpperCase();

// GET /api/service/tables — sơ đồ bàn toàn quán, kèm hóa đơn hiện hành
const getTablesMap = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT b.ma_ban, b.ten_ban, b.ma_khu_vuc, kv.ten_khu_vuc,
            b.so_ghe,b.trang_thai,
            hd.ma_hoa_don,hd.thoi_gian_mo_ban
            FROM BAN b
            JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
            LEFT JOIN HOA_DON hd ON b.ma_ban= hd.ma_ban AND hd.trang_thai='Dang_phuc_vu'
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

    //cập nhật bàn: đsd+ gán mã phiên
    await conn.query(
      `
        UPDATE BAN SET trang_thai ='Dang_su_dung',phien_token_hien_tai= ?
        WHERE ma_ban =?
        `,
      [token, id],
    );

    //Tạo hđ mới lk bàn
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

    //Lấy hđ hiện tại bàn
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

    //Kiểm tra có món ?
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

    //Hủy hđ rổng
    await conn.query(
      `
      UPDATE HOA_DON SET trang_thai='Da_huy' WHERE ma_hoa_don=?
      `,
      [maHoaDon],
    );

    //Trả bàn trống+ xóa phiên
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

module.exports = {
  getTablesMap,
  openTable,
  cancelTable,
};
