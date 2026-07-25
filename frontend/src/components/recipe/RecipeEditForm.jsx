function RecipeEditForm({ tenNL, donViTinh, soLuong, setSoLuong, ghiChu, setGhiChu, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1 block';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

  return (
    <div>
      <div className="rounded-lg bg-stone-50 border border-stone-200 px-4 py-3 mb-4">
        <div className="text-xs text-stone-400">Nguyên liệu</div>
        <div className="text-sm font-medium text-stone-800">{tenNL}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Số lượng sử dụng *</label>
          <div className="relative">
            <input type="number" className={inp + ' pr-14'} value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
              {donViTinh}
            </span>
          </div>
        </div>
        <div>
          <label className={lbl}>Ghi chú</label>
          <textarea rows={3} className={inp + ' resize-none'} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Tuỳ chọn" />
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">Huỷ</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Cập nhật</button>
      </div>
    </div>
  );
}

export default RecipeEditForm;
