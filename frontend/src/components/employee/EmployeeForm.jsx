function EmployeeForm({ editingId, hoTen, setHoTen, soDienThoai, setSoDienThoai, maTaiKhoan, setMaTaiKhoan, accountLabel, accounts, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-stone-600 mb-1 block';
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={lbl}>Họ và tên *</label>
          <input className={inp} value={hoTen} onChange={(e) => setHoTen(e.target.value)}
                 placeholder="VD: Nguyễn Văn A" />
        </div>
        <div>
          <label className={lbl}>Số điện thoại *</label>
          <input className={inp} value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)}
                 placeholder="VD: 0901234567" />
        </div>
        <div>
          <label className={lbl}>Tài khoản (vai trò) *</label>
          {editingId === null ? (
            <select className={inp} value={maTaiKhoan} onChange={(e) => setMaTaiKhoan(e.target.value)}>
              <option value="">-- Chọn tài khoản --</option>
              {accounts.map((tk) => (
                <option key={tk.ma_tai_khoan} value={tk.ma_tai_khoan}>
                  {tk.ten_dang_nhap} ({tk.ten_vai_tro})
                </option>
              ))}
            </select>
          ) : (
            <input className={inp + ' bg-stone-100 text-stone-500'} value={accountLabel} disabled
                   title="Không thể đổi tài khoản đã gán sau khi tạo hồ sơ" />
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">Huỷ</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;
