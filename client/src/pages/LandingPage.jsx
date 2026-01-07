import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Database, ShieldCheck, Activity } from 'lucide-react';

const LandingPage = () => {
  const [stats, setStats] = useState({ totalHouseholds: 0, countiesCovered: 0 });

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/public/stats');
        setStats(data);
      } catch (error) {
        console.error("Could not fetch public stats", error);
      }
    };
    fetchPublicStats();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">DataFlow in Shaddytec</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Real-Time Data Ingestion <br />
              <span className="text-indigo-600">for Modern Analytics</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10">
              A full-stack platform simulating field enumeration. Collect data, 
              run automated quality checks, and visualize insights instantly.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Enumeration
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                View Admin Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Stats (Public) */}
      <div className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">{stats.totalHouseholds}</div>
              <div className="text-indigo-200 font-medium">Households Enumerated</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">{stats.countiesCovered}</div>
              <div className="text-indigo-200 font-medium">Counties Covered</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2 flex justify-center items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span>Online</span>
              </div>
              <div className="text-indigo-200 font-medium">System Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ingestion Pipeline</h3>
              <p className="text-gray-500">
                Robust ETL process that accepts raw field data, normalizes strings, and structures it for analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Control</h3>
              <p className="text-gray-500">
                Automated validation logic flags outliers (e.g., Age &gt; 120) and missing values in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Dashboards</h3>
              <p className="text-gray-500">
                Powered by WebSockets and Recharts to show enumeration progress as it happens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;