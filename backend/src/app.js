const express = require("express");
const cors = require("cors");
const path = require("path");

const foodRoutes = require("./routes/food.routes");
const categoryRoutes = require("./routes/category.routes");
const unitRoutes = require("./routes/unit.routes");
const ingredientRoutes = require("./routes/ingredient.routes");
const recipeRoutes = require("./routes/recipe.routes");
const authRouter = require("./routes/auth.routes");
const tableRoutes = require("./routes/table.routes");
const serviceTableRoutes = require("./routes/serviceTable.routes");
const orderRoutes = require("./routes/order.routes");
const kitchenRoutes = require("./routes/kitchen.routes");
const cashierRoutes = require('./routes/cashier.routes');
const supplierRoutes = require("./routes/supplier.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const employeeRoutes = require("./routes/employee.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRouter);

app.use("/api/food", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/service", serviceTableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/kitchen", kitchenRoutes);
// ...
app.use('/api/cashier', cashierRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reports", reportRoutes);
module.exports = app;
