import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import FoodPage from "./pages/admin/FoodPage";
import CategoryPage from "./pages/admin/CategoryPage";
import UnitPage from "./pages/admin/UnitPage";
import IngredientPage from "./pages/admin/IngredientPage";
import RecipePage from "./pages/admin/RecipePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="food" replace />} />
          <Route path="food" element={<FoodPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="units" element={<UnitPage />} />
          <Route path="ingredients" element={<IngredientPage />} />
          <Route path="recipes" element={<RecipePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
