function ImportReceiptTable({ receipts, onViewDetail }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
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
              <td className={td + ' text-center text-stone-400'} colSpan={6}>
                Chưa có phiếu nhập kho nào.
              </td>
            </tr>
          )}
          {receipts.map((pn) => (
            <tr key={pn.ma_phieu_nhap} className="hover:bg-stone-50">
              <td className={td}>#{pn.ma_phieu_nhap}</td>
              <td className={td}>{new Date(pn.ngay_nhap).toLocaleString('vi-VN')}</td>
              <td className={td + ' font-medium text-stone-800'}>{pn.ten_nha_cung_cap}</td>
              <td className={td}>{pn.ten_nv_lap}</td>
              <td className={td}>{Number(pn.tong_tien).toLocaleString('vi-VN')}đ</td>
              <td className={td}>
                <button onClick={() => onViewDetail(pn.ma_phieu_nhap)} className="text-stone-600 hover:text-stone-900 text-sm">
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
