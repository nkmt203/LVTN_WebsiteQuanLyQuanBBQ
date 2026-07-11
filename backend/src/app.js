const express = require("express");
const cors = require("cors");
const path = require("path");

const foodRoutes = require("./routes/food.routes");
const categoryRoutes = require("./routes/category.routes");
const unitRoutes = require("./routes/unit.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/food", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/units", unitRoutes);

module.exports = app;
