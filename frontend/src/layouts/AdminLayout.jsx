import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  UtensilsCrossed,
  Tag,
  Ruler,
  Package,
  ClipboardList,
  Warehouse,
  Truck,
  Armchair,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

function linkClass({ isActive }) {
  return [
    "flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-600 text-white font-semibold shadow-sm"
      : "text-stone-700 hover:bg-white hover:text-stone-900",
  ].join(" ");
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const displayName = user?.ho_ten || user?.ten_dang_nhap || "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="w-56 h-screen sticky top-0 shrink-0 bg-[#f5f8ff] text-stone-800 flex flex-col">
        <div className="h-16 shrink-0 flex items-center gap-2 px-4">
          <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-8 w-8 object-contain shrink-0" />
          <h1 className="text-sm font-bold text-stone-800">MeatOSync</h1>
        </div>

        <nav className="flex flex-col gap-4 flex-1 p-4 border-r border-stone-200 overflow-y-auto">
          <div>
            <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
              Thực đơn
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/food" className={linkClass}>
                <UtensilsCrossed size={16} />
                Món ăn
              </NavLink>
              <NavLink to="/admin/categories" className={linkClass}>
                <Tag size={16} />
                Danh mục
              </NavLink>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
              Nguyên liệu
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/units" className={linkClass}>
                <Ruler size={16} />
                Đơn vị tính
              </NavLink>
              <NavLink to="/admin/ingredients" className={linkClass}>
                <Package size={16} />
                Nguyên liệu
              </NavLink>
              <NavLink to="/admin/recipes" className={linkClass}>
                <ClipboardList size={16} className="shrink-0" />
                Định mức Nguyên liệu sử dụng
              </NavLink>
              <div>
                <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
                  Kho
                </h2>
                <NavLink to="/admin/warehouse" className={linkClass}>
                  <Warehouse size={16} />
                  Kho
                </NavLink>
                <NavLink to="/admin/suppliers" className={linkClass}>
                  <Truck size={16} />
                  Nhà cung cấp
                </NavLink>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
              Vận hành
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/tables" className={linkClass}>
                <Armchair size={16} />
                Bàn & Khu vực
              </NavLink>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
              Nhân sự
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/employees" className={linkClass}>
                <Users size={16} />
                Nhân viên
              </NavLink>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase text-blue-800 font-extrabold px-2 mb-2 tracking-wider">
              Báo cáo
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/revenue" className={linkClass}>
                <TrendingUp size={16} />
                Doanh thu
              </NavLink>
              <NavLink to="/admin/forecast" className={linkClass}>
                <Sparkles size={16} />
                Dự báo nguyên liệu
              </NavLink>
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 shrink-0 sticky top-0 z-10 bg-white shadow-sm flex items-center justify-end px-6 gap-3">
          <button
            title="Thông báo"
            className="h-9 w-9 flex items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <Bell size={18} />
          </button>
          <button
            title="Trợ giúp"
            className="h-9 w-9 flex items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <HelpCircle size={18} />
          </button>

          <div className="w-px h-6 bg-stone-200 mx-1" />

          <div className="text-right leading-tight">
            <div className="text-sm font-semibold text-stone-900">
              {displayName}
            </div>
            <div className="text-xs font-medium text-stone-600">{user?.ten_vai_tro}</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold shrink-0">
            {initial}
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            Đăng xuất
          </button>
        </header>

        <main className="flex-1 px-6 pt-1.5 pb-20">
          <div key={location.pathname} className="animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        confirmText="Đăng xuất"
        danger
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />

      <ScrollToTopButton />
    </div>
  );
}

export default AdminLayout;
