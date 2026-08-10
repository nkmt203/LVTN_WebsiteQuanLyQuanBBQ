import { useState, useEffect } from "react";
import { Layers, CircleCheck, CirclePause, Plus } from "lucide-react";
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
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";

import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 7;

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, dangSuDung: 0, ngungSuDung: 0 });

  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState("");

  // Popup xác nhận
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

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
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, dangSuDung, ngungSuDung] = await Promise.all([
        getAllCategories({ limit: 1 }),
        getAllCategories({ trang_thai: "Dang_su_dung", limit: 1 }),
        getAllCategories({ trang_thai: "Ngung_su_dung", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        dangSuDung: dangSuDung.total || 0,
        ngungSuDung: ngungSuDung.total || 0,
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

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createCategory({ ten_danh_muc: tenDanhMuc, mo_ta: moTa });
      setMessage("✅ " + r.message);
      closeForm();
      await Promise.all([loadData(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateCategory(editingId, {
      ten_danh_muc: tenDanhMuc,
      mo_ta: moTa,
    });
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
  function askToggleStatus(dm) {
    setToggleTarget(dm);
  }
  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Dang_su_dung"
        ? "Ngung_su_dung"
        : "Dang_su_dung";
    const r = await updateCategoryStatus(toggleTarget.ma_danh_muc, next);
    setMessage("✅ " + r.message);
    setToggleTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  // Xóa (popup xác nhận)
  function askDelete(dm) {
    setDeleteTarget(dm);
  }
  async function confirmDelete() {
    const r = await deleteCategory(deleteTarget.ma_danh_muc);
    setMessage("✅ " + r.message);
    setDeleteTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Danh mục</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thêm, sửa, đổi trạng thái và xóa danh mục thực đơn.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số danh mục"
          value={stats.total}
          icon={Layers}
          color="blue"
        />
        <StatCard
          label="Đang sử dụng"
          value={stats.dangSuDung}
          icon={CircleCheck}
          color="emerald"
        />
        <StatCard
          label="Ngừng sử dụng"
          value={stats.ngungSuDung}
          icon={CirclePause}
          color="amber"
        />
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">Danh sách danh mục</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm danh mục
          </button>
        </div>

        <div className="border-b border-stone-100">
          <CategoryFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            trangThai={trangThai}
            setTrangThai={setTrangThai}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={askDelete}
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
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa danh mục"
        description={
          deleteTarget &&
          `Xác nhận xóa danh mục "${deleteTarget.ten_danh_muc}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={toggleTarget !== null}
        title={
          toggleTarget?.trang_thai === "Dang_su_dung"
            ? "Ngừng sử dụng danh mục"
            : "Kích hoạt danh mục"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Dang_su_dung"
            ? `Ngừng sử dụng danh mục "${toggleTarget.ten_danh_muc}"?`
            : `Kích hoạt lại danh mục "${toggleTarget.ten_danh_muc}"?`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Dang_su_dung" ? "Ngừng SD" : "Kích hoạt"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật danh mục"
        description={`Xác nhận lưu thay đổi cho danh mục "${tenDanhMuc}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default CategoryPage;
