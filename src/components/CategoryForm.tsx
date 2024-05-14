import { useState, useEffect } from "react";
import { getCategories, addCategory, Category } from "../services/apiFacade";
import { useLocation } from "react-router-dom";

const EMPTY_CATEGORY = {
  id: null,
  name: "",
};

export default function CategoryForm() {
  const [categories, setCategories] = useState([""]);
  const categoryToEdit = useLocation().state || null;

  const [formData, setFormData] = useState<Category>(categoryToEdit || EMPTY_CATEGORY);
  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     if (formData.id) {
  //       deleteCategory(Number(formData.id));
  //       setFormData(EMPTY_CATEGORY);
  //     }
  //   };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newCategory = await addCategory(formData);
    alert("New Category added");
    console.info("New/Edited Category", newCategory);
  };

  return (
    <>
      <h2>Category Add/Edit/Delete</h2>
      <form id="categoryForm">
        <div className="form-group">
          <label htmlFor="id">ID:</label>
          <input type="text" id="id" name="id" disabled value={formData.id || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
      </form>
      <button onClick={handleSubmit} className="category-form-btn">
        Submit
      </button>
      <button
        className="category-form-btn"
        onClick={() => {
          setFormData(EMPTY_CATEGORY);
        }}
      >
        Cancel
      </button>
      {formData.id && (
        <>
          <button className="category-form-btn" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}

      <p>{JSON.stringify(formData)}</p>
    </>
  );
}
