import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id && categories.length > 0) {
      const category = categories.find(cat => cat._id === id);
      setSelectedCategory(category);
    }
  }, [id, categories]);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8050/api/admin/viewCategory"),
        axios.get("http://localhost:8050/api/admin/products")
      ]);

      if (categoriesRes.data.status && categoriesRes.data.data) {
        setCategories(categoriesRes.data.data);
      }
      if (productsRes.data.status && productsRes.data.products) {
        setProducts(productsRes.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.categoryId?._id === categoryId);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/user/category/${category._id}`);
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

  const filteredProducts = selectedCategory
    ? getProductsByCategory(selectedCategory._id)
    : products;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-2xl">←</button>
          <h1 className="text-lg font-semibold">
            {selectedCategory ? selectedCategory.name : 'All Categories'}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : (
        <>
          {/* Show category selection only when no specific category is selected */}
          {!id && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const count = getProductsByCategory(category._id).length;
                  return (
                    <div
                      key={category._id}
                      onClick={() => handleCategoryClick(category)}
                      className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow text-center"
                    >
                      <div className="text-4xl mb-2">🏷️</div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{count} items</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="p-4">
            {id && (
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  {selectedCategory?.name || 'Products'}
                  <span className="text-sm text-gray-500 ml-2">
                    ({filteredProducts.length} items)
                  </span>
                </h2>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl font-semibold mb-2">No products found</p>
                <p className="text-gray-500 mb-4">This category doesn't have any products yet</p>
                <button
                  onClick={() => navigate('/user/home')}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                  >
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
                      <p className="text-xs text-green-600 mt-1">Stock: {product.stock}</p>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="w-full mt-3 bg-blue-600 text-white py-2 rounded font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

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
          className="flex flex-col items-center text-blue-600"
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
