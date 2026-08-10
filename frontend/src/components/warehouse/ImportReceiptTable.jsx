function ImportReceiptTable({ receipts, onViewDetail }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[12%]"}>Mã phiếu</th>
            <th className={th + " w-[18%]"}>Ngày nhập</th>
            <th className={th + " w-[24%]"}>Nhà cung cấp</th>
            <th className={th + " w-[18%]"}>Người lập</th>
            <th className={th + " w-[16%]"}>Tổng tiền</th>
            <th className={th + " w-[12%]"}>Thao tác</th>
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
            <tr key={pn.ma_phieu_nhap} className="hover:bg-stone-50 transition-colors">
              <td className={td}>#{pn.ma_phieu_nhap}</td>
              <td className={td}>{new Date(pn.ngay_nhap).toLocaleString('vi-VN')}</td>
              <td className={td + ' font-medium text-stone-800 truncate'}>{pn.ten_nha_cung_cap}</td>
              <td className={td + ' truncate'}>{pn.ten_nv_lap}</td>
              <td className={td}>{Number(pn.tong_tien).toLocaleString('vi-VN')}đ</td>
              <td className={td}>
                <button onClick={() => onViewDetail(pn.ma_phieu_nhap)} className="text-stone-600 hover:text-stone-900 text-sm transition-colors">
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
