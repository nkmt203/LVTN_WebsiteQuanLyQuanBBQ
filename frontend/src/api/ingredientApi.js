import axiosClient from './axiosClient';

export async function getAllIngredients(params = {}) {
  const res = await axiosClient.get('/ingredients', { params });
  return res.data;
}

export async function createIngredient(data) {
  const res = await axiosClient.post('/ingredients', data);
  return res.data;
}

export async function updateIngredient(id, data) {
  const res = await axiosClient.put(`/ingredients/${id}`, data);
  return res.data;
}

export async function updateIngredientStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/ingredients/${id}/status`, { trang_thai });
  return res.data;
}

export async function deleteIngredient(id) {
  const res = await axiosClient.delete(`/ingredients/${id}`);
  return res.data;
}