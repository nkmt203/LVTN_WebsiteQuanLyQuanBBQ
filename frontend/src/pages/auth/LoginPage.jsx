import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/errorHandler';

function LoginPage() {
  const [tenDN, setTenDN] = useState('');
  const [matKhau, setMatKhau] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-sm">
        <h1 className="text-xl font-bold text-slate-800 mb-1">🍖 BBQ Restaurant</h1>
        <p className="text-sm text-slate-500 mb-6">Đăng nhập thiết bị đầu ngày</p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-600 mb-1 block">Tên đăng nhập</label>
          <input type="text" value={tenDN} onChange={(e) => setTenDN(e.target.value)}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                 autoFocus />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-slate-600 mb-1 block">Mật khẩu</label>
          <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
        </div>

        <button type="submit" disabled={submitting}
                className="w-full bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 disabled:opacity-50">
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;