import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SelectProfilePage from "./pages/auth/SelectProfilePage";
import AdminLayout from "./layouts/AdminLayout";
import FoodPage from "./pages/admin/FoodPage";
import CategoryPage from "./pages/admin/CategoryPage";
import UnitPage from "./pages/admin/UnitPage";
import IngredientPage from "./pages/admin/IngredientPage";
import RecipePage from "./pages/admin/RecipePage";
import TablePage from "./pages/admin/TablePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-profile" element={<SelectProfilePage />} />

          {/* Khu vực Admin - chặn theo vai trò */}
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
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
