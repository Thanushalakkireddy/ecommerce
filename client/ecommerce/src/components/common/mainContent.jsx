import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function setCookie(name, value, days) {
  const expire = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expire}; path=/`;
}

export default function MainContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("user"); // user/admin
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`http://localhost:8050/api/${role}/login`, {
        email,
        pass, // send plain password
      });

      if (res.status === 200 && res.data.token) {
        setCookie("authToken", res.data.token, 1);
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful ✅");

        // Navigate based on role
        if (role === "admin") {
          navigate("/adminHomePage"); // Admin dashboard
        } else {
          navigate("/user/home"); // User home page
        }
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Invalid credentials ❌");
      } else {
        setMessage("Server not reachable. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-8 border-[#2874f0]">
        <h2 className="text-3xl font-bold mb-6 text-[#2874f0] text-center">Sign In</h2>
        {message && <span className="text-red-600 mb-4 block text-center">{message}</span>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] placeholder-gray-500 border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        />

        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="Password"
          required
          className="w-full mb-6 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] placeholder-gray-500 border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded-md bg-[#f0f5ff] text-[#212121] border border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="button"
          className="w-full bg-[#fb641b] hover:bg-[#f57224] text-white font-semibold py-2 rounded-md transition-colors duration-200"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-4 text-[#2874f0] text-sm text-center">
          New user? <Link to="/signup" className="font-semibold hover:underline">Sign up now</Link>
        </div>
      </div>
    </div>
  );
}
