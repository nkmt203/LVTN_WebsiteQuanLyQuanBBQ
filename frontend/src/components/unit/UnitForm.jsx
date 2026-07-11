function UnitForm({ editingId, tenDVT, setTenDVT, trangThai, setTrangThai, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Tên đơn vị tính *</label>
          <input className={inp} value={tenDVT} onChange={(e) => setTenDVT(e.target.value)}
                 placeholder="VD: kg, gram, lon, chai..." />
        </div>
        {editingId !== null && (
          <div className="flex flex-col">
            <label className={lbl}>Trạng thái</label>
            <select className={inp} value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
              <option value="Dang_dung">Đang dùng</option>
              <option value="Ngung_su_dung">Ngừng sử dụng</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default UnitForm;