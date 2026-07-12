import { useState, useEffect } from "react";
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  updateIngredientStatus,
  deleteIngredient,
} from "../../api/ingredientApi";
import { getAllUnits } from "../../api/unitApi";
import IngredientForm from "../../components/ingredient/IngredientForm";
import IngredientTable from "../../components/ingredient/IngredientTable";
import IngredientFilterBar from "../../components/ingredient/IngredientFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";

const PER_PAGE = 10;

function IngredientPage() {
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [keyword, setKeyword] = useState("");
  const [donViTinh, setDonViTinh] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenNL, setTenNL] = useState("");
  const [maDVT, setMaDVT] = useState("");

  async function loadData(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const dvt = opts.donViTinh ?? donViTinh;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllIngredients({
        keyword: kw,
        ma_don_vi_tinh: dvt,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setIngredients(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  useEffect(() => {
    async function init() {
      // Tải danh sách đơn vị tính cho dropdown (lấy tất cả, không phân trang)
      try {
        const resp = await getAllUnits({ limit: 100 });
        setUnits(Array.isArray(resp.data) ? resp.data : []);
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
    setDonViTinh("");
    setTrangThai("");
    loadData({ p: 1, keyword: "", donViTinh: "", trangThai: "" });
  }
  function handlePageChange(p) {
    loadData({ p });
  }

  function clearForm() {
    setEditingId(null);
    setTenNL("");
    setMaDVT("");
  }
  function openAdd() {
    clearForm();
    setFormOpen(true);
  }
  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(nl) {
    setEditingId(nl.ma_nguyen_lieu);
    setTenNL(nl.ten_nguyen_lieu);
    setMaDVT(String(nl.ma_don_vi_tinh));
    setFormOpen(true);
  }

  async function handleSave() {
    const payload = { ten_nguyen_lieu: tenNL, ma_don_vi_tinh: Number(maDVT) };
    try {
      if (editingId === null) {
        const r = await createIngredient(payload);
        setMessage("✅ " + r.message);
      } else {
        const r = await updateIngredient(editingId, payload);
        setMessage("✅ " + r.message);
      }
      closeForm();
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  async function handleToggleStatus(nl) {
    const next = nl.trang_thai === "Hoat_dong" ? "Ngung_su_dung" : "Hoat_dong";
    try {
      const r = await updateIngredientStatus(nl.ma_nguyen_lieu, next);
      setMessage("✅ " + r.message);
      await loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Xác nhận xóa nguyên liệu này?")) return;
    try {
      const r = await deleteIngredient(id);
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
            Quản lý Nguyên liệu
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Thêm, sửa, đổi trạng thái và xóa nguyên liệu trong hệ thống.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"
        >
          + Thêm nguyên liệu
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <IngredientFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        donViTinh={donViTinh}
        setDonViTinh={setDonViTinh}
        trangThai={trangThai}
        setTrangThai={setTrangThai}
        units={units}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <IngredientTable
        ingredients={ingredients}
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
            ? "Thêm nguyên liệu"
            : `Sửa nguyên liệu #${editingId}`
        }
      >
        <IngredientForm
          editingId={editingId}
          tenNL={tenNL}
          setTenNL={setTenNL}
          maDVT={maDVT}
          setMaDVT={setMaDVT}
          units={units}
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

export default IngredientPage;
