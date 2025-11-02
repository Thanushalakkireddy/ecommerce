import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get("http://localhost:8050/api/admin/products");
      if (res.data.status && res.data.products) {
        const foundProduct = res.data.products.find(p => p._id === id);
        console.log("Found product:", foundProduct);
        console.log("Stock value:", foundProduct?.stock, "Type:", typeof foundProduct?.stock);
        setProduct(foundProduct);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    console.log("Adding to cart:", product);
    console.log("Quantity:", quantity);
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.productId === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: id,
        pname: product.pname,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart after adding:", cart);
    alert(`${quantity} x ${product.pname} added to cart!`);
  };

  const buyNow = () => {
    addToCart();
    navigate("/user/cart");
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:8050/api/user/wishlist/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(false);
        alert("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:8050/api/user/wishlist",
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        alert("Added to wishlist");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate("/user/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Check stock AVAILABILITY from STRING value
  const checkStockAvailability = (stockValue) => {
    if (!stockValue) return false; // null, undefined, or empty
    
    const stockStr = String(stockValue).toLowerCase().trim();
    
    // Check if stock is available based on string value
    // Handles: "available", "in stock", "yes", or any positive number
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
    
    // Everything else is considered not available
    // Handles: "not available", "out of stock", "no", "0", etc.
    return false;
  };
  
  const hasStock = checkStockAvailability(product.stock);
  
  // Debug: Log stock info
  console.log("=== PRODUCT STOCK DEBUG ===");
  console.log("Product:", product.pname);
  console.log("Raw stock value:", JSON.stringify(product.stock));
  console.log("Has stock available:", hasStock);
  console.log("=========================");

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-4 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white text-2xl hover:bg-white/20 p-2 rounded-full transition-all"
            >
              ←
            </button>
            <h1 className="text-lg font-semibold text-white">Product Details</h1>
          </div>
          <button
            onClick={toggleWishlist}
            className="text-2xl hover:bg-white/20 p-2 rounded-full transition-all"
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Product Container */}
        <div className="grid md:grid-cols-2 gap-6 p-4">
          {/* Product Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
            <div className="relative">
              <img
                src={product.imageUrl || "https://via.placeholder.com/400"}
                alt={product.pname}
                className="w-full h-96 object-contain rounded-lg"
                onError={(e) => e.target.src = "https://via.placeholder.com/400"}
              />
              {hasStock && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  ✓ {product.stock}
                </div>
              )}
              {!hasStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Product Title & Price Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.pname}</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <span className="text-4xl font-bold text-pink-600">₹{product.price}</span>
                  <span className="text-lg text-gray-500 line-through ml-3">₹{Math.floor(product.price * 1.3)}</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.floor(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100)}% OFF
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  hasStock
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hasStock ? `✓ ${product.stock}` : `✗ ${product.stock || 'Out of Stock'}`}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">📝 Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.desc}</p>
            </div>

            {/* Category Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">🏷️ Category</h3>
              <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                {product.categoryId?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Quantity Selector Card */}
            {hasStock && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">🔢 Select Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-6 py-3 rounded-lg font-bold text-xl transition-all shadow-md"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-16 text-center bg-gray-50 py-2 rounded-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-6 py-3 rounded-lg font-bold text-xl transition-all shadow-md"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-2">
                    (Stock: {product.stock})
                  </span>
                </div>
              </div>
            )}

            {/* Mobile Action Buttons - Hidden on Desktop */}
            {hasStock && (
              <div className="md:hidden flex gap-3">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={buyNow}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                >
                  ⚡ Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons - ALWAYS SHOW FOR TESTING */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-[9999]">
        <div className="max-w-7xl mx-auto">
          {/* Stock Status Banner */}
          <div className={`text-center mb-2 text-sm font-semibold ${
            hasStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {hasStock ? `✓ ${product.stock}` : `⚠️ ${product.stock || 'Out of Stock'}`}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              disabled={!hasStock}
              className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all ${
                hasStock 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">🛒 Add to Cart</span>
            </button>
            <button
              onClick={buyNow}
              disabled={!hasStock}
              className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all ${
                hasStock
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">⚡ Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
