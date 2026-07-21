import axiosClient from './axiosClient';

export const getBills = (trang_thai) =>
  axiosClient.get('/cashier/bills', { params: { trang_thai } }).then((r) => r.data);

export const getBillDetail = (id) =>
  axiosClient.get(`/cashier/bills/${id}`).then((r) => r.data);

export const payBill = (id, hinh_thuc_thanh_toan) =>
  axiosClient.post(`/cashier/bills/${id}/pay`, { hinh_thuc_thanh_toan }).then((r) => r.data);