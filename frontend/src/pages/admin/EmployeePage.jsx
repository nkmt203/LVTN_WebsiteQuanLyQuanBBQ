import { useState, useEffect } from "react";
import { Users, CircleCheck, CirclePause, Plus } from "lucide-react";
import {
  getAllEmployees,
  getActiveAccounts,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "../../api/employeeApi";
import EmployeeForm from "../../components/employee/EmployeeForm";
import EmployeeTable from "../../components/employee/EmployeeTable";
import EmployeeFilterBar from "../../components/employee/EmployeeFilterBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, hoatDong: 0, ngungHoatDong: 0 });

  const [keyword, setKeyword] = useState("");
  const [maTaiKhoan, setMaTaiKhoan] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [formMaTaiKhoan, setFormMaTaiKhoan] = useState("");
  const [accountLabel, setAccountLabel] = useState("");

  // Popup xác nhận
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  // Tài khoản Admin gắn cố định 1 hồ sơ duy nhất, không được chọn để tạo thêm nhân viên
  const accountsForForm = accounts.filter((tk) => tk.ten_vai_tro !== "Admin");

  async function loadData(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const tk = opts.maTaiKhoan ?? maTaiKhoan;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllEmployees({
        keyword: kw,
        ma_tai_khoan: tk,
        trang_thai: tt,
        page: p,
        limit: PER_PAGE,
      });
      setEmployees(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, hoatDong, ngungHoatDong] = await Promise.all([
        getAllEmployees({ limit: 1 }),
        getAllEmployees({ trang_thai: "Hoat_dong", limit: 1 }),
        getAllEmployees({ trang_thai: "Ngung_hoat_dong", limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        hoatDong: hoatDong.total || 0,
        ngungHoatDong: ngungHoatDong.total || 0,
      });
    } catch {
      // bỏ qua lỗi thống kê, không ảnh hưởng danh sách chính
    }
  }

  useEffect(() => {
    async function init() {
      try {
        setAccounts(await getActiveAccounts());
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
    setMaTaiKhoan("");
    setTrangThai("");
    loadData({ p: 1, keyword: "", maTaiKhoan: "", trangThai: "" });
  }
  function handlePageChange(p) {
    loadData({ p });
  }

  function clearForm() {
    setEditingId(null);
    setHoTen("");
    setSoDienThoai("");
    setFormMaTaiKhoan("");
    setAccountLabel("");
  }
  function openAdd() {
    clearForm();
    setFormOpen(true);
  }
  function closeForm() {
    clearForm();
    setFormOpen(false);
  }

  function handleEdit(nv) {
    setEditingId(nv.ma_nhan_vien);
    setHoTen(nv.ho_ten);
    setSoDienThoai(nv.so_dien_thoai || "");
    setFormMaTaiKhoan(String(nv.ma_tai_khoan));
    setAccountLabel(`${nv.ten_dang_nhap} (${nv.ten_vai_tro})`);
    setFormOpen(true);
  }

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createEmployee({
        ho_ten: hoTen,
        so_dien_thoai: soDienThoai,
        ma_tai_khoan: Number(formMaTaiKhoan),
      });
      setMessage("✅ " + r.message);
      closeForm();
      await Promise.all([loadData(), loadStats()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateEmployee(editingId, {
      ho_ten: hoTen,
      so_dien_thoai: soDienThoai,
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
  function askToggleStatus(nv) {
    setToggleTarget(nv);
  }
  async function confirmToggleStatus() {
    const next =
      toggleTarget.trang_thai === "Hoat_dong" ? "Ngung_hoat_dong" : "Hoat_dong";
    const r = await updateEmployeeStatus(toggleTarget.ma_nhan_vien, next);
    setMessage("✅ " + r.message);
    setToggleTarget(null);
    await Promise.all([loadData(), loadStats()]);
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Nhân viên</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Thêm, sửa thông tin và đổi trạng thái hồ sơ nhân viên. Vai trò được
          xác định tự động theo tài khoản gán lúc tạo.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard
          label="Tổng số nhân viên"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Đang hoạt động"
          value={stats.hoatDong}
          icon={CircleCheck}
          color="emerald"
        />
        <StatCard
          label="Ngừng hoạt động"
          value={stats.ngungHoatDong}
          icon={CirclePause}
          color="amber"
        />
      </div>

      <Toast message={message} onClose={() => setMessage("")} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">Danh sách nhân viên</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm nhân viên
          </button>
        </div>

        <div className="border-b border-stone-100">
          <EmployeeFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            maTaiKhoan={maTaiKhoan}
            setMaTaiKhoan={setMaTaiKhoan}
            trangThai={trangThai}
            setTrangThai={setTrangThai}
            accounts={accounts}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
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
          editingId === null ? "Thêm nhân viên" : `Sửa nhân viên #${editingId}`
        }
      >
        <EmployeeForm
          editingId={editingId}
          hoTen={hoTen}
          setHoTen={setHoTen}
          soDienThoai={soDienThoai}
          setSoDienThoai={setSoDienThoai}
          maTaiKhoan={formMaTaiKhoan}
          setMaTaiKhoan={setFormMaTaiKhoan}
          accountLabel={accountLabel}
          accounts={accountsForForm}
          onSave={requestSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={toggleTarget !== null}
        title={
          toggleTarget?.trang_thai === "Hoat_dong"
            ? "Ngừng hoạt động hồ sơ"
            : "Kích hoạt hồ sơ"
        }
        description={
          toggleTarget &&
          (toggleTarget.trang_thai === "Hoat_dong"
            ? `Ngừng hoạt động hồ sơ nhân viên "${toggleTarget.ho_ten}"? Hồ sơ sẽ không xuất hiện trong danh sách chọn khi vào ca.`
            : `Kích hoạt lại hồ sơ nhân viên "${toggleTarget.ho_ten}"?`)
        }
        confirmText={
          toggleTarget?.trang_thai === "Hoat_dong" ? "Ngừng HĐ" : "Kích hoạt"
        }
        onConfirm={confirmToggleStatus}
        onClose={() => setToggleTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật nhân viên"
        description={`Xác nhận lưu thay đổi cho hồ sơ nhân viên "${hoTen}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default EmployeePage;
