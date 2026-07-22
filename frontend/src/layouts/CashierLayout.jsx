import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { endShift } from '../api/authApi';
import { getErrorMessage } from '../api/errorHandler';

const linkClass = ({ isActive }) =>
  [
    'px-3 py-1.5 rounded-lg text-sm',
    isActive ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-100',
  ].join(' ');

function CashierLayout() {
  const { user, logout, loginSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Cashier Dashboard';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEndShift = async () => {
    try {
      const resp = await endShift();
      loginSession(resp.token, resp.user);
      navigate('/select-profile');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-emerald-600">💰 BBQ Thu ngân</h1>
          <NavLink to="/cashier/bills" className={linkClass}>Hóa đơn</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-800">{user?.ho_ten}</div>
            <div className="text-xs text-slate-500">{user?.ten_vai_tro}</div>
          </div>
          <button onClick={handleEndShift}
                  className="text-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg">
            Hết ca
          </button>
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

export default CashierLayout;