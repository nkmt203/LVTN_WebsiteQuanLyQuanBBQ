import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function ScrollToTopButton({ threshold = 300 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > threshold);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Lên đầu trang"
      className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
    >
      <ArrowUp size={20} />
    </button>
  );
}

export default ScrollToTopButton;
