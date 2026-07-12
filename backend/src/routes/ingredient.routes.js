const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");

router.get("/", ingredientController.getAllIngredients);
router.post("/", ingredientController.createIngredient);
router.put("/:id", ingredientController.updateIngredient);
router.patch("/:id/status", ingredientController.updateIngredientStatus);
router.delete("/:id", ingredientController.deleteIngredient);
module.exports = router;
