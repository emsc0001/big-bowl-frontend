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
  const [product, setProduct] = useState<Product[]>([]);
  const productToEdit = useLocation().state || EMPTY_PRODUCT;
  const [formData, setFormData] = useState<Product>(productToEdit || EMPTY_PRODUCT);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getProducts().then((res) => setProduct(res));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      const newProduct = await addProduct(formData);
      alert("New product added");
      console.info("New/Edited Product", newProduct);
      setFormData(newProduct);
    } catch (error) {
      setError("Error adding/editing product");
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
    <div>
      <h2>{productToEdit.id ? "Edit Product" : "Add Product"}</h2>
      <form id="productForm">
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        <label>Price</label>
        <input name="price" value={formData.price} onChange={handleChange} />
        <label>Image</label>
        <input name="image" value={formData.image} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>
          Save
        </button>
        {productToEdit.id && (
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
