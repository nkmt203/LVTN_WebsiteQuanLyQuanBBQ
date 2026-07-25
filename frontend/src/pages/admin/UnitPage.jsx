import { useState, useEffect } from "react";
import {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../api/unitApi";
import UnitForm from "../../components/unit/UnitForm";
import UnitTable from "../../components/unit/UnitTable";
import UnitFilterBar from "../../components/unit/UnitFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 8;

function UnitPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenDVT, setTenDVT] = useState("");
  const [formTrangThai, setFormTrangThai] = useState("Dang_dung");

  // Popup xác nhận
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  async function loadData(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllUnits({
        keyword: kw,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setUnits(Array.isArray(resp.data) ? resp.data : []);
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

  function handleSearch() {
    loadData({ p: 1 });
  }
  function handleReset() {
    setKeyword("");
    setTrangThai("");
    loadData({ p: 1, keyword: "", trangThai: "" });
  }
  function handlePageChange(p) {
    loadData({ p });
  }

  function clearForm() {
    setEditingId(null);
    setTenDVT("");
    setFormTrangThai("Dang_dung");
  }
  function openAdd() {
    clearForm();
    setFormOpen(true);
  }
  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(dvt) {
    setEditingId(dvt.ma_don_vi_tinh);
    setTenDVT(dvt.ten_don_vi_tinh);
    setFormTrangThai(dvt.trang_thai);
    setFormOpen(true);
  }

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createUnit({ ten_don_vi_tinh: tenDVT, trang_thai: formTrangThai });
      setMessage("✅ " + r.message);
      closeForm();
      await loadData();
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateUnit(editingId, {
      ten_don_vi_tinh: tenDVT,
      trang_thai: formTrangThai,
    });
    setMessage("✅ " + r.message);
    setConfirmUpdateOpen(false);
    closeForm();
    await loadData();
  }

  function requestSave() {
    if (editingId === null) {
      doCreate();
    } else {
      setConfirmUpdateOpen(true);
    }
  }

  // Xóa (popup xác nhận)
  function askDelete(dvt) {
    setDeleteTarget(dvt);
  }
  async function confirmDelete() {
    const r = await deleteUnit(deleteTarget.ma_don_vi_tinh);
    setMessage("✅ " + r.message);
    setDeleteTarget(null);
    await loadData();
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  const isError = message.startsWith("❌");

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-800">
            Quản lý Đơn vị tính
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Thêm, sửa và xóa các đơn vị tính dùng cho nguyên liệu.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Thêm đơn vị tính
        </button>
      </div>

      {message && (
        <div
          className={
            "mb-4 px-4 py-2 rounded-lg border text-sm " +
            (isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700")
          }
        >
          {message}
        </div>
      )}

      <UnitFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        trangThai={trangThai}
        setTrangThai={setTrangThai}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <UnitTable units={units} onEdit={handleEdit} onDelete={askDelete} />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={
          editingId === null
            ? "Thêm đơn vị tính"
            : `Sửa đơn vị tính #${editingId}`
        }
      >
        <UnitForm
          editingId={editingId}
          tenDVT={tenDVT}
          setTenDVT={setTenDVT}
          trangThai={formTrangThai}
          setTrangThai={setFormTrangThai}
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa đơn vị tính"
        description={
          deleteTarget &&
          `Xác nhận xóa đơn vị tính "${deleteTarget.ten_don_vi_tinh}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật đơn vị tính"
        description={`Xác nhận lưu thay đổi cho đơn vị tính "${tenDVT}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default UnitPage;
