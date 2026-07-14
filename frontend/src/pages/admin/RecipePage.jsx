import { useState, useEffect } from "react";
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

const PER_PAGE = 10;

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
      setMessage("❌ " + err.message);
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

  // === THÊM (nhiều dòng) ===
  async function handleAdd(payload) {
    try {
      const r = await createRecipes(payload);
      setMessage("✅ " + r.message);
      setAddOpen(false);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  // === SỬA (1 dòng) ===
  function handleEditClick(r) {
    setEditingId(r.ma_dinh_muc);
    setEditTenNL(r.ten_nguyen_lieu);
    setEditDVT(r.ten_don_vi_tinh);
    setEditSL(String(r.so_luong_su_dung));
    setEditGhiChu(r.ghi_chu || "");
    setEditOpen(true);
  }

  async function handleEditSave() {
    try {
      const r = await updateRecipe(editingId, {
        so_luong_su_dung: Number(editSL),
        ghi_chu: editGhiChu,
      });
      setMessage("✅ " + r.message);
      setEditOpen(false);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  // === ĐỔI TRẠNG THÁI ===
  async function handleToggleStatus(r) {
    const next = r.trang_thai === "Hoat_dong" ? "Ngung_su_dung" : "Hoat_dong";
    try {
      const res = await updateRecipeStatus(r.ma_dinh_muc, next);
      setMessage("✅ " + res.message);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  // === XÓA ===
  async function handleDelete(id) {
    if (!window.confirm("Xác nhận xóa dòng định mức này?")) return;
    try {
      const r = await deleteRecipe(id);
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
            Quản lý Định mức nguyên liệu
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Thiết lập công thức nguyên liệu cho từng món ăn.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
        >
          + Thiết lập định mức
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <RecipeFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        trangThai={trangThai}
        setTrangThai={setTrangThai}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <RecipeTable
        recipes={recipes}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />

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
          onSave={handleEditSave}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default RecipePage;
