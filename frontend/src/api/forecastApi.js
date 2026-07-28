import axiosClient from "./axiosClient";

// Nghiệp vụ 2.3.1.15 — AI dự báo nhu cầu nguyên liệu (Prophet, qua forecast-service)
export const getForecast = (soNgay) =>
  axiosClient.get("/forecast", { params: { so_ngay: soNgay } }).then((r) => r.data);
