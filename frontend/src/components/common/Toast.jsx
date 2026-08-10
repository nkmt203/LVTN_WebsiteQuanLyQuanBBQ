import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, TriangleAlert, X } from "lucide-react";

function Toast({ message, type, onClose, duration = 8000 }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const hideTimerRef = useRef(null);
  const removeTimerRef = useRef(null);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    setLeaving(false);
    hideTimerRef.current = setTimeout(() => setLeaving(true), duration);
    removeTimerRef.current = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration + 200);
    return () => {
      clearTimeout(hideTimerRef.current);
      clearTimeout(removeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  function dismissNow() {
    clearTimeout(hideTimerRef.current);
    clearTimeout(removeTimerRef.current);
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 200);
  }

  if (!visible || !message) return null;

  const isError = type ? type === "error" : message.startsWith("❌");
  const isWarning = type ? type === "warning" : message.startsWith("⚠️");
  const text = type ? message : message.replace(/^✅ |^❌ |^⚠️ /, "");

  return (
    <div
      className={
        "fixed top-32 right-5 z-50 flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl shadow-lg border text-base font-semibold max-w-md transition-all duration-200 " +
        (leaving ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0 animate-toast-in") +
        " " +
        (isError
          ? "bg-red-100 border-red-300 text-red-800"
          : isWarning
            ? "bg-amber-100 border-amber-300 text-amber-800"
            : "bg-emerald-100 border-emerald-300 text-emerald-800")
      }
    >
      {isError ? (
        <XCircle size={22} className="shrink-0" />
      ) : isWarning ? (
        <TriangleAlert size={22} className="shrink-0" />
      ) : (
        <CheckCircle2 size={22} className="shrink-0" />
      )}
      <span className="flex-1 whitespace-pre-line">{text}</span>
      <button
        onClick={dismissNow}
        aria-label="Đóng thông báo"
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-all"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default Toast;
