import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return [
    "block px-4 py-2 rounded-lg text-sm",
    isActive
      ? "bg-blue-100 text-blue-700 font-semibold"
      : "text-gray-600 hover:bg-gray-100",
  ].join(" ");
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-56 bg-white text-gray-800 flex flex-col p-4 shadow-md">
        <h1 className="text-lg font-bold mb-6 px-2 text-blue-600">
          🍖 BBQ Admin
        </h1>

        {/* flex-1 giúp phần nav chiếm hết chỗ còn lại, đẩy khối user xuống đáy */}
        <nav className="flex flex-col gap-4 flex-1">
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold px-2 mb-2 tracking-wider">
              Thực đơn
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/food" className={linkClass}>
                Món ăn
              </NavLink>
              <NavLink to="/admin/categories" className={linkClass}>
                Danh mục
              </NavLink>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold px-2 mb-2 tracking-wider">
              Nguyên liệu
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/units" className={linkClass}>
                Đơn vị tính
              </NavLink>
              <NavLink to="/admin/ingredients" className={linkClass}>
                Nguyên liệu
              </NavLink>
              <NavLink to="/admin/recipes" className={linkClass}>
                Định mức Nguyên liệu sử dụng
              </NavLink>
            </div>
          </div>
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold px-2 mb-2 tracking-wider">
              Vận hành
            </h2>
            <div className="flex flex-col gap-1">
              <NavLink to="/admin/tables" className={linkClass}>
                Bàn & Khu vực
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Khu thông tin user + nút Đăng xuất, ghim đáy sidebar */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="px-2 mb-3">
            <div className="text-xs text-gray-400">Đang đăng nhập</div>
            <div className="text-sm font-medium text-gray-800">
              {user?.ho_ten || user?.ten_dang_nhap}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {user?.ten_vai_tro}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
