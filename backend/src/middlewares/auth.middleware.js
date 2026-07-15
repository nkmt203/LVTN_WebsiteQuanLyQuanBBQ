const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/jwt");

//kiểm tra token
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Thiếu token xác thực" });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

//kiểm tra vai trò
function authorize(...alowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực" });
    }
    if (!alowedRoles.includes(req.user.ten_vai_tro)) {
      return res.status(403).json({
        message: `Vai trò ${req.user.ten_vai_tro} không có quyền truy cập vào chức năng này`,
      });
    }
    next();
  };
}

//Yêu cầu chọn hồ sơ nhân viên
function requireProfile(req, res, next) {
  if (!req.user?.ma_nhan_vien) {
    return res.status(403).json({
      message: "Vui lòng chọn hồ sơ trước khi thực hiện chức năng này",
    });
  }
}

module.exports = {
  authenticate,
  authorize,
  requireProfile,
};
