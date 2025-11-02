import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8050/api/admin/allUsers");
      if (res.data.status && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pb-24">
      <div className="bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">User Management</h1>
        <button
          onClick={() => navigate("/adminHomePage")}
          className="bg-white px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="p-6">
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold">All Registered Users ({users.length})</h2>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users registered yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="border px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="border px-4 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="border px-4 py-3 text-left text-sm font-semibold">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">{user.name || "N/A"}</td>
                    <td className="border px-4 py-3">{user.email}</td>
                    <td className="border px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
