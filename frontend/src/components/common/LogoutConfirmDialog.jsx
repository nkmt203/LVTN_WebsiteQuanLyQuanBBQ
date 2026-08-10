import ConfirmDialog from './ConfirmDialog';

function LogoutConfirmDialog({ open, onConfirm, onClose }) {
  return (
    <ConfirmDialog
      open={open}
      title="Đăng xuất thiết bị"
      description="Đăng xuất thiết bị này khỏi hệ thống? Bạn sẽ cần đăng nhập lại bằng tài khoản để tiếp tục."
      confirmText="Đăng xuất"
      danger
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}

export default LogoutConfirmDialog;
