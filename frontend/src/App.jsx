import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import SelectProfilePage from "./pages/auth/SelectProfilePage";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ServerLayout from "./layouts/ServerLayout";

// Admin pages
import FoodPage from "./pages/admin/FoodPage";
import CategoryPage from "./pages/admin/CategoryPage";
import UnitPage from "./pages/admin/UnitPage";
import IngredientPage from "./pages/admin/IngredientPage";
import RecipePage from "./pages/admin/RecipePage";
import TablePage from "./pages/admin/TablePage";
import WarehousePage from "./pages/admin/WarehousePage";
import SupplierPage from "./pages/admin/SupplierPage";
import EmployeePage from "./pages/admin/EmployeePage";
import OrderPage from "./pages/server/OrderPage";
// Server pages
import TableMapPage from "./pages/server/TableMapPage";

//Bếp
import KitchenLayout from "./layouts/KitchenLayout";
import KitchenPage from "./pages/kitchen/KitchenPage";

//thu ngân
import CashierLayout from "./layouts/CashierLayout";
import CashierPage from "./pages/cashier/CashierPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-profile" element={<SelectProfilePage />} />

          {/* Khu vực Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="food" replace />} />
            <Route path="food" element={<FoodPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="units" element={<UnitPage />} />
            <Route path="ingredients" element={<IngredientPage />} />
            <Route path="recipes" element={<RecipePage />} />
            <Route path="tables" element={<TablePage />} />
            <Route path="warehouse" element={<WarehousePage />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="employees" element={<EmployeePage />} />
          </Route>

          {/* Khu vực Phục vụ */}
          <Route
            path="/server"
            element={
              <ProtectedRoute allowedRoles={["Phuc_vu"]}>
                <ServerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="tables" replace />} />
            <Route path="tables" element={<TableMapPage />} />
            <Route path="order/:tableId" element={<OrderPage />} />
          </Route>

          {/* Khu vực Bếp */}
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute allowedRoles={["Bep"]}>
                <KitchenLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<KitchenPage />} />
          </Route>

          {/* Khu vực Thu ngân */}
          <Route
            path="/cashier"
            element={
              <ProtectedRoute allowedRoles={["Thu_ngan"]}>
                <CashierLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="bills" replace />} />
            <Route path="bills" element={<CashierPage />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
