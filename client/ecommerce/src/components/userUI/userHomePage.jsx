import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserHomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:8050/api/admin/products"),
        axios.get("http://localhost:8050/api/admin/viewCategory")
      ]);

      if (productsRes.data.status && productsRes.data.products) {
        console.log("Products:", productsRes.data.products); // Debug: Check stock values
        setProducts(productsRes.data.products);
      }
      if (categoriesRes.data.status && categoriesRes.data.data) {
        setCategories(categoriesRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/user/category/${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/user/product/${productId}`);
  };

  const addToCart = (product, event) => {
    event.stopPropagation(); // Prevent navigating to product details
    
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

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">🛍️ ShopHub</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/user/wishlist")}
                className="hover:bg-white/20 p-2 rounded-full transition-all"
                title="Wishlist"
              >
                <span className="text-xl">❤️</span>
              </button>
              <button 
                onClick={() => navigate("/user/cart")}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold transition-all backdrop-blur-sm"
              >
                🛒 Cart
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="flex max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="🔍 Search for products, brands and more..."
                className="flex-1 px-5 py-3 rounded-l-full outline-none text-gray-800 text-sm shadow-md"
              />
              <button 
                onClick={handleSearch}
                className="bg-yellow-400 hover:bg-yellow-500 px-6 rounded-r-full font-semibold text-gray-800 transition-all shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white shadow-sm sticky top-[120px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate("/user/categories")}
              className="flex flex-col items-center min-w-[70px] p-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-1">
                📂
              </div>
              <span className="text-xs font-medium text-gray-700">All</span>
            </button>
            
            {loading ? (
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center min-w-[70px] p-2 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-1"></div>
                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              categories.slice(0, 8).map((cat) => (
                <button
                  key={cat._id} 
                  onClick={() => handleCategoryClick(cat._id)}
                  className="flex flex-col items-center min-w-[70px] p-2 rounded-lg hover:bg-purple-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xl mb-1 group-hover:scale-110 transition-transform">
                    🏷️
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center line-clamp-1">{cat.name}</span>
                </button>
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-2">🎉 Mega Sale!</h2>
          <p className="text-lg mb-4">Up to 50% OFF on selected items</p>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:bg-orange-50 transition-all">
            Shop Now
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✨ Featured Products</h2>
          <button 
            onClick={() => navigate("/user/categories")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View All →
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((prod) => {
              const hasStock = checkStockAvailability(prod.stock);
              return (
              <div 
                key={prod._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div 
                  onClick={() => handleProductClick(prod._id)}
                  className="cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img 
                      src={prod.imageUrl || "https://via.placeholder.com/200"} 
                      alt={prod.pname} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => e.target.src = "https://via.placeholder.com/200"}
                    />
                    {hasStock && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        ✓ {prod.stock}
                      </div>
                    )}
                    {!hasStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                      {prod.pname}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xl font-bold text-pink-600">₹{prod.price}</div>
                        <div className="text-xs text-gray-500 line-through">₹{Math.floor(prod.price * 1.3)}</div>
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                        {Math.floor(((prod.price * 1.3 - prod.price) / (prod.price * 1.3)) * 100)}% OFF
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{prod.desc}</p>
                    {hasStock && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <span>✓</span>
                        <span>{prod.stock}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => addToCart(prod, e)}
                    disabled={!hasStock}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      !hasStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {!hasStock ? `❌ ${prod.stock || 'Out of Stock'}` : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow">
        <button 
          onClick={() => navigate("/user/home")}
          className="flex flex-col items-center text-blue-600"
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
