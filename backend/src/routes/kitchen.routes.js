const express = require("express");
const router = express.Router();
const c = require("../controllers/kitchen.controller");
const {
  authenticate,
  authorize,
  requireProfile,
} = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/orders", authorize("Bep", "Admin"), c.getPendingOrders);

router.patch(
  "/orders/:id/complete",
  authorize("Bep", "Admin"),
  requireProfile,
  c.completeOrderItem,
);

router.patch(
  "/orders/:id/acknowledge-cancel",
  authorize("Bep", "Admin"),
  requireProfile,
  c.acknowledgeCancellation,
);

router.get("/bills/:billId", authorize("Bep", "Admin"), c.getBillDetail);
module.exports = router;
