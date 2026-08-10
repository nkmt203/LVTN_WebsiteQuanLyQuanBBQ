import ConfirmDialog from './ConfirmDialog';

function EndShiftConfirmDialog({ open, onConfirm, onClose }) {
  return (
    <ConfirmDialog
      open={open}
      title="Hết ca"
      description="Kết thúc ca làm việc? Bạn sẽ cần chọn lại hồ sơ nhân viên để tiếp tục sử dụng."
      confirmText="Hết ca"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}

export default EndShiftConfirmDialog;
