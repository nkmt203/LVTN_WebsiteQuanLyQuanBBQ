import { useState, useEffect } from "react";
import { Package, CircleCheck, CirclePause, Plus } from "lucide-react";
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
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function IngredientPage() {
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, hoatDong: 0, ngungSuDung: 0 });

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

  // Popup xác nhận
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

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
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, hoatDong, ngungSuDung] = await Promise.all([
        getAllIngredients({ limit: 1 }),
        getAllIngredients({ trang_thai: "Hoat_dong", limit: 1 }),
        getAllIngredients({ trang_thai: "Ngung_su_dung", limit: 1 }),
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
      // Tải danh sách đơn vị tính cho dropdown (lấy tất cả, không phân trang)
      try {
        const resp = await getAllUnits({ trang_thai: "Dang_dung", limit: 100 });
        setUnits(Array.isArray(resp.data) ? resp.data : []);
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

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createIngredient({ ten_nguyen_lieu: tenNL, ma_don_vi_tinh: Number(maDVT) });
      setMessage("✅ " + r.message);
      closeForm();
      await Promise.all([loadData(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateIngredient(editingId, {
      ten_nguyen_lieu: tenNL,
      ma_don_vi_tinh: Number(maDVT),
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
  function askToggleStatus(nl) {
    setToggleTarget(nl);
  }
  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Hoat_dong" ? "Ngung_su_dung" : "Hoat_dong";
    const r = await updateIngredientStatus(toggleTarget.ma_nguyen_lieu, next);
    setMessage("✅ " + r.message);
    setToggleTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  // Xóa (popup xác nhận)
  function askDelete(nl) {
    setDeleteTarget(nl);
  }
  async function confirmDelete() {
    const r = await deleteIngredient(deleteTarget.ma_nguyen_lieu);
    setMessage("✅ " + r.message);
    setDeleteTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">
          Quản lý Nguyên liệu
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thêm, sửa, đổi trạng thái và xóa nguyên liệu trong hệ thống.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số nguyên liệu"
          value={stats.total}
          icon={Package}
          color="blue"
        />
        <StatCard
          label="Đang hoạt động"
          value={stats.hoatDong}
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
          <h3 className="text-sm font-bold text-stone-800">Danh sách nguyên liệu</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm nguyên liệu
          </button>
        </div>

        <div className="border-b border-stone-100">
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
        </div>

        <div key={page} className="animate-fade-in">
          <IngredientTable
            ingredients={ingredients}
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
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa nguyên liệu"
        description={
          deleteTarget &&
          `Xác nhận xóa nguyên liệu "${deleteTarget.ten_nguyen_lieu}"? Hành động này không thể hoàn tác.`
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
            ? "Ngừng sử dụng nguyên liệu"
            : "Kích hoạt nguyên liệu"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Hoat_dong"
            ? `Ngừng sử dụng nguyên liệu "${toggleTarget.ten_nguyen_lieu}"?`
            : `Kích hoạt lại nguyên liệu "${toggleTarget.ten_nguyen_lieu}"?`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Hoat_dong" ? "Ngừng SD" : "Kích hoạt"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật nguyên liệu"
        description={`Xác nhận lưu thay đổi cho nguyên liệu "${tenNL}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default IngredientPage;
