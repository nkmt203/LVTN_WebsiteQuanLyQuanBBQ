function SupplierForm({ editingId, tenNCC, setTenNCC, soDienThoai, setSoDienThoai, diaChi, setDiaChi, ghiChu, setGhiChu, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1 block';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={lbl}>Tên nhà cung cấp *</label>
          <input className={inp} value={tenNCC} onChange={(e) => setTenNCC(e.target.value)}
                 placeholder="VD: Công ty TNHH Thực phẩm ABC" />
        </div>
        <div>
          <label className={lbl}>Số điện thoại *</label>
          <input className={inp} value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)}
                 placeholder="VD: 0901234567" />
        </div>
        <div>
          <label className={lbl}>Địa chỉ</label>
          <input className={inp} value={diaChi} onChange={(e) => setDiaChi(e.target.value)}
                 placeholder="Địa chỉ (tuỳ chọn)" />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Ghi chú</label>
          <textarea rows={3} className={inp + ' resize-none'} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)}
                    placeholder="Ghi chú (tuỳ chọn)" />
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          {editingId === null ? 'Thêm nhà cung cấp' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default SupplierForm;
