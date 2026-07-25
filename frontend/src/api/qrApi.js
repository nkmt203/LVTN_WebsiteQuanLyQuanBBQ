import axios from "axios";
import { BASE_URL } from "./apiConfig";

// Client riêng cho khách quét QR — không gắn JWT tài khoản nhân viên (interceptor
// của axiosClient), xác thực bằng phien_token của bàn thay vào đó.
const qrClient = axios.create({ baseURL: BASE_URL });

export const getQrSession = (qrCode) =>
  qrClient.get(`/qr/${qrCode}`).then((r) => r.data);

export const getQrBill = (qrCode, token) =>
  qrClient.get(`/qr/${qrCode}/bill`, { params: { token } }).then((r) => r.data);

export const submitQrOrder = (qrCode, token, items) =>
  qrClient.post(`/qr/${qrCode}/order`, { token, items }).then((r) => r.data);

export const cancelQrOrder = (qrCode, token) =>
  qrClient.delete(`/qr/${qrCode}/order`, { data: { token } }).then((r) => r.data);
