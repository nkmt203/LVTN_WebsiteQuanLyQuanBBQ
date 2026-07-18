const pool = require("../config/db");
const crypto = require("crypto");

// Sinh mã QR định danh duy nhất — dạng QR-XXXXXXXX
const taoMaQR = () =>
  "QR-" + crypto.randomBytes(4).toString("hex").toUpperCase();

// Kiểm tra khu vực có tồn tại và đang dùng không
const kiemTraKhuVuc = async (maKhuVuc) => {
  const [rows] = await pool.query(
    "SELECT trang_thai FROM KHU_VUC WHERE ma_khu_vuc = ?",
    [maKhuVuc],
  );
  if (rows.length === 0) return { ok: false, message: "Khu vực không tồn tại" };
  if (rows[0].trang_thai === "Ngung_su_dung") {
    return {
      ok: false,
      message: "Khu vực đang ngừng sử dụng, không thể sử dụng",
    };
  }
  return { ok: true };
};

// Validate dữ liệu bàn
const validateDuLieuBan = (data) => {
  const { ten_ban, ma_khu_vuc, so_ghe } = data;
  if (!ten_ban || !ten_ban.trim() || !ma_khu_vuc) {
    return "Vui lòng nhập đầy đủ tên bàn và khu vực";
  }
  const soGheNum = Number(so_ghe);
  if (isNaN(soGheNum) || soGheNum <= 0) {
    return "Số ghế phải là số dương";
  }
  return null;
};

// GET /api/tables/zones — danh sách khu vực đang dùng
const getZonesList = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ma_khu_vuc, ten_khu_vuc FROM KHU_VUC
       WHERE trang_thai = 'Dang_dung' ORDER BY ma_khu_vuc`,
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getZonesList:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách khu vực" });
  }
};

// GET /api/tables — xem + tìm kiếm + phân trang
const getAllTables = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const maKhuVuc = req.query.ma_khu_vuc || "";
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (keyword) {
      conditions.push("(b.ten_ban LIKE ? OR b.ma_ban = ?)");
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (maKhuVuc) {
      conditions.push("b.ma_khu_vuc = ?");
      params.push(maKhuVuc);
    }
    if (trangThai) {
      conditions.push("b.trang_thai = ?");
      params.push(trangThai);
    }
    const whereClause = conditions.length
      ? "WHERE " + conditions.join(" AND ")
      : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM BAN b ${whereClause}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT b.ma_ban, b.ten_ban, b.ma_khu_vuc, kv.ten_khu_vuc,
              b.so_ghe, b.qr_code_dinh_danh, b.trang_thai, b.ghi_chu
       FROM BAN b
       JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
       ${whereClause}
       ORDER BY b.ma_ban ASC
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
    console.error("Lỗi getAllTables:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bàn" });
  }
};

// POST /api/tables — thêm bàn mới (tự sinh QR)
const createTable = async (req, res) => {
  try {
    const { ten_ban, ma_khu_vuc, so_ghe, ghi_chu } = req.body;

    // 1. Validate
    const loi = validateDuLieuBan(req.body);
    if (loi) return res.status(400).json({ message: loi });

    // 2. Kiểm tra khu vực
    const kvCheck = await kiemTraKhuVuc(ma_khu_vuc);
    if (!kvCheck.ok) return res.status(400).json({ message: kvCheck.message });

    // 3. Sinh QR duy nhất
    let qr;
    for (let i = 0; i < 5; i++) {
      qr = taoMaQR();
      const [ex] = await pool.query(
        "SELECT ma_ban FROM BAN WHERE qr_code_dinh_danh = ?",
        [qr],
      );
      if (ex.length === 0) break;
      if (i === 4)
        return res
          .status(500)
          .json({ message: "Không thể sinh mã QR duy nhất" });
    }

    // 4. Insert
    const [result] = await pool.query(
      `INSERT INTO BAN (ten_ban, ma_khu_vuc, so_ghe, qr_code_dinh_danh, ghi_chu)
       VALUES (?, ?, ?, ?, ?)`,
      [ten_ban.trim(), ma_khu_vuc, Number(so_ghe), qr, ghi_chu || null],
    );

    res.status(201).json({
      ma_ban: result.insertId,
      qr_code_dinh_danh: qr,
      message: "Thêm bàn thành công",
    });
  } catch (err) {
    console.error("Lỗi createTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm bàn" });
  }
};

// PUT /api/tables/:id — cập nhật (bao gồm cả trạng thái, chặn nếu đang phục vụ)
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_ban, ma_khu_vuc, so_ghe, ghi_chu, trang_thai } = req.body;

    // 1. Validate
    const loi = validateDuLieuBan(req.body);
    if (loi) return res.status(400).json({ message: loi });

    // 2. Kiểm tra khu vực
    const kvCheck = await kiemTraKhuVuc(ma_khu_vuc);
    if (!kvCheck.ok) return res.status(400).json({ message: kvCheck.message });

    // 3. Lấy bàn hiện tại
    const [rows] = await pool.query(
      "SELECT trang_thai FROM BAN WHERE ma_ban = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    const trangThaiHienTai = rows[0].trang_thai;

    // 4. Xử lý trạng thái
    let trangThaiMoi = trangThaiHienTai;
    if (trang_thai && trang_thai !== trangThaiHienTai) {
      const allowed = ["Trong", "Da_dat_truoc"];
      if (
        !allowed.includes(trangThaiHienTai) ||
        !allowed.includes(trang_thai)
      ) {
        return res.status(409).json({
          message:
            'Chỉ được đổi trạng thái giữa "Trống" và "Đã đặt trước". Bàn đang phục vụ do nhân viên phục vụ quản lý.',
        });
      }
      trangThaiMoi = trang_thai;
    }

    // 5. Update
    await pool.query(
      `UPDATE BAN SET ten_ban = ?, ma_khu_vuc = ?, so_ghe = ?, ghi_chu = ?, trang_thai = ?
       WHERE ma_ban = ?`,
      [
        ten_ban.trim(),
        ma_khu_vuc,
        Number(so_ghe),
        ghi_chu || null,
        trangThaiMoi,
        id,
      ],
    );

    res.json({ message: "Cập nhật bàn thành công" });
  } catch (err) {
    console.error("Lỗi updateTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật bàn" });
  }
};

// DELETE /api/tables/:id — chặn nếu bàn đang dùng hoặc có hóa đơn/đặt bàn
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT trang_thai FROM BAN WHERE ma_ban = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bàn" });

    if (rows[0].trang_thai === "Dang_su_dung") {
      return res
        .status(409)
        .json({ message: "Không thể xóa bàn đang được sử dụng." });
    }

    const [refs] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM HOA_DON WHERE ma_ban = ?) +
        (SELECT COUNT(*) FROM DAT_BAN WHERE ma_ban = ?) AS tongRef`,
      [id, id],
    );
    if (refs[0].tongRef > 0) {
      return res.status(409).json({
        message: "Không thể xóa bàn đang tồn tại đơn gọi món hoặc đơn đặt bàn.",
      });
    }

    await pool.query("DELETE FROM BAN WHERE ma_ban = ?", [id]);
    res.json({ message: "Xóa bàn thành công" });
  } catch (err) {
    console.error("Lỗi deleteTable:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa bàn" });
  }
};

module.exports = {
  getZonesList,
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
};
