import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EnumeratorDashboard = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    householdId: '', county: '', ward: '', age: '', gender: 'Male'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submit', {
        householdId: formData.householdId,
        location: { county: formData.county, ward: formData.ward },
        age: Number(formData.age),
        gender: formData.gender
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Data Submitted Successfully');
      setFormData({ ...formData, householdId: '', age: '' });
    } catch (error) {
      toast.error('Submission Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Enumerator Portal</h2>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Household ID</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.householdId}
              onChange={e => setFormData({...formData, householdId: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="County" className="p-2 border rounded" value={formData.county} onChange={e => setFormData({...formData, county: e.target.value})} />
            <input placeholder="Ward" className="p-2 border rounded" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Age" className="p-2 border rounded" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            <select className="p-2 border rounded" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Submit Record</button>
        </form>
      </div>
    </div>
  );
};

export default EnumeratorDashboard;
