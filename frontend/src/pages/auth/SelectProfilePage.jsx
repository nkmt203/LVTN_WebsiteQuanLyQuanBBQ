import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles, selectProfile } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/errorHandler';

const roleToPath = {
  Admin: '/admin/food',
  Phuc_vu: '/server/tables',   // chưa làm — tạm để đây
  Bep: '/kitchen',
  Thu_ngan: '/cashier/bills',
};

function SelectProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loginSession, logout } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        setProfiles(await getProfiles());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSelect(ma_nhan_vien) {
    try {
      const resp = await selectProfile(ma_nhan_vien);
      loginSession(resp.token, resp.user);
      const path = roleToPath[resp.user.ten_vai_tro] || '/admin/food';
      navigate(path);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleBackToLogin() {
    logout();
    navigate('/login');
  }

  if (loading) return <p className="p-4 text-slate-500">Đang tải...</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Chọn hồ sơ nhân viên</h1>
            <p className="text-sm text-slate-500 mt-1">
              Thiết bị đã đăng nhập với vai trò <strong>{user?.ten_vai_tro}</strong>
            </p>
          </div>
          <button onClick={handleBackToLogin}
                  className="text-sm text-slate-500 hover:text-slate-700">
            Đăng xuất thiết bị
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profiles.map((nv) => (
            <button key={nv.ma_nhan_vien}
                    onClick={() => handleSelect(nv.ma_nhan_vien)}
                    className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-slate-800 hover:shadow-sm transition-all">
              <div className="text-slate-800 font-semibold">👤 {nv.ho_ten}</div>
              <div className="text-xs text-slate-500 mt-1">{nv.so_dien_thoai}</div>
            </button>
          ))}
        </div>

        {profiles.length === 0 && (
          <p className="text-center text-slate-400 py-8">Không có hồ sơ nào cho vai trò này.</p>
        )}
      </div>
    </div>
  );
}

export default SelectProfilePage;