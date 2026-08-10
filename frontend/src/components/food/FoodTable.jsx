import { Pencil, Trash2, ImageOff } from "lucide-react";
import { SERVER_URL } from "../../api/apiConfig";
import ToggleSwitch from "../common/ToggleSwitch";

function FoodTable({ foods, onEdit, onDelete, onToggleStatus }) {
  const th =
    "text-left text-xs font-bold text-blue-900 uppercase tracking-wide px-3 py-2 whitespace-nowrap";
  const td = "px-3 py-2 text-sm text-stone-700 border-t border-stone-100";

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-blue-50 border-b border-blue-100">
          <tr>
            <th className={th + " w-[28%]"}>Món ăn</th>
            <th className={th + " w-[18%]"}>Danh mục</th>
            <th className={th + " w-[14%]"}>Giá</th>
            <th className={th + " w-[26%]"}>Đang kinh doanh</th>
            <th className={th + " w-[14%] text-right"}>Thao tác</th>
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
              <tr
                key={mon.ma_mon_an}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className={td}>
                  <div className="flex items-center gap-2.5">
                    {mon.hinh_anh_url ? (
                      <img
                        src={`${SERVER_URL}/uploads/${mon.hinh_anh_url}`}
                        alt={mon.ten_mon_an}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png";
                        }}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 text-stone-300">
                        <ImageOff size={16} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-stone-800">
                        {mon.ten_mon_an}
                      </div>
                      <div className="text-xs text-stone-400">
                        ID: #{mon.ma_mon_an}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={td + " truncate font-medium text-stone-600"}>
                  {mon.ten_danh_muc}
                </td>
                <td className={td + " font-medium text-stone-800 whitespace-nowrap"}>
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
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(mon)}
                      title="Sửa món"
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(mon)}
                      title="Xóa món"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
