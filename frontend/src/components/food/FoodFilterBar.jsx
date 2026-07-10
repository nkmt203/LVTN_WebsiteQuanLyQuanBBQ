function FoodFilterBar({
  keyword,
  setKeyword,
  danhMuc,
  setDanhMuc,
  trangThai,
  setTrangThai,
  categories,
  onSearch,
  onReset,
}) {
  const inp =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input
        className={inp + " flex-1 min-w-[180px]"}
        placeholder="Tìm theo tên hoặc mã món"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <select
        className={inp}
        value={danhMuc}
        onChange={(e) => setDanhMuc(e.target.value)}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((dm) => (
          <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
            {dm.ten_danh_muc}
          </option>
        ))}
      </select>

      <select
        className={inp}
        value={trangThai}
        onChange={(e) => setTrangThai(e.target.value)}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="Dang_kinh_doanh">Đang kinh doanh</option>
        <option value="Tam_ngung">Tạm ngừng</option>
      </select>

      <button
        onClick={onSearch}
        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
      >
        Tìm
      </button>
      <button
        onClick={onReset}
        className="text-slate-500 text-sm hover:text-slate-700 px-2"
      >
        Xóa lọc
      </button>
    </div>
  );
}

export default FoodFilterBar;
