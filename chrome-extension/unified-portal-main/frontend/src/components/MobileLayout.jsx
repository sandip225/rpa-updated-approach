import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, FileText, User, Menu, X, Bell, Shield, 
  Zap, Flame, Droplets, Building, ChevronRight, LogOut
} from 'lucide-react';
import { useState } from 'react';

const MobileLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomNavItems = [
    { path: '/', icon: Home, label: 'Home', labelHi: 'होम' },
    { path: '/services', icon: Menu, label: 'Services', labelHi: 'सेवाएं' },
    { path: '/applications', icon: FileText, label: 'Applications', labelHi: 'आवेदन' },
    { path: '/profile', icon: User, label: 'Profile', labelHi: 'प्रोफ़ाइल' },
  ];

  const quickServices = [
    { name: 'Electricity', nameHi: 'बिजली', icon: Zap, color: 'bg-yellow-500', path: '/electricity' },
    { name: 'Gas', nameHi: 'गैस', icon: Flame, color: 'bg-orange-500', path: '/gas' },
    { name: 'Water', nameHi: 'पानी', icon: Droplets, color: 'bg-blue-500', path: '/water' },
    { name: 'Property', nameHi: 'संपत्ति', icon: Building, color: 'bg-green-500', path: '/property' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Gradient Style (Paytm-like) */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Greeting */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80">Welcome</p>
                <h1 className="text-base font-bold">{user?.full_name?.split(' ')[0] || 'User'}</h1>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-700"></span>
              </button>
              <button 
                onClick={() => setDrawerOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Services Row (PhonePe-style) */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickServices.map((service) => (
              <button
                key={service.path}
                onClick={() => navigate(service.path)}
                className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                <div className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center`}>
                  <service.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-white">{service.name}</p>
                  <p className="text-[10px] text-white/70">{service.nameHi}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 min-h-[calc(100vh-180px)]">
        <Outlet />
      </main>

      {/* Bottom Navigation - Modern Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50' 
                    : ''
                }`}
              >
                <div className={`${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'} w-10 h-10 rounded-xl flex items-center justify-center transition-all`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                  <p className={`text-[8px] ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                    {item.labelHi}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Side Drawer (Swiggy/Zomato style) */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-slide-left">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{user?.full_name || 'User'}</h2>
                    <p className="text-sm text-white/80">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Quick Actions */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Quick Actions</p>
                  
                  <Link
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">My Profile</p>
                        <p className="text-xs text-gray-500">मेरी प्रोफ़ाइल</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>

                  <Link
                    to="/documents"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">My Documents</p>
                        <p className="text-xs text-gray-500">मेरे दस्तावेज़</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>

                {/* All Services */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">All Services</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quickServices.map((service) => (
                      <button
                        key={service.path}
                        onClick={() => {
                          navigate(service.path);
                          setDrawerOpen(false);
                        }}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 text-center">{service.name}</p>
                        <p className="text-xs text-gray-500 text-center">{service.nameHi}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Help & Support */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                  <p className="font-medium text-blue-900 mb-1">Need Help?</p>
                  <p className="text-xs text-blue-700 mb-3">Contact our support team</p>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Get Support
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-3 w-full p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                  <span className="text-sm">लॉग आउट</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-left {
          animation: slideLeft 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;
