const pool = require("../config/db");

// e. GET /api/category + tìm kiếm
const getAllCategories = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (keyword) {
      conditions.push(`(ten_danh_muc LIKE ? OR ma_danh_muc= ?)`);
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (trangThai) {
      conditions.push(`trang_thai=?`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length ? `WHERE ` + conditions.join(`AND`) : "";
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM DANH_MUC ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT ma_danh_muc, ten_danh_muc,mo_ta, trang_thai 
      FROM DANH_MUC ${dieuKien}
      ORDER BY ma_danh_muc DESC
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
    console.error("Lỗi getAllCategories:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
};

// a. POST /api/category
const createCategory = async (req, res) => {
  try {
    const { ten_danh_muc, mo_ta } = req.body;
    if (!ten_danh_muc || !ten_danh_muc.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập tên danh mục ",
      });
    }
    const [result] = await pool.query(
      `
        INSERT INTO DANH_MUC (ten_danh_muc,mo_ta)
        VALUES (?,?)
        `,
      [ten_danh_muc.trim(), mo_ta || null],
    );
    res.status(201).json({
      ma_danh_muc: result.insertId,
      message: "Thêm Mới Danh mục thành công !!",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
    }
    console.error("Lỗi createCategory: ", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm danh mục" });
  }
};

// b. PUT /api/category/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_danh_muc, mo_ta, trang_thai } = req.body;

    if (!ten_danh_muc || !ten_danh_muc.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập tên danh mục" });
    }
    const [result] = await pool.query(
      `
      UPDATE DANH_MUC SET ten_danh_muc=?, mo_ta=?
      WHERE ma_danh_muc=?
      `,
      [ten_danh_muc.trim(), mo_ta || null, id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json({ message: "Cập nhật danh mục thành công" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
    }
    console.error("Lỗi updateCategory: ", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
};

// c. PATCH /api/categories/:id/status
const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!["Dang_su_dung", "Ngung_su_dung"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    //Kiểm tra danh mục
    const [rows] = await pool.query(
      `
      SELECT ma_danh_muc FROM DANH_MUC WHERE ma_danh_muc =?
      `,
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Danh mục không còn tồn tại trên hệ thống" });
    }

    await pool.query(
      `
      UPDATE DANH_MUC SET trang_thai=? 
      WHERE ma_danh_muc=?
      `,
      [trang_thai, id],
    );
    res.json({ message: "Thay đổi trạng thái danh mục thành công" });
  } catch (err) {
    console.error("Lỗi updateCategoryStatus:", err.message);
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái danh mục" });
  }
};

//DELETE /api/category/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT ma_danh_muc FROM DANH_MUC WHERE ma_danh_muc =?
    `,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    //Đếm số món ăn có trong category
    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS soMon FROM MON_AN WHERE ma_danh_muc=?
      `,
      [id],
    );

    if (countRows[0].soMon > 0) {
      return res.status(409).json({
        message:
          "Không thể xóa danh mục đang chứa món ăn. Vui lòng chuyển sang trạng thái Ngừng sử dụng.",
      });
    }
    await pool.query("DELETE FROM DANH_MUC WHERE ma_danh_muc = ?", [id]);
    res.json({ message: "Xóa danh mục thành công" });
  } catch (err) {
    console.error("Lỗi deleteCategory:", err.message);
    res.status(500).json({ message: "Lỗi server khi xoá danh mục" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
