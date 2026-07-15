import axiosClient from './axiosClient';

export async function login(ten_dang_nhap, mat_khau) {
  const res = await axiosClient.post('/auth/login', { ten_dang_nhap, mat_khau });
  return res.data;
}

export async function getProfiles() {
  const res = await axiosClient.get('/auth/profiles');
  return res.data;
}

export async function selectProfile(ma_nhan_vien) {
  const res = await axiosClient.post('/auth/select-profile', { ma_nhan_vien });
  return res.data;
}

export async function endShift() {
  const res = await axiosClient.post('/auth/end-shift');
  return res.data;
}