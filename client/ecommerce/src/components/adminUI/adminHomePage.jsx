import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    lowStockProducts: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Check stock AVAILABILITY from STRING value
  const checkStockAvailability = (stockValue) => {
    if (!stockValue) return false;
    
    const stockStr = String(stockValue).toLowerCase().trim();
    
    // Check if stock is available
    if (stockStr === 'available' || 
        stockStr === 'in stock' || 
        stockStr === 'yes' ||
        stockStr.includes('available')) {
      return true;
    }
    
    // Check if it's a number string
    const numValue = parseInt(stockStr, 10);
    if (!isNaN(numValue) && numValue > 0) {
      return true;
    }
    
    return false;
  };

  // Get stock display status
  const getStockStatus = (stockValue) => {
    const hasStock = checkStockAvailability(stockValue);
    
    if (!hasStock) {
      return { status: 'out', label: stockValue || 'Out of Stock', color: 'bg-red-100 text-red-800' };
    }
    
    // Check if it's a number to determine low stock
    const numValue = parseInt(stockValue, 10);
    if (!isNaN(numValue)) {
      if (numValue < 10) {
        return { status: 'low', label: stockValue, color: 'bg-orange-100 text-orange-800' };
      }
      return { status: 'good', label: stockValue, color: 'bg-green-100 text-green-800' };
    }
    
    // For text-based stock ("available", etc.)
    return { status: 'good', label: stockValue, color: 'bg-green-100 text-green-800' };
  };

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:8050/api/admin/products"),
        axios.get("http://localhost:8050/api/admin/viewCategory")
      ]);

      const productsData = productsRes.data.products || [];
      const categoriesData = categoriesRes.data.data || [];

      setProducts(productsData);

      // Calculate statistics
      setStats({
        totalProducts: productsData.length,
        totalCategories: categoriesData.length,
        totalUsers: 0, // Placeholder - add user endpoint if available
        lowStockProducts: productsData.filter(p => {
          const stockStr = String(p.stock).toLowerCase().trim();
          const numValue = parseInt(stockStr, 10);
          // Low stock if it's a number less than 10 but greater than 0
          return !isNaN(numValue) && numValue < 10 && numValue > 0;
        }).length
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`text-5xl ${color} opacity-80`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">📊 Admin Dashboard</h1>
              <p className="text-sm text-white/80">Manage your e-commerce platform</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold transition-all backdrop-blur-sm"
            >
              🚪 Logout
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link to="/addProducts">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">➕</span>
                  <span>Add Product</span>
                </button>
              </Link>
              <Link to="/editProducts">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">✏️</span>
                  <span>Edit Products</span>
                </button>
              </Link>
              <Link to="/addCategories">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">🏷️</span>
                  <span>Add Category</span>
                </button>
              </Link>
              <Link to="/editCategories">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">📝</span>
                  <span>Edit Categories</span>
                </button>
              </Link>
              <Link to="/viewUsers">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">👥</span>
                  <span>View Users</span>
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <span className="text-xl">📈</span>
                  <span>Analytics</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="📦"
              title="Total Products"
              value={stats.totalProducts}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon="🏷️"
              title="Categories"
              value={stats.totalCategories}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <StatCard
              icon="👥"
              title="Total Users"
              value={stats.totalUsers}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon="⚠️"
              title="Low Stock Alert"
              value={stats.lowStockProducts}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>
        </div>

        {/* Recent Products Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">📦 All Products</h2>
              <Link to="/addProducts">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
                  <span>➕</span>
                  <span>Add New</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">⌛</div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first product</p>
                <Link to="/addProducts">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                    ➕ Add First Product
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => {
                      const stockInfo = getStockStatus(product.stock);
                      
                      return (
                        <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl || "https://via.placeholder.com/60"}
                                alt={product.pname}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => e.target.src = "https://via.placeholder.com/60"}
                              />
                              <div>
                                <p className="font-semibold text-gray-800">{product.pname}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{product.desc}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockInfo.color}`}>
                              {stockInfo.status === 'out' ? '❌ ' : ''}{stockInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {product.categoryId?.name || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => navigate('/editProducts', { state: { product } })}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/viewUsers" className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage customer accounts</p>
            </div>
          </Link>
          
          <Link to="/dashboard" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View sales and performance metrics</p>
            </div>
          </Link>
          
          <Link to="/editCategories" className="group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-3">🏷️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Categories</h3>
              <p className="text-sm text-gray-600">Organize your product catalog</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
