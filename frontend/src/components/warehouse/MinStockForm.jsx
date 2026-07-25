function MinStockForm({ tenNguyenLieu, tonHienTai, mucTonToiThieu, setMucTonToiThieu, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1 block';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

  return (
    <div>
      <div className="flex items-center justify-between rounded-lg bg-stone-50 border border-stone-200 px-4 py-3 mb-4">
        <div>
          <div className="text-xs text-stone-400">Nguyên liệu</div>
          <div className="text-sm font-medium text-stone-800">{tenNguyenLieu}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-stone-400">Tồn hiện tại</div>
          <div className="text-sm font-medium text-stone-800">{tonHienTai}</div>
        </div>
      </div>
      <div>
        <label className={lbl}>Mức tồn tối thiểu *</label>
        <input type="number" min="0" className={inp} value={mucTonToiThieu}
               onChange={(e) => setMucTonToiThieu(e.target.value)} />
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          Lưu
        </button>
      </div>
    </div>
  );
}

export default MinStockForm;
