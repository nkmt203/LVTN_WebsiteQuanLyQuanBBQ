const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { SECRET, EXPIRES_IN } = require("../config/jwt");
const { requireProfile } = require("../middlewares/auth.middleware");

//Tạo jwt từ data
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// a. POST /api/auth/login
const login = async (req, res) => {
  try {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    const [rows] = await pool.query(
      `
        SELECT tk.ma_tai_khoan, tk.ten_dang_nhap, tk.mat_khau_hash, tk.trang_thai,
            vt.ma_vai_tro, vt.ten_vai_tro
        FROM TAI_KHOAN tk 
        JOIN VAI_TRO vt ON tk.ma_vai_tro= vt.ma_vai_tro
        WHERE tk.ten_dang_nhap =?
        `,
      [ten_dang_nhap],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Đăng nhập thất bại" });
    }

    const tk = rows[0];

    if (tk.trang_thai !== "Hoat_dong") {
      return res.status(401).json({ message: "Đăng nhập thất bại" });
    }

    // so sánh pass
    const ok = await bcrypt.compare(mat_khau, tk.mat_khau_hash);
    if (!ok) {
      return res.status(401).json({ message: "Đăng nhập thất bại" });
    }

    let ma_nhan_vien = null;
    let ho_ten = null;
    if (tk.ten_vai_tro === "Admin") {
      const [nvRows] = await pool.query(
        `
            SELECT ma_nhan_vien, ho_ten FROM NHAN_VIEN
            WHERE ma_tai_khoan= ? AND trang_thai='Hoat_dong'
            LIMIT 1
            `,
        [tk.ma_tai_khoan],
      );
      if (nvRows.length > 0) {
        ma_nhan_vien = nvRows[0].ma_nhan_vien;
        ho_ten = nvRows[0].ho_ten;
      }
    }

    //Ký token
    const payload = {
      ma_tai_khoan: tk.ma_tai_khoan,
      ten_dang_nhap: tk.ten_dang_nhap,
      ma_vai_tro: tk.ma_vai_tro,
      ten_vai_tro: tk.ten_vai_tro,
    };
    if (ma_nhan_vien) {
      payload.ma_nhan_vien = ma_nhan_vien;
      payload.ho_ten = ho_ten;
    }

    const token = signToken(payload);
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: payload,
      requireProfileSelection: tk.ten_vai_tro !== "Admin",
    });
  } catch (err) {
    console.error("Lỗi login:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

//b. GET /api/auth/profiles
const getProfiles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT ma_nhan_vien,ho_ten,so_dien_thoai
            FROM NHAN_VIEN
            WHERE ma_tai_khoan=? AND trang_thai= 'Hoat_dong'
            ORDER BY ho_ten ASC
            `,
      [req.user.ma_tai_khoan],
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getProfiles:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách hồ sơ" });
  }
};

// c. POST /api/auth/select-profile
const selectProfile = async (req, res) => {
  try {
    const { ma_nhan_vien } = req.body;
    if (!ma_nhan_vien) {
      return res.status(400).json({ message: "Vui lòng chọn hồ sơ nhân viên" });
    }

    //XÁc thực hồ sơ
    const [rows] = await pool.query(
      `
      SELECT ma_nhan_vien, ho_ten FROM NHAN_VIEN
      WHERE ma_nhan_vien =? AND ma_tai_khoan= ? AND trang_thai='Hoat_dong'
      `,
      [ma_nhan_vien, req.user.ma_tai_khoan],
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Hồ sơ nhân viên không hợp lệ" });
    }
    const payload = {
      ma_tai_khoan: req.user.ma_tai_khoan,
      ten_dang_nhap: req.user.ten_dang_nhap,
      ma_vai_tro: req.user.ma_vai_tro,
      ten_vai_tro: req.user.ten_vai_tro,
      ma_nhan_vien: rows[0].ma_nhan_vien,
      ho_ten: rows[0].ho_ten,
    };
    const token = signToken(payload);
    res.json({ message: "Đã chọn hồ sơ nhân viên", token, user: payload });
  } catch (err) {
    console.error("Lỗi selectProfile:", err.message);
    res.status(500).json({ message: "Lỗi server khi chọn hồ sơ" });
  }
};

// d. POST /api/auth/end-shift
const endShift = async (req, res) => {
  try {
    const payload = {
      ma_tai_khoan: req.user.ma_tai_khoan,
      ten_dang_nhap: req.user.ten_dang_nhap,
      ma_vai_tro: req.user.ma_vai_tro,
      ten_vai_tro: req.user.ten_vai_tro,
    };
    const token = signToken(payload);
    res.json({
      message: "Đã hết ca. Vui lòng chọn hồ sơ nhân viên kế tiếp.",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Lỗi endShift:", err.message);
    res.status(500).json({ message: "Lỗi server khi hết ca" });
  }
};

// e. GET /api/auth/me
const me = async (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
  login,
  getProfiles,
  selectProfile,
  endShift,
  me,
};
