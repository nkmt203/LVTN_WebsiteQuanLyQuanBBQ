const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const { upload } = require("../middlewares/upload");

router.get("/", foodController.getAllFood);
router.post("/", upload.single("hinh_anh"), foodController.createFood);
router.put("/:id", upload.single("hinh_anh"), foodController.updateFood);
router.patch('/:id/status', foodController.updateFoodStatus);
router.delete("/:id", foodController.deleteFood);
module.exports = router;
