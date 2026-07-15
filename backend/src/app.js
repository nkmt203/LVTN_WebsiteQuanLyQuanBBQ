const express = require("express");
const cors = require("cors");
const path = require("path");

const foodRoutes = require("./routes/food.routes");
const categoryRoutes = require("./routes/category.routes");
const unitRoutes = require("./routes/unit.routes");
const ingredientRoutes = require("./routes/ingredient.routes");
const recipeRoutes = require("./routes/recipe.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

console.log("DEBUG routes:", {
  foodRoutes: typeof foodRoutes,
  categoryRoutes: typeof categoryRoutes,
  unitRoutes: typeof unitRoutes,
  ingredientRoutes: typeof ingredientRoutes,
  recipeRoutes: typeof recipeRoutes,
  authRoutes: typeof authRouter,
});

app.use("/api/auth", authRouter);

app.use("/api/food", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);

module.exports = app;
