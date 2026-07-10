import { SERVER_URL } from "../../api/apiConfig";

function FoodTable({ foods, onEdit, onDelete, onToggleStatus }) {
  const th =
    "text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3";
  const td = "px-4 py-3 text-sm text-slate-700 border-t border-slate-100";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className={th}>ID</th>
            <th className={th}>Ảnh</th>
            <th className={th}>Tên món</th>
            <th className={th}>Danh mục</th>
            <th className={th}>Giá</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {foods.length === 0 && (
            <tr>
              <td className={td + " text-center text-slate-400"} colSpan={7}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {foods.map((mon) => {
            const dangKD = mon.trang_thai === "Dang_kinh_doanh";
            return (
              <tr key={mon.ma_mon_an} className="hover:bg-slate-50">
                <td className={td}>{mon.ma_mon_an}</td>
                <td className={td}>
                  {mon.hinh_anh_url ? (
                    <img
                      src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
                      alt={mon.ten_mon_an}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/no-image.png";
                      }}
                      className="w-14 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className={td + " font-medium text-slate-800"}>
                  {mon.ten_mon_an}
                </td>
                <td className={td}>{mon.ten_danh_muc}</td>
                <td className={td}>
                  {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
                </td>
                <td className={td}>
                  <span
                    className={
                      "px-2 py-1 rounded-full text-xs font-medium " +
                      (dangKD
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500")
                    }
                  >
                    {dangKD ? "Đang kinh doanh" : "Tạm ngừng"}
                  </span>
                </td>
                <td className={td + " whitespace-nowrap"}>
                  <button
                    onClick={() => onEdit(mon)}
                    className="text-slate-600 hover:text-slate-900 mr-3 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onToggleStatus(mon)}
                    className="text-slate-600 hover:text-slate-900 mr-3 text-sm"
                  >
                    {dangKD ? "Ngừng KD" : "Mở bán"}
                  </button>
                  <button
                    onClick={() => onDelete(mon.ma_mon_an)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FoodTable;
