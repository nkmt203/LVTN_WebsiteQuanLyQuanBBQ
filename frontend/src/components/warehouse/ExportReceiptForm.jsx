import { useState } from 'react';

const emptyRow = () => ({ ma_nguyen_lieu: '', so_luong_xuat: '', ghi_chu: '', _key: Date.now() + Math.random() });
const todayStr = () => new Date().toISOString().slice(0, 10);

function ExportReceiptForm({ ingredients, onSave, onCancel }) {
  const [ngayXuat, setNgayXuat] = useState(todayStr());
  const [lyDoXuat, setLyDoXuat] = useState('Hu_hong');
  const [ghiChu, setGhiChu] = useState('');
  const [rows, setRows] = useState([emptyRow()]);

  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full';

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
  function getTon(maNL) {
    const nl = ingredients.find((i) => String(i.ma_nguyen_lieu) === String(maNL));
    return nl ? Number(nl.so_luong_ton) : null;
  }

  function handleSave() {
    const items = rows.map((r) => ({
      ma_nguyen_lieu: Number(r.ma_nguyen_lieu),
      so_luong_xuat: Number(r.so_luong_xuat),
      ghi_chu: r.ghi_chu,
    }));
    onSave({
      ngay_xuat: ngayXuat,
      ly_do_xuat: lyDoXuat,
      ghi_chu: ghiChu,
      items,
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium text-stone-600 mb-1 block">Lý do xuất *</label>
          <select className={inp} value={lyDoXuat} onChange={(e) => setLyDoXuat(e.target.value)}>
            <option value="Hu_hong">Hư hỏng</option>
            <option value="Dieu_chinh">Điều chỉnh</option>
            <option value="Khac">Khác</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-stone-600 mb-1 block">Ngày xuất *</label>
          <input type="date" className={inp} value={ngayXuat} onChange={(e) => setNgayXuat(e.target.value)} />
        </div>
      </div>

      <label className="text-sm font-medium text-stone-600 mb-2 block">Danh sách nguyên liệu xuất</label>
      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => {
          const ton = getTon(row.ma_nguyen_lieu);
          return (
            <div key={row._key} className="flex gap-2 items-start p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex-1">
                <select className={inp} value={row.ma_nguyen_lieu}
                        onChange={(e) => updateRow(idx, 'ma_nguyen_lieu', e.target.value)}>
                  <option value="">-- Nguyên liệu --</option>
                  {ingredients.map((nl) => (
                    <option key={nl.ma_nguyen_lieu} value={nl.ma_nguyen_lieu}>
                      {nl.ten_nguyen_lieu} (tồn: {Number(nl.so_luong_ton)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <input type="number" className={inp} placeholder="SL xuất" value={row.so_luong_xuat}
                       onChange={(e) => updateRow(idx, 'so_luong_xuat', e.target.value)} />
                {ton !== null && Number(row.so_luong_xuat) > ton && (
                  <p className="text-xs text-red-500 mt-1">Vượt tồn kho ({ton})</p>
                )}
              </div>
              <div className="w-14 flex items-center justify-center text-sm text-stone-500 pt-2">
                {getDVT(row.ma_nguyen_lieu) || '—'}
              </div>
              <div className="flex-1">
                <input className={inp} placeholder="Ghi chú" value={row.ghi_chu}
                       onChange={(e) => updateRow(idx, 'ghi_chu', e.target.value)} />
              </div>
              <button onClick={() => removeRow(idx)}
                      className="text-red-400 hover:text-red-600 pt-2 text-lg leading-none" title="Xóa dòng">&times;</button>
            </div>
          );
        })}
      </div>

      <button onClick={addRow}
              className="mt-3 text-sm text-stone-600 hover:text-stone-900 border border-dashed border-stone-300 rounded-lg px-4 py-2 w-full hover:bg-stone-50">
        + Thêm nguyên liệu
      </button>

      <div className="mt-4">
        <label className="text-sm font-medium text-stone-600 mb-1 block">Ghi chú phiếu</label>
        <textarea rows={2} className={inp + ' resize-none'} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" />
      </div>

      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50">Huỷ</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          Lưu phiếu xuất
        </button>
      </div>
    </div>
  );
}

export default ExportReceiptForm;
