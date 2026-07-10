import { useState, useEffect } from "react";

function FoodForm({
  editingId,
  tenMon,
  setTenMon,
  maDanhMuc,
  setMaDanhMuc,
  giaBan,
  setGiaBan,
  moTa,
  setMoTa,
  imageFile,
  setImageFile,
  categories,
  onSave,
  onCancel,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const lbl = "text-sm font-medium text-slate-600 mb-1";
  const inp =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-full";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={lbl}>Tên món *</label>
          <input
            className={inp}
            value={tenMon}
            onChange={(e) => setTenMon(e.target.value)}
            placeholder="VD: Ba chỉ bò Mỹ"
          />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Danh mục *</label>
          <select
            className={inp}
            value={maDanhMuc}
            onChange={(e) => setMaDanhMuc(e.target.value)}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((dm) => (
              <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                {dm.ten_danh_muc}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Giá bán (đ) *</label>
          <input
            type="number"
            className={inp}
            value={giaBan}
            onChange={(e) => setGiaBan(e.target.value)}
            placeholder="VD: 159000"
          />
        </div>
        <div className="flex flex-col">
          <label className={lbl}>Mô tả</label>
          <input
            className={inp}
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Tuỳ chọn"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className={lbl}>Hình ảnh</label>
          <input
            id="food-image-input"
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="mt-2 w-28 h-20 object-cover rounded-lg border"
            />
          )}
          {editingId !== null && (
            <span className="text-xs text-slate-400 mt-1">
              Không chọn ảnh mới = giữ ảnh cũ.
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
        >
          Huỷ
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900"
        >
          {editingId === null ? "Thêm món" : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}

export default FoodForm;
