import { useState, useEffect } from "react";
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
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    async function init() {
      try {
        setAccounts(await getActiveAccounts());
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
      await loadData();
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
    await loadData();
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
    await loadData();
  }

  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  const isError = message.startsWith("❌");

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-800">
            Quản lý Nhân viên
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Thêm, sửa thông tin và đổi trạng thái hồ sơ nhân viên. Vai trò được
            xác định tự động theo tài khoản gán lúc tạo.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Thêm nhân viên
        </button>
      </div>

      {message && (
        <div
          className={
            "mb-4 px-4 py-2 rounded-lg border text-sm " +
            (isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700")
          }
        >
          {message}
        </div>
      )}

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

      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onToggleStatus={askToggleStatus}
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
