function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null;

  // Chỉ hiện trang đầu, trang cuối, và vài trang quanh trang hiện tại —
  // tránh render cả trăm nút số khi danh sách có nhiều trang (vd. lịch sử hóa đơn)
  const getPageItems = () => {
    const delta = 1;
    const items = [];
    let last = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        if (last && i - last > 1) items.push("...");
        items.push(i);
        last = i;
      }
    }
    return items;
  };

  const pageItems = getPageItems();

  return (
    <div className="flex items-center justify-between mt-3">
      <span className="text-xs text-stone-500">
        Tổng số <span className="font-semibold text-stone-700">{total}</span>{" "}
        · Trang{" "}
        <span className="font-semibold text-stone-700">{page}</span>/
        {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 rounded-lg border border-stone-300 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Trước
        </button>

        {pageItems.map((item, idx) =>
          item === "..." ? (
            <span key={`dots-${idx}`} className="px-1 text-xs text-stone-400">
              …
            </span>
          ) : (
            <button
              key={item}
              className={`min-w-[1.75rem] px-2 py-1 rounded-lg border text-xs transition-colors ${
                item === page
                  ? "bg-blue-600 text-white border-blue-600 font-semibold" // Trang đang chọn
                  : "border-stone-300 text-stone-600 hover:bg-stone-50"
              }`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          className="px-2 py-1 rounded-lg border border-stone-300 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

export default Pagination;
