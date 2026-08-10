import { Search, X } from 'lucide-react';

const INP = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-stone-50';

function TableFilterBar({ keyword, setKeyword, khuVuc, setKhuVuc, trangThai, setTrangThai, zones, onSearch, onReset }) {
  return (
    <div className="flex flex-wrap gap-2 items-center px-3 py-2.5">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          className={INP + ' pl-9 w-full'}
          placeholder="Tìm theo tên hoặc mã bàn"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      <select className={INP} value={khuVuc} onChange={(e) => setKhuVuc(e.target.value)}>
        <option value="">Tất cả khu vực</option>
        {zones.map((kv) => (
          <option key={kv.ma_khu_vuc} value={kv.ma_khu_vuc}>{kv.ten_khu_vuc}</option>
        ))}
      </select>
      <select className={INP} value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="Trong">Trống</option>
        <option value="Dang_su_dung">Đang sử dụng</option>
      </select>
      <button onClick={onSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Tìm
      </button>
      <button onClick={onReset} className="flex items-center gap-1 text-stone-500 text-sm hover:text-stone-700 px-2 transition-colors">
        <X size={14} />
        Xóa lọc
      </button>
    </div>
  );
}

export default TableFilterBar;
