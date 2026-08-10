import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/errorHandler';

function UserIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2h.5A1.5 1.5 0 0 1 19 11.5v8A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeIcon({ className, off }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {off && (
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function LoginPage() {
  const [tenDN, setTenDN] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const resp = await login(tenDN, matKhau);
      loginSession(resp.token, resp.user);
      // Admin đã có ma_nhan_vien -> vào thẳng dashboard
      // Vai trò khác -> qua bước chọn hồ sơ
      if (resp.requireProfileSelection) {
        navigate('/select-profile');
      } else {
        navigate('/admin/food');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* Panel thương hiệu - chỉ hiện từ md trở lên */}
      <div className="hidden md:flex relative w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900 text-stone-100 p-12 animate-fade-in">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f97316 0%, transparent 40%), radial-gradient(circle at 80% 70%, #dc2626 0%, transparent 45%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-orange-600/20 blur-3xl"
        />

        <div className="relative flex items-center gap-2">
          <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-9 w-9 object-contain shrink-0" />
          <span className="text-lg font-semibold tracking-wide">MeatOSync</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Quản lý quán nướng<br />gọn gàng &amp; nhanh chóng
          </h1>
          <p className="text-stone-300 max-w-sm text-sm leading-relaxed">
            Đăng nhập thiết bị để bắt đầu ca làm việc — gọi món, bếp, thu ngân
            đồng bộ theo thời gian thực trên cùng một hệ thống.
          </p>
        </div>

        <p className="relative text-xs text-stone-400">
          © {new Date().getFullYear()} MeatOSync · Hệ thống quản lý nhà hàng
        </p>
      </div>

      {/* Panel đăng nhập */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-scale-in">
          <div className="mb-8 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-3 flex h-14 w-14 items-center justify-center md:hidden">
              <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-14 w-14 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Đăng nhập</h1>
            <p className="mt-1 text-sm text-stone-500">
              Nhập tài khoản thiết bị đầu ca làm việc
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Tên đăng nhập
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={tenDN}
                onChange={(e) => setTenDN(e.target.value)}
                placeholder="vd: phucvu01"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                autoFocus
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              Mật khẩu
            </label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
              <input
                type={showPw ? 'text' : 'password'}
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <EyeIcon className="h-4.5 w-4.5" off={showPw} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:from-orange-500 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className="mt-6 text-center text-xs text-stone-400 md:text-left">
            Chỉ dùng thiết bị được cấp phép của quán. Liên hệ quản lý nếu quên mật khẩu.
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
