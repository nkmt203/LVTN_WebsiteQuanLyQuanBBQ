function RecipeEditForm({ tenNL, donViTinh, soLuong, setSoLuong, ghiChu, setGhiChu, onSave, onCancel }) {
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Nguyên liệu</label>
          <p className="text-sm text-slate-800 font-medium">{tenNL} ({donViTinh})</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Số lượng sử dụng *</label>
          <input type="number" className={inp} value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Ghi chú</label>
          <input className={inp} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Tuỳ chọn" />
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">Cập nhật</button>
      </div>
    </div>
  );
}

export default RecipeEditForm;