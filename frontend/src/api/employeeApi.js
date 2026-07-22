import axiosClient from './axiosClient';

export async function getAllEmployees(params = {}) {
  const res = await axiosClient.get('/employees', { params });
  return res.data;
}

export async function getActiveAccounts() {
  const res = await axiosClient.get('/employees/accounts');
  return res.data;
}

export async function createEmployee(data) {
  const res = await axiosClient.post('/employees', data);
  return res.data;
}

export async function updateEmployee(id, data) {
  const res = await axiosClient.put(`/employees/${id}`, data);
  return res.data;
}

export async function updateEmployeeStatus(id, trang_thai) {
  const res = await axiosClient.patch(`/employees/${id}/status`, { trang_thai });
  return res.data;
}
