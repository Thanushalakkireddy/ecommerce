import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    loadCart();
    fetchAddresses();
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartData.length === 0) {
      navigate("/user/cart");
    }
    setCart(cartData);
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8050/api/user/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.status) {
        setAddresses(res.data.addresses);
        // Auto-select default address
        const defaultAddr = res.data.addresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8050/api/user/addresses",
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        setAddresses([...addresses, res.data.address]);
        setSelectedAddress(res.data.address);
        setShowAddressForm(false);
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: ""
        });
      }
    } catch (err) {
      alert("Failed to add address: " + err.response?.data?.message);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart,
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: calculateTotal()
      };

      const res = await axios.post(
        "http://localhost:8050/api/user/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        // Clear cart
        localStorage.removeItem("cart");
        alert("Order placed successfully! Order #" + res.data.order.orderNumber);
        navigate("/user/orders");
      }
    } catch (err) {
      alert("Failed to place order: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h1 className="text-lg font-semibold">Checkout</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Delivery Address Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showAddressForm ? "Cancel" : "+ Add New"}
            </button>
          </div>

          {/* Add Address Form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-4 p-4 bg-gray-50 rounded space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save Address
              </button>
            </form>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved addresses. Please add one.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-3 border-2 rounded cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <p className="text-sm text-gray-600">
                        {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                    <div>
                      {selectedAddress?._id === addr._id && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="space-y-2">
            {["COD", "UPI", "Card", "NetBanking"].map((method) => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-3 border-2 rounded cursor-pointer ${
                  paymentMethod === method ? "border-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{method === "COD" ? "Cash on Delivery" : method}</span>
                  {paymentMethod === method && <span className="text-blue-600">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.pname} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-pink-600">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress}
          className={`w-full font-semibold py-3 rounded ${
            loading || !selectedAddress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white`}
        >
          {loading ? "Placing Order..." : `Place Order - ₹${calculateTotal()}`}
        </button>
      </div>
    </div>
  );
}
