import ToggleSwitch from "../common/ToggleSwitch";

function EmployeeTable({ employees, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Họ tên</th>
            <th className={th}>Số điện thoại</th>
            <th className={th}>Tài khoản</th>
            <th className={th}>Vai trò</th>
            <th className={th}>Hoạt động</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {employees.map((nv) => {
            const active = nv.trang_thai === 'Hoat_dong';
            return (
              <tr key={nv.ma_nhan_vien} className="hover:bg-stone-50">
                <td className={td}>{nv.ma_nhan_vien}</td>
                <td className={td + ' font-medium text-stone-800'}>{nv.ho_ten}</td>
                <td className={td}>{nv.so_dien_thoai}</td>
                <td className={td}>{nv.ten_dang_nhap}</td>
                <td className={td}>{nv.ten_vai_tro}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={active}
                      onChange={() => onToggleStatus(nv)}
                      title={
                        active
                          ? "Hoạt động — bấm để ngừng hoạt động"
                          : "Ngừng hoạt động — bấm để kích hoạt lại"
                      }
                      onLabel="Hoạt động"
                      offLabel="Ngừng hoạt động"
                    />
                    <span
                      className={
                        "text-xs font-medium " +
                        (active ? "text-blue-700" : "text-stone-400")
                      }
                    >
                      {active ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <button onClick={() => onEdit(nv)} className="text-stone-600 hover:text-stone-900 text-sm">Sửa</button>
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
