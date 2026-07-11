function UnitTable({ units, onEdit, onDelete }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên đơn vị tính</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={4}>
                Không tìm thấy dữ liệu.
              </td>
            </tr>
          )}
          {units.map((dvt) => {
            const dangDung = dvt.trang_thai === 'Dang_dung';
            return (
              <tr key={dvt.ma_don_vi_tinh} className="hover:bg-slate-50">
                <td className={td}>{dvt.ma_don_vi_tinh}</td>
                <td className={td + ' font-medium text-slate-800'}>{dvt.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (dangDung ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {dangDung ? 'Đang dùng' : 'Ngừng sử dụng'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(dvt)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onDelete(dvt.ma_don_vi_tinh)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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