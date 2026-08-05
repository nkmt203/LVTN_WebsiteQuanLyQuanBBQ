import logging
from datetime import date

import pandas as pd
from prophet import Prophet

from db import lay_danh_sach_nguyen_lieu, lay_lich_su_tieu_thu

logging.getLogger("cmdstanpy").setLevel(logging.WARNING)
logging.getLogger("prophet").setLevel(logging.WARNING)

# Số ngày lịch tối thiểu để Prophet cho ra dự báo
SO_NGAY_TOI_THIEU = 14

# pandas Timestamp.dayofweek: Thứ 2 = 0 ... Chủ nhật = 6
TEN_THU = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

# Số ngày đối chiếu theo Thứ: thực tế lấy tuần liền trước, dự báo lấy tuần liền sau
SO_NGAY_DOI_CHIEU_THEO_THU = 7


def _dien_ngay_trong(chuoi_ngay):
    """Điền 0 vào ngày không bán để có chuỗi liên tục theo lịch — nếu không, ngày
    trống bị hiểu nhầm là "không tồn tại" thay vì "tiêu thụ = 0", làm sai lệch
    trung bình lẫn Prophet."""
    df = pd.DataFrame(chuoi_ngay)
    df["ds"] = pd.to_datetime(df["ds"])
    day_du = pd.date_range(df["ds"].min(), df["ds"].max(), freq="D")
    return (
        df.set_index("ds")
        .reindex(day_du, fill_value=0.0)
        .rename_axis("ds")
        .reset_index()
    )


def _du_bao_theo_trung_binh(gia_tri_hang_ngay, so_ngay_can_du_bao):
    """Fallback khi chưa đủ lịch sử cho Prophet: lấy trung bình/ngày nhân số ngày cần dự báo."""
    if len(gia_tri_hang_ngay) == 0:
        return 0.0
    trung_binh_ngay = sum(gia_tri_hang_ngay) / len(gia_tri_hang_ngay)
    return round(trung_binh_ngay * so_ngay_can_du_bao, 1)


def _du_bao_bang_prophet(df_day_du, so_ngay_can_du_bao):
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=True,
        daily_seasonality=False,
    )
    model.fit(df_day_du[["ds", "y"]])

    so_ngay_du_bao_thuc = max(so_ngay_can_du_bao, SO_NGAY_DOI_CHIEU_THEO_THU)

    # Neo cửa sổ dự báo theo HÔM NAY THẬT, không phải ngày cuối lịch sử — mỗi
    # nguyên liệu có thể "dừng" bán ở ngày khác nhau nên cần bù chênh lệch.
    hom_nay = pd.Timestamp(date.today())
    ngay_cuoi_lich_su = df_day_du["ds"].max()
    so_ngay_bu_chenh_lech = max((hom_nay - ngay_cuoi_lich_su).days, 0)

    tuong_lai = model.make_future_dataframe(periods=so_ngay_bu_chenh_lech + so_ngay_du_bao_thuc)
    du_bao = model.predict(tuong_lai)

    # Bỏ phần bù chênh lệch, chỉ giữ so_ngay_du_bao_thuc ngày đầu tính từ hôm nay.
    tuong_lai_toan_bo = du_bao[du_bao["ds"] >= hom_nay].head(so_ngay_du_bao_thuc)

    # Số cần nhập theo đúng so_ngay người dùng chọn
    phan_tuong_lai = tuong_lai_toan_bo.head(so_ngay_can_du_bao).copy()
    phan_tuong_lai["yhat"] = phan_tuong_lai["yhat"].clip(lower=0).round(1)
    phan_tuong_lai["yhat_lower"] = phan_tuong_lai["yhat_lower"].clip(lower=0).round(1)
    phan_tuong_lai["yhat_upper"] = phan_tuong_lai["yhat_upper"].clip(lower=0).round(1)
    tong = round(float(phan_tuong_lai["yhat"].sum()), 1)

    # Kèm khoảng tin cậy Prophet tự tính (yhat_lower/yhat_upper)
    phan_tuong_lai["thu"] = phan_tuong_lai["ds"].dt.dayofweek
    du_bao_tuan_toi = [
        {
            "ngay": row.ds.strftime("%Y-%m-%d"),
            "thu": TEN_THU[row.thu],
            "du_bao": float(row.yhat),
            "thap": float(row.yhat_lower),
            "cao": float(row.yhat_upper),
        }
        for row in phan_tuong_lai.itertuples()
    ]

    # Dự báo theo Thứ của tuần liền sau (1 lần/Thứ) để so 1-1 với thực tế bên dưới.
    theo_thu_tuong_lai = tuong_lai_toan_bo.copy()
    theo_thu_tuong_lai["yhat"] = theo_thu_tuong_lai["yhat"].clip(lower=0)
    theo_thu_tuong_lai["thu"] = theo_thu_tuong_lai["ds"].dt.dayofweek
    du_bao_theo_thu = theo_thu_tuong_lai.groupby("thu")["yhat"].mean()

    # Thực tế theo Thứ của tuần liền trước (không qua mô hình) để đối chiếu với dự báo.
    df_gan_day = df_day_du.tail(SO_NGAY_DOI_CHIEU_THEO_THU).copy()
    df_gan_day["thu"] = df_gan_day["ds"].dt.dayofweek
    thuc_te_theo_thu = df_gan_day.groupby("thu")["y"].mean()

    theo_thu = [
        {
            "thu": TEN_THU[i],
            "du_bao": round(float(du_bao_theo_thu.get(i, 0.0)), 1),
            "thuc_te": round(float(thuc_te_theo_thu.get(i, 0.0)), 1),
        }
        for i in range(7)
    ]

    return tong, theo_thu, du_bao_tuan_toi


def chay_du_bao(so_ngay):
    """
    Trả về danh sách dự báo nhu cầu từng nguyên liệu trong `so_ngay` ngày tới.
    Với nguyên liệu có đủ lịch sử (>= SO_NGAY_TOI_THIEU ngày lịch): dùng Prophet,
    kèm bảng đối chiếu dự báo vs thực tế theo từng Thứ trong tuần.
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

        df_day_du = _dien_ngay_trong(chuoi_ngay) if chuoi_ngay else None
        so_ngay_lich_su = len(df_day_du) if df_day_du is not None else 0

        # so_ngay ngày lịch gần nhất (kể cả ngày 0), khớp nghĩa với "Dự kiến cần trong so_ngay ngày tới".
        da_tieu_thu_gan_day = (
            round(float(df_day_du["y"].tail(so_ngay).sum()), 1) if df_day_du is not None else 0.0
        )

        phuong_phap = "Trung bình"
        theo_thu = None
        du_bao_tuan_toi = None
        if so_ngay_lich_su >= SO_NGAY_TOI_THIEU:
            try:
                du_kien_can, theo_thu, du_bao_tuan_toi = _du_bao_bang_prophet(df_day_du, so_ngay)
                phuong_phap = "Prophet (AI)"
            except Exception as err:  # Prophet fit lỗi (dữ liệu bất thường...) -> fallback an toàn
                logging.warning("Prophet lỗi với nguyên liệu %s: %s", ma, err)
                du_kien_can = _du_bao_theo_trung_binh(df_day_du["y"].tolist(), so_ngay)
        else:
            gia_tri_hang_ngay = (
                df_day_du["y"].tolist() if df_day_du is not None else []
            )
            du_kien_can = _du_bao_theo_trung_binh(gia_tri_hang_ngay, so_ngay)

        ton_hien_tai = float(nl["ton_hien_tai"])
        muc_ton_toi_thieu = float(nl["muc_ton_toi_thieu"])

        if len(chuoi_ngay) > 0:
            can_nhap_them = ton_hien_tai - du_kien_can < 0
        else:
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
                "phuong_phap": phuong_phap,
                "theo_thu": theo_thu,
                "du_bao_tuan_toi": du_bao_tuan_toi,
                "so_diem_lich_su": so_ngay_lich_su,
            }
        )

    return ket_qua
