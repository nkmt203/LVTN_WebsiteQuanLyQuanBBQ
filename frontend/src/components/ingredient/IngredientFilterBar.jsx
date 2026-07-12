function IngredientFilterBar({ keyword, setKeyword, donViTinh, setDonViTinh, trangThai, setTrangThai, units, onSearch, onReset }) {
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input
        className={inp + ' flex-1 min-w-[180px]'}
        placeholder="Tìm theo tên hoặc mã nguyên liệu"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <select className={inp} value={donViTinh} onChange={(e) => setDonViTinh(e.target.value)}>
        <option value="">Tất cả đơn vị</option>
        {units.map((u) => (
          <option key={u.ma_don_vi_tinh} value={u.ma_don_vi_tinh}>{u.ten_don_vi_tinh}</option>
        ))}
      </select>
      <select className={inp} value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="Hoat_dong">Hoạt động</option>
        <option value="Ngung_su_dung">Ngừng sử dụng</option>
      </select>
      <button onClick={onSearch} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">Tìm</button>
      <button onClick={onReset} className="text-slate-500 text-sm hover:text-slate-700 px-2">Xóa lọc</button>
    </div>
  );
}

export default IngredientFilterBar;