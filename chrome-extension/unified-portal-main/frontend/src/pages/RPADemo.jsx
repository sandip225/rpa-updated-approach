import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Bot, ExternalLink, Zap, Flame, Droplets, Building, 
  ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react';

const RPADemo = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch applications');
    }
  };

  const openOfficialWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const services = [
    {
      category: 'Electricity',
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      providers: [
        { name: 'Torrent Power', url: 'https://connect.torrentpower.com', areas: 'Ahmedabad, Gandhinagar, Surat' },
        { name: 'PGVCL', url: 'https://www.pgvcl.com', areas: 'Rajkot, Jamnagar, Junagadh' },
        { name: 'UGVCL', url: 'https://www.ugvcl.com', areas: 'Mehsana, Sabarkantha' },
        { name: 'MGVCL', url: 'https://www.mgvcl.com', areas: 'Vadodara, Anand, Kheda' },
        { name: 'DGVCL', url: 'https://www.dgvcl.com', areas: 'Surat, Navsari, Valsad' }
      ]
    },
    {
      category: 'Gas',
      icon: Flame,
      gradient: 'from-red-400 to-rose-600',
      bgLight: 'bg-red-50',
      providers: [
        { name: 'Adani Total Gas', url: 'https://www.adanigas.com', areas: 'Ahmedabad, Vadodara' },
        { name: 'Gujarat Gas', url: 'https://iconnect.gujaratgas.com', areas: 'Surat, Bharuch, Vapi' },
        { name: 'Sabarmati Gas', url: 'https://www.sabarmatigas.com', areas: 'Gandhinagar, Mehsana' }
      ]
    },
    {
      category: 'Water',
      icon: Droplets,
      gradient: 'from-cyan-400 to-blue-500',
      bgLight: 'bg-cyan-50',
      providers: [
        { name: 'AMC Water', url: 'https://ahmedabadcity.gov.in', areas: 'Ahmedabad' },
        { name: 'SMC Water', url: 'https://www.suratmunicipal.gov.in', areas: 'Surat' },
        { name: 'VMC Water', url: 'https://vmc.gov.in', areas: 'Vadodara' },
        { name: 'GWSSB', url: 'https://gwssb.gujarat.gov.in', areas: 'State Wide' }
      ]
    },
    {
      category: 'Property',
      icon: Building,
      gradient: 'from-emerald-400 to-green-600',
      bgLight: 'bg-emerald-50',
      providers: [
        { name: 'AnyRoR Gujarat', url: 'https://anyror.gujarat.gov.in', areas: '7/12 & 8A Records' },
        { name: 'e-Dhara', url: 'https://revenuedepartment.gujarat.gov.in', areas: 'Land Mutation' },
        { name: 'e-Nagar', url: 'https://enagar.gujarat.gov.in', areas: 'Urban Property' },
        { name: 'iORA', url: 'https://iora.gujarat.gov.in', areas: 'Online Registration' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Official Government Portals
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Direct access to all Gujarat government service portals
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How to Use</h3>
              <p className="text-blue-800 text-sm">
                Click on any service provider below to open their official portal in a new tab. 
                Fill the form with your details and submit directly on their website.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.category}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${service.gradient} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/25 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{service.category}</h2>
                  </div>
                </div>

                {/* Providers */}
                <div className="p-6 space-y-3">
                  {service.providers.map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => openOfficialWebsite(provider.url)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl ${service.bgLight} border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group`}
                    >
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-800 group-hover:text-gray-900">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.areas}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 ml-3 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* My Applications Section */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>
            <div className="grid gap-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {app.service_type.toUpperCase()} - {app.application_type}
                      </h3>
                      <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'completed' ? 'bg-green-100 text-green-800' :
                          app.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Need Assistance?</h3>
              <p className="text-emerald-200 text-sm mt-1">
                Contact our support team for help with any government service
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPADemo;