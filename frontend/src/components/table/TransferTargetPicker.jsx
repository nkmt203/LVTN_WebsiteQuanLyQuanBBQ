// Danh sách thu nhỏ các bàn Trống để chọn làm bàn đích khi chuyển bàn
function TransferTargetPicker({ tables, onPick }) {
  if (tables.length === 0) {
    return <p className="text-sm text-slate-400 italic">Không còn bàn nào đang trống.</p>;
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {tables.map((t) => (
        <button
          key={t.ma_ban}
          onClick={() => onPick(t)}
          className="p-3 rounded-lg border-2 border-emerald-300 bg-emerald-50 hover:border-emerald-500 text-left transition-all"
        >
          <div className="font-bold text-slate-800 text-sm">{t.ten_ban}</div>
          <div className="text-xs text-slate-500">{t.ten_khu_vuc} • {t.so_ghe} ghế</div>
        </button>
      ))}
    </div>
  );
}

export default TransferTargetPicker;
