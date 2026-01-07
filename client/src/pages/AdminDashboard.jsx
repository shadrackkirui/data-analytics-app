import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const socket = io('https://data-analytics-app-uymy.onrender.com');

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, valid: 0, flagged: 0, byCounty: [] });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('https://data-analytics-app-uymy.onrender.com/api/analytics', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats(); // Initial fetch
    socket.on('new_submission', () => fetchStats());
    return () => socket.off('new_submission');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Analytics</h1>
        <div className="flex gap-4">
          <Link to="/" className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">Home</Link>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Valid Data</h3>
          <p className="text-3xl font-bold text-green-600">{stats.valid}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Flagged Issues</h3>
          <p className="text-3xl font-bold text-red-600">{stats.flagged}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow h-96">
        <h3 className="text-lg font-medium mb-4">Submissions by County</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.byCounty} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
            <XAxis dataKey="_id" angle={-45} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
