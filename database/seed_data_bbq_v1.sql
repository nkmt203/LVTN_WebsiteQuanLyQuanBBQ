-- ============================================================
-- SEED DATA ĐẦY ĐỦ QUÁN BBQ (GỘP 1 FILE DUY NHẤT)
--   • Mật khẩu tất cả tài khoản: 1
--   • Chạy 1 file này là đủ, không cần file cũ
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
TRUNCATE TABLE TAI_KHOAN;
TRUNCATE TABLE VAI_TRO;

-- ============================================================
-- 1. VAI_TRO
-- ============================================================
INSERT INTO VAI_TRO (ma_vai_tro, ten_vai_tro, mo_ta) VALUES
  (1, 'Admin',    'Quản trị viên hệ thống'),
  (2, 'Phuc_vu',  'Nhân viên phục vụ'),
  (3, 'Bep',      'Nhân viên bếp'),
  (4, 'Thu_ngan', 'Nhân viên thu ngân');

-- ============================================================
-- 2. TAI_KHOAN (mật khẩu = 1)
-- ============================================================
INSERT INTO TAI_KHOAN (ma_tai_khoan, ten_dang_nhap, mat_khau_hash, ma_vai_tro, trang_thai) VALUES
  (1, 'admin',    '$2b$10$2ulY06A2C2ndKV/seEZio.UnsCNTkpAtyvr4BSPjQ.necyhy7ubpm', 1, 'Hoat_dong'),
  (2, 'phucvu',   '$2b$10$2ulY06A2C2ndKV/seEZio.UnsCNTkpAtyvr4BSPjQ.necyhy7ubpm', 2, 'Hoat_dong'),
  (3, 'bep',      '$2b$10$2ulY06A2C2ndKV/seEZio.UnsCNTkpAtyvr4BSPjQ.necyhy7ubpm', 3, 'Hoat_dong'),
  (4, 'thungan',  '$2b$10$2ulY06A2C2ndKV/seEZio.UnsCNTkpAtyvr4BSPjQ.necyhy7ubpm', 4, 'Hoat_dong');

-- ============================================================
-- 3. NHAN_VIEN
-- ============================================================
INSERT INTO NHAN_VIEN (ma_nhan_vien, ho_ten, so_dien_thoai, ma_vai_tro, ma_tai_khoan, trang_thai) VALUES
  (1, 'Nguyễn Văn An', '0901111111', 1, 1, 'Hoat_dong'),
  (2, 'Trần Thị Bình', '0902222222', 2, 2, 'Hoat_dong'),
  (3, 'Lê Văn Cường',  '0903333333', 2, 2, 'Hoat_dong'),
  (4, 'Phạm Thị Dung', '0904444444', 3, 3, 'Hoat_dong'),
  (5, 'Hoàng Văn Em',  '0905555555', 4, 4, 'Hoat_dong');

-- ============================================================
-- 4. DANH_MUC
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
-- 6. DON_VI_TINH
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
-- 7. NGUYEN_LIEU
-- ============================================================
INSERT INTO NGUYEN_LIEU (ma_nguyen_lieu, ten_nguyen_lieu, ma_don_vi_tinh, trang_thai) VALUES
  (1,  'Thịt ba chỉ bò',       1, 'Hoat_dong'),
  (2,  'Thịt ba chỉ heo',      1, 'Hoat_dong'),
  (3,  'Bia Tiger lon',        2, 'Hoat_dong'),
  (4,  'Coca Cola lon',        2, 'Hoat_dong'),
  (5,  'Kem vani',             3, 'Hoat_dong'),
  -- Thịt bò
  (6,  'Ba chỉ bò Úc',         1, 'Hoat_dong'),
  (7,  'Thăn ngoại bò Mỹ',     1, 'Hoat_dong'),
  (8,  'Dẻ sườn bò',           1, 'Hoat_dong'),
  (9,  'Lưỡi bò',              1, 'Hoat_dong'),
  -- Thịt heo
  (10, 'Sườn non heo',         1, 'Hoat_dong'),
  (11, 'Nạc vai heo',          1, 'Hoat_dong'),
  (12, 'Ba rọi heo xông khói', 1, 'Hoat_dong'),
  -- Thịt gà
  (13, 'Ức gà phi lê',         1, 'Hoat_dong'),
  (14, 'Đùi gà rút xương',     1, 'Hoat_dong'),
  (15, 'Cánh gà',              1, 'Hoat_dong'),
  -- Hải sản
  (16, 'Tôm sú',               1, 'Hoat_dong'),
  (17, 'Mực ống',              1, 'Hoat_dong'),
  (18, 'Bạch tuộc baby',       1, 'Hoat_dong'),
  (19, 'Cá hồi phi lê',        1, 'Hoat_dong'),
  (20, 'Sò điệp',              1, 'Hoat_dong'),
  -- Rau, nấm
  (21, 'Nấm kim châm',         1, 'Hoat_dong'),
  (22, 'Nấm đùi gà',           1, 'Hoat_dong'),
  (23, 'Nấm hương tươi',       1, 'Hoat_dong'),
  (24, 'Xà lách Mỹ',           1, 'Hoat_dong'),
  (25, 'Bắp cải thảo',         1, 'Hoat_dong'),
  (26, 'Kim chi cải thảo',     1, 'Hoat_dong'),
  (27, 'Hành tây',             1, 'Hoat_dong'),
  (28, 'Ớt chuông',            1, 'Hoat_dong'),
  (29, 'Bí ngòi',              1, 'Hoat_dong'),
  (30, 'Đậu bắp',              1, 'Hoat_dong'),
  (31, 'Khoai lang mật',       1, 'Hoat_dong'),
  (32, 'Bắp Mỹ',               8, 'Hoat_dong'),
  -- Món phụ
  (33, 'Trứng gà',             8, 'Hoat_dong'),
  (34, 'Cơm trắng',            3, 'Hoat_dong'),
  (35, 'Mì Hàn Quốc',          9, 'Hoat_dong'),
  -- Đồ uống
  (36, 'Bia Heineken lon',     2, 'Hoat_dong'),
  (37, 'Bia Sài Gòn lon',      2, 'Hoat_dong'),
  (38, 'Pepsi lon',            2, 'Hoat_dong'),
  (39, 'Nước suối Lavie',      4, 'Hoat_dong'),
  (40, 'Soju Hàn Quốc',        4, 'Hoat_dong'),
  (41, 'Cam tươi',             1, 'Hoat_dong'),
  (42, 'Syrup đào',            4, 'Hoat_dong'),
  -- Tráng miệng, sốt
  (43, 'Kem sô cô la',         3, 'Hoat_dong'),
  (44, 'Kem dâu',              3, 'Hoat_dong'),
  (45, 'Sốt BBQ Hàn Quốc',     7, 'Hoat_dong');

-- ============================================================
-- 5. MON_AN
-- ============================================================
INSERT INTO MON_AN (ma_mon_an, ten_mon_an, ma_danh_muc, gia_ban, mo_ta, hinh_anh_url, trang_thai) VALUES
  (1,  'Ba chỉ bò Mỹ',            1, 159000, 'Thịt ba chỉ bò Mỹ ướp sốt BBQ',            NULL, 'Dang_kinh_doanh'),
  (2,  'Ba chỉ heo Hàn',          1, 129000, 'Thịt ba chỉ heo tẩm ướp kiểu Hàn',         NULL, 'Dang_kinh_doanh'),
  (3,  'Sườn non nướng',          1, 189000, 'Sườn non ướp mật ong',                     NULL, 'Dang_kinh_doanh'),
  (4,  'Bia Tiger',               2,  25000, 'Bia lon 330ml',                            NULL, 'Dang_kinh_doanh'),
  (5,  'Coca Cola',               2,  20000, 'Coca lon 330ml',                           NULL, 'Dang_kinh_doanh'),
  (6,  'Nước cam ép',             2,  30000, 'Cam tươi vắt',                             NULL, 'Dang_kinh_doanh'),
  (7,  'Kem vani',                3,  35000, 'Kem vani 1 viên',                          NULL, 'Dang_kinh_doanh'),
  (8,  'Trà đào',                 2,  25000, 'Trà đào cam sả',                           NULL, 'Tam_ngung'),
  -- Thịt bò
  (9,  'Ba chỉ bò Úc',            1, 189000, 'Ba chỉ bò Úc thái lát dày',                NULL, 'Dang_kinh_doanh'),
  (10, 'Thăn ngoại bò Mỹ',        1, 259000, 'Steak thăn ngoại bò Mỹ ướp tiêu',          NULL, 'Dang_kinh_doanh'),
  (11, 'Dẻ sườn bò nướng',        1, 229000, 'Dẻ sườn bò sốt mật ong',                   NULL, 'Dang_kinh_doanh'),
  (12, 'Lưỡi bò nướng muối',      1, 199000, 'Lưỡi bò thái mỏng nướng muối tiêu chanh',  NULL, 'Dang_kinh_doanh'),
  -- Thịt heo
  (13, 'Sườn non heo mật ong',    1, 179000, 'Sườn non ướp mật ong nướng than hoa',      NULL, 'Dang_kinh_doanh'),
  (14, 'Ba rọi heo xông khói',    1, 139000, 'Ba rọi xông khói thái lát',                NULL, 'Dang_kinh_doanh'),
  -- Thịt gà
  (15, 'Ức gà nướng phô mai',     1,  99000, 'Ức gà phô mai kéo sợi',                    NULL, 'Dang_kinh_doanh'),
  (16, 'Đùi gà rút xương',        1, 119000, 'Đùi gà ướp sả ớt',                         NULL, 'Dang_kinh_doanh'),
  (17, 'Cánh gà BBQ',             1,  89000, 'Cánh gà sốt BBQ Hàn Quốc',                 NULL, 'Dang_kinh_doanh'),
  -- Hải sản
  (18, 'Tôm sú nướng muối ớt',    4, 219000, 'Tôm sú tươi nướng muối ớt xanh',           NULL, 'Dang_kinh_doanh'),
  (19, 'Mực ống nướng sa tế',     4, 169000, 'Mực ống tươi ướp sa tế',                   NULL, 'Dang_kinh_doanh'),
  (20, 'Bạch tuộc nướng',         4, 189000, 'Bạch tuộc baby ướp gia vị Hàn',            NULL, 'Dang_kinh_doanh'),
  (21, 'Cá hồi áp chảo',          4, 249000, 'Cá hồi Na Uy áp chảo bơ tỏi',              NULL, 'Dang_kinh_doanh'),
  (22, 'Sò điệp nướng phô mai',   4, 199000, 'Sò điệp phô mai mozzarella',               NULL, 'Dang_kinh_doanh'),
  -- Rau nấm
  (23, 'Nấm kim châm cuộn bò',    5, 129000, 'Nấm kim châm cuộn ba chỉ bò',              NULL, 'Dang_kinh_doanh'),
  (24, 'Nấm đùi gà nướng bơ',     5,  69000, 'Nấm đùi gà bơ tỏi',                        NULL, 'Dang_kinh_doanh'),
  (25, 'Nấm hương nướng',         5,  59000, 'Nấm hương tươi nướng nguyên tai',          NULL, 'Dang_kinh_doanh'),
  (26, 'Rau xà lách cuộn',        5,  39000, 'Xà lách Mỹ ăn kèm thịt nướng',             NULL, 'Dang_kinh_doanh'),
  (27, 'Kim chi Hàn Quốc',        5,  49000, 'Kim chi cải thảo lên men chuẩn Hàn',       NULL, 'Dang_kinh_doanh'),
  (28, 'Hành tây nướng',          5,  29000, 'Hành tây thái khoanh nướng ngọt',          NULL, 'Dang_kinh_doanh'),
  (29, 'Ớt chuông nướng',         5,  35000, 'Ớt chuông 3 màu nướng',                    NULL, 'Dang_kinh_doanh'),
  (30, 'Bí ngòi nướng',           5,  35000, 'Bí ngòi thái khoanh nướng',                NULL, 'Dang_kinh_doanh'),
  (31, 'Đậu bắp nướng',           5,  35000, 'Đậu bắp nướng nguyên trái',                NULL, 'Dang_kinh_doanh'),
  (32, 'Khoai lang mật nướng',    5,  45000, 'Khoai lang mật nướng than',                NULL, 'Dang_kinh_doanh'),
  (33, 'Bắp Mỹ nướng bơ',         5,  35000, 'Bắp Mỹ nướng bơ tỏi',                      NULL, 'Dang_kinh_doanh'),
  -- Món phụ
  (34, 'Trứng chiên phô mai',     6,  49000, 'Trứng gà chiên phô mai kiểu Hàn',          NULL, 'Dang_kinh_doanh'),
  (35, 'Cơm trắng',               6,  15000, 'Chén cơm trắng',                           NULL, 'Dang_kinh_doanh'),
  (36, 'Mì trộn Hàn Quốc',        6,  49000, 'Mì trộn tương đen Hàn Quốc',               NULL, 'Dang_kinh_doanh'),
  (37, 'Cơm chiên kim chi',       6,  69000, 'Cơm chiên kim chi trứng ốp la',            NULL, 'Dang_kinh_doanh'),
  -- Lẩu
  (38, 'Lẩu kim chi',             7, 199000, 'Nước lẩu kim chi cho 2-3 người',           NULL, 'Dang_kinh_doanh'),
  (39, 'Lẩu Tomyum hải sản',      7, 259000, 'Nước lẩu Tomyum cho 2-3 người',            NULL, 'Dang_kinh_doanh'),
  -- Đồ uống
  (40, 'Bia Heineken',            9,  35000, 'Bia lon 330ml',                            NULL, 'Dang_kinh_doanh'),
  (41, 'Bia Sài Gòn',             9,  22000, 'Bia lon 330ml',                            NULL, 'Dang_kinh_doanh'),
  (42, 'Pepsi',                   2,  20000, 'Pepsi lon 330ml',                          NULL, 'Dang_kinh_doanh'),
  (43, 'Nước suối Lavie',         2,  15000, 'Chai 500ml',                               NULL, 'Dang_kinh_doanh'),
  (44, 'Soju Jinro',              9,  99000, 'Soju Hàn Quốc chai 360ml vị nguyên bản',   NULL, 'Dang_kinh_doanh'),
  (45, 'Soju vị đào',             9, 109000, 'Soju Hàn Quốc vị đào chai 360ml',          NULL, 'Dang_kinh_doanh'),
  (46, 'Trà đào cam sả',          2,  35000, 'Trà đào cam sả ly lớn',                    NULL, 'Dang_kinh_doanh'),
  -- Tráng miệng
  (47, 'Kem sô cô la',            3,  35000, 'Kem sô cô la 1 viên',                      NULL, 'Dang_kinh_doanh'),
  (48, 'Kem dâu',                 3,  35000, 'Kem dâu tây 1 viên',                       NULL, 'Dang_kinh_doanh'),
  (49, 'Trái cây thập cẩm',       3,  59000, 'Dĩa trái cây tươi theo mùa',               NULL, 'Dang_kinh_doanh'),
  -- Combo
  (50, 'Combo 2 người - Đôi bạn', 8, 399000, 'Ba chỉ bò + ba chỉ heo + rau + 2 bia',     NULL, 'Dang_kinh_doanh'),
  (51, 'Combo 4 người - Gia đình',8, 799000, 'Bò + heo + gà + hải sản + rau + 4 nước',   NULL, 'Dang_kinh_doanh'),
  (52, 'Combo hải sản',           8, 599000, 'Tôm + mực + cá hồi + rau nấm',             NULL, 'Dang_kinh_doanh'),
  (53, 'Combo sinh nhật 6 người', 8,1199000, 'Set nướng thịnh soạn cho 6 người + bánh',  NULL, 'Dang_kinh_doanh'),
  -- Món tạm ngưng
  (54, 'Bò Wagyu A5',             1, 899000, 'Wagyu A5 Nhật Bản - tạm ngưng nhập',       NULL, 'Tam_ngung'),
  (55, 'Cá saba nướng',           4, 149000, 'Đang thử món mới',                         NULL, 'Tam_ngung');

-- ============================================================
-- 8. KHO_NGUYEN_LIEU
-- ============================================================
INSERT INTO KHO_NGUYEN_LIEU (ma_kho, ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton) VALUES
  (1,  1,  15.500, 5.000,  'Con_hang'),
  (2,  2,  12.000, 5.000,  'Con_hang'),
  (3,  3,  48.000, 20.000, 'Con_hang'),
  (4,  4,  36.000, 20.000, 'Con_hang'),
  (5,  5,   8.000, 3.000,  'Con_hang'),
  (6,  6,  18.500, 5.000,  'Con_hang'),
  (7,  7,  12.000, 4.000,  'Con_hang'),
  (8,  8,  10.500, 4.000,  'Con_hang'),
  (9,  9,   4.500, 3.000,  'Sap_het'),
  (10, 10, 22.000, 8.000,  'Con_hang'),
  (11, 11, 16.000, 6.000,  'Con_hang'),
  (12, 12,  9.000, 4.000,  'Con_hang'),
  (13, 13, 14.500, 5.000,  'Con_hang'),
  (14, 14, 11.000, 4.000,  'Con_hang'),
  (15, 15, 20.000, 6.000,  'Con_hang'),
  (16, 16, 15.000, 5.000,  'Con_hang'),
  (17, 17,  9.500, 4.000,  'Con_hang'),
  (18, 18,  7.500, 3.000,  'Con_hang'),
  (19, 19,  6.000, 3.000,  'Con_hang'),
  (20, 20,  2.500, 3.000,  'Sap_het'),
  (21, 21, 10.500, 3.000,  'Con_hang'),
  (22, 22,  8.500, 3.000,  'Con_hang'),
  (23, 23,  6.000, 2.000,  'Con_hang'),
  (24, 24, 12.000, 3.000,  'Con_hang'),
  (25, 25,  9.000, 3.000,  'Con_hang'),
  (26, 26, 14.000, 5.000,  'Con_hang'),
  (27, 27, 20.000, 5.000,  'Con_hang'),
  (28, 28,  8.000, 3.000,  'Con_hang'),
  (29, 29,  7.500, 3.000,  'Con_hang'),
  (30, 30,  6.500, 2.000,  'Con_hang'),
  (31, 31, 12.000, 4.000,  'Con_hang'),
  (32, 32, 45.000,15.000,  'Con_hang'),
  (33, 33,120.000,30.000,  'Con_hang'),
  (34, 34,150.000,50.000,  'Con_hang'),
  (35, 35, 80.000,20.000,  'Con_hang'),
  (36, 36, 96.000,24.000,  'Con_hang'),
  (37, 37,144.000,36.000,  'Con_hang'),
  (38, 38, 60.000,24.000,  'Con_hang'),
  (39, 39, 72.000,24.000,  'Con_hang'),
  (40, 40, 24.000, 6.000,  'Con_hang'),
  (41, 41, 18.000, 5.000,  'Con_hang'),
  (42, 42, 12.000, 3.000,  'Con_hang'),
  (43, 43,  5.500, 2.000,  'Con_hang'),
  (44, 44,  4.500, 2.000,  'Con_hang'),
  (45, 45,  8.500, 3.000,  'Con_hang');

-- ============================================================
-- 9. NHA_CUNG_CAP
-- ============================================================
INSERT INTO NHA_CUNG_CAP (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi, trang_thai) VALUES
  (1, 'Công ty TNHH Thực phẩm Hoàng Long', '0281234567', '123 Nguyễn Huệ, Q.1, TP.HCM',              'Hoat_dong'),
  (2, 'Nhà phân phối Bia rượu Sài Gòn',    '0287654321', '45 Lê Lợi, Q.1, TP.HCM',                   'Hoat_dong'),
  (3, 'Công ty CP Hải sản Bình Điền',      '0283456789', 'Chợ đầu mối Bình Điền, Q.8, TP.HCM',       'Hoat_dong'),
  (4, 'HTX Rau sạch Đà Lạt',               '0263111222', '112 Trần Phú, Đà Lạt, Lâm Đồng',           'Hoat_dong'),
  (5, 'Công ty TNHH Suntory PepsiCo VN',   '0287778888', '812 Tạ Quang Bửu, Q.8, TP.HCM',            'Hoat_dong'),
  (6, 'Cửa hàng thực phẩm Hàn Kim Chi',    '0289990001', '55 Phạm Văn Hai, Q. Tân Bình, TP.HCM',     'Hoat_dong'),
  (7, 'Nhà cung cấp Gà sạch Ba Huân',      '0281230456', '789 Trường Chinh, Q. Tân Phú, TP.HCM',     'Hoat_dong');

-- ============================================================
-- 10. PHIEU_NHAP_KHO
-- ============================================================
INSERT INTO PHIEU_NHAP_KHO (ma_phieu_nhap, ma_nha_cung_cap, ma_nhan_vien_lap, ngay_nhap, tong_tien, ghi_chu) VALUES
  (1, 1, 1, '2026-07-10 08:00:00',  6100000, 'Nhập thịt tuần'),
  (2, 3, 1, '2026-07-11 07:30:00',  9420000, 'Nhập hải sản đầu tuần'),
  (3, 4, 1, '2026-07-12 06:45:00',  3150000, 'Nhập rau nấm hằng ngày'),
  (4, 2, 1, '2026-07-13 09:00:00',  7920000, 'Nhập bia'),
  (5, 5, 1, '2026-07-13 10:30:00',  2700000, 'Nhập nước ngọt, nước suối'),
  (6, 7, 1, '2026-07-14 07:00:00',  4650000, 'Nhập gà'),
  (7, 6, 1, '2026-07-14 14:00:00',  1750000, 'Nhập kim chi và sốt Hàn'),
  (8, 1, 1, '2026-07-17 08:00:00', 12600000, 'Nhập thịt bò cuối tuần');

-- ============================================================
-- 11. CHI_TIET_NHAP_KHO
-- ============================================================
INSERT INTO CHI_TIET_NHAP_KHO (ma_phieu_nhap, ma_nguyen_lieu, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES
  -- Phiếu 1 - thịt tuần
  (1, 1, 10.000, 350000, 3500000),
  (1, 2,  8.000, 220000, 1760000),
  (1, 5,  5.000, 168000,  840000),
  -- Phiếu 2 - hải sản
  (2, 16, 10.000, 320000, 3200000),
  (2, 17,  8.000, 180000, 1440000),
  (2, 18,  5.000, 220000, 1100000),
  (2, 19,  4.000, 480000, 1920000),
  (2, 20,  3.000, 586667, 1760000),
  -- Phiếu 3 - rau nấm
  (3, 21,  8.000,  90000,  720000),
  (3, 22,  6.000, 100000,  600000),
  (3, 23,  4.000, 120000,  480000),
  (3, 24, 10.000,  40000,  400000),
  (3, 27, 15.000,  25000,  375000),
  (3, 29,  5.000,  35000,  175000),
  (3, 31, 10.000,  40000,  400000),
  -- Phiếu 4 - bia
  (4, 36, 96.000,  18000, 1728000),
  (4, 37,144.000,  12000, 1728000),
  (4, 40, 24.000, 150000, 3600000),
  (4, 44,  4.000, 216000,  864000),
  -- Phiếu 5 - nước ngọt
  (5, 38, 60.000,  10000,  600000),
  (5, 39, 72.000,   8000,  576000),
  (5, 41, 15.000,  30000,  450000),
  (5, 42,  6.000, 179000, 1074000),
  -- Phiếu 6 - gà
  (6, 13, 12.000, 130000, 1560000),
  (6, 14,  9.000, 145000, 1305000),
  (6, 15, 15.000, 119000, 1785000),
  -- Phiếu 7 - kim chi + sốt
  (7, 26, 12.000,  95000, 1140000),
  (7, 45,  5.000, 122000,  610000),
  -- Phiếu 8 - thịt bò
  (8,  6, 15.000, 380000, 5700000),
  (8,  7, 10.000, 520000, 5200000),
  (8,  8,  8.000, 210000, 1680000);

-- ============================================================
-- 12. PHIEU_XUAT_KHO
-- ============================================================
INSERT INTO PHIEU_XUAT_KHO (ma_phieu_xuat, ma_nhan_vien_lap, ngay_xuat, ly_do_xuat, ghi_chu) VALUES
  (1, 4, '2026-07-12 15:30:00', 'Hu_hong',    'Thịt bò hết hạn phải bỏ'),
  (2, 4, '2026-07-14 22:00:00', 'Hu_hong',    'Hải sản đông đá bị chảy nước trong ca chiều'),
  (3, 4, '2026-07-15 20:00:00', 'Dieu_chinh', 'Kiểm kê rau nấm cuối ca'),
  (4, 4, '2026-07-16 23:30:00', 'Hu_hong',    'Kim chi hết hạn sử dụng'),
  (5, 4, '2026-07-18 09:00:00', 'Khac',       'Dùng làm mẫu training nhân viên mới');

-- ============================================================
-- 13. CHI_TIET_XUAT_KHO
-- ============================================================
INSERT INTO CHI_TIET_XUAT_KHO (ma_phieu_xuat, ma_nguyen_lieu, so_luong_xuat, ghi_chu) VALUES
  (1, 1, 0.500, 'Miếng bò để lâu ngoài nhiệt độ'),
  (2, 16, 0.800, 'Tôm rã đá quá lâu'),
  (2, 19, 0.300, 'Cá hồi bị chảy nước'),
  (3, 24, 0.500, 'Xà lách héo'),
  (3, 21, 0.400, 'Nấm kim châm ướt'),
  (4, 26, 1.200, 'Kim chi quá hạn'),
  (5,  6, 0.300, 'Miếng bò để training kỹ thuật thái');

-- ============================================================
-- 14. DINH_MUC_NGUYEN_LIEU
-- ============================================================
INSERT INTO DINH_MUC_NGUYEN_LIEU (ma_mon_an, ma_nguyen_lieu, so_luong_su_dung, trang_thai) VALUES
  (1, 1, 0.200, 'Hoat_dong'),
  (2, 2, 0.200, 'Hoat_dong'),
  (4, 3, 1.000, 'Hoat_dong'),
  (5, 4, 1.000, 'Hoat_dong'),
  (7, 5, 1.000, 'Hoat_dong'),
  (9,  6,  0.200, 'Hoat_dong'),
  (10, 7,  0.220, 'Hoat_dong'),
  (11, 8,  0.250, 'Hoat_dong'),
  (12, 9,  0.180, 'Hoat_dong'),
  (13, 10, 0.250, 'Hoat_dong'),
  (14, 12, 0.200, 'Hoat_dong'),
  (15, 13, 0.200, 'Hoat_dong'),
  (16, 14, 0.220, 'Hoat_dong'),
  (17, 15, 0.250, 'Hoat_dong'),
  (18, 16, 0.250, 'Hoat_dong'),
  (19, 17, 0.200, 'Hoat_dong'),
  (20, 18, 0.200, 'Hoat_dong'),
  (21, 19, 0.180, 'Hoat_dong'),
  (22, 20, 0.180, 'Hoat_dong'),
  (23, 21, 0.150, 'Hoat_dong'),
  (23,  1, 0.100, 'Hoat_dong'),
  (24, 22, 0.180, 'Hoat_dong'),
  (25, 23, 0.150, 'Hoat_dong'),
  (26, 24, 0.150, 'Hoat_dong'),
  (27, 26, 0.150, 'Hoat_dong'),
  (28, 27, 0.150, 'Hoat_dong'),
  (29, 28, 0.120, 'Hoat_dong'),
  (30, 29, 0.150, 'Hoat_dong'),
  (31, 30, 0.150, 'Hoat_dong'),
  (32, 31, 0.200, 'Hoat_dong'),
  (33, 32, 1.000, 'Hoat_dong'),
  (34, 33, 2.000, 'Hoat_dong'),
  (35, 34, 1.000, 'Hoat_dong'),
  (36, 35, 1.000, 'Hoat_dong'),
  (37, 34, 1.000, 'Hoat_dong'),
  (37, 26, 0.100, 'Hoat_dong'),
  (37, 33, 1.000, 'Hoat_dong'),
  (38, 26, 0.200, 'Hoat_dong'),
  (39, 16, 0.150, 'Hoat_dong'),
  (39, 17, 0.100, 'Hoat_dong'),
  (40, 36, 1.000, 'Hoat_dong'),
  (41, 37, 1.000, 'Hoat_dong'),
  (42, 38, 1.000, 'Hoat_dong'),
  (43, 39, 1.000, 'Hoat_dong'),
  (44, 40, 1.000, 'Hoat_dong'),
  (45, 40, 1.000, 'Hoat_dong'),
  (45, 42, 0.030, 'Hoat_dong'),
  (46, 41, 0.150, 'Hoat_dong'),
  (46, 42, 0.030, 'Hoat_dong'),
  (47, 43, 1.000, 'Hoat_dong'),
  (48, 44, 1.000, 'Hoat_dong');

-- ============================================================
-- 15. KHU_VUC
-- ============================================================
INSERT INTO KHU_VUC (ma_khu_vuc, ten_khu_vuc, mo_ta, trang_thai) VALUES
  (1, 'Tầng trệt',   'Khu vực chính trong nhà',                        'Dang_dung'),
  (2, 'Sân vườn',    'Khu vực ngoài trời',                             'Dang_dung'),
  (3, 'Tầng 2',      'Không gian máy lạnh dành cho nhóm khách đông',   'Dang_dung'),
  (4, 'Phòng VIP',   'Phòng riêng, có karaoke, phục vụ nhóm 8-15 khách','Dang_dung'),
  (5, 'Ban công',    'Khu vực ban công tầng 2 view đường phố',         'Dang_dung');

-- ============================================================
-- 16. BAN
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
-- 17. DAT_BAN — không seed, nghiệp vụ đặt bàn trước chưa triển khai
--     (dự kiến ở hướng phát triển tiếp theo), bảng để trống
-- ============================================================

-- ============================================================
-- 18. HOA_DON  — không seed, để tự tạo qua giao diện phục vụ
-- 19. CHI_TIET_HOA_DON  — không seed
-- ============================================================

-- ============================================================
-- 20. NHAT_KY_HAO_HUT
-- ============================================================
INSERT INTO NHAT_KY_HAO_HUT (ma_nhat_ky, ma_chi_tiet_hd, ma_nguyen_lieu, so_luong_hao_hut,
                             loai_hao_hut, ly_do, ma_nv_lam_sai, ma_nv_phe_duyet) VALUES
  (1, NULL,  1, 0.500, 'Kho_thieu', 'Thịt để ngoài nhiệt độ quá lâu',         4, 1),
  (2, NULL, 16, 0.800, 'Kho_thieu', 'Tôm rã đá quá lâu không kịp bán',        4, 1),
  (3, NULL, 19, 0.300, 'Kho_thieu', 'Cá hồi bị chảy nước do tủ đông hỏng',    4, 1),
  (4, NULL, 24, 0.500, 'Kho_thieu', 'Xà lách héo trong kho lạnh',             4, 1),
  (5, NULL, 26, 1.200, 'Kho_thieu', 'Kim chi quá hạn sử dụng',                4, 1),
  (6, NULL,  6, 0.300, 'Kho_thieu', 'Thịt bò dùng thử cho nhân viên mới',     4, 1);

-- ============================================================
-- Reset AUTO_INCREMENT
-- ============================================================
ALTER TABLE VAI_TRO              AUTO_INCREMENT = 5;
ALTER TABLE TAI_KHOAN            AUTO_INCREMENT = 5;
ALTER TABLE NHAN_VIEN            AUTO_INCREMENT = 6;
ALTER TABLE DANH_MUC             AUTO_INCREMENT = 10;
ALTER TABLE DON_VI_TINH          AUTO_INCREMENT = 11;
ALTER TABLE NGUYEN_LIEU          AUTO_INCREMENT = 46;
ALTER TABLE MON_AN               AUTO_INCREMENT = 56;
ALTER TABLE KHO_NGUYEN_LIEU      AUTO_INCREMENT = 46;
ALTER TABLE NHA_CUNG_CAP         AUTO_INCREMENT = 8;
ALTER TABLE PHIEU_NHAP_KHO       AUTO_INCREMENT = 9;
ALTER TABLE PHIEU_XUAT_KHO       AUTO_INCREMENT = 6;
ALTER TABLE KHU_VUC              AUTO_INCREMENT = 6;
ALTER TABLE BAN                  AUTO_INCREMENT = 26;
ALTER TABLE DAT_BAN              AUTO_INCREMENT = 11;
ALTER TABLE NHAT_KY_HAO_HUT      AUTO_INCREMENT = 7;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Seed data đầy đủ đã nạp xong. Mật khẩu tất cả tài khoản: 1' AS thong_bao;
