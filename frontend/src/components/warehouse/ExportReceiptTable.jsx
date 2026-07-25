const LY_DO_LABEL = {
  Hu_hong: 'Hư hỏng',
  Dieu_chinh: 'Điều chỉnh',
  Khac: 'Khác',
};

function ExportReceiptTable({ receipts, onViewDetail }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
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
              <td className={td + ' text-center text-stone-400'} colSpan={6}>
                Chưa có phiếu xuất kho nào.
              </td>
            </tr>
          )}
          {receipts.map((px) => (
            <tr key={px.ma_phieu_xuat} className="hover:bg-stone-50">
              <td className={td}>#{px.ma_phieu_xuat}</td>
              <td className={td}>{new Date(px.ngay_xuat).toLocaleString('vi-VN')}</td>
              <td className={td + ' font-medium text-stone-800'}>{LY_DO_LABEL[px.ly_do_xuat] || px.ly_do_xuat}</td>
              <td className={td}>{px.ten_nv_lap}</td>
              <td className={td}>
                <span className={'px-2 py-1 rounded-full text-xs font-medium ' +
                  (px.trang_thai === 'Da_hoan_thanh' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500')}>
                  {px.trang_thai === 'Da_hoan_thanh' ? 'Đã hoàn thành' : 'Đã hủy'}
                </span>
              </td>
              <td className={td}>
                <button onClick={() => onViewDetail(px.ma_phieu_xuat)} className="text-stone-600 hover:text-stone-900 text-sm">
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
