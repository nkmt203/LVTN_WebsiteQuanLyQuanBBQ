import { useState, useEffect, useRef } from "react";
import { getBills, getBillDetail, getRevenueSummary } from "../../api/cashierApi";
import { getErrorMessage } from "../../api/errorHandler";
import Modal from "../../components/common/Modal";

const today = () => new Date().toISOString().slice(0, 10);
const POLL_INTERVAL_MS = 5000; // Tự làm mới doanh thu vì Thu ngân có thể vừa thanh toán hóa đơn mới

function RevenuePage() {
  const [tuNgay, setTuNgay] = useState(today());
  const [denNgay, setDenNgay] = useState(today());
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  const loadData = async () => {
    try {
      const [billsData, summaryData] = await Promise.all([
        getBills("Da_thanh_toan", tuNgay, denNgay),
        getRevenueSummary(tuNgay, denNgay),
      ]);
      setBills(billsData);
      setSummary(summaryData);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tự động làm mới định kỳ (không đổi cách tra cứu thủ công ở trên,
  // chỉ âm thầm gọi lại loadData với khoảng ngày đang chọn hiện tại)
  const loadDataRef = useRef(loadData);
  loadDataRef.current = loadData;
  useEffect(() => {
    const timer = setInterval(() => loadDataRef.current(), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async () => {
    await loadData();
  };

  const handleViewDetail = async (bill) => {
    try {
      setBillDetail(await getBillDetail(bill.ma_hoa_don));
      setDetailOpen(true);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Báo cáo doanh thu</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Tra cứu hóa đơn đã thanh toán và tổng doanh thu theo khoảng ngày.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Từ ngày</label>
          <input
            type="date"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Đến ngày</label>
          <input
            type="date"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-slate-900"
        >
          Tra cứu
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <SummaryBox label="Tổng hóa đơn" value={summary.tong_so_hoa_don} />
          <SummaryBox
            label="Tổng doanh thu"
            value={`${summary.tong_doanh_thu.toLocaleString("vi-VN")}đ`}
          />
          <SummaryBox
            label="Tiền mặt"
            value={`${summary.theo_hinh_thuc.Tien_mat.toLocaleString("vi-VN")}đ`}
          />
          <SummaryBox
            label="Chuyển khoản"
            value={`${summary.theo_hinh_thuc.Chuyen_khoan.toLocaleString("vi-VN")}đ`}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Mã HĐ</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Bàn</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Khu vực</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Thanh toán lúc</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Hình thức</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Tổng tiền</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-400" colSpan={7}>
                  Không có hóa đơn nào trong khoảng ngày đã chọn.
                </td>
              </tr>
            )}
            {bills.map((b) => (
              <tr key={b.ma_hoa_don} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2.5">#{b.ma_hoa_don}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800">{b.ten_ban}</td>
                <td className="px-4 py-2.5 text-slate-500">{b.ten_khu_vuc}</td>
                <td className="px-4 py-2.5 text-slate-500">
                  {b.thoi_gian_dong_ban
                    ? new Date(b.thoi_gian_dong_ban).toLocaleString("vi-VN")
                    : "—"}
                </td>
                <td className="px-4 py-2.5">
                  {b.hinh_thuc_thanh_toan === "Tien_mat" ? "Tiền mặt" : "Chuyển khoản"}
                </td>
                <td className="px-4 py-2.5 text-right font-medium">
                  {Number(b.tong_tien_thanh_toan).toLocaleString("vi-VN")}đ
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => handleViewDetail(b)}
                    className="text-slate-600 hover:text-slate-900 text-sm"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={billDetail ? `Hóa đơn #${billDetail.hoaDon.ma_hoa_don} - ${billDetail.hoaDon.ten_ban}` : "Chi tiết"}
      >
        {billDetail && (
          <div>
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-10">SL</th>
                    <th className="px-2 py-1.5 text-left">Món</th>
                    <th className="px-2 py-1.5 text-right">Đơn giá</th>
                    <th className="px-2 py-1.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {billDetail.items
                    .filter((i) => i.trang_thai !== "Da_huy")
                    .map((i) => (
                      <tr key={i.ma_chi_tiet_hd} className="border-t border-slate-100">
                        <td className="px-2 py-1.5 text-center">{i.so_luong}</td>
                        <td className="px-2 py-1.5">{i.ten_mon_an}</td>
                        <td className="px-2 py-1.5 text-right">
                          {Number(i.don_gia_tai_thoi_diem_goi).toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {Number(i.thanh_tien).toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-base font-bold text-slate-800">
              Tổng: {Number(billDetail.hoaDon.tong_tien_thanh_toan).toLocaleString("vi-VN")}đ
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const SummaryBox = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    <div className="text-lg font-bold text-slate-800">{value}</div>
  </div>
);

export default RevenuePage;
