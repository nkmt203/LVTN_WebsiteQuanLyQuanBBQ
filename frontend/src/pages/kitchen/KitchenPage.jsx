import { useState, useEffect, useRef } from 'react';
import { getPendingOrders, completeOrderItem, acknowledgeCancellation } from '../../api/kitchenApi';
import { getErrorMessage } from '../../api/errorHandler';

const POLL_INTERVAL_MS = 5000; // Auto refresh 5 giây

function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const timerRef = useRef(null);

  // ===== LOAD =====
  const loadOrders = async () => {
    try {
      const data = await getPendingOrders();
      setOrders(data);
      setLastRefresh(new Date());
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadOrders();
      setLoading(false);
    };
    init();

    timerRef.current = setInterval(loadOrders, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  // ===== HOÀN THÀNH MÓN (kèm cảnh báo trừ kho) =====
  const handleComplete = async (item) => {
    if (!window.confirm(`Xác nhận hoàn thành "${item.ten_mon_an}" bàn ${item.ten_ban}?`)) return;
    try {
      const r = await completeOrderItem(item.ma_chi_tiet_hd);

      let msg = '✅ ' + r.message;
      if (r.canh_bao_thieu?.length > 0) {
        msg += `\n⚠️ Kho thiếu: ${r.canh_bao_thieu.join(', ')}`;
      }
      if (r.canh_bao_ton_thap?.length > 0) {
        msg += `\n⚠️ Sắp hết: ${r.canh_bao_ton_thap.join(', ')}`;
      }
      setMessage(msg);
      await loadOrders();
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  };

  // ===== TIẾP NHẬN YÊU CẦU HỦY =====
  const handleAcknowledgeCancel = async (item) => {
    if (!window.confirm(`Đã dừng chế biến "${item.ten_mon_an}" bàn ${item.ten_ban}?`)) return;
    try {
      const r = await acknowledgeCancellation(item.ma_chi_tiet_hd);
      setMessage('✅ ' + r.message);
      await loadOrders();
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  };

  // ===== NHÓM ORDER THEO BÀN =====
  // Do BE đã ORDER BY thời điểm gọi món sớm nhất của hóa đơn (FIFO),
  // ta chỉ cần push theo thứ tự đến, các bàn tự động xếp đúng thứ tự
  const groupedByTable = orders.reduce((acc, item) => {
    const key = `${item.ma_hoa_don}`;
    if (!acc[key]) {
      acc[key] = {
        ma_ban: item.ma_ban,
        ma_hoa_don: item.ma_hoa_don,
        ten_ban: item.ten_ban,
        ten_khu_vuc: item.ten_khu_vuc,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});
  const tables = Object.values(groupedByTable);

  // Món đã "xong việc" với bếp: hoàn thành, hoặc hủy mà bếp đã tiếp nhận (BEP_OK)
  const isItemFinal = (item) =>
    item.trang_thai === 'Da_hoan_thanh' ||
    (item.trang_thai === 'Da_huy' && item.ghi_chu?.includes('[BEP_OK]'));

  // Đếm chỉ món chưa hoàn thành / chưa được bếp tiếp nhận hủy để hiện tổng ở header
  const activeItems = orders.filter((i) => !isItemFinal(i));
  // Bill còn món cần xử lý (chưa hoàn thành hoặc còn yêu cầu hủy chưa tiếp nhận)
  // -> bill đã xong hết món (mọi món đều hoàn thành/hủy đã tiếp nhận) sẽ tự ẩn khỏi lưới chính
  const activeTables = tables.filter((t) => t.items.some((i) => !isItemFinal(i)));

  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <KitchenHeader
        totalTables={activeTables.length}
        totalItems={activeItems.length}
        lastRefresh={lastRefresh}
        onRefresh={loadOrders}
      />

      {message && (
        <div
          className={
            'mb-4 px-4 py-2 rounded-lg border text-sm whitespace-pre-line shadow-sm ' +
            (message.startsWith('❌')
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700')
          }
        >
          {message}
        </div>
      )}

      {activeTables.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-slate-700 text-lg font-medium">Không có món nào chờ chế biến</p>
          <p className="text-slate-400 text-sm mt-2">
            Bếp đang rảnh. Trang tự làm mới mỗi {POLL_INTERVAL_MS / 1000} giây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {activeTables.map((t) => (
            <TableOrderCard
              key={t.ma_hoa_don}
              table={t}
              onComplete={handleComplete}
              onAckCancel={handleAcknowledgeCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const KitchenHeader = ({ totalTables, totalItems, lastRefresh, onRefresh }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-xl font-bold text-slate-800">Đơn chờ chế biến</h2>
      <p className="text-sm text-slate-500 mt-0.5">
        {totalTables} bàn • {totalItems} món cần xử lý
      </p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400">
        Cập nhật lúc: {lastRefresh.toLocaleTimeString('vi-VN')}
      </span>
      <button
        onClick={onRefresh}
        className="text-sm text-orange-600 border border-orange-300 hover:bg-orange-50 px-3 py-1.5 rounded-lg bg-white"
      >
        ↻ Làm mới
      </button>
    </div>
  </div>
);

// Nhóm các món trong 1 bill theo đợt gửi bếp (cùng thoi_gian_goi_mon = cùng 1 lần
// bấm "Xác nhận gửi bếp" của phục vụ) -> mỗi đợt hiện thành 1 "vé" riêng biệt,
// chỉ chung bàn/số bill với các đợt khác.
const groupByBatch = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.thoi_gian_goi_mon;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([time, list]) => ({ time, items: list }));
};

const TableOrderCard = ({ table, onComplete, onAckCancel }) => {
  // Bill chính = tất cả trừ món hủy đã tiếp nhận (đã xử lý xong, không cần hiện nữa)
  const mainItems = table.items.filter((i) =>
    !(i.trang_thai === 'Da_huy' && i.ghi_chu?.includes('[BEP_OK]'))
  );
  const batches = groupByBatch(mainItems);

  const pendingCount = table.items.filter((i) =>
    !['Da_hoan_thanh', 'Da_huy'].includes(i.trang_thai)
  ).length;
  const doneCount = table.items.filter((i) => i.trang_thai === 'Da_hoan_thanh').length;
  const cancelPendingCount = table.items.filter((i) =>
    i.trang_thai === 'Da_huy' && !i.ghi_chu?.includes('[BEP_OK]')
  ).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex justify-between items-center gap-2">
        <div className="min-w-0">
          <div className="font-bold text-slate-800 text-sm truncate">{table.ten_ban}</div>
          <div className="text-xs text-slate-500 truncate">{table.ten_khu_vuc}</div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {cancelPendingCount > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
              {cancelPendingCount}
            </span>
          )}
          {pendingCount > 0 && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              {pendingCount}
            </span>
          )}
          {doneCount > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              {doneCount}
            </span>
          )}
        </div>
      </div>

      {/* Bill chính — mỗi đợt gửi bếp hiện thành 1 "vé" riêng, phân cách bằng đường đứt nét */}
      {batches.map((batch, idx) => (
        <div
          key={batch.time}
          className={idx > 0 ? 'border-t-2 border-dashed border-orange-200' : ''}
        >
          {batches.length > 1 && (
            <div className="px-3 py-1 bg-orange-50 text-xs font-semibold text-orange-700 flex items-center gap-1">
              🎫 Đợt {idx + 1} · {new Date(batch.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-2 py-1.5 text-center w-10">SL</th>
                <th className="px-2 py-1.5 text-left">Món</th>
                <th className="px-2 py-1.5 text-left">Ghi chú</th>
                <th className="px-2 py-1.5 text-center w-12"></th>
              </tr>
            </thead>
            <tbody>
              {batch.items.map((item) => (
                <OrderItemRow
                  key={item.ma_chi_tiet_hd}
                  item={item}
                  onComplete={onComplete}
                  onAckCancel={onAckCancel}
                />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const OrderItemRow = ({ item, onComplete, onAckCancel }) => {
  const isDone = item.trang_thai === 'Da_hoan_thanh';
  const isCancelled = item.trang_thai === 'Da_huy';

  // Trích thông tin từ ghi_chu (loại bỏ tag [BEP_OK] nếu có)
  const cleanGhiChu = item.ghi_chu?.replace(/\s*\[BEP_OK\]\s*/, '');
  const lyDoHuy = isCancelled ? cleanGhiChu?.match(/\[Lý do hủy: (.+?)\]/)?.[1] : null;
  const ghiChuHienThi = cleanGhiChu?.replace(/\s*\[Lý do hủy: .+?\]\s*/, '').trim();

  // ===== MÓN BỊ HỦY - CHƯA TIẾP NHẬN (đã tiếp nhận sẽ ẩn khỏi danh sách) =====
  if (isCancelled) {
    return (
      <tr className="border-t border-red-100 bg-red-50 animate-pulse">
        <td className="px-2 py-2 text-center text-red-600 font-bold line-through">
          {item.so_luong}
        </td>
        <td className="px-2 py-2 text-slate-800">
          <div className="text-red-600 text-xs font-bold mb-0.5">🚫 YÊU CẦU HỦY</div>
          <div className="line-through opacity-80">{item.ten_mon_an}</div>
        </td>
        <td className="px-2 py-2 text-xs text-red-600">
          {lyDoHuy || <span className="text-slate-400 italic">—</span>}
        </td>
        <td className="px-2 py-2 text-center">
          <button
            onClick={() => onAckCancel(item)}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
            title="Đã dừng chế biến"
          >
            ✓
          </button>
        </td>
      </tr>
    );
  }

  // ===== MÓN HOÀN THÀNH (xanh, gạch ngang) =====
  if (isDone) {
    return (
      <tr className="border-t border-slate-100 bg-emerald-50/40">
        <td className="px-2 py-2 text-center text-emerald-600 line-through">
          {item.so_luong}
        </td>
        <td className="px-2 py-2 text-slate-400 line-through decoration-emerald-400 decoration-2">
          {item.ten_mon_an}
        </td>
        <td className="px-2 py-2 text-xs text-slate-400 italic line-through">
          {ghiChuHienThi || '—'}
        </td>
        <td className="px-2 py-2 text-center">
          <span className="inline-block w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-xs leading-8 font-bold">
            ✓
          </span>
        </td>
      </tr>
    );
  }

  // ===== MÓN CHỜ / ĐANG LÀM =====
  const waitCls =
    item.phut_da_cho >= 15 ? 'text-red-600 font-semibold' :
    item.phut_da_cho >= 10 ? 'text-amber-600' :
    'text-slate-400';

  return (
    <tr className="border-t border-slate-100 hover:bg-orange-50/50">
      <td className="px-2 py-2 text-center text-orange-600 font-bold">
        {item.so_luong}
      </td>
      <td className="px-2 py-2 text-slate-800">
        <div>{item.ten_mon_an}</div>
        <div className={`text-xs ${waitCls}`}>⏱ {item.phut_da_cho}p</div>
      </td>
      <td className="px-2 py-2 text-xs text-slate-500 italic">
        {ghiChuHienThi || <span className="text-slate-400 not-italic">—</span>}
      </td>
      <td className="px-2 py-2 text-center">
        <button
          onClick={() => onComplete(item)}
          className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
          title="Hoàn thành"
        >
          ✓
        </button>
      </td>
    </tr>
  );
};

export default KitchenPage;
