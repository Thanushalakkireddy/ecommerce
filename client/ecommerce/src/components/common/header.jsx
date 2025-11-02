import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-blue-600 px-3 py-2 shadow-md">
      <div className="flex items-center justify-between">
        
        <div>
          <h1 className="text-white text-[28px] font-bold">Flipkart</h1>
        </div>

    
        
        <div className="flex items-center">
          <Link to="/login">
            <button className="bg-white text-blue-600 font-semibold rounded-sm px-4 py-1 mr-3 hover:bg-gray-200">
              Logout
            </button>
          </Link>
          <Link to="/cart">
            <button className="bg-yellow-400 text-black font-semibold rounded-sm px-4 py-1 hover:bg-yellow-300">
              🛒 Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}