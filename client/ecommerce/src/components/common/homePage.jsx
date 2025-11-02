import React from "react";

const categories = [
  { name: "Fashion", icon: "👗" },
  { name: "Mobiles", icon: "📱" },
  { name: "Electronics", icon: "💻" },
  { name: "Appliances", icon: "🧊" },
  { name: "Beauty", icon: "💄" },
];

const products = [
  { name: "Men's T-Shirt", price: "₹599", desc: "Slide into trend", img: "https://via.placeholder.com/80" },
  { name: "Women's Sneakers", price: "₹999", desc: "Min. 40% Off", img: "https://via.placeholder.com/80" },
  { name: "Liquid Foundation", price: "₹499", desc: "Up to 20% Off", img: "https://via.placeholder.com/80" },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-purple-200 to-white min-h-screen pb-24">
      
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-4 flex flex-col gap-2">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button className="bg-white rounded-full px-3 py-1 font-bold text-blue-700">Flipkart</button>
            <button className="bg-white rounded-full px-3 py-1 font-bold text-blue-700">Pay</button>
            <button className="bg-white rounded-full px-3 py-1 font-bold text-blue-700">Grocery</button>
          </div>
        </div>
        <div className="text-white text-sm">📍 521230 Select delivery location</div>
        
        <div className="flex mt-2">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="flex-1 px-4 py-2 rounded-l-md outline-none"
          />
          <button className="bg-yellow-400 px-4 rounded-r-md">🔍</button>
        </div>
      </div>

      
      <div className="flex gap-4 justify-around bg-white py-4 shadow">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs">{cat.name}</span>
          </div>
        ))}
      </div>

      
      <div className="mx-4 my-4 rounded-lg overflow-hidden shadow">
        <img
          src="https://via.placeholder.com/400x120?text=Big+Sale+Banner"
          alt="Banner"
          className="w-full"
        />
      </div>

      <div className="mx-4 my-4 rounded-lg overflow-hidden shadow"></div>
      <div className="mx-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod.name} className="bg-white rounded-lg p-4 flex flex-col items-center shadow">
            <img src={prod.img} alt={prod.name} className="w-20 h-20 object-cover mb-2" />
            <div className="font-semibold">{prod.name}</div>
            <div className="text-pink-600 font-bold">{prod.price}</div>
            <div className="text-xs text-gray-500">{prod.desc}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 my-4 rounded-lg overflow-hidden shadow"></div>
      <div className="mx-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod.name} className="bg-white rounded-lg p-4 flex flex-col items-center shadow">
            <img src={prod.img} alt={prod.name} className="w-20 h-20 object-cover mb-2" />
            <div className="font-semibold">{prod.name}</div>
            <div className="text-pink-600 font-bold">{prod.price}</div>
            <div className="text-xs text-gray-500">{prod.desc}</div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow">
        <button className="flex flex-col items-center text-blue-600"><span>🏠</span><span className="text-xs">Home</span></button>
        <button className="flex flex-col items-center"><span>🎮</span><span className="text-xs">Play</span></button>
        <button className="flex flex-col items-center"><span>📂</span><span className="text-xs">Categories</span></button>
        <button className="flex flex-col items-center"><span>👤</span><span className="text-xs">Account</span></button>
        <button className="flex flex-col items-center"><span>🛒</span><span className="text-xs">Cart</span></button>
      </div>
    </div>
  );
}