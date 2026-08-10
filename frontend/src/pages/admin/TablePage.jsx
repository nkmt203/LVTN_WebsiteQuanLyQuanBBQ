import { useState, useEffect } from 'react';
import { Armchair, CircleCheck, Users, Plus } from 'lucide-react';
import { getAllTables, createTable, updateTable, deleteTable, getZonesList } from '../../api/tableApi';
import { getErrorMessage } from '../../api/errorHandler';
import TableForm from '../../components/table/TableForm';
import TableTable from '../../components/table/TableTable';
import TableFilterBar from '../../components/table/TableFilterBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatCard from '../../components/common/StatCard';
import Toast from '../../components/common/Toast';

const PER_PAGE = 10;

// Trạng thái form mặc định
const emptyForm = {
  tenBan: '',
  maKhuVuc: '',
  soGhe: '4',
  ghiChu: '',
};

function TablePage() {
  // ===== State =====
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [stats, setStats] = useState({ total: 0, trong: 0, dangSuDung: 0 });

  // Filter
  const [keyword, setKeyword] = useState('');
  const [filterKhuVuc, setFilterKhuVuc] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Form modal — gom vào 1 object để dễ reset
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // Popup xác nhận
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);

  // ===== Load data =====
  async function loadTables(opts = {}) {
    const p  = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const kv = opts.khuVuc ?? filterKhuVuc;
    const tt = opts.trangThai ?? filterTrangThai;
    try {
      const resp = await getAllTables({
        keyword: kw, ma_khu_vuc: kv, trang_thai: tt, page: p, limit: PER_PAGE,
      });
      setTables(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  }

  async function loadStats() {
    try {
      const [all, trong, dangSuDung] = await Promise.all([
        getAllTables({ limit: 1 }),
        getAllTables({ trang_thai: 'Trong', limit: 1 }),
        getAllTables({ trang_thai: 'Dang_su_dung', limit: 1 }),
      ]);
      setStats({
        total: all.total || 0,
        trong: trong.total || 0,
        dangSuDung: dangSuDung.total || 0,
      });
    } catch {
      // bỏ qua lỗi thống kê, không ảnh hưởng danh sách chính
    }
  }

  useEffect(() => {
    async function init() {
      try {
        setZones(await getZonesList());
      } catch {}
      await Promise.all([loadTables({ p: 1 }), loadStats()]);
      setLoading(false);
    }
    init();
  }, []);

  // ===== Filter handlers =====
  const handleSearch = () => loadTables({ p: 1 });
  const handleReset = () => {
    setKeyword('');
    setFilterKhuVuc('');
    setFilterTrangThai('');
    loadTables({ p: 1, keyword: '', khuVuc: '', trangThai: '' });
  };

  // ===== Form handlers =====
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.ma_ban);
    setForm({
      tenBan: b.ten_ban,
      maKhuVuc: String(b.ma_khu_vuc),
      soGhe: String(b.so_ghe),
      ghiChu: b.ghi_chu || '',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(false);
  };

  function buildTablePayload() {
    return {
      ten_ban: form.tenBan,
      ma_khu_vuc: Number(form.maKhuVuc),
      so_ghe: Number(form.soGhe),
      ghi_chu: form.ghiChu,
    };
  }

  // Thêm mới: lưu trực tiếp
  async function doCreate() {
    try {
      const r = await createTable(buildTablePayload());
      setMessage('✅ ' + r.message);
      closeForm();
      await Promise.all([loadTables(), loadStats()]);
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  }

  // Cập nhật: qua popup xác nhận, lỗi hiện ngay trong popup
  async function doUpdate() {
    const r = await updateTable(editingId, buildTablePayload());
    setMessage('✅ ' + r.message);
    setConfirmUpdateOpen(false);
    closeForm();
    await Promise.all([loadTables(), loadStats()]);
  }

  function requestSave() {
    if (editingId === null) {
      doCreate();
    } else {
      setConfirmUpdateOpen(true);
    }
  }

  // Xóa (popup xác nhận)
  function askDelete(b) {
    setDeleteTarget(b);
  }
  async function confirmDelete() {
    const r = await deleteTable(deleteTarget.ma_ban);
    setMessage('✅ ' + r.message);
    setDeleteTarget(null);
    await Promise.all([loadTables(), loadStats()]);
  }

  // ===== Render =====
  if (loading) return <p className="text-stone-500 p-4">Đang tải...</p>;

  return (
    <div className="max-w-7xl">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-stone-800">Quản lý Bàn</h2>
        <p className="text-xs text-stone-500 mt-0.5">Thêm, sửa, xóa các bàn trong nhà hàng.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <StatCard label="Tổng số bàn" value={stats.total} icon={Armchair} color="blue" />
        <StatCard label="Đang trống" value={stats.trong} icon={CircleCheck} color="emerald" />
        <StatCard label="Đang sử dụng" value={stats.dangSuDung} icon={Users} color="amber" />
      </div>

      <Toast message={message} onClose={() => setMessage('')} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5">
          <h3 className="text-sm font-bold text-stone-800">Danh sách bàn</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-shadow"
          >
            <Plus size={16} />
            Thêm bàn
          </button>
        </div>

        <div className="border-b border-stone-100">
          <TableFilterBar
            keyword={keyword} setKeyword={setKeyword}
            khuVuc={filterKhuVuc} setKhuVuc={setFilterKhuVuc}
            trangThai={filterTrangThai} setTrangThai={setFilterTrangThai}
            zones={zones}
            onSearch={handleSearch} onReset={handleReset}
          />
        </div>

        <div key={page} className="animate-fade-in">
          <TableTable tables={tables} onEdit={openEdit} onDelete={askDelete} />
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 px-2">
          <Pagination
            page={page} totalPages={totalPages} total={total}
            onPageChange={(p) => loadTables({ p })}
          />
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingId === null ? 'Thêm bàn mới' : `Sửa bàn #${editingId}`}
      >
        <TableForm
          editingId={editingId}
          tenBan={form.tenBan}         setTenBan={(v) => updateForm('tenBan', v)}
          maKhuVuc={form.maKhuVuc}     setMaKhuVuc={(v) => updateForm('maKhuVuc', v)}
          soGhe={form.soGhe}           setSoGhe={(v) => updateForm('soGhe', v)}
          ghiChu={form.ghiChu}         setGhiChu={(v) => updateForm('ghiChu', v)}
          zones={zones}
          onSave={requestSave} onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Xóa bàn"
        description={
          deleteTarget &&
          `Xác nhận xóa bàn "${deleteTarget.ten_ban}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={confirmUpdateOpen}
        title="Cập nhật bàn"
        description={`Xác nhận lưu thay đổi cho bàn "${form.tenBan}"?`}
        confirmText="Cập nhật"
        onConfirm={doUpdate}
        onClose={() => setConfirmUpdateOpen(false)}
      />
    </div>
  );
}

export default TablePage;
