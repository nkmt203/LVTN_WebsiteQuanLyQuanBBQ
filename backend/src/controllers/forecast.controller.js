// Nghiệp vụ 2.3.1.15 (AI dự báo nhu cầu nguyên liệu): backend Node đóng vai trò
// "hệ thống quản lý cốt lõi", chỉ chuyển tiếp yêu cầu sang phân hệ dự báo độc
// lập (forecast-service, Python + Prophet) rồi trả kết quả về cho FE.
const FORECAST_SERVICE_URL =
  process.env.FORECAST_SERVICE_URL || "http://localhost:5001";

// GET /api/forecast?so_ngay=7
const getForecast = async (req, res) => {
  const soNgay = req.query.so_ngay || 7;

  // 45s vì gói Free của Render có thể "ngủ" service sau ~15 phút không dùng,
  // lần gọi đầu tiên sau đó cần vài chục giây để "thức dậy".
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);

  try {
    const resp = await fetch(
      `${FORECAST_SERVICE_URL}/forecast?so_ngay=${encodeURIComponent(soNgay)}`,
      { signal: controller.signal },
    );
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error("Lỗi gọi forecast-service:", err.message);
    res.status(503).json({
      message: "Phân hệ dự báo hiện không khả dụng, vui lòng thử lại sau",
    });
  } finally {
    clearTimeout(timer);
  }
};

module.exports = { getForecast };
