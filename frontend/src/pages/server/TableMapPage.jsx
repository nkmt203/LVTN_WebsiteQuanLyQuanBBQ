import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTablesMap, openTable } from '../../api/serviceApi';
import { getErrorMessage } from '../../api/errorHandler';

const POLL_INTERVAL_MS = 5000;

// Mapping trạng thái sang màu và nhãn
const STATUS_STYLE = {
  Trong: {
    bg: 'bg-emerald-50 border-emerald-300 hover:border-emerald-500',
    text: 'text-emerald-700',
    label: 'Trống',
  },
  Dang_su_dung: {
    bg: 'bg-blue-50 border-blue-400 hover:border-blue-600',
    text: 'text-blue-700',
    label: 'Đang phục vụ',
  },
  Da_dat_truoc: {
    bg: 'bg-amber-50 border-amber-300 hover:border-amber-500',
    text: 'text-amber-700',
    label: 'Đã đặt trước',
  },
};

function TableMapPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const loadTables = async () => {
    try {
      setTables(await getTablesMap());
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
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

  const handleClickTable = async (b) => {
    // Bàn đang phục vụ -> vào trang gọi món (Tin 2 sẽ làm)
    if (b.trang_thai === 'Dang_su_dung') {
      navigate(`/server/order/${b.ma_ban}`);
      return;
    }

    // Bàn trống -> mở bàn
    if (b.trang_thai === 'Trong') {
      if (!window.confirm(`Mở bàn "${b.ten_ban}"?`)) return;
      try {
        await openTable(b.ma_ban);
        setMessage(`✅ Đã mở ${b.ten_ban}`);
        await loadTables();
        // Sau khi mở thành công -> chuyển thẳng sang trang gọi món
        navigate(`/server/order/${b.ma_ban}`);
      } catch (err) {
        setMessage('❌ ' + getErrorMessage(err));
        await loadTables();
      }
      return;
    }

    // Bàn đã đặt trước - Tin sau xử lý (đặt bàn)
    setMessage('Bàn đã đặt trước - chức năng đón khách đặt trước sẽ làm sau.');
  };

  // Nhóm bàn theo khu vực để hiển thị
  const grouped = tables.reduce((acc, b) => {
    (acc[b.ten_khu_vuc] ??= []).push(b);
    return acc;
  }, {});

  if (loading) return <p className="text-slate-500">Đang tải sơ đồ bàn...</p>;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">Sơ đồ bàn</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Bấm bàn Trống để mở phục vụ. Bấm bàn Đang phục vụ để gọi món.
        </p>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* Chú thích màu */}
      <div className="flex gap-4 mb-5 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400"></span>
          Trống
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-200 border border-blue-500"></span>
          Đang phục vụ
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400"></span>
          Đã đặt trước
        </span>
      </div>

      {Object.entries(grouped).map(([khuVuc, list]) => (
        <div key={khuVuc} className="mb-6">
          <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">
            {khuVuc}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {list.map((b) => (
              <TableCard key={b.ma_ban} ban={b} onClick={handleClickTable} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Tách 1 ô bàn ra thành component nhỏ
function TableCard({ ban, onClick }) {
  const style = STATUS_STYLE[ban.trang_thai] || STATUS_STYLE.Trong;
  return (
    <button
      onClick={() => onClick(ban)}
      className={`p-4 rounded-xl border-2 text-left transition-all ${style.bg}`}
    >
      <div className="font-bold text-slate-800">{ban.ten_ban}</div>
      <div className="text-xs text-slate-500 mt-1">{ban.so_ghe} ghế</div>
      <div className={`text-xs font-medium mt-2 ${style.text}`}>{style.label}</div>
    </button>
  );
}

export default TableMapPage;