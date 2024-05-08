import { Route, Routes } from "react-router-dom";
import { Categories } from "./recipes/Categories";
import CategoryForm from "./recipes/CategoryForm";
import Recipe from "./recipes/Recipe";
// import Recipes from "./recipes/RecipeList";
import RecipesLayout from "./recipes/RecipesLayout";
import RecipeForm from "./recipes/RecipeForm";
import Login from "./security/Login";
import Logout from "./security/Logout";
import RequireAuth from "./security/RequireAuth";
import Layout from "./Layout";
import Home from "./Home";
import "./App.css";

export default function App() {
  //const auth = useAuth();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/" element={<Categories />} />
        <Route path="/recipes/" element={<RecipesLayout />}>
          <Route path=":id" element={<Recipe />} />
        </Route>

        <Route
          path="/addRecipe"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <RecipeForm />
            </RequireAuth>
          }
        />

        <Route
          path="/addCategory"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <CategoryForm />
            </RequireAuth>
          }
        />
        {/* <Route path="/add" */}

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Layout>
  );
}
