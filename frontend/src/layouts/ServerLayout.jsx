import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { endShift } from '../api/authApi';
import LogoutConfirmDialog from '../components/common/LogoutConfirmDialog';
import EndShiftConfirmDialog from '../components/common/EndShiftConfirmDialog';

const linkClass = ({ isActive }) =>
  [
    'px-3 py-1.5 rounded-lg text-sm',
    isActive ? 'bg-teal-100 text-teal-700 font-medium' : 'text-stone-600 hover:bg-stone-100',
  ].join(' ');

function ServerLayout() {
  const { user, logout, loginSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [confirmEndShiftOpen, setConfirmEndShiftOpen] = useState(false);

  useEffect(() => {
    document.title = 'Service Dashboard';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEndShift = async () => {
    const resp = await endShift();
    loginSession(resp.token, resp.user);
    setConfirmEndShiftOpen(false);
    navigate('/select-profile');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-7 w-7 object-contain shrink-0" />
            <h1 className="text-lg font-bold text-teal-600">MeatOSync Phục vụ</h1>
          </div>
          <NavLink to="/server/tables" className={linkClass}>Sơ đồ bàn</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-stone-800">{user?.ho_ten}</div>
            <div className="text-xs text-stone-500">{user?.ten_vai_tro}</div>
          </div>
          <button onClick={() => setConfirmEndShiftOpen(true)}
                  className="text-sm text-stone-600 hover:bg-stone-100 px-3 py-1.5 rounded-lg transition-colors">
            Hết ca
          </button>
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

      <EndShiftConfirmDialog
        open={confirmEndShiftOpen}
        onConfirm={handleEndShift}
        onClose={() => setConfirmEndShiftOpen(false)}
      />

      <LogoutConfirmDialog
        open={confirmLogoutOpen}
        onConfirm={handleLogout}
        onClose={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}

export default ServerLayout;