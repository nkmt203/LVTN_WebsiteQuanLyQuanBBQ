import { BASE_URL } from "./apiConfig";

export async function getAllIngredients(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== undefined && v !== null) {
      qs.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/ingredients?${qs.toString()}`);
  if (!res.ok) throw new Error("Không tải được danh sách nguyên liệu");
  return res.json();
}
export async function createIngredient(data) {
  const res = await fetch(`${BASE_URL}/ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Thêm thất bại");
  return result;
}

export async function updateIngredient(id, data) {
  const res = await fetch(`${BASE_URL}/ingredients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");
  return result;
}

export async function updateIngredientStatus(id, trang_thai) {
  const res = await fetch(`${BASE_URL}/ingredients/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trang_thai }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Đổi trạng thái thất bại");
  return result;
}

export async function deleteIngredient(id) {
  const res = await fetch(`${BASE_URL}/ingredients/${id}`, {
    method: "DELETE",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Xóa thất bại");
  return result;
}
