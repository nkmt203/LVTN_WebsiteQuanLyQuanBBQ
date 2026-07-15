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
import { getErrorMessage } from "../../api/errorHandler";
// ...

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

  async function handleSave() {
    const payload = { ten_don_vi_tinh: tenDVT, trang_thai: formTrangThai };
    try {
      if (editingId === null) {
        const r = await createUnit(payload);
        setMessage("✅ " + r.message);
      } else {
        const r = await updateUnit(editingId, payload);
        setMessage("✅ " + r.message);
      }
      closeForm();
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Xác nhận xóa đơn vị tính này?")) return;
    try {
      const r = await deleteUnit(id);
      setMessage("✅ " + r.message);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản lý Đơn vị tính
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Thêm, sửa và xóa các đơn vị tính dùng cho nguyên liệu.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
        >
          + Thêm đơn vị tính
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
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

      <UnitTable units={units} onEdit={handleEdit} onDelete={handleDelete} />

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
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

export default UnitPage;
