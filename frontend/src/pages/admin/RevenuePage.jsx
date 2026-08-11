import { useState, useEffect, useRef } from "react";
import { Receipt, TrendingUp, Banknote, CreditCard } from "lucide-react";
import { getBills, getBillDetail, getRevenueSummary } from "../../api/cashierApi";
import { getErrorMessage } from "../../api/errorHandler";
import Modal from "../../components/common/Modal";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";
import Pagination from "../../components/common/Pagination";

const today = () => new Date().toISOString().slice(0, 10);
const POLL_INTERVAL_MS = 5000; // Tự làm mới doanh thu vì Thu ngân có thể vừa thanh toán hóa đơn mới
const PER_PAGE = 15;

function RevenuePage() {
  const [tuNgay, setTuNgay] = useState(today());
  const [denNgay, setDenNgay] = useState(today());
  const [maHoaDon, setMaHoaDon] = useState("");
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 'ngay' = đang lọc theo khoảng ngày, 'ma' = đang tra cứu theo mã hóa đơn
  // (2 kiểu lọc độc lập — tra mã hóa đơn không bị giới hạn bởi ngày đang chọn)
  const [searchMode, setSearchMode] = useState("ngay");

  const [detailOpen, setDetailOpen] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  const loadData = async (opts = {}) => {
    const p = opts.p ?? page;
    try {
      const [billsData, summaryData] = await Promise.all([
        getBills("Da_thanh_toan", tuNgay, denNgay, p, PER_PAGE, ""),
        getRevenueSummary(tuNgay, denNgay),
      ]);
      setBills(billsData.data || []);
      setTotal(billsData.total || 0);
      setTotalPages(billsData.totalPages || 1);
      setPage(billsData.page || 1);
      setSummary(summaryData);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  const searchByInvoice = async (opts = {}) => {
    const p = opts.p ?? page;
    try {
      const billsData = await getBills("Da_thanh_toan", "", "", p, PER_PAGE, maHoaDon);
      setBills(billsData.data || []);
      setTotal(billsData.total || 0);
      setTotalPages(billsData.totalPages || 1);
      setPage(billsData.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  useEffect(() => {
    (async () => {
      await loadData({ p: 1 });
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tự động làm mới định kỳ — chỉ áp dụng khi đang lọc theo ngày,
  // không âm thầm ghi đè lên kết quả tra cứu mã hóa đơn đang xem
  const loadDataRef = useRef(loadData);
  loadDataRef.current = loadData;
  useEffect(() => {
    const timer = setInterval(() => {
      if (searchMode === "ngay") loadDataRef.current();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [searchMode]);

  const handleSearch = async () => {
    setSearchMode("ngay");
    await loadData({ p: 1 });
  };

  const handleSearchByInvoice = async () => {
    setSearchMode("ma");
    await searchByInvoice({ p: 1 });
  };

  const handlePageChange = async (p) => {
    if (searchMode === "ma") await searchByInvoice({ p });
    else await loadData({ p });
  };

  const handleClearFilter = async () => {
    setTuNgay(today());
    setDenNgay(today());
    setMaHoaDon("");
    setSearchMode("ngay");
    try {
      const [billsData, summaryData] = await Promise.all([
        getBills("Da_thanh_toan", today(), today(), 1, PER_PAGE, ""),
        getRevenueSummary(today(), today()),
      ]);
      setBills(billsData.data || []);
      setTotal(billsData.total || 0);
      setTotalPages(billsData.totalPages || 1);
      setPage(billsData.page || 1);
      setSummary(summaryData);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  const handleViewDetail = async (bill) => {
    try {
      setBillDetail(await getBillDetail(bill.ma_hoa_don));
      setDetailOpen(true);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Báo cáo doanh thu</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Tra cứu hóa đơn đã thanh toán và tổng doanh thu theo khoảng ngày.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-stone-500 block mb-1">Từ ngày</label>
          <input
            type="date"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">Đến ngày</label>
          <input
            type="date"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Lọc theo ngày
        </button>

        <div className="w-px self-stretch bg-stone-200 mx-1" />

        <div>
          <label className="text-xs text-stone-500 block mb-1">Mã hóa đơn</label>
          <input
            type="text"
            value={maHoaDon}
            onChange={(e) => setMaHoaDon(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchByInvoice()}
            placeholder="VD: 1505"
            className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm w-28 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <button
          onClick={handleSearchByInvoice}
          disabled={!maHoaDon.trim()}
          className="bg-stone-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-stone-900 disabled:opacity-40 transition-colors"
        >
          Tra cứu mã HĐ
        </button>
        <button
          onClick={handleClearFilter}
          className="px-4 py-1.5 rounded-lg text-sm font-medium border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Xóa lọc
        </button>
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard label="Tổng hóa đơn" value={summary.tong_so_hoa_don} icon={Receipt} color="blue" />
          <StatCard
            label="Tổng doanh thu"
            value={`${summary.tong_doanh_thu.toLocaleString("vi-VN")}đ`}
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            label="Tiền mặt"
            value={`${summary.theo_hinh_thuc.Tien_mat.toLocaleString("vi-VN")}đ`}
            icon={Banknote}
            color="amber"
          />
          <StatCard
            label="Chuyển khoản"
            value={`${summary.theo_hinh_thuc.Chuyen_khoan.toLocaleString("vi-VN")}đ`}
            icon={CreditCard}
            color="stone"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                <th className="text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[10%]">Mã HĐ</th>
                <th className="text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[14%]">Bàn</th>
                <th className="text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[14%]">Khu vực</th>
                <th className="text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[20%]">Thanh toán lúc</th>
                <th className="text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[14%]">Hình thức</th>
                <th className="text-right text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[14%]">Tổng tiền</th>
                <th className="text-center text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 w-[14%]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-stone-400" colSpan={7}>
                    Không có hóa đơn nào trong khoảng ngày đã chọn.
                  </td>
                </tr>
              )}
              {bills.map((b) => (
                <tr key={b.ma_hoa_don} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="px-3 py-2">#{b.ma_hoa_don}</td>
                  <td className="px-3 py-2 font-medium text-stone-800 truncate">{b.ten_ban}</td>
                  <td className="px-3 py-2 text-stone-500 truncate">{b.ten_khu_vuc}</td>
                  <td className="px-3 py-2 text-stone-500">
                    {b.thoi_gian_dong_ban
                      ? new Date(b.thoi_gian_dong_ban).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {b.hinh_thuc_thanh_toan === "Tien_mat" ? "Tiền mặt" : "Chuyển khoản"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {Number(b.tong_tien_thanh_toan).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleViewDetail(b)}
                      className="text-stone-600 hover:text-stone-900 text-sm transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 px-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={billDetail ? `Hóa đơn #${billDetail.hoaDon.ma_hoa_don} - ${billDetail.hoaDon.ten_ban}` : "Chi tiết"}
      >
        {billDetail && (
          <div>
            <div className="border border-stone-200 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 text-xs uppercase">
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
                      <tr key={i.ma_chi_tiet_hd} className="border-t border-stone-100">
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
            <div className="text-right text-base font-bold text-stone-800">
              Tổng: {Number(billDetail.hoaDon.tong_tien_thanh_toan).toLocaleString("vi-VN")}đ
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default RevenuePage;
