import { useState } from 'react';

const emptyRow = () => ({ ma_nguyen_lieu: '', so_luong_su_dung: '', ghi_chu: '', _key: Date.now() + Math.random() });

function RecipeAddForm({ foods, ingredients, onSave, onCancel }) {
  const [maMonAn, setMaMonAn] = useState('');
  const [rows, setRows] = useState([emptyRow()]);

  const inp = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

  function addRow() { setRows([...rows, emptyRow()]); }

  function removeRow(idx) {
    if (rows.length === 1) return; // giữ ít nhất 1 dòng
    setRows(rows.filter((_, i) => i !== idx));
  }

  function updateRow(idx, field, value) {
    setRows(rows.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  // Tìm đơn vị tính tự động theo nguyên liệu được chọn
  function getDVT(maNL) {
    const nl = ingredients.find((i) => String(i.ma_nguyen_lieu) === String(maNL));
    return nl ? nl.ten_don_vi_tinh : '';
  }

  function handleSave() {
    const items = rows.map((r) => ({
      ma_nguyen_lieu: Number(r.ma_nguyen_lieu),
      so_luong_su_dung: Number(r.so_luong_su_dung),
      ghi_chu: r.ghi_chu,
    }));
    onSave({ ma_mon_an: Number(maMonAn), items });
  }

  return (
    <div>
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-600 mb-1 block">Chọn món ăn *</label>
        <select className={inp} value={maMonAn} onChange={(e) => setMaMonAn(e.target.value)}>
          <option value="">-- Chọn món ăn --</option>
          {foods.map((f) => (
            <option key={f.ma_mon_an} value={f.ma_mon_an}>{f.ten_mon_an}</option>
          ))}
        </select>
      </div>

      <label className="text-sm font-medium text-slate-600 mb-2 block">Danh sách nguyên liệu</label>

      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div key={row._key} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex-1">
              <select className={inp} value={row.ma_nguyen_lieu}
                      onChange={(e) => updateRow(idx, 'ma_nguyen_lieu', e.target.value)}>
                <option value="">-- Nguyên liệu --</option>
                {ingredients.map((nl) => (
                  <option key={nl.ma_nguyen_lieu} value={nl.ma_nguyen_lieu}>
                    {nl.ten_nguyen_lieu}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <input type="number" className={inp} placeholder="SL" value={row.so_luong_su_dung}
                     onChange={(e) => updateRow(idx, 'so_luong_su_dung', e.target.value)} />
            </div>
            <div className="w-16 flex items-center justify-center text-sm text-slate-500 pt-2">
              {getDVT(row.ma_nguyen_lieu) || '—'}
            </div>
            <div className="flex-1">
              <input className={inp} placeholder="Ghi chú" value={row.ghi_chu}
                     onChange={(e) => updateRow(idx, 'ghi_chu', e.target.value)} />
            </div>
            <button onClick={() => removeRow(idx)}
                    className="text-red-400 hover:text-red-600 pt-2 text-lg leading-none"
                    title="Xóa dòng">&times;</button>
          </div>
        ))}
      </div>

      <button onClick={addRow}
              className="mt-3 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-lg px-4 py-2 w-full hover:bg-slate-50">
        + Thêm nguyên liệu
      </button>

      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          Lưu định mức
        </button>
      </div>
    </div>
  );
}

export default RecipeAddForm;