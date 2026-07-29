require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2/promise");

// DB_SSL_CA_PATH chỉ có khi dùng DB online (Aiven, bắt buộc SSL).
// Chạy WAMP local thì không set biến này, bỏ qua ssl như trước giờ.
const ssl = process.env.DB_SSL_CA_PATH
  ? { ca: fs.readFileSync(process.env.DB_SSL_CA_PATH) }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = pool;
