import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig.js";

export default function Login() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    pass: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        {
          email: formData.email,
          pass: formData.pass
        }
      );
      
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        setMessage("Login Successful!");
        // Redirect to user home page
        setTimeout(() => navigate('/user/home'), 1500);
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-8 border-[#2874f0]">
        <h2 className="text-3xl font-bold mb-6 text-[#2874f0] text-center">Login</h2>
        <span className="text-red-600 mb-4 text-center block font-medium">{message}</span>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-4 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] placeholder-gray-500 border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        />
        <input
          type="password"
          name="pass"
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-6 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] placeholder-gray-500 border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        />
        <button
          type="button"
          className="w-full bg-[#fb641b] hover:bg-[#f57224] text-white font-semibold py-2 rounded-md transition-colors duration-200"
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className="mt-4 text-[#2874f0] text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}