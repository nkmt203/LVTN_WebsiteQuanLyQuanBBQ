-- ============================================================
-- CSDL QUẢN LÝ QUÁN BBQ — SCHEMA VẬT LÝ (MySQL 8 / InnoDB)
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS db_quan_ly_bbq_v1
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_quan_ly_bbq_v1;

-- ============================================================
-- 1. VAI_TRO
-- ============================================================
CREATE TABLE VAI_TRO (
  ma_vai_tro     INT AUTO_INCREMENT PRIMARY KEY,
  ten_vai_tro    VARCHAR(50)  NOT NULL,
  mo_ta          VARCHAR(255) NULL,
  trang_thai     ENUM('Hoat_dong','Ngung_hoat_dong') NOT NULL DEFAULT 'Hoat_dong',
  UNIQUE KEY uq_vai_tro_ten (ten_vai_tro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. TAI_KHOAN
-- ============================================================
CREATE TABLE TAI_KHOAN (
  ma_tai_khoan    INT AUTO_INCREMENT PRIMARY KEY,
  ten_dang_nhap   VARCHAR(100) NOT NULL,
  mat_khau_hash   VARCHAR(255) NOT NULL,
  ma_vai_tro      INT NOT NULL,
  trang_thai      ENUM('Hoat_dong','Ngung_hoat_dong') NOT NULL DEFAULT 'Hoat_dong',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tai_khoan_ten_dang_nhap (ten_dang_nhap),
  CONSTRAINT fk_tai_khoan_vai_tro FOREIGN KEY (ma_vai_tro)
    REFERENCES VAI_TRO(ma_vai_tro) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. NHAN_VIEN
-- ============================================================
CREATE TABLE NHAN_VIEN (
  ma_nhan_vien    INT AUTO_INCREMENT PRIMARY KEY,
  ho_ten          VARCHAR(100) NOT NULL,
  so_dien_thoai   VARCHAR(15) NULL,
  ma_vai_tro      INT NOT NULL,
  ma_tai_khoan    INT NOT NULL,
  trang_thai      ENUM('Hoat_dong','Ngung_hoat_dong') NOT NULL DEFAULT 'Hoat_dong',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_nhan_vien_vai_tro FOREIGN KEY (ma_vai_tro)
    REFERENCES VAI_TRO(ma_vai_tro) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_nhan_vien_tai_khoan FOREIGN KEY (ma_tai_khoan)
    REFERENCES TAI_KHOAN(ma_tai_khoan) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. DANH_MUC
-- ============================================================
CREATE TABLE DANH_MUC (
  ma_danh_muc     INT AUTO_INCREMENT PRIMARY KEY,
  ten_danh_muc    VARCHAR(100) NOT NULL,
  mo_ta           VARCHAR(255) NULL,
  trang_thai      ENUM('Dang_su_dung','Ngung_su_dung') NOT NULL DEFAULT 'Dang_su_dung',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_danh_muc_ten (ten_danh_muc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. MON_AN
-- ============================================================
CREATE TABLE MON_AN (
  ma_mon_an       INT AUTO_INCREMENT PRIMARY KEY,
  ten_mon_an      VARCHAR(150) NOT NULL,
  ma_danh_muc     INT NOT NULL,
  gia_ban         DECIMAL(12,2) NOT NULL,
  mo_ta           TEXT NULL,
  hinh_anh_url    VARCHAR(500) NULL,
  trang_thai      ENUM('Dang_kinh_doanh','Tam_ngung') NOT NULL DEFAULT 'Dang_kinh_doanh',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_mon_an_ten (ten_mon_an),
  CONSTRAINT fk_mon_an_danh_muc FOREIGN KEY (ma_danh_muc)
    REFERENCES DANH_MUC(ma_danh_muc) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_mon_an_gia_ban CHECK (gia_ban >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. DON_VI_TINH
-- ============================================================
CREATE TABLE DON_VI_TINH (
  ma_don_vi_tinh  INT AUTO_INCREMENT PRIMARY KEY,
  ten_don_vi_tinh VARCHAR(50) NOT NULL,
  trang_thai      ENUM('Dang_dung','Ngung_su_dung') NOT NULL DEFAULT 'Dang_dung',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_don_vi_tinh_ten (ten_don_vi_tinh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. NGUYEN_LIEU
-- ============================================================
CREATE TABLE NGUYEN_LIEU (
  ma_nguyen_lieu  INT AUTO_INCREMENT PRIMARY KEY,
  ten_nguyen_lieu VARCHAR(150) NOT NULL,
  ma_don_vi_tinh  INT NOT NULL,
  trang_thai      ENUM('Hoat_dong','Ngung_su_dung') NOT NULL DEFAULT 'Hoat_dong',
  ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nguyen_lieu_ten (ten_nguyen_lieu),
  CONSTRAINT fk_nguyen_lieu_don_vi_tinh FOREIGN KEY (ma_don_vi_tinh)
    REFERENCES DON_VI_TINH(ma_don_vi_tinh) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. KHO_NGUYEN_LIEU
-- ============================================================
CREATE TABLE KHO_NGUYEN_LIEU (
  ma_kho             INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguyen_lieu     INT NOT NULL,
  so_luong_ton       DECIMAL(12,3) NOT NULL DEFAULT 0,
  muc_ton_toi_thieu  DECIMAL(12,3) NOT NULL DEFAULT 0,
  trang_thai_ton     ENUM('Con_hang','Sap_het','Het_hang') NOT NULL DEFAULT 'Het_hang',
  ngay_cap_nhat      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_kho_nguyen_lieu (ma_nguyen_lieu),
  CONSTRAINT fk_kho_nguyen_lieu FOREIGN KEY (ma_nguyen_lieu)
    REFERENCES NGUYEN_LIEU(ma_nguyen_lieu) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_kho_so_luong CHECK (so_luong_ton >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. NHA_CUNG_CAP
-- ============================================================
CREATE TABLE NHA_CUNG_CAP (
  ma_nha_cung_cap  INT AUTO_INCREMENT PRIMARY KEY,
  ten_nha_cung_cap VARCHAR(200) NOT NULL,
  so_dien_thoai    VARCHAR(15) NOT NULL,
  dia_chi          VARCHAR(300) NULL,
  ghi_chu          VARCHAR(500) NULL,
  trang_thai       ENUM('Hoat_dong','Ngung_hop_tac') NOT NULL DEFAULT 'Hoat_dong',
  ngay_tao         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ncc_sdt (so_dien_thoai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. PHIEU_NHAP_KHO
-- ============================================================
CREATE TABLE PHIEU_NHAP_KHO (
  ma_phieu_nhap    INT AUTO_INCREMENT PRIMARY KEY,
  ma_nha_cung_cap  INT NOT NULL,
  ma_nhan_vien_lap INT NOT NULL,
  ngay_nhap        DATETIME NOT NULL,
  tong_tien        DECIMAL(15,2) NOT NULL DEFAULT 0,
  ghi_chu          VARCHAR(500) NULL,
  ngay_tao         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pnk_nha_cung_cap FOREIGN KEY (ma_nha_cung_cap)
    REFERENCES NHA_CUNG_CAP(ma_nha_cung_cap) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pnk_nhan_vien FOREIGN KEY (ma_nhan_vien_lap)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. CHI_TIET_NHAP_KHO  (bảng trung gian N–N: PHIEU_NHAP_KHO × NGUYEN_LIEU)
-- ============================================================
CREATE TABLE CHI_TIET_NHAP_KHO (
  ma_chi_tiet_nhap INT AUTO_INCREMENT PRIMARY KEY,
  ma_phieu_nhap    INT NOT NULL,
  ma_nguyen_lieu   INT NOT NULL,
  so_luong_nhap    DECIMAL(12,3) NOT NULL,
  don_gia_nhap     DECIMAL(12,2) NOT NULL,
  thanh_tien       DECIMAL(15,2) NOT NULL,
  ghi_chu          VARCHAR(500) NULL,
  CONSTRAINT fk_ctnk_phieu_nhap FOREIGN KEY (ma_phieu_nhap)
    REFERENCES PHIEU_NHAP_KHO(ma_phieu_nhap) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctnk_nguyen_lieu FOREIGN KEY (ma_nguyen_lieu)
    REFERENCES NGUYEN_LIEU(ma_nguyen_lieu) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ctnk_so_luong CHECK (so_luong_nhap > 0),
  CONSTRAINT chk_ctnk_don_gia CHECK (don_gia_nhap >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. PHIEU_XUAT_KHO
-- ============================================================
CREATE TABLE PHIEU_XUAT_KHO (
  ma_phieu_xuat    INT AUTO_INCREMENT PRIMARY KEY,
  ma_nhan_vien_lap INT NOT NULL,
  ngay_xuat        DATETIME NOT NULL,
  ly_do_xuat       ENUM('Hu_hong','Dieu_chinh','Khac') NOT NULL,
  trang_thai       ENUM('Da_hoan_thanh','Da_huy') NOT NULL DEFAULT 'Da_hoan_thanh',
  ghi_chu          VARCHAR(500) NULL,
  ngay_tao         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pxk_nhan_vien FOREIGN KEY (ma_nhan_vien_lap)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. CHI_TIET_XUAT_KHO  (bảng trung gian N–N: PHIEU_XUAT_KHO × NGUYEN_LIEU)
-- ============================================================
CREATE TABLE CHI_TIET_XUAT_KHO (
  ma_chi_tiet_xuat INT AUTO_INCREMENT PRIMARY KEY,
  ma_phieu_xuat    INT NOT NULL,
  ma_nguyen_lieu   INT NOT NULL,
  so_luong_xuat    DECIMAL(12,3) NOT NULL,
  ghi_chu          VARCHAR(500) NULL,
  CONSTRAINT fk_ctxk_phieu_xuat FOREIGN KEY (ma_phieu_xuat)
    REFERENCES PHIEU_XUAT_KHO(ma_phieu_xuat) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctxk_nguyen_lieu FOREIGN KEY (ma_nguyen_lieu)
    REFERENCES NGUYEN_LIEU(ma_nguyen_lieu) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ctxk_so_luong CHECK (so_luong_xuat > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. DINH_MUC_NGUYEN_LIEU  (bảng trung gian N–N: MON_AN × NGUYEN_LIEU)
-- ============================================================
CREATE TABLE DINH_MUC_NGUYEN_LIEU (
  ma_dinh_muc       INT AUTO_INCREMENT PRIMARY KEY,
  ma_mon_an         INT NOT NULL,
  ma_nguyen_lieu    INT NOT NULL,
  so_luong_su_dung  DECIMAL(12,3) NOT NULL,
  ghi_chu           VARCHAR(300) NULL,
  trang_thai        ENUM('Hoat_dong','Ngung_su_dung') NOT NULL DEFAULT 'Hoat_dong',
  ngay_tao          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_dinh_muc_mon_nguyenlieu (ma_mon_an, ma_nguyen_lieu),
  CONSTRAINT fk_dm_mon_an FOREIGN KEY (ma_mon_an)
    REFERENCES MON_AN(ma_mon_an) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dm_nguyen_lieu FOREIGN KEY (ma_nguyen_lieu)
    REFERENCES NGUYEN_LIEU(ma_nguyen_lieu) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_dm_so_luong CHECK (so_luong_su_dung > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. KHU_VUC
-- ============================================================
CREATE TABLE KHU_VUC (
  ma_khu_vuc   INT AUTO_INCREMENT PRIMARY KEY,
  ten_khu_vuc  VARCHAR(100) NOT NULL,
  mo_ta        VARCHAR(255) NULL,
  trang_thai   ENUM('Dang_dung','Ngung_su_dung') NOT NULL DEFAULT 'Dang_dung',
  UNIQUE KEY uq_khu_vuc_ten (ten_khu_vuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. BAN
-- ============================================================
CREATE TABLE BAN (
  ma_ban               INT AUTO_INCREMENT PRIMARY KEY,
  ten_ban              VARCHAR(50) NOT NULL,
  ma_khu_vuc           INT NOT NULL,
  so_ghe               INT NOT NULL DEFAULT 4,
  qr_code_dinh_danh    VARCHAR(200) NOT NULL,
  phien_token_hien_tai VARCHAR(200) NULL,
  trang_thai           ENUM('Trong','Dang_su_dung','Da_dat_truoc') NOT NULL DEFAULT 'Trong',
  ghi_chu              VARCHAR(300) NULL,
  ngay_tao             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ban_qr (qr_code_dinh_danh),
  CONSTRAINT fk_ban_khu_vuc FOREIGN KEY (ma_khu_vuc)
    REFERENCES KHU_VUC(ma_khu_vuc) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_ban_so_ghe CHECK (so_ghe > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. DAT_BAN
-- ============================================================
CREATE TABLE DAT_BAN (
  ma_dat_ban             INT AUTO_INCREMENT PRIMARY KEY,
  ma_ban                 INT NULL,
  ma_nhan_vien_tiep_nhan INT NULL,
  ho_ten_khach           VARCHAR(100) NOT NULL,
  so_dien_thoai          VARCHAR(15) NOT NULL,
  so_luong_khach         INT NOT NULL,
  thoi_gian_den          DATETIME NOT NULL,
  ghi_chu                VARCHAR(500) NULL,
  trang_thai             ENUM('Cho_xac_nhan','Da_xac_nhan','Tu_choi','Da_su_dung','Da_huy','Khong_den')
                            NOT NULL DEFAULT 'Cho_xac_nhan',
  nguon_dat              ENUM('Website','Nhan_vien') NOT NULL DEFAULT 'Website',
  ngay_tao               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_datban_ban FOREIGN KEY (ma_ban)
    REFERENCES BAN(ma_ban) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_datban_nhan_vien FOREIGN KEY (ma_nhan_vien_tiep_nhan)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_datban_so_khach CHECK (so_luong_khach > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. HOA_DON
-- ============================================================
CREATE TABLE HOA_DON (
  ma_hoa_don              INT AUTO_INCREMENT PRIMARY KEY,
  ma_ban                  INT NOT NULL,
  ma_dat_ban              INT NULL,
  ma_nhan_vien_thu_ngan   INT NULL,
  thoi_gian_mo_ban        DATETIME NOT NULL,
  thoi_gian_dong_ban      DATETIME NULL,
  tong_tien_truoc_giam    DECIMAL(15,2) NOT NULL DEFAULT 0,
  tien_giam_gia           DECIMAL(15,2) NOT NULL DEFAULT 0,
  tong_tien_thanh_toan    DECIMAL(15,2) NOT NULL DEFAULT 0,
  hinh_thuc_thanh_toan    ENUM('Tien_mat','Chuyen_khoan') NULL,
  trang_thai              ENUM('Dang_phuc_vu','Cho_thanh_toan','Da_thanh_toan','Da_huy')
                             NOT NULL DEFAULT 'Dang_phuc_vu',
  ngay_tao                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hd_ban FOREIGN KEY (ma_ban)
    REFERENCES BAN(ma_ban) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_hd_dat_ban FOREIGN KEY (ma_dat_ban)
    REFERENCES DAT_BAN(ma_dat_ban) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_hd_nhan_vien_thu_ngan FOREIGN KEY (ma_nhan_vien_thu_ngan)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. CHI_TIET_HOA_DON  (bảng trung gian N–N: HOA_DON × MON_AN)
-- ============================================================
CREATE TABLE CHI_TIET_HOA_DON (
  ma_chi_tiet_hd           INT AUTO_INCREMENT PRIMARY KEY,
  ma_hoa_don               INT NOT NULL,
  ma_mon_an                INT NOT NULL,
  so_luong                 INT NOT NULL,
  don_gia_tai_thoi_diem_goi DECIMAL(12,2) NOT NULL,
  thanh_tien               DECIMAL(15,2) NOT NULL,
  ghi_chu                  VARCHAR(300) NULL,
  trang_thai               ENUM('Cho_xac_nhan','Dang_che_bien','Da_hoan_thanh','Da_huy')
                              NOT NULL DEFAULT 'Cho_xac_nhan',
  ma_nv_xac_nhan           INT NULL,
  thoi_gian_goi_mon        DATETIME NOT NULL,
  thoi_gian_xac_nhan       DATETIME NULL,
  thoi_gian_hoan_thanh     DATETIME NULL,
  nguon_goi_mon            ENUM('QR','Nhan_vien') NOT NULL DEFAULT 'QR',
  CONSTRAINT fk_cthd_hoa_don FOREIGN KEY (ma_hoa_don)
    REFERENCES HOA_DON(ma_hoa_don) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cthd_mon_an FOREIGN KEY (ma_mon_an)
    REFERENCES MON_AN(ma_mon_an) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cthd_nhan_vien FOREIGN KEY (ma_nv_xac_nhan)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_cthd_so_luong CHECK (so_luong > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. NHAT_KY_HAO_HUT
-- ============================================================
CREATE TABLE NHAT_KY_HAO_HUT (
  ma_nhat_ky        INT AUTO_INCREMENT PRIMARY KEY,
  ma_chi_tiet_hd    INT NULL,
  ma_nguyen_lieu    INT NOT NULL,
  so_luong_hao_hut  DECIMAL(12,3) NOT NULL,
  loai_hao_hut      ENUM('Kho_thieu','Mon_huy') NOT NULL,
  ly_do             VARCHAR(300) NULL,
  ma_nv_lam_sai     INT NULL,
  ma_nv_phe_duyet   INT NULL,
  thoi_gian_ghi_nhan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_nkhh_chi_tiet_hd FOREIGN KEY (ma_chi_tiet_hd)
    REFERENCES CHI_TIET_HOA_DON(ma_chi_tiet_hd) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_nkhh_nguyen_lieu FOREIGN KEY (ma_nguyen_lieu)
    REFERENCES NGUYEN_LIEU(ma_nguyen_lieu) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_nkhh_nv_lam_sai FOREIGN KEY (ma_nv_lam_sai)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_nkhh_nv_phe_duyet FOREIGN KEY (ma_nv_phe_duyet)
    REFERENCES NHAN_VIEN(ma_nhan_vien) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_nkhh_so_luong CHECK (so_luong_hao_hut > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED DATA: VAI_TRO mặc định
-- ============================================================
INSERT INTO VAI_TRO (ten_vai_tro, mo_ta) VALUES
  ('Admin', 'Quản trị hệ thống'),
  ('Phuc_vu', 'Nhân viên phục vụ'),
  ('Bep', 'Nhân viên bếp'),
  ('Thu_ngan', 'Nhân viên thu ngân');