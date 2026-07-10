const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { match } = require("assert");

//Tạo chổ save ảnh
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "mon-" + Date.now() + "" + Math.round(Math.random() * 1e6) + ext);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("CHỉ được upload file ảnh"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fieldSize: 5 * 1024 * 1024 },
});
module.exports = { upload, UPLOAD_DIR };
