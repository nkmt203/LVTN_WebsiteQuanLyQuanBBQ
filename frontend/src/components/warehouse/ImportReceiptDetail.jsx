function ImportReceiptDetail({ detail }) {
  if (!detail) return null;
  const { phieuNhap, items } = detail;
  const td = 'px-3 py-2 text-sm text-slate-700 border-t border-slate-100';
  const th = 'text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2';

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-4">
        <p>Nhà cung cấp: <span className="font-medium text-slate-800">{phieuNhap.ten_nha_cung_cap}</span></p>
        <p>Người lập: <span className="font-medium text-slate-800">{phieuNhap.ten_nv_lap}</span></p>
        <p>Ngày nhập: <span className="font-medium text-slate-800">{new Date(phieuNhap.ngay_nhap).toLocaleString('vi-VN')}</span></p>
        <p>Tổng tiền: <span className="font-medium text-slate-800">{Number(phieuNhap.tong_tien).toLocaleString('vi-VN')}đ</span></p>
      </div>
      {phieuNhap.ghi_chu && <p className="text-sm text-slate-500 italic mb-3">Ghi chú: {phieuNhap.ghi_chu}</p>}

      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Nguyên liệu</th>
              <th className={th}>SL</th>
              <th className={th}>ĐVT</th>
              <th className={th}>Đơn giá</th>
              <th className={th}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.ma_chi_tiet_nhap}>
                <td className={td}>{it.ten_nguyen_lieu}</td>
                <td className={td}>{Number(it.so_luong_nhap)}</td>
                <td className={td}>{it.ten_don_vi_tinh}</td>
                <td className={td}>{Number(it.don_gia_nhap).toLocaleString('vi-VN')}đ</td>
                <td className={td}>{Number(it.thanh_tien).toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImportReceiptDetail;
