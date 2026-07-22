const express = require("express");
const router = express.Router();
const c = require("../controllers/employee.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", authorize("Admin"), c.getAllEmployees);
router.get("/accounts", authorize("Admin"), c.getActiveAccounts);
router.post("/", authorize("Admin"), c.createEmployee);
router.put("/:id", authorize("Admin"), c.updateEmployee);
router.patch("/:id/status", authorize("Admin"), c.updateEmployeeStatus);

module.exports = router;
