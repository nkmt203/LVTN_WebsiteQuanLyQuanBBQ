function CategoryForm({ editingId, tenDanhMuc, setTenDanhMuc, moTa, setMoTa, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Tên danh mục *</label>
          <input className={inp} value={tenDanhMuc} onChange={(e) => setTenDanhMuc(e.target.value)}
                 placeholder="VD: Nhóm thịt nướng" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Mô tả</label>
          <input className={inp} value={moTa} onChange={(e) => setMoTa(e.target.value)}
                 placeholder="Mô tả chi tiết về danh mục (tuỳ chọn)" />
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm danh mục' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default CategoryForm;