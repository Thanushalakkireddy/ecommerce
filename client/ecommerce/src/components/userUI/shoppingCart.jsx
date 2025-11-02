import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/user/checkout");
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-2xl">←</button>
          <h1 className="text-lg font-semibold">Shopping Cart ({cart.length})</h1>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 text-sm hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4">
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some products to get started</p>
            <button
              onClick={() => navigate("/user/home")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/100"}
                      alt={item.pname}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.pname}</h3>
                      <p className="text-pink-600 font-bold mb-2">₹{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button & Subtotal */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                      <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg p-4 shadow mb-20">
              <h3 className="font-semibold text-lg mb-4">Price Details</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Price ({cart.length} items)</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
              <p className="text-green-600 text-sm">
                You will save ₹0 on this order
              </p>
            </div>
          </>
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold text-pink-600">₹{calculateTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded hover:bg-orange-600"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
