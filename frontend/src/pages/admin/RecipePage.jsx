import { useState, useEffect } from "react";
import { ClipboardList, CircleCheck, CirclePause, Plus } from "lucide-react";
import {
  getAllRecipes,
  createRecipes,
  updateRecipe,
  updateRecipeStatus,
  deleteRecipe,
} from "../../api/recipeApi";
import { getAllFood } from "../../api/foodApi";
import { getAllIngredients } from "../../api/ingredientApi";
import RecipeAddForm from "../../components/recipe/RecipeAddForm";
import RecipeEditForm from "../../components/recipe/RecipeEditForm";
import RecipeTable from "../../components/recipe/RecipeTable";
import RecipeFilterBar from "../../components/recipe/RecipeFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";

import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, hoatDong: 0, ngungSuDung: 0 });

  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal thêm
  const [addOpen, setAddOpen] = useState(false);
  // Modal sửa
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTenNL, setEditTenNL] = useState("");
  const [editDVT, setEditDVT] = useState("");
  const [editSL, setEditSL] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  // Popup xác nhận
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  async function loadData(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllRecipes({
        keyword: kw,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setRecipes(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, hoatDong, ngungSuDung] = await Promise.all([
        getAllRecipes({ limit: 1 }),
        getAllRecipes({ trang_thai: "Hoat_dong", limit: 1 }),
        getAllRecipes({ trang_thai: "Ngung_su_dung", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        hoatDong: hoatDong.total || 0,
        ngungSuDung: ngungSuDung.total || 0,
      });
    } catch {
      // bỏ qua lỗi thống kê, không ảnh hưởng danh sách chính
    }
  }

  useEffect(() => {
    async function init() {
      // Tải dropdown: món ăn + nguyên liệu (lấy hết, không phân trang)
      try {
        const fResp = await getAllFood({
          trang_thai: "Dang_kinh_doanh",
          limit: 200,
        });
        setFoods(Array.isArray(fResp.data) ? fResp.data : []);
      } catch {}
      try {
        const iResp = await getAllIngredients({
          trang_thai: "Hoat_dong",
          limit: 200,
        });
        setIngredients(Array.isArray(iResp.data) ? iResp.data : []);
      } catch {}
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

  // === THÊM (nhiều dòng): lưu trực tiếp ===
  async function handleAdd(payload) {
    try {
      const r = await createRecipes(payload);
      setMessage("✅ " + r.message);
      setAddOpen(false);
      await Promise.all([loadData(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // === SỬA (1 dòng): qua popup xác nhận ===
  function handleEditClick(r) {
    setEditingId(r.ma_dinh_muc);
    setEditTenNL(r.ten_nguyen_lieu);
    setEditDVT(r.ten_don_vi_tinh);
    setEditSL(String(r.so_luong_su_dung));
    setEditGhiChu(r.ghi_chu || "");
    setEditOpen(true);
  }

  function requestEditSave() {
    setConfirmUpdateOpen(true);
  }

  async function doUpdate() {
    const r = await updateRecipe(editingId, {
      so_luong_su_dung: Number(editSL),
      ghi_chu: editGhiChu,
    });
    setMessage("✅ " + r.message);
    setConfirmUpdateOpen(false);
    setEditOpen(false);
    await Promise.all([loadData(), loadStats()]);
  }

  // === ĐỔI TRẠNG THÁI (popup xác nhận) ===
  function askToggleStatus(r) {
    setToggleTarget(r);
  }
  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Hoat_dong" ? "Ngung_su_dung" : "Hoat_dong";
    const res = await updateRecipeStatus(toggleTarget.ma_dinh_muc, next);
    setMessage("✅ " + res.message);
    setToggleTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  // === XÓA (popup xác nhận) ===
  function askDelete(r) {
    setDeleteTarget(r);
  }
  async function confirmDelete() {
    const r = await deleteRecipe(deleteTarget.ma_dinh_muc);
    setMessage("✅ " + r.message);
    setDeleteTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Định mức nguyên liệu</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thiết lập công thức nguyên liệu cho từng món ăn.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số định mức"
          value={stats.total}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          label="Đang áp dụng"
          value={stats.hoatDong}
          icon={CircleCheck}
          color="emerald"
        />
        <StatCard
          label="Ngừng áp dụng"
          value={stats.ngungSuDung}
          icon={CirclePause}
          color="amber"
        />
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">Danh sách định mức nguyên liệu</h3>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thiết lập định mức
          </button>
        </div>

        <div className="border-b border-stone-100">
          <RecipeFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            trangThai={trangThai}
            setTrangThai={setTrangThai}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <RecipeTable
            recipes={recipes}
            onEdit={handleEditClick}
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

      {/* Modal THÊM (nhiều dòng) */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Thiết lập định mức nguyên liệu"
      >
        <RecipeAddForm
          foods={foods}
          ingredients={ingredients}
          onSave={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      {/* Modal SỬA (1 dòng) */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Cập nhật định mức #${editingId}`}
      >
        <RecipeEditForm
          tenNL={editTenNL}
          donViTinh={editDVT}
          soLuong={editSL}
          setSoLuong={setEditSL}
          ghiChu={editGhiChu}
          setGhiChu={setEditGhiChu}
          onSave={requestEditSave}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa định mức"
        description={
          deleteTarget &&
          `Xác nhận xóa định mức "${deleteTarget.ten_nguyen_lieu}" của món "${deleteTarget.ten_mon_an}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={toggleTarget !== null}
        title={
          toggleTarget?.trang_thai === "Hoat_dong"
            ? "Ngừng sử dụng định mức"
            : "Kích hoạt định mức"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Hoat_dong"
            ? `Ngừng sử dụng định mức "${toggleTarget.ten_nguyen_lieu}" của món "${toggleTarget.ten_mon_an}"?`
            : `Kích hoạt lại định mức "${toggleTarget.ten_nguyen_lieu}" của món "${toggleTarget.ten_mon_an}"?`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Hoat_dong" ? "Ngừng SD" : "Kích hoạt"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật định mức"
        description={`Xác nhận lưu thay đổi định mức nguyên liệu "${editTenNL}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default RecipePage;
