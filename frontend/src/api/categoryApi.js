import axiosClient from './axiosClient';

export async function getAllCategories(params = {}) {
  const res = await axiosClient.get('/categories', { params });
  return res.data;
}
export async function createCategory(data) {
  const res = await axiosClient.post('/categories', data);
  return res.data;
}
export async function updateCategory(id, data) {
  const res = await axiosClient.put(`/categories/${id}`, data);
  return res.data;
}
export async function updateCategoryStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/categories/${id}/status`, { trang_thai });
  return res.data;
}
export async function deleteCategory(id) {
  const res = await axiosClient.delete(`/categories/${id}`);
  return res.data;
}