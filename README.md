# Website Quản Lý Quán BBQ (LVTN)

Ứng dụng quản lý quán BBQ — 5 vai trò (Admin, Phục vụ, Bếp, Thu ngân, Khách qua QR).

## Công nghệ
- Backend: Node.js + Express + MySQL
- Frontend: React + Vite
- AI: Google Gemini (gợi ý món) + Prophet (dự báo nguyên liệu)

## Cấu trúc
- `backend/`  — API server
- `frontend/` — giao diện React
- `database/` — file schema và seed data

## Cách chạy
1. Import `database/db_quan_ly_bbq_v1.sql` rồi `database/seed_data_bbq.sql` vào MySQL.
2. Backend: vào `backend/`, tạo file `.env` theo mẫu `.env.example`, chạy `npm install` rồi `npm run dev`.
3. Frontend: vào `frontend/`, chạy `npm install` rồi `npm run dev`.