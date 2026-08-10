import { useState, useEffect } from "react";
import { Truck, CircleCheck, CirclePause, Plus } from "lucide-react";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
} from "../../api/supplierApi";
import SupplierForm from "../../components/supplier/SupplierForm";
import SupplierTable from "../../components/supplier/SupplierTable";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";

import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, hoatDong: 0, ngungHopTac: 0 });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenNCC, setTenNCC] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  // Popup xác nhận
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  async function loadData(opts = {}) {
    const p = opts.p ?? page;

    try {
      const resp = await getAllSuppliers({
        page: p,
        limit: PER_PAGE,
      });
      setSuppliers(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, hoatDong, ngungHopTac] = await Promise.all([
        getAllSuppliers({ limit: 1 }),
        getAllSuppliers({ trang_thai: "Hoat_dong", limit: 1 }),
        getAllSuppliers({ trang_thai: "Ngung_hop_tac", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        hoatDong: hoatDong.total || 0,
        ngungHopTac: ngungHopTac.total || 0,
      });
    } catch {
      // bỏ qua lỗi thống kê, không ảnh hưởng danh sách chính
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([loadData({ p: 1 }), loadStats()]);
      setLoading(false);
    }
    init();
  }, []);

  function handlePageChange(p) {
    loadData({ p });
  }

  function clearForm() {
    setEditingId(null);
    setTenNCC("");
    setSoDienThoai("");
    setDiaChi("");
    setGhiChu("");
  }
  function openAdd() {
    clearForm();
    setFormOpen(true);
  }
  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(ncc) {
    setEditingId(ncc.ma_nha_cung_cap);
    setTenNCC(ncc.ten_nha_cung_cap);
    setSoDienThoai(ncc.so_dien_thoai);
    setDiaChi(ncc.dia_chi || "");
    setGhiChu(ncc.ghi_chu || "");
    setFormOpen(true);
  }

  function buildSupplierPayload() {
    return {
      ten_nha_cung_cap: tenNCC,
      so_dien_thoai: soDienThoai,
      dia_chi: diaChi,
      ghi_chu: ghiChu,
    };
  }

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createSupplier(buildSupplierPayload());
      setMessage("✅ " + r.message);
      closeForm();
      await Promise.all([loadData(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateSupplier(editingId, buildSupplierPayload());
    setMessage("✅ " + r.message);
    setConfirmUpdateOpen(false);
    closeForm();
    await Promise.all([loadData(), loadStats()]);
  }

  function requestSave() {
    if (editingId === null) {
      doCreate();
    } else {
      setConfirmUpdateOpen(true);
    }
  }

  // Đổi trạng thái (popup xác nhận)
  function askToggleStatus(ncc) {
    setToggleTarget(ncc);
  }
  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Hoat_dong" ? "Ngung_hop_tac" : "Hoat_dong";
    const r = await updateSupplierStatus(toggleTarget.ma_nha_cung_cap, next);
    setMessage("✅ " + r.message);
    setToggleTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Nhà cung cấp</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Danh mục nhà cung cấp dùng khi lập phiếu nhập kho.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số nhà cung cấp"
          value={stats.total}
          icon={Truck}
          color="blue"
        />
        <StatCard
          label="Đang hợp tác"
          value={stats.hoatDong}
          icon={CircleCheck}
          color="emerald"
        />
        <StatCard
          label="Ngừng hợp tác"
          value={stats.ngungHopTac}
          icon={CirclePause}
          color="amber"
        />
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">Danh sách nhà cung cấp</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm nhà cung cấp
          </button>
        </div>

        <div key={page} className="animate-fade-in">
          <SupplierTable
            suppliers={suppliers}
            onEdit={handleEdit}
            onToggleStatus={askToggleStatus}
          />
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 px-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingId === null ? "Thêm nhà cung cấp mới" : `Sửa nhà cung cấp #${editingId}`}
      >
        <SupplierForm
          editingId={editingId}
          tenNCC={tenNCC}
          setTenNCC={setTenNCC}
          soDienThoai={soDienThoai}
          setSoDienThoai={setSoDienThoai}
          diaChi={diaChi}
          setDiaChi={setDiaChi}
          ghiChu={ghiChu}
          setGhiChu={setGhiChu}
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={toggleTarget !== null}
        title={
          toggleTarget?.trang_thai === "Hoat_dong"
            ? "Ngừng hợp tác"
            : "Kích hoạt nhà cung cấp"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Hoat_dong"
            ? `Ngừng hợp tác với nhà cung cấp "${toggleTarget.ten_nha_cung_cap}"? Nhà cung cấp sẽ ẩn khỏi danh sách chọn khi lập phiếu nhập kho.`
            : `Kích hoạt lại nhà cung cấp "${toggleTarget.ten_nha_cung_cap}"?`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Hoat_dong" ? "Ngừng hợp tác" : "Kích hoạt"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật nhà cung cấp"
        description={`Xác nhận lưu thay đổi cho nhà cung cấp "${tenNCC}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default SupplierPage;
