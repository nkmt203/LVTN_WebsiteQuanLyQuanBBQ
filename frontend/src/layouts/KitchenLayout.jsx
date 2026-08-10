import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmDialog from '../components/common/LogoutConfirmDialog';

function KitchenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  useEffect(() => {
    document.title = 'Kitchen Dashboard';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-7 w-7 object-contain shrink-0" />
          <h1 className="text-lg font-bold text-stone-800">MeatOSync Bếp</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-stone-800">{user?.ho_ten}</div>
            <div className="text-xs text-stone-500">{user?.ten_vai_tro}</div>
          </div>
          <button onClick={() => setConfirmLogoutOpen(true)}
                  className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div key={location.pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>

      <LogoutConfirmDialog
        open={confirmLogoutOpen}
        onConfirm={handleLogout}
        onClose={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}

export default KitchenLayout;