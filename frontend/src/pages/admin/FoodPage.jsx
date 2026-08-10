import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  CircleCheck,
  CirclePause,
  Tag,
  Plus,
} from "lucide-react";
import {
  getAllFood,
  createFood,
  updateFood,
  updateFoodStatus,
  deleteFood,
} from "../../api/foodApi";
import { getAllCategories } from "../../api/categoryApi";
import FoodForm from "../../components/food/FoodForm";
import FoodTable from "../../components/food/FoodTable";
import FoodFilterBar from "../../components/food/FoodFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";

import { getErrorMessage } from "../../api/errorHandler";
const PER_PAGE = 10;

function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Thẻ thống kê
  const [stats, setStats] = useState({
    total: 0,
    dangKinhDoanh: 0,
    tamNgung: 0,
  });

  // Bộ lọc
  const [keyword, setKeyword] = useState("");
  const [danhMuc, setDanhMuc] = useState("");
  const [trangThai, setTrangThai] = useState("");

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal form
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenMon, setTenMon] = useState("");
  const [maDanhMuc, setMaDanhMuc] = useState("");
  const [giaBan, setGiaBan] = useState("");
  const [moTa, setMoTa] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  // Xoá món (popup xác nhận)
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Đổi trạng thái kinh doanh (popup xác nhận)
  const [toggleTarget, setToggleTarget] = useState(null);

  // Cập nhật món (popup xác nhận)
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  // === TẢI DỮ LIỆU ===
  async function loadFoods(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const dm = opts.danhMuc ?? danhMuc;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllFood({
        keyword: kw,
        ma_danh_muc: dm,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setFoods(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, dangKinhDoanh, tamNgung] = await Promise.all([
        getAllFood({ limit: 1 }),
        getAllFood({ trang_thai: "Dang_kinh_doanh", limit: 1 }),
        getAllFood({ trang_thai: "Tam_ngung", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        dangKinhDoanh: dangKinhDoanh.total || 0,
        tamNgung: tamNgung.total || 0,
      });
    } catch {
      // bỏ qua lỗi thống kê, không ảnh hưởng danh sách chính
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const resp = await getAllCategories({
          trang_thai: "Dang_su_dung",
          limit: 100,
        });
        setCategories(Array.isArray(resp.data) ? resp.data : []);
      } catch {}
      await Promise.all([loadFoods({ p: 1 }), loadStats()]);
      setLoading(false);
    }
    init();
  }, []);

  // === TÌM KIẾM & PHÂN TRANG ===
  function handleSearch() {
    loadFoods({ p: 1 });
  }
  function handleReset() {
    setKeyword("");
    setDanhMuc("");
    setTrangThai("");
    loadFoods({ p: 1, keyword: "", danhMuc: "", trangThai: "" });
  }
  function handlePageChange(p) {
    loadFoods({ p });
  }

  // === FORM MODAL ===
  function clearForm() {
    setEditingId(null);
    setTenMon("");
    setMaDanhMuc("");
    setGiaBan("");
    setMoTa("");
    setImageFile(null);
    setExistingImageUrl(null);
    const el = document.getElementById("food-image-input");
    if (el) el.value = "";
  }

  function openAdd() {
    clearForm();
    setFormOpen(true);
  }

  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(mon) {
    setEditingId(mon.ma_mon_an);
    setTenMon(mon.ten_mon_an);
    setMaDanhMuc(String(mon.ma_danh_muc));
    setGiaBan(String(mon.gia_ban));
    setMoTa(mon.mo_ta || "");
    setImageFile(null);
    setExistingImageUrl(mon.hinh_anh_url || null);
    const el = document.getElementById("food-image-input");
    if (el) el.value = "";
    setFormOpen(true);
  }

  function buildFoodFormData() {
    const fd = new FormData();
    fd.append("ten_mon_an", tenMon);
    fd.append("ma_danh_muc", maDanhMuc);
    fd.append("gia_ban", giaBan);
    fd.append("mo_ta", moTa);
    if (imageFile) fd.append("hinh_anh", imageFile);
    return fd;
  }

  // Thêm mới: lưu trực tiếp, không cần popup xác nhận
  async function doCreate() {
    try {
      const r = await createFood(buildFoodFormData());
      setMessage("✅ " + r.message);
      closeForm();
      await Promise.all([loadFoods(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateFood(editingId, buildFoodFormData());
    setMessage("✅ " + r.message);
    setConfirmUpdateOpen(false);
    closeForm();
    await Promise.all([loadFoods(), loadStats()]);
  }

  function requestSave() {
    if (editingId === null) {
      doCreate();
    } else {
      setConfirmUpdateOpen(true);
    }
  }

  // === ĐỔI TRẠNG THÁI (popup xác nhận, lỗi hiện ngay trong popup) ===
  function askToggleStatus(mon) {
    setToggleTarget(mon);
  }

  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Dang_kinh_doanh"
        ? "Tam_ngung"
        : "Dang_kinh_doanh";
    const r = await updateFoodStatus(toggleTarget.ma_mon_an, next);
    setMessage("✅ " + r.message);
    setToggleTarget(null);
    await Promise.all([loadFoods(), loadStats()]);
  }

  // === XÓA (popup xác nhận, lỗi hiện ngay trong popup) ===
  function askDelete(mon) {
    setDeleteTarget(mon);
  }

  async function confirmDelete() {
    const r = await deleteFood(deleteTarget.ma_mon_an);
    setMessage("✅ " + r.message);
    setDeleteTarget(null);
    await Promise.all([loadFoods(), loadStats()]);
  }

  // === RENDER ===
  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Món ăn</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thêm, sửa, đổi trạng thái và xóa món trong thực đơn.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        <StatCard
          label="Tổng số món ăn"
          value={stats.total}
          icon={UtensilsCrossed}
          color="blue"
        />
        <StatCard
          label="Đang kinh doanh"
          value={stats.dangKinhDoanh}
          icon={CircleCheck}
          color="emerald"
        />
        <StatCard
          label="Tạm ngừng"
          value={stats.tamNgung}
          icon={CirclePause}
          color="amber"
        />
        <StatCard
          label="Danh mục đang dùng"
          value={categories.length}
          icon={Tag}
          color="stone"
        />
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">
            Danh sách món ăn
          </h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm món
          </button>
        </div>

        <div className="border-b border-stone-100">
          <FoodFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            danhMuc={danhMuc}
            setDanhMuc={setDanhMuc}
            trangThai={trangThai}
            setTrangThai={setTrangThai}
            categories={categories}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <FoodTable
            foods={foods}
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
        title={editingId === null ? "Thêm món mới" : `Sửa món #${editingId}`}
        maxWidth="max-w-2xl"
      >
        <FoodForm
          editingId={editingId}
          tenMon={tenMon}
          setTenMon={setTenMon}
          maDanhMuc={maDanhMuc}
          setMaDanhMuc={setMaDanhMuc}
          giaBan={giaBan}
          setGiaBan={setGiaBan}
          moTa={moTa}
          setMoTa={setMoTa}
          imageFile={imageFile}
          setImageFile={setImageFile}
          existingImageUrl={existingImageUrl}
          categories={categories}
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa món ăn"
        description={
          deleteTarget &&
          `Xác nhận xóa món "${deleteTarget.ten_mon_an}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={toggleTarget !== null}
        title={
          toggleTarget?.trang_thai === "Dang_kinh_doanh"
            ? "Tạm ngừng kinh doanh"
            : "Mở bán lại"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Dang_kinh_doanh"
            ? `Tạm ngừng kinh doanh món "${toggleTarget.ten_mon_an}"? Món sẽ ẩn khỏi giao diện gọi món.`
            : `Mở bán lại món "${toggleTarget.ten_mon_an}"? Món sẽ hiển thị lại trên giao diện gọi món.`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Dang_kinh_doanh" ? "Tạm ngừng" : "Mở bán"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật món ăn"
        description={`Xác nhận lưu thay đổi cho món "${tenMon}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default FoodPage;
