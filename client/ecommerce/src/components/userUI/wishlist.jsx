import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:8050/api/user/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:8050/api/user/wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        setWishlist(wishlist.filter(item => item.productId._id !== productId));
      }
    } catch (err) {
      alert("Failed to remove from wishlist: " + err.response?.data?.message);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        pname: product.pname,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.pname} added to cart!`);
  };

  const handleProductClick = (productId) => {
    navigate(`/user/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h1 className="text-lg font-semibold">My Wishlist ({wishlist.length})</h1>
      </div>

      <div className="p-4">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-4">Add products you love to your wishlist</p>
            <button
              onClick={() => navigate("/user/home")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((item) => {
              const product = item.productId;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <span className="text-red-500">❌</span>
                  </button>

                  <div
                    onClick={() => handleProductClick(product._id)}
                    className="cursor-pointer"
                  >
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/150"}
                      alt={product.pname}
                      className="w-full h-40 object-cover mb-2 rounded"
                      onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                    />
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {product.pname}
                    </h3>
                    <p className="text-pink-600 font-bold mb-1">₹{product.price}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.desc}</p>
                    <p className={`text-xs mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`w-full mt-3 py-2 rounded font-semibold text-sm ${
                      product.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              );
            })}
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
