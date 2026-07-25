import ToggleSwitch from "../common/ToggleSwitch";

function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên danh mục</th>
            <th className={th}>Mô tả</th>
            <th className={th}>Đang sử dụng</th>
            <th className={th + " text-right"}>Thao tác</th>
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
              <tr key={dm.ma_danh_muc} className="hover:bg-stone-50">
                <td className={td}>{dm.ma_danh_muc}</td>
                <td className={td + ' font-medium text-stone-800'}>{dm.ten_danh_muc}</td>
                <td className={td}>{dm.mo_ta || <span className="text-stone-300">—</span>}</td>
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
                  <button onClick={() => onEdit(dm)} className="text-stone-600 hover:text-stone-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onDelete(dm)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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
