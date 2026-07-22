function ImportReceiptTable({ receipts, onViewDetail }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã phiếu</th>
            <th className={th}>Ngày nhập</th>
            <th className={th}>Nhà cung cấp</th>
            <th className={th}>Người lập</th>
            <th className={th}>Tổng tiền</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={6}>
                Chưa có phiếu nhập kho nào.
              </td>
            </tr>
          )}
          {receipts.map((pn) => (
            <tr key={pn.ma_phieu_nhap} className="hover:bg-slate-50">
              <td className={td}>#{pn.ma_phieu_nhap}</td>
              <td className={td}>{new Date(pn.ngay_nhap).toLocaleString('vi-VN')}</td>
              <td className={td + ' font-medium text-slate-800'}>{pn.ten_nha_cung_cap}</td>
              <td className={td}>{pn.ten_nv_lap}</td>
              <td className={td}>{Number(pn.tong_tien).toLocaleString('vi-VN')}đ</td>
              <td className={td}>
                <button onClick={() => onViewDetail(pn.ma_phieu_nhap)} className="text-slate-600 hover:text-slate-900 text-sm">
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

export default ImportReceiptTable;
