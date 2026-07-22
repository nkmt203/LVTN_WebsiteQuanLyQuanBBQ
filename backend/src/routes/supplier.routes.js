const express = require("express");
const router = express.Router();
const c = require("../controllers/supplier.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", authorize("Admin"), c.getAllSuppliers);
router.get("/active", authorize("Admin"), c.getActiveSuppliers);
router.post("/", authorize("Admin"), c.createSupplier);
router.put("/:id", authorize("Admin"), c.updateSupplier);
router.patch("/:id/status", authorize("Admin"), c.updateSupplierStatus);

module.exports = router;
