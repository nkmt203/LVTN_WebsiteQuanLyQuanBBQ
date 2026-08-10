const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  stone: "bg-stone-100 text-stone-600",
  red: "bg-red-50 text-red-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

function StatCard({ label, value, icon: Icon, color = "blue" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-2.5">
      {Icon && (
        <div
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
            (COLOR_MAP[color] || COLOR_MAP.blue)
          }
        >
          <Icon size={18} />
        </div>
      )}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </div>
        <div className="text-lg font-bold text-stone-800 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
