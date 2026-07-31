import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { getTablesMap, openTable } from "../../api/serviceApi";
import { getErrorMessage } from "../../api/errorHandler";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";

const POLL_INTERVAL_MS = 5000;

// trạng thái sang màu và nhãn
const STATUS_STYLE = {
  Trong: {
    card: "bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Trống",
  },
  Dang_su_dung: {
    card: "bg-teal-50 border-teal-300 hover:border-teal-500 hover:shadow-md",
    dot: "bg-teal-500",
    text: "text-teal-700",
    label: "Đang phục vụ",
  },
  Cho_thanh_toan: {
    card: "bg-amber-50 border-amber-300 cursor-not-allowed",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "Chờ thanh toán",
  },
};

function TableMapPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [openTarget, setOpenTarget] = useState(null); // bàn Trống đang chờ xác nhận mở
  const [qrTarget, setQrTarget] = useState(null); // bàn đang xem/in mã QR gọi món
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const loadTables = async () => {
    try {
      setTables(await getTablesMap());
    } catch (err) {
      setFeedback({ type: "error", text: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTables();
      setLoading(false);
    };
    init();

    timerRef.current = setInterval(loadTables, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleClickTable = (b) => {
    // Bàn đã gửi yêu cầu thanh toán -> khoá, không cho gọi thêm món cho tới khi
    // thu ngân xử lý xong (tránh tạo hóa đơn mới/nhầm lẫn trong lúc chờ)
    if (
      b.trang_thai === "Dang_su_dung" &&
      b.trang_thai_hoa_don === "Cho_thanh_toan"
    ) {
      setFeedback({
        type: "error",
        text: `${b.ten_ban} đang chờ thu ngân xử lý thanh toán, chưa thể gọi thêm món.`,
      });
      return;
    }
    // Bàn đang phục vụ -> vào trang gọi món
    if (b.trang_thai === "Dang_su_dung") {
      navigate(`/server/order/${b.ma_ban}`);
      return;
    }
    // Bàn trống -> yêu cầu xác nhận mở bàn
    if (b.trang_thai === "Trong") {
      setOpenTarget(b);
    }
  };

  const confirmOpenTable = async () => {
    const target = openTarget;
    await openTable(target.ma_ban);
    setFeedback({ type: "success", text: `Đã mở ${target.ten_ban}` });
    setOpenTarget(null);
    await loadTables();
    // Sau khi mở thành công -> chuyển thẳng sang trang gọi món
    navigate(`/server/order/${target.ma_ban}`);
  };

  // Nhóm bàn theo khu vực để hiển thị
  const grouped = tables.reduce((acc, b) => {
    (acc[b.ten_khu_vuc] ??= []).push(b);
    return acc;
  }, {});

  const soTrong = tables.filter((b) => b.trang_thai === "Trong").length;
  const soChoThanhToan = tables.filter(
    (b) => b.trang_thai_hoa_don === "Cho_thanh_toan",
  ).length;
  const soDangPhucVu =
    tables.filter((b) => b.trang_thai === "Dang_su_dung").length -
    soChoThanhToan;

  if (loading)
    return <p className="text-sm text-stone-500">Đang tải sơ đồ bàn...</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Sơ đồ bàn</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Bấm bàn Trống để mở phục vụ. Bấm bàn Đang phục vụ để gọi món.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-500">Trống</span>
            <span className="font-semibold text-stone-800">{soTrong}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="text-stone-500">Đang phục vụ</span>
            <span className="font-semibold text-stone-800">{soDangPhucVu}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-stone-500">Chờ thanh toán</span>
            <span className="font-semibold text-stone-800">
              {soChoThanhToan}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={
            "mb-4 px-4 py-2 rounded-lg border text-sm " +
            (feedback.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700")
          }
        >
          {feedback.text}
        </div>
      )}

      {tables.length === 0 && (
        <p className="text-sm text-stone-400">
          Chưa có bàn nào được thiết lập.
        </p>
      )}

      {Object.entries(grouped).map(([khuVuc, list]) => (
        <div key={khuVuc} className="mb-6">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            {khuVuc}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {list.map((b) => (
              <TableCard
                key={b.ma_ban}
                ban={b}
                onClick={handleClickTable}
                onShowQr={setQrTarget}
              />
            ))}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!openTarget}
        title="Mở bàn"
        description={
          openTarget ? `Xác nhận mở "${openTarget.ten_ban}" để đón khách?` : ""
        }
        confirmText="Mở bàn"
        onConfirm={confirmOpenTable}
        onClose={() => setOpenTarget(null)}
      />

      <Modal
        open={!!qrTarget}
        onClose={() => setQrTarget(null)}
        title={
          qrTarget ? `Mã QR gọi món - ${qrTarget.ten_ban}` : "Mã QR gọi món"
        }
      >
        {qrTarget && <TableQrContent ban={qrTarget} />}
      </Modal>
    </div>
  );
}

// Tách 1 ô bàn ra thành component nhỏ
function TableCard({ ban, onClick, onShowQr }) {
  const trangThaiHienThi =
    ban.trang_thai === "Dang_su_dung" &&
    ban.trang_thai_hoa_don === "Cho_thanh_toan"
      ? "Cho_thanh_toan"
      : ban.trang_thai;
  const style = STATUS_STYLE[trangThaiHienThi] || STATUS_STYLE.Trong;
  return (
    <div
      className={`relative rounded-xl border-2 transition-all ${style.card}`}
    >
      <button
        onClick={() => onClick(ban)}
        className="w-full p-4 text-left active:scale-95 transition-all"
      >
        <div className="flex items-center gap-1.5 pr-6">
          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}></span>
          <span className="font-bold text-stone-800 truncate">
            {ban.ten_ban}
          </span>
        </div>
        <div className="text-xs text-stone-500 mt-1">{ban.so_ghe} ghế</div>
        <div className={`text-xs font-medium mt-2 ${style.text}`}>
          {style.label}
        </div>
      </button>

      {ban.qr_code_dinh_danh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowQr(ban);
          }}
          title="Xem / in mã QR gọi món"
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-white hover:text-teal-600"
        >
          <QrCode className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Nội dung modal xem/in mã QR — mỗi bàn có 1 mã QR cố định (dán bàn)
function TableQrContent({ ban }) {
  const qrUrl = `${window.location.origin}/qr/${ban.qr_code_dinh_danh}`;
  return (
    <div>
      <div id="printable-qr" className="flex flex-col items-center gap-3 py-2">
        <div className="rounded-xl border border-stone-200 p-4">
          <QRCodeSVG value={qrUrl} size={200} />
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone-800">{ban.ten_ban}</div>
          <div className="text-xs text-stone-500">{ban.ten_khu_vuc}</div>
          <div className="text-xs text-stone-400 mt-1">
            Quét mã để xem thực đơn và gọi món
          </div>
        </div>
      </div>
      <button
        onClick={() => window.print()}
        className="w-full mt-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
      >
        🖨 In mã QR
      </button>
    </div>
  );
}

export default TableMapPage;
