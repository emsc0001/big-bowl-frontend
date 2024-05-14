import { useState, useEffect } from "react";
import { getCategories } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>();
  const auth = useAuth();

  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  return (
    <>
      <h2>Categories</h2>
      <p>Browse recipes by category.</p>

      <ul>
        {categories?.map((category, index) => (
          <li key={index}>
            <Link to={`/${category.id}`}>{category.name}</Link>
            {category}
            {auth.isLoggedInAs(["ADMIN", "USER"]) && (
              <Link className="recipe-btn" to="/addCategory" state={category}>
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export const Desktops = () => <h3>Desktop PC Page</h3>;
export const Laptops = () => <h3>Laptops Page</h3>;

interface Category {
  id: number | null;
  name: string;
}
