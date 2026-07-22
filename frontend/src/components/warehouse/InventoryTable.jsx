const TON_STYLE = {
  Con_hang: { cls: 'bg-emerald-50 text-emerald-700', label: 'Còn hàng' },
  Sap_het: { cls: 'bg-amber-50 text-amber-700', label: 'Sắp hết' },
  Het_hang: { cls: 'bg-red-50 text-red-700', label: 'Hết hàng' },
};

function InventoryTable({ items, onEditMinStock }) {
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-slate-700 border-t border-slate-100';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Nguyên liệu</th>
            <th className={th}>Tồn kho</th>
            <th className={th}>Mức tối thiểu</th>
            <th className={th}>ĐVT</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td className={td + ' text-center text-slate-400'} colSpan={7}>
                Không tìm thấy dữ liệu tồn kho phù hợp.
              </td>
            </tr>
          )}
          {items.map((nl) => {
            const style = TON_STYLE[nl.trang_thai_ton] || TON_STYLE.Het_hang;
            return (
              <tr key={nl.ma_nguyen_lieu} className="hover:bg-slate-50">
                <td className={td}>{nl.ma_nguyen_lieu}</td>
                <td className={td + ' font-medium text-slate-800'}>{nl.ten_nguyen_lieu}</td>
                <td className={td}>{Number(nl.so_luong_ton)}</td>
                <td className={td}>{Number(nl.muc_ton_toi_thieu)}</td>
                <td className={td}>{nl.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' + style.cls}>
                    {style.label}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap'}>
                  <button onClick={() => onEditMinStock(nl)} className="text-slate-600 hover:text-slate-900 text-sm">
                    Đặt mức tối thiểu
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

export default InventoryTable;
