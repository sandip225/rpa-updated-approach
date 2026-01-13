import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, User, FileText, Settings, LogOut, Zap, Flame, Droplets, Building,
  Menu, X, Bell, ChevronDown, Shield, HelpCircle, MessageCircle
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/services', icon: Settings, label: 'Services' },
    { path: '/applications', icon: FileText, label: 'My Applications' },
    { path: '/guided-flow', icon: MessageCircle, label: 'Guided Flow' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6">
          {/* Top Header */}
          <div className="flex justify-between items-center py-2 text-xs border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="text-base">🇮🇳</span>
                <span className="font-medium">Government of Gujarat</span>
              </span>
              <span className="hidden md:inline text-gray-300">|</span>
              <span className="hidden md:inline text-gray-600">गुजरात सरकार</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <button className="hover:text-primary-600 transition-colors">Skip to Content</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-primary-600 transition-colors">Screen Reader</button>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
              
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center shadow-md">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Unified Services Portal
                  </h1>
                  <p className="text-xs text-gray-500">एकीकृत सेवा पोर्टल</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Service Icons */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <Zap className="w-5 h-5 text-yellow-600" title="Electricity" />
                <Flame className="w-5 h-5 text-orange-600" title="Gas" />
                <Droplets className="w-5 h-5 text-blue-600" title="Water" />
                <Building className="w-5 h-5 text-green-600" title="Property" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center font-semibold text-white text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.full_name || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <Link 
                      to="/documents" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">My Documents</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 lg:w-64'} bg-white shadow-sm min-h-[calc(100vh-140px)] transition-all duration-300 overflow-hidden border-r border-gray-200`}>
          <nav className="p-4">
            {/* Quick Stats */}
            <div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-100">
              <p className="text-xs text-gray-500 mb-1">Welcome back,</p>
              <p className="font-semibold text-gray-800">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 mt-2">{user?.email}</p>
            </div>

            {/* Navigation */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Main Menu
            </p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white shadow-sm'
                    : item.highlight
                    ? 'text-accent-600 bg-accent-50 hover:bg-accent-100 border border-accent-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.highlight && location.pathname !== item.path && (
                  <span className="ml-auto text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full">New</span>
                )}
              </Link>
            ))}

            {/* Help Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <HelpCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">Need Help?</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Contact our support team for assistance
              </p>
              <button className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                Get Support
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-140px)] bg-gray-50">
          <div className="w-full px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="w-full px-6 text-center">
          <p className="text-sm text-gray-600">© 2024 Unified Services Portal | Government of Gujarat</p>
          <p className="text-xs text-gray-500 mt-1">
            Designed & Developed for Digital Gujarat Initiative
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
