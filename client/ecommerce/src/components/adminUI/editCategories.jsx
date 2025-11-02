import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8050/api/admin/viewCategory");
      if (res.data.status && res.data.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setCategoryName(category.name);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8050/api/admin/category/${editingCategory}`,
        { name: categoryName.trim() }
      );

      if (response.data.status) {
        alert(response.data.message || "Category updated successfully!");
        setEditingCategory(null);
        setCategoryName("");
        fetchCategories();
      } else {
        alert(response.data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all products in this category!`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8050/api/admin/categoryDelete/${categoryId}`
      );

      if (response.data.status) {
        alert(response.data.message || "Category deleted successfully!");
        fetchCategories();
      } else {
        alert(response.data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pb-24">
      <div className="bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Manage Categories</h1>
        <button
          onClick={() => navigate("/adminHomePage")}
          className="bg-white px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No categories available.</p>
            <button
              onClick={() => navigate("/addCategories")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow border">
              <h2 className="text-lg font-semibold mb-2">All Categories ({categories.length})</h2>
            </div>
            
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white p-4 rounded shadow border"
              >
                {editingCategory === category._id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category Name</label>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
