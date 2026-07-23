import axiosClient from './axiosClient';

export const getTablesMap = () =>
  axiosClient.get('/service/tables').then((r) => r.data);

export const openTable = (id) =>
  axiosClient.post(`/service/tables/${id}/open`).then((r) => r.data);

export const cancelTable = (id) =>
  axiosClient.post(`/service/tables/${id}/cancel`).then((r) => r.data);

export const transferTable = (id, ma_ban_dich) =>
  axiosClient.post(`/service/tables/${id}/transfer`, { ma_ban_dich }).then((r) => r.data);