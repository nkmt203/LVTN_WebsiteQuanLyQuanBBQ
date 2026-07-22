function SupplierTable({ suppliers, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên nhà cung cấp</th>
            <th className={th}>Số điện thoại</th>
            <th className={th}>Địa chỉ</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={6}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {suppliers.map((ncc) => {
            const active = ncc.trang_thai === 'Hoat_dong';
            return (
              <tr key={ncc.ma_nha_cung_cap} className="hover:bg-slate-50">
                <td className={td}>{ncc.ma_nha_cung_cap}</td>
                <td className={td + ' font-medium text-slate-800'}>{ncc.ten_nha_cung_cap}</td>
                <td className={td}>{ncc.so_dien_thoai}</td>
                <td className={td}>{ncc.dia_chi || <span className="text-slate-300">—</span>}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                    (active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                    {active ? 'Hoạt động' : 'Ngừng hợp tác'}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEdit(ncc)} className="text-slate-600 hover:text-slate-900 mr-3 text-sm">Sửa</button>
                  <button onClick={() => onToggleStatus(ncc)} className="text-slate-600 hover:text-slate-900 text-sm">
                    {active ? 'Ngừng hợp tác' : 'Kích hoạt'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;
