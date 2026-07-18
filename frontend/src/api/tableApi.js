import axiosClient from './axiosClient';

export const getZonesList = () =>
  axiosClient.get('/tables/zones').then((r) => r.data);

export const getAllTables = (params = {}) =>
  axiosClient.get('/tables', { params }).then((r) => r.data);

export const createTable = (data) =>
  axiosClient.post('/tables', data).then((r) => r.data);

export const updateTable = (id, data) =>
  axiosClient.put(`/tables/${id}`, data).then((r) => r.data);

export const deleteTable = (id) =>
  axiosClient.delete(`/tables/${id}`).then((r) => r.data);