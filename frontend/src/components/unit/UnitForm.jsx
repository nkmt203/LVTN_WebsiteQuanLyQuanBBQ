function UnitForm({ editingId, tenDVT, setTenDVT, trangThai, setTrangThai, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

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
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default UnitForm;
