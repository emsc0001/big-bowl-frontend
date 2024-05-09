import { useState, useEffect } from "react";
import { getProducts, Product } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./Products.css";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>();
  const auth = useAuth();

  useEffect(() => {
    getProducts().then((res) => setProducts(res));
  }, []);

  return (
    <div className="products-container">
      <header className="header">
        <h2>Produkter</h2>
        <p>Se Produkter:</p>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />
      <main className="main-content">
        <ul className="product-list">
          {products?.map((product, index) => (
            <li className="product-item" key={index}>
              <Link to={`/${product.id}`}>
                {product.name} - {product.price}
              </Link>
              {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                <Link className="product-btn" to="/addProduct" state={product}>
                  Edit
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Big Bowl. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
};
