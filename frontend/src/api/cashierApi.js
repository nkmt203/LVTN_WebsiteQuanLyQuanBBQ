import axiosClient from './axiosClient';

export const getBills = (trang_thai, tu_ngay, den_ngay) =>
  axiosClient
    .get('/cashier/bills', { params: { trang_thai, tu_ngay, den_ngay } })
    .then((r) => r.data);

export const getRevenueSummary = (tu_ngay, den_ngay) =>
  axiosClient
    .get('/cashier/revenue-summary', { params: { tu_ngay, den_ngay } })
    .then((r) => r.data);

export const getBillDetail = (id) =>
  axiosClient.get(`/cashier/bills/${id}`).then((r) => r.data);

export const payBill = (id, hinh_thuc_thanh_toan) =>
  axiosClient.post(`/cashier/bills/${id}/pay`, { hinh_thuc_thanh_toan }).then((r) => r.data);