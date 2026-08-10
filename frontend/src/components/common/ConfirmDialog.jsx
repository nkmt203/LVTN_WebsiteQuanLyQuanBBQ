import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/errorHandler";

function ConfirmDialog({
  open,
  title = "Xác nhận",
  description,
  confirmText = "Xác nhận",
  cancelText = "Huỷ",
  danger = false,
  onConfirm,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset lỗi/loading mỗi khi popup được mở lại cho một thao tác mới
  // (tránh dùng effect chỉ để đồng bộ state nội bộ theo prop `open`)
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setError("");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape" && !loading) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={() => !loading && onClose()}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm mx-4 p-5 animate-scale-in">
        <div className="flex items-start gap-3">
          <div
            className={
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg " +
              (danger
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600")
            }
          >
            {danger ? "⚠" : "?"}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-base font-semibold text-stone-800">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-5 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={
              "px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 " +
              (danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700")
            }
          >
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
