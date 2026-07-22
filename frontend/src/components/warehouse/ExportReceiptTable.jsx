const LY_DO_LABEL = {
  Hu_hong: 'Hư hỏng',
  Dieu_chinh: 'Điều chỉnh',
  Khac: 'Khác',
};

function ExportReceiptTable({ receipts, onViewDetail }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã phiếu</th>
            <th className={th}>Ngày xuất</th>
            <th className={th}>Lý do</th>
            <th className={th}>Người lập</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={6}>
                Chưa có phiếu xuất kho nào.
              </td>
            </tr>
          )}
          {receipts.map((px) => (
            <tr key={px.ma_phieu_xuat} className="hover:bg-slate-50">
              <td className={td}>#{px.ma_phieu_xuat}</td>
              <td className={td}>{new Date(px.ngay_xuat).toLocaleString('vi-VN')}</td>
              <td className={td + ' font-medium text-slate-800'}>{LY_DO_LABEL[px.ly_do_xuat] || px.ly_do_xuat}</td>
              <td className={td}>{px.ten_nv_lap}</td>
              <td className={td}>
                <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                  (px.trang_thai === 'Da_hoan_thanh' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                  {px.trang_thai === 'Da_hoan_thanh' ? 'Đã hoàn thành' : 'Đã hủy'}
                </span>
              </td>
              <td className={td}>
                <button onClick={() => onViewDetail(px.ma_phieu_xuat)} className="text-slate-600 hover:text-slate-900 text-sm">
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExportReceiptTable;
