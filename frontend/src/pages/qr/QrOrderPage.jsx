import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io as ioClient } from "socket.io-client";
import { getQrSession, getQrBill, submitQrOrder, cancelQrOrder } from "../../api/qrApi";
import { getErrorMessage } from "../../api/errorHandler";
import { SERVER_URL } from "../../api/apiConfig";

const POLL_INTERVAL_MS = 5000;

const ITEM_STATUS = {
  Cho_xac_nhan: { cls: "bg-amber-50 text-amber-700", text: "Chờ nhân viên xác nhận" },
  Dang_che_bien: { cls: "bg-blue-50 text-blue-700", text: "Đang chế biến" },
  Da_hoan_thanh: { cls: "bg-emerald-50 text-emerald-700", text: "Hoàn thành" },
  Da_huy: { cls: "bg-slate-100 text-slate-500 line-through", text: "Đã hủy" },
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
  const [message, setMessage] = useState("");
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
        setMessage(`❌ Món "${p.ten_mon_an}" đã bị nhân viên từ chối.`);
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
      setMessage("✅ " + r.message);
      setCart([]);
      await loadBill(session.phien_token);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ===== HỦY YÊU CẦU ĐANG CHỜ XÁC NHẬN (Bước 2.1) =====
  const handleCancelPending = async () => {
    if (!window.confirm("Hủy yêu cầu gọi món vừa gửi?")) return;
    try {
      const r = await cancelQrOrder(qrCode, session.phien_token);
      setMessage("✅ " + r.message);
      await loadBill(session.phien_token);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  // ===== RENDER =====
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Đang tải...</div>;
  }

  if (invalidMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-3">🚫</div>
          <p className="text-slate-700 font-medium">{invalidMessage}</p>
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

  return (
    <div className="min-h-screen bg-slate-50 pb-56">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">{session.ten_ban}</h1>
        <p className="text-xs text-slate-500">Quét mã QR để gọi món</p>
      </div>

      {message && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* Giỏ hàng hiện tại (đã gửi) */}
      {activeBill.length > 0 && (
        <div className="mx-4 mt-3 bg-white rounded-xl border border-slate-200 p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Món đã gọi</h2>
          <div className="flex flex-col gap-2">
            {activeBill.map((item) => {
              const st = ITEM_STATUS[item.trang_thai] || { cls: "", text: item.trang_thai };
              return (
                <div key={item.ma_chi_tiet_hd} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="text-slate-800">{item.so_luong}x {item.ten_mon_an}</div>
                    {item.ghi_chu && <div className="text-xs text-slate-400 italic">{item.ghi_chu}</div>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                </div>
              );
            })}
          </div>
          {hasPending && (
            <button
              onClick={handleCancelPending}
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
      <div className="px-4 mt-3 flex flex-col gap-2">
        {filteredFoods.map((mon) => (
          <FoodRow key={mon.ma_mon_an} mon={mon} onAdd={handleAddToCart} />
        ))}
      </div>

      {/* Giỏ tạm + nút gửi — cố định đáy màn hình */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <div className="max-h-40 overflow-y-auto flex flex-col gap-2 mb-2">
            {cart.map((p) => (
              <CartRow key={p.ma_mon_an} item={p} onUpdateQty={updateCartQty} onUpdateNote={updateCartNote} />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : `Gửi yêu cầu gọi món • ${cartTotal.toLocaleString("vi-VN")}đ`}
          </button>
        </div>
      )}
    </div>
  );
}

const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={
      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border " +
      (active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200")
    }
  >
    {label}
  </button>
);

const FoodRow = ({ mon, onAdd }) => (
  <button
    onClick={() => onAdd(mon)}
    className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 text-left active:bg-amber-50"
  >
    {mon.hinh_anh_url ? (
      <img
        src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
        alt={mon.ten_mon_an}
        onError={(e) => { e.target.onerror = null; e.target.src = "/no-image.png"; }}
        className="w-14 h-14 object-cover rounded-lg shrink-0"
      />
    ) : (
      <div className="w-14 h-14 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-slate-300 text-[10px]">
        Không ảnh
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-800 truncate">{mon.ten_mon_an}</div>
      <div className="text-xs text-amber-700 font-semibold mt-0.5">
        {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
      </div>
    </div>
    <span className="shrink-0 text-amber-600 text-2xl leading-none">+</span>
  </button>
);

const CartRow = ({ item, onUpdateQty, onUpdateNote }) => (
  <div className="border border-amber-200 bg-amber-50 rounded-lg px-2 py-1.5">
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate">{item.ten_mon_an}</div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong - 1)} className="w-6 h-6 rounded border border-slate-300 text-sm bg-white">−</button>
        <span className="w-5 text-center text-sm font-medium">{item.so_luong}</span>
        <button onClick={() => onUpdateQty(item.ma_mon_an, item.so_luong + 1)} className="w-6 h-6 rounded border border-slate-300 text-sm bg-white">+</button>
      </div>
    </div>
    <input
      type="text"
      placeholder="Ghi chú (VD: ít cay...)"
      value={item.ghi_chu}
      onChange={(e) => onUpdateNote(item.ma_mon_an, e.target.value)}
      className="w-full mt-1 border border-slate-200 rounded px-2 py-1 text-xs bg-white"
    />
  </div>
);

export default QrOrderPage;
