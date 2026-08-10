const TON_STYLE = {
  Con_hang: { cls: 'bg-emerald-50 text-emerald-700', label: 'Còn hàng' },
  Sap_het: { cls: 'bg-amber-50 text-amber-700', label: 'Sắp hết' },
  Het_hang: { cls: 'bg-red-50 text-red-700', label: 'Hết hàng' },
};

function InventoryTable({ items, onEditMinStock }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[8%]"}>Mã</th>
            <th className={th + " w-[26%]"}>Nguyên liệu</th>
            <th className={th + " w-[14%]"}>Tồn kho</th>
            <th className={th + " w-[16%]"}>Mức tối thiểu</th>
            <th className={th + " w-[10%]"}>ĐVT</th>
            <th className={th + " w-[14%]"}>Trạng thái</th>
            <th className={th + " w-[12%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={7}>
                Không tìm thấy dữ liệu tồn kho phù hợp.
              </td>
            </tr>
          )}
          {items.map((nl) => {
            const style = TON_STYLE[nl.trang_thai_ton] || TON_STYLE.Het_hang;
            return (
              <tr key={nl.ma_nguyen_lieu} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{nl.ma_nguyen_lieu}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{nl.ten_nguyen_lieu}</td>
                <td className={td}>{Number(nl.so_luong_ton)}</td>
                <td className={td}>{Number(nl.muc_ton_toi_thieu)}</td>
                <td className={td}>{nl.ten_don_vi_tinh}</td>
                <td className={td}>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' + style.cls}>
                    {style.label}
                  </span>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <button onClick={() => onEditMinStock(nl)} className="text-stone-600 hover:text-stone-900 text-sm transition-colors">
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
