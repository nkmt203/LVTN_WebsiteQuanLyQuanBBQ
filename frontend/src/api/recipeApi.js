import axiosClient from './axiosClient';

export async function getAllRecipes(params = {}) {
  const res = await axiosClient.get('/recipes', { params });
  return res.data;
}

export async function getRecipesByFood(foodId) {
  const res = await axiosClient.get(`/recipes/food/${foodId}`);
  return res.data;
}

export async function createRecipes(data) {
  const res = await axiosClient.post('/recipes', data);
  return res.data;
}

export async function updateRecipe(id, data) {
  const res = await axiosClient.put(`/recipes/${id}`, data);
  return res.data;
}

export async function updateRecipeStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/recipes/${id}/status`, { trang_thai });
  return res.data;
}

export async function deleteRecipe(id) {
  const res = await axiosClient.delete(`/recipes/${id}`);
  return res.data;
}