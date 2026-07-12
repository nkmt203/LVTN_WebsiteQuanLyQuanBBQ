import { NavLink, Outlet } from "react-router-dom";

function linkClass({ isActive }) {
  return [
    "block px-4 py-2 rounded-lg text-sm",
    isActive
      ? "bg-blue-100 text-blue-700 font-semibold" // Đổi màu active
      : "text-gray-600 hover:bg-gray-100", // Đổi màu hover
  ].join(" ");
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-56 bg-white text-gray-800 flex flex-col p-4 shadow-md">
        {/* Thay bg-slate-800 -> bg-white, text-white -> text-gray-800 */}
        <h1 className="text-lg font-bold mb-6 px-2 text-blue-600">
          🍖 BBQ Admin
        </h1>
        <nav className="flex flex-col gap-4">
          {/* Nhóm Thực đơn */}
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

          {/* Nhóm Nguyên liệu */}
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
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
