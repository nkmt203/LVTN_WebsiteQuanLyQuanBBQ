import { Pencil, Trash2 } from "lucide-react";
import ToggleSwitch from "../common/ToggleSwitch";

function RecipeTable({ recipes, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[19%]"}>Món ăn</th>
            <th className={th + " w-[19%]"}>Nguyên liệu</th>
            <th className={th + " w-[9%]"}>Số lượng</th>
            <th className={th + " w-[9%]"}>ĐVT</th>
            <th className={th + " w-[14%]"}>Ghi chú</th>
            <th className={th + " w-[16%]"}>Hoạt động</th>
            <th className={th + " w-[14%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {recipes.map((r) => {
            const active = r.trang_thai === 'Hoat_dong';
            return (
              <tr key={r.ma_dinh_muc} className="hover:bg-stone-50 transition-colors">
                <td className={td + ' font-medium text-stone-800 truncate'}>{r.ten_mon_an}</td>
                <td className={td + ' truncate'}>{r.ten_nguyen_lieu}</td>
                <td className={td}>{Number(r.so_luong_su_dung)}</td>
                <td className={td}>{r.ten_don_vi_tinh}</td>
                <td className={td + ' truncate'}>{r.ghi_chu || <span className="text-stone-300">—</span>}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={active}
                      onChange={() => onToggleStatus(r)}
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
                      {active ? "Hoạt động" : "Ngừng SD"}
                    </span>
                  </div>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(r)}
                      title="Sửa định mức"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      title="Xóa định mức"
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

export default RecipeTable;
