-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 13, 2026 at 07:39 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_quan_ly_bbq_v1`
--

-- --------------------------------------------------------

--
-- Table structure for table `ban`
--

DROP TABLE IF EXISTS `ban`;
CREATE TABLE IF NOT EXISTS `ban` (
  `ma_ban` int NOT NULL AUTO_INCREMENT,
  `ten_ban` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_khu_vuc` int NOT NULL,
  `so_ghe` int NOT NULL DEFAULT '4',
  `qr_code_dinh_danh` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phien_token_hien_tai` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Trong','Dang_su_dung','Da_dat_truoc') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Trong',
  `ghi_chu` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_ban`),
  UNIQUE KEY `uq_ban_qr` (`qr_code_dinh_danh`),
  KEY `fk_ban_khu_vuc` (`ma_khu_vuc`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_hoa_don`
--

DROP TABLE IF EXISTS `chi_tiet_hoa_don`;
CREATE TABLE IF NOT EXISTS `chi_tiet_hoa_don` (
  `ma_chi_tiet_hd` int NOT NULL AUTO_INCREMENT,
  `ma_hoa_don` int NOT NULL,
  `ma_mon_an` int NOT NULL,
  `so_luong` int NOT NULL,
  `don_gia_tai_thoi_diem_goi` decimal(12,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `ghi_chu` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Cho_xac_nhan','Dang_che_bien','Da_hoan_thanh','Da_huy') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Cho_xac_nhan',
  `ma_nv_xac_nhan` int DEFAULT NULL,
  `thoi_gian_goi_mon` datetime NOT NULL,
  `thoi_gian_xac_nhan` datetime DEFAULT NULL,
  `thoi_gian_hoan_thanh` datetime DEFAULT NULL,
  `nguon_goi_mon` enum('QR','Nhan_vien') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'QR',
  PRIMARY KEY (`ma_chi_tiet_hd`),
  KEY `fk_cthd_hoa_don` (`ma_hoa_don`),
  KEY `fk_cthd_mon_an` (`ma_mon_an`),
  KEY `fk_cthd_nhan_vien` (`ma_nv_xac_nhan`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_nhap_kho`
--

DROP TABLE IF EXISTS `chi_tiet_nhap_kho`;
CREATE TABLE IF NOT EXISTS `chi_tiet_nhap_kho` (
  `ma_chi_tiet_nhap` int NOT NULL AUTO_INCREMENT,
  `ma_phieu_nhap` int NOT NULL,
  `ma_nguyen_lieu` int NOT NULL,
  `so_luong_nhap` decimal(12,3) NOT NULL,
  `don_gia_nhap` decimal(12,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_chi_tiet_nhap`),
  KEY `fk_ctnk_phieu_nhap` (`ma_phieu_nhap`),
  KEY `fk_ctnk_nguyen_lieu` (`ma_nguyen_lieu`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_xuat_kho`
--

DROP TABLE IF EXISTS `chi_tiet_xuat_kho`;
CREATE TABLE IF NOT EXISTS `chi_tiet_xuat_kho` (
  `ma_chi_tiet_xuat` int NOT NULL AUTO_INCREMENT,
  `ma_phieu_xuat` int NOT NULL,
  `ma_nguyen_lieu` int NOT NULL,
  `so_luong_xuat` decimal(12,3) NOT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_chi_tiet_xuat`),
  KEY `fk_ctxk_phieu_xuat` (`ma_phieu_xuat`),
  KEY `fk_ctxk_nguyen_lieu` (`ma_nguyen_lieu`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
CREATE TABLE IF NOT EXISTS `danh_muc` (
  `ma_danh_muc` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Dang_su_dung','Ngung_su_dung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dang_su_dung',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_danh_muc`),
  UNIQUE KEY `uq_danh_muc_ten` (`ten_danh_muc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dat_ban`
--

DROP TABLE IF EXISTS `dat_ban`;
CREATE TABLE IF NOT EXISTS `dat_ban` (
  `ma_dat_ban` int NOT NULL AUTO_INCREMENT,
  `ma_ban` int DEFAULT NULL,
  `ma_nhan_vien_tiep_nhan` int DEFAULT NULL,
  `ho_ten_khach` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_luong_khach` int NOT NULL,
  `thoi_gian_den` datetime NOT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Cho_xac_nhan','Da_xac_nhan','Tu_choi','Da_su_dung','Da_huy','Khong_den') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Cho_xac_nhan',
  `nguon_dat` enum('Website','Nhan_vien') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Website',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_dat_ban`),
  KEY `fk_datban_ban` (`ma_ban`),
  KEY `fk_datban_nhan_vien` (`ma_nhan_vien_tiep_nhan`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `dinh_muc_nguyen_lieu`
--

DROP TABLE IF EXISTS `dinh_muc_nguyen_lieu`;
CREATE TABLE IF NOT EXISTS `dinh_muc_nguyen_lieu` (
  `ma_dinh_muc` int NOT NULL AUTO_INCREMENT,
  `ma_mon_an` int NOT NULL,
  `ma_nguyen_lieu` int NOT NULL,
  `so_luong_su_dung` decimal(12,3) NOT NULL,
  `ghi_chu` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_su_dung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_dinh_muc`),
  UNIQUE KEY `uq_dinh_muc_mon_nguyenlieu` (`ma_mon_an`,`ma_nguyen_lieu`),
  KEY `fk_dm_nguyen_lieu` (`ma_nguyen_lieu`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `don_vi_tinh`
--

DROP TABLE IF EXISTS `don_vi_tinh`;
CREATE TABLE IF NOT EXISTS `don_vi_tinh` (
  `ma_don_vi_tinh` int NOT NULL AUTO_INCREMENT,
  `ten_don_vi_tinh` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('Dang_dung','Ngung_su_dung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dang_dung',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_don_vi_tinh`),
  UNIQUE KEY `uq_don_vi_tinh_ten` (`ten_don_vi_tinh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
CREATE TABLE IF NOT EXISTS `hoa_don` (
  `ma_hoa_don` int NOT NULL AUTO_INCREMENT,
  `ma_ban` int NOT NULL,
  `ma_dat_ban` int DEFAULT NULL,
  `ma_nhan_vien_thu_ngan` int DEFAULT NULL,
  `thoi_gian_mo_ban` datetime NOT NULL,
  `thoi_gian_dong_ban` datetime DEFAULT NULL,
  `tong_tien_truoc_giam` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tien_giam_gia` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tong_tien_thanh_toan` decimal(15,2) NOT NULL DEFAULT '0.00',
  `hinh_thuc_thanh_toan` enum('Tien_mat','Chuyen_khoan') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Dang_phuc_vu','Cho_thanh_toan','Da_thanh_toan','Da_huy') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dang_phuc_vu',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_hoa_don`),
  KEY `fk_hd_ban` (`ma_ban`),
  KEY `fk_hd_dat_ban` (`ma_dat_ban`),
  KEY `fk_hd_nhan_vien_thu_ngan` (`ma_nhan_vien_thu_ngan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kho_nguyen_lieu`
--

DROP TABLE IF EXISTS `kho_nguyen_lieu`;
CREATE TABLE IF NOT EXISTS `kho_nguyen_lieu` (
  `ma_kho` int NOT NULL AUTO_INCREMENT,
  `ma_nguyen_lieu` int NOT NULL,
  `so_luong_ton` decimal(12,3) NOT NULL DEFAULT '0.000',
  `muc_ton_toi_thieu` decimal(12,3) NOT NULL DEFAULT '0.000',
  `trang_thai_ton` enum('Con_hang','Sap_het','Het_hang') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Het_hang',
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_kho`),
  UNIQUE KEY `uq_kho_nguyen_lieu` (`ma_nguyen_lieu`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `khu_vuc`
--

DROP TABLE IF EXISTS `khu_vuc`;
CREATE TABLE IF NOT EXISTS `khu_vuc` (
  `ma_khu_vuc` int NOT NULL AUTO_INCREMENT,
  `ten_khu_vuc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Dang_dung','Ngung_su_dung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dang_dung',
  PRIMARY KEY (`ma_khu_vuc`),
  UNIQUE KEY `uq_khu_vuc_ten` (`ten_khu_vuc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mon_an`
--

DROP TABLE IF EXISTS `mon_an`;
CREATE TABLE IF NOT EXISTS `mon_an` (
  `ma_mon_an` int NOT NULL AUTO_INCREMENT,
  `ten_mon_an` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_danh_muc` int NOT NULL,
  `gia_ban` decimal(12,2) NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `hinh_anh_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Dang_kinh_doanh','Tam_ngung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dang_kinh_doanh',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_mon_an`),
  UNIQUE KEY `uq_mon_an_ten` (`ten_mon_an`),
  KEY `fk_mon_an_danh_muc` (`ma_danh_muc`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `nguyen_lieu`
--

DROP TABLE IF EXISTS `nguyen_lieu`;
CREATE TABLE IF NOT EXISTS `nguyen_lieu` (
  `ma_nguyen_lieu` int NOT NULL AUTO_INCREMENT,
  `ten_nguyen_lieu` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_don_vi_tinh` int NOT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_su_dung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nguyen_lieu`),
  UNIQUE KEY `uq_nguyen_lieu_ten` (`ten_nguyen_lieu`),
  KEY `fk_nguyen_lieu_don_vi_tinh` (`ma_don_vi_tinh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `ma_nhan_vien` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ma_vai_tro` int NOT NULL,
  `ma_tai_khoan` int NOT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_hoat_dong') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nhan_vien`),
  KEY `fk_nhan_vien_vai_tro` (`ma_vai_tro`),
  KEY `fk_nhan_vien_tai_khoan` (`ma_tai_khoan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhat_ky_hao_hut`
--

DROP TABLE IF EXISTS `nhat_ky_hao_hut`;
CREATE TABLE IF NOT EXISTS `nhat_ky_hao_hut` (
  `ma_nhat_ky` int NOT NULL AUTO_INCREMENT,
  `ma_chi_tiet_hd` int DEFAULT NULL,
  `ma_nguyen_lieu` int NOT NULL,
  `so_luong_hao_hut` decimal(12,3) NOT NULL,
  `loai_hao_hut` enum('Kho_thieu','Mon_huy') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ly_do` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ma_nv_lam_sai` int DEFAULT NULL,
  `ma_nv_phe_duyet` int DEFAULT NULL,
  `thoi_gian_ghi_nhan` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nhat_ky`),
  KEY `fk_nkhh_chi_tiet_hd` (`ma_chi_tiet_hd`),
  KEY `fk_nkhh_nguyen_lieu` (`ma_nguyen_lieu`),
  KEY `fk_nkhh_nv_lam_sai` (`ma_nv_lam_sai`),
  KEY `fk_nkhh_nv_phe_duyet` (`ma_nv_phe_duyet`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `nha_cung_cap`
--

DROP TABLE IF EXISTS `nha_cung_cap`;
CREATE TABLE IF NOT EXISTS `nha_cung_cap` (
  `ma_nha_cung_cap` int NOT NULL AUTO_INCREMENT,
  `ten_nha_cung_cap` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_hop_tac') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nha_cung_cap`),
  UNIQUE KEY `uq_ncc_sdt` (`so_dien_thoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phieu_nhap_kho`
--

DROP TABLE IF EXISTS `phieu_nhap_kho`;
CREATE TABLE IF NOT EXISTS `phieu_nhap_kho` (
  `ma_phieu_nhap` int NOT NULL AUTO_INCREMENT,
  `ma_nha_cung_cap` int NOT NULL,
  `ma_nhan_vien_lap` int NOT NULL,
  `ngay_nhap` datetime NOT NULL,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT '0.00',
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_phieu_nhap`),
  KEY `fk_pnk_nha_cung_cap` (`ma_nha_cung_cap`),
  KEY `fk_pnk_nhan_vien` (`ma_nhan_vien_lap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phieu_xuat_kho`
--

DROP TABLE IF EXISTS `phieu_xuat_kho`;
CREATE TABLE IF NOT EXISTS `phieu_xuat_kho` (
  `ma_phieu_xuat` int NOT NULL AUTO_INCREMENT,
  `ma_nhan_vien_lap` int NOT NULL,
  `ngay_xuat` datetime NOT NULL,
  `ly_do_xuat` enum('Hu_hong','Dieu_chinh','Khac') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('Da_hoan_thanh','Da_huy') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Da_hoan_thanh',
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_phieu_xuat`),
  KEY `fk_pxk_nhan_vien` (`ma_nhan_vien_lap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

DROP TABLE IF EXISTS `tai_khoan`;
CREATE TABLE IF NOT EXISTS `tai_khoan` (
  `ma_tai_khoan` int NOT NULL AUTO_INCREMENT,
  `ten_dang_nhap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_vai_tro` int NOT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_hoat_dong') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  `ngay_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_tai_khoan`),
  UNIQUE KEY `uq_tai_khoan_ten_dang_nhap` (`ten_dang_nhap`),
  KEY `fk_tai_khoan_vai_tro` (`ma_vai_tro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vai_tro`
--

DROP TABLE IF EXISTS `vai_tro`;
CREATE TABLE IF NOT EXISTS `vai_tro` (
  `ma_vai_tro` int NOT NULL AUTO_INCREMENT,
  `ten_vai_tro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('Hoat_dong','Ngung_hoat_dong') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hoat_dong',
  PRIMARY KEY (`ma_vai_tro`),
  UNIQUE KEY `uq_vai_tro_ten` (`ten_vai_tro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ban`
--
ALTER TABLE `ban`
  ADD CONSTRAINT `fk_ban_khu_vuc` FOREIGN KEY (`ma_khu_vuc`) REFERENCES `khu_vuc` (`ma_khu_vuc`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `chi_tiet_hoa_don`
--
ALTER TABLE `chi_tiet_hoa_don`
  ADD CONSTRAINT `fk_cthd_hoa_don` FOREIGN KEY (`ma_hoa_don`) REFERENCES `hoa_don` (`ma_hoa_don`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cthd_mon_an` FOREIGN KEY (`ma_mon_an`) REFERENCES `mon_an` (`ma_mon_an`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cthd_nhan_vien` FOREIGN KEY (`ma_nv_xac_nhan`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `chi_tiet_nhap_kho`
--
ALTER TABLE `chi_tiet_nhap_kho`
  ADD CONSTRAINT `fk_ctnk_nguyen_lieu` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctnk_phieu_nhap` FOREIGN KEY (`ma_phieu_nhap`) REFERENCES `phieu_nhap_kho` (`ma_phieu_nhap`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chi_tiet_xuat_kho`
--
ALTER TABLE `chi_tiet_xuat_kho`
  ADD CONSTRAINT `fk_ctxk_nguyen_lieu` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctxk_phieu_xuat` FOREIGN KEY (`ma_phieu_xuat`) REFERENCES `phieu_xuat_kho` (`ma_phieu_xuat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dat_ban`
--
ALTER TABLE `dat_ban`
  ADD CONSTRAINT `fk_datban_ban` FOREIGN KEY (`ma_ban`) REFERENCES `ban` (`ma_ban`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_datban_nhan_vien` FOREIGN KEY (`ma_nhan_vien_tiep_nhan`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `dinh_muc_nguyen_lieu`
--
ALTER TABLE `dinh_muc_nguyen_lieu`
  ADD CONSTRAINT `fk_dm_mon_an` FOREIGN KEY (`ma_mon_an`) REFERENCES `mon_an` (`ma_mon_an`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dm_nguyen_lieu` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD CONSTRAINT `fk_hd_ban` FOREIGN KEY (`ma_ban`) REFERENCES `ban` (`ma_ban`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hd_dat_ban` FOREIGN KEY (`ma_dat_ban`) REFERENCES `dat_ban` (`ma_dat_ban`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hd_nhan_vien_thu_ngan` FOREIGN KEY (`ma_nhan_vien_thu_ngan`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kho_nguyen_lieu`
--
ALTER TABLE `kho_nguyen_lieu`
  ADD CONSTRAINT `fk_kho_nguyen_lieu` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `mon_an`
--
ALTER TABLE `mon_an`
  ADD CONSTRAINT `fk_mon_an_danh_muc` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc` (`ma_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `nguyen_lieu`
--
ALTER TABLE `nguyen_lieu`
  ADD CONSTRAINT `fk_nguyen_lieu_don_vi_tinh` FOREIGN KEY (`ma_don_vi_tinh`) REFERENCES `don_vi_tinh` (`ma_don_vi_tinh`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD CONSTRAINT `fk_nhan_vien_tai_khoan` FOREIGN KEY (`ma_tai_khoan`) REFERENCES `tai_khoan` (`ma_tai_khoan`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nhan_vien_vai_tro` FOREIGN KEY (`ma_vai_tro`) REFERENCES `vai_tro` (`ma_vai_tro`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `nhat_ky_hao_hut`
--
ALTER TABLE `nhat_ky_hao_hut`
  ADD CONSTRAINT `fk_nkhh_chi_tiet_hd` FOREIGN KEY (`ma_chi_tiet_hd`) REFERENCES `chi_tiet_hoa_don` (`ma_chi_tiet_hd`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nkhh_nguyen_lieu` FOREIGN KEY (`ma_nguyen_lieu`) REFERENCES `nguyen_lieu` (`ma_nguyen_lieu`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nkhh_nv_lam_sai` FOREIGN KEY (`ma_nv_lam_sai`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nkhh_nv_phe_duyet` FOREIGN KEY (`ma_nv_phe_duyet`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `phieu_nhap_kho`
--
ALTER TABLE `phieu_nhap_kho`
  ADD CONSTRAINT `fk_pnk_nha_cung_cap` FOREIGN KEY (`ma_nha_cung_cap`) REFERENCES `nha_cung_cap` (`ma_nha_cung_cap`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pnk_nhan_vien` FOREIGN KEY (`ma_nhan_vien_lap`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `phieu_xuat_kho`
--
ALTER TABLE `phieu_xuat_kho`
  ADD CONSTRAINT `fk_pxk_nhan_vien` FOREIGN KEY (`ma_nhan_vien_lap`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD CONSTRAINT `fk_tai_khoan_vai_tro` FOREIGN KEY (`ma_vai_tro`) REFERENCES `vai_tro` (`ma_vai_tro`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
