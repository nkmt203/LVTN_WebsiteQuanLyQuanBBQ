import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../../api/categoryApi";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryTable from "../../components/category/CategoryTable";
import CategoryFilterBar from "../../components/category/CategoryFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";

import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 7;

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState("");

  async function loadData(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllCategories({
        keyword: kw,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setCategories(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      // ...
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
    setTenDanhMuc("");
    setMoTa("");
  }
  function openAdd() {
    clearForm();
    setFormOpen(true);
  }
  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(dm) {
    setEditingId(dm.ma_danh_muc);
    setTenDanhMuc(dm.ten_danh_muc);
    setMoTa(dm.mo_ta || "");
    setFormOpen(true);
  }

  async function handleSave() {
    const payload = { ten_danh_muc: tenDanhMuc, mo_ta: moTa };
    try {
      if (editingId === null) {
        const r = await createCategory(payload);
        setMessage("✅ " + r.message);
      } else {
        const r = await updateCategory(editingId, payload);
        setMessage("✅ " + r.message);
      }
      closeForm();
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  async function handleToggleStatus(dm) {
    const next =
      dm.trang_thai === "Dang_su_dung" ? "Ngung_su_dung" : "Dang_su_dung";
    try {
      const r = await updateCategoryStatus(dm.ma_danh_muc, next);
      setMessage("✅ " + r.message);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Xác nhận xóa danh mục này?")) return;
    try {
      const r = await deleteCategory(id);
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
          <h2 className="text-xl font-bold text-slate-800">Quản lý Danh mục</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Thêm, sửa, đổi trạng thái và xóa danh mục thực đơn.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
        >
          + Thêm danh mục
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <CategoryFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        trangThai={trangThai}
        setTrangThai={setTrangThai}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        title={
          editingId === null
            ? "Thêm danh mục mới"
            : `Sửa danh mục #${editingId}`
        }
      >
        <CategoryForm
          editingId={editingId}
          tenDanhMuc={tenDanhMuc}
          setTenDanhMuc={setTenDanhMuc}
          moTa={moTa}
          setMoTa={setMoTa}
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

export default CategoryPage;
