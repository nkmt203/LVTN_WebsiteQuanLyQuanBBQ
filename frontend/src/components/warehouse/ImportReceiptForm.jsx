import { useState } from 'react';

const emptyRow = () => ({ ma_nguyen_lieu: '', so_luong_nhap: '', don_gia_nhap: '', ghi_chu: '', _key: Date.now() + Math.random() });
const todayStr = () => new Date().toISOString().slice(0, 10);

function ImportReceiptForm({ suppliers, ingredients, onSave, onCancel }) {
  const [maNCC, setMaNCC] = useState('');
  const [ngayNhap, setNgayNhap] = useState(todayStr());
  const [ghiChu, setGhiChu] = useState('');
  const [rows, setRows] = useState([emptyRow()]);

  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  function addRow() { setRows([...rows, emptyRow()]); }
  function removeRow(idx) {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  }
  function updateRow(idx, field, value) {
    setRows(rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function getDVT(maNL) {
    const nl = ingredients.find((i) => String(i.ma_nguyen_lieu) === String(maNL));
    return nl ? nl.ten_don_vi_tinh : '';
  }

  const tongTien = rows.reduce(
    (sum, r) => sum + (Number(r.so_luong_nhap) || 0) * (Number(r.don_gia_nhap) || 0),
    0,
  );

  function handleSave() {
    const items = rows.map((r) => ({
      ma_nguyen_lieu: Number(r.ma_nguyen_lieu),
      so_luong_nhap: Number(r.so_luong_nhap),
      don_gia_nhap: Number(r.don_gia_nhap),
      ghi_chu: r.ghi_chu,
    }));
    onSave({
      ma_nha_cung_cap: Number(maNCC),
      ngay_nhap: ngayNhap,
      ghi_chu: ghiChu,
      items,
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Nhà cung cấp *</label>
          <select className={inp} value={maNCC} onChange={(e) => setMaNCC(e.target.value)}>
            <option value="">-- Chọn nhà cung cấp --</option>
            {suppliers.map((ncc) => (
              <option key={ncc.ma_nha_cung_cap} value={ncc.ma_nha_cung_cap}>{ncc.ten_nha_cung_cap}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Ngày nhập *</label>
          <input type="date" className={inp} value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} />
        </div>
      </div>

      <label className="text-sm font-medium text-slate-600 mb-2 block">Danh sách nguyên liệu nhập</label>
      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div key={row._key} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex-1">
              <select className={inp} value={row.ma_nguyen_lieu}
                      onChange={(e) => updateRow(idx, 'ma_nguyen_lieu', e.target.value)}>
                <option value="">-- Nguyên liệu --</option>
                {ingredients.map((nl) => (
                  <option key={nl.ma_nguyen_lieu} value={nl.ma_nguyen_lieu}>{nl.ten_nguyen_lieu}</option>
                ))}
              </select>
            </div>
            <div className="w-20">
              <input type="number" className={inp} placeholder="SL" value={row.so_luong_nhap}
                     onChange={(e) => updateRow(idx, 'so_luong_nhap', e.target.value)} />
            </div>
            <div className="w-14 flex items-center justify-center text-sm text-slate-500 pt-2">
              {getDVT(row.ma_nguyen_lieu) || '—'}
            </div>
            <div className="w-28">
              <input type="number" className={inp} placeholder="Đơn giá" value={row.don_gia_nhap}
                     onChange={(e) => updateRow(idx, 'don_gia_nhap', e.target.value)} />
            </div>
            <div className="flex-1">
              <input className={inp} placeholder="Ghi chú" value={row.ghi_chu}
                     onChange={(e) => updateRow(idx, 'ghi_chu', e.target.value)} />
            </div>
            <button onClick={() => removeRow(idx)}
                    className="text-red-400 hover:text-red-600 pt-2 text-lg leading-none" title="Xóa dòng">&times;</button>
          </div>
        ))}
      </div>

      <button onClick={addRow}
              className="mt-3 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-lg px-4 py-2 w-full hover:bg-slate-50">
        + Thêm nguyên liệu
      </button>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-600 mb-1 block">Ghi chú phiếu</label>
        <input className={inp} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" />
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="text-sm text-slate-600">
          Tổng tiền: <span className="font-semibold text-slate-800">{tongTien.toLocaleString('vi-VN')}đ</span>
        </span>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
            Lưu phiếu nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportReceiptForm;
