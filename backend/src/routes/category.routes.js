const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", authorize("Admin", "Bep"), categoryController.getAllCategories);
router.post("/", authorize("Admin"), categoryController.createCategory);
router.put("/:id", authorize("Admin"), categoryController.updateCategory);
router.patch(
  "/:id/status",
  authorize("Admin"),
  categoryController.updateCategoryStatus,
);
router.delete("/:id", authorize("Admin"), categoryController.deleteCategory);

module.exports = router;
