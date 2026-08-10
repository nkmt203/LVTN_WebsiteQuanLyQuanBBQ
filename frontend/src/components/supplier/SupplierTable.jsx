import { Pencil } from "lucide-react";
import ToggleSwitch from "../common/ToggleSwitch";

function SupplierTable({ suppliers, onEdit, onToggleStatus }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[8%]"}>Mã</th>
            <th className={th + " w-[24%]"}>Tên nhà cung cấp</th>
            <th className={th + " w-[14%]"}>Số điện thoại</th>
            <th className={th + " w-[22%]"}>Địa chỉ</th>
            <th className={th + " w-[22%]"}>Hoạt động</th>
            <th className={th + " w-[10%] text-right"}>Thao tác</th>
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
              <tr key={ncc.ma_nha_cung_cap} className="hover:bg-stone-50 transition-colors">
                <td className={td}>{ncc.ma_nha_cung_cap}</td>
                <td className={td + ' font-medium text-stone-800 truncate'}>{ncc.ten_nha_cung_cap}</td>
                <td className={td}>{ncc.so_dien_thoai}</td>
                <td className={td + ' truncate'}>{ncc.dia_chi || <span className="text-stone-300">—</span>}</td>
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
                  <button
                    onClick={() => onEdit(ncc)}
                    title="Sửa nhà cung cấp"
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                  >
                    <Pencil size={15} />
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
