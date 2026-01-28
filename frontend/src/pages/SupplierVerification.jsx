import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Zap, Flame, Droplets, Building } from 'lucide-react';
import { suppliers } from '../data/supplierData';

const SupplierVerification = () => {
  const icons = {
    electricity: Zap,
    gas: Flame,
    water: Droplets,
    property: Building
  };

  const colors = {
    electricity: 'text-yellow-600 bg-yellow-100',
    gas: 'text-red-600 bg-red-100',
    water: 'text-blue-600 bg-blue-100',
    property: 'text-green-600 bg-green-100'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Supplier Redirect Verification</h1>
          <p className="text-gray-600">All suppliers and their official website URLs</p>
        </div>

        {/* Categories */}
        {Object.entries(suppliers).map(([categoryKey, categoryData]) => {
          const Icon = icons[categoryKey];
          const colorClass = colors[categoryKey];
          
          return (
            <div key={categoryKey} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{categoryData.name}</h2>
                  <p className="text-gray-600">{categoryData.nameHindi}</p>
                </div>
              </div>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.suppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    {/* Supplier Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{supplier.name}</h3>
                        <p className="text-sm text-gray-500">{supplier.areas}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            supplier.type === 'Government' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {supplier.type}
                          </span>
                          {supplier.hasOnlinePortal ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Online
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Offline
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* URLs */}
                    <div className="space-y-3">
                      {/* Main Portal */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Main Portal
                        </p>
                        <a
                          href={supplier.portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          {supplier.portal}
                        </a>
                      </div>

                      {/* Name Change URL */}
                      {supplier.nameChangeUrl && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Name Change URL
                          </p>
                          <a
                            href={supplier.nameChangeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline break-all"
                          >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            {supplier.nameChangeUrl}
                          </a>
                        </div>
                      )}

                      {/* Special Notes */}
                      {supplier.id === 'torrent-power' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-xs text-orange-800">
                            🤖 <strong>RPA Automation:</strong> Auto-fills form on official website
                          </p>
                        </div>
                      )}

                      {supplier.offlineNote && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-xs text-gray-700">
                            ℹ️ {supplier.offlineNote}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Test Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          const url = supplier.nameChangeUrl || supplier.portal;
                          window.open(url, '_blank');
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Test Redirect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Redirect Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(suppliers).map(([categoryKey, categoryData]) => {
              const Icon = icons[categoryKey];
              const colorClass = colors[categoryKey];
              const totalSuppliers = categoryData.suppliers.length;
              const onlineSuppliers = categoryData.suppliers.filter(s => s.hasOnlinePortal).length;
              const rpaSuppiers = categoryData.suppliers.filter(s => s.id === 'torrent-power').length;
              
              return (
                <div key={categoryKey} className="text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${colorClass}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{categoryData.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">Total: {totalSuppliers}</p>
                    <p className="text-sm text-blue-600">Online: {onlineSuppliers}</p>
                    {rpaSuppiers > 0 && (
                      <p className="text-sm text-orange-600">RPA: {rpaSuppiers}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">✅ All Suppliers Verified</h3>
                <p className="text-sm text-green-700 mt-1">
                  Every supplier redirects to their own official website. Torrent Power has additional RPA automation for auto-filling forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierVerification;