import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return null; // đang khôi phục session, chưa render

  // Chưa login
  if (!user) return <Navigate to="/login" replace />;

  // Không có ma_nhan_vien (chưa chọn hồ sơ) - trừ Admin đã tự có
  if (!user.ma_nhan_vien) return <Navigate to="/select-profile" replace />;

  // Sai vai trò
  if (allowedRoles && !allowedRoles.includes(user.ten_vai_tro)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;