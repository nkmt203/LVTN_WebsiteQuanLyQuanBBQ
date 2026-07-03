const pool = require("../config/db");

// Hàm xử lý cho GET /api/food
const getAllFood = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM MON_AN");
    // Trả kết quả về client dưới dạng JSON
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getAllFood:", err.message);
    // Có lỗi phía server -> trả mã 500
    res.status(500).json({ message: "Lỗi server khi lấy danh sách món" });
  }
};
module.exports = { getAllFood };
