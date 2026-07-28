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
- `forecast-service/` — service Python (Flask + Prophet) cho module AI dự báo nguyên liệu

## Cách chạy
1. Import `database/db_quan_ly_bbq_v1.sql` rồi `database/seed_data_bbq.sql` vào MySQL.
2. Backend: vào `backend/`, tạo file `.env` theo mẫu `.env.example`, chạy `npm install` rồi `npm run dev`.
3. Frontend: vào `frontend/`, chạy `npm install` rồi `npm run dev`.
4. Forecast service (module "Dự báo nguyên liệu" trong Admin — cần chạy song song với backend):
   ```
   cd forecast-service
   python -m venv venv
   ./venv/Scripts/pip install -r requirements.txt   # Windows: ./venv/Scripts/...  |  macOS/Linux: ./venv/bin/...
   ```
   Sau khi cài xong, **trên Windows cần thêm 1 bước sửa lỗi** vì gói `prophet` bản Windows kèm theo 1 bản CmdStan rút gọn bị lỗi (thiếu Makefile), gây lỗi `AttributeError: 'Prophet' object has no attribute 'stan_backend'`:
   ```
   # 1. Cài CmdStan đầy đủ (cần có g++/mingw sẵn trong PATH — 1 lần duy nhất, mất vài phút)
   ./venv/Scripts/python -m cmdstanpy.install_cmdstan
   # 2. Đổi tên (vô hiệu hoá) bản CmdStan lỗi kèm theo prophet để nó dùng bản vừa cài ở bước 1
   mv venv/Lib/site-packages/prophet/stan_model/cmdstan-2.33.1 venv/Lib/site-packages/prophet/stan_model/cmdstan-2.33.1.broken
   ```
   Rồi tạo `.env` theo mẫu `.env.example` và chạy:
   ```
   ./venv/Scripts/python app.py
   ```
   Mặc định chạy ở `http://localhost:5001`.