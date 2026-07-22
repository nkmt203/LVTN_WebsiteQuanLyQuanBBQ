const express = require("express");
const router = express.Router();
const c = require("../controllers/warehouse.controller");
const {
  authenticate,
  authorize,
  requireProfile,
} = require("../middlewares/auth.middleware");

router.use(authenticate);
router.use(authorize("Admin"));

router.get("/inventory", c.getInventory);
router.patch("/inventory/:maNguyenLieu", c.updateMinStock);

router.get("/imports", c.getImportReceipts);
router.get("/imports/:id", c.getImportReceiptDetail);
router.post("/imports", requireProfile, c.createImportReceipt);

router.get("/exports", c.getExportReceipts);
router.get("/exports/:id", c.getExportReceiptDetail);
router.post("/exports", requireProfile, c.createExportReceipt);

module.exports = router;
