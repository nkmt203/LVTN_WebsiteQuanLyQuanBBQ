import { BASE_URL } from './apiConfig';

export async function getAllRecipes(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) qs.append(k, v);
  });
  const res = await fetch(`${BASE_URL}/recipes?${qs.toString()}`);
  if (!res.ok) throw new Error('Không tải được danh sách định mức');
  return res.json();
}

export async function getRecipesByFood(foodId) {
  const res = await fetch(`${BASE_URL}/recipes/food/${foodId}`);
  if (!res.ok) throw new Error('Không tải được định mức món này');
  return res.json();
}

export async function createRecipes(data) {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Thêm thất bại');
  return result;
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại');
  return result;
}

export async function updateRecipeStatus(id, trang_thai) {
  const res = await fetch(`${BASE_URL}/recipes/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trang_thai }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Đổi trạng thái thất bại');
  return result;
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Xóa thất bại');
  return result;
}