import ToggleSwitch from "../common/ToggleSwitch";

function IngredientTable({ ingredients, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên nguyên liệu</th>
            <th className={th}>Đơn vị tính</th>
            <th className={th}>Hoạt động</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr><td className={td + ' text-center text-stone-400'} colSpan={5}>Không tìm thấy nguyên liệu nào phù hợp với từ khóa.</td></tr>
          )}
          {ingredients.map((nl) => {
            const active = nl.trang_thai === 'Hoat_dong';
            return (
              <tr key={nl.ma_nguyen_lieu} className="hover:bg-stone-50">
                <td className={td}>{nl.ma_nguyen_lieu}</td>
                <td className={td + ' font-medium text-stone-800'}>{nl.ten_nguyen_lieu}</td>
                <td className={td}>{nl.ten_don_vi_tinh}</td>
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
                  <button onClick={() => onEdit(nl)} className="text-stone-600 hover:text-stone-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onDelete(nl)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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
