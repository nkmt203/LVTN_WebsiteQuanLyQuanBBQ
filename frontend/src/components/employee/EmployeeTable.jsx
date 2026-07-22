function EmployeeTable({ employees, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Họ tên</th>
            <th className={th}>Số điện thoại</th>
            <th className={th}>Tài khoản</th>
            <th className={th}>Vai trò</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr><td className={td + ' text-center text-slate-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {employees.map((nv) => {
            const active = nv.trang_thai === 'Hoat_dong';
            return (
              <tr key={nv.ma_nhan_vien} className="hover:bg-slate-50">
                <td className={td}>{nv.ma_nhan_vien}</td>
                <td className={td + ' font-medium text-slate-800'}>{nv.ho_ten}</td>
                <td className={td}>{nv.so_dien_thoai}</td>
                <td className={td}>{nv.ten_dang_nhap}</td>
                <td className={td}>{nv.ten_vai_tro}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {active ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(nv)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onToggleStatus(nv)} className="text-slate-600 hover:text-slate-900 text-sm">
                    {active ? 'Ngừng HĐ' : 'Kích hoạt'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
