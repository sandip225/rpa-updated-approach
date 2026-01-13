import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Zap, Flame, Droplets, Building, ArrowRight, FileText, 
  CheckCircle, Clock, TrendingUp, ChevronRight, Sparkles
} from 'lucide-react';

const MobileDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHi: 'बिजली',
      icon: Zap,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      link: '/electricity'
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHi: 'गैस',
      icon: Flame,
      color: 'bg-gradient-to-br from-red-400 to-pink-500',
      link: '/gas'
    },
    {
      id: 'water',
      name: 'Water',
      nameHi: 'पानी',
      icon: Droplets,
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      link: '/water'
    },
    {
      id: 'property',
      name: 'Property',
      nameHi: 'संपत्ति',
      icon: Building,
      color: 'bg-gradient-to-br from-green-400 to-emerald-500',
      link: '/property'
    }
  ];

  const quickStats = [
    { label: 'Total', labelHi: 'कुल', value: stats.applications, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', labelHi: 'लंबित', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Done', labelHi: 'पूर्ण', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stats Cards - Horizontal Scroll */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex-shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-[10px] text-gray-400">{stat.labelHi}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Applications Card */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/applications')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">My Applications</p>
              <p className="text-sm text-white/80">मेरे आवेदन</p>
              {stats.pending > 0 && (
                <p className="text-xs text-white/70 mt-1">{stats.pending} pending review</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Services Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Services</h2>
            <p className="text-xs text-gray-500">सेवाएं</p>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="text-sm text-blue-600 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => navigate(service.link)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{service.name}</h3>
              <p className="text-xs text-gray-500">{service.nameHi}</p>
              <div className="mt-3 flex items-center text-blue-600 text-xs font-medium">
                Apply Now <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/documents')}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800 text-sm">My Documents</p>
                <p className="text-xs text-gray-500">मेरे दस्तावेज़</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800 text-sm">Track Status</p>
                <p className="text-xs text-gray-500">स्थिति ट्रैक करें</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-orange-900 text-sm mb-1">New Feature!</p>
              <p className="text-xs text-orange-700 leading-relaxed">
                Now apply for multiple services at once. Save time and effort!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileDashboard;
