const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", authorize("Admin"), recipeController.getAllRecipes);
router.get(
  "/food/:foodId",
  authorize("Admin", "Bep"),
  recipeController.getRecipeByFood,
);
router.post("/", authorize("Admin"), recipeController.createRecipes);
router.put("/:id", authorize("Admin"), recipeController.updateRecipe);
router.patch(
  "/:id/status",
  authorize("Admin"),
  recipeController.updateRecipeStatus,
);
router.delete("/:id", authorize("Admin"), recipeController.deleteRecipe);
module.exports = router;
