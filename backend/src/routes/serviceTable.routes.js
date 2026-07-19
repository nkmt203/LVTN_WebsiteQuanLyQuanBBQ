const express = require("express");
const router = express.Router();
const c = require("../controllers/serviceTable.controller");
const {
  authenticate,
  authorize,
  requireProfile,
} = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/tables", authorize("Phuc_vu", "Admin"), c.getTablesMap);
router.post(
  "/tables/:id/open",
  authorize("Phuc_vu", "Admin"),
  requireProfile,
  c.openTable,
);
router.post(
  "/tables/:id/cancel",
  authorize("Phuc_vu", "Admin"),
  requireProfile,
  c.cancelTable,
);
module.exports = router;
