import { useState, useEffect } from 'react';
import { getAllTables, createTable, updateTable, deleteTable, getZonesList } from '../../api/tableApi';
import { getErrorMessage } from '../../api/errorHandler';
import TableForm from '../../components/table/TableForm';
import TableTable from '../../components/table/TableTable';
import TableFilterBar from '../../components/table/TableFilterBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

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

  useEffect(() => {
    async function init() {
      try {
        setZones(await getZonesList());
      } catch {}
      await loadTables({ p: 1 });
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

  async function handleSave() {
    const payload = {
      ten_ban: form.tenBan,
      ma_khu_vuc: Number(form.maKhuVuc),
      so_ghe: Number(form.soGhe),
      ghi_chu: form.ghiChu,
    };

    try {
      const r = editingId === null
        ? await createTable(payload)
        : await updateTable(editingId, payload);
      setMessage('✅ ' + r.message);
      closeForm();
      await loadTables();
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xác nhận xóa bàn này?')) return;
    try {
      const r = await deleteTable(id);
      setMessage('✅ ' + r.message);
      await loadTables();
    } catch (err) {
      setMessage('❌ ' + getErrorMessage(err));
    }
  }

  // ===== Render =====
  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <PageHeader onAdd={openAdd} />

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <TableFilterBar
        keyword={keyword} setKeyword={setKeyword}
        khuVuc={filterKhuVuc} setKhuVuc={setFilterKhuVuc}
        trangThai={filterTrangThai} setTrangThai={setFilterTrangThai}
        zones={zones}
        onSearch={handleSearch} onReset={handleReset}
      />

      <TableTable tables={tables} onEdit={openEdit} onDelete={handleDelete} />

      <Pagination
        page={page} totalPages={totalPages} total={total}
        onPageChange={(p) => loadTables({ p })}
      />

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
          onSave={handleSave} onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

// Tách phần header thành component nhỏ
function PageHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Quản lý Bàn</h2>
        <p className="text-sm text-slate-500 mt-0.5">Thêm, sửa, xóa các bàn trong nhà hàng.</p>
      </div>
      <button onClick={onAdd} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">
        + Thêm bàn
      </button>
    </div>
  );
}

export default TablePage;