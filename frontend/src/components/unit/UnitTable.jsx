import { Pencil, Trash2 } from "lucide-react";

function UnitTable({ units, onEdit, onDelete }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[16%]"}>Mã</th>
            <th className={th + " w-[30%]"}>Tên đơn vị tính</th>
            <th className={th + " w-[24%]"}>Trạng thái</th>
            <th className={th + " w-[30%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 && (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={4}>
                Không tìm thấy dữ liệu.
              </td>
            </tr>
          )}
          {units.map((dvt) => {
            const dangDung = dvt.trang_thai === 'Dang_dung';
            return (
              <tr key={dvt.ma_don_vi_tinh} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{dvt.ma_don_vi_tinh}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{dvt.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (dangDung ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500')}>
                    {dangDung ? 'Đang dùng' : 'Ngừng sử dụng'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(dvt)}
                      title="Sửa đơn vị tính"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(dvt)}
                      title="Xóa đơn vị tính"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={15} />
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

export default UnitTable;
