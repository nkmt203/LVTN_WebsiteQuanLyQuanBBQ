import { SERVER_URL } from "../../api/apiConfig";
import ToggleSwitch from "../common/ToggleSwitch";

function FoodTable({ foods, onEdit, onDelete, onToggleStatus }) {
  const th =
    "text-left text-xs font-semibold text-stone-500 uppercase px-4 py-3";
  const td = "px-4 py-3 text-sm text-stone-700 border-t border-stone-100";

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            <th className={th}>Món ăn</th>
            <th className={th}>Danh mục</th>
            <th className={th}>Giá</th>
            <th className={th}>Đang kinh doanh</th>
            <th className={th + " text-right"}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {foods.length === 0 && (
            <tr>
              <td className={td + " text-center text-stone-400"} colSpan={5}>
                Không tìm thấy kết quả phù hợp.
              </td>
            </tr>
          )}
          {foods.map((mon) => {
            const dangKD = mon.trang_thai === "Dang_kinh_doanh";
            return (
              <tr key={mon.ma_mon_an} className="hover:bg-stone-50">
                <td className={td}>
                  <div className="flex items-center gap-3">
                    {mon.hinh_anh_url ? (
                      <img
                        src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
                        alt={mon.ten_mon_an}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png";
                        }}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 text-stone-300">
                        🍽
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-stone-800">
                        {mon.ten_mon_an}
                      </div>
                      <div className="text-xs text-stone-400">
                        #{mon.ma_mon_an}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={td}>{mon.ten_danh_muc}</td>
                <td className={td + " font-medium text-stone-800"}>
                  {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
                </td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={dangKD}
                      onChange={() => onToggleStatus(mon)}
                      title={
                        dangKD
                          ? "Đang kinh doanh — bấm để tạm ngừng"
                          : "Tạm ngừng — bấm để mở bán lại"
                      }
                      onLabel="Đang kinh doanh"
                      offLabel="Tạm ngừng"
                    />
                    <span
                      className={
                        "text-xs font-medium " +
                        (dangKD ? "text-blue-700" : "text-stone-400")
                      }
                    >
                      {dangKD ? "Đang kinh doanh" : "Tạm ngừng"}
                    </span>
                  </div>
                </td>
                <td className={td + " whitespace-nowrap text-right"}>
                  <button
                    onClick={() => onEdit(mon)}
                    className="text-stone-600 hover:text-stone-900 mr-3 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(mon)}
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
