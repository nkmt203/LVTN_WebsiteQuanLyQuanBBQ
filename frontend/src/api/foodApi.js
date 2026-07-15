import axiosClient from './axiosClient';

export async function getAllFood(params = {}) {
  const res = await axiosClient.get('/food', { params });
  return res.data;
}

export async function createFood(formData) {
  const res = await axiosClient.post('/food', formData);
  return res.data;
}

export async function updateFood(id, formData) {
  const res = await axiosClient.put(`/food/${id}`, formData);
  return res.data;
}

export async function updateFoodStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/food/${id}/status`, { trang_thai });
  return res.data;
}

export async function deleteFood(id) {
  const res = await axiosClient.delete(`/food/${id}`);
  return res.data;
}