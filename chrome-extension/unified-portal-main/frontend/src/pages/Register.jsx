import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, User, Phone, MapPin, UserPlus, Shield, Zap, Flame, Droplets, Building } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    mobile: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const gujaratCities = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad',
    'Mehsana', 'Morbi', 'Surendranagar', 'Bharuch', 'Navsari'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Top Strip */}
      <div className="h-1 bg-primary-500"></div>
      
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex justify-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-yellow-600" />
          <Flame className="w-6 h-6 text-orange-600" />
          <Droplets className="w-6 h-6 text-blue-600" />
          <Building className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Gujarat Unified Services Portal</h1>
        <p className="text-gray-600 text-sm mt-1">गुजरात एकीकृत सेवा पोर्टल</p>
      </div>

      {/* Register Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Card Header */}
            <div className="bg-success-500 px-8 py-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Citizen Registration</h2>
              <p className="text-green-100 text-sm mt-1">नागरिक पंजीकरण</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-success-500 focus:ring-2 focus:ring-success-100 outline-none transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-success-500 focus:ring-2 focus:ring-success-100 outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-success-500 focus:ring-2 focus:ring-success-100 outline-none transition-colors"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-success-500 focus:ring-2 focus:ring-success-100 outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Select your city</option>
                    {gujaratCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-success-500 focus:ring-2 focus:ring-success-100 outline-none transition-colors"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-success-500 text-white py-3 rounded-lg font-semibold hover:bg-success-600 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-success-600 font-semibold hover:text-success-700 transition-colors duration-300 hover:underline">
                    Login Here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>🇮🇳 Government of Gujarat | सत्यमेव जयते</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
