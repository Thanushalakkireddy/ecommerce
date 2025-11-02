import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query && products.length > 0) {
      const results = products.filter(product =>
        product.pname.toLowerCase().includes(query.toLowerCase()) ||
        product.desc.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8050/api/admin/products");
      if (res.data.status && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/user/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-2xl">←</button>
          <h1 className="text-lg font-semibold">
            Search Results for "{query}"
          </h1>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {loading ? (
          <p>Searching...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600 mb-4">
              Try different keywords or browse our categories
            </p>
            <button
              onClick={() => navigate("/user/home")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
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
                  <p className="text-pink-600 font-bold">₹{product.price}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{product.desc}</p>
                  <p className="text-xs text-green-600 mt-1">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
