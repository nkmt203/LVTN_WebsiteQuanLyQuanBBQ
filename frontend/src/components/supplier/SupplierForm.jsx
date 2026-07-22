function SupplierForm({ editingId, tenNCC, setTenNCC, soDienThoai, setSoDienThoai, diaChi, setDiaChi, ghiChu, setGhiChu, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Tên nhà cung cấp *</label>
          <input className={inp} value={tenNCC} onChange={(e) => setTenNCC(e.target.value)}
                 placeholder="VD: Công ty TNHH Thực phẩm ABC" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Số điện thoại *</label>
          <input className={inp} value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)}
                 placeholder="VD: 0901234567" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Địa chỉ</label>
          <input className={inp} value={diaChi} onChange={(e) => setDiaChi(e.target.value)}
                 placeholder="Địa chỉ nhà cung cấp (tuỳ chọn)" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Ghi chú</label>
          <input className={inp} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)}
                 placeholder="Ghi chú (tuỳ chọn)" />
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm nhà cung cấp' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default SupplierForm;
