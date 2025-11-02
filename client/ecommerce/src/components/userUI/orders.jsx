import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:8050/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8050/api/user/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        alert("Order cancelled successfully");
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to cancel order: " + err.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      "Out for Delivery": "bg-indigo-100 text-indigo-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h1 className="text-lg font-semibold">My Orders</h1>
      </div>

      <div className="p-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate("/user/home")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow">
                {/* Order Header */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-pink-600">₹{order.totalAmount}</p>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {selectedOrder === order._id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.imageUrl || "https://via.placeholder.com/80"}
                        alt={item.pname}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => e.target.src = "https://via.placeholder.com/80"}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Order Details */}
                {selectedOrder === order._id && (
                  <div className="p-4 bg-gray-50 border-t space-y-4">
                    {/* Items List */}
                    <div>
                      <h3 className="font-semibold mb-2">Order Items:</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 bg-white p-2 rounded">
                            <img
                              src={item.imageUrl || "https://via.placeholder.com/60"}
                              alt={item.pname}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => e.target.src = "https://via.placeholder.com/60"}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.pname}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-semibold text-pink-600">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address:</h3>
                      <div className="bg-white p-3 rounded text-sm">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p className="text-gray-600">{order.shippingAddress.phone}</p>
                        <p className="text-gray-600">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                        </p>
                        <p className="text-gray-600">
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method:</h3>
                      <p className="bg-white p-3 rounded text-sm">{order.paymentMethod}</p>
                    </div>

                    {/* Cancel Button */}
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
          className="flex flex-col items-center"
        >
          <span>👤</span><span className="text-xs">Account</span>
        </button>
      </div>
    </div>
  );
}
