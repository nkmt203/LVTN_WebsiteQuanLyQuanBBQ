function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên danh mục</th>
            <th className={th}>Mô tả</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={5}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {categories.map((dm) => {
            const dangSD = dm.trang_thai === 'Dang_su_dung';
            return (
              <tr key={dm.ma_danh_muc} className="hover:bg-slate-50">
                <td className={td}>{dm.ma_danh_muc}</td>
                <td className={td + ' font-medium text-slate-800'}>{dm.ten_danh_muc}</td>
                <td className={td}>{dm.mo_ta || <span className="text-slate-300">—</span>}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (dangSD ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {dangSD ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(dm)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onToggleStatus(dm)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">
                    {dangSD ? 'Ngừng SD' : 'Kích hoạt'}
                  </button>
                  <button onClick={() => onDelete(dm.ma_danh_muc)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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