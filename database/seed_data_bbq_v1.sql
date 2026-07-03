-- ============================================================
-- SEED DATA — DB QUẢN LÝ QUÁN BBQ (db_quan_ly_bbq_v1)
-- Chạy file này SAU khi đã chạy file schema db_quan_ly_bbq_v1.sql
-- (schema đã tự thêm sẵn 4 VAI_TRO: 1=Admin, 2=Phuc_vu, 3=Bep, 4=Thu_ngan)
--
-- Mật khẩu của MỌI tài khoản bên dưới là: 123456
-- (chuỗi mat_khau_hash là bản băm bcrypt của "123456")
-- ============================================================
USE db_quan_ly_bbq_v1;

-- ------------------------------------------------------------
-- TAI_KHOAN  (mỗi thiết bị/vai trò 1 tài khoản — mô hình "1 tài khoản, nhiều hồ sơ")
-- ------------------------------------------------------------
INSERT INTO TAI_KHOAN (ma_tai_khoan, ten_dang_nhap, mat_khau_hash, ma_vai_tro) VALUES
  (1, 'admin',  '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 1),
  (2, 'phucvu', '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 2),
  (3, 'bep',    '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 3),
  (4, 'thungan','$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 4);

-- ------------------------------------------------------------
-- NHAN_VIEN  (hồ sơ nhân viên — 2 phục vụ dùng chung tài khoản 'phucvu')
-- ------------------------------------------------------------
INSERT INTO NHAN_VIEN (ma_nhan_vien, ho_ten, so_dien_thoai, ma_vai_tro, ma_tai_khoan) VALUES
  (1, 'Nguyễn Văn An',  '0901000001', 1, 1),
  (2, 'Trần Thị Bình',  '0901000002', 2, 2),
  (3, 'Lê Văn Cường',   '0901000003', 2, 2),
  (4, 'Phạm Thị Dung',  '0901000004', 3, 3),
  (5, 'Hoàng Văn Em',   '0901000005', 4, 4);

-- ------------------------------------------------------------
-- DANH_MUC  (nhóm món)
-- ------------------------------------------------------------
INSERT INTO DANH_MUC (ma_danh_muc, ten_danh_muc, mo_ta) VALUES
  (1, 'Thịt bò',    'Các loại thịt bò nướng'),
  (2, 'Thịt heo',   'Các loại thịt heo nướng'),
  (3, 'Hải sản',    'Tôm, mực, cá các loại'),
  (4, 'Rau & Nấm',  'Rau củ và nấm ăn kèm'),
  (5, 'Đồ uống',    'Nước ngọt, bia, nước suối'),
  (6, 'Món thêm',   'Cơm, kim chi, trứng...'),
  (7, 'Lẩu',        'Các loại lẩu');

-- ------------------------------------------------------------
-- MON_AN  (thực đơn — dùng cho GET /api/food)
-- ------------------------------------------------------------
INSERT INTO MON_AN (ma_mon_an, ten_mon_an, ma_danh_muc, gia_ban, mo_ta) VALUES
  (1,  'Ba chỉ bò Mỹ',      1, 159000, 'Ba chỉ bò Mỹ thái lát mỏng'),
  (2,  'Bắp bò',            1, 139000, 'Bắp bò tươi'),
  (3,  'Dẻ sườn bò',        1, 189000, 'Dẻ sườn bò mềm ngọt'),
  (4,  'Lưỡi bò',           1, 169000, 'Lưỡi bò thái lát'),
  (5,  'Ba chỉ heo',        2, 99000,  'Ba chỉ heo nướng'),
  (6,  'Sườn heo BBQ',      2, 119000, 'Sườn heo ướp sốt BBQ'),
  (7,  'Nạc vai heo',       2, 89000,  'Nạc vai heo thái lát'),
  (8,  'Tôm sú',            3, 149000, 'Tôm sú tươi'),
  (9,  'Mực ống',           3, 129000, 'Mực ống tươi'),
  (10, 'Bạch tuộc',         3, 159000, 'Bạch tuộc nướng sa tế'),
  (11, 'Cá hồi',            3, 179000, 'Cá hồi phi lê'),
  (12, 'Nấm kim châm',      4, 39000,  'Nấm kim châm tươi'),
  (13, 'Nấm đùi gà',        4, 45000,  'Nấm đùi gà'),
  (14, 'Rau cải nướng',     4, 29000,  'Rau cải ăn kèm'),
  (15, 'Khoai lang nướng',  4, 35000,  'Khoai lang mật'),
  (16, 'Bắp Mỹ',            4, 25000,  'Bắp Mỹ ngọt'),
  (17, 'Coca Cola',         5, 20000,  'Lon 330ml'),
  (18, 'Trà đào',           5, 30000,  'Trà đào cam sả'),
  (19, 'Bia Tiger',         5, 25000,  'Lon 330ml'),
  (20, 'Nước suối',         5, 12000,  'Chai 500ml'),
  (21, 'Cơm trắng',         6, 15000,  'Chén cơm trắng'),
  (22, 'Kim chi',           6, 25000,  'Kim chi cải thảo'),
  (23, 'Trứng gà nướng',    6, 12000,  'Trứng gà'),
  (24, 'Lẩu Thái',          7, 199000, 'Lẩu Thái chua cay'),
  (25, 'Lẩu nấm',           7, 179000, 'Lẩu nấm thanh đạm');

-- ------------------------------------------------------------
-- DON_VI_TINH
-- ------------------------------------------------------------
INSERT INTO DON_VI_TINH (ma_don_vi_tinh, ten_don_vi_tinh) VALUES
  (1, 'kg'), (2, 'gram'), (3, 'phần'), (4, 'cái'),
  (5, 'chai'), (6, 'lon'), (7, 'lít'), (8, 'vỉ'), (9, 'bó');

-- ------------------------------------------------------------
-- NGUYEN_LIEU
-- ------------------------------------------------------------
INSERT INTO NGUYEN_LIEU (ma_nguyen_lieu, ten_nguyen_lieu, ma_don_vi_tinh) VALUES
  (1,  'Thịt ba chỉ bò',  1),
  (2,  'Bắp bò',          1),
  (3,  'Thịt ba chỉ heo', 1),
  (4,  'Sườn heo',        1),
  (5,  'Tôm sú',          1),
  (6,  'Mực ống',         1),
  (7,  'Cá hồi',          1),
  (8,  'Nấm kim châm',    2),
  (9,  'Rau cải',         9),
  (10, 'Khoai lang',      1),
  (11, 'Coca Cola',       6),
  (12, 'Bia Tiger',       6),
  (13, 'Nước suối',       5),
  (14, 'Gạo',             1),
  (15, 'Trứng gà',        4);

-- ------------------------------------------------------------
-- KHO_NGUYEN_LIEU  (tồn kho — mỗi nguyên liệu 1 dòng)
-- ------------------------------------------------------------
INSERT INTO KHO_NGUYEN_LIEU (ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton) VALUES
  (1,  25.000, 5.000, 'Con_hang'),
  (2,  18.000, 5.000, 'Con_hang'),
  (3,  30.000, 5.000, 'Con_hang'),
  (4,  4.500,  5.000, 'Sap_het'),
  (5,  12.000, 3.000, 'Con_hang'),
  (6,  8.000,  3.000, 'Con_hang'),
  (7,  0.000,  3.000, 'Het_hang'),
  (8,  5000.000, 1000.000, 'Con_hang'),
  (9,  40.000, 10.000, 'Con_hang'),
  (10, 15.000, 5.000, 'Con_hang'),
  (11, 120.000, 24.000, 'Con_hang'),
  (12, 90.000, 24.000, 'Con_hang'),
  (13, 200.000, 48.000, 'Con_hang'),
  (14, 50.000, 10.000, 'Con_hang'),
  (15, 200.000, 30.000, 'Con_hang');

-- ------------------------------------------------------------
-- NHA_CUNG_CAP
-- ------------------------------------------------------------
INSERT INTO NHA_CUNG_CAP (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi) VALUES
  (1, 'Cty Thực phẩm Sạch ABC', '0281234567', '12 Nguyễn Trãi, Q.1, TP.HCM'),
  (2, 'Hải sản Biển Đông',      '0289876543', '45 Bến Vân Đồn, Q.4, TP.HCM'),
  (3, 'Nước giải khát Miền Nam','0287654321', '78 Lý Thường Kiệt, Q.10, TP.HCM');

-- ------------------------------------------------------------
-- KHU_VUC
-- ------------------------------------------------------------
INSERT INTO KHU_VUC (ma_khu_vuc, ten_khu_vuc, mo_ta) VALUES
  (1, 'Tầng trệt', 'Khu vực tầng trệt'),
  (2, 'Tầng 2',    'Khu vực tầng 2'),
  (3, 'Sân vườn',  'Khu vực ngoài trời'),
  (4, 'Phòng VIP', 'Phòng riêng máy lạnh');

-- ------------------------------------------------------------
-- BAN  (sơ đồ bàn)
-- ------------------------------------------------------------
INSERT INTO BAN (ma_ban, ten_ban, ma_khu_vuc, so_ghe, qr_code_dinh_danh, trang_thai) VALUES
  (1,  'Bàn 01', 1, 4, 'QR-T1-B01', 'Dang_su_dung'),
  (2,  'Bàn 02', 1, 4, 'QR-T1-B02', 'Trong'),
  (3,  'Bàn 03', 1, 6, 'QR-T1-B03', 'Trong'),
  (4,  'Bàn 04', 1, 4, 'QR-T1-B04', 'Da_dat_truoc'),
  (5,  'Bàn 05', 2, 6, 'QR-T2-B05', 'Trong'),
  (6,  'Bàn 06', 2, 8, 'QR-T2-B06', 'Trong'),
  (7,  'Bàn 07', 3, 4, 'QR-SV-B07', 'Trong'),
  (8,  'Bàn 08', 3, 4, 'QR-SV-B08', 'Trong'),
  (9,  'VIP 01', 4, 10,'QR-VIP-01', 'Dang_su_dung'),
  (10, 'VIP 02', 4, 12,'QR-VIP-02', 'Trong');

-- ------------------------------------------------------------
-- DINH_MUC_NGUYEN_LIEU  (công thức: 1 phần món dùng bao nhiêu nguyên liệu)
-- ------------------------------------------------------------
INSERT INTO DINH_MUC_NGUYEN_LIEU (ma_mon_an, ma_nguyen_lieu, so_luong_su_dung) VALUES
  (1, 1, 0.200),   -- Ba chỉ bò Mỹ  -> 0.2 kg thịt ba chỉ bò
  (2, 2, 0.200),   -- Bắp bò        -> 0.2 kg bắp bò
  (5, 3, 0.200),   -- Ba chỉ heo    -> 0.2 kg thịt ba chỉ heo
  (6, 4, 0.250),   -- Sườn heo BBQ  -> 0.25 kg sườn heo
  (8, 5, 0.150),   -- Tôm sú        -> 0.15 kg tôm sú
  (9, 6, 0.150),   -- Mực ống       -> 0.15 kg mực
  (11,7, 0.180),   -- Cá hồi        -> 0.18 kg cá hồi
  (12,8, 100.000), -- Nấm kim châm  -> 100 gram
  (17,11,1.000),   -- Coca Cola     -> 1 lon
  (19,12,1.000),   -- Bia Tiger     -> 1 lon
  (20,13,1.000),   -- Nước suối     -> 1 chai
  (21,14,0.150),   -- Cơm trắng     -> 0.15 kg gạo
  (23,15,1.000);   -- Trứng gà nướng-> 1 trứng

-- ------------------------------------------------------------
-- PHIEU_NHAP_KHO + CHI_TIET  (1 phiếu nhập mẫu)
-- ------------------------------------------------------------
INSERT INTO PHIEU_NHAP_KHO (ma_phieu_nhap, ma_nha_cung_cap, ma_nhan_vien_lap, ngay_nhap, tong_tien, ghi_chu) VALUES
  (1, 1, 1, '2026-06-28 08:00:00', 8500000, 'Nhập hàng đầu tuần');

INSERT INTO CHI_TIET_NHAP_KHO (ma_phieu_nhap, ma_nguyen_lieu, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES
  (1, 1, 15.000, 300000, 4500000),  -- 15kg ba chỉ bò
  (1, 3, 20.000, 150000, 3000000),  -- 20kg ba chỉ heo
  (1, 9, 20.000, 50000,  1000000);  -- 20 bó rau cải

-- ------------------------------------------------------------
-- HOA_DON + CHI_TIET  (2 hóa đơn mẫu: 1 đã thanh toán, 1 đang phục vụ)
-- ------------------------------------------------------------
-- Hóa đơn 1: bàn 9 (VIP 01), đã thanh toán xong
INSERT INTO HOA_DON
  (ma_hoa_don, ma_ban, ma_nhan_vien_thu_ngan, thoi_gian_mo_ban, thoi_gian_dong_ban,
   tong_tien_truoc_giam, tien_giam_gia, tong_tien_thanh_toan, hinh_thuc_thanh_toan, trang_thai)
VALUES
  (1, 9, 5, '2026-06-30 18:00:00', '2026-06-30 20:15:00',
   636000, 0, 636000, 'Tien_mat', 'Da_thanh_toan');

INSERT INTO CHI_TIET_HOA_DON
  (ma_hoa_don, ma_mon_an, so_luong, don_gia_tai_thoi_diem_goi, thanh_tien,
   trang_thai, thoi_gian_goi_mon, thoi_gian_hoan_thanh, nguon_goi_mon)
VALUES
  (1, 1, 2, 159000, 318000, 'Da_hoan_thanh', '2026-06-30 18:10:00', '2026-06-30 18:25:00', 'QR'),
  (1, 6, 1, 119000, 119000, 'Da_hoan_thanh', '2026-06-30 18:10:00', '2026-06-30 18:30:00', 'QR'),
  (1, 8, 1, 149000, 149000, 'Da_hoan_thanh', '2026-06-30 18:15:00', '2026-06-30 18:35:00', 'QR'),
  (1, 17,2, 20000,  40000,  'Da_hoan_thanh', '2026-06-30 18:10:00', '2026-06-30 18:12:00', 'QR');

-- Hóa đơn 2: bàn 1, đang phục vụ (có món chờ chế biến -> để test màn hình Bếp)
INSERT INTO HOA_DON
  (ma_hoa_don, ma_ban, thoi_gian_mo_ban, tong_tien_truoc_giam, tong_tien_thanh_toan, trang_thai)
VALUES
  (2, 1, '2026-07-02 12:00:00', 0, 0, 'Dang_phuc_vu');

INSERT INTO CHI_TIET_HOA_DON
  (ma_hoa_don, ma_mon_an, so_luong, don_gia_tai_thoi_diem_goi, thanh_tien,
   trang_thai, thoi_gian_goi_mon, nguon_goi_mon)
VALUES
  (2, 2, 2, 139000, 278000, 'Cho_che_bien',  '2026-07-02 12:05:00', 'QR'),
  (2, 5, 3, 99000,  297000, 'Cho_che_bien',  '2026-07-02 12:05:00', 'QR'),
  (2, 12,2, 39000,  78000,  'Dang_che_bien', '2026-07-02 12:06:00', 'Nhan_vien'),
  (2, 19,4, 25000,  100000, 'Da_hoan_thanh', '2026-07-02 12:05:00', 'QR');

-- ------------------------------------------------------------
-- DAT_BAN  (1 lượt đặt bàn trước mẫu)
-- ------------------------------------------------------------
INSERT INTO DAT_BAN
  (ma_dat_ban, ma_ban, ma_nhan_vien_tiep_nhan, ho_ten_khach, so_dien_thoai,
   so_luong_khach, thoi_gian_den, trang_thai, nguon_dat)
VALUES
  (1, 4, 2, 'Nguyễn Thị Hoa', '0912345678', 4, '2026-07-03 19:00:00', 'Da_xac_nhan', 'Website');

SELECT 'SEED DATA HOAN TAT' AS ket_qua;
