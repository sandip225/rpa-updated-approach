import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Zap, Flame, Droplets, Building, ArrowRight, FileText, 
  CheckCircle, Clock, User, ExternalLink,
  MapPin, Phone, Mail
} from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHindi: 'बिजली',
      description: 'Name change for electricity connection',
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      link: '/electricity',
      providers: ['Torrent Power', 'PGVCL', 'UGVCL', 'MGVCL', 'DGVCL']
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHindi: 'गैस',
      description: 'Name change for gas connection',
      icon: Flame,
      gradient: 'from-red-400 to-rose-600',
      link: '/gas',
      providers: ['Adani Gas', 'Gujarat Gas', 'Sabarmati Gas']
    },
    {
      id: 'water',
      name: 'Water',
      nameHindi: 'पानी',
      description: 'Name change for water connection',
      icon: Droplets,
      gradient: 'from-cyan-400 to-blue-500',
      link: '/water',
      providers: ['AMC', 'SMC', 'VMC', 'GWSSB']
    },
    {
      id: 'property',
      name: 'Property',
      nameHindi: 'संपत्ति',
      description: 'Name change for property records',
      icon: Building,
      gradient: 'from-emerald-400 to-green-600',
      link: '/property',
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
                <span>{user.mobile}</span>
              </div>
            )}
            {user?.email && (
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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

      {/* Quick Action - My Applications */}
      <Link
        to="/applications"
        className="group flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">My Applications</h3>
            <p className="text-sm text-gray-500">
              {stats.pending > 0 ? `${stats.pending} pending review` : 'Track your submissions'}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </Link>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Name Change Services</h2>
          <Link to="/services" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={service.link}
                className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${service.gradient} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-white/80 text-xs">{service.nameHindi}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-xs text-gray-400">
                    Providers: {service.providers.join(', ')}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Official Portals */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Official Government Portals
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Digital Gujarat', url: 'https://digitalgujarat.gov.in' },
            { name: 'AnyRoR Gujarat', url: 'https://anyror.gujarat.gov.in' },
            { name: 'Torrent Power', url: 'https://connect.torrentpower.com' },
            { name: 'Gujarat Gas', url: 'https://iconnect.gujaratgas.com' },
            { name: 'AMC', url: 'https://ahmedabadcity.gov.in' }
          ].map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-1"
            >
              {portal.name} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;