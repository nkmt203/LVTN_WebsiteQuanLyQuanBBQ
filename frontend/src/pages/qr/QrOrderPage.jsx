import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io as ioClient } from "socket.io-client";
import { getQrSession, getQrBill, submitQrOrder, cancelQrOrder } from "../../api/qrApi";
import { getErrorMessage } from "../../api/errorHandler";
import { SERVER_URL } from "../../api/apiConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const POLL_INTERVAL_MS = 5000;

const ITEM_STATUS = {
  Cho_xac_nhan: { cls: "bg-amber-50 text-amber-700", text: "Chờ nhân viên xác nhận" },
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
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const timerRef = useRef(null);

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
    timerRef.current = setInterval(() => loadBill(session.phien_token), POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [session?.phien_token]);

  // ===== SOCKET: cập nhật ngay khi NV xác nhận/từ chối/bếp hoàn thành =====
  useEffect(() => {
    if (!session?.ma_ban) return;
    const socket = ioClient(SERVER_URL);
    const relevant = (payload) => payload?.ma_ban === session.ma_ban;

    const onConfirmed = (p) => { if (relevant(p)) loadBill(session.phien_token); };
    const onRejected = (p) => {
      if (relevant(p)) {
        setFeedback({ type: "error", text: `Món "${p.ten_mon_an}" đã bị nhân viên từ chối.` });
        loadBill(session.phien_token);
      }
    };
    const onDone = (p) => { if (relevant(p)) loadBill(session.phien_token); };

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
          p.ma_mon_an === mon.ma_mon_an ? { ...p, so_luong: p.so_luong + 1 } : p,
        );
      }
      return [...prev, { ma_mon_an: mon.ma_mon_an, ten_mon_an: mon.ten_mon_an, gia_ban: mon.gia_ban, so_luong: 1, ghi_chu: "" }];
    });
  };

  const updateCartQty = (maMonAn, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.ma_mon_an !== maMonAn));
      return;
    }
    setCart((prev) => prev.map((p) => (p.ma_mon_an === maMonAn ? { ...p, so_luong: qty } : p)));
  };

  const updateCartNote = (maMonAn, note) => {
    setCart((prev) => prev.map((p) => (p.ma_mon_an === maMonAn ? { ...p, ghi_chu: note } : p)));
  };

  // ===== GỬI YÊU CẦU GỌI MÓN (Bước 2) =====
  const handleSubmit = async () => {
    if (cart.length === 0 || submitting) return;
    setSubmitting(true); // vô hiệu hóa nút ngay để tránh gửi trùng lặp
    try {
      const items = cart.map((p) => ({ ma_mon_an: p.ma_mon_an, so_luong: p.so_luong, ghi_chu: p.ghi_chu || null }));
      const r = await submitQrOrder(qrCode, session.phien_token, items);
      setFeedback({ type: "success", text: r.message });
      setCart([]);
      await loadBill(session.phien_token);
    } catch (err) {
      setFeedback({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // ===== HỦY YÊU CẦU ĐANG CHỜ XÁC NHẬN (Bước 2.1) =====
  const handleCancelPending = async () => {
    await cancelQrOrder(qrCode, session.phien_token);
    setConfirmCancelOpen(false);
    setFeedback({ type: "success", text: "Đã hủy yêu cầu gọi món" });
    await loadBill(session.phien_token);
  };

  // ===== RENDER =====
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-500 text-sm">Đang tải...</div>;
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

  const cartTotal = cart.reduce((sum, p) => sum + p.so_luong * Number(p.gia_ban), 0);
  const hasPending = billItems.some((i) => i.trang_thai === "Cho_xac_nhan");
  const activeBill = billItems.filter((i) => i.trang_thai !== "Da_huy");
  const getCartQty = (maMonAn) => cart.find((p) => p.ma_mon_an === maMonAn)?.so_luong || 0;

  return (
    <div className="min-h-screen bg-stone-50 pb-56">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-stone-800">{session.ten_ban}</h1>
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            MeatOSync
          </span>
        </div>
        <p className="text-xs text-stone-500">Xem thực đơn và gọi món ngay tại bàn</p>
      </div>

      {feedback && (
        <div
          className={
            "mx-4 mt-3 px-3 py-2 rounded-lg border text-sm " +
            (feedback.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700")
          }
        >
          {feedback.text}
        </div>
      )}

      {/* Giỏ hàng hiện tại (đã gửi) */}
      {activeBill.length > 0 && (
        <div className="mx-4 mt-3 bg-white rounded-xl border border-stone-200 p-3">
          <h2 className="text-sm font-semibold text-stone-800 mb-2">Món đã gọi</h2>
          <div className="flex flex-col gap-2">
            {activeBill.map((item) => {
              const st = ITEM_STATUS[item.trang_thai] || { cls: "", text: item.trang_thai };
              return (
                <div key={item.ma_chi_tiet_hd} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="text-stone-800">{item.so_luong}x {item.ten_mon_an}</div>
                    {item.ghi_chu && <div className="text-xs text-stone-400 italic">{item.ghi_chu}</div>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                </div>
              );
            })}
          </div>
          {hasPending && (
            <button
              onClick={() => setConfirmCancelOpen(true)}
              className="w-full mt-3 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
            >
              Hủy yêu cầu này
            </button>
          )}
        </div>
      )}

      {/* Thanh chip danh mục */}
      <div className="px-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        <CategoryChip label="Tất cả" active={selectedCat === ""} onClick={() => setSelectedCat("")} />
        {session.categories.map((dm) => (
          <CategoryChip
            key={dm.ma_danh_muc}
            label={dm.ten_danh_muc}
            active={String(selectedCat) === String(dm.ma_danh_muc)}
            onClick={() => setSelectedCat(dm.ma_danh_muc)}
          />
        ))}
      </div>

      {/* Danh sách món */}
      <div className="px-4 mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredFoods.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8 col-span-full">Danh mục này chưa có món nào.</p>
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

      {/* Giỏ tạm + nút gửi — cố định đáy màn hình */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <div className="max-h-40 overflow-y-auto flex flex-col gap-2 mb-2">
            {cart.map((p) => (
              <CartRow key={p.ma_mon_an} item={p} onUpdateQty={updateCartQty} onUpdateNote={updateCartNote} />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold disabled:opacity-50 active:scale-95 transition-all"
          >
            {submitting ? "Đang gửi..." : `Gửi yêu cầu gọi món • ${cartTotal.toLocaleString("vi-VN")}đ`}
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
    </div>
  );
}

const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={
      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border " +
      (active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200")
    }
  >
    {label}
  </button>
);

const FoodCard = ({ mon, qty, onAdd }) => (
  <button
    onClick={() => onAdd(mon)}
    className="relative flex flex-col text-left bg-white border border-stone-200 rounded-xl overflow-hidden active:scale-95 transition-all"
  >
    {qty > 0 && (
      <span className="absolute top-1.5 right-1.5 z-10 min-w-[1.25rem] h-5 px-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
        {qty}
      </span>
    )}
    {mon.hinh_anh_url ? (
      <img
        src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
        alt={mon.ten_mon_an}
        onError={(e) => { e.target.onerror = null; e.target.src = "/no-image.png"; }}
        className="w-full h-24 object-cover"
      />
    ) : (
      <div className="w-full h-24 bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
        Không ảnh
      </div>
    )}
    <div className="p-2">
      <div className="text-sm font-medium text-stone-800 line-clamp-2">{mon.ten_mon_an}</div>
      <div className="text-sm text-amber-700 font-semibold mt-1">
        {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
      </div>
    </div>
  </button>
);

const CartRow = ({ item, onUpdateQty, onUpdateNote }) => (
  <div className="border border-amber-200 bg-amber-50 rounded-lg px-2 py-1.5">
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0 text-sm font-medium text-stone-800 truncate">{item.ten_mon_an}</div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong - 1)} className="w-6 h-6 rounded border border-stone-300 text-sm bg-white">−</button>
        <span className="w-5 text-center text-sm font-medium">{item.so_luong}</span>
        <button onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong + 1)} className="w-6 h-6 rounded border border-stone-300 text-sm bg-white">+</button>
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
