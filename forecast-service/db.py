import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    # DB_SSL_CA_PATH chỉ có khi dùng DB online (Aiven, bắt buộc SSL).
    # Chạy WAMP local thì không set biến này, bỏ qua ssl như trước giờ.
    ssl_ca = os.getenv("DB_SSL_CA_PATH")
    kwargs = {"ssl_ca": ssl_ca} if ssl_ca else {}

    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", "3306")),
        **kwargs,
    )


def lay_danh_sach_nguyen_lieu():
    """Toàn bộ nguyên liệu đang hoạt động, kèm tồn kho hiện tại và đơn vị tính."""
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT nl.ma_nguyen_lieu, nl.ten_nguyen_lieu,
                   dvt.ten_don_vi_tinh,
                   COALESCE(k.so_luong_ton, 0) AS ton_hien_tai
            FROM NGUYEN_LIEU nl
            JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh = dvt.ma_don_vi_tinh
            LEFT JOIN KHO_NGUYEN_LIEU k ON nl.ma_nguyen_lieu = k.ma_nguyen_lieu
            WHERE nl.trang_thai = 'Hoat_dong'
            """
        )
        return cur.fetchall()
    finally:
        conn.close()


def lay_lich_su_tieu_thu():
    """
    Lịch sử tiêu thụ nguyên liệu theo từng ngày — quy đổi từ món đã hoàn thành
    (chi_tiet_hoa_don) qua định mức nguyên liệu/món (dinh_muc_nguyen_lieu).
    Trả về danh sách dict: {ma_nguyen_lieu, ngay, so_luong_tieu_thu}.
    """
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT dm.ma_nguyen_lieu,
                   DATE(ct.thoi_gian_hoan_thanh) AS ngay,
                   SUM(ct.so_luong * dm.so_luong_su_dung) AS so_luong_tieu_thu
            FROM CHI_TIET_HOA_DON ct
            JOIN DINH_MUC_NGUYEN_LIEU dm
              ON ct.ma_mon_an = dm.ma_mon_an AND dm.trang_thai = 'Hoat_dong'
            WHERE ct.trang_thai = 'Da_hoan_thanh'
              AND ct.thoi_gian_hoan_thanh IS NOT NULL
            GROUP BY dm.ma_nguyen_lieu, DATE(ct.thoi_gian_hoan_thanh)
            ORDER BY dm.ma_nguyen_lieu, ngay
            """
        )
        return cur.fetchall()
    finally:
        conn.close()
