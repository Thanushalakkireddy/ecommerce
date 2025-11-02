import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
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
        'http://localhost:8050/api/user/register',
        {
          name: formData.username,
          email: formData.email,
          pass: formData.pass
        }
      );
      if (response.data.status) {
        setMessage("Registration Successful! Please Log In.");
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-8 border-[#2874f0]">
        <h2 className="text-3xl font-bold mb-6 text-[#2874f0] text-center">Register</h2>
        <span className="text-green-600 mb-4 text-center block font-medium">{message}</span>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-4 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] placeholder-gray-500 border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
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
          Register
        </button>
        <div className="mt-4 text-[#2874f0] text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}