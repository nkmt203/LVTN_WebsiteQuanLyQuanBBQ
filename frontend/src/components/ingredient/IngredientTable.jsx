function IngredientTable({ ingredients, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên nguyên liệu</th>
            <th className={th}>Đơn vị tính</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr><td className={td + ' text-center text-slate-400'} colSpan={5}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {ingredients.map((nl) => {
            const active = nl.trang_thai === 'Hoat_dong';
            return (
              <tr key={nl.ma_nguyen_lieu} className="hover:bg-slate-50">
                <td className={td}>{nl.ma_nguyen_lieu}</td>
                <td className={td + ' font-medium text-slate-800'}>{nl.ten_nguyen_lieu}</td>
                <td className={td}>{nl.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {active ? 'Hoạt động' : 'Ngừng sử dụng'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(nl)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onToggleStatus(nl)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">
                    {active ? 'Ngừng SD' : 'Kích hoạt'}
                  </button>
                  <button onClick={() => onDelete(nl.ma_nguyen_lieu)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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