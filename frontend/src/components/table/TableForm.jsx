const LBL = 'text-sm font-medium text-slate-600 mb-1';
const INP = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full';

function TableForm({
  editingId, tenBan, setTenBan, maKhuVuc, setMaKhuVuc, soGhe, setSoGhe,
  ghiChu, setGhiChu, trangThai, setTrangThai, currentStatus, zones, onSave, onCancel,
}) {
  // Chỉ cho đổi trạng thái nếu bàn đang ở Trong hoặc Da_dat_truoc
  const canEditStatus = editingId !== null && ['Trong', 'Da_dat_truoc'].includes(currentStatus);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tên bàn *">
          <input className={INP} value={tenBan} onChange={(e) => setTenBan(e.target.value)} placeholder="VD: Bàn 01" />
        </Field>

        <Field label="Khu vực *">
          <select className={INP} value={maKhuVuc} onChange={(e) => setMaKhuVuc(e.target.value)}>
            <option value="">-- Chọn khu vực --</option>
            {zones.map((kv) => (
              <option key={kv.ma_khu_vuc} value={kv.ma_khu_vuc}>{kv.ten_khu_vuc}</option>
            ))}
          </select>
        </Field>

        <Field label="Số ghế *">
          <input type="number" min="1" className={INP} value={soGhe} onChange={(e) => setSoGhe(e.target.value)} />
        </Field>

        <Field label="Ghi chú">
          <input className={INP} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Tuỳ chọn" />
        </Field>

        {/* Ô trạng thái chỉ hiện khi Sửa (không hiện khi Thêm) */}
        {editingId !== null && (
          <div className="flex flex-col md:col-span-2">
            <label className={LBL}>Trạng thái</label>
            <select className={INP} value={trangThai} onChange={(e) => setTrangThai(e.target.value)} disabled={!canEditStatus}>
              <option value="Trong">Trống</option>
              <option value="Da_dat_truoc">Đã đặt trước</option>
              {currentStatus === 'Dang_su_dung' && (
                <option value="Dang_su_dung">Đang sử dụng</option>
              )}
            </select>
            {!canEditStatus && (
              <span className="text-xs text-slate-400 mt-1">
                Bàn đang phục vụ, không thể đổi trạng thái tại đây.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
          Huỷ
        </button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900">
          {editingId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}

// Helper component: 1 field có label + input
function Field({ label, children }) {
  return (
    <div className="flex flex-col">
      <label className={LBL}>{label}</label>
      {children}
    </div>
  );
}

export default TableForm;