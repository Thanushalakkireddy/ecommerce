import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCategories() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post("http://localhost:8050/api/admin/category", {
        name: categoryName.trim()
      });

      if (response.data.status) {
        alert(response.data.message || "Category added successfully!");
        setCategoryName("");
        navigate("/adminHomePage");
      } else {
        alert(response.data.message || "Failed to add category.");
      }
    } catch (err) {
      console.error("Add category failed:", err);
      const errorMsg = err?.response?.data?.message || "Failed to add category. See console.";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="Enter category name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? "Saving..." : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/adminHomePage")}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
