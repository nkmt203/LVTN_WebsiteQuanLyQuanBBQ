import { BASE_URL } from './apiConfig';

export async function getAllFood(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) qs.append(k, v);
  });
  const res = await fetch(`${BASE_URL}/food?${qs.toString()}`);
  if (!res.ok) throw new Error('Không tải được danh sách món');
  return res.json();
}

export async function createFood(formData) {
  const res = await fetch(`${BASE_URL}/food`, { method: 'POST', body: formData });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Thêm món thất bại');
  return result;
}

export async function updateFood(id, formData) {
  const res = await fetch(`${BASE_URL}/food/${id}`, { method: 'PUT', body: formData });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại');
  return result;
}

export async function updateFoodStatus(id, trang_thai) {
  const res = await fetch(`${BASE_URL}/food/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trang_thai }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Đổi trạng thái thất bại');
  return result;
}

export async function deleteFood(id) {
  const res = await fetch(`${BASE_URL}/food/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Xóa thất bại');
  return result;
}
