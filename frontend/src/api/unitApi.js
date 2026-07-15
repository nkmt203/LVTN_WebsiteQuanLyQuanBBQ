import axiosClient from './axiosClient';

export async function getAllUnits(params = {}) {
  const res = await axiosClient.get('/units', { params });
  return res.data;
}

export async function createUnit(data) {
  const res = await axiosClient.post('/units', data);
  return res.data;
}

export async function updateUnit(id, data) {
  const res = await axiosClient.put(`/units/${id}`, data);
  return res.data;
}

export async function deleteUnit(id) {
  const res = await axiosClient.delete(`/units/${id}`);
  return res.data;
}