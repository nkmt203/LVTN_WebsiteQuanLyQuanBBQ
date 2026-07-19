import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBillByTable,
  submitOrderBatch,
  updateOrderItem,
  cancelOrderItem,
} from "../../api/orderApi";
import { cancelTable } from "../../api/serviceApi";
import { getAllFood } from "../../api/foodApi";
import { getAllCategories } from "../../api/categoryApi";
import { getErrorMessage } from "../../api/errorHandler";
import { SERVER_URL } from "../../api/apiConfig";
import Modal from "../../components/common/Modal";

const ITEM_STATUS = {
  Cho_xac_nhan: { cls: "bg-amber-50 text-amber-700", text: "Chờ xác nhận" },
  Dang_che_bien: { cls: "bg-blue-50 text-blue-700", text: "Đang chế biến" },
  Da_hoan_thanh: { cls: "bg-emerald-50 text-emerald-700", text: "Hoàn thành" },
  Da_huy: { cls: "bg-slate-100 text-slate-500 line-through", text: "Đã hủy" },
};

function OrderPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // ===== STATE =====
  const [bill, setBill] = useState(null);
  const [sentItems, setSentItems] = useState([]); // món đã gửi bếp (từ DB)
  const [pending, setPending] = useState([]); // giỏ tạm (chưa gửi, chỉ ở FE)
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedCat, setSelectedCat] = useState("");

  const [showCancelled, setShowCancelled] = useState(false);

  // Modal hủy món ĐÃ GỬI
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancellingItem, setCancellingItem] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // ===== LOAD =====
  const loadBill = async () => {
    try {
      const resp = await getBillByTable(tableId);
      setBill(resp.hoaDon);
      setSentItems(resp.items);
    } catch (err) {
      setBill(null);
      setSentItems([]);
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [foodResp, catResp] = await Promise.all([
          getAllFood({ trang_thai: "Dang_kinh_doanh", limit: 200 }),
          getAllCategories({ trang_thai: "Dang_su_dung", limit: 100 }),
        ]);
        setFoods(Array.isArray(foodResp.data) ? foodResp.data : []);
        setCategories(Array.isArray(catResp.data) ? catResp.data : []);
      } catch {}
      await loadBill();
      setLoading(false);
    };
    init();
  }, [tableId]);

  /// Menu đã lọc theo danh mục (không cần tìm kiếm nữa)
  const filteredFoods = selectedCat
    ? foods.filter((f) => String(f.ma_danh_muc) === String(selectedCat))
    : foods;

  // ===== GIỎ TẠM: THÊM/SỬA/XÓA =====

  // Bấm 1 món trong menu: nếu đã có trong giỏ tạm → +1 SL, chưa có → thêm dòng SL=1
  const handleAddFoodToPending = (mon) => {
    setPending((prev) => {
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
          _tmp_id: Date.now() + Math.random(), // key React
          ma_mon_an: mon.ma_mon_an,
          ten_mon_an: mon.ten_mon_an,
          gia_ban: mon.gia_ban,
          so_luong: 1,
          ghi_chu: "",
        },
      ];
    });
  };

  const updatePendingQty = (tmpId, newQty) => {
    if (newQty <= 0) {
      // SL về 0 = xóa dòng
      setPending((prev) => prev.filter((p) => p._tmp_id !== tmpId));
      return;
    }
    setPending((prev) =>
      prev.map((p) => (p._tmp_id === tmpId ? { ...p, so_luong: newQty } : p)),
    );
  };

  const updatePendingNote = (tmpId, note) => {
    setPending((prev) =>
      prev.map((p) => (p._tmp_id === tmpId ? { ...p, ghi_chu: note } : p)),
    );
  };

  const removePending = (tmpId) => {
    setPending((prev) => prev.filter((p) => p._tmp_id !== tmpId));
  };

  const clearAllPending = () => {
    if (!window.confirm("Bỏ toàn bộ các món chưa gửi?")) return;
    setPending([]);
  };

  // ===== XÁC NHẬN GỬI BẾP =====
  const handleSubmitBatch = async () => {
    if (pending.length === 0) return;
    setSubmitting(true);
    try {
      const items = pending.map((p) => ({
        ma_mon_an: p.ma_mon_an,
        so_luong: p.so_luong,
        ghi_chu: p.ghi_chu || null,
      }));
      const r = await submitOrderBatch(bill.ma_hoa_don, items);
      setMessage("✅ " + r.message);
      setPending([]);
      await loadBill();
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ===== SỬA SL MÓN ĐÃ GỬI (dùng lại từ Tin 2 cũ) =====
  const handleUpdateSentQty = async (item, delta) => {
    const newQty = item.so_luong + delta;
    if (newQty <= 0) {
      setMessage(
        '⚠️ Vui lòng dùng nút "Hủy" nếu muốn xóa món này khỏi hoá đơn.',
      );
      return;
    }
    try {
      await updateOrderItem(item.ma_chi_tiet_hd, {
        so_luong: newQty,
        ghi_chu: item.ghi_chu,
      });
      await loadBill();
    } catch (err) {
      if (err.response?.data?.require_confirm) {
        const ok = window.confirm(
          `Món "${item.ten_mon_an}" đang được chế biến.\n\n` +
            `Bạn muốn thay đổi số lượng từ ${item.so_luong} → ${newQty}?\n` +
            `(Bếp sẽ nhận thông báo cập nhật)`,
        );
        if (!ok) return;
        try {
          await updateOrderItem(item.ma_chi_tiet_hd, {
            so_luong: newQty,
            ghi_chu: item.ghi_chu,
            xac_nhan_thay_doi: true,
          });
          setMessage(
            `✅ Đã cập nhật ${item.ten_mon_an}: ${item.so_luong} → ${newQty}`,
          );
          await loadBill();
        } catch (err2) {
          setMessage("❌ " + getErrorMessage(err2));
        }
        return;
      }
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  // ===== HỦY MÓN ĐÃ GỬI =====
  const openCancelModal = (item) => {
    setCancellingItem(item);
    setCancelReason("");
    setCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setMessage("❌ Vui lòng nhập lý do hủy");
      return;
    }
    try {
      await cancelOrderItem(cancellingItem.ma_chi_tiet_hd, cancelReason.trim());
      setMessage(`✅ Đã hủy ${cancellingItem.ten_mon_an}`);
      setCancelOpen(false);
      await loadBill();
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  // ===== HỦY MỞ BÀN =====
  const handleCancelTable = async () => {
    if (!window.confirm("Hủy mở bàn này? (Chỉ được hủy khi bàn chưa có món)"))
      return;
    try {
      const r = await cancelTable(tableId);
      alert(r.message);
      navigate("/server/tables");
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  };

  // ===== QUAY LẠI SƠ ĐỒ BÀN (hỏi nếu còn giỏ tạm) =====
  const handleGoBack = () => {
    if (pending.length > 0) {
      if (
        !window.confirm(
          `Bỏ ${pending.length} món chưa gửi và quay lại sơ đồ bàn?`,
        )
      )
        return;
    }
    navigate("/server/tables");
  };

  // ===== RENDER =====
  if (loading) return <p className="text-slate-500">Đang tải...</p>;
  if (!bill)
    return (
      <div>
        <p className="text-red-600 mb-3">Bàn chưa được mở phục vụ.</p>
        <button
          onClick={() => navigate("/server/tables")}
          className="text-blue-600 hover:underline"
        >
          ← Quay lại sơ đồ bàn
        </button>
      </div>
    );

  const activeSent = sentItems.filter((i) => i.trang_thai !== "Da_huy");
  const cancelledSent = sentItems.filter((i) => i.trang_thai === "Da_huy");
  const visibleSent = showCancelled ? sentItems : activeSent;

  const pendingTotal = pending.reduce(
    (sum, p) => sum + p.so_luong * Number(p.gia_ban),
    0,
  );
  const sentTotal = activeSent.reduce(
    (sum, i) => sum + Number(i.thanh_tien),
    0,
  );
  const grandTotal = sentTotal + pendingTotal;

  return (
    <div>
      <OrderHeader
        bill={bill}
        onBack={handleGoBack}
        onCancelTable={handleCancelTable}
      />

      {message && (
        <div className="mb-3 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CỘT TRÁI: MENU */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4">
          {/* Thanh chip danh mục */}
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-slate-100">
            <CategoryChip
              label={`Tất cả (${foods.length})`}
              active={selectedCat === ""}
              onClick={() => setSelectedCat("")}
            />
            {categories.map((dm) => {
              const count = foods.filter(
                (f) => f.ma_danh_muc === dm.ma_danh_muc,
              ).length;
              return (
                <CategoryChip
                  key={dm.ma_danh_muc}
                  label={`${dm.ten_danh_muc} (${count})`}
                  active={String(selectedCat) === String(dm.ma_danh_muc)}
                  onClick={() => setSelectedCat(dm.ma_danh_muc)}
                />
              );
            })}
          </div>

          {/* Grid món ăn - nhiều cột, thẻ compact xl:grid-cols-7 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-2">
            {filteredFoods.length === 0 ? (
              <p className="text-slate-400 text-sm col-span-full text-center py-8">
                Danh mục này chưa có món nào.
              </p>
            ) : (
              filteredFoods.map((mon) => (
                <FoodCard
                  key={mon.ma_mon_an}
                  mon={mon}
                  onClick={handleAddFoodToPending}
                />
              ))
            )}
          </div>
        </div>

        {/* CỘT PHẢI: GIỎ */}
        <div className="flex flex-col gap-4">
          {/* GIỎ TẠM (chưa gửi) */}
          <div className="bg-amber-50 rounded-xl border-2 border-amber-300 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-amber-800">
                🛒 Chờ xác nhận ({pending.length})
              </h3>
              {pending.length > 0 && (
                <button
                  onClick={clearAllPending}
                  className="text-xs text-red-600 hover:underline"
                >
                  Xóa hết
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
              {pending.length === 0 ? (
                <p className="text-amber-600 text-xs text-center py-4 italic">
                  Bấm món ở menu bên trái để thêm vào đây
                </p>
              ) : (
                pending.map((p) => (
                  <PendingItemCard
                    key={p._tmp_id}
                    item={p}
                    onUpdateQty={updatePendingQty}
                    onUpdateNote={updatePendingNote}
                    onRemove={removePending}
                  />
                ))
              )}
            </div>

            {pending.length > 0 && (
              <button
                onClick={handleSubmitBatch}
                disabled={submitting}
                className="w-full mt-3 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50"
              >
                {submitting
                  ? "Đang gửi..."
                  : `✓ Xác nhận gửi bếp (${pending.length} món • ${pendingTotal.toLocaleString("vi-VN")}đ)`}
              </button>
            )}
          </div>

          {/* MÓN ĐÃ GỬI */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3">
              Món đã gọi ({activeSent.length})
            </h3>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {visibleSent.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  Chưa gửi món nào xuống bếp.
                </p>
              ) : (
                visibleSent.map((item) => (
                  <SentItemCard
                    key={item.ma_chi_tiet_hd}
                    item={item}
                    onUpdateQty={handleUpdateSentQty}
                    onCancel={openCancelModal}
                  />
                ))
              )}

              {cancelledSent.length > 0 && (
                <button
                  onClick={() => setShowCancelled(!showCancelled)}
                  className="text-xs text-slate-500 hover:text-slate-700 mt-2 py-1 border-t border-slate-100"
                >
                  {showCancelled
                    ? `▲ Ẩn ${cancelledSent.length} món đã hủy`
                    : `▼ Hiện ${cancelledSent.length} món đã hủy`}
                </button>
              )}
            </div>
          </div>

          {/* TỔNG TIỀN */}
          <div className="bg-slate-800 text-white rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">Đã gửi:</span>
              <span>{sentTotal.toLocaleString("vi-VN")}đ</span>
            </div>
            {pending.length > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-amber-300">Chờ gửi:</span>
                <span className="text-amber-300">
                  {pendingTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            )}
            <div className="border-t border-slate-600 mt-2 pt-2 flex justify-between items-center">
              <span className="text-sm text-slate-300">Tổng cộng:</span>
              <span className="text-xl font-bold">
                {grandTotal.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL HỦY MÓN ĐÃ GỬI */}
      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={cancellingItem ? `Hủy: ${cancellingItem.ten_mon_an}` : "Hủy món"}
      >
        <CancelItemForm
          reason={cancelReason}
          setReason={setCancelReason}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelOpen(false)}
        />
      </Modal>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const OrderHeader = ({ bill, onBack, onCancelTable }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-slate-700 mb-1"
      >
        ← Quay lại sơ đồ bàn
      </button>
      <h2 className="text-xl font-bold text-slate-800">
        {bill.ten_ban}{" "}
        <span className="text-slate-400 font-normal text-sm">
          ({bill.ten_khu_vuc})
        </span>
      </h2>
      <p className="text-xs text-slate-500">Hoá đơn #{bill.ma_hoa_don}</p>
    </div>
    <button
      onClick={onCancelTable}
      className="text-sm text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg"
    >
      Hủy mở bàn
    </button>
  </div>
);

const FoodCard = ({ mon, onClick }) => (
  <button
    onClick={() => onClick(mon)}
    className="text-left bg-slate-50 border border-slate-200 rounded-lg p-1.5 hover:border-amber-400 hover:bg-amber-50 transition-all"
  >
    {mon.hinh_anh_url ? (
      <img
        src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
        alt={mon.ten_mon_an}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/no-image.png";
        }}
        className="w-full aspect-square object-cover rounded mb-1"
      />
    ) : (
      <div className="w-full aspect-square bg-slate-100 rounded mb-1 flex items-center justify-center text-slate-300 text-xs">
        Không ảnh
      </div>
    )}
    <div className="text-xs font-medium text-slate-800 line-clamp-2 min-h-[2rem]">
      {mon.ten_mon_an}
    </div>
    <div className="text-xs text-amber-700 font-semibold mt-0.5">
      {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
    </div>
  </button>
);
const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={
      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all " +
      (active
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700")
    }
  >
    {label}
  </button>
);
// Dòng món trong giỏ tạm — chỉnh trực tiếp inline
const PendingItemCard = ({ item, onUpdateQty, onUpdateNote, onRemove }) => (
  <div className="bg-white border border-amber-200 rounded-lg p-2">
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800">
          {item.ten_mon_an}
        </div>
        <div className="text-xs text-slate-500">
          {Number(item.gia_ban).toLocaleString("vi-VN")}đ × {item.so_luong}
        </div>
      </div>
      <button
        onClick={() => onRemove(item._tmp_id)}
        className="text-slate-400 hover:text-red-500 text-lg leading-none"
      >
        &times;
      </button>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateQty(item._tmp_id, item.so_luong - 1)}
          className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">
          {item.so_luong}
        </span>
        <button
          onClick={() => onUpdateQty(item._tmp_id, item.so_luong + 1)}
          className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100"
        >
          +
        </button>
      </div>
      <span className="text-sm font-medium text-slate-800 ml-auto">
        {(item.so_luong * Number(item.gia_ban)).toLocaleString("vi-VN")}đ
      </span>
    </div>
    <input
      type="text"
      placeholder="Ghi chú (VD: ít cay...)"
      value={item.ghi_chu}
      onChange={(e) => onUpdateNote(item._tmp_id, e.target.value)}
      className="w-full mt-2 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
    />
  </div>
);

// Dòng món đã gửi bếp (từ DB)
const SentItemCard = ({ item, onUpdateQty, onCancel }) => {
  const isCancelled = item.trang_thai === "Da_huy";
  const canEdit = !["Da_hoan_thanh", "Da_huy"].includes(item.trang_thai);
  const status = ITEM_STATUS[item.trang_thai] || {
    cls: "",
    text: item.trang_thai,
  };

  return (
    <div
      className={
        "border rounded-lg p-2 " +
        (isCancelled ? "opacity-50 border-slate-200" : "border-slate-200")
      }
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div
            className={
              "text-sm font-medium " +
              (isCancelled ? "line-through text-slate-500" : "text-slate-800")
            }
          >
            {item.ten_mon_an}
          </div>
          <div className="text-xs text-slate-500">
            {Number(item.don_gia_tai_thoi_diem_goi).toLocaleString("vi-VN")}đ
          </div>
          {item.ghi_chu && (
            <div className="text-xs text-slate-400 italic mt-0.5">
              Ghi chú: {item.ghi_chu}
            </div>
          )}
          {item.ten_nv_xac_nhan && (
            <div className="text-xs text-slate-400 mt-0.5">
              NV: {item.ten_nv_xac_nhan}
            </div>
          )}
        </div>
        <span className={"text-xs px-1.5 py-0.5 rounded " + status.cls}>
          {status.text}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        {canEdit ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateQty(item, -1)}
              className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.so_luong}</span>
            <button
              onClick={() => onUpdateQty(item, +1)}
              className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-600">SL: {item.so_luong}</span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">
            {Number(item.thanh_tien).toLocaleString("vi-VN")}đ
          </span>
          {canEdit && (
            <button
              onClick={() => onCancel(item)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CancelItemForm = ({ reason, setReason, onConfirm, onCancel }) => (
  <div className="flex flex-col gap-3">
    <div className="text-sm text-slate-600">
      Bạn đang hủy món này. Vui lòng cho biết lý do:
    </div>
    <div>
      <label className="text-sm font-medium text-slate-600 mb-1 block">
        Lý do hủy *
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="VD: Khách đổi ý, hết nguyên liệu, gọi nhầm..."
        rows={3}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </div>
    <div className="flex gap-2 justify-end mt-2">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
      >
        Đóng
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
      >
        Xác nhận hủy
      </button>
    </div>
  </div>
);

export default OrderPage;
