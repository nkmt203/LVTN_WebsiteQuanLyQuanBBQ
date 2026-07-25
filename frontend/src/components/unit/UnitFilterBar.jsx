function UnitFilterBar({ keyword, setKeyword, trangThai, setTrangThai, onSearch, onReset }) {
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
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
      <button onClick={onSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
        Tìm
      </button>
      <button onClick={onReset} className="text-stone-500 text-sm hover:text-stone-700 px-2">
        Xóa lọc
      </button>
    </div>
  );
}

export default UnitFilterBar;
