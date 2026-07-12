function RecipeTable({ recipes, onEdit, onDelete, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Món ăn</th>
            <th className={th}>Nguyên liệu</th>
            <th className={th}>Số lượng</th>
            <th className={th}>ĐVT</th>
            <th className={th}>Ghi chú</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 && (
            <tr><td className={td + ' text-center text-slate-400'} colSpan={7}>Không tìm thấy dữ liệu.</td></tr>
          )}
          {recipes.map((r) => {
            const active = r.trang_thai === 'Hoat_dong';
            return (
              <tr key={r.ma_dinh_muc} className="hover:bg-slate-50">
                <td className={td + ' font-medium text-slate-800'}>{r.ten_mon_an}</td>
                <td className={td}>{r.ten_nguyen_lieu}</td>
                <td className={td}>{Number(r.so_luong_su_dung)}</td>
                <td className={td}>{r.ten_don_vi_tinh}</td>
                <td className={td}>{r.ghi_chu || <span className="text-slate-300">—</span>}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {active ? 'Hoạt động' : 'Ngừng SD'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(r)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onToggleStatus(r)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">
                    {active ? 'Ngừng SD' : 'Kích hoạt'}
                  </button>
                  <button onClick={() => onDelete(r.ma_dinh_muc)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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