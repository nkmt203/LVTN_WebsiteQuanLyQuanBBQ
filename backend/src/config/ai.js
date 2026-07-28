const { GoogleGenAI } = require("@google/genai");

// Nghiệp vụ 2.3.1.14 (AI tư vấn món ăn): mọi yêu cầu tư vấn phải đi qua máy chủ
// trung gian này trước khi tới AI — tuyệt đối không gửi API key hay gọi AI
// trực tiếp từ thiết bị khách hàng.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

// Bước 3: thời gian chờ phản hồi AI tối đa 10 giây
const TIMEOUT_MS = 10000;

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

module.exports = { ai, MODEL, TIMEOUT_MS };
