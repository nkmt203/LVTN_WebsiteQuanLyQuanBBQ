function ToggleSwitch({ checked, onChange, title, disabled, onLabel = "Bật", offLabel = "Tắt" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={title ?? (checked ? onLabel : offLabel)}
      onClick={onChange}
      disabled={disabled}
      className={
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 " +
        (checked ? "bg-blue-600" : "bg-stone-300")
      }
    >
      <span
        className={
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform " +
          (checked ? "translate-x-6" : "translate-x-1")
        }
      />
    </button>
  );
}

export default ToggleSwitch;
