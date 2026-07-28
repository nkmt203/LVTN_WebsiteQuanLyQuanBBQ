const express = require("express");
const router = express.Router();
const c = require("../controllers/qrOrder.controller");

// Route công khai — khách quét QR bằng điện thoại, KHÔNG qua middleware authenticate
// (xác thực bằng phien_token của bàn thay vì JWT tài khoản)
router.get("/:qrCode", c.getQrSession);
router.get("/:qrCode/bill", c.getQrBill);
router.post("/:qrCode/order", c.submitQrOrder);
router.delete("/:qrCode/order", c.cancelQrOrder);
router.post("/:qrCode/ai-suggest", c.suggestFood);

module.exports = router;
