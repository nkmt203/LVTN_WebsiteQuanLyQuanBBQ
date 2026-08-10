import { useState, useEffect, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { getProfiles, selectProfile } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/errorHandler";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const roleToPath = {
  Admin: "/admin/food",
  Phuc_vu: "/server/tables",
  Bep: "/kitchen", //
  Thu_ngan: "/cashier/bills",
};

const roleLabel = {
  Admin: "Quản trị viên",
  Phuc_vu: "Phục vụ",
  Bep: "Bếp",
  Thu_ngan: "Thu ngân",
};

const avatarPalette = [
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
  "bg-amber-100 text-amber-700",
  "bg-stone-200 text-stone-700",
];

function initialsOf(hoTen = "") {
  const parts = hoTen.trim().split(/\s+/);
  return parts.length ? parts[parts.length - 1][0]?.toUpperCase() : "?";
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1a1 1 0 0 0 1.4-1.4l-4.1-4.1A7 7 0 0 0 11 4Zm-5 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SelectProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, loginSession, logout } = useAuth();

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

  const filteredProfiles = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return profiles;
    return profiles.filter((nv) => nv.ho_ten?.toLowerCase().includes(kw));
  }, [profiles, search]);

  async function handleSelect(ma_nhan_vien) {
    setError("");
    setSelecting(ma_nhan_vien);
    try {
      const resp = await selectProfile(ma_nhan_vien);
      loginSession(resp.token, resp.user);
      const path = roleToPath[resp.user.ten_vai_tro] || "/admin/food";
      navigate(path);
    } catch (err) {
      setError(getErrorMessage(err));
      setSelecting(null);
    }
  }

  function handleBackToLogin() {
    logout();
    navigate("/login");
  }

  // Chưa khôi phục xong phiên đăng nhập từ localStorage -> chưa quyết định vội
  if (authLoading) return null;

  // Thiết bị chưa đăng nhập -> về Login
  if (!user) return <Navigate to="/login" replace />;

  // Đã có hồ sơ nhân viên đang hoạt động trên thiết bị -> không cho quay lại
  // màn chọn hồ sơ để "mượn" hồ sơ khác giữa ca; phải bấm "Hết ca" trước.
  if (user.ma_nhan_vien) {
    return <Navigate to={roleToPath[user.ten_vai_tro] || "/login"} replace />;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo_bbq_icon.png" alt="MeatOSync" className="h-9 w-9 object-contain shrink-0" />
            <div>
              <div className="text-sm font-semibold text-stone-800">
                MeatOSync
              </div>
              <div className="text-xs text-stone-400">
                Vai trò thiết bị:{" "}
                {roleLabel[user?.ten_vai_tro] || user?.ten_vai_tro}
              </div>
            </div>
          </div>
          <button
            onClick={() => setConfirmLogoutOpen(true)}
            className="text-sm font-medium text-stone-500 transition-colors hover:text-red-600"
          >
            Đăng xuất thiết bị
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800">
            Ai đang vào ca vậy?
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Chạm chọn đúng tên của bạn để bắt đầu làm việc
          </p>
        </div>

        <div className="relative mx-auto mb-8 max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên..."
            className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-800 placeholder:text-stone-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-stone-200 bg-white"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {filteredProfiles.map((nv, i) => (
                <button
                  key={nv.ma_nhan_vien}
                  onClick={() => handleSelect(nv.ma_nhan_vien)}
                  disabled={selecting !== null}
                  className="flex flex-col items-center gap-3.5 rounded-2xl border border-stone-200 bg-white px-4 py-7 text-center transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${avatarPalette[i % avatarPalette.length]}`}
                  >
                    {selecting === nv.ma_nhan_vien ? (
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      initialsOf(nv.ho_ten)
                    )}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-stone-800">
                      {nv.ho_ten}
                    </div>
                    <div className="mt-0.5 text-sm text-stone-400">
                      {nv.so_dien_thoai}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <p className="py-16 text-center text-sm text-stone-400">
                {profiles.length === 0
                  ? "Không có hồ sơ nào cho vai trò này."
                  : "Không tìm thấy nhân viên phù hợp."}
              </p>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Đăng xuất thiết bị"
        description="Đăng xuất thiết bị này khỏi hệ thống? Bạn sẽ cần đăng nhập lại bằng tài khoản để tiếp tục sử dụng."
        confirmText="Đăng xuất"
        danger
        onConfirm={handleBackToLogin}
        onClose={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}

export default SelectProfilePage;
