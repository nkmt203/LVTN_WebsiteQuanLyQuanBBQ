import { Pencil, Trash2 } from "lucide-react";
import ToggleSwitch from "../common/ToggleSwitch";

function IngredientTable({ ingredients, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[10%]"}>Mã</th>
            <th className={th + " w-[30%]"}>Tên nguyên liệu</th>
            <th className={th + " w-[24%]"}>Đơn vị tính</th>
            <th className={th + " w-[22%]"}>Hoạt động</th>
            <th className={th + " w-[14%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={5}>Không tìm thấy nguyên liệu nào phù hợp với từ khóa.</td></tr>
          )}
          {ingredients.map((nl) => {
            const active = nl.trang_thai === 'Hoat_dong';
            return (
              <tr key={nl.ma_nguyen_lieu} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{nl.ma_nguyen_lieu}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{nl.ten_nguyen_lieu}</td>
                <td className={td + ' truncate'}>{nl.ten_don_vi_tinh}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={active}
                      onChange={() => onToggleStatus(nl)}
                      title={
                        active
                          ? "Hoạt động — bấm để ngừng sử dụng"
                          : "Ngừng sử dụng — bấm để kích hoạt lại"
                      }
                      onLabel="Hoạt động"
                      offLabel="Ngừng sử dụng"
                    />
                    <span
                      className={
                        "text-xs font-medium " +
                        (active ? "text-blue-700" : "text-stone-400")
                      }
                    >
                      {active ? "Hoạt động" : "Ngừng sử dụng"}
                    </span>
                  </div>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(nl)}
                      title="Sửa nguyên liệu"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(nl)}
                      title="Xóa nguyên liệu"
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

export default IngredientTable;
