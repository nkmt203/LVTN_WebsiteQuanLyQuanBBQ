-- ============================================================
-- SEED DATA MẪU CHO QUÁN BBQ (dữ liệu nghiệp vụ, KHÔNG gồm
-- VAI_TRO/TAI_KHOAN — 2 bảng đó đã có sẵn khi tạo DB từ
-- db_quan_ly_bbq_v1.sql, không cần/không nên chạy lại ở đây)
--   • Chạy file này khi muốn có dữ liệu mẫu để test/demo
--   • Không chạy vẫn dùng được app bình thường (trống dữ liệu)
--   • Bộ rút gọn: 31 món ăn, 28 nguyên liệu — đủ dùng demo
-- ============================================================

USE db_quan_ly_bbq_v1;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE NHAT_KY_HAO_HUT;
TRUNCATE TABLE CHI_TIET_HOA_DON;
TRUNCATE TABLE HOA_DON;
TRUNCATE TABLE DAT_BAN;
TRUNCATE TABLE BAN;
TRUNCATE TABLE KHU_VUC;
TRUNCATE TABLE DINH_MUC_NGUYEN_LIEU;
TRUNCATE TABLE MON_AN;
TRUNCATE TABLE DANH_MUC;
TRUNCATE TABLE CHI_TIET_XUAT_KHO;
TRUNCATE TABLE PHIEU_XUAT_KHO;
TRUNCATE TABLE CHI_TIET_NHAP_KHO;
TRUNCATE TABLE PHIEU_NHAP_KHO;
TRUNCATE TABLE NHA_CUNG_CAP;
TRUNCATE TABLE KHO_NGUYEN_LIEU;
TRUNCATE TABLE NGUYEN_LIEU;
TRUNCATE TABLE DON_VI_TINH;
TRUNCATE TABLE NHAN_VIEN;


-- ============================================================
-- 1. NHAN_VIEN (ma_tai_khoan tham chiếu TAI_KHOAN đã seed sẵn ở file schema)
-- ============================================================
INSERT INTO NHAN_VIEN (ma_nhan_vien, ho_ten, so_dien_thoai, ma_vai_tro, ma_tai_khoan, trang_thai) VALUES
  (1, 'Nguyễn Văn An', '0901111111', 1, 1, 'Hoat_dong'),
  (2, 'Trần Thị Bình', '0902222222', 2, 2, 'Hoat_dong'),
  (3, 'Lê Văn Cường',  '0903333333', 2, 2, 'Hoat_dong'),
  (4, 'Phạm Thị Dung', '0904444444', 3, 3, 'Hoat_dong'),
  (5, 'Hoàng Văn Em',  '0905555555', 4, 4, 'Hoat_dong');

-- ============================================================
-- 2. DANH_MUC
-- ============================================================
INSERT INTO DANH_MUC (ma_danh_muc, ten_danh_muc, mo_ta, trang_thai) VALUES
  (1, 'Thịt nướng',      'Các loại thịt nướng BBQ',                'Dang_su_dung'),
  (2, 'Đồ uống',         'Nước ngọt, nước ép, nước suối',          'Dang_su_dung'),
  (3, 'Tráng miệng',     'Kem, trái cây',                          'Dang_su_dung'),
  (4, 'Hải sản nướng',   'Tôm, mực, bạch tuộc, cá',                'Dang_su_dung'),
  (5, 'Rau - Nấm',       'Các loại rau và nấm ăn kèm',             'Dang_su_dung'),
  (6, 'Món phụ',         'Cơm, mì, trứng, khoai',                  'Dang_su_dung'),
  (7, 'Lẩu',             'Các loại lẩu ăn kèm sau nướng',          'Dang_su_dung'),
  (8, 'Combo',           'Set ăn tiết kiệm cho nhóm khách',        'Dang_su_dung'),
  (9, 'Bia - Rượu',      'Bia lon, bia chai, rượu soju',           'Dang_su_dung');

-- ============================================================
-- 3. DON_VI_TINH
-- ============================================================
INSERT INTO DON_VI_TINH (ma_don_vi_tinh, ten_don_vi_tinh, trang_thai) VALUES
  (1, 'kg',    'Dang_dung'),
  (2, 'lon',   'Dang_dung'),
  (3, 'phần',  'Dang_dung'),
  (4, 'chai',  'Dang_dung'),
  (5, 'ly',    'Dang_dung'),
  (6, 'dĩa',   'Dang_dung'),
  (7, 'hộp',   'Dang_dung'),
  (8, 'cái',   'Dang_dung'),
  (9, 'gói',   'Dang_dung'),
  (10,'g',     'Dang_dung');

-- ============================================================
-- 4. NGUYEN_LIEU
-- ============================================================
INSERT INTO NGUYEN_LIEU (ma_nguyen_lieu, ten_nguyen_lieu, ma_don_vi_tinh, trang_thai) VALUES
  (1, 'Thịt ba chỉ bò', 1, 'Hoat_dong'),
  (2, 'Thịt ba chỉ heo', 1, 'Hoat_dong'),
  (3, 'Sườn non heo', 1, 'Hoat_dong'),
  (4, 'Đùi gà rút xương', 1, 'Hoat_dong'),
  (5, 'Tôm sú', 1, 'Hoat_dong'),
  (6, 'Mực ống', 1, 'Hoat_dong'),
  (7, 'Nấm kim châm', 1, 'Hoat_dong'),
  (8, 'Xà lách Mỹ', 1, 'Hoat_dong'),
  (9, 'Kim chi cải thảo', 1, 'Hoat_dong'),
  (10, 'Cơm trắng', 3, 'Hoat_dong'),
  (11, 'Bia Tiger lon', 2, 'Hoat_dong'),
  (12, 'Coca Cola lon', 2, 'Hoat_dong'),
  (13, 'Bia Heineken lon', 2, 'Hoat_dong'),
  (14, 'Kem vani', 3, 'Hoat_dong'),
  (15, 'Cánh gà', 1, 'Hoat_dong'),
  (16, 'Bạch tuộc baby', 1, 'Hoat_dong'),
  (17, 'Cá hồi phi lê', 1, 'Hoat_dong'),
  (18, 'Nấm đùi gà', 1, 'Hoat_dong'),
  (19, 'Hành tây', 1, 'Hoat_dong'),
  (20, 'Trứng gà', 8, 'Hoat_dong'),
  (21, 'Mì Hàn Quốc', 9, 'Hoat_dong'),
  (22, 'Pepsi lon', 2, 'Hoat_dong'),
  (23, 'Nước suối Lavie', 4, 'Hoat_dong'),
  (24, 'Kem sô cô la', 3, 'Hoat_dong'),
  (25, 'Thăn ngoại bò Mỹ', 1, 'Hoat_dong'),
  (26, 'Dẻ sườn bò', 1, 'Hoat_dong'),
  (27, 'Ba chỉ bò Úc', 1, 'Hoat_dong'),
  (28, 'Ức gà phi lê', 1, 'Hoat_dong');

-- ============================================================
-- 5. MON_AN
-- ============================================================
INSERT INTO MON_AN (ma_mon_an, ten_mon_an, ma_danh_muc, gia_ban, mo_ta, hinh_anh_url, trang_thai) VALUES
  (1, 'Ba chỉ bò Mỹ', 1, 159000, 'Thịt ba chỉ bò Mỹ ướp sốt BBQ', NULL, 'Dang_kinh_doanh'),
  (2, 'Ba chỉ heo Hàn', 1, 129000, 'Thịt ba chỉ heo tẩm ướp kiểu Hàn', NULL, 'Dang_kinh_doanh'),
  (3, 'Sườn non heo mật ong', 1, 179000, 'Sườn non ướp mật ong nướng than hoa', NULL, 'Dang_kinh_doanh'),
  (4, 'Đùi gà rút xương', 1, 119000, 'Đùi gà ướp sả ớt', NULL, 'Dang_kinh_doanh'),
  (5, 'Tôm sú nướng muối ớt', 4, 219000, 'Tôm sú tươi nướng muối ớt xanh', NULL, 'Dang_kinh_doanh'),
  (6, 'Mực ống nướng sa tế', 4, 169000, 'Mực ống tươi ướp sa tế', NULL, 'Dang_kinh_doanh'),
  (7, 'Nấm kim châm cuộn bò', 5, 129000, 'Nấm kim châm cuộn ba chỉ bò', NULL, 'Dang_kinh_doanh'),
  (8, 'Rau xà lách cuộn', 5, 39000, 'Xà lách Mỹ ăn kèm thịt nướng', NULL, 'Dang_kinh_doanh'),
  (9, 'Kim chi Hàn Quốc', 5, 49000, 'Kim chi cải thảo lên men chuẩn Hàn', NULL, 'Dang_kinh_doanh'),
  (10, 'Cơm trắng', 6, 15000, 'Chén cơm trắng', NULL, 'Dang_kinh_doanh'),
  (11, 'Lẩu kim chi', 7, 199000, 'Nước lẩu kim chi cho 2-3 người', NULL, 'Dang_kinh_doanh'),
  (12, 'Bia Tiger', 2, 25000, 'Bia lon 330ml', NULL, 'Dang_kinh_doanh'),
  (13, 'Coca Cola', 2, 20000, 'Coca lon 330ml', NULL, 'Dang_kinh_doanh'),
  (14, 'Bia Heineken', 9, 35000, 'Bia lon 330ml', NULL, 'Dang_kinh_doanh'),
  (15, 'Kem vani', 3, 35000, 'Kem vani 1 viên', NULL, 'Dang_kinh_doanh'),
  (16, 'Cánh gà BBQ', 1, 89000, 'Cánh gà sốt BBQ Hàn Quốc', NULL, 'Dang_kinh_doanh'),
  (17, 'Bạch tuộc nướng', 4, 189000, 'Bạch tuộc baby ướp gia vị Hàn', NULL, 'Dang_kinh_doanh'),
  (18, 'Cá hồi áp chảo', 4, 249000, 'Cá hồi Na Uy áp chảo bơ tỏi', NULL, 'Dang_kinh_doanh'),
  (19, 'Nấm đùi gà nướng bơ', 5, 69000, 'Nấm đùi gà bơ tỏi', NULL, 'Dang_kinh_doanh'),
  (20, 'Hành tây nướng', 5, 29000, 'Hành tây thái khoanh nướng ngọt', NULL, 'Dang_kinh_doanh'),
  (21, 'Trứng chiên phô mai', 6, 49000, 'Trứng gà chiên phô mai kiểu Hàn', NULL, 'Dang_kinh_doanh'),
  (22, 'Mì trộn Hàn Quốc', 6, 49000, 'Mì trộn tương đen Hàn Quốc', NULL, 'Dang_kinh_doanh'),
  (23, 'Pepsi', 2, 20000, 'Pepsi lon 330ml', NULL, 'Dang_kinh_doanh'),
  (24, 'Nước suối Lavie', 2, 15000, 'Chai 500ml', NULL, 'Dang_kinh_doanh'),
  (25, 'Kem sô cô la', 3, 35000, 'Kem sô cô la 1 viên', NULL, 'Dang_kinh_doanh'),
  (26, 'Thăn ngoại bò Mỹ', 1, 259000, 'Steak thăn ngoại bò Mỹ ướp tiêu', NULL, 'Dang_kinh_doanh'),
  (27, 'Dẻ sườn bò nướng', 1, 229000, 'Dẻ sườn bò sốt mật ong', NULL, 'Dang_kinh_doanh'),
  (28, 'Ba chỉ bò Úc', 1, 189000, 'Ba chỉ bò Úc thái lát dày', NULL, 'Dang_kinh_doanh'),
  (29, 'Ức gà nướng phô mai', 1, 99000, 'Ức gà phô mai kéo sợi', NULL, 'Dang_kinh_doanh'),
  (30, 'Lẩu Tomyum hải sản', 7, 259000, 'Nước lẩu Tomyum cho 2-3 người', NULL, 'Dang_kinh_doanh'),
  (31, 'Cơm chiên kim chi', 6, 69000, 'Cơm chiên kim chi trứng ốp la', NULL, 'Dang_kinh_doanh');

-- ============================================================
-- 6. KHO_NGUYEN_LIEU
-- ============================================================
INSERT INTO KHO_NGUYEN_LIEU (ma_kho, ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton) VALUES
  (1, 1, 15.5, 5.0, 'Con_hang'),
  (2, 2, 12.0, 5.0, 'Con_hang'),
  (3, 3, 22.0, 8.0, 'Con_hang'),
  (4, 4, 11.0, 4.0, 'Con_hang'),
  (5, 5, 15.0, 5.0, 'Con_hang'),
  (6, 6, 9.5, 4.0, 'Con_hang'),
  (7, 7, 10.5, 3.0, 'Con_hang'),
  (8, 8, 12.0, 3.0, 'Con_hang'),
  (9, 9, 14.0, 5.0, 'Con_hang'),
  (10, 10, 150.0, 50.0, 'Con_hang'),
  (11, 11, 96.0, 24.0, 'Con_hang'),
  (12, 12, 60.0, 24.0, 'Con_hang'),
  (13, 13, 96.0, 24.0, 'Con_hang'),
  (14, 14, 8.0, 3.0, 'Con_hang'),
  (15, 15, 19.75, 6.0, 'Con_hang'),
  (16, 16, 7.5, 3.0, 'Con_hang'),
  (17, 17, 6.0, 3.0, 'Con_hang'),
  (18, 18, 8.14, 3.0, 'Con_hang'),
  (19, 19, 20.0, 5.0, 'Con_hang'),
  (20, 20, 113.0, 30.0, 'Con_hang'),
  (21, 21, 80.0, 20.0, 'Con_hang'),
  (22, 22, 180.0, 40.0, 'Con_hang'),
  (23, 23, 72.0, 20.0, 'Con_hang'),
  (24, 24, 5.5, 2.0, 'Con_hang'),
  (25, 25, 12.0, 5.0, 'Con_hang'),
  (26, 26, 10.25, 4.0, 'Con_hang'),
  (27, 27, 18.3, 5.0, 'Con_hang'),
  (28, 28, 14.5, 5.0, 'Con_hang');

-- ============================================================
-- 7. NHA_CUNG_CAP
-- ============================================================
INSERT INTO NHA_CUNG_CAP (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi, trang_thai) VALUES
  (1, 'Công ty TNHH Thực phẩm Hoàng Long', '0281234567', '123 Nguyễn Huệ, Q.1, TP.HCM',              'Hoat_dong'),
  (2, 'Nhà phân phối Bia rượu Sài Gòn',    '0287654321', '45 Lê Lợi, Q.1, TP.HCM',                   'Hoat_dong'),
  (3, 'Công ty CP Hải sản Bình Điền',      '0283456789', 'Chợ đầu mối Bình Điền, Q.8, TP.HCM',       'Hoat_dong'),
  (4, 'HTX Rau sạch Đà Lạt',               '0263111222', '112 Trần Phú, Đà Lạt, Lâm Đồng',           'Hoat_dong');

-- ============================================================
-- 8. PHIEU_NHAP_KHO
-- ============================================================
INSERT INTO PHIEU_NHAP_KHO (ma_phieu_nhap, ma_nha_cung_cap, ma_nhan_vien_lap, ngay_nhap, tong_tien, ghi_chu) VALUES
  (1, 1, 1, '2026-07-10 08:00:00', 5260000, 'Nhập thịt tuần'),
  (2, 3, 1, '2026-07-11 07:30:00', 4640000, 'Nhập hải sản đầu tuần'),
  (3, 4, 1, '2026-07-12 06:45:00', 1990000, 'Nhập rau + món phụ'),
  (4, 2, 1, '2026-07-13 09:00:00', 5736000, 'Nhập bia, nước ngọt'),
  (5, 1, 1, '2026-07-16 08:00:00',11510000, 'Nhập bổ sung thực đơn mở rộng'),
  (6, 1, 1, '2026-07-18 08:00:00',14365000, 'Nhập bổ sung món chính mới');

-- ============================================================
-- 9. CHI_TIET_NHAP_KHO
-- ============================================================
INSERT INTO CHI_TIET_NHAP_KHO (ma_phieu_nhap, ma_nguyen_lieu, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES
  (1, 1, 10.000, 350000, 3500000),
  (1, 2,  8.000, 220000, 1760000),
  (2, 5, 10.000, 320000, 3200000),
  (2, 6,  8.000, 180000, 1440000),
  (3, 7,  5.000,  90000,  450000),
  (3, 8, 10.000,  40000,  400000),
  (3, 9, 12.000,  95000, 1140000),
  (4, 11, 96.000, 18000, 1728000),
  (4, 12, 60.000, 10000,  600000),
  (4, 13, 96.000, 18000, 1728000),
  (4, 3,  10.000,168000, 1680000),
  (5, 15, 10.000,130000, 1300000),
  (5, 16,  8.000,220000, 1760000),
  (5, 17,  6.000,480000, 2880000),
  (5, 18,  8.000,100000,  800000),
  (5, 19, 15.000, 25000,  375000),
  (5, 20,100.000,  3500,  350000),
  (5, 21, 15.000, 35000,  525000),
  (5, 22,120.000, 10000, 1200000),
  (5, 23, 80.000,  8000,  640000),
  (5, 24, 10.000,168000, 1680000),
  (6, 25, 10.000,520000, 5200000),
  (6, 26,  8.000,210000, 1680000),
  (6, 27, 15.000,380000, 5700000),
  (6, 28, 15.000,119000, 1785000);

-- ============================================================
-- 10. PHIEU_XUAT_KHO
-- ============================================================
INSERT INTO PHIEU_XUAT_KHO (ma_phieu_xuat, ma_nhan_vien_lap, ngay_xuat, ly_do_xuat, ghi_chu) VALUES
  (1, 4, '2026-07-15 09:00:00', 'Hu_hong', 'Kiểm kê phát hiện hao hụt'),
  (2, 4, '2026-07-20 09:00:00', 'Dieu_chinh', 'Điều chỉnh chênh lệch kiểm kê');

-- ============================================================
-- 11. CHI_TIET_XUAT_KHO
-- ============================================================
INSERT INTO CHI_TIET_XUAT_KHO (ma_phieu_xuat, ma_nguyen_lieu, so_luong_xuat, ghi_chu) VALUES
  (1, 5, 0.800, 'Tôm rã đá quá lâu không kịp bán'),
  (1, 9, 1.200, 'Kim chi quá hạn sử dụng'),
  (2, 1, 0.500, 'Thịt bò dùng thử cho nhân viên mới');

-- ============================================================
-- 12. DINH_MUC_NGUYEN_LIEU
-- ============================================================
INSERT INTO DINH_MUC_NGUYEN_LIEU (ma_mon_an, ma_nguyen_lieu, so_luong_su_dung, trang_thai) VALUES
  (1, 1, 0.2, 'Hoat_dong'),
  (2, 2, 0.2, 'Hoat_dong'),
  (3, 3, 0.25, 'Hoat_dong'),
  (4, 4, 0.22, 'Hoat_dong'),
  (5, 5, 0.2, 'Hoat_dong'),
  (6, 6, 0.2, 'Hoat_dong'),
  (7, 7, 0.15, 'Hoat_dong'),
  (7, 1, 0.1, 'Hoat_dong'),
  (8, 8, 0.15, 'Hoat_dong'),
  (9, 9, 0.15, 'Hoat_dong'),
  (10, 10, 1.0, 'Hoat_dong'),
  (11, 9, 0.2, 'Hoat_dong'),
  (12, 11, 1.0, 'Hoat_dong'),
  (13, 12, 1.0, 'Hoat_dong'),
  (14, 13, 1.0, 'Hoat_dong'),
  (15, 14, 1.0, 'Hoat_dong'),
  (16, 15, 0.25, 'Hoat_dong'),
  (17, 16, 0.2, 'Hoat_dong'),
  (18, 17, 0.2, 'Hoat_dong'),
  (19, 18, 0.18, 'Hoat_dong'),
  (20, 19, 0.15, 'Hoat_dong'),
  (21, 20, 2.0, 'Hoat_dong'),
  (22, 21, 1.0, 'Hoat_dong'),
  (23, 22, 1.0, 'Hoat_dong'),
  (24, 23, 1.0, 'Hoat_dong'),
  (25, 24, 1.0, 'Hoat_dong'),
  (26, 25, 0.22, 'Hoat_dong'),
  (27, 26, 0.25, 'Hoat_dong'),
  (28, 27, 0.2, 'Hoat_dong'),
  (29, 28, 0.2, 'Hoat_dong'),
  (30, 5, 0.15, 'Hoat_dong'),
  (30, 6, 0.1, 'Hoat_dong'),
  (31, 10, 1.0, 'Hoat_dong'),
  (31, 9, 0.1, 'Hoat_dong'),
  (31, 20, 1.0, 'Hoat_dong');

-- ============================================================
-- 13. KHU_VUC
-- ============================================================
INSERT INTO KHU_VUC (ma_khu_vuc, ten_khu_vuc, mo_ta, trang_thai) VALUES
  (1, 'Tầng trệt',   'Khu vực chính trong nhà',                        'Dang_dung'),
  (2, 'Sân vườn',    'Khu vực ngoài trời',                             'Dang_dung'),
  (3, 'Tầng 2',      'Không gian máy lạnh dành cho nhóm khách đông',   'Dang_dung'),
  (4, 'Phòng VIP',   'Phòng riêng, có karaoke, phục vụ nhóm 8-15 khách','Dang_dung'),
  (5, 'Ban công',    'Khu vực ban công tầng 2 view đường phố',         'Dang_dung');

-- ============================================================
-- 14. BAN
-- ============================================================
INSERT INTO BAN (ma_ban, ten_ban, ma_khu_vuc, so_ghe, qr_code_dinh_danh, trang_thai) VALUES
  (1,  'Bàn 01', 1, 4,  'QR-T1-B01', 'Trong'),
  (2,  'Bàn 02', 1, 4,  'QR-T1-B02', 'Trong'),
  (3,  'Bàn 03', 1, 6,  'QR-T1-B03', 'Trong'),
  (4,  'Bàn 04', 2, 4,  'QR-SV-B01', 'Trong'),
  (5,  'Bàn 05', 2, 6,  'QR-SV-B02', 'Trong'),
  (6,  'Bàn 06', 2, 8,  'QR-SV-B03', 'Trong'),
  (7,  'Bàn 07', 1, 4,  'QR-T1-B04', 'Trong'),
  (8,  'Bàn 08', 1, 4,  'QR-T1-B05', 'Dang_su_dung'),
  (9,  'Bàn 09', 1, 6,  'QR-T1-B06', 'Trong'),
  (10, 'Bàn 10', 1, 6,  'QR-T1-B07', 'Trong'),
  (11, 'Bàn 11', 2, 4,  'QR-SV-B04', 'Dang_su_dung'),
  (12, 'Bàn 12', 2, 8,  'QR-SV-B05', 'Trong'),
  (13, 'Bàn 13', 2, 8,  'QR-SV-B06', 'Trong'),
  (14, 'Bàn 14', 3, 4,  'QR-T2-B01', 'Trong'),
  (15, 'Bàn 15', 3, 4,  'QR-T2-B02', 'Trong'),
  (16, 'Bàn 16', 3, 6,  'QR-T2-B03', 'Dang_su_dung'),
  (17, 'Bàn 17', 3, 6,  'QR-T2-B04', 'Trong'),
  (18, 'Bàn 18', 3, 8,  'QR-T2-B05', 'Trong'),
  (19, 'Bàn 19', 3, 8,  'QR-T2-B06', 'Trong'),
  (20, 'VIP 01', 4, 10, 'QR-VIP-01', 'Trong'),
  (21, 'VIP 02', 4, 12, 'QR-VIP-02', 'Trong'),
  (22, 'VIP 03', 4, 15, 'QR-VIP-03', 'Trong'),
  (23, 'BC 01',  5, 4,  'QR-BC-01',  'Trong'),
  (24, 'BC 02',  5, 4,  'QR-BC-02',  'Dang_su_dung'),
  (25, 'BC 03',  5, 6,  'QR-BC-03',  'Trong');

-- ============================================================
-- 15. HOA_DON (lịch sử đã thanh toán, 14 ngày gần nhất)
-- ============================================================
INSERT INTO HOA_DON (ma_hoa_don, ma_ban, ma_dat_ban, ma_nhan_vien_thu_ngan,
                     thoi_gian_mo_ban, thoi_gian_dong_ban,
                     tong_tien_truoc_giam, tien_giam_gia, tong_tien_thanh_toan,
                     hinh_thuc_thanh_toan, trang_thai) VALUES
  (1, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '20:00' HOUR_MINUTE), 820000, 0, 820000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (2, 1, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '15:45' HOUR_MINUTE), 704000, 0, 704000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (3, 9, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), 386000, 0, 386000, 'Tien_mat', 'Da_thanh_toan'),
  (4, 8, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), 573000, 0, 573000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (5, 22, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:15' HOUR_MINUTE), 1115000, 0, 1115000, 'Tien_mat', 'Da_thanh_toan'),
  (6, 5, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:15' HOUR_MINUTE), 804000, 0, 804000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (7, 25, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '14:00' HOUR_MINUTE), 366000, 0, 366000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (8, 1, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:30' HOUR_MINUTE), 771000, 0, 771000, 'Tien_mat', 'Da_thanh_toan'),
  (9, 22, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '14:00' HOUR_MINUTE), 765000, 0, 765000, 'Tien_mat', 'Da_thanh_toan'),
  (10, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:15' HOUR_MINUTE), 1003000, 0, 1003000, 'Tien_mat', 'Da_thanh_toan'),
  (11, 24, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), 257000, 0, 257000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (12, 18, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:15' HOUR_MINUTE), 456000, 0, 456000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (13, 9, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '22:45' HOUR_MINUTE), 785000, 0, 785000, 'Tien_mat', 'Da_thanh_toan'),
  (14, 11, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), 55000, 0, 55000, 'Tien_mat', 'Da_thanh_toan'),
  (15, 9, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '14:45' HOUR_MINUTE), 595000, 0, 595000, 'Tien_mat', 'Da_thanh_toan'),
  (16, 15, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '19:30' HOUR_MINUTE), 144000, 0, 144000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (17, 8, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:00' HOUR_MINUTE), 1282000, 0, 1282000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (18, 20, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '21:30' HOUR_MINUTE), 347000, 0, 347000, 'Tien_mat', 'Da_thanh_toan'),
  (19, 3, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '22:00' HOUR_MINUTE), 1005000, 0, 1005000, 'Tien_mat', 'Da_thanh_toan'),
  (20, 14, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), 1272000, 0, 1272000, 'Tien_mat', 'Da_thanh_toan'),
  (21, 23, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '16:45' HOUR_MINUTE), 806000, 0, 806000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (22, 11, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '20:45' HOUR_MINUTE), 1211000, 0, 1211000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (23, 7, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '16:15' HOUR_MINUTE), 1045000, 0, 1045000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (24, 8, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '18:00' HOUR_MINUTE), 436000, 0, 436000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (25, 9, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:30' HOUR_MINUTE), 1143000, 0, 1143000, 'Tien_mat', 'Da_thanh_toan'),
  (26, 6, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '20:00' HOUR_MINUTE), 654000, 0, 654000, 'Tien_mat', 'Da_thanh_toan'),
  (27, 23, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '14:30' HOUR_MINUTE), 1430000, 0, 1430000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (28, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '14:30' HOUR_MINUTE), 1503000, 0, 1503000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (29, 6, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '21:30' HOUR_MINUTE), 298000, 0, 298000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (30, 22, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '21:00' HOUR_MINUTE), 352000, 0, 352000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (31, 3, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '16:15' HOUR_MINUTE), 1144000, 0, 1144000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (32, 10, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '21:45' HOUR_MINUTE), 219000, 0, 219000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (33, 17, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '16:45' HOUR_MINUTE), 65000, 0, 65000, 'Tien_mat', 'Da_thanh_toan'),
  (34, 23, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '21:45' HOUR_MINUTE), 1332000, 0, 1332000, 'Tien_mat', 'Da_thanh_toan'),
  (35, 7, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), 1089000, 0, 1089000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (36, 3, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '22:00' HOUR_MINUTE), 485000, 0, 485000, 'Tien_mat', 'Da_thanh_toan'),
  (37, 14, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:30' HOUR_MINUTE), 506000, 0, 506000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (38, 11, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '16:15' HOUR_MINUTE), 248000, 0, 248000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (39, 6, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '14:00' HOUR_MINUTE), 964000, 0, 964000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (40, 20, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '22:00' HOUR_MINUTE), 1453000, 0, 1453000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (41, 24, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), 901000, 0, 901000, 'Tien_mat', 'Da_thanh_toan'),
  (42, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:45' HOUR_MINUTE), 874000, 0, 874000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (43, 25, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '21:15' HOUR_MINUTE), 93000, 0, 93000, 'Tien_mat', 'Da_thanh_toan'),
  (44, 10, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '13:00' HOUR_MINUTE), 119000, 0, 119000, 'Tien_mat', 'Da_thanh_toan'),
  (45, 9, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '16:30' HOUR_MINUTE), 792000, 0, 792000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (46, 10, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '15:30' HOUR_MINUTE), 219000, 0, 219000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (47, 8, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:45' HOUR_MINUTE), 885000, 0, 885000, 'Tien_mat', 'Da_thanh_toan'),
  (48, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '20:00' HOUR_MINUTE), 109000, 0, 109000, 'Tien_mat', 'Da_thanh_toan'),
  (49, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:15' HOUR_MINUTE), 957000, 0, 957000, 'Tien_mat', 'Da_thanh_toan'),
  (50, 18, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '15:00' HOUR_MINUTE), 388000, 0, 388000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (51, 25, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '19:00' HOUR_MINUTE), 943000, 0, 943000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (52, 24, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '19:30' HOUR_MINUTE), 603000, 0, 603000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (53, 19, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '17:00' HOUR_MINUTE), 456000, 0, 456000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (54, 10, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:30' HOUR_MINUTE), 535000, 0, 535000, 'Tien_mat', 'Da_thanh_toan'),
  (55, 15, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '16:30' HOUR_MINUTE), 165000, 0, 165000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (56, 4, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '21:45' HOUR_MINUTE), 785000, 0, 785000, 'Tien_mat', 'Da_thanh_toan'),
  (57, 18, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '15:00' HOUR_MINUTE), 405000, 0, 405000, 'Tien_mat', 'Da_thanh_toan'),
  (58, 14, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '15:45' HOUR_MINUTE), 806000, 0, 806000, 'Tien_mat', 'Da_thanh_toan'),
  (59, 3, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '19:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '21:30' HOUR_MINUTE), 75000, 0, 75000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (60, 11, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '20:30' HOUR_MINUTE), 138000, 0, 138000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (61, 18, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '19:45' HOUR_MINUTE), 1741000, 0, 1741000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (62, 25, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '15:00' HOUR_MINUTE), 1423000, 0, 1423000, 'Chuyen_khoan', 'Da_thanh_toan'),
  (63, 13, NULL, 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '12:00' HOUR_MINUTE), 196000, 0, 196000, 'Tien_mat', 'Da_thanh_toan');

-- ============================================================
-- 16. CHI_TIET_HOA_DON
-- ============================================================
INSERT INTO CHI_TIET_HOA_DON (ma_chi_tiet_hd, ma_hoa_don, ma_mon_an, so_luong,
                              don_gia_tai_thoi_diem_goi, thanh_tien, trang_thai, ma_nv_xac_nhan,
                              thoi_gian_goi_mon, thoi_gian_xac_nhan, thoi_gian_hoan_thanh, nguon_goi_mon) VALUES
  (1, 1, 14, 1, 35000, 35000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:22' HOUR_MINUTE), 'QR'),
  (2, 1, 2, 1, 129000, 129000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:32' HOUR_MINUTE), 'QR'),
  (3, 1, 1, 3, 159000, 477000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:37' HOUR_MINUTE), 'QR'),
  (4, 1, 3, 1, 179000, 179000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '19:29' HOUR_MINUTE), 'QR'),
  (5, 2, 9, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '14:03' HOUR_MINUTE), 'QR'),
  (6, 2, 5, 1, 219000, 219000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '14:11' HOUR_MINUTE), 'Nhan_vien'),
  (7, 2, 7, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '14:08' HOUR_MINUTE), 'Nhan_vien'),
  (8, 3, 10, 2, 15000, 30000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:33' HOUR_MINUTE), 'QR'),
  (9, 3, 27, 1, 229000, 229000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:16' HOUR_MINUTE), 'Nhan_vien'),
  (10, 3, 21, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:17' HOUR_MINUTE), 'Nhan_vien'),
  (11, 3, 20, 1, 29000, 29000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '17:27' HOUR_MINUTE), 'QR'),
  (12, 4, 9, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:32' HOUR_MINUTE), 'Nhan_vien'),
  (13, 4, 23, 1, 20000, 20000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:47' HOUR_MINUTE), 'Nhan_vien'),
  (14, 4, 30, 1, 259000, 259000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:44' HOUR_MINUTE), 'QR'),
  (15, 4, 22, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '16:52' HOUR_MINUTE), 'QR'),
  (16, 5, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:38' HOUR_MINUTE), 'QR'),
  (17, 5, 11, 3, 199000, 597000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '11:52' HOUR_MINUTE), 'QR'),
  (18, 6, 5, 3, 219000, 657000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:47' HOUR_MINUTE), 'QR'),
  (19, 6, 8, 3, 39000, 117000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:43' HOUR_MINUTE), 'Nhan_vien'),
  (20, 6, 24, 2, 15000, 30000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '18:41' HOUR_MINUTE), 'QR'),
  (21, 7, 5, 1, 219000, 219000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:40' HOUR_MINUTE), 'Nhan_vien'),
  (22, 7, 21, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 14 DAY), INTERVAL '12:17' HOUR_MINUTE), 'QR'),
  (23, 8, 6, 3, 169000, 507000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:08' HOUR_MINUTE), 'QR'),
  (24, 8, 15, 3, 35000, 105000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:09' HOUR_MINUTE), 'QR'),
  (25, 8, 1, 1, 159000, 159000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:05' HOUR_MINUTE), 'QR'),
  (26, 9, 11, 2, 199000, 398000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:40' HOUR_MINUTE), 'QR'),
  (27, 9, 16, 1, 89000, 89000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:22' HOUR_MINUTE), 'Nhan_vien'),
  (28, 9, 1, 1, 159000, 159000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:17' HOUR_MINUTE), 'Nhan_vien'),
  (29, 9, 4, 1, 119000, 119000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '13:39' HOUR_MINUTE), 'QR'),
  (30, 10, 17, 2, 189000, 378000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:36' HOUR_MINUTE), 'Nhan_vien'),
  (31, 10, 28, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:52' HOUR_MINUTE), 'QR'),
  (32, 10, 20, 2, 29000, 58000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '18:42' HOUR_MINUTE), 'Nhan_vien'),
  (33, 11, 8, 2, 39000, 78000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:00' HOUR_MINUTE), 'QR'),
  (34, 11, 3, 1, 179000, 179000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:18' HOUR_MINUTE), 'QR'),
  (35, 12, 29, 2, 99000, 198000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:32' HOUR_MINUTE), 'QR'),
  (36, 12, 2, 2, 129000, 258000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:51' HOUR_MINUTE), 'QR'),
  (37, 13, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '21:06' HOUR_MINUTE), 'QR'),
  (38, 13, 16, 3, 89000, 267000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '21:13' HOUR_MINUTE), 'QR'),
  (39, 14, 13, 2, 20000, 40000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:40' HOUR_MINUTE), 'Nhan_vien'),
  (40, 14, 24, 1, 15000, 15000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 13 DAY), INTERVAL '11:21' HOUR_MINUTE), 'QR'),
  (41, 15, 4, 1, 119000, 119000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '13:02' HOUR_MINUTE), 'Nhan_vien'),
  (42, 15, 2, 1, 129000, 129000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '13:05' HOUR_MINUTE), 'QR'),
  (43, 15, 21, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '13:06' HOUR_MINUTE), 'Nhan_vien'),
  (44, 15, 18, 1, 249000, 249000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '13:05' HOUR_MINUTE), 'QR'),
  (45, 16, 23, 3, 20000, 60000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '19:06' HOUR_MINUTE), 'Nhan_vien'),
  (46, 16, 31, 1, 69000, 69000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:51' HOUR_MINUTE), 'QR'),
  (47, 16, 24, 1, 15000, 15000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '19:03' HOUR_MINUTE), 'Nhan_vien'),
  (48, 17, 16, 3, 89000, 267000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:20' HOUR_MINUTE), 'QR'),
  (49, 17, 17, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:17' HOUR_MINUTE), 'Nhan_vien'),
  (50, 17, 30, 1, 259000, 259000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:34' HOUR_MINUTE), 'QR'),
  (51, 17, 28, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL '11:27' HOUR_MINUTE), 'QR'),
  (52, 18, 7, 2, 129000, 258000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:52' HOUR_MINUTE), 'QR'),
  (53, 18, 22, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '21:06' HOUR_MINUTE), 'Nhan_vien'),
  (54, 18, 23, 2, 20000, 40000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:55' HOUR_MINUTE), 'Nhan_vien'),
  (55, 19, 18, 3, 249000, 747000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:23' HOUR_MINUTE), 'QR'),
  (56, 19, 7, 2, 129000, 258000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '20:17' HOUR_MINUTE), 'Nhan_vien'),
  (57, 20, 26, 3, 259000, 777000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '19:02' HOUR_MINUTE), 'QR'),
  (58, 20, 21, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:48' HOUR_MINUTE), 'Nhan_vien'),
  (59, 20, 17, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:53' HOUR_MINUTE), 'QR'),
  (60, 20, 1, 1, 159000, 159000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 11 DAY), INTERVAL '19:08' HOUR_MINUTE), 'QR'),
  (61, 21, 29, 1, 99000, 99000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '16:02' HOUR_MINUTE), 'Nhan_vien'),
  (62, 21, 30, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '16:01' HOUR_MINUTE), 'QR'),
  (63, 21, 28, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '16:20' HOUR_MINUTE), 'Nhan_vien'),
  (64, 22, 1, 3, 159000, 477000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '20:04' HOUR_MINUTE), 'QR'),
  (65, 22, 4, 2, 119000, 238000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '20:18' HOUR_MINUTE), 'QR'),
  (66, 22, 3, 2, 179000, 358000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '20:04' HOUR_MINUTE), 'QR'),
  (67, 22, 31, 2, 69000, 138000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '20:25' HOUR_MINUTE), 'Nhan_vien'),
  (68, 23, 4, 2, 119000, 238000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:49' HOUR_MINUTE), 'Nhan_vien'),
  (69, 23, 12, 1, 25000, 25000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:35' HOUR_MINUTE), 'Nhan_vien'),
  (70, 23, 25, 1, 35000, 35000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:43' HOUR_MINUTE), 'QR'),
  (71, 23, 18, 3, 249000, 747000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL '14:40' HOUR_MINUTE), 'Nhan_vien'),
  (72, 24, 8, 2, 39000, 78000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:26' HOUR_MINUTE), 'QR'),
  (73, 24, 7, 1, 129000, 129000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:22' HOUR_MINUTE), 'QR'),
  (74, 24, 27, 1, 229000, 229000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '17:27' HOUR_MINUTE), 'QR'),
  (75, 25, 17, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:55' HOUR_MINUTE), 'Nhan_vien'),
  (76, 25, 13, 1, 20000, 20000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:53' HOUR_MINUTE), 'QR'),
  (77, 25, 22, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:46' HOUR_MINUTE), 'QR'),
  (78, 25, 27, 2, 229000, 458000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '15:56' HOUR_MINUTE), 'Nhan_vien'),
  (79, 26, 29, 2, 99000, 198000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:16' HOUR_MINUTE), 'Nhan_vien'),
  (80, 26, 19, 1, 69000, 69000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:31' HOUR_MINUTE), 'Nhan_vien'),
  (81, 26, 7, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '19:36' HOUR_MINUTE), 'Nhan_vien'),
  (82, 27, 11, 3, 199000, 597000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:54' HOUR_MINUTE), 'QR'),
  (83, 27, 22, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:58' HOUR_MINUTE), 'QR'),
  (84, 27, 28, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:54' HOUR_MINUTE), 'QR'),
  (85, 27, 4, 1, 119000, 119000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:58' HOUR_MINUTE), 'Nhan_vien'),
  (86, 28, 18, 2, 249000, 498000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:54' HOUR_MINUTE), 'QR'),
  (87, 28, 27, 3, 229000, 687000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '14:04' HOUR_MINUTE), 'Nhan_vien'),
  (88, 28, 1, 2, 159000, 318000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL '13:59' HOUR_MINUTE), 'QR'),
  (89, 29, 27, 1, 229000, 229000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '21:06' HOUR_MINUTE), 'QR'),
  (90, 29, 31, 1, 69000, 69000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:49' HOUR_MINUTE), 'QR'),
  (91, 30, 14, 3, 35000, 105000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:21' HOUR_MINUTE), 'Nhan_vien'),
  (92, 30, 29, 2, 99000, 198000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:30' HOUR_MINUTE), 'QR'),
  (93, 30, 21, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:35' HOUR_MINUTE), 'Nhan_vien'),
  (94, 31, 17, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:33' HOUR_MINUTE), 'QR'),
  (95, 31, 15, 2, 35000, 70000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:51' HOUR_MINUTE), 'QR'),
  (96, 31, 2, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:49' HOUR_MINUTE), 'QR'),
  (97, 31, 18, 2, 249000, 498000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '14:49' HOUR_MINUTE), 'Nhan_vien'),
  (98, 32, 24, 2, 15000, 30000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:14' HOUR_MINUTE), 'QR'),
  (99, 32, 28, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '20:20' HOUR_MINUTE), 'QR'),
  (100, 33, 23, 1, 20000, 20000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '16:08' HOUR_MINUTE), 'QR'),
  (101, 33, 10, 3, 15000, 45000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '15:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY), INTERVAL '16:02' HOUR_MINUTE), 'QR'),
  (102, 34, 2, 2, 129000, 258000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:12' HOUR_MINUTE), 'Nhan_vien'),
  (103, 34, 7, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:22' HOUR_MINUTE), 'QR'),
  (104, 34, 27, 3, 229000, 687000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '19:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:12' HOUR_MINUTE), 'QR'),
  (105, 35, 24, 1, 15000, 15000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:15' HOUR_MINUTE), 'QR'),
  (106, 35, 18, 2, 249000, 498000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:15' HOUR_MINUTE), 'QR'),
  (107, 35, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:21' HOUR_MINUTE), 'Nhan_vien'),
  (108, 35, 20, 2, 29000, 58000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:23' HOUR_MINUTE), 'QR'),
  (109, 36, 19, 1, 69000, 69000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:35' HOUR_MINUTE), 'QR'),
  (110, 36, 22, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:20' HOUR_MINUTE), 'QR'),
  (111, 36, 1, 2, 159000, 318000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '20:25' HOUR_MINUTE), 'QR'),
  (112, 37, 9, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:45' HOUR_MINUTE), 'Nhan_vien'),
  (113, 37, 27, 1, 229000, 229000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:56' HOUR_MINUTE), 'QR'),
  (114, 37, 3, 1, 179000, 179000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '17:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '18:09' HOUR_MINUTE), 'Nhan_vien'),
  (115, 38, 20, 1, 29000, 29000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:34' HOUR_MINUTE), 'QR'),
  (116, 38, 5, 1, 219000, 219000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL '14:48' HOUR_MINUTE), 'Nhan_vien'),
  (117, 39, 19, 2, 69000, 138000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:27' HOUR_MINUTE), 'Nhan_vien'),
  (118, 39, 22, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:17' HOUR_MINUTE), 'QR'),
  (119, 39, 30, 3, 259000, 777000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '12:22' HOUR_MINUTE), 'QR'),
  (120, 40, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:36' HOUR_MINUTE), 'QR'),
  (121, 40, 2, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:35' HOUR_MINUTE), 'QR'),
  (122, 40, 12, 2, 25000, 50000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:30' HOUR_MINUTE), 'QR'),
  (123, 40, 18, 2, 249000, 498000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '20:35' HOUR_MINUTE), 'Nhan_vien'),
  (124, 41, 17, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:55' HOUR_MINUTE), 'Nhan_vien'),
  (125, 41, 31, 2, 69000, 138000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:44' HOUR_MINUTE), 'QR'),
  (126, 41, 21, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:48' HOUR_MINUTE), 'QR'),
  (127, 41, 9, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '17:32' HOUR_MINUTE), 'QR'),
  (128, 42, 1, 2, 159000, 318000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:05' HOUR_MINUTE), 'QR'),
  (129, 42, 16, 2, 89000, 178000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:25' HOUR_MINUTE), 'QR'),
  (130, 42, 28, 2, 189000, 378000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:19' HOUR_MINUTE), 'Nhan_vien'),
  (131, 43, 8, 2, 39000, 78000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:45' HOUR_MINUTE), 'QR'),
  (132, 43, 24, 1, 15000, 15000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '19:52' HOUR_MINUTE), 'QR'),
  (133, 44, 8, 1, 39000, 39000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:24' HOUR_MINUTE), 'Nhan_vien'),
  (134, 44, 13, 2, 20000, 40000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:30' HOUR_MINUTE), 'QR'),
  (135, 44, 23, 2, 20000, 40000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL '11:28' HOUR_MINUTE), 'Nhan_vien'),
  (136, 45, 24, 3, 15000, 45000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:50' HOUR_MINUTE), 'QR'),
  (137, 45, 18, 3, 249000, 747000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '15:00' HOUR_MINUTE), 'QR'),
  (138, 46, 12, 2, 25000, 50000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:45' HOUR_MINUTE), 'Nhan_vien'),
  (139, 46, 6, 1, 169000, 169000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:53' HOUR_MINUTE), 'QR'),
  (140, 47, 28, 3, 189000, 567000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:09' HOUR_MINUTE), 'QR'),
  (141, 47, 1, 2, 159000, 318000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '14:10' HOUR_MINUTE), 'QR'),
  (142, 48, 13, 1, 20000, 20000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:33' HOUR_MINUTE), 'Nhan_vien'),
  (143, 48, 16, 1, 89000, 89000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL '18:19' HOUR_MINUTE), 'QR'),
  (144, 49, 13, 3, 20000, 60000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:43' HOUR_MINUTE), 'QR'),
  (145, 49, 15, 3, 35000, 105000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:31' HOUR_MINUTE), 'Nhan_vien'),
  (146, 49, 30, 3, 259000, 777000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:33' HOUR_MINUTE), 'Nhan_vien'),
  (147, 49, 10, 1, 15000, 15000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:15' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '17:50' HOUR_MINUTE), 'QR'),
  (148, 50, 1, 2, 159000, 318000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:37' HOUR_MINUTE), 'QR'),
  (149, 50, 14, 2, 35000, 70000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '13:16' HOUR_MINUTE), 'QR'),
  (150, 51, 8, 3, 39000, 117000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:33' HOUR_MINUTE), 'Nhan_vien'),
  (151, 51, 30, 1, 259000, 259000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:28' HOUR_MINUTE), 'QR'),
  (152, 51, 9, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:35' HOUR_MINUTE), 'QR'),
  (153, 51, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL '18:19' HOUR_MINUTE), 'QR'),
  (154, 52, 13, 3, 20000, 60000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '19:00' HOUR_MINUTE), 'QR'),
  (155, 52, 31, 3, 69000, 207000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:46' HOUR_MINUTE), 'Nhan_vien'),
  (156, 52, 9, 3, 49000, 147000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:55' HOUR_MINUTE), 'Nhan_vien'),
  (157, 52, 17, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:47' HOUR_MINUTE), 'QR'),
  (158, 53, 16, 3, 89000, 267000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:29' HOUR_MINUTE), 'Nhan_vien'),
  (159, 53, 17, 1, 189000, 189000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:33' HOUR_MINUTE), 'QR'),
  (160, 54, 11, 1, 199000, 199000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:55' HOUR_MINUTE), 'QR'),
  (161, 54, 22, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:54' HOUR_MINUTE), 'Nhan_vien'),
  (162, 54, 4, 2, 119000, 238000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '19:09' HOUR_MINUTE), 'QR'),
  (163, 55, 25, 3, 35000, 105000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:45' HOUR_MINUTE), 'Nhan_vien'),
  (164, 55, 13, 3, 20000, 60000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '15:59' HOUR_MINUTE), 'QR'),
  (165, 56, 15, 2, 35000, 70000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '21:17' HOUR_MINUTE), 'QR'),
  (166, 56, 25, 2, 35000, 70000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '21:14' HOUR_MINUTE), 'Nhan_vien'),
  (167, 56, 2, 2, 129000, 258000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '21:03' HOUR_MINUTE), 'QR'),
  (168, 56, 7, 3, 129000, 387000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '20:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL '21:19' HOUR_MINUTE), 'Nhan_vien'),
  (169, 57, 31, 1, 69000, 69000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:30' HOUR_MINUTE), 'Nhan_vien'),
  (170, 57, 4, 2, 119000, 238000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:31' HOUR_MINUTE), 'Nhan_vien'),
  (171, 57, 21, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:30' HOUR_MINUTE), 'Nhan_vien'),
  (172, 58, 30, 3, 259000, 777000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:23' HOUR_MINUTE), 'Nhan_vien'),
  (173, 58, 20, 1, 29000, 29000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '13:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '14:08' HOUR_MINUTE), 'Nhan_vien'),
  (174, 59, 10, 2, 15000, 30000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '19:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '19:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '20:03' HOUR_MINUTE), 'QR'),
  (175, 59, 24, 3, 15000, 45000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '19:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '19:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL '20:00' HOUR_MINUTE), 'Nhan_vien'),
  (176, 60, 23, 3, 20000, 60000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:57' HOUR_MINUTE), 'QR'),
  (177, 60, 8, 2, 39000, 78000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:30' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:46' HOUR_MINUTE), 'QR'),
  (178, 61, 26, 2, 259000, 518000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:01' HOUR_MINUTE), 'QR'),
  (179, 61, 27, 3, 229000, 687000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:10' HOUR_MINUTE), 'Nhan_vien'),
  (180, 61, 21, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:03' HOUR_MINUTE), 'QR'),
  (181, 61, 5, 2, 219000, 438000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '17:45' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '18:00' HOUR_MINUTE), 'Nhan_vien'),
  (182, 62, 26, 3, 259000, 777000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:37' HOUR_MINUTE), 'QR'),
  (183, 62, 9, 1, 49000, 49000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:25' HOUR_MINUTE), 'Nhan_vien'),
  (184, 62, 11, 3, 199000, 597000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:27' HOUR_MINUTE), 'Nhan_vien'),
  (185, 63, 21, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:22' HOUR_MINUTE), 'Nhan_vien'),
  (186, 63, 22, 2, 49000, 98000, 'Da_hoan_thanh', 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:00' HOUR_MINUTE), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '11:18' HOUR_MINUTE), 'Nhan_vien');

-- ============================================================
-- 17. NHAT_KY_HAO_HUT
-- ============================================================
INSERT INTO NHAT_KY_HAO_HUT (ma_nhat_ky, ma_chi_tiet_hd, ma_nguyen_lieu, so_luong_hao_hut,
                             loai_hao_hut, ly_do, ma_nv_lam_sai, ma_nv_phe_duyet) VALUES
  (1, NULL, 5, 0.500, 'Kho_thieu', 'Tôm để ngoài nhiệt độ quá lâu',       4, 1),
  (2, NULL, 9, 0.800, 'Kho_thieu', 'Kim chi quá hạn sử dụng',             4, 1),
  (3, NULL, 1, 0.300, 'Kho_thieu', 'Thịt bò dùng thử cho nhân viên mới',  4, 1);

-- ============================================================
-- Reset AUTO_INCREMENT
-- ============================================================
ALTER TABLE NHAN_VIEN            AUTO_INCREMENT = 6;
ALTER TABLE DANH_MUC             AUTO_INCREMENT = 10;
ALTER TABLE DON_VI_TINH          AUTO_INCREMENT = 11;
ALTER TABLE NGUYEN_LIEU          AUTO_INCREMENT = 29;
ALTER TABLE MON_AN               AUTO_INCREMENT = 32;
ALTER TABLE KHO_NGUYEN_LIEU      AUTO_INCREMENT = 29;
ALTER TABLE NHA_CUNG_CAP         AUTO_INCREMENT = 5;
ALTER TABLE PHIEU_NHAP_KHO       AUTO_INCREMENT = 7;
ALTER TABLE PHIEU_XUAT_KHO       AUTO_INCREMENT = 3;
ALTER TABLE KHU_VUC              AUTO_INCREMENT = 6;
ALTER TABLE BAN                  AUTO_INCREMENT = 26;
ALTER TABLE DAT_BAN              AUTO_INCREMENT = 1;
ALTER TABLE HOA_DON              AUTO_INCREMENT = 64;
ALTER TABLE CHI_TIET_HOA_DON     AUTO_INCREMENT = 187;
ALTER TABLE NHAT_KY_HAO_HUT      AUTO_INCREMENT = 4;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Seed data mẫu (31 món, 28 nguyên liệu) đã nạp xong (VAI_TRO/TAI_KHOAN dùng bản có sẵn từ file schema).' AS thong_bao;

