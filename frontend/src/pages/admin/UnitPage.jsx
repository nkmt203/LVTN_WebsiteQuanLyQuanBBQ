import { useState, useEffect } from "react";
import { Ruler, CircleCheck, CirclePause, Plus } from "lucide-react";
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
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 8;

function UnitPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, dangDung: 0, ngungSuDung: 0 });

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

  async function loadStats() {
    try {
      const [all, dangDung, ngungSuDung] = await Promise.all([
        getAllUnits({ limit: 1 }),
        getAllUnits({ trang_thai: "Dang_dung", limit: 1 }),
        getAllUnits({ trang_thai: "Ngung_su_dung", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        dangDung: dangDung.total || 0,
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
      await Promise.all([loadData(), loadStats()]);
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
    await Promise.all([loadData(), loadStats()]);
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
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Đơn vị tính</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thêm, sửa và xóa các đơn vị tính dùng cho nguyên liệu.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số đơn vị tính"
          value={stats.total}
          icon={Ruler}
          color="blue"
        />
        <StatCard
          label="Đang dùng"
          value={stats.dangDung}
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
          <h3 className="text-sm font-bold text-stone-800">Danh sách đơn vị tính</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm đơn vị tính
          </button>
        </div>

        <div className="border-b border-stone-100">
          <UnitFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            trangThai={trangThai}
            setTrangThai={setTrangThai}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <UnitTable units={units} onEdit={handleEdit} onDelete={askDelete} />
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
