import { Pencil, Trash2 } from 'lucide-react';

const STATUS_LABEL = {
  Trong:        { text: 'Trống',        cls: 'bg-emerald-50 text-emerald-700' },
  Dang_su_dung: { text: 'Đang sử dụng', cls: 'bg-blue-50 text-blue-700' },
};

function TableTable({ tables, onEdit, onDelete }) {
  const th = 'text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + ' w-[9%]'}>Mã</th>
            <th className={th + ' w-[18%]'}>Tên bàn</th>
            <th className={th + ' w-[16%]'}>Khu vực</th>
            <th className={th + ' w-[9%]'}>Số ghế</th>
            <th className={th + ' w-[18%]'}>Mã QR</th>
            <th className={th + ' w-[16%]'}>Trạng thái</th>
            <th className={th + " w-[14%] text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tables.length === 0 ? (
            <tr>
              <td className={td + ' text-center text-stone-400'} colSpan={7}>
                Không tìm thấy dữ liệu.
              </td>
            </tr>
          ) : (
            tables.map((b) => <TableRow key={b.ma_ban} ban={b} td={td} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

// Tách 1 dòng bàn thành component nhỏ
function TableRow({ ban, td, onEdit, onDelete }) {
  const stt = STATUS_LABEL[ban.trang_thai] || { text: ban.trang_thai, cls: 'bg-stone-100 text-stone-600' };
  return (
    <tr className="hover:bg-stone-50 transition-colors">
      <td className={td}>{ban.ma_ban}</td>
      <td className={td + ' font-medium text-stone-800'}>{ban.ten_ban}</td>
      <td className={td}>{ban.ten_khu_vuc}</td>
      <td className={td}>{ban.so_ghe}</td>
      <td className={td + ' font-mono text-xs text-stone-500'}>{ban.qr_code_dinh_danh}</td>
      <td className={td}>
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + stt.cls}>{stt.text}</span>
      </td>
      <td className={td + ' whitespace-nowrap text-right'}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(ban)}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
            title="Sửa bàn"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(ban)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
            title="Xóa bàn"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TableTable;
