import axiosClient from "./axiosClient";

export const getBillByTable = (tableId) =>
  axiosClient.get(`/orders/table/${tableId}`).then((r) => r.data);

// Gửi BATCH nhiều món
export const submitOrderBatch = (ma_hoa_don, items) =>
  axiosClient.post("/orders", { ma_hoa_don, items }).then((r) => r.data);

export const updateOrderItem = (id, data) =>
  axiosClient.put(`/orders/${id}`, data).then((r) => r.data);

export const cancelOrderItem = (id, ly_do_huy) =>
  axiosClient
    .delete(`/orders/${id}`, { data: { ly_do_huy } })
    .then((r) => r.data);
