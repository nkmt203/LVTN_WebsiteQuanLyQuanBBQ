const express = require("express");
const router = express.Router();

// Lấy các hàm xử lý từ controller
const foodController = require("../controllers/food.controller");

router.get("/", foodController.getAllFood);

module.exports = router;
