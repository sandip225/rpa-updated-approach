import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Zap, Flame, Droplets, Building, ArrowRight, FileText, 
  CheckCircle, Clock, User,
  MapPin, Phone, Mail
} from 'lucide-react';

// Utility functions to mask user information
const maskMobile = (mobile) => {
  if (!mobile) return '';
  const mobileStr = mobile.toString();
  if (mobileStr.length >= 4) {
    return '***' + mobileStr.slice(-4);
  }
  return '***' + mobileStr;
};

const maskEmail = (email) => {
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex > 0) {
    return '***' + email.substring(atIndex);
  }
  return '***@gmail.com';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const appsRes = await api.get('/applications/');
      const applications = appsRes.data || [];
      const pending = applications.filter(a => ['pending', 'draft', 'processing'].includes(a.status)).length;
      const completed = applications.filter(a => a.status === 'completed').length;
      
      setStats({
        applications: applications.length,
        pending: pending,
        completed: completed
      });
    } catch (error) {
      console.error('Failed to fetch stats');
      setStats({
        applications: 0,
        pending: 0,
        completed: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHindi: 'बिजली',
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      link: '/services/electricity',
      providers: ['Torrent Power', 'PGVCL', 'UGVCL', 'MGVCL', 'DGVCL']
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHindi: 'गैस',
      icon: Flame,
      gradient: 'from-red-400 to-rose-600',
      link: '/services/gas',
      providers: ['Adani Gas', 'Gujarat Gas', 'Sabarmati Gas']
    },
    {
      id: 'water',
      name: 'Water',
      nameHindi: 'पानी',
      icon: Droplets,
      gradient: 'from-cyan-400 to-blue-500',
      link: '/services/water',
      providers: ['AMC', 'SMC', 'VMC', 'GWSSB']
    },
    {
      id: 'property',
      name: 'Property',
      nameHindi: 'संपत्ति',
      icon: Building,
      gradient: 'from-emerald-400 to-green-600',
      link: '/services/property',
      providers: ['AnyRoR', 'e-Dhara', 'e-Nagar']
    }
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-blue-200 text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold">{user?.full_name || 'Citizen'}</h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20 text-sm">
            {user?.city && (
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4" />
                <span>{user.city}</span>
              </div>
            )}
            {user?.mobile && (
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4" />
                <span>{maskMobile(user.mobile)}</span>
              </div>
            )}
            {user?.email && (
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4" />
                <span>{maskEmail(user.email)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.applications}</p>
                <p className="text-xs text-gray-500">Total Applications</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-lg text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <Link
          to="/applications"
          className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-800">My Applications</p>
                <p className="text-xs text-gray-500">Track your submissions</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg text-white">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Services</h2>
          <Link to="/services" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${service.gradient} p-5`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <p className="text-white/80 text-xs">{service.nameHindi}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400">
                    Providers: {service.providers.slice(0, 2).join(', ')}
                    {service.providers.length > 2 && ` +${service.providers.length - 2} more`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;