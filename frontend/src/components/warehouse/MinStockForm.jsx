function MinStockForm({ tenNguyenLieu, tonHienTai, mucTonToiThieu, setMucTonToiThieu, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <p className="text-sm text-slate-600 mb-3">
        Nguyên liệu: <span className="font-medium text-slate-800">{tenNguyenLieu}</span>
        {' · '}Tồn hiện tại: <span className="font-medium text-slate-800">{tonHienTai}</span>
      </p>
      <div className="flex flex-col">
        <label className={lbl}>Mức tồn tối thiểu *</label>
        <input type="number" min="0" className={inp} value={mucTonToiThieu}
               onChange={(e) => setMucTonToiThieu(e.target.value)} />
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          Lưu
        </button>
      </div>
    </div>
  );
}

export default MinStockForm;
