const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../middlewares/upload");

function xoaFileAnh(filename) {
  if (!filename) return;
  fs.unlink(path.join(UPLOAD_DIR, filename), (err) => {
    if (err && err.code !== "ENOENT")
      console.error("Không xoá được file ảnh:", err.message);
  });
}

// e. GET /api/food — xem + tìm kiếm (mã/tên, danh mục, trạng thái) + phân trang
const getAllFood = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const maDanhMuc = req.query.ma_danh_muc || "";
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (keyword) {
      conditions.push("(m.ten_mon_an LIKE ? OR m.ma_mon_an = ?)"); // tìm theo tên HOẶC mã
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (maDanhMuc) {
      conditions.push("m.ma_danh_muc = ?");
      params.push(maDanhMuc);
    }
    if (trangThai) {
      conditions.push("m.trang_thai = ?");
      params.push(trangThai);
    }
    const dieuKien = conditions.length
      ? "WHERE " + conditions.join(" AND ")
      : "";

    // Đếm tổng số bản ghi
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM MON_AN m ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    // Lấy dữ liệu của đúng trang hiện tại. limit/offset là số nguyên đã validate nên chèn thẳng an toàn.
    const [rows] = await pool.query(
      `SELECT m.ma_mon_an, m.ten_mon_an, m.ma_danh_muc, d.ten_danh_muc,
              m.gia_ban, m.mo_ta, m.hinh_anh_url, m.trang_thai
       FROM MON_AN m
       JOIN DANH_MUC d ON m.ma_danh_muc = d.ma_danh_muc
       ${dieuKien}
       ORDER BY m.ma_mon_an DESC
       LIMIT ${limit} OFFSET ${offset}`,
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
    console.error("Lỗi getAllFood:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách món" });
  }
};

// a. POST /api/food — thêm mới món ăn
const createFood = async (req, res) => {
  try {
    const { ten_mon_an, ma_danh_muc, gia_ban, mo_ta } = req.body;
    const hinh_anh_url = req.file ? req.file.filename : null;

    if (!ten_mon_an || !ma_danh_muc || gia_ban == null || gia_ban === "") {
      xoaFileAnh(hinh_anh_url);
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ tên món, danh mục và giá bán" });
    }

    const [result] = await pool.query(
      `INSERT INTO MON_AN (ten_mon_an, ma_danh_muc, gia_ban, mo_ta, hinh_anh_url)
       VALUES (?, ?, ?, ?, ?)`,
      [ten_mon_an, ma_danh_muc, gia_ban, mo_ta || null, hinh_anh_url],
    );
    res.status(201).json({
      ma_mon_an: result.insertId,
      message: "Thêm mới món ăn thành công",
    });
  } catch (err) {
    xoaFileAnh(req.file ? req.file.filename : null);
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Tên món ăn đã tồn tại" });
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    console.error("Lỗi createFood:", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm món" });
  }
};

// b. PUT /api/food/:id — cập nhật THÔNG TIN món
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_mon_an, ma_danh_muc, gia_ban, mo_ta } = req.body;

    if (!ten_mon_an || !ma_danh_muc || gia_ban == null || gia_ban === "") {
      xoaFileAnh(req.file ? req.file.filename : null);
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ tên món, danh mục và giá bán" });
    }

    const [rows] = await pool.query(
      "SELECT hinh_anh_url FROM MON_AN WHERE ma_mon_an = ?",
      [id],
    );
    if (rows.length === 0) {
      xoaFileAnh(req.file ? req.file.filename : null);
      return res.status(404).json({ message: "Không tìm thấy món ăn cần sửa" });
    }
    const anhCu = rows[0].hinh_anh_url;
    const anhMoi = req.file ? req.file.filename : anhCu;

    await pool.query(
      `UPDATE MON_AN SET ten_mon_an = ?, ma_danh_muc = ?, gia_ban = ?, mo_ta = ?, hinh_anh_url = ?
       WHERE ma_mon_an = ?`,
      [ten_mon_an, ma_danh_muc, gia_ban, mo_ta || null, anhMoi, id],
    );

    if (req.file && anhCu) xoaFileAnh(anhCu);
    res.json({ message: "Cập nhật thông tin món ăn thành công" });
  } catch (err) {
    xoaFileAnh(req.file ? req.file.filename : null);
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Tên món ăn đã tồn tại" });
    console.error("Lỗi updateFood:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật món" });
  }
};

// d. PATCH /api/food/:id/status — đổi trạng thái kinh doanh
const updateFoodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;
    if (!["Dang_kinh_doanh", "Tam_ngung"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const [result] = await pool.query(
      "UPDATE MON_AN SET trang_thai = ? WHERE ma_mon_an = ?",
      [trang_thai, id],
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Món ăn không còn tồn tại trên hệ thống" });
    }
    res.json({ message: "Thay đổi trạng thái món ăn thành công" });
  } catch (err) {
    console.error("Lỗi updateFoodStatus:", err.message);
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái món" });
  }
};

// c. DELETE /api/food/:id — CHẶN nếu món đã dùng trong đơn; xóa hẳn nếu chưa
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT hinh_anh_url FROM MON_AN WHERE ma_mon_an = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    const anh = rows[0].hinh_anh_url;

    // Kiểm tra món có nằm trong đơn gọi món (chi tiết hóa đơn) nào không
    const [refRows] = await pool.query(
      "SELECT COUNT(*) AS refs FROM CHI_TIET_HOA_DON WHERE ma_mon_an = ?",
      [id],
    );
    if (refRows[0].refs > 0) {
      return res.status(409).json({
        message:
          "Không thể xóa món ăn đang được sử dụng. Vui lòng chuyển sang trạng thái Tạm ngừng kinh doanh.",
      });
    }

    // Chưa dùng ở đâu -> xóa hẳn (dòng định mức tự xóa theo ON DELETE CASCADE)
    await pool.query("DELETE FROM MON_AN WHERE ma_mon_an = ?", [id]);
    xoaFileAnh(anh);
    res.json({ message: "Xóa món ăn thành công" });
  } catch (err) {
    console.error("Lỗi deleteFood:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa món" });
  }
};

module.exports = {
  getAllFood,
  createFood,
  updateFood,
  updateFoodStatus,
  deleteFood,
};
