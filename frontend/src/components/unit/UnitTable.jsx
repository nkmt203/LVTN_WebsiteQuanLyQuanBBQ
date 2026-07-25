function UnitTable({ units, onEdit, onDelete }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên đơn vị tính</th>
            <th className={th}>Trạng thái</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 && (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={4}>
                Không tìm thấy dữ liệu.
              </td>
            </tr>
          )}
          {units.map((dvt) => {
            const dangDung = dvt.trang_thai === 'Dang_dung';
            return (
              <tr key={dvt.ma_don_vi_tinh} className="hover:bg-stone-50">
                <td className={td}>{dvt.ma_don_vi_tinh}</td>
                <td className={td + ' font-medium text-stone-800'}>{dvt.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (dangDung ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500')}>
                    {dangDung ? 'Đang dùng' : 'Ngừng sử dụng'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <button onClick={() => onEdit(dvt)} className="text-stone-600 hover:text-stone-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onDelete(dvt)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
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
