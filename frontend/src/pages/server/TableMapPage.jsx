import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTablesMap, openTable } from '../../api/serviceApi';
import { getErrorMessage } from '../../api/errorHandler';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const POLL_INTERVAL_MS = 5000;

// Mapping trạng thái sang màu và nhãn
const STATUS_STYLE = {
  Trong: {
    card: 'bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    label: 'Trống',
  },
  Dang_su_dung: {
    card: 'bg-teal-50 border-teal-300 hover:border-teal-500 hover:shadow-md',
    dot: 'bg-teal-500',
    text: 'text-teal-700',
    label: 'Đang phục vụ',
  },
};

function TableMapPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [openTarget, setOpenTarget] = useState(null); // bàn Trống đang chờ xác nhận mở
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const loadTables = async () => {
    try {
      setTables(await getTablesMap());
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTables();
      setLoading(false);
    };
    init();

    timerRef.current = setInterval(loadTables, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleClickTable = (b) => {
    // Bàn đang phục vụ -> vào trang gọi món
    if (b.trang_thai === 'Dang_su_dung') {
      navigate(`/server/order/${b.ma_ban}`);
      return;
    }
    // Bàn trống -> yêu cầu xác nhận mở bàn
    if (b.trang_thai === 'Trong') {
      setOpenTarget(b);
    }
  };

  const confirmOpenTable = async () => {
    const target = openTarget;
    await openTable(target.ma_ban);
    setFeedback({ type: 'success', text: `Đã mở ${target.ten_ban}` });
    setOpenTarget(null);
    await loadTables();
    // Sau khi mở thành công -> chuyển thẳng sang trang gọi món
    navigate(`/server/order/${target.ma_ban}`);
  };

  // Nhóm bàn theo khu vực để hiển thị
  const grouped = tables.reduce((acc, b) => {
    (acc[b.ten_khu_vuc] ??= []).push(b);
    return acc;
  }, {});

  const soTrong = tables.filter((b) => b.trang_thai === 'Trong').length;
  const soDangPhucVu = tables.filter((b) => b.trang_thai === 'Dang_su_dung').length;

  if (loading) return <p className="text-sm text-stone-500">Đang tải sơ đồ bàn...</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Sơ đồ bàn</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Bấm bàn Trống để mở phục vụ. Bấm bàn Đang phục vụ để gọi món.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-500">Trống</span>
            <span className="font-semibold text-stone-800">{soTrong}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="text-stone-500">Đang phục vụ</span>
            <span className="font-semibold text-stone-800">{soDangPhucVu}</span>
          </div>
        </div>
      </div>

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

      {tables.length === 0 && (
        <p className="text-sm text-stone-400">Chưa có bàn nào được thiết lập.</p>
      )}

      {Object.entries(grouped).map(([khuVuc, list]) => (
        <div key={khuVuc} className="mb-6">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            {khuVuc}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {list.map((b) => (
              <TableCard key={b.ma_ban} ban={b} onClick={handleClickTable} />
            ))}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!openTarget}
        title="Mở bàn"
        description={openTarget ? `Xác nhận mở "${openTarget.ten_ban}" để đón khách?` : ''}
        confirmText="Mở bàn"
        onConfirm={confirmOpenTable}
        onClose={() => setOpenTarget(null)}
      />
    </div>
  );
}

// Tách 1 ô bàn ra thành component nhỏ
function TableCard({ ban, onClick }) {
  const style = STATUS_STYLE[ban.trang_thai] || STATUS_STYLE.Trong;
  return (
    <button
      onClick={() => onClick(ban)}
      className={`p-4 rounded-xl border-2 text-left transition-all active:scale-95 ${style.card}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-stone-800">{ban.ten_ban}</span>
        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      </div>
      <div className="text-xs text-stone-500 mt-1">{ban.so_ghe} ghế</div>
      <div className={`text-xs font-medium mt-2 ${style.text}`}>{style.label}</div>
    </button>
  );
}

export default TableMapPage;
