const express = require("express");
const router = express.Router();
const c = require("../controllers/report.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/sales-history", authorize("Admin"), c.getSalesHistory);
router.get(
  "/ingredient-consumption",
  authorize("Admin"),
  c.getIngredientConsumption,
);

module.exports = router;
