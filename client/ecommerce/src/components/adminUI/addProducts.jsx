import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pname: "",
    desc: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: ""
  });
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8050/api/admin/viewCategory");
        if (res.data.status && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post("http://localhost:8050/api/admin/products", {
        pname: form.pname,
        desc: form.desc,
        price: parseFloat(form.price) || 0,
        stock: form.stock,
        imageUrl: form.imageUrl,
        categoryId: form.categoryId
      });
      
      if (response.data.status) {
        alert(response.data.message || "Product added successfully!");
        navigate("/adminHomePage");
      } else {
        alert(response.data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Add product failed:", err);
      const errorMsg = err?.response?.data?.message || "Failed to add product. See console.";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="pname" value={form.pname} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="desc" value={form.desc} onChange={onChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input name="price" value={form.price} onChange={onChange} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input name="stock" value={form.stock} onChange={onChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                name="categoryId" 
                value={form.categoryId} 
                onChange={onChange} 
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={onChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
              {saving ? "Saving..." : "Add Product"}
            </button>
            <button type="button" onClick={() => navigate("/adminHomePage")} className="px-4 py-2 rounded border">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}