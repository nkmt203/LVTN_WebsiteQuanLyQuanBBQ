const pool = require("../config/db");

// GET /api/reports/sales-history — lịch sử bán hàng theo ngày/món
// Query: ?tu_ngay=YYYY-MM-DD&den_ngay=YYYY-MM-DD (mặc định: 30 ngày gần nhất)
// Dữ liệu thô này phục vụ phân hệ AI dự báo nhu cầu nguyên liệu (2.3.1.15) —
// chỉ tổng hợp từ hóa đơn đã thanh toán, không bao gồm món đã hủy.
const getSalesHistory = async (req, res) => {
  try {
    const denNgay = req.query.den_ngay || new Date().toISOString().slice(0, 10);
    const tuNgay =
      req.query.tu_ngay ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [rows] = await pool.query(
      `SELECT DATE(hd.thoi_gian_dong_ban) AS ngay,
              ct.ma_mon_an, m.ten_mon_an,
              SUM(ct.so_luong) AS tong_so_luong,
              SUM(ct.thanh_tien) AS tong_doanh_thu
       FROM CHI_TIET_HOA_DON ct
       JOIN HOA_DON hd ON ct.ma_hoa_don = hd.ma_hoa_don
       JOIN MON_AN m ON ct.ma_mon_an = m.ma_mon_an
       WHERE hd.trang_thai = 'Da_thanh_toan'
         AND ct.trang_thai != 'Da_huy'
         AND hd.thoi_gian_dong_ban >= ? AND hd.thoi_gian_dong_ban <= ?
       GROUP BY DATE(hd.thoi_gian_dong_ban), ct.ma_mon_an
       ORDER BY ngay ASC, ct.ma_mon_an ASC`,
      [`${tuNgay} 00:00:00`, `${denNgay} 23:59:59`],
    );

    res.json({ tu_ngay: tuNgay, den_ngay: denNgay, data: rows });
  } catch (err) {
    console.error("Lỗi getSalesHistory:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử bán hàng" });
  }
};

// GET /api/reports/ingredient-consumption — lịch sử tiêu thụ nguyên liệu theo ngày
// Suy ra từ định mức nguyên liệu x số lượng món đã bán (Da_thanh_toan), cùng
// dữ liệu nguồn cho AI dự báo nhu cầu nguyên liệu (2.3.1.15).
const getIngredientConsumption = async (req, res) => {
  try {
    const denNgay = req.query.den_ngay || new Date().toISOString().slice(0, 10);
    const tuNgay =
      req.query.tu_ngay ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [rows] = await pool.query(
      `SELECT DATE(hd.thoi_gian_dong_ban) AS ngay,
              dm.ma_nguyen_lieu, nl.ten_nguyen_lieu, dvt.ten_don_vi_tinh,
              SUM(ct.so_luong * dm.so_luong_su_dung) AS tong_tieu_thu
       FROM CHI_TIET_HOA_DON ct
       JOIN HOA_DON hd ON ct.ma_hoa_don = hd.ma_hoa_don
       JOIN DINH_MUC_NGUYEN_LIEU dm ON ct.ma_mon_an = dm.ma_mon_an
       JOIN NGUYEN_LIEU nl ON dm.ma_nguyen_lieu = nl.ma_nguyen_lieu
       JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh = dvt.ma_don_vi_tinh
       WHERE hd.trang_thai = 'Da_thanh_toan'
         AND ct.trang_thai != 'Da_huy'
         AND hd.thoi_gian_dong_ban >= ? AND hd.thoi_gian_dong_ban <= ?
       GROUP BY DATE(hd.thoi_gian_dong_ban), dm.ma_nguyen_lieu
       ORDER BY ngay ASC, dm.ma_nguyen_lieu ASC`,
      [`${tuNgay} 00:00:00`, `${denNgay} 23:59:59`],
    );

    res.json({ tu_ngay: tuNgay, den_ngay: denNgay, data: rows });
  } catch (err) {
    console.error("Lỗi getIngredientConsumption:", err.message);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy lịch sử tiêu thụ nguyên liệu" });
  }
};

module.exports = {
  getSalesHistory,
  getIngredientConsumption,
};
