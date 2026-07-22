import axiosClient from './axiosClient';

export async function getAllSuppliers(params = {}) {
  const res = await axiosClient.get('/suppliers', { params });
  return res.data;
}

export async function getActiveSuppliers() {
  const res = await axiosClient.get('/suppliers/active');
  return res.data;
}

export async function createSupplier(data) {
  const res = await axiosClient.post('/suppliers', data);
  return res.data;
}

export async function updateSupplier(id, data) {
  const res = await axiosClient.put(`/suppliers/${id}`, data);
  return res.data;
}

export async function updateSupplierStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/suppliers/${id}/status`, { trang_thai });
  return res.data;
}
