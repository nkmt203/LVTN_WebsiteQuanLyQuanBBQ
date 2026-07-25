function CategoryForm({ editingId, tenDanhMuc, setTenDanhMuc, moTa, setMoTa, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1 block';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Tên danh mục *</label>
          <input className={inp} value={tenDanhMuc} onChange={(e) => setTenDanhMuc(e.target.value)}
                 placeholder="VD: Nhóm thịt nướng" />
        </div>
        <div>
          <label className={lbl}>Mô tả</label>
          <textarea rows={3} className={inp + ' resize-none'} value={moTa} onChange={(e) => setMoTa(e.target.value)}
                    placeholder="Mô tả chi tiết về danh mục (tuỳ chọn)" />
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          {editingId === null ? 'Thêm danh mục' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default CategoryForm;
