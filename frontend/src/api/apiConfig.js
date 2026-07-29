// VITE_API_URL set trên Render (dashboard) cho bản deploy; không set thì chạy
// local sẽ tự rơi về localhost:3000 như trước giờ.
export const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const BASE_URL = `${SERVER_URL}/api`;
