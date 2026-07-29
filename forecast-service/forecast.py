import logging

import pandas as pd
from prophet import Prophet

from db import lay_danh_sach_nguyen_lieu, lay_lich_su_tieu_thu

# Prophet tự log khá nhiều (cmdstanpy) — hạ mức log để không rối console
logging.getLogger("cmdstanpy").setLevel(logging.WARNING)
logging.getLogger("prophet").setLevel(logging.WARNING)

# Số điểm dữ liệu tối thiểu để Prophet cho ra dự báo có ý nghĩa. Ít hơn mức
# này thì fit mô hình dễ ra kết quả vô nghĩa/lỗi, nên fallback qua công thức
# trung bình đơn giản thay vì cố chạy Prophet.
SO_NGAY_TOI_THIEU = 14


def _du_bao_theo_trung_binh(chuoi_ngay, so_ngay_can_du_bao):
    """Fallback khi chưa đủ lịch sử cho Prophet: lấy trung bình/ngày nhân số ngày cần dự báo."""
    if len(chuoi_ngay) == 0:
        return 0.0
    trung_binh_ngay = sum(x["y"] for x in chuoi_ngay) / len(chuoi_ngay)
    return round(trung_binh_ngay * so_ngay_can_du_bao, 1)


def _du_bao_bang_prophet(chuoi_ngay, so_ngay_can_du_bao):
    df = pd.DataFrame(chuoi_ngay)
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=True,
        daily_seasonality=False,
    )
    model.fit(df)

    tuong_lai = model.make_future_dataframe(periods=so_ngay_can_du_bao)
    du_bao = model.predict(tuong_lai)

    # Chỉ lấy đúng so_ngay_can_du_bao dòng cuối (những ngày tương lai vừa thêm)
    phan_tuong_lai = du_bao.tail(so_ngay_can_du_bao)
    tong = phan_tuong_lai["yhat"].clip(lower=0).sum()
    return round(float(tong), 1)


def chay_du_bao(so_ngay):
    """
    Trả về danh sách dự báo nhu cầu từng nguyên liệu trong `so_ngay` ngày tới.
    Với nguyên liệu có đủ lịch sử (>= SO_NGAY_TOI_THIEU điểm dữ liệu): dùng Prophet.
    Với nguyên liệu ít/chưa có lịch sử: dùng trung bình đơn giản (fallback).
    """
    nguyen_lieu_list = lay_danh_sach_nguyen_lieu()
    lich_su = lay_lich_su_tieu_thu()

    # Gom lịch sử theo từng nguyên liệu: { ma_nguyen_lieu: [{ds, y}, ...] }
    theo_nguyen_lieu = {}
    for row in lich_su:
        ma = row["ma_nguyen_lieu"]
        theo_nguyen_lieu.setdefault(ma, []).append(
            {"ds": row["ngay"], "y": float(row["so_luong_tieu_thu"])}
        )

    ket_qua = []
    for nl in nguyen_lieu_list:
        ma = nl["ma_nguyen_lieu"]
        chuoi_ngay = theo_nguyen_lieu.get(ma, [])

        da_tieu_thu_gan_day = round(
            sum(x["y"] for x in chuoi_ngay[-so_ngay:]), 1
        )

        if len(chuoi_ngay) >= SO_NGAY_TOI_THIEU:
            try:
                du_kien_can = _du_bao_bang_prophet(chuoi_ngay, so_ngay)
            except Exception as err:  # Prophet fit lỗi (dữ liệu bất thường...) -> fallback an toàn
                logging.warning("Prophet lỗi với nguyên liệu %s: %s", ma, err)
                du_kien_can = _du_bao_theo_trung_binh(chuoi_ngay, so_ngay)
        else:
            du_kien_can = _du_bao_theo_trung_binh(chuoi_ngay, so_ngay)

        ton_hien_tai = float(nl["ton_hien_tai"])
        muc_ton_toi_thieu = float(nl["muc_ton_toi_thieu"])
        so_diem_lich_su = len(chuoi_ngay)

        if so_diem_lich_su > 0:
            # Có dữ liệu thật (dù ít) vẫn là tín hiệu tốt hơn không có gì
            # -> tin vào so sánh tồn kho với nhu cầu dự kiến
            can_nhap_them = ton_hien_tai - du_kien_can < 0
        else:
            # Hoàn toàn chưa có lịch sử (du_kien_can chắc chắn = 0, vô nghĩa)
            # -> dựa vào mức tồn tối thiểu đã cấu hình sẵn trong kho
            can_nhap_them = ton_hien_tai <= muc_ton_toi_thieu

        ket_qua.append(
            {
                "ma_nguyen_lieu": ma,
                "ten_nguyen_lieu": nl["ten_nguyen_lieu"],
                "don_vi_tinh": nl["ten_don_vi_tinh"],
                "ton_hien_tai": ton_hien_tai,
                "da_tieu_thu": da_tieu_thu_gan_day,
                "du_kien_can": du_kien_can,
                "chenh_lech": round(ton_hien_tai - du_kien_can, 1),
                "can_nhap_them": can_nhap_them,
                "so_diem_lich_su": so_diem_lich_su,
            }
        )

    return ket_qua
