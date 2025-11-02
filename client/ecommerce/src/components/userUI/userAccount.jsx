import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8050/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // If token is invalid, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    }
  };

  const menuItems = [
    { icon: "📦", label: "My Orders", action: () => navigate("/user/orders") },
    { icon: "❤️", label: "Wishlist", action: () => navigate("/user/wishlist") },
    { icon: "📍", label: "Saved Addresses", action: () => navigate("/user/addresses") },
    { icon: "🏷️", label: "Coupons", action: () => alert("Coupons coming soon!") },
    { icon: "💳", label: "Payment Methods", action: () => alert("Payment methods coming soon!") },
    { icon: "⚙️", label: "Settings", action: () => alert("Settings coming soon!") },
    { icon: "💬", label: "Help & Support", action: () => alert("Support coming soon!") },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">My Account</h1>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            className="bg-white p-4 rounded-lg shadow flex items-center gap-4 cursor-pointer hover:bg-gray-50"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="flex-1 font-medium">{item.label}</span>
            <span className="text-gray-400">›</span>
          </div>
        ))}

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="bg-white p-4 rounded-lg shadow flex items-center gap-4 cursor-pointer hover:bg-red-50 border border-red-200"
        >
          <span className="text-2xl">🚪</span>
          <span className="flex-1 font-medium text-red-600">Logout</span>
          <span className="text-gray-400">›</span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg mb-3">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-gray-400 text-sm mt-4 mb-20">
        <p>Version 1.0.0</p>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow">
        <button
          onClick={() => navigate("/user/home")}
          className="flex flex-col items-center"
        >
          <span>🏠</span><span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => navigate("/user/categories")}
          className="flex flex-col items-center"
        >
          <span>📂</span><span className="text-xs">Categories</span>
        </button>
        <button
          onClick={() => navigate("/user/cart")}
          className="flex flex-col items-center"
        >
          <span>🛒</span><span className="text-xs">Cart</span>
        </button>
        <button
          onClick={() => navigate("/user/account")}
          className="flex flex-col items-center text-blue-600"
        >
          <span>👤</span><span className="text-xs">Account</span>
        </button>
      </div>
    </div>
  );
}
