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
      <span className="text-sm text-slate-500">
        Tổng số {total} · Trang {page}/{totalPages}
      </span>
      <div className="flex gap-2">
        {/* Nút Trước  */}
        <button
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Trước
        </button>

        {/* Thêm phần số trang */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              pageNum === page
                ? "bg-blue-500 text-white border-blue-500" // Trang đang chọn
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        {/* Nút Sau */}
        <button
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
