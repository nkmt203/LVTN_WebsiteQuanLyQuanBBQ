import { useState, useEffect } from 'react';
import { getAllFood, createFood, updateFood, updateFoodStatus, deleteFood } from '../../api/foodApi';
import { getAllCategories } from '../../api/categoryApi';
import FoodForm from '../../components/food/FoodForm';
import FoodTable from '../../components/food/FoodTable';
import FoodFilterBar from '../../components/food/FoodFilterBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

const PER_PAGE = 7;

function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Bộ lọc
  const [keyword, setKeyword] = useState('');
  const [danhMuc, setDanhMuc] = useState('');
  const [trangThai, setTrangThai] = useState('');

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal form
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tenMon, setTenMon] = useState('');
  const [maDanhMuc, setMaDanhMuc] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [moTa, setMoTa] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // === TẢI DỮ LIỆU ===
  async function loadFoods(opts = {}) {
    const p = opts.p ?? page;
    const kw = opts.keyword ?? keyword;
    const dm = opts.danhMuc ?? danhMuc;
    const tt = opts.trangThai ?? trangThai;

    try {
      const resp = await getAllFood({ keyword: kw, ma_danh_muc: dm, trang_thai: tt, page: p, limit: PER_PAGE });
      setFoods(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.total || 0);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.page || 1);
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  }

  useEffect(() => {
    async function init() {
     try { const resp = await getAllCategories(); setCategories(Array.isArray(resp.data) ? resp.data : resp); } catch {}
      await loadFoods({ p: 1 });
      setLoading(false);
    }
    init();
  }, []);

  // === TÌM KIẾM & PHÂN TRANG ===
  function handleSearch() { loadFoods({ p: 1 }); }
  function handleReset() {
    setKeyword('');
    setDanhMuc('');
    setTrangThai('');
    loadFoods({ p: 1, keyword: '', danhMuc: '', trangThai: '' });
  }
  function handlePageChange(p) { loadFoods({ p }); }

  // === FORM MODAL ===
  function clearForm() {
    setEditingId(null);
    setTenMon('');
    setMaDanhMuc('');
    setGiaBan('');
    setMoTa('');
    setImageFile(null);
    const el = document.getElementById('food-image-input');
    if (el) el.value = '';
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
    setMoTa(mon.mo_ta || '');
    setImageFile(null);
    const el = document.getElementById('food-image-input');
    if (el) el.value = '';
    setFormOpen(true);
  }

  async function handleSave() {
    const fd = new FormData();
    fd.append('ten_mon_an', tenMon);
    fd.append('ma_danh_muc', maDanhMuc);
    fd.append('gia_ban', giaBan);
    fd.append('mo_ta', moTa);
    if (imageFile) fd.append('hinh_anh', imageFile);

    try {
      if (editingId === null) {
        const r = await createFood(fd);
        setMessage('✅ ' + r.message);
      } else {
        const r = await updateFood(editingId, fd);
        setMessage('✅ ' + r.message);
      }
      closeForm();
      await loadFoods();
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  }

  // === ĐỔI TRẠNG THÁI ===
  async function handleToggleStatus(mon) {
    const next = mon.trang_thai === 'Dang_kinh_doanh' ? 'Tam_ngung' : 'Dang_kinh_doanh';
    try {
      const r = await updateFoodStatus(mon.ma_mon_an, next);
      setMessage('✅ ' + r.message);
      await loadFoods();
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  }

  // === XÓA ===
  async function handleDelete(id) {
    if (!window.confirm('Xác nhận xóa món này?')) return;
    try {
      const r = await deleteFood(id);
      setMessage('✅ ' + r.message);
      await loadFoods();
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  }

  // === RENDER ===
  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Món ăn</h2>
          <p className="text-sm text-slate-500 mt-0.5">Thêm, sửa, đổi trạng thái và xóa món trong thực đơn.</p>
        </div>
        <button onClick={openAdd} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">
          + Thêm món
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <FoodFilterBar
        keyword={keyword} setKeyword={setKeyword}
        danhMuc={danhMuc} setDanhMuc={setDanhMuc}
        trangThai={trangThai} setTrangThai={setTrangThai}
        categories={categories}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <FoodTable
        foods={foods}
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

      <Modal open={formOpen} onClose={closeForm} title={editingId === null ? 'Thêm món mới' : `Sửa món #${editingId}`}>
        <FoodForm
          editingId={editingId}
          tenMon={tenMon} setTenMon={setTenMon}
          maDanhMuc={maDanhMuc} setMaDanhMuc={setMaDanhMuc}
          giaBan={giaBan} setGiaBan={setGiaBan}
          moTa={moTa} setMoTa={setMoTa}
          imageFile={imageFile} setImageFile={setImageFile}
          categories={categories}
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

export default FoodPage;
