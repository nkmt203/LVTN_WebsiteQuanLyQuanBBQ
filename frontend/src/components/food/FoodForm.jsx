import { useEffect, useMemo } from "react";
import { SERVER_URL } from "../../api/apiConfig";

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
  existingImageUrl,
  categories,
  onSave,
  onCancel,
}) {
  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayImage =
    previewUrl || (existingImageUrl && `${SERVER_URL}/uploads/${existingImageUrl}`);

  const lbl = "text-sm font-medium text-stone-600 mb-1 block";
  const inp =
    "border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full";

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[9rem_1fr]">
        {/* Ảnh món ăn */}
        <div>
          <label className={lbl}>Hình ảnh</label>
          <label
            htmlFor="food-image-input"
            className="group relative flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-stone-400 transition hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-500"
          >
            {displayImage ? (
              <>
                <img
                  src={displayImage}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-medium text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  Đổi ảnh
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl">🍽</span>
                <span className="px-2 text-center text-xs font-medium leading-snug">
                  Chọn ảnh món
                </span>
              </>
            )}
            <input
              id="food-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
          </label>
          {editingId !== null && (
            <p className="mt-1.5 text-xs text-stone-400">
              Không chọn ảnh mới = giữ ảnh cũ.
            </p>
          )}
        </div>

        {/* Thông tin món ăn */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={lbl}>Tên món *</label>
            <input
              className={inp}
              value={tenMon}
              onChange={(e) => setTenMon(e.target.value)}
              placeholder="VD: Ba chỉ bò Mỹ"
            />
          </div>

          <div>
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

          <div>
            <label className={lbl}>Giá bán *</label>
            <div className="relative">
              <input
                type="number"
                className={inp + " pr-8"}
                value={giaBan}
                onChange={(e) => setGiaBan(e.target.value)}
                placeholder="159000"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                đ
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Mô tả</label>
            <textarea
              rows={3}
              className={inp + " resize-none"}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Thành phần, hương vị món ăn (tuỳ chọn)"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 justify-end border-t border-stone-100 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50"
        >
          Huỷ
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          {editingId === null ? "Thêm món" : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}

export default FoodForm;
