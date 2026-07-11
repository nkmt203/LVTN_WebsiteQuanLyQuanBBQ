function UnitFilterBar({ keyword, setKeyword, trangThai, setTrangThai, onSearch, onReset }) {
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input
        className={inp + ' flex-1 min-w-[180px]'}
        placeholder="Tìm theo tên hoặc mã đơn vị tính"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <select className={inp} value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="Dang_dung">Đang dùng</option>
        <option value="Ngung_su_dung">Ngừng sử dụng</option>
      </select>
      <button onClick={onSearch} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">
        Tìm
      </button>
      <button onClick={onReset} className="text-slate-500 text-sm hover:text-slate-700 px-2">
        Xóa lọc
      </button>
    </div>
  );
}

export default UnitFilterBar;