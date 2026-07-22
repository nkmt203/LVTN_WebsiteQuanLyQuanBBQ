const pool = require("../config/db");

const SDT_REGEX = /^0\d{9,10}$/;

// GET /api/suppliers (XEM + TÌM KIẾM)
const getAllSuppliers = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push(
        `(ten_nha_cung_cap LIKE ? OR so_dien_thoai LIKE ? OR ma_nha_cung_cap = ?)`,
      );
      params.push(`%${keyword}%`, `%${keyword}%`, Number(keyword) || 0);
    }
    if (trangThai) {
      conditions.push(`trang_thai = ?`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(` AND `)
      : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM NHA_CUNG_CAP ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi, ghi_chu, trang_thai
      FROM NHA_CUNG_CAP ${dieuKien}
      ORDER BY ma_nha_cung_cap DESC
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
    console.error("Lỗi getAllSuppliers:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nhà cung cấp" });
  }
};

// GET /api/suppliers/active — danh sách gọn cho dropdown lập phiếu nhập kho
const getActiveSuppliers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ma_nha_cung_cap, ten_nha_cung_cap
       FROM NHA_CUNG_CAP WHERE trang_thai = 'Hoat_dong'
       ORDER BY ten_nha_cung_cap ASC`,
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getActiveSuppliers:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/suppliers
const createSupplier = async (req, res) => {
  try {
    const { ten_nha_cung_cap, so_dien_thoai, dia_chi, ghi_chu } = req.body;

    if (!ten_nha_cung_cap || !ten_nha_cung_cap.trim() || !so_dien_thoai) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ tên nhà cung cấp và số điện thoại",
      });
    }
    if (!SDT_REGEX.test(so_dien_thoai.trim())) {
      return res.status(400).json({ message: "Số điện thoại không đúng định dạng" });
    }

    const [trung] = await pool.query(
      `SELECT ma_nha_cung_cap FROM NHA_CUNG_CAP
       WHERE ten_nha_cung_cap = ? OR so_dien_thoai = ?`,
      [ten_nha_cung_cap.trim(), so_dien_thoai.trim()],
    );
    if (trung.length > 0) {
      return res.status(409).json({
        message: "Tên nhà cung cấp hoặc số điện thoại đã tồn tại",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO NHA_CUNG_CAP (ten_nha_cung_cap, so_dien_thoai, dia_chi, ghi_chu)
       VALUES (?, ?, ?, ?)`,
      [ten_nha_cung_cap.trim(), so_dien_thoai.trim(), dia_chi || null, ghi_chu || null],
    );
    res.status(201).json({
      ma_nha_cung_cap: result.insertId,
      message: "Thêm mới nhà cung cấp thành công",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại" });
    }
    console.error("Lỗi createSupplier:", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm nhà cung cấp" });
  }
};

// PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_nha_cung_cap, so_dien_thoai, dia_chi, ghi_chu } = req.body;

    if (!ten_nha_cung_cap || !ten_nha_cung_cap.trim() || !so_dien_thoai) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ tên nhà cung cấp và số điện thoại",
      });
    }
    if (!SDT_REGEX.test(so_dien_thoai.trim())) {
      return res.status(400).json({ message: "Số điện thoại không đúng định dạng" });
    }

    const [trung] = await pool.query(
      `SELECT ma_nha_cung_cap FROM NHA_CUNG_CAP
       WHERE (ten_nha_cung_cap = ? OR so_dien_thoai = ?) AND ma_nha_cung_cap != ?`,
      [ten_nha_cung_cap.trim(), so_dien_thoai.trim(), id],
    );
    if (trung.length > 0) {
      return res.status(409).json({
        message: "Tên nhà cung cấp hoặc số điện thoại đã tồn tại",
      });
    }

    const [result] = await pool.query(
      `UPDATE NHA_CUNG_CAP SET ten_nha_cung_cap=?, so_dien_thoai=?, dia_chi=?, ghi_chu=?
       WHERE ma_nha_cung_cap=?`,
      [ten_nha_cung_cap.trim(), so_dien_thoai.trim(), dia_chi || null, ghi_chu || null, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
    }
    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại" });
    }
    console.error("Lỗi updateSupplier:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật nhà cung cấp" });
  }
};

// PATCH /api/suppliers/:id/status
const updateSupplierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!["Hoat_dong", "Ngung_hop_tac"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const [result] = await pool.query(
      `UPDATE NHA_CUNG_CAP SET trang_thai=? WHERE ma_nha_cung_cap=?`,
      [trang_thai, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
    }
    res.json({ message: "Thay đổi trạng thái nhà cung cấp thành công" });
  } catch (err) {
    console.error("Lỗi updateSupplierStatus:", err.message);
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái nhà cung cấp" });
  }
};

module.exports = {
  getAllSuppliers,
  getActiveSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
};
