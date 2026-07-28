import { useState } from "react";

// ============================================================
// GIAO DIỆN MINH HỌA (MOCK) — module "AI dự báo nhu cầu nguyên liệu"
// (nghiệp vụ 2.3.1.15). Toàn bộ dữ liệu trong file này là dữ liệu giả,
// KHÔNG có phân hệ dự báo/AI thật đứng sau. Khi triển khai module thật:
// xoá file này + dòng route "forecast" trong App.jsx + mục nav tương ứng
// trong AdminLayout.jsx.
// ============================================================

const RANGES = [
  { key: "7d", label: "7 ngày tới", days: 7 },
  { key: "week", label: "Tuần tới", days: 7 },
  { key: "month", label: "Tháng tới", days: 30 },
];

const INGREDIENTS = [
  { ten: "Thịt ba chỉ bò", dvt: "kg", ton: 160, base: 12, bienDong: 1.6 },
  { ten: "Ba rọi heo", dvt: "kg", ton: 65, base: 9, bienDong: 1.3 },
  { ten: "Sườn non", dvt: "kg", ton: 65, base: 7, bienDong: 1.1 },
  { ten: "Tôm sú", dvt: "kg", ton: 50, base: 5, bienDong: 1.8 },
  { ten: "Bắp Mỹ", dvt: "trái", ton: 230, base: 20, bienDong: 1.4 },
  { ten: "Nấm kim châm", dvt: "kg", ton: 30, base: 4, bienDong: 1.2 },
  { ten: "Rau cải", dvt: "kg", ton: 50, base: 6, bienDong: 1.0 },
  { ten: "Nước tương", dvt: "lít", ton: 30, base: 3, bienDong: 0.8 },
];

const BUOC_PHAN_TICH = [
  "Trích xuất lịch sử bán hàng...",
  "Phân tích chu kỳ tiêu thụ...",
  "Tính toán dự báo nguyên liệu...",
];

function tinhDuBao(days) {
  return INGREDIENTS.map((ing) => {
    // Đã tiêu thụ: ước tính dựa trên lịch sử kỳ trước (cùng độ dài kỳ)
    const daTieuThu = Math.round(ing.base * ing.bienDong * days * 0.92 * 10) / 10;
    // Dự kiến cần: mô hình dự báo áp xu hướng tăng nhẹ so với lịch sử
    const duKienCan = Math.round(ing.base * ing.bienDong * days * 1.05 * 10) / 10;
    const chenhLech = Math.round((ing.ton - duKienCan) * 10) / 10;
    return { ...ing, daTieuThu, duKienCan, chenhLech };
  });
}

function ForecastPage() {
  const [rangeKey, setRangeKey] = useState("7d");
  const [buocHienTai, setBuocHienTai] = useState(0);
  const [dangChay, setDangChay] = useState(false);
  const [ketQua, setKetQua] = useState(null);
  const range = RANGES.find((r) => r.key === rangeKey);

  const chonKhoang = (key) => {
    setRangeKey(key);
    setKetQua(null);
  };

  const chayDuBao = () => {
    setDangChay(true);
    setKetQua(null);
    setBuocHienTai(0);

    // Giả lập tiến trình phân tích của AI qua từng bước, rồi mới trả kết quả
    BUOC_PHAN_TICH.forEach((_, idx) => {
      setTimeout(() => setBuocHienTai(idx), idx * 550);
    });
    setTimeout(() => {
      const days = RANGES.find((r) => r.key === rangeKey).days;
      setKetQua(tinhDuBao(days));
      setDangChay(false);
    }, BUOC_PHAN_TICH.length * 550 + 300);
  };

  const soCanNhapThem = ketQua ? ketQua.filter((d) => d.chenhLech < 0).length : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Dự báo nhu cầu nguyên liệu</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Ước tính nhu cầu tiêu thụ nguyên liệu theo thời gian để chủ động nhập kho
          </p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => chonKhoang(r.key)}
              disabled={dangChay}
              className={
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 " +
                (rangeKey === r.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50")
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nút kích hoạt AI phân tích */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-stone-600">
          Trợ lý AI sẽ phân tích lịch sử bán hàng để dự báo nhu cầu nguyên liệu trong{" "}
          <span className="font-medium text-stone-800">{range.label.toLowerCase()}</span>.
        </div>
        <button
          onClick={chayDuBao}
          disabled={dangChay}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 active:scale-95 transition-all"
        >
          {dangChay ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
              Đang phân tích...
            </>
          ) : (
            <>🔮 Chạy dự báo AI</>
          )}
        </button>
      </div>

      {dangChay && (
        <div className="bg-white rounded-xl border border-stone-200 p-8 mb-5 flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></span>
          <p className="text-sm text-stone-600">{BUOC_PHAN_TICH[buocHienTai]}</p>
        </div>
      )}

      {!dangChay && !ketQua && (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-10 text-center">
          <div className="text-4xl mb-2">🔮</div>
          <p className="text-stone-600 font-medium">Chưa có kết quả dự báo</p>
          <p className="text-stone-400 text-sm mt-1">
            Chọn khoảng thời gian rồi bấm "Chạy dự báo AI" để xem kết quả phân tích.
          </p>
        </div>
      )}

      {ketQua && !dangChay && (
        <>
          {/* Stat tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-500">Nguyên liệu đang theo dõi</div>
              <div className="text-2xl font-semibold text-stone-800 mt-1">{ketQua.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-500">Cần nhập thêm trong kỳ</div>
              <div
                className={
                  "text-2xl font-semibold mt-1 " + (soCanNhapThem > 0 ? "text-red-600" : "text-stone-800")
                }
              >
                {soCanNhapThem}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-500">Khoảng dự báo</div>
              <div className="text-2xl font-semibold text-stone-800 mt-1">{range.days} ngày</div>
            </div>
          </div>

          {/* Bảng số liệu chi tiết */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Nguyên liệu</th>
                  <th className="px-3 py-2 text-center">Đơn vị</th>
                  <th className="px-3 py-2 text-right">Tồn hiện tại</th>
                  <th className="px-3 py-2 text-right">Đã tiêu thụ (kỳ trước)</th>
                  <th className="px-3 py-2 text-right">Dự kiến cần ({range.days} ngày)</th>
                  <th className="px-3 py-2 text-right">Chênh lệch</th>
                  <th className="px-3 py-2 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {ketQua.map((ing) => {
                  const thieu = ing.chenhLech < 0;
                  return (
                    <tr key={ing.ten} className="border-t border-stone-100">
                      <td className="px-3 py-2 text-stone-800">{ing.ten}</td>
                      <td className="px-3 py-2 text-center text-stone-500">{ing.dvt}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-stone-700">{ing.ton}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-stone-700">{ing.daTieuThu}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-stone-700">{ing.duKienCan}</td>
                      <td className={"px-3 py-2 text-right tabular-nums font-medium " + (thieu ? "text-red-600" : "text-emerald-600")}>
                        {ing.chenhLech > 0 ? "+" : ""}{ing.chenhLech}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium " +
                            (thieu ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")
                          }
                        >
                          {thieu ? "⚠ Cần nhập thêm" : "✓ Đủ dùng"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ForecastPage;
