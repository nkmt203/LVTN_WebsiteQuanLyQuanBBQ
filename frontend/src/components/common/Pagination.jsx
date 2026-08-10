function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-stone-500">
        Tổng số <span className="font-semibold text-stone-700">{total}</span>{" "}
        · Trang{" "}
        <span className="font-semibold text-stone-700">{page}</span>/
        {totalPages}
      </span>
      <div className="flex gap-2">
        {/* Nút Trước  */}
        <button
          className="px-3 py-1.5 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Trước
        </button>

        {/* Thêm phần số trang */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              pageNum === page
                ? "bg-blue-600 text-white border-blue-600 font-semibold" // Trang đang chọn
                : "border-stone-300 text-stone-600 hover:bg-stone-50"
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        {/* Nút Sau */}
        <button
          className="px-3 py-1.5 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
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
