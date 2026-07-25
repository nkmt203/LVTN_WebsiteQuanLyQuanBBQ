const STATUS_LABEL = {
  Trong:        { text: 'Trống',        cls: 'bg-emerald-50 text-emerald-700' },
  Dang_su_dung: { text: 'Đang sử dụng', cls: 'bg-blue-50 text-blue-700' },
};

function TableTable({ tables, onEdit, onDelete }) {
  const th = 'text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3';
  const td = 'px-4 py-3 text-sm text-stone-700 border-t border-stone-100';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Mã</th>
            <th className={th}>Tên bàn</th>
            <th className={th}>Khu vực</th>
            <th className={th}>Số ghế</th>
            <th className={th}>Mã QR</th>
            <th className={th}>Trạng thái</th>
            <th className={th + " text-right"}>Thao tác</th>
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
    <tr className="hover:bg-stone-50">
      <td className={td}>{ban.ma_ban}</td>
      <td className={td + ' font-medium text-stone-800'}>{ban.ten_ban}</td>
      <td className={td}>{ban.ten_khu_vuc}</td>
      <td className={td}>{ban.so_ghe}</td>
      <td className={td + ' font-mono text-xs text-stone-500'}>{ban.qr_code_dinh_danh}</td>
      <td className={td}>
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + stt.cls}>{stt.text}</span>
      </td>
      <td className={td + ' whitespace-nowrap text-right'}>
        <button onClick={() => onEdit(ban)} className="text-stone-600 hover:text-stone-900 mr-3 text-sm">
          Sửa
        </button>
        <button onClick={() => onDelete(ban)} className="text-red-500 hover:text-red-700 text-sm">
          Xóa
        </button>
      </td>
    </tr>
  );
}

export default TableTable;
