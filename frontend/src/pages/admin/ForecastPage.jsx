import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Package, TriangleAlert, Sparkles } from "lucide-react";
import { getForecast } from "../../api/forecastApi";
import { getErrorMessage } from "../../api/errorHandler";
import StatCard from "../../components/common/StatCard";

// Nghiệp vụ 2.3.1.15 — AI dự báo nhu cầu nguyên liệu. Backend Node chuyển tiếp
// yêu cầu sang forecast-service (Python + Prophet, phân hệ độc lập) rồi trả
// kết quả về đây để hiển thị.

const SO_NGAY_CO_DINH = 7; // cố định 7 ngày tới cho quyết định "cần nhập thêm"

const BUOC_PHAN_TICH = [
  "Trích xuất lịch sử bán hàng...",
  "Phân tích chu kỳ tiêu thụ...",
  "Tính toán dự báo nguyên liệu...",
];

function moTaTheoThu(theoThu, donVi) {
  if (!theoThu || theoThu.length === 0) return "";
  const cao_nhat = theoThu.reduce((a, b) => (b.thuc_te > a.thuc_te ? b : a));
  const thap_nhat = theoThu.reduce((a, b) => (b.thuc_te < a.thuc_te ? b : a));
  return (
    `Tuần trước, ${cao_nhat.thu} bán chạy nhất — thực tế ${cao_nhat.thuc_te} ${donVi}, ` +
    `trong khi ${thap_nhat.thu} thấp nhất — chỉ ${thap_nhat.thuc_te} ${donVi}. ` +
    `Mô hình AI dự báo ${cao_nhat.thu} tuần này cần khoảng ${cao_nhat.du_bao} ${donVi}, phù hợp với xu hướng thực tế ở trên.`
  );
}

// Đổi "YYYY-MM-DD" (backend trả về) sang định dạng quen thuộc dd/mm/yyyy để hiển thị
function formatNgay(ngay) {
  if (!ngay) return "";
  const [nam, thang, ngayTrongThang] = ngay.split("-");
  return `${ngayTrongThang}/${thang}/${nam}`;
}

// Ngày có dự báo cao nhất trong tuần tới — dùng cho thẻ thống kê + AI Insight.
function ngayCaoDiem(duBaoTuanToi) {
  if (!duBaoTuanToi || duBaoTuanToi.length === 0) return null;
  return duBaoTuanToi.reduce((a, b) => (b.du_bao > a.du_bao ? b : a));
}

// Độ tin tưởng suy ra từ độ rộng khoảng tin cậy Prophet tự tính (yhat_lower/yhat_upper):
// khoảng càng hẹp so với giá trị dự báo thì càng tin tưởng
function doTinTuong(d) {
  const rong = d.cao - d.thap;
  const muc = d.cao > 0 ? 1 - rong / (d.cao * 2) : 0.5;
  return Math.round(Math.max(50, Math.min(99, muc * 100)));
}

// Trạng thái từng ngày, suy ra từ chính dữ liệu dự báo: ngày cao
// nhất trong tuần -> "Cao điểm"; cao hơn ngày liền trước -> "Xu hướng tăng"; còn
// lại -> "Ổn định".
function trangThaiNgay(d, i, list, dinhCao) {
  if (d.ngay === dinhCao?.ngay)
    return { nhan: "CAO ĐIỂM", mau: "bg-red-50 text-red-700" };
  if (i > 0 && d.du_bao > list[i - 1].du_bao)
    return { nhan: "XU HƯỚNG TĂNG", mau: "bg-blue-50 text-blue-700" };
  return { nhan: "ỔN ĐỊNH", mau: "bg-emerald-50 text-emerald-700" };
}

// Biểu đồ đối chiếu Thực tế (trung bình lịch sử thật, tính thẳng từ dữ liệu) vs
// Dự báo (Prophet) theo từng Thứ trong tuần
function BieuDoTheoTuan({ theoThu, donVi, cao: caoProp }) {
  if (!theoThu || theoThu.length === 0) return null;
  const cao = caoProp || 220;

  return (
    <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
      <ResponsiveContainer width="100%" height={cao}>
        <BarChart
          data={theoThu}
          margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e7e5e4"
          />
          <XAxis
            dataKey="thu"
            tick={{ fontSize: 11, fill: "#57534e" }}
            axisLine={{ stroke: "#e7e5e4" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#57534e" }}
            axisLine={{ stroke: "#e7e5e4" }}
            tickLine={false}
            label={{
              value: `Đơn vị: ${donVi}`,
              position: "top",
              offset: 12,
              fontSize: 11,
              fill: "#57534e",
            }}
          />
          <Tooltip
            formatter={(value, name) => [`${value} ${donVi}`, name]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: "#e7e5e4",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="thuc_te"
            name="Thực tế (lịch sử)"
            fill="#f59e0b"
            radius={[3, 3, 0, 0]}
          >
            <LabelList
              dataKey="thuc_te"
              position="top"
              fontSize={10}
              fill="#44403c"
            />
          </Bar>
          <Bar
            dataKey="du_bao"
            name="Dự báo (AI)"
            fill="#6366f1"
            radius={[3, 3, 0, 0]}
          >
            <LabelList
              dataKey="du_bao"
              position="top"
              fontSize={10}
              fill="#4338ca"
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ForecastPage() {
  const [buocHienTai, setBuocHienTai] = useState(0);
  const [dangChay, setDangChay] = useState(false);
  const [ketQua, setKetQua] = useState(null);
  const [loi, setLoi] = useState(null);
  const [nlChon, setNlChon] = useState(null);

  const chayDuBao = async () => {
    setDangChay(true);
    setKetQua(null);
    setLoi(null);
    setBuocHienTai(0);

    // Tiến trình minh hoạ (Prophet thật chạy phía forecast-service
    // có thể mất vài giây) — cứ luân phiên các bước cho tới khi có kết quả
    const stepTimer = setInterval(() => {
      setBuocHienTai((b) => (b + 1 < BUOC_PHAN_TICH.length ? b + 1 : b));
    }, 700);

    try {
      const r = await getForecast(SO_NGAY_CO_DINH);
      setKetQua(r.du_lieu);
      const dungProphet = r.du_lieu.filter(
        (d) => d.phuong_phap === "Prophet (AI)",
      );
      // Mặc định chọn nguyên liệu có chênh lệch cao/thấp trong tuần rõ nhất — biểu đồ nhìn "thuyết phục" nhất
      const chenhLechNhat = dungProphet.reduce((tot, x) => {
        const doLech =
          Math.max(...x.theo_thu.map((d) => d.thuc_te)) -
          Math.min(...x.theo_thu.map((d) => d.thuc_te));
        return !tot || doLech > tot.doLech
          ? { ma: x.ma_nguyen_lieu, doLech }
          : tot;
      }, null);
      setNlChon(chenhLechNhat ? chenhLechNhat.ma : null);
    } catch (err) {
      setLoi(getErrorMessage(err));
    } finally {
      clearInterval(stepTimer);
      setDangChay(false);
    }
  };

  const soCanNhapThem = ketQua
    ? ketQua.filter((d) => d.can_nhap_them).length
    : 0;
  const soDungProphet = ketQua
    ? ketQua.filter((d) => d.phuong_phap === "Prophet (AI)").length
    : 0;
  const dsDungProphet = ketQua
    ? ketQua.filter((d) => d.phuong_phap === "Prophet (AI)")
    : [];
  const ingChon =
    dsDungProphet.find((d) => d.ma_nguyen_lieu === nlChon) || null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">
          Dự báo nhu cầu nguyên liệu
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Phân tích chu kỳ tiêu thụ theo từng Thứ trong tuần để chủ động nhập
          kho
        </p>
      </div>

      {/* Nút kích hoạt AI phân tích */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-stone-600">
          Trợ lý AI sẽ phân tích lịch sử bán hàng để dự báo nhu cầu nguyên liệu
          theo từng Thứ trong tuần.
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
            <>📊 Phân tích dự báo</>
          )}
        </button>
      </div>

      {dangChay && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-5 flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></span>
          <p className="text-sm text-stone-600">
            {BUOC_PHAN_TICH[buocHienTai]}
          </p>
        </div>
      )}

      {loi && !dangChay && (
        <div className="mb-5 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {loi}
        </div>
      )}

      {!dangChay && !ketQua && !loi && (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-10 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-stone-600 font-medium">Chưa có kết quả dự báo</p>
          <p className="text-stone-400 text-sm mt-1">
            Bấm "Phân tích dự báo" để xem kết quả phân tích.
          </p>
        </div>
      )}

      {ketQua && !dangChay && (
        <>
          {/* Stat tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            <StatCard
              label="Nguyên liệu đang theo dõi"
              value={ketQua.length}
              icon={Package}
              color="blue"
            />
            <StatCard
              label="Cần nhập thêm (7 ngày tới)"
              value={soCanNhapThem}
              icon={TriangleAlert}
              color={soCanNhapThem > 0 ? "red" : "stone"}
            />
            <StatCard
              label="Nguyên liệu đủ điều kiện dùng AI"
              value={`${soDungProphet}/${ketQua.length}`}
              icon={Sparkles}
              color="indigo"
            />
          </div>

          {/* Khu vực 1: chỉ 1 nguyên liệu, 1 biểu đồ to */}
          <div className="mb-2 text-sm font-semibold text-stone-700">
            📅 Chi tiết dự báo theo ngày
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            {dsDungProphet.length === 0 ? (
              <p className="text-sm text-stone-500">
                Chưa có nguyên liệu nào đủ dữ liệu lịch sử (cần ≥ 14 ngày) để
                chạy mô hình AI.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm text-stone-600">
                    Xem chi tiết nguyên liệu:
                  </label>
                  <select
                    value={nlChon || ""}
                    onChange={(e) => setNlChon(Number(e.target.value))}
                    className="text-sm border border-stone-300 rounded-lg px-2 py-1.5 bg-white"
                  >
                    {dsDungProphet.map((ing) => (
                      <option
                        key={ing.ma_nguyen_lieu}
                        value={ing.ma_nguyen_lieu}
                      >
                        [{ing.ma_nguyen_lieu}] {ing.ten_nguyen_lieu}
                      </option>
                    ))}
                  </select>
                </div>
                {ingChon && (
                  <>
                    {/* Thẻ thống kê riêng cho nguyên liệu đang chọn */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                        <div className="text-xs text-stone-500">
                          Tổng cần (7 ngày tới)
                        </div>
                        <div className="text-xl font-semibold text-stone-800 mt-0.5">
                          {ingChon.du_kien_can} {ingChon.don_vi_tinh}
                        </div>
                      </div>
                      <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                        <div className="text-xs text-stone-500">
                          Ngày cao điểm
                        </div>
                        <div className="text-xl font-semibold text-stone-800 mt-0.5">
                          {ngayCaoDiem(ingChon.du_bao_tuan_toi)?.thu} (
                          {formatNgay(
                            ngayCaoDiem(ingChon.du_bao_tuan_toi)?.ngay,
                          )}
                          )
                        </div>
                      </div>
                      <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                        <div className="text-xs text-stone-500">
                          Khoảng thời gian dữ liệu
                        </div>
                        <div className="text-xl font-semibold text-stone-800 mt-0.5">
                          {ingChon.so_diem_lich_su} ngày
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">
                      {moTaTheoThu(ingChon.theo_thu, ingChon.don_vi_tinh)}
                    </p>
                    <BieuDoTheoTuan
                      theoThu={ingChon.theo_thu}
                      donVi={ingChon.don_vi_tinh}
                      cao={340}
                    />

                    {/* Bảng chi tiết theo ngày */}
                    <div className="mt-4 overflow-hidden rounded-lg shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50 border-b border-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wide">
                          <tr>
                            <th className="px-3 py-2 text-left">Ngày</th>
                            <th className="px-3 py-2 text-right">Dự báo</th>
                            <th className="px-3 py-2 text-center">
                              Độ tin cậy (%)
                            </th>
                            <th className="px-3 py-2 text-center">
                              Xu hướng trong tuần
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ingChon.du_bao_tuan_toi.map((d, i) => {
                            const tinTuong = doTinTuong(d);
                            const trangThai = trangThaiNgay(
                              d,
                              i,
                              ingChon.du_bao_tuan_toi,
                              ngayCaoDiem(ingChon.du_bao_tuan_toi),
                            );
                            return (
                              <tr
                                key={d.ngay}
                                className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                              >
                                <td className="px-3 py-2 text-stone-700">
                                  {d.thu}, {formatNgay(d.ngay)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-stone-700">
                                  {d.du_bao} {ingChon.don_vi_tinh}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2 justify-center">
                                    <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-600"
                                        style={{ width: `${tinTuong}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-stone-500 tabular-nums">
                                      {tinTuong}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <span
                                    className={
                                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium " +
                                      trangThai.mau
                                    }
                                  >
                                    {trangThai.nhan}
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
              </>
            )}
          </div>

          {/* Khu vực 2: Gợi ý nhập hàng — đơn giản, chỉ để trả lời "có cần nhập thêm không" */}
          <div className="mb-2 text-sm font-semibold text-stone-700">
            📦 Gợi ý nhập hàng (7 ngày tới)
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="max-h-[75vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wide sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">Nguyên liệu</th>
                    <th className="px-3 py-2 text-center">Đơn vị</th>
                    <th className="px-3 py-2 text-right">Tồn hiện tại</th>
                    <th className="px-3 py-2 text-right">
                      Đã tiêu thụ (7 ngày qua)
                    </th>
                    <th className="px-3 py-2 text-right">
                      Dự kiến cần (7 ngày tới)
                    </th>
                    <th className="px-3 py-2 text-right">
                      Chênh lệch <br></br>(Tồn − Dự kiến)
                    </th>
                    <th className="px-3 py-2 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {ketQua.map((ing) => {
                    const thieu = ing.can_nhap_them;
                    return (
                      <tr
                        key={ing.ma_nguyen_lieu}
                        className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                      >
                        <td className="px-3 py-2">
                          <div className="font-medium text-stone-800">
                            {ing.ten_nguyen_lieu}
                          </div>
                          <div className="text-xs font-medium text-stone-400">
                            #{ing.ma_nguyen_lieu}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center text-stone-500">
                          {ing.don_vi_tinh}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-stone-700">
                          {ing.ton_hien_tai}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-stone-700">
                          {ing.da_tieu_thu}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-stone-700">
                          {ing.du_kien_can}
                        </td>
                        <td
                          className={
                            "px-3 py-2 text-right tabular-nums font-medium " +
                            (thieu ? "text-red-600" : "text-emerald-600")
                          }
                        >
                          {ing.chenh_lech > 0 ? "+" : ""}
                          {ing.chenh_lech}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium " +
                              (thieu
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700")
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
          </div>
        </>
      )}
    </div>
  );
}

export default ForecastPage;
