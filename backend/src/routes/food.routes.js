const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const { upload } = require("../middlewares/upload");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get(
  "/",
  authorize("Admin", "Bep", "Phuc_vu"),
  foodController.getAllFood,
);
router.post(
  "/",
  authorize("Admin"),
  upload.single("hinh_anh"),
  foodController.createFood,
);
router.put(
  "/:id",
  authorize("Admin"),
  upload.single("hinh_anh"),
  foodController.updateFood,
);
router.patch(
  "/:id/status",
  authorize("Admin"),
  foodController.updateFoodStatus,
);
router.delete("/:id", authorize("Admin"), foodController.deleteFood);
module.exports = router;
