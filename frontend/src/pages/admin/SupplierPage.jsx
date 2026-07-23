import { useState, useEffect } from "react";
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

import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenNCC, setTenNCC] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [ghiChu, setGhiChu] = useState("");

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

  useEffect(() => {
    async function init() {
      await loadData({ p: 1 });
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

  async function handleSave() {
    const payload = {
      ten_nha_cung_cap: tenNCC,
      so_dien_thoai: soDienThoai,
      dia_chi: diaChi,
      ghi_chu: ghiChu,
    };
    try {
      if (editingId === null) {
        const r = await createSupplier(payload);
        setMessage("✅ " + r.message);
      } else {
        const r = await updateSupplier(editingId, payload);
        setMessage("✅ " + r.message);
      }
      closeForm();
      await loadData();
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function handleToggleStatus(ncc) {
    const next = ncc.trang_thai === "Hoat_dong" ? "Ngung_hop_tac" : "Hoat_dong";
    try {
      const r = await updateSupplierStatus(ncc.ma_nha_cung_cap, next);
      setMessage("✅ " + r.message);
      await loadData();
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Nhà cung cấp</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Danh mục nhà cung cấp dùng khi lập phiếu nhập kho.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
        >
          + Thêm nhà cung cấp
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />

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
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

export default SupplierPage;
