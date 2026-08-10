import { Pencil, Trash2 } from "lucide-react";
import ToggleSwitch from "../common/ToggleSwitch";

function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[10%]"}>Mã</th>
            <th className={th + " w-[22%]"}>Tên danh mục</th>
            <th className={th + " w-[28%]"}>Mô tả</th>
            <th className={th + " w-[26%]"}>Đang sử dụng</th>
            <th className={th + " w-[14%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={5}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {categories.map((dm) => {
            const dangSD = dm.trang_thai === 'Dang_su_dung';
            return (
              <tr key={dm.ma_danh_muc} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{dm.ma_danh_muc}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{dm.ten_danh_muc}</td>
                <td className={td + ' truncate'}>{dm.mo_ta || <span className="text-stone-300">—</span>}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={dangSD}
                      onChange={() => onToggleStatus(dm)}
                      title={
                        dangSD
                          ? "Đang sử dụng — bấm để ngừng sử dụng"
                          : "Ngừng sử dụng — bấm để kích hoạt lại"
                      }
                      onLabel="Đang sử dụng"
                      offLabel="Ngừng sử dụng"
                    />
                    <span
                      className={
                        "text-xs font-medium " +
                        (dangSD ? "text-blue-700" : "text-stone-400")
                      }
                    >
                      {dangSD ? "Đang sử dụng" : "Ngừng sử dụng"}
                    </span>
                  </div>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(dm)}
                      title="Sửa danh mục"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(dm)}
                      title="Xóa danh mục"
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

export default CategoryTable;
