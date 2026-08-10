import { Search, X } from "lucide-react";

function InventoryFilterBar({ keyword, setKeyword, trangThaiTon, setTrangThaiTon, onSearch, onReset }) {
  const inp = 'border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-stone-50';

  return (
    <div className="flex flex-wrap gap-2 items-center px-3 py-2.5">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          className={inp + ' w-full pl-9'}
          placeholder="Tìm theo tên hoặc mã nguyên liệu"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      <select className={inp} value={trangThaiTon} onChange={(e) => setTrangThaiTon(e.target.value)}>
        <option value="">Tất cả trạng thái tồn</option>
        <option value="Con_hang">Còn hàng</option>
        <option value="Sap_het">Sắp hết</option>
        <option value="Het_hang">Hết hàng</option>
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

export default InventoryFilterBar;
