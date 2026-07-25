import ToggleSwitch from "../common/ToggleSwitch";

function SupplierTable({ suppliers, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên nhà cung cấp</th>
            <th className={th}>Số điện thoại</th>
            <th className={th}>Địa chỉ</th>
            <th className={th}>Hoạt động</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 && (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={6}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {suppliers.map((ncc) => {
            const active = ncc.trang_thai === 'Hoat_dong';
            return (
              <tr key={ncc.ma_nha_cung_cap} className="hover:bg-stone-50">
                <td className={td}>{ncc.ma_nha_cung_cap}</td>
                <td className={td + ' font-medium text-stone-800'}>{ncc.ten_nha_cung_cap}</td>
                <td className={td}>{ncc.so_dien_thoai}</td>
                <td className={td}>{ncc.dia_chi || <span className="text-stone-300">—</span>}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={active}
                      onChange={() => onToggleStatus(ncc)}
                      title={
                        active
                          ? "Hoạt động — bấm để ngừng hợp tác"
                          : "Ngừng hợp tác — bấm để kích hoạt lại"
                      }
                      onLabel="Hoạt động"
                      offLabel="Ngừng hợp tác"
                    />
                    <span
                      className={
                        "text-xs font-medium " +
                        (active ? "text-blue-700" : "text-stone-400")
                      }
                    >
                      {active ? "Hoạt động" : "Ngừng hợp tác"}
                    </span>
                  </div>
                </td>
                <td className={td + ' whitespace-nowrap text-right'}>
                  <button onClick={() => onEdit(ncc)} className="text-stone-600 hover:text-stone-900 text-sm">Sửa</button>
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
