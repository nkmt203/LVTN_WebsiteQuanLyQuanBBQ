-- ============================================================
-- SEED DATA ĐẦY ĐỦ CHO 20 BẢNG
-- Dùng cho DB đã sửa ENUM CHI_TIET_HOA_DON (bỏ Cho_che_bien)
-- Mật khẩu tất cả tài khoản: 123456
-- ============================================================

USE db_quan_ly_bbq_v1;

-- Xóa dữ liệu cũ theo thứ tự phụ thuộc
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
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. VAI_TRO
-- ============================================================
INSERT INTO VAI_TRO (ma_vai_tro, ten_vai_tro, mo_ta) VALUES
  (1, 'Admin',    'Quản trị viên hệ thống'),
  (2, 'Phuc_vu',  'Nhân viên phục vụ'),
  (3, 'Bep',      'Nhân viên bếp'),
  (4, 'Thu_ngan', 'Nhân viên thu ngân');

-- ============================================================
-- 2. TAI_KHOAN (mật khẩu = 123456)
-- ============================================================
INSERT INTO TAI_KHOAN (ma_tai_khoan, ten_dang_nhap, mat_khau_hash, ma_vai_tro, trang_thai) VALUES
  (1, 'admin',    '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 1, 'Hoat_dong'),
  (2, 'phucvu',   '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 2, 'Hoat_dong'),
  (3, 'bep',      '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 3, 'Hoat_dong'),
  (4, 'thungan',  '$2b$10$FJ9ayQ0LDegCFKQilamNvOmZeaF7Ov1vwFE2cGSorYUlIom/1AV9G', 4, 'Hoat_dong');

-- ============================================================
-- 3. NHAN_VIEN (1 admin, 2 phục vụ chung tài khoản, 1 bếp, 1 thu ngân)
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
  (1, 'Thịt nướng', 'Các loại thịt nướng BBQ', 'Dang_su_dung'),
  (2, 'Đồ uống',    'Nước ngọt, bia, nước ép', 'Dang_su_dung'),
  (3, 'Tráng miệng','Kem, trái cây',           'Dang_su_dung');

-- ============================================================
-- 6. DON_VI_TINH
-- ============================================================
INSERT INTO DON_VI_TINH (ma_don_vi_tinh, ten_don_vi_tinh, trang_thai) VALUES
  (1, 'kg',   'Dang_dung'),
  (2, 'lon',  'Dang_dung'),
  (3, 'phần', 'Dang_dung');

-- ============================================================
-- 7. NGUYEN_LIEU
-- ============================================================
INSERT INTO NGUYEN_LIEU (ma_nguyen_lieu, ten_nguyen_lieu, ma_don_vi_tinh, trang_thai) VALUES
  (1, 'Thịt ba chỉ bò',  1, 'Hoat_dong'),
  (2, 'Thịt ba chỉ heo', 1, 'Hoat_dong'),
  (3, 'Bia Tiger lon',   2, 'Hoat_dong'),
  (4, 'Coca Cola lon',   2, 'Hoat_dong'),
  (5, 'Kem vani',        3, 'Hoat_dong');

-- ============================================================
-- 5. MON_AN
-- ============================================================
INSERT INTO MON_AN (ma_mon_an, ten_mon_an, ma_danh_muc, gia_ban, mo_ta, hinh_anh_url, trang_thai) VALUES
  (1, 'Ba chỉ bò Mỹ',   1, 159000, 'Thịt ba chỉ bò Mỹ ướp sốt BBQ',    NULL, 'Dang_kinh_doanh'),
  (2, 'Ba chỉ heo Hàn', 1, 129000, 'Thịt ba chỉ heo tẩm ướp kiểu Hàn', NULL, 'Dang_kinh_doanh'),
  (3, 'Sườn non nướng', 1, 189000, 'Sườn non ướp mật ong',             NULL, 'Dang_kinh_doanh'),
  (4, 'Bia Tiger',      2,  25000, 'Bia lon 330ml',                    NULL, 'Dang_kinh_doanh'),
  (5, 'Coca Cola',      2,  20000, 'Coca lon 330ml',                   NULL, 'Dang_kinh_doanh'),
  (6, 'Nước cam ép',    2,  30000, 'Cam tươi vắt',                     NULL, 'Dang_kinh_doanh'),
  (7, 'Kem vani',       3,  35000, 'Kem vani 1 viên',                  NULL, 'Dang_kinh_doanh'),
  (8, 'Trà đào',        2,  25000, 'Trà đào cam sả',                   NULL, 'Tam_ngung');

-- ============================================================
-- 8. KHO_NGUYEN_LIEU (tồn kho cho từng nguyên liệu)
-- ============================================================
INSERT INTO KHO_NGUYEN_LIEU (ma_kho, ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton) VALUES
  (1, 1, 15.500, 5.000, 'Con_hang'),
  (2, 2, 12.000, 5.000, 'Con_hang'),
  (3, 3, 48.000, 20.000, 'Con_hang'),
  (4, 4, 36.000, 20.000, 'Con_hang'),
  (5, 5, 8.000,  3.000,  'Con_hang');

-- ============================================================
-- 9. NHA_CUNG_CAP
-- ============================================================
INSERT INTO NHA_CUNG_CAP (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi, trang_thai) VALUES
  (1, 'Công ty TNHH Thực phẩm Hoàng Long', '0281234567', '123 Nguyễn Huệ, Q.1, TP.HCM', 'Hoat_dong'),
  (2, 'Nhà phân phối Bia rượu Sài Gòn',    '0287654321', '45 Lê Lợi, Q.1, TP.HCM',      'Hoat_dong');

-- ============================================================
-- 10. PHIEU_NHAP_KHO (1 phiếu nhập mẫu)
-- ============================================================
INSERT INTO PHIEU_NHAP_KHO (ma_phieu_nhap, ma_nha_cung_cap, ma_nhan_vien_lap, ngay_nhap, tong_tien, ghi_chu) VALUES
  (1, 1, 1, '2026-07-10 08:00:00', 6100000, 'Nhập thịt tuần');

-- ============================================================
-- 11. CHI_TIET_NHAP_KHO
-- ============================================================
INSERT INTO CHI_TIET_NHAP_KHO (ma_phieu_nhap, ma_nguyen_lieu, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES
  (1, 1, 10.000, 350000, 3500000),
  (1, 2,  8.000, 220000, 1760000),
  (1, 5,  5.000, 168000, 840000);

-- ============================================================
-- 12. PHIEU_XUAT_KHO (1 phiếu xuất mẫu - hư hỏng)
-- ============================================================
INSERT INTO PHIEU_XUAT_KHO (ma_phieu_xuat, ma_nhan_vien_lap, ngay_xuat, ly_do_xuat, ghi_chu) VALUES
  (1, 4, '2026-07-12 15:30:00', 'Hu_hong', 'Thịt bò hết hạn phải bỏ');

-- ============================================================
-- 13. CHI_TIET_XUAT_KHO
-- ============================================================
INSERT INTO CHI_TIET_XUAT_KHO (ma_phieu_xuat, ma_nguyen_lieu, so_luong_xuat, ghi_chu) VALUES
  (1, 1, 0.500, 'Miếng bò để lâu ngoài nhiệt độ');

-- ============================================================
-- 14. DINH_MUC_NGUYEN_LIEU
-- ============================================================
INSERT INTO DINH_MUC_NGUYEN_LIEU (ma_mon_an, ma_nguyen_lieu, so_luong_su_dung, trang_thai) VALUES
  (1, 1, 0.200, 'Hoat_dong'),
  (2, 2, 0.200, 'Hoat_dong'),
  (4, 3, 1.000, 'Hoat_dong'),
  (5, 4, 1.000, 'Hoat_dong'),
  (7, 5, 1.000, 'Hoat_dong');

-- ============================================================
-- 15. KHU_VUC
-- ============================================================
INSERT INTO KHU_VUC (ma_khu_vuc, ten_khu_vuc, mo_ta, trang_thai) VALUES
  (1, 'Tầng trệt', 'Khu vực chính trong nhà', 'Dang_dung'),
  (2, 'Sân vườn',  'Khu vực ngoài trời',      'Dang_dung');

-- ============================================================
-- 16. BAN
-- ============================================================
INSERT INTO BAN (ma_ban, ten_ban, ma_khu_vuc, so_ghe, qr_code_dinh_danh, trang_thai) VALUES
  (1, 'Bàn 01', 1, 4, 'QR-T1-B01', 'Trong'),
  (2, 'Bàn 02', 1, 4, 'QR-T1-B02', 'Trong'),
  (3, 'Bàn 03', 1, 6, 'QR-T1-B03', 'Da_dat_truoc'),
  (4, 'Bàn 04', 2, 4, 'QR-SV-B01', 'Trong'),
  (5, 'Bàn 05', 2, 6, 'QR-SV-B02', 'Trong'),
  (6, 'Bàn 06', 2, 8, 'QR-SV-B03', 'Trong');

-- ============================================================
-- 17. DAT_BAN (1 đơn đặt bàn cho Bàn 03)
-- ============================================================
INSERT INTO DAT_BAN (ma_dat_ban, ma_ban, ma_nhan_vien_tiep_nhan, ho_ten_khach, so_dien_thoai,
                    so_luong_khach, thoi_gian_den, ghi_chu, trang_thai, nguon_dat) VALUES
  (1, 3, 2, 'Trần Văn Khách', '0911222333', 5, '2026-07-17 19:00:00', 'Sinh nhật, cần bánh kem', 'Da_xac_nhan', 'Nhan_vien');

-- ============================================================
-- 18. HOA_DON  — không seed, để bạn tự tạo qua giao diện phục vụ
-- 19. CHI_TIET_HOA_DON  — không seed
-- ============================================================

-- ============================================================
-- 20. NHAT_KY_HAO_HUT (1 dòng mẫu - liên kết với PHIEU_XUAT_KHO ở trên)
-- ============================================================
INSERT INTO NHAT_KY_HAO_HUT (ma_nhat_ky, ma_chi_tiet_hd, ma_nguyen_lieu, so_luong_hao_hut,
                             loai_hao_hut, ly_do, ma_nv_lam_sai, ma_nv_phe_duyet) VALUES
  (1, NULL, 1, 0.500, 'Kho_thieu', 'Thịt để ngoài nhiệt độ quá lâu', 4, 1);

-- ============================================================
-- Reset AUTO_INCREMENT
-- ============================================================
ALTER TABLE VAI_TRO              AUTO_INCREMENT = 5;
ALTER TABLE TAI_KHOAN            AUTO_INCREMENT = 5;
ALTER TABLE NHAN_VIEN            AUTO_INCREMENT = 6;
ALTER TABLE DANH_MUC             AUTO_INCREMENT = 4;
ALTER TABLE DON_VI_TINH          AUTO_INCREMENT = 4;
ALTER TABLE NGUYEN_LIEU          AUTO_INCREMENT = 6;
ALTER TABLE MON_AN               AUTO_INCREMENT = 9;
ALTER TABLE KHO_NGUYEN_LIEU      AUTO_INCREMENT = 6;
ALTER TABLE NHA_CUNG_CAP         AUTO_INCREMENT = 3;
ALTER TABLE PHIEU_NHAP_KHO       AUTO_INCREMENT = 2;
ALTER TABLE PHIEU_XUAT_KHO       AUTO_INCREMENT = 2;
ALTER TABLE KHU_VUC              AUTO_INCREMENT = 3;
ALTER TABLE BAN                  AUTO_INCREMENT = 7;
ALTER TABLE DAT_BAN              AUTO_INCREMENT = 2;
ALTER TABLE NHAT_KY_HAO_HUT      AUTO_INCREMENT = 2;

SELECT 'Seed data đầy đủ 20 bảng đã nạp xong.' AS thong_bao;
