import axios from "axios";
import { SERVER_URL } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// Interceptor: tự gắn token vào MỌI request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor phản hồi: nếu token hết hạn (401), xoá và đá về login
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Chỉ xoá token, không tự redirect ở đây để tránh vòng lặp
      // ProtectedRoute sẽ tự xử lý
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default axiosClient;
