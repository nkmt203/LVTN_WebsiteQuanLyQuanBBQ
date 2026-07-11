const pool = require("../config/db");

// d. GET /api/units (XEM + TÌM KIẾM)
const getAllUnits = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (keyword) {
      conditions.push(`(ten_don_vi_tinh LIKE ? OR ma_don_vi_tinh=?)`);
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (trangThai) {
      conditions.push(`(trang_thai=?)`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(" AND ")
      : "";
    const [countRows] = await pool.query(
      `
    SELECT COUNT(*) AS total FROM DON_VI_TINH ${dieuKien}
    `,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
        SELECT ma_don_vi_tinh, ten_don_vi_tinh, trang_thai
        FROM DON_VI_TINH ${dieuKien}
        ORDER BY ma_don_vi_tinh DESC
        LIMIT ${limit} OFFSET ${offset}
        `,
      params,
    );
    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi getAllUnits:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy đơn vị tính" });
  }
};

// a. POST /api/units
const createUnit = async (req, res) => {
  try {
    const { ten_don_vi_tinh } = req.body;
    if (!ten_don_vi_tinh || !ten_don_vi_tinh.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập tên đơn vị tính" });
    }

    const [result] = await pool.query(
      `
    INSERT INTO DON_VI_TINH (ten_don_vi_tinh) VALUES (?)
    `,
      [ten_don_vi_tinh.trim()],
    );
    res.status(201).json({
      ma_don_vi_tinh: result.insertId,
      message: "Thêm đơn vị mới thành công",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên đơn vị đã tồn tại" });
    }
    console.error("lỗi createUnit", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm đơn vị" });
  }
};

// b. PUT /api/units/:id
const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_don_vi_tinh, trang_thai } = req.body;

    if (!ten_don_vi_tinh || !ten_don_vi_tinh.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập tên đơn vị tính" });
    }
    if (trang_thai && !["Dang_dung", "Ngung_su_dung"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const [result] = await pool.query(
      `
      UPDATE DON_VI_TINH SET ten_don_vi_tinh = ?, trang_thai=? WHERE ma_don_vi_tinh=?
      `,
      [ten_don_vi_tinh.trim(), trang_thai || "Dang_dung", id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn vị tính" });
    }

    res.json({ message: "Cập nhật đơn vị tính thành công" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên đơn vị tính đã tồn tại" });
    }
    console.error("Lỗi updateUnit:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật đơn vị tính" });
  }
};

// c. DELETE /api/units/:id
const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT ma_don_vi_tinh FROM DON_VI_TINH WHERE ma_don_vi_tinh=?
      `,[id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn vị tính" });
    }

    const [countRows] = await pool.query(`
      SELECT COUNT(*) AS soNL FROM NGUYEN_LIEU WHERE ma_don_vi_tinh=?
      `,[id]);
    if (countRows[0].soNL > 0) {
      return res.status(409).json({
        message: "Không thể xóa đơn vị tính đang được sử dụng bởi nguyên liệu",
      });
    }
    await pool.query(`DELETE FROM DON_VI_TINH WHERE ma_don_vi_tinh=?`, [id]);
    res.json({ message: "Xóa đơn vị tính thành công" });
  } catch (err) {
    console.error("Lỗi deleteUnit:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa đơn vị tính" });
  }
};

module.exports = {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
};
