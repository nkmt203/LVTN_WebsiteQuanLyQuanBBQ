const express = require("express");
const router = express.Router();
const c = require("../controllers/order.controller");
const {
  authenticate,
  authorize,
  requireProfile,
} = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get(
  "/table/:tableId",
  authorize("Phuc_vu", "Admin", "Thu_ngan"),
  c.getBillByTable,
);

router.post(
  "/",
  authorize("Phuc_vu", "Admin"),
  requireProfile,
  c.addOrderItems,
);

router.put(
  "/:id",
  authorize("Phuc_vu", "Admin"),
  requireProfile,
  c.updateOrderItem,
);

router.delete(
  "/:id",
  authorize("Phuc_vu", "Admin"),
  requireProfile,
  c.cancelOrderItem,
);

router.post('/bills/:id/request-payment',
  authorize('Phuc_vu', 'Admin'),
  requireProfile,
  c.requestPayment
);
module.exports = router;
