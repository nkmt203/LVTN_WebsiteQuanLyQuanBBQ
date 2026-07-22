import axiosClient from './axiosClient';

export async function getInventory(params = {}) {
  const res = await axiosClient.get('/warehouse/inventory', { params });
  return res.data;
}

export async function updateMinStock(maNguyenLieu, muc_ton_toi_thieu) {
  const res = await axiosClient.patch(`/warehouse/inventory/${maNguyenLieu}`, { muc_ton_toi_thieu });
  return res.data;
}

export async function getImportReceipts(params = {}) {
  const res = await axiosClient.get('/warehouse/imports', { params });
  return res.data;
}

export async function getImportReceiptDetail(id) {
  const res = await axiosClient.get(`/warehouse/imports/${id}`);
  return res.data;
}

export async function createImportReceipt(data) {
  const res = await axiosClient.post('/warehouse/imports', data);
  return res.data;
}

export async function getExportReceipts(params = {}) {
  const res = await axiosClient.get('/warehouse/exports', { params });
  return res.data;
}

export async function getExportReceiptDetail(id) {
  const res = await axiosClient.get(`/warehouse/exports/${id}`);
  return res.data;
}

export async function createExportReceipt(data) {
  const res = await axiosClient.post('/warehouse/exports', data);
  return res.data;
}
