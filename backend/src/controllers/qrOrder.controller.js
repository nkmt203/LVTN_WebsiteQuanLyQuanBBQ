const pool = require("../config/db");
const bus = require("../events/socketBus");

// Kiểm tra mã QR + (tuỳ chọn) mã phiên còn hợp lệ không — dùng chung cho mọi endpoint công khai
const kiemTraPhien = async (conn, qrCode, token) => {
  const [rows] = await conn.query(
    `SELECT ma_ban, ten_ban, trang_thai, phien_token_hien_tai
     FROM BAN WHERE qr_code_dinh_danh = ?`,
    [qrCode],
  );
  if (rows.length === 0) {
    return { ok: false, message: "Mã QR không hợp lệ" };
  }
  const ban = rows[0];
  if (ban.trang_thai !== "Dang_su_dung" || !ban.phien_token_hien_tai) {
    return {
      ok: false,
      message: "Bàn chưa sẵn sàng, vui lòng liên hệ nhân viên",
    };
  }
  if (token && ban.phien_token_hien_tai !== token) {
    return {
      ok: false,
      message: "Phiên đã hết hạn, vui lòng quét lại mã QR",
    };
  }
  return { ok: true, ban };
};

// GET /api/qr/:qrCode — Bước 1: khách quét QR, trả về thông tin bàn + phiên + thực đơn
const getQrSession = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const check = await kiemTraPhien(pool, qrCode, null);
    if (!check.ok) return res.status(403).json({ message: check.message });

    const [hdRows] = await pool.query(
      `SELECT ma_hoa_don FROM HOA_DON WHERE ma_ban = ? AND trang_thai = 'Dang_phuc_vu'
       ORDER BY ma_hoa_don DESC LIMIT 1`,
      [check.ban.ma_ban],
    );
    const [foods] = await pool.query(
      `SELECT m.ma_mon_an, m.ten_mon_an, m.ma_danh_muc, d.ten_danh_muc,
              m.gia_ban, m.mo_ta, m.hinh_anh_url
       FROM MON_AN m JOIN DANH_MUC d ON m.ma_danh_muc = d.ma_danh_muc
       WHERE m.trang_thai = 'Dang_kinh_doanh' AND d.trang_thai = 'Dang_su_dung'
       ORDER BY m.ma_danh_muc, m.ten_mon_an`,
    );
    const [categories] = await pool.query(
      `SELECT ma_danh_muc, ten_danh_muc FROM DANH_MUC
       WHERE trang_thai = 'Dang_su_dung' ORDER BY ten_danh_muc`,
    );

    res.json({
      ten_ban: check.ban.ten_ban,
      ma_ban: check.ban.ma_ban,
      ma_hoa_don: hdRows[0]?.ma_hoa_don ?? null,
      phien_token: check.ban.phien_token_hien_tai,
      foods,
      categories,
    });
  } catch (err) {
    console.error("Lỗi getQrSession:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/qr/:qrCode/bill?token=... — giỏ hàng hiện tại của bàn (nghiệp vụ
// 2.3.1.11.c C1 Bước 2: hiển thị lại các món đang chờ xác nhận/đang chế biến)
const getQrBill = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const { token } = req.query;
    const check = await kiemTraPhien(pool, qrCode, token);
    if (!check.ok) return res.status(403).json({ message: check.message });

    const [hdRows] = await pool.query(
      `SELECT ma_hoa_don FROM HOA_DON WHERE ma_ban = ? AND trang_thai = 'Dang_phuc_vu'
       ORDER BY ma_hoa_don DESC LIMIT 1`,
      [check.ban.ma_ban],
    );
    if (hdRows.length === 0) {
      return res.json({ ma_hoa_don: null, items: [] });
    }

    const [items] = await pool.query(
      `SELECT ct.ma_chi_tiet_hd, ct.ma_mon_an, mon.ten_mon_an, ct.so_luong,
              ct.don_gia_tai_thoi_diem_goi, ct.thanh_tien, ct.ghi_chu, ct.trang_thai,
              ct.thoi_gian_goi_mon
       FROM CHI_TIET_HOA_DON ct JOIN MON_AN mon ON ct.ma_mon_an = mon.ma_mon_an
       WHERE ct.ma_hoa_don = ?
       ORDER BY ct.thoi_gian_goi_mon ASC, ct.ma_chi_tiet_hd ASC`,
      [hdRows[0].ma_hoa_don],
    );
    res.json({ ma_hoa_don: hdRows[0].ma_hoa_don, items });
  } catch (err) {
    console.error("Lỗi getQrBill:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/qr/:qrCode/order — khách gửi yêu cầu gọi món (nghiệp vụ 2.3.1.11.a
// Bước 2-5, dùng chung cho cả gọi thêm món C1)
// Body: { token, items: [{ ma_mon_an, so_luong, ghi_chu }] }
const submitQrOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { qrCode } = req.params;
    const { token, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 món" });
    }
    for (const item of items) {
      if (!item.ma_mon_an || !item.so_luong || Number(item.so_luong) <= 0) {
        return res.status(400).json({ message: "Mỗi món phải có số lượng > 0" });
      }
    }

    await conn.beginTransaction();

    // Bước 3: kiểm tra lại mã phiên tại đúng thời điểm nhận yêu cầu (khóa dòng bàn)
    const [banRows] = await conn.query(
      `SELECT ma_ban, ten_ban, trang_thai, phien_token_hien_tai
       FROM BAN WHERE qr_code_dinh_danh = ? FOR UPDATE`,
      [qrCode],
    );
    if (
      banRows.length === 0 ||
      banRows[0].trang_thai !== "Dang_su_dung" ||
      banRows[0].phien_token_hien_tai !== token
    ) {
      await conn.rollback();
      return res
        .status(403)
        .json({ message: "Phiên đã hết hạn, vui lòng quét lại mã QR" });
    }
    const ban = banRows[0];

    const [hdRows] = await conn.query(
      `SELECT ma_hoa_don FROM HOA_DON WHERE ma_ban = ? AND trang_thai = 'Dang_phuc_vu'
       ORDER BY ma_hoa_don DESC LIMIT 1 FOR UPDATE`,
      [ban.ma_ban],
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: "Bàn chưa có hóa đơn đang phục vụ" });
    }
    const maHoaDon = hdRows[0].ma_hoa_don;

    // Bước 4: chỉ cho phép 1 yêu cầu "Chờ xác nhận" tồn tại tại 1 thời điểm cho mỗi bàn
    const [choXN] = await conn.query(
      `SELECT COUNT(*) AS soChoXN FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai = 'Cho_xac_nhan'`,
      [maHoaDon],
    );
    if (choXN[0].soChoXN > 0) {
      await conn.rollback();
      return res.status(409).json({
        message: "Yêu cầu trước chưa được xác nhận, vui lòng đợi trong giây lát",
      });
    }

    const monIds = items.map((i) => i.ma_mon_an);
    const [monRows] = await conn.query(
      `SELECT ma_mon_an, ten_mon_an, gia_ban, trang_thai FROM MON_AN WHERE ma_mon_an IN (?)`,
      [monIds],
    );
    const monMap = {};
    for (const m of monRows) monMap[m.ma_mon_an] = m;
    for (const item of items) {
      const mon = monMap[item.ma_mon_an];
      if (!mon) {
        await conn.rollback();
        return res.status(400).json({ message: `Món ID ${item.ma_mon_an} không tồn tại` });
      }
      if (mon.trang_thai !== "Dang_kinh_doanh") {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: `Món "${mon.ten_mon_an}" đã tạm ngừng kinh doanh` });
      }
    }

    // Bước 5: khởi tạo yêu cầu "Chờ xác nhận"
    const insertedItems = [];
    for (const item of items) {
      const mon = monMap[item.ma_mon_an];
      const donGia = Number(mon.gia_ban);
      const soLuong = Number(item.so_luong);
      const [ins] = await conn.query(
        `INSERT INTO CHI_TIET_HOA_DON
         (ma_hoa_don, ma_mon_an, so_luong, don_gia_tai_thoi_diem_goi, thanh_tien,
          ghi_chu, trang_thai, thoi_gian_goi_mon, nguon_goi_mon)
         VALUES (?,?,?,?,?,?, 'Cho_xac_nhan', NOW(), 'QR')`,
        [maHoaDon, item.ma_mon_an, soLuong, donGia, donGia * soLuong, item.ghi_chu || null],
      );
      insertedItems.push({
        ma_chi_tiet_hd: ins.insertId,
        ten_mon_an: mon.ten_mon_an,
        so_luong: soLuong,
        ghi_chu: item.ghi_chu || null,
      });
    }

    await conn.commit();

    bus.emit("qr:new-request", {
      ma_hoa_don: maHoaDon,
      ma_ban: ban.ma_ban,
      ten_ban: ban.ten_ban,
      items: insertedItems,
    });

    res.status(201).json({
      message: "Đã gửi yêu cầu gọi món, vui lòng chờ nhân viên xác nhận",
      items: insertedItems,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi submitQrOrder:", err.message);
    res.status(500).json({ message: "Lỗi server khi gửi yêu cầu gọi món" });
  } finally {
    conn.release();
  }
};

// DELETE /api/qr/:qrCode/order — khách tự hủy TOÀN BỘ yêu cầu đang "Chờ xác nhận"
// (nghiệp vụ 2.3.1.11.a Bước 2.1 + vẫn còn hiệu lực trong 15s ân hạn ở Bước 6 vì
// DB chưa đổi trạng thái cho tới khi hết giờ). Body: { token }
const cancelQrOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { qrCode } = req.params;
    const { token } = req.body;

    await conn.beginTransaction();
    const [banRows] = await conn.query(
      `SELECT ma_ban, ten_ban, trang_thai, phien_token_hien_tai
       FROM BAN WHERE qr_code_dinh_danh = ? FOR UPDATE`,
      [qrCode],
    );
    if (
      banRows.length === 0 ||
      banRows[0].trang_thai !== "Dang_su_dung" ||
      banRows[0].phien_token_hien_tai !== token
    ) {
      await conn.rollback();
      return res.status(403).json({ message: "Phiên đã hết hạn" });
    }
    const ban = banRows[0];

    const [hdRows] = await conn.query(
      `SELECT ma_hoa_don FROM HOA_DON WHERE ma_ban = ? AND trang_thai = 'Dang_phuc_vu'
       ORDER BY ma_hoa_don DESC LIMIT 1`,
      [ban.ma_ban],
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: "Bàn chưa có hóa đơn đang phục vụ" });
    }

    const [pending] = await conn.query(
      `SELECT ma_chi_tiet_hd FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai = 'Cho_xac_nhan' FOR UPDATE`,
      [hdRows[0].ma_hoa_don],
    );
    if (pending.length === 0) {
      await conn.rollback();
      return res.status(409).json({
        message: "Yêu cầu đã được nhân viên xử lý, không thể tự hủy. Vui lòng liên hệ nhân viên.",
      });
    }

    const ids = pending.map((r) => r.ma_chi_tiet_hd);
    await conn.query(`DELETE FROM CHI_TIET_HOA_DON WHERE ma_chi_tiet_hd IN (?)`, [ids]);
    await conn.commit();

    bus.emit("qr:order-self-cancelled", { ma_ban: ban.ma_ban, ma_chi_tiet_hd: ids });

    res.json({ message: "Đã hủy yêu cầu" });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi cancelQrOrder:", err.message);
    res.status(500).json({ message: "Lỗi server khi hủy yêu cầu" });
  } finally {
    conn.release();
  }
};

module.exports = {
  getQrSession,
  getQrBill,
  submitQrOrder,
  cancelQrOrder,
};
