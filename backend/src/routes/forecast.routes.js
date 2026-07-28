const express = require("express");
const router = express.Router();
const c = require("../controllers/forecast.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", authorize("Admin"), c.getForecast);

module.exports = router;
