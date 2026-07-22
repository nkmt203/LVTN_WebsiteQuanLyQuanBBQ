const pool = require("../config/db");

const SDT_REGEX = /^0\d{9,10}$/;

// GET /api/employees (XEM + TÌM KIẾM)
const getAllEmployees = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const maTaiKhoan = req.query.ma_tai_khoan || "";
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push(
        `(nv.ho_ten LIKE ? OR nv.so_dien_thoai LIKE ? OR nv.ma_nhan_vien = ?)`,
      );
      params.push(`%${keyword}%`, `%${keyword}%`, Number(keyword) || 0);
    }
    if (maTaiKhoan) {
      conditions.push(`nv.ma_tai_khoan = ?`);
      params.push(maTaiKhoan);
    }
    if (trangThai) {
      conditions.push(`nv.trang_thai = ?`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(` AND `)
      : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM NHAN_VIEN nv ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT nv.ma_nhan_vien, nv.ho_ten, nv.so_dien_thoai, nv.trang_thai,
             nv.ma_tai_khoan, tk.ten_dang_nhap, nv.ma_vai_tro, vt.ten_vai_tro
      FROM NHAN_VIEN nv
      JOIN TAI_KHOAN tk ON nv.ma_tai_khoan = tk.ma_tai_khoan
      JOIN VAI_TRO vt ON nv.ma_vai_tro = vt.ma_vai_tro
      ${dieuKien}
      ORDER BY nv.ma_nhan_vien DESC
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
    console.error("Lỗi getAllEmployees:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nhân viên" });
  }
};

// GET /api/employees/accounts — danh sách tài khoản đang hoạt động cho dropdown gán hồ sơ
const getActiveAccounts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT tk.ma_tai_khoan, tk.ten_dang_nhap, tk.ma_vai_tro, vt.ten_vai_tro
       FROM TAI_KHOAN tk JOIN VAI_TRO vt ON tk.ma_vai_tro = vt.ma_vai_tro
       WHERE tk.trang_thai = 'Hoat_dong'
       ORDER BY vt.ten_vai_tro ASC, tk.ten_dang_nhap ASC`,
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getActiveAccounts:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, ma_tai_khoan } = req.body;

    if (!ho_ten || !ho_ten.trim() || !so_dien_thoai || !ma_tai_khoan) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và chọn tài khoản",
      });
    }
    if (!SDT_REGEX.test(so_dien_thoai.trim())) {
      return res.status(400).json({ message: "Số điện thoại không đúng định dạng" });
    }

    const [tk] = await pool.query(
      `SELECT tk.ma_tai_khoan, tk.ma_vai_tro, tk.trang_thai, vt.ten_vai_tro
       FROM TAI_KHOAN tk JOIN VAI_TRO vt ON tk.ma_vai_tro = vt.ma_vai_tro
       WHERE tk.ma_tai_khoan = ?`,
      [ma_tai_khoan],
    );
    if (tk.length === 0) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }
    if (tk[0].trang_thai !== "Hoat_dong") {
      return res.status(400).json({
        message: "Tài khoản đang ngừng hoạt động, không thể gán hồ sơ nhân viên",
      });
    }
    if (tk[0].ten_vai_tro === "Admin") {
      return res.status(400).json({
        message:
          "Tài khoản Admin đã có sẵn hồ sơ nhân viên cố định, không thể tạo thêm hồ sơ mới",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO NHAN_VIEN (ho_ten, so_dien_thoai, ma_vai_tro, ma_tai_khoan)
       VALUES (?, ?, ?, ?)`,
      [ho_ten.trim(), so_dien_thoai.trim(), tk[0].ma_vai_tro, ma_tai_khoan],
    );
    res.status(201).json({
      ma_nhan_vien: result.insertId,
      message: "Thêm mới nhân viên thành công",
    });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }
    console.error("Lỗi createEmployee:", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm nhân viên" });
  }
};

// PUT /api/employees/:id — chỉ cập nhật thông tin liên hệ, không đổi tài khoản/vai trò đã gán
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { ho_ten, so_dien_thoai } = req.body;

    if (!ho_ten || !ho_ten.trim() || !so_dien_thoai) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên và số điện thoại" });
    }
    if (!SDT_REGEX.test(so_dien_thoai.trim())) {
      return res.status(400).json({ message: "Số điện thoại không đúng định dạng" });
    }

    const [result] = await pool.query(
      `UPDATE NHAN_VIEN SET ho_ten = ?, so_dien_thoai = ? WHERE ma_nhan_vien = ?`,
      [ho_ten.trim(), so_dien_thoai.trim(), id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({ message: "Cập nhật hồ sơ nhân viên thành công" });
  } catch (err) {
    console.error("Lỗi updateEmployee:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật nhân viên" });
  }
};

// PATCH /api/employees/:id/status
const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!["Hoat_dong", "Ngung_hoat_dong"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const [result] = await pool.query(
      `UPDATE NHAN_VIEN SET trang_thai = ? WHERE ma_nhan_vien = ?`,
      [trang_thai, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({ message: "Cập nhật hồ sơ nhân viên thành công" });
  } catch (err) {
    console.error("Lỗi updateEmployeeStatus:", err.message);
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái nhân viên" });
  }
};

module.exports = {
  getAllEmployees,
  getActiveAccounts,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
};
