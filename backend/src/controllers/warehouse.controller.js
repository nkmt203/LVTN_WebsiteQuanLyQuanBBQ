const pool = require("../config/db");

// Cùng ngưỡng phân loại tồn kho với luồng tự động trừ kho ở kitchen.controller.js
const tinhTrangThaiTon = (soLuongTon, mucToiThieu) => {
  if (soLuongTon <= 0) return "Het_hang";
  if (soLuongTon < mucToiThieu) return "Sap_het";
  return "Con_hang";
};

// ============================================================
// GET /api/warehouse/inventory — tra cứu tồn kho
// ============================================================
const getInventory = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const trangThaiTon = req.query.trang_thai_ton || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push(`(nl.ten_nguyen_lieu LIKE ? OR nl.ma_nguyen_lieu = ?)`);
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (trangThaiTon) {
      conditions.push(
        `COALESCE(k.trang_thai_ton, 'Het_hang') = ?`,
      );
      params.push(trangThaiTon);
    }
    // Nguyên liệu đã ngừng sử dụng vẫn cần thấy trong kho để đối soát, không lọc theo trạng thái NL

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(` AND `)
      : "";

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM NGUYEN_LIEU nl
      LEFT JOIN KHO_NGUYEN_LIEU k ON nl.ma_nguyen_lieu = k.ma_nguyen_lieu
      ${dieuKien}
      `,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT nl.ma_nguyen_lieu, nl.ten_nguyen_lieu, nl.trang_thai AS trang_thai_nguyen_lieu,
             dvt.ten_don_vi_tinh,
             COALESCE(k.so_luong_ton, 0) AS so_luong_ton,
             COALESCE(k.muc_ton_toi_thieu, 0) AS muc_ton_toi_thieu,
             COALESCE(k.trang_thai_ton, 'Het_hang') AS trang_thai_ton,
             k.ngay_cap_nhat
      FROM NGUYEN_LIEU nl
      JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh = dvt.ma_don_vi_tinh
      LEFT JOIN KHO_NGUYEN_LIEU k ON nl.ma_nguyen_lieu = k.ma_nguyen_lieu
      ${dieuKien}
      ORDER BY nl.ten_nguyen_lieu ASC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params,
    );
    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi getInventory:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu tồn kho" });
  }
};

// ============================================================
// PATCH /api/warehouse/inventory/:maNguyenLieu — đặt mức tồn tối thiểu
// ============================================================
const updateMinStock = async (req, res) => {
  try {
    const { maNguyenLieu } = req.params;
    const { muc_ton_toi_thieu } = req.body;

    if (muc_ton_toi_thieu === undefined || Number(muc_ton_toi_thieu) < 0) {
      return res.status(400).json({ message: "Mức tồn tối thiểu không hợp lệ" });
    }

    const [nlRows] = await pool.query(
      `SELECT ma_nguyen_lieu FROM NGUYEN_LIEU WHERE ma_nguyen_lieu = ?`,
      [maNguyenLieu],
    );
    if (nlRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    }

    const [khoRows] = await pool.query(
      `SELECT so_luong_ton FROM KHO_NGUYEN_LIEU WHERE ma_nguyen_lieu = ?`,
      [maNguyenLieu],
    );

    const mucMoi = Number(muc_ton_toi_thieu);
    if (khoRows.length === 0) {
      const trangThai = tinhTrangThaiTon(0, mucMoi);
      await pool.query(
        `INSERT INTO KHO_NGUYEN_LIEU (ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton)
         VALUES (?, 0, ?, ?)`,
        [maNguyenLieu, mucMoi, trangThai],
      );
    } else {
      const trangThai = tinhTrangThaiTon(Number(khoRows[0].so_luong_ton), mucMoi);
      await pool.query(
        `UPDATE KHO_NGUYEN_LIEU SET muc_ton_toi_thieu=?, trang_thai_ton=? WHERE ma_nguyen_lieu=?`,
        [mucMoi, trangThai, maNguyenLieu],
      );
    }
    res.json({ message: "Cập nhật mức tồn tối thiểu thành công" });
  } catch (err) {
    console.error("Lỗi updateMinStock:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật mức tồn tối thiểu" });
  }
};

// ============================================================
// GET /api/warehouse/imports — danh sách phiếu nhập kho
// ============================================================
const getImportReceipts = async (req, res) => {
  try {
    const tuNgay = req.query.tu_ngay || "";
    const denNgay = req.query.den_ngay || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (tuNgay) {
      conditions.push(`pn.ngay_nhap >= ?`);
      params.push(`${tuNgay} 00:00:00`);
    }
    if (denNgay) {
      conditions.push(`pn.ngay_nhap <= ?`);
      params.push(`${denNgay} 23:59:59`);
    }
    const dieuKien = conditions.length ? `WHERE ` + conditions.join(` AND `) : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM PHIEU_NHAP_KHO pn ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT pn.ma_phieu_nhap, pn.ngay_nhap, pn.tong_tien, pn.ghi_chu,
             ncc.ten_nha_cung_cap, nv.ho_ten AS ten_nv_lap
      FROM PHIEU_NHAP_KHO pn
      JOIN NHA_CUNG_CAP ncc ON pn.ma_nha_cung_cap = ncc.ma_nha_cung_cap
      JOIN NHAN_VIEN nv ON pn.ma_nhan_vien_lap = nv.ma_nhan_vien
      ${dieuKien}
      ORDER BY pn.ngay_nhap DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params,
    );
    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi getImportReceipts:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách phiếu nhập" });
  }
};

// GET /api/warehouse/imports/:id
const getImportReceiptDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [pnRows] = await pool.query(
      `
      SELECT pn.ma_phieu_nhap, pn.ngay_nhap, pn.tong_tien, pn.ghi_chu,
             pn.ma_nha_cung_cap, ncc.ten_nha_cung_cap, nv.ho_ten AS ten_nv_lap
      FROM PHIEU_NHAP_KHO pn
      JOIN NHA_CUNG_CAP ncc ON pn.ma_nha_cung_cap = ncc.ma_nha_cung_cap
      JOIN NHAN_VIEN nv ON pn.ma_nhan_vien_lap = nv.ma_nhan_vien
      WHERE pn.ma_phieu_nhap = ?
      `,
      [id],
    );
    if (pnRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    const [items] = await pool.query(
      `
      SELECT ct.ma_chi_tiet_nhap, ct.ma_nguyen_lieu, nl.ten_nguyen_lieu, dvt.ten_don_vi_tinh,
             ct.so_luong_nhap, ct.don_gia_nhap, ct.thanh_tien, ct.ghi_chu
      FROM CHI_TIET_NHAP_KHO ct
      JOIN NGUYEN_LIEU nl ON ct.ma_nguyen_lieu = nl.ma_nguyen_lieu
      JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh = dvt.ma_don_vi_tinh
      WHERE ct.ma_phieu_nhap = ?
      `,
      [id],
    );
    res.json({ phieuNhap: pnRows[0], items });
  } catch (err) {
    console.error("Lỗi getImportReceiptDetail:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết phiếu nhập" });
  }
};

// POST /api/warehouse/imports — lập phiếu nhập kho
const createImportReceipt = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { ma_nha_cung_cap, ngay_nhap, ghi_chu, items } = req.body;
    const ma_nhan_vien = req.user.ma_nhan_vien;

    if (!ma_nha_cung_cap || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Vui lòng chọn nhà cung cấp và thêm ít nhất 1 nguyên liệu",
      });
    }
    for (const item of items) {
      if (
        !item.ma_nguyen_lieu ||
        !item.so_luong_nhap ||
        Number(item.so_luong_nhap) <= 0 ||
        item.don_gia_nhap === undefined ||
        Number(item.don_gia_nhap) < 0
      ) {
        return res.status(400).json({
          message: "Mỗi nguyên liệu phải có số lượng > 0 và đơn giá hợp lệ",
        });
      }
    }
    const maNlDung = items.map((i) => i.ma_nguyen_lieu);
    if (new Set(maNlDung).size !== maNlDung.length) {
      return res.status(400).json({
        message: "Không được chọn trùng nguyên liệu trong 1 phiếu nhập",
      });
    }

    const [nccRows] = await conn.query(
      `SELECT trang_thai FROM NHA_CUNG_CAP WHERE ma_nha_cung_cap = ?`,
      [ma_nha_cung_cap],
    );
    if (nccRows.length === 0) {
      return res.status(400).json({ message: "Nhà cung cấp không tồn tại" });
    }
    if (nccRows[0].trang_thai !== "Hoat_dong") {
      return res.status(400).json({
        message: "Nhà cung cấp đang ngừng hợp tác, không thể lập phiếu nhập",
      });
    }

    const [nlCheck] = await conn.query(
      `SELECT ma_nguyen_lieu, ten_nguyen_lieu, trang_thai FROM NGUYEN_LIEU WHERE ma_nguyen_lieu IN (?)`,
      [maNlDung],
    );
    if (nlCheck.length !== maNlDung.length) {
      return res.status(400).json({ message: "Có nguyên liệu không tồn tại trong hệ thống" });
    }

    await conn.beginTransaction();

    const tongTien = items.reduce(
      (sum, i) => sum + Number(i.so_luong_nhap) * Number(i.don_gia_nhap),
      0,
    );

    const [pnResult] = await conn.query(
      `INSERT INTO PHIEU_NHAP_KHO (ma_nha_cung_cap, ma_nhan_vien_lap, ngay_nhap, tong_tien, ghi_chu)
       VALUES (?, ?, ?, ?, ?)`,
      [ma_nha_cung_cap, ma_nhan_vien, ngay_nhap || new Date(), tongTien, ghi_chu || null],
    );
    const maPhieuNhap = pnResult.insertId;

    for (const item of items) {
      const soLuong = Number(item.so_luong_nhap);
      const donGia = Number(item.don_gia_nhap);
      const thanhTien = soLuong * donGia;

      await conn.query(
        `INSERT INTO CHI_TIET_NHAP_KHO (ma_phieu_nhap, ma_nguyen_lieu, so_luong_nhap, don_gia_nhap, thanh_tien, ghi_chu)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [maPhieuNhap, item.ma_nguyen_lieu, soLuong, donGia, thanhTien, item.ghi_chu || null],
      );

      const [khoRows] = await conn.query(
        `SELECT so_luong_ton, muc_ton_toi_thieu FROM KHO_NGUYEN_LIEU WHERE ma_nguyen_lieu = ? FOR UPDATE`,
        [item.ma_nguyen_lieu],
      );

      if (khoRows.length === 0) {
        const trangThai = tinhTrangThaiTon(soLuong, 0);
        await conn.query(
          `INSERT INTO KHO_NGUYEN_LIEU (ma_nguyen_lieu, so_luong_ton, muc_ton_toi_thieu, trang_thai_ton)
           VALUES (?, ?, 0, ?)`,
          [item.ma_nguyen_lieu, soLuong, trangThai],
        );
      } else {
        const tonMoi = Number(khoRows[0].so_luong_ton) + soLuong;
        const mucToiThieu = Number(khoRows[0].muc_ton_toi_thieu);
        const trangThai = tinhTrangThaiTon(tonMoi, mucToiThieu);
        await conn.query(
          `UPDATE KHO_NGUYEN_LIEU SET so_luong_ton=?, trang_thai_ton=? WHERE ma_nguyen_lieu=?`,
          [tonMoi, trangThai, item.ma_nguyen_lieu],
        );
      }
    }

    await conn.commit();
    res.status(201).json({
      ma_phieu_nhap: maPhieuNhap,
      message: "Nhập kho thành công",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi createImportReceipt:", err.message);
    res.status(500).json({ message: "Lỗi server khi lập phiếu nhập kho" });
  } finally {
    conn.release();
  }
};

// ============================================================
// GET /api/warehouse/exports — danh sách phiếu xuất kho
// ============================================================
const getExportReceipts = async (req, res) => {
  try {
    const tuNgay = req.query.tu_ngay || "";
    const denNgay = req.query.den_ngay || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (tuNgay) {
      conditions.push(`px.ngay_xuat >= ?`);
      params.push(`${tuNgay} 00:00:00`);
    }
    if (denNgay) {
      conditions.push(`px.ngay_xuat <= ?`);
      params.push(`${denNgay} 23:59:59`);
    }
    const dieuKien = conditions.length ? `WHERE ` + conditions.join(` AND `) : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM PHIEU_XUAT_KHO px ${dieuKien}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT px.ma_phieu_xuat, px.ngay_xuat, px.ly_do_xuat, px.trang_thai, px.ghi_chu,
             nv.ho_ten AS ten_nv_lap
      FROM PHIEU_XUAT_KHO px
      JOIN NHAN_VIEN nv ON px.ma_nhan_vien_lap = nv.ma_nhan_vien
      ${dieuKien}
      ORDER BY px.ngay_xuat DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params,
    );
    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi getExportReceipts:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách phiếu xuất" });
  }
};

// GET /api/warehouse/exports/:id
const getExportReceiptDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [pxRows] = await pool.query(
      `
      SELECT px.ma_phieu_xuat, px.ngay_xuat, px.ly_do_xuat, px.trang_thai, px.ghi_chu,
             nv.ho_ten AS ten_nv_lap
      FROM PHIEU_XUAT_KHO px
      JOIN NHAN_VIEN nv ON px.ma_nhan_vien_lap = nv.ma_nhan_vien
      WHERE px.ma_phieu_xuat = ?
      `,
      [id],
    );
    if (pxRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phiếu xuất" });
    }

    const [items] = await pool.query(
      `
      SELECT ct.ma_chi_tiet_xuat, ct.ma_nguyen_lieu, nl.ten_nguyen_lieu, dvt.ten_don_vi_tinh,
             ct.so_luong_xuat, ct.ghi_chu
      FROM CHI_TIET_XUAT_KHO ct
      JOIN NGUYEN_LIEU nl ON ct.ma_nguyen_lieu = nl.ma_nguyen_lieu
      JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh = dvt.ma_don_vi_tinh
      WHERE ct.ma_phieu_xuat = ?
      `,
      [id],
    );
    res.json({ phieuXuat: pxRows[0], items });
  } catch (err) {
    console.error("Lỗi getExportReceiptDetail:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết phiếu xuất" });
  }
};

// POST /api/warehouse/exports — lập phiếu xuất kho
const createExportReceipt = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { ngay_xuat, ly_do_xuat, ghi_chu, items } = req.body;
    const ma_nhan_vien = req.user.ma_nhan_vien;

    if (!["Hu_hong", "Dieu_chinh", "Khac"].includes(ly_do_xuat)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Vui lòng thêm ít nhất 1 nguyên liệu cần xuất" });
    }
    for (const item of items) {
      if (!item.ma_nguyen_lieu || !item.so_luong_xuat || Number(item.so_luong_xuat) <= 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
      }
    }
    const maNlDung = items.map((i) => i.ma_nguyen_lieu);
    if (new Set(maNlDung).size !== maNlDung.length) {
      return res.status(400).json({
        message: "Không được chọn trùng nguyên liệu trong 1 phiếu xuất",
      });
    }

    await conn.beginTransaction();

    // Khóa các dòng kho liên quan, kiểm tra đủ tồn trước khi trừ
    const khoMap = new Map();
    for (const item of items) {
      const [khoRows] = await conn.query(
        `SELECT so_luong_ton, muc_ton_toi_thieu, ten_nguyen_lieu FROM KHO_NGUYEN_LIEU k
         JOIN NGUYEN_LIEU nl ON k.ma_nguyen_lieu = nl.ma_nguyen_lieu
         WHERE k.ma_nguyen_lieu = ? FOR UPDATE`,
        [item.ma_nguyen_lieu],
      );
      if (khoRows.length === 0 || Number(khoRows[0].so_luong_ton) < Number(item.so_luong_xuat)) {
        await conn.rollback();
        const ten = khoRows[0]?.ten_nguyen_lieu || `NL#${item.ma_nguyen_lieu}`;
        return res.status(400).json({
          message: `Số lượng tồn kho không đủ để xuất cho nguyên liệu "${ten}"`,
        });
      }
      khoMap.set(item.ma_nguyen_lieu, khoRows[0]);
    }

    const [pxResult] = await conn.query(
      `INSERT INTO PHIEU_XUAT_KHO (ma_nhan_vien_lap, ngay_xuat, ly_do_xuat, ghi_chu)
       VALUES (?, ?, ?, ?)`,
      [ma_nhan_vien, ngay_xuat || new Date(), ly_do_xuat, ghi_chu || null],
    );
    const maPhieuXuat = pxResult.insertId;

    for (const item of items) {
      const soLuong = Number(item.so_luong_xuat);
      await conn.query(
        `INSERT INTO CHI_TIET_XUAT_KHO (ma_phieu_xuat, ma_nguyen_lieu, so_luong_xuat, ghi_chu)
         VALUES (?, ?, ?, ?)`,
        [maPhieuXuat, item.ma_nguyen_lieu, soLuong, item.ghi_chu || null],
      );

      const kho = khoMap.get(item.ma_nguyen_lieu);
      const tonMoi = Number(kho.so_luong_ton) - soLuong;
      const trangThai = tinhTrangThaiTon(tonMoi, Number(kho.muc_ton_toi_thieu));
      await conn.query(
        `UPDATE KHO_NGUYEN_LIEU SET so_luong_ton=?, trang_thai_ton=? WHERE ma_nguyen_lieu=?`,
        [tonMoi, trangThai, item.ma_nguyen_lieu],
      );
    }

    await conn.commit();
    res.status(201).json({
      ma_phieu_xuat: maPhieuXuat,
      message: "Xuất kho thành công",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi createExportReceipt:", err.message);
    res.status(500).json({ message: "Lỗi server khi lập phiếu xuất kho" });
  } finally {
    conn.release();
  }
};

module.exports = {
  getInventory,
  updateMinStock,
  getImportReceipts,
  getImportReceiptDetail,
  createImportReceipt,
  getExportReceipts,
  getExportReceiptDetail,
  createExportReceipt,
};
