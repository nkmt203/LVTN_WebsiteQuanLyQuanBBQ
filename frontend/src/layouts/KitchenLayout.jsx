import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function KitchenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-orange-600">🔥 BBQ Bếp</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-800">{user?.ho_ten}</div>
            <div className="text-xs text-slate-500">{user?.ten_vai_tro}</div>
          </div>
          <button onClick={handleLogout}
                  className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg">
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default KitchenLayout;