function IngredientForm({ editingId, tenNL, setTenNL, maDVT, setMaDVT, units, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Tên nguyên liệu *</label>
          <input className={inp} value={tenNL} onChange={(e) => setTenNL(e.target.value)}
                 placeholder="VD: Thịt ba chỉ bò" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Đơn vị tính *</label>
          <select className={inp} value={maDVT} onChange={(e) => setMaDVT(e.target.value)}>
            <option value="">-- Chọn đơn vị tính --</option>
            {units.map((u) => (
              <option key={u.ma_don_vi_tinh} value={u.ma_don_vi_tinh}>{u.ten_don_vi_tinh}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default IngredientForm;