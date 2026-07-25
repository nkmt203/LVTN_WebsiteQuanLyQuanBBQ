import ToggleSwitch from "../common/ToggleSwitch";

function RecipeTable({ recipes, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Món ăn</th>
            <th className={th}>Nguyên liệu</th>
            <th className={th}>Số lượng</th>
            <th className={th}>ĐVT</th>
            <th className={th}>Ghi chú</th>
            <th className={th}>Hoạt động</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {recipes.map((r) => {
            const active = r.trang_thai === 'Hoat_dong';
            return (
              <tr key={r.ma_dinh_muc} className="hover:bg-stone-50">
                <td className={td + ' font-medium text-stone-800'}>{r.ten_mon_an}</td>
                <td className={td}>{r.ten_nguyen_lieu}</td>
                <td className={td}>{Number(r.so_luong_su_dung)}</td>
                <td className={td}>{r.ten_don_vi_tinh}</td>
                <td className={td}>{r.ghi_chu || <span className="text-stone-300">—</span>}</td>
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
                  <button onClick={() => onEdit(r)} className="text-stone-600 hover:text-stone-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onDelete(r)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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
