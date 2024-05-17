import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct, Product } from "../services/apiFacade";
import { useLocation } from "react-router-dom";
import "./productForm.css";

const EMPTY_PRODUCT: Product = {
  id: 0,
  name: "",
  price: 0,
  image: "",
};

export default function ProductForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  const productToEdit = location.state || EMPTY_PRODUCT;
  const [formData, setFormData] = useState<Product>(productToEdit);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const newProduct = await addProduct(formData);
      alert("New product added");
      setFormData(newProduct); // Refresh the form with new product data
    } catch (error) {
      setError("Error adding/editing product: " + error.message);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.id) {
      deleteProduct(formData.id);
      setFormData(EMPTY_PRODUCT);
      alert("Product deleted");
    }
  };

  return (
    <div className="product-form-container">
      <h2>{formData.id ? "Edit Product" : "Add Product"}</h2>
      <form className="product-form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={formData.price || 0} onChange={handleChange} />
        </label>
        <label>
          Image URL:
          <input type="text" name="image" value={formData.image || ""} onChange={handleChange} />
        </label>
        <button type="button" onClick={handleSubmit}>
          Save
        </button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
