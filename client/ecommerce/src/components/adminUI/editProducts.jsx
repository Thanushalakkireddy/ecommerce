import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    pname: "",
    desc: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8050/api/admin/products");
      if (res.data.status && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setForm({
      pname: product.pname,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId?._id || product.categoryId
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({
      pname: "",
      desc: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: ""
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:8050/api/admin/editProducts/${editingProduct}`,
        form
      );

      if (response.data.status) {
        alert(response.data.message || "Product updated successfully!");
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(response.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8050/api/admin/deleteProduct/${productId}`
      );

      if (response.data.status) {
        alert(response.data.message || "Product deleted successfully!");
        fetchProducts();
      } else {
        alert(response.data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete product");
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pb-24">
      <div className="bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Edit Products</h1>
        <button
          onClick={() => navigate("/adminHomePage")}
          className="bg-white px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded shadow border"
              >
                {editingProduct === product._id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          name="pname"
                          value={form.pname}
                          onChange={onChange}
                          required
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          name="price"
                          value={form.price}
                          onChange={onChange}
                          type="number"
                          step="0.01"
                          required
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="desc"
                        value={form.desc}
                        onChange={onChange}
                        className="w-full border px-3 py-2 rounded"
                        rows="2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input
                          name="stock"
                          value={form.stock}
                          onChange={onChange}
                          required
                          className="w-full border px-3 py-2 rounded"
                        />
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
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          name="imageUrl"
                          value={form.imageUrl}
                          onChange={onChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
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
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{product.pname}</h3>
                        <p className="text-gray-600 text-sm">{product.desc}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="font-medium">Price:</span> ₹{product.price}
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span> {product.stock}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {product.categoryId?.name || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Image:</span>{" "}
                        {product.imageUrl ? (
                          <a
                            href={product.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </div>
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
