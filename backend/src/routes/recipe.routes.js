const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");

router.get("/", recipeController.getAllRecipes);
router.get("/food/:foodId", recipeController.getRecipeByFood);
router.post("/", recipeController.createRecipes);
router.put("/:id", recipeController.updateRecipe);
router.patch("/:id/status", recipeController.updateRecipeStatus);
router.delete("/:id", recipeController.deletRecipe);
module.exports = router;
