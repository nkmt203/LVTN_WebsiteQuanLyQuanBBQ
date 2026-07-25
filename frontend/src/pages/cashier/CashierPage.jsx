import { useState, useEffect, useRef } from 'react';
import { getBills, getBillDetail, payBill, getRevenueSummary } from '../../api/cashierApi';
import { getErrorMessage } from '../../api/errorHandler';
import Modal from '../../components/common/Modal';

const POLL_INTERVAL_MS = 5000;
const today = () => new Date().toISOString().slice(0, 10);

function CashierPage() {
  const [tab, setTab] = useState('Cho_thanh_toan');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const timerRef = useRef(null);

  // Tra cứu hóa đơn đã thanh toán theo khoảng ngày (tab "Đã thanh toán")
  const [tuNgay, setTuNgay] = useState(today());
  const [denNgay, setDenNgay] = useState(today());
  const [revenueSummary, setRevenueSummary] = useState(null);

  // Modal chi tiết bill
  const [detailOpen, setDetailOpen] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  // Modal thanh toán
  const [payOpen, setPayOpen] = useState(false);
  const [payingBill, setPayingBill] = useState(null);

  // Modal in bill (sau khi thanh toán xong)
  const [printOpen, setPrintOpen] = useState(false);
  const [paidBill, setPaidBill] = useState(null);

  // ===== LOAD =====
  const loadBills = async (trangThai = tab) => {
    try {
      const data =
        trangThai === 'Da_thanh_toan'
          ? await getBills(trangThai, tuNgay, denNgay)
          : await getBills(trangThai);
      setBills(data);
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const loadRevenueSummary = async () => {
    try {
      setRevenueSummary(await getRevenueSummary(tuNgay, denNgay));
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadBills(tab);
      if (tab === 'Da_thanh_toan') await loadRevenueSummary();
      setLoading(false);
    };
    init();

    // Tab "Đã thanh toán" là lịch sử, không cần tự làm mới liên tục
    if (tab !== 'Da_thanh_toan') {
      timerRef.current = setInterval(() => loadBills(tab), POLL_INTERVAL_MS);
      return () => clearInterval(timerRef.current);
    }
  }, [tab]);

  const handleSearchHistory = async () => {
    await loadBills('Da_thanh_toan');
    await loadRevenueSummary();
  };

  // ===== XEM CHI TIẾT =====
  const handleViewDetail = async (bill) => {
    try {
      const data = await getBillDetail(bill.ma_hoa_don);
      setBillDetail(data);
      setDetailOpen(true);
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  // ===== MỞ MODAL THANH TOÁN =====
  const handleOpenPay = async (bill) => {
    try {
      const data = await getBillDetail(bill.ma_hoa_don);
      setPayingBill(data);
      setPayOpen(true);
      setDetailOpen(false); // đóng modal detail nếu đang mở
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  // ===== XÁC NHẬN THANH TOÁN =====
  const handleConfirmPay = async (hinhThuc) => {
    try {
      const r = await payBill(payingBill.hoaDon.ma_hoa_don, hinhThuc);
      setFeedback({ type: 'success', text: r.message });
      setPayOpen(false);

      // Load lại detail để in bill (có ma_nv_thu_ngan mới)
      const updated = await getBillDetail(payingBill.hoaDon.ma_hoa_don);
      setPaidBill(updated);
      setPrintOpen(true);

      await loadBills(tab);
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  // ===== IN BILL =====
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-sm text-stone-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-stone-800">Quản lý hóa đơn</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Xử lý thanh toán và đóng bàn cho khách hàng
        </p>
      </div>

      {/* Tab */}
      <div className="flex gap-2 mb-4 border-b border-stone-200">
        <TabButton
          active={tab === 'Cho_thanh_toan'}
          onClick={() => setTab('Cho_thanh_toan')}
          label="Chờ thanh toán"
          count={tab === 'Cho_thanh_toan' ? bills.length : null}
          highlight
        />
        <TabButton
          active={tab === 'Dang_phuc_vu'}
          onClick={() => setTab('Dang_phuc_vu')}
          label="Đang phục vụ"
          count={tab === 'Dang_phuc_vu' ? bills.length : null}
        />
        <TabButton
          active={tab === 'Da_thanh_toan'}
          onClick={() => setTab('Da_thanh_toan')}
          label="Đã thanh toán"
        />
      </div>

      {/* Bộ lọc ngày + tổng doanh thu — chỉ hiện ở tab Đã thanh toán */}
      {tab === 'Da_thanh_toan' && (
        <div className="mb-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-3 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1">Từ ngày</label>
              <input type="date" value={tuNgay} onChange={(e) => setTuNgay(e.target.value)}
                     className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Đến ngày</label>
              <input type="date" value={denNgay} onChange={(e) => setDenNgay(e.target.value)}
                     className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <button onClick={handleSearchHistory}
                    className="bg-stone-800 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-stone-900">
              Tra cứu
            </button>
          </div>

          {revenueSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryBox label="Tổng hóa đơn" value={revenueSummary.tong_so_hoa_don} />
              <SummaryBox label="Tổng doanh thu"
                          value={`${revenueSummary.tong_doanh_thu.toLocaleString('vi-VN')}đ`} />
              <SummaryBox label="Tiền mặt"
                          value={`${revenueSummary.theo_hinh_thuc.Tien_mat.toLocaleString('vi-VN')}đ`} />
              <SummaryBox label="Chuyển khoản"
                          value={`${revenueSummary.theo_hinh_thuc.Chuyen_khoan.toLocaleString('vi-VN')}đ`} />
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div
          className={
            'mb-4 px-4 py-2 rounded-lg border text-sm ' +
            (feedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700')
          }
        >
          {feedback.text}
        </div>
      )}

      {/* Danh sách bill */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-stone-200">
          <div className="text-6xl mb-4">💤</div>
          <p className="text-stone-500">Không có hóa đơn nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bills.map((b) => (
            <BillCard
              key={b.ma_hoa_don}
              bill={b}
              onView={handleViewDetail}
              onPay={handleOpenPay}
            />
          ))}
        </div>
      )}

      {/* Modal chi tiết */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)}
             title={billDetail ? `Bill #${billDetail.hoaDon.ma_hoa_don} - ${billDetail.hoaDon.ten_ban}` : 'Chi tiết'}>
        {billDetail && (
          <BillDetailContent
            bill={billDetail}
            onPay={() => handleOpenPay({ ma_hoa_don: billDetail.hoaDon.ma_hoa_don })}
          />
        )}
      </Modal>

      {/* Modal thanh toán */}
      <Modal open={payOpen} onClose={() => setPayOpen(false)}
             title={payingBill ? `Thanh toán #${payingBill.hoaDon.ma_hoa_don}` : 'Thanh toán'}>
        {payingBill && (
          <PaymentForm bill={payingBill} onConfirm={handleConfirmPay} onCancel={() => setPayOpen(false)} />
        )}
      </Modal>

      {/* Modal in bill sau khi thanh toán */}
      <Modal open={printOpen} onClose={() => setPrintOpen(false)}
             title="Bill thanh toán">
        {paidBill && (
          <PrintableBill bill={paidBill} onPrint={handlePrint} onClose={() => setPrintOpen(false)} />
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const TabButton = ({ active, onClick, label, count, highlight }) => (
  <button
    onClick={onClick}
    className={
      'px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ' +
      (active
        ? (highlight ? 'text-emerald-600 border-emerald-600' : 'text-stone-800 border-stone-800')
        : 'text-stone-500 border-transparent hover:text-stone-700')
    }
  >
    {label}
    {count !== null && count > 0 && (
      <span className={
        'text-xs px-2 py-0.5 rounded-full ' +
        (active
          ? (highlight ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700')
          : 'bg-stone-100 text-stone-500')
      }>
        {count}
      </span>
    )}
  </button>
);

const SummaryBox = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-stone-200 p-4">
    <div className="text-xs text-stone-500 mb-1">{label}</div>
    <div className="text-lg font-bold text-stone-800">{value}</div>
  </div>
);

const BillCard = ({ bill, onView, onPay }) => {
  const isWaiting = bill.trang_thai === 'Cho_thanh_toan';
  const time = new Date(bill.thoi_gian_mo_ban).toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={
      'bg-white rounded-xl border p-4 ' +
      (isWaiting ? 'border-emerald-400 border-2' : 'border-stone-200')
    }>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-stone-800">{bill.ten_ban}</div>
          <div className="text-xs text-stone-500">{bill.ten_khu_vuc}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-stone-400">#{bill.ma_hoa_don}</div>
          <div className="text-xs text-stone-500">Mở lúc {time}</div>
        </div>
      </div>

      <div className="text-sm text-stone-600 mb-2">
        <span className="text-stone-400">Số món:</span>{' '}
        <span className="font-medium">{bill.so_mon}</span>
      </div>
      <div className="text-lg font-bold text-stone-800 mb-3">
        {Number(bill.tong_tien_thanh_toan).toLocaleString('vi-VN')}đ
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(bill)}
          className="flex-1 text-sm text-stone-600 border border-stone-300 hover:bg-stone-50 px-3 py-1.5 rounded-lg"
        >
          Xem chi tiết
        </button>
        {isWaiting && (
          <button
            onClick={() => onPay(bill)}
            className="flex-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium"
          >
            💰 Thanh toán
          </button>
        )}
      </div>
    </div>
  );
};

const BillDetailContent = ({ bill, onPay }) => {
  const activeItems = bill.items.filter((i) => i.trang_thai !== 'Da_huy');
  const cancelledItems = bill.items.filter((i) => i.trang_thai === 'Da_huy');
  const canPay = bill.hoaDon.trang_thai === 'Cho_thanh_toan';

  return (
    <div>
      <div className="bg-stone-50 rounded-lg p-3 mb-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-stone-500">Khu vực:</span> {bill.hoaDon.ten_khu_vuc}</div>
          <div>
            <span className="text-stone-500">Mở bàn:</span>{' '}
            {new Date(bill.hoaDon.thoi_gian_mo_ban).toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      <div className="border border-stone-200 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-stone-600 text-xs uppercase">
            <tr>
              <th className="px-2 py-1.5 text-left">Món</th>
              <th className="px-2 py-1.5 text-center w-12">SL</th>
              <th className="px-2 py-1.5 text-right w-24">Đơn giá</th>
              <th className="px-2 py-1.5 text-right w-28">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {activeItems.map((item) => (
              <tr key={item.ma_chi_tiet_hd} className="border-t border-stone-100">
                <td className="px-2 py-2">
                  <div>{item.ten_mon_an}</div>
                  {item.ghi_chu && !item.ghi_chu.includes('[Lý do hủy:') && (
                    <div className="text-xs text-stone-400 italic">
                      {item.ghi_chu.replace(/\s*\[BEP_OK\]\s*/, '').trim()}
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 text-center">{item.so_luong}</td>
                <td className="px-2 py-2 text-right">
                  {Number(item.don_gia_tai_thoi_diem_goi).toLocaleString('vi-VN')}
                </td>
                <td className="px-2 py-2 text-right font-medium">
                  {Number(item.thanh_tien).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-stone-50">
            <tr>
              <td colSpan={3} className="px-2 py-2 text-right font-medium">Tổng cộng:</td>
              <td className="px-2 py-2 text-right text-lg font-bold text-stone-800">
                {Number(bill.hoaDon.tong_tien_thanh_toan).toLocaleString('vi-VN')}đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {cancelledItems.length > 0 && (
        <details className="mb-4">
          <summary className="text-sm text-stone-500 cursor-pointer hover:text-stone-700">
            ▼ Món đã hủy ({cancelledItems.length})
          </summary>
          <div className="mt-2 border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm opacity-70">
              <tbody>
                {cancelledItems.map((item) => {
                  const cleanGC = item.ghi_chu?.replace(/\s*\[BEP_OK\]\s*/, '');
                  const lyDo = cleanGC?.match(/\[Lý do hủy: (.+?)\]/)?.[1];
                  return (
                    <tr key={item.ma_chi_tiet_hd} className="border-t border-stone-100">
                      <td className="px-2 py-2 line-through">{item.ten_mon_an}</td>
                      <td className="px-2 py-2 text-center">× {item.so_luong}</td>
                      <td className="px-2 py-2 text-xs text-red-500 italic">{lyDo || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {canPay && (
        <button onClick={onPay}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium">
          💰 Tiến hành thanh toán
        </button>
      )}
    </div>
  );
};

const PaymentForm = ({ bill, onConfirm, onCancel }) => {
  const [hinhThuc, setHinhThuc] = useState('Tien_mat');
  const [tienKhachDua, setTienKhachDua] = useState('');
  const [confirmZero, setConfirmZero] = useState(false);

  const tong = Number(bill.hoaDon.tong_tien_thanh_toan);
  const isZero = tong === 0;
  const tienDua = Number(tienKhachDua) || 0;
  const tienThoi = hinhThuc === 'Tien_mat' ? tienDua - tong : 0;
  const enoughCash = hinhThuc === 'Tien_mat' ? tienDua >= tong : true;

  const handleConfirm = () => {
    if (isZero && !confirmZero) {
      alert('Vui lòng xác nhận đóng bàn không thu tiền');
      return;
    }
    if (!isZero && hinhThuc === 'Tien_mat' && !enoughCash) {
      alert('Tiền khách đưa không đủ');
      return;
    }
    onConfirm(hinhThuc);
  };

  // Trường hợp bill 0đ (tất cả món hủy)
  if (isZero) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          ⚠️ Hóa đơn này có tổng tiền = <strong>0đ</strong> (tất cả món đã hủy).
          Bạn sẽ đóng bàn mà không thu tiền.
        </div>

        <label className="flex items-start gap-2 text-sm cursor-pointer p-3 border border-stone-200 rounded-lg">
          <input
            type="checkbox"
            checked={confirmZero}
            onChange={(e) => setConfirmZero(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Tôi xác nhận đóng hóa đơn này mà không thu tiền, đưa bàn về trạng thái Trống.
          </span>
        </label>

        <div className="flex gap-2 justify-end mt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
            Đóng
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmZero}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-700 disabled:opacity-50"
          >
            Đóng bàn không thu tiền
          </button>
        </div>
      </div>
    );
  }

  // Trường hợp bình thường
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-stone-50 rounded-lg p-4">
        <div className="text-sm text-stone-500">Tổng tiền cần thu:</div>
        <div className="text-2xl font-bold text-stone-800">
          {tong.toLocaleString('vi-VN')}đ
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-600 mb-2 block">Hình thức thanh toán *</label>
        <div className="flex gap-2">
          <label className={
            'flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg cursor-pointer text-sm font-medium ' +
            (hinhThuc === 'Tien_mat'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50')
          }>
            <input type="radio" name="hinhThuc" value="Tien_mat"
                   checked={hinhThuc === 'Tien_mat'}
                   onChange={(e) => setHinhThuc(e.target.value)} className="hidden" />
            💵 Tiền mặt
          </label>
          <label className={
            'flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg cursor-pointer text-sm font-medium ' +
            (hinhThuc === 'Chuyen_khoan'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50')
          }>
            <input type="radio" name="hinhThuc" value="Chuyen_khoan"
                   checked={hinhThuc === 'Chuyen_khoan'}
                   onChange={(e) => setHinhThuc(e.target.value)} className="hidden" />
            🏦 Chuyển khoản
          </label>
        </div>
      </div>

      {hinhThuc === 'Tien_mat' && (
        <div>
          <label className="text-sm font-medium text-stone-600 mb-1 block">Tiền khách đưa</label>
          <input
            type="number"
            value={tienKhachDua}
            onChange={(e) => setTienKhachDua(e.target.value)}
            placeholder={tong.toLocaleString('vi-VN')}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            autoFocus
          />
          {tienDua > 0 && (
            <div className={
              'mt-2 p-2 rounded-lg text-sm ' +
              (enoughCash ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
            }>
              {enoughCash
                ? <>Tiền thối: <strong>{tienThoi.toLocaleString('vi-VN')}đ</strong></>
                : <>Còn thiếu: <strong>{(-tienThoi).toLocaleString('vi-VN')}đ</strong></>
              }
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-end mt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Huỷ
        </button>
        <button
          onClick={handleConfirm}
          disabled={hinhThuc === 'Tien_mat' && !enoughCash}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          ✓ Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
};

const PrintableBill = ({ bill, onPrint, onClose }) => {
  const activeItems = bill.items.filter((i) => i.trang_thai !== 'Da_huy');

  return (
    <div>
      {/* Khu vực in - style riêng cho @media print */}
      <div id="printable-bill" className="bg-white p-4 border border-stone-200 rounded-lg mb-4 font-mono text-sm">
        <div className="text-center mb-3">
          <div className="text-lg font-bold">🍖 MEATOSYNC RESTAURANT</div>
          <div className="text-xs">Địa chỉ nhà hàng - SĐT</div>
          <div className="text-xs mt-1">━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>

        <div className="mb-2 text-xs">
          <div>Bill: #{bill.hoaDon.ma_hoa_don}</div>
          <div>Bàn: {bill.hoaDon.ten_ban} ({bill.hoaDon.ten_khu_vuc})</div>
          <div>Mở bàn: {new Date(bill.hoaDon.thoi_gian_mo_ban).toLocaleString('vi-VN')}</div>
          <div>Thanh toán: {new Date(bill.hoaDon.thoi_gian_dong_ban).toLocaleString('vi-VN')}</div>
          <div>Thu ngân: {bill.hoaDon.ten_thu_ngan || '—'}</div>
        </div>

        <div className="text-xs mb-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>

        {activeItems.map((item) => (
          <div key={item.ma_chi_tiet_hd} className="text-xs mb-1">
            <div className="flex justify-between">
              <span>{item.ten_mon_an}</span>
              <span>{Number(item.thanh_tien).toLocaleString('vi-VN')}</span>
            </div>
            <div className="text-stone-500 pl-2">
              {item.so_luong} × {Number(item.don_gia_tai_thoi_diem_goi).toLocaleString('vi-VN')}
            </div>
          </div>
        ))}

        <div className="text-xs my-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>

        <div className="flex justify-between font-bold text-base">
          <span>TỔNG CỘNG:</span>
          <span>{Number(bill.hoaDon.tong_tien_thanh_toan).toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="text-xs mt-1">
          Thanh toán: {bill.hoaDon.hinh_thuc_thanh_toan === 'Tien_mat' ? 'Tiền mặt' : 'Chuyển khoản'}
        </div>

        <div className="text-center mt-3 text-xs">
          <div>━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="mt-2">Cảm ơn quý khách!</div>
          <div>Hẹn gặp lại</div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onClose}
                className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Đóng
        </button>
        <button onClick={onPrint}
                className="px-6 py-2 rounded-lg bg-stone-800 text-white text-sm hover:bg-stone-900 font-medium">
          🖨 In bill
        </button>
      </div>
    </div>
  );
};

export default CashierPage;