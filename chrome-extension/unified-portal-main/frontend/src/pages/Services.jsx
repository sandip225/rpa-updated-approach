import { Link } from 'react-router-dom';
import { Zap, Flame, Droplets, Building, ArrowRight, ExternalLink, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHindi: 'बिजली',
      description: 'Name change application for electricity connection',
      icon: Zap,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      providers: [
        { name: 'Torrent Power', url: 'https://connect.torrentpower.com' },
        { name: 'PGVCL', url: 'https://www.pgvcl.com' },
        { name: 'UGVCL', url: 'https://www.ugvcl.com' },
        { name: 'MGVCL', url: 'https://www.mgvcl.com' },
        { name: 'DGVCL', url: 'https://www.dgvcl.com' }
      ]
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHindi: 'गैस',
      description: 'Name change application for gas connection',
      icon: Flame,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      iconBg: 'bg-indigo-100',
      providers: [
        { name: 'Adani Total Gas', url: 'https://www.adanigas.com' },
        { name: 'Gujarat Gas', url: 'https://iconnect.gujaratgas.com' },
        { name: 'Sabarmati Gas', url: 'https://www.sabarmatigas.com' }
      ]
    },
    {
      id: 'water',
      name: 'Water',
      nameHindi: 'पानी',
      description: 'Name change application for water connection',
      icon: Droplets,
      color: 'cyan',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      iconBg: 'bg-cyan-100',
      providers: [
        { name: 'AMC Water', url: 'https://ahmedabadcity.gov.in' },
        { name: 'SMC Water', url: 'https://www.suratmunicipal.gov.in' },
        { name: 'VMC Water', url: 'https://vmc.gov.in' },
        { name: 'GWSSB', url: 'https://gwssb.gujarat.gov.in' }
      ]
    },
    {
      id: 'property',
      name: 'Property',
      nameHindi: 'संपत्ति',
      description: 'Name change application for property records',
      icon: Building,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      providers: [
        { name: 'AnyRoR Gujarat', url: 'https://anyror.gujarat.gov.in' },
        { name: 'e-Dhara', url: 'https://revenuedepartment.gujarat.gov.in' },
        { name: 'e-Nagar', url: 'https://enagar.gujarat.gov.in' },
        { name: 'iORA', url: 'https://iora.gujarat.gov.in' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Name Change Services</h1>
            <p className="text-gray-500 text-sm">गुजरात सरकारी सेवाएं • Apply for name change in your utility connections</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-primary-500 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong className="text-gray-800">How it works:</strong> Select a service category below, fill in your details, and submit your application. You can track the status in "My Applications".
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div 
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className={`${service.bgColor} p-6 border-b ${service.borderColor}`}>
                <div className="flex items-center gap-4">
                  <div className={`${service.iconBg} p-3 rounded-lg`}>
                    <Icon className={`w-7 h-7 ${service.textColor}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${service.textColor}`}>{service.name}</h2>
                    <p className="text-gray-600 text-sm">{service.nameHindi}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">{service.description}</p>

                {/* Apply Button */}
                <Link
                  to={`/${service.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Official Portals */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Official Portals
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.providers.map((provider) => (
                      <a
                        key={provider.name}
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 border border-gray-200 flex items-center gap-1 transition-colors"
                      >
                        {provider.name} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Need Help?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Contact our support team for assistance
            </p>
          </div>
          <button className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
