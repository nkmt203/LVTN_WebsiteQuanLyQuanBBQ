import axiosClient from "./axiosClient";

export const getPendingOrders = () =>
  axiosClient.get("/kitchen/orders").then((r) => r.data);

export const completeOrderItem = (id) =>
  axiosClient.patch(`/kitchen/orders/${id}/complete`).then((r) => r.data);

export const acknowledgeCancellation = (id) =>
  axiosClient
    .patch(`/kitchen/orders/${id}/acknowledge-cancel`)
    .then((r) => r.data);
