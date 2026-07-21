const pool = require('../config/db');
const bus = require('../events/socketBus');

// GET /api/cashier/bills — danh sách hóa đơn theo trạng thái
// Query: ?trang_thai=Cho_thanh_toan hoặc Dang_phuc_vu
const getBills = async (req, res) => {
  try {
    const trangThai = req.query.trang_thai || 'Cho_thanh_toan';
    if (!['Cho_thanh_toan', 'Dang_phuc_vu'].includes(trangThai)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const [rows] = await pool.query(
      `SELECT hd.ma_hoa_don, hd.ma_ban, b.ten_ban, kv.ten_khu_vuc,
              hd.thoi_gian_mo_ban, hd.tong_tien_truoc_giam, hd.tong_tien_thanh_toan,
              hd.trang_thai,
              (SELECT COUNT(*) FROM CHI_TIET_HOA_DON ct
               WHERE ct.ma_hoa_don = hd.ma_hoa_don AND ct.trang_thai != 'Da_huy') AS so_mon
       FROM HOA_DON hd
       JOIN BAN b ON hd.ma_ban = b.ma_ban
       JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
       WHERE hd.trang_thai = ?
       ORDER BY hd.thoi_gian_mo_ban ASC`,
      [trangThai]
    );
    res.json(rows);
  } catch (err) {
    console.error('Lỗi getBills:', err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// GET /api/cashier/bills/:id — chi tiết 1 hóa đơn đầy đủ
const getBillDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [hdRows] = await pool.query(
      `SELECT hd.ma_hoa_don, hd.ma_ban, b.ten_ban, kv.ten_khu_vuc,
              hd.thoi_gian_mo_ban, hd.thoi_gian_dong_ban,
              hd.tong_tien_truoc_giam, hd.tien_giam_gia, hd.tong_tien_thanh_toan,
              hd.hinh_thuc_thanh_toan, hd.trang_thai,
              hd.ma_nhan_vien_thu_ngan, nv.ho_ten AS ten_thu_ngan
       FROM HOA_DON hd
       JOIN BAN b ON hd.ma_ban = b.ma_ban
       JOIN KHU_VUC kv ON b.ma_khu_vuc = kv.ma_khu_vuc
       LEFT JOIN NHAN_VIEN nv ON hd.ma_nhan_vien_thu_ngan = nv.ma_nhan_vien
       WHERE hd.ma_hoa_don = ?`,
      [id]
    );
    if (hdRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    const [items] = await pool.query(
      `SELECT ct.ma_chi_tiet_hd, ct.ma_mon_an, m.ten_mon_an,
              ct.so_luong, ct.don_gia_tai_thoi_diem_goi, ct.thanh_tien,
              ct.ghi_chu, ct.trang_thai, ct.nguon_goi_mon,
              ct.thoi_gian_goi_mon,
              nv.ho_ten AS ten_nv_goi
       FROM CHI_TIET_HOA_DON ct
       JOIN MON_AN m ON ct.ma_mon_an = m.ma_mon_an
       LEFT JOIN NHAN_VIEN nv ON ct.ma_nv_xac_nhan = nv.ma_nhan_vien
       WHERE ct.ma_hoa_don = ?
       ORDER BY ct.thoi_gian_goi_mon ASC`,
      [id]
    );

    res.json({ hoaDon: hdRows[0], items });
  } catch (err) {
    console.error('Lỗi getBillDetail:', err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /api/cashier/bills/:id/pay — thu ngân chốt thanh toán
// Body: { hinh_thuc_thanh_toan: 'Tien_mat' | 'Chuyen_khoan' }
const payBill = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { hinh_thuc_thanh_toan } = req.body;
    const ma_nhan_vien = req.user.ma_nhan_vien;

    if (!['Tien_mat', 'Chuyen_khoan'].includes(hinh_thuc_thanh_toan)) {
      return res.status(400).json({ message: 'Hình thức thanh toán không hợp lệ' });
    }

    await conn.beginTransaction();

    // Khóa dòng hóa đơn
    const [hdRows] = await conn.query(
      `SELECT trang_thai, ma_ban, tong_tien_thanh_toan
       FROM HOA_DON WHERE ma_hoa_don = ? FOR UPDATE`,
      [id]
    );
    if (hdRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }
    const hd = hdRows[0];

    if (hd.trang_thai === 'Da_thanh_toan') {
      await conn.rollback();
      return res.status(409).json({ message: 'Hóa đơn đã thanh toán trước đó' });
    }
    if (hd.trang_thai === 'Da_huy') {
      await conn.rollback();
      return res.status(409).json({ message: 'Hóa đơn đã bị hủy' });
    }

    // Kiểm tra không còn món chưa xong (đảm bảo bếp làm xong hết mới thanh toán)
    const [chuaXong] = await conn.query(
      `SELECT COUNT(*) AS so_mon FROM CHI_TIET_HOA_DON
       WHERE ma_hoa_don = ? AND trang_thai IN ('Cho_xac_nhan', 'Dang_che_bien')`,
      [id]
    );
    if (chuaXong[0].so_mon > 0) {
      await conn.rollback();
      return res.status(409).json({
        message: `Còn ${chuaXong[0].so_mon} món chưa hoàn thành. Vui lòng chờ bếp xử lý xong.`,
      });
    }

    // Cập nhật hóa đơn
    await conn.query(
      `UPDATE HOA_DON
       SET trang_thai = 'Da_thanh_toan',
           hinh_thuc_thanh_toan = ?,
           ma_nhan_vien_thu_ngan = ?,
           thoi_gian_dong_ban = NOW()
       WHERE ma_hoa_don = ?`,
      [hinh_thuc_thanh_toan, ma_nhan_vien, id]
    );

    // Đóng bàn: trả về Trống, xóa phiên
    await conn.query(
      `UPDATE BAN SET trang_thai = 'Trong', phien_token_hien_tai = NULL
       WHERE ma_ban = ?`,
      [hd.ma_ban]
    );

    await conn.commit();

    bus.emit('server:bill-paid', {
      ma_hoa_don: id,
      ma_ban: hd.ma_ban,
      tong_tien: hd.tong_tien_thanh_toan,
    });

    res.json({
      message: `Đã thanh toán hóa đơn #${id}`,
      tong_tien: hd.tong_tien_thanh_toan,
    });
  } catch (err) {
    await conn.rollback();
    console.error('Lỗi payBill:', err.message);
    res.status(500).json({ message: 'Lỗi server khi thanh toán' });
  } finally {
    conn.release();
  }
};

module.exports = { getBills, getBillDetail, payBill };