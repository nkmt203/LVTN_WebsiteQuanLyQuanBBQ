import { useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl', maxHeight = 'max-h-[90vh]' }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-white rounded-2xl shadow-lg w-full ${maxWidth} mx-4 ${maxHeight} flex flex-col animate-scale-in`}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-stone-200 px-5 py-3">
          <h3 className="text-base font-semibold text-stone-800">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-5 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
