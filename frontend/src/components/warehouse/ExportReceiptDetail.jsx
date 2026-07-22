const LY_DO_LABEL = {
  Hu_hong: 'Hư hỏng',
  Dieu_chinh: 'Điều chỉnh',
  Khac: 'Khác',
};

function ExportReceiptDetail({ detail }) {
  if (!detail) return null;
  const { phieuXuat, items } = detail;
  const td = 'px-3 py-2 text-sm text-slate-700 border-t border-slate-100';
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2';

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-4">
        <p>Lý do: <span className="font-medium text-slate-800">{LY_DO_LABEL[phieuXuat.ly_do_xuat] || phieuXuat.ly_do_xuat}</span></p>
        <p>Người lập: <span className="font-medium text-slate-800">{phieuXuat.ten_nv_lap}</span></p>
        <p>Ngày xuất: <span className="font-medium text-slate-800">{new Date(phieuXuat.ngay_xuat).toLocaleString('vi-VN')}</span></p>
        <p>Trạng thái: <span className="font-medium text-slate-800">{phieuXuat.trang_thai === 'Da_hoan_thanh' ? 'Đã hoàn thành' : 'Đã hủy'}</span></p>
      </div>
      {phieuXuat.ghi_chu && <p className="text-sm text-slate-500 italic mb-3">Ghi chú: {phieuXuat.ghi_chu}</p>}

      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Nguyên liệu</th>
              <th className={th}>SL xuất</th>
              <th className={th}>ĐVT</th>
              <th className={th}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.ma_chi_tiet_xuat}>
                <td className={td}>{it.ten_nguyen_lieu}</td>
                <td className={td}>{Number(it.so_luong_xuat)}</td>
                <td className={td}>{it.ten_don_vi_tinh}</td>
                <td className={td}>{it.ghi_chu || <span className="text-slate-300">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExportReceiptDetail;
