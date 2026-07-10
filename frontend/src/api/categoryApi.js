import { BASE_URL } from "./apiConfig";

export async function getAllCategories(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== undefined && v !== null) {
      qs.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/categories?${qs.toString()}`);
  if (!res.ok) throw new Error("Không tải được danh mục");
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Thêm danh mục thật bại");
  return result;
}

export async function updateCategory(id, data) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");
  return result;
}

export async function updateCategoryStatus(id, trang_thai) {
  const res = await fetch(`${BASE_URL}/categories/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trang_thai }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Đổi trạng thái thất bại");
  return result;
}

export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Xóa thất bại");
  return result;
}

