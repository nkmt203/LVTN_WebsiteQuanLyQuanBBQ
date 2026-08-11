import { Pencil } from "lucide-react";
import ToggleSwitch from "../common/ToggleSwitch";

function EmployeeTable({ employees, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[8%]"}>Mã</th>
            <th className={th + " w-[20%]"}>Họ tên</th>
            <th className={th + " w-[14%]"}>Số điện thoại</th>
            <th className={th + " w-[14%]"}>Tài khoản</th>
            <th className={th + " w-[12%]"}>Vai trò</th>
            <th className={th + " w-[22%]"}>Hoạt động</th>
            <th className={th + " w-[10%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {employees.map((nv) => {
            const active = nv.trang_thai === 'Hoat_dong';
            const isAdmin = nv.ten_vai_tro === 'Admin';
            return (
              <tr key={nv.ma_nhan_vien} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{nv.ma_nhan_vien}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{nv.ho_ten}</td>
                <td className={td}>{nv.so_dien_thoai}</td>
                <td className={td}>{nv.ten_dang_nhap}</td>
                <td className={td}>{nv.ten_vai_tro}</td>
                <td className={td}>
                  {isAdmin ? (
                    <span className="text-xs font-medium text-blue-700">Hoạt động</span>
                  ) : (
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
                  )}
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(nv)}
                      title="Sửa nhân viên"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
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
