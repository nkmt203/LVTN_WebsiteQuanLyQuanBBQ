const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/login", authController.login);

router.get("/profiles", authenticate, authController.getProfiles);
router.post("/select-profile", authenticate, authController.selectProfile);
router.post("/end-shift", authenticate, authController.endShift);
router.get("/me", authenticate, authController.me);

module.exports = router;
