import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8050/api/admin/products"),
        axios.get("http://localhost:8050/api/admin/viewCategory"),
        axios.get("http://localhost:8050/api/admin/allUsers")
      ]);

      const products = productsRes.data.products || [];
      const categories = categoriesRes.data.data || [];
      const users = usersRes.data.data || [];

      // Get 5 most recent products
      const recentProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        recentProducts
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pb-24">
      <div className="bg-blue-700 p-4">
        <h1 className="text-white text-2xl font-bold">Dashboard Analytics</h1>
      </div>

      <div className="p-6">
        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Products Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalProducts}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/editProducts")}
                  className="mt-3 text-blue-600 text-sm hover:underline"
                >
                  Manage Products →
                </button>
              </div>

              {/* Total Categories Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Categories</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalCategories}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/editCategories")}
                  className="mt-3 text-green-600 text-sm hover:underline"
                >
                  Manage Categories →
                </button>
              </div>

              {/* Total Users Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Registered Users</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/viewUsers")}
                  className="mt-3 text-purple-600 text-sm hover:underline"
                >
                  View All Users →
                </button>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recently Added Products</h2>
              {stats.recentProducts.length === 0 ? (
                <p className="text-gray-500">No products added yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Product Name</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Stock</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Added On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentProducts.map((product) => (
                        <tr key={product._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">{product.pname}</td>
                          <td className="px-4 py-3">₹{product.price}</td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3">{product.categoryId?.name || "N/A"}</td>
                          <td className="px-4 py-3">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate("/addProducts")}
                  className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
                >
                  + Add Product
                </button>
                <button
                  onClick={() => navigate("/addCategories")}
                  className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700"
                >
                  + Add Category
                </button>
                <button
                  onClick={() => navigate("/editProducts")}
                  className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700"
                >
                  Edit Products
                </button>
                <button
                  onClick={() => navigate("/editCategories")}
                  className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700"
                >
                  Edit Categories
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
