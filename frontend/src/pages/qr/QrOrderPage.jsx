import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io as ioClient } from "socket.io-client";
import { Sparkles, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import {
  getQrSession,
  getQrBill,
  submitQrOrder,
  cancelQrOrder,
  getAiSuggestion,
} from "../../api/qrApi";
import { getErrorMessage } from "../../api/errorHandler";
import { SERVER_URL } from "../../api/apiConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

const POLL_INTERVAL_MS = 5000;
const AI_MAX_LENGTH = 500;

const ITEM_STATUS = {
  Cho_xac_nhan: {
    cls: "bg-amber-50 text-amber-700",
    text: "Chờ nhân viên xác nhận",
  },
  Dang_che_bien: { cls: "bg-blue-50 text-blue-700", text: "Đang chế biến" },
  Da_hoan_thanh: { cls: "bg-emerald-50 text-emerald-700", text: "Hoàn thành" },
  Da_huy: { cls: "bg-stone-100 text-stone-500 line-through", text: "Đã hủy" },
};

function QrOrderPage() {
  const { qrCode } = useParams();

  const [loading, setLoading] = useState(true);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [session, setSession] = useState(null); // { ten_ban, ma_ban, phien_token, foods, categories }
  const [billItems, setBillItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [cart, setCart] = useState([]);
  const [cartExpanded, setCartExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const timerRef = useRef(null);

  const cartBarRef = useRef(null);
  const [cartBarHeight, setCartBarHeight] = useState(0);
  const hasCartItems = cart.length > 0;
  useEffect(() => {
    const el = cartBarRef.current;
    if (!el) {
      setCartBarHeight(0);
      return;
    }
    const observer = new ResizeObserver(([entry]) =>
      setCartBarHeight(entry.contentRect.height),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCartItems]);

  // ===== AI TƯ VẤN MÓN ĂN (nghiệp vụ 2.3.1.14) =====
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // ===== LOAD PHIÊN + THỰC ĐƠN (Bước 1) =====
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getQrSession(qrCode);
        setSession(data);
      } catch (err) {
        setInvalidMessage(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [qrCode]);

  // ===== LOAD GIỎ HÀNG HIỆN TẠI (poll + socket) =====
  const loadBill = async (token) => {
    try {
      const data = await getQrBill(qrCode, token);
      setBillItems(data.items || []);
    } catch {
      // phiên có thể đã hết hạn giữa chừng — không chặn UI, lần thử sau sẽ báo lỗi rõ hơn khi gửi
    }
  };

  useEffect(() => {
    if (!session?.phien_token) return;
    loadBill(session.phien_token);
    timerRef.current = setInterval(
      () => loadBill(session.phien_token),
      POLL_INTERVAL_MS,
    );
    return () => clearInterval(timerRef.current);
  }, [session?.phien_token]);

  // ===== SOCKET: cập nhật ngay khi NV xác nhận/từ chối/bếp hoàn thành =====
  useEffect(() => {
    if (!session?.ma_ban) return;
    const socket = ioClient(SERVER_URL);
    const relevant = (payload) => payload?.ma_ban === session.ma_ban;

    const onConfirmed = (p) => {
      if (relevant(p)) loadBill(session.phien_token);
    };
    const onRejected = (p) => {
      if (relevant(p)) {
        setFeedback({
          type: "error",
          text: `Món "${p.ten_mon_an}" đã bị nhân viên từ chối.`,
        });
        loadBill(session.phien_token);
      }
    };
    const onDone = (p) => {
      if (relevant(p)) loadBill(session.phien_token);
    };

    socket.on("qr:order-confirmed", onConfirmed);
    socket.on("qr:order-rejected", onRejected);
    socket.on("server:item-done", onDone);

    return () => socket.disconnect();
  }, [session?.ma_ban, session?.phien_token]);

  // ===== GIỎ TẠM (chưa gửi) =====
  const handleAddToCart = (mon) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.ma_mon_an === mon.ma_mon_an);
      if (existing) {
        return prev.map((p) =>
          p.ma_mon_an === mon.ma_mon_an
            ? { ...p, so_luong: p.so_luong + 1 }
            : p,
        );
      }
      return [
        ...prev,
        {
          ma_mon_an: mon.ma_mon_an,
          ten_mon_an: mon.ten_mon_an,
          gia_ban: mon.gia_ban,
          so_luong: 1,
          ghi_chu: "",
        },
      ];
    });
  };

  const updateCartQty = (maMonAn, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.ma_mon_an !== maMonAn));
      return;
    }
    setCart((prev) =>
      prev.map((p) => (p.ma_mon_an === maMonAn ? { ...p, so_luong: qty } : p)),
    );
  };

  const updateCartNote = (maMonAn, note) => {
    setCart((prev) =>
      prev.map((p) => (p.ma_mon_an === maMonAn ? { ...p, ghi_chu: note } : p)),
    );
  };

  // ===== GỬI YÊU CẦU GỌI MÓN (Bước 2) =====
  const handleSubmit = async () => {
    if (cart.length === 0 || submitting) return;
    setSubmitting(true); // vô hiệu hóa nút ngay để tránh gửi trùng lặp
    try {
      const items = cart.map((p) => ({
        ma_mon_an: p.ma_mon_an,
        so_luong: p.so_luong,
        ghi_chu: p.ghi_chu || null,
      }));
      const r = await submitQrOrder(qrCode, session.phien_token, items);
      setFeedback({ type: "success", text: r.message });
      setCart([]);
      setCartExpanded(false);
      await loadBill(session.phien_token);
    } catch (err) {
      setFeedback({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // ===== HỦY YÊU CẦU ĐANG CHỜ XÁC NHẬN =====
  const handleCancelPending = async () => {
    await cancelQrOrder(qrCode, session.phien_token);
    setConfirmCancelOpen(false);
    setFeedback({ type: "success", text: "Đã hủy yêu cầu gọi món" });
    await loadBill(session.phien_token);
  };

  // ===== HỎI AI TƯ VẤN MÓN ĂN  =====
  const handleAskAi = async () => {
    const cauHoi = aiInput.trim();
    if (!cauHoi) return; // Bước 2: rỗng thì không gửi, giữ nguyên Bước 1
    setAiLoading(true);
    setAiResult(null);
    try {
      const r = await getAiSuggestion(qrCode, session.phien_token, cauHoi);
      setAiResult({ tra_loi: r.tra_loi, goi_y: r.goi_y });
    } catch (err) {
      // AI lỗi — BE đã trả đúng câu thông báo
      setAiResult({ error: getErrorMessage(err) });
    } finally {
      setAiLoading(false);
    }
  };

  const closeAiPanel = () => {
    setAiOpen(false);
  };

  // ===== RENDER =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500 text-sm">
        Đang tải...
      </div>
    );
  }

  if (invalidMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-3">🚫</div>
          <p className="text-stone-700 font-medium">{invalidMessage}</p>
        </div>
      </div>
    );
  }

  const filteredFoods = selectedCat
    ? session.foods.filter((f) => String(f.ma_danh_muc) === String(selectedCat))
    : session.foods;

  const cartTotal = cart.reduce(
    (sum, p) => sum + p.so_luong * Number(p.gia_ban),
    0,
  );
  const hasPending = billItems.some((i) => i.trang_thai === "Cho_xac_nhan");
  const activeBill = billItems.filter((i) => i.trang_thai !== "Da_huy");
  const activeBillTotal = activeBill.reduce(
    (sum, item) => sum + Number(item.thanh_tien),
    0,
  );
  const getCartQty = (maMonAn) =>
    cart.find((p) => p.ma_mon_an === maMonAn)?.so_luong || 0;

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-stone-800">
            {session.ten_ban}
          </h1>
          <span className="text-[11px] font-medium text-amber-700 bg-white border border-amber-300 rounded-full px-2 py-0.5">
            MeatOSync
          </span>
        </div>
      </div>

      {/* Lối vào Trợ lý AI tư vấn món ăn — nghiệp vụ 2.3.1.14 (nút nổi, không chiếm hàng riêng) */}
      <button
        onClick={() => setAiOpen(true)}
        aria-label="Trợ lý AI tư vấn món ăn"
        style={{ bottom: hasCartItems ? cartBarHeight + 16 : 24 }}
        className="fixed right-4 z-20 flex items-center gap-1.5 pl-3 pr-4 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
      >
        <span className="text-lg leading-none">🤖</span>
        <span>Hỏi AI</span>
      </button>

      {/* Giỏ hàng hiện tại (đã gửi) */}
      {activeBill.length > 0 && (
        <div className="shrink-0 mx-4 mt-0.5 bg-white rounded-xl border border-stone-200 max-h-40 overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between px-3 pt-3 pb-1">
            <h2 className="text-sm font-semibold text-stone-800">Món đã gọi</h2>
            <span className="text-sm font-semibold text-amber-700">
              {activeBillTotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div className="flex flex-col gap-2 px-3 pb-3">
            {activeBill.map((item) => {
              const st = ITEM_STATUS[item.trang_thai] || {
                cls: "",
                text: item.trang_thai,
              };
              return (
                <div
                  key={item.ma_chi_tiet_hd}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <div className="text-stone-800">
                      {item.so_luong}x {item.ten_mon_an}
                    </div>
                    {item.ghi_chu && (
                      <div className="text-xs text-stone-400 italic">
                        {item.ghi_chu}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}
                  >
                    {st.text}
                  </span>
                </div>
              );
            })}
            {hasPending && (
              <button
                onClick={() => setConfirmCancelOpen(true)}
                className="w-full mt-1 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50"
              >
                Hủy yêu cầu này
              </button>
            )}
          </div>
        </div>
      )}

      {/* Thanh chip danh mục */}
      <div className="shrink-0 px-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        <CategoryChip
          label="Tất cả"
          active={selectedCat === ""}
          onClick={() => setSelectedCat("")}
        />
        {session.categories.map((dm) => (
          <CategoryChip
            key={dm.ma_danh_muc}
            label={dm.ten_danh_muc}
            active={String(selectedCat) === String(dm.ma_danh_muc)}
            onClick={() => setSelectedCat(dm.ma_danh_muc)}
          />
        ))}
      </div>

      {/* Danh sách món — cuộn riêng bên trong, không kéo dài cả trang */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 mt-3 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredFoods.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8 col-span-full">
              Danh mục này chưa có món nào.
            </p>
          ) : (
            filteredFoods.map((mon) => (
              <FoodCard
                key={mon.ma_mon_an}
                mon={mon}
                qty={getCartQty(mon.ma_mon_an)}
                onAdd={handleAddToCart}
              />
            ))
          )}
        </div>
      </div>

      {/* Giỏ tạm + nút gửi — ghim đáy màn hình, không scroll theo trang */}
      {cart.length > 0 && (
        <div
          ref={cartBarRef}
          className="shrink-0 bg-white border-t border-stone-200 p-2.5 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
        >
          <button
            onClick={() => setCartExpanded((v) => !v)}
            className="w-full flex items-center justify-between mb-1.5"
          >
            <span className="text-sm font-semibold text-stone-800">
              🛒 {cart.length} món chưa gửi
            </span>
            {cartExpanded ? (
              <ChevronDown size={18} className="text-stone-500" />
            ) : (
              <ChevronUp size={18} className="text-stone-500" />
            )}
          </button>
          {cartExpanded && (
            <div className="max-h-40 overflow-y-auto flex flex-col gap-2 mb-1.5">
              {cart.map((p) => (
                <CartRow
                  key={p.ma_mon_an}
                  item={p}
                  onUpdateQty={updateCartQty}
                  onUpdateNote={updateCartNote}
                />
              ))}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
          >
            {submitting
              ? "Đang gửi..."
              : `Gửi yêu cầu gọi món • ${cartTotal.toLocaleString("vi-VN")}đ`}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmCancelOpen}
        title="Hủy yêu cầu gọi món"
        description="Hủy yêu cầu gọi món vừa gửi? Nhân viên sẽ không nhận được yêu cầu này nữa."
        confirmText="Hủy yêu cầu"
        danger
        onConfirm={handleCancelPending}
        onClose={() => setConfirmCancelOpen(false)}
      />

      <Modal
        open={aiOpen}
        onClose={closeAiPanel}
        title="🤖 Trợ lý AI tư vấn món ăn"
        maxWidth="max-w-sm"
        maxHeight="max-h-[75vh]"
      >
        <AiAdvisorPanel
          value={aiInput}
          onChange={setAiInput}
          loading={aiLoading}
          result={aiResult}
          onAsk={handleAskAi}
          getCartQty={getCartQty}
          onAdd={(mon) => {
            handleAddToCart(mon);
            setFeedback({
              type: "success",
              text: `Đã thêm "${mon.ten_mon_an}" vào giỏ`,
            });
          }}
          onShowMenu={closeAiPanel}
        />
      </Modal>

      <Toast
        type={feedback?.type}
        message={feedback?.text || ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}

const AiAdvisorPanel = ({
  value,
  onChange,
  loading,
  result,
  onAsk,
  getCartQty,
  onAdd,
  onShowMenu,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-stone-600">
        Cho mình biết sở thích, khẩu vị (cay, không cay...), số người ăn hoặc
        ngân sách — mình sẽ gợi ý món phù hợp.
      </p>

      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, AI_MAX_LENGTH))}
          maxLength={AI_MAX_LENGTH}
          rows={3}
          placeholder="Ví dụ: Nhóm mình 4 người, thích ăn cay, ngân sách khoảng 500k..."
          disabled={loading}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none disabled:opacity-60"
        />
        <div className="text-right text-xs text-stone-400 mt-0.5">
          {value.length}/{AI_MAX_LENGTH}
        </div>
      </div>

      <button
        onClick={onAsk}
        disabled={loading || !value.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Đang tìm món phù hợp...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Hỏi trợ lý AI
          </>
        )}
      </button>

      {result?.error && (
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {result.error}
          </div>
          <button
            onClick={onShowMenu}
            className="w-full py-2 rounded-lg border border-stone-300 text-stone-600 text-sm hover:bg-stone-50"
          >
            Xem thực đơn
          </button>
        </div>
      )}

      {result?.tra_loi !== undefined && !result.error && (
        <div className="flex flex-col gap-3">
          <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm">
            {result.tra_loi}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {result.goi_y.map((mon) => (
              <FoodCard
                key={mon.ma_mon_an}
                mon={mon}
                qty={getCartQty(mon.ma_mon_an)}
                onAdd={onAdd}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={
      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border " +
      (active
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-white text-stone-600 border-stone-200")
    }
  >
    {label}
  </button>
);

const FoodCard = ({ mon, qty, onAdd }) => (
  <div className="relative flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="relative">
      {qty > 0 && (
        <span className="absolute top-1.5 right-1.5 z-10 min-w-[1.375rem] h-[1.375rem] px-1 rounded-full bg-red-600 text-white text-xs font-bold ring-2 ring-white shadow flex items-center justify-center">
          {qty}
        </span>
      )}
      {mon.hinh_anh_url ? (
        <img
          src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
          alt={mon.ten_mon_an}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no-image.png";
          }}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
          Không ảnh
        </div>
      )}
    </div>
    <div className="p-3 flex flex-col flex-1">
      <div className="text-sm font-bold text-stone-800 line-clamp-2">
        {mon.ten_mon_an}
      </div>
      {mon.mo_ta && (
        <div className="text-xs text-stone-400 line-clamp-2 mt-1">
          {mon.mo_ta}
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-amber-700 font-bold">
          {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
        </span>
        <button
          onClick={() => onAdd(mon)}
          aria-label={`Thêm ${mon.ten_mon_an}`}
          className="w-8 h-8 shrink-0 rounded-full bg-amber-600 text-white text-lg leading-none flex items-center justify-center active:scale-90 transition-all"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

const CartRow = ({ item, onUpdateQty, onUpdateNote }) => (
  <div className="border border-amber-200 bg-amber-50 rounded-lg px-2 py-1.5">
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0 text-sm font-medium text-stone-800 truncate">
        {item.ten_mon_an}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong - 1)}
          className="w-6 h-6 rounded border border-stone-300 text-sm bg-white"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-medium">
          {item.so_luong}
        </span>
        <button
          onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong + 1)}
          className="w-6 h-6 rounded border border-stone-300 text-sm bg-white"
        >
          +
        </button>
        <button
          onClick={() => onUpdateQty(item.ma_mon_an, 0)}
          aria-label={`Xóa ${item.ten_mon_an} khỏi giỏ`}
          className="w-6 h-6 ml-1 rounded border border-stone-200 text-stone-400 text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          ×
        </button>
      </div>
    </div>
    <input
      type="text"
      placeholder="Ghi chú (VD: ít cay...)"
      value={item.ghi_chu}
      onChange={(e) => onUpdateNote(item.ma_mon_an, e.target.value)}
      className="w-full mt-1 border border-stone-200 rounded px-2 py-1 text-xs bg-white"
    />
  </div>
);

export default QrOrderPage;
