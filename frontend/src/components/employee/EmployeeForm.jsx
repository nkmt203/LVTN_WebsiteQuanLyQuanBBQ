function EmployeeForm({ editingId, hoTen, setHoTen, soDienThoai, setSoDienThoai, maTaiKhoan, setMaTaiKhoan, accountLabel, accounts, onSave, onCancel }) {
  const lbl = 'text-sm font-medium text-slate-600 mb-1';
  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Họ và tên *</label>
          <input className={inp} value={hoTen} onChange={(e) => setHoTen(e.target.value)}
                 placeholder="VD: Nguyễn Văn A" />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Số điện thoại *</label>
          <input className={inp} value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)}
                 placeholder="VD: 0901234567" />
        </div>
        <div className="flex flex-col">
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
            <input className={inp + ' bg-slate-100 text-slate-500'} value={accountLabel} disabled
                   title="Không thể đổi tài khoản đã gán sau khi tạo hồ sơ" />
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;
