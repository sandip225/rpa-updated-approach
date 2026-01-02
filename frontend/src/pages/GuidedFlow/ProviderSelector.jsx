import { ArrowLeft, ExternalLink, FileEdit, Building2, Briefcase } from 'lucide-react';

const ProviderSelector = ({ 
  category, 
  providers, 
  onSelectProvider, 
  onBack,
  categoryName,
  categoryNameHindi
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-semibold">{categoryName} Providers</h3>
            <p className="text-xs text-blue-100">{categoryNameHindi} प्रदाता • Select your provider</p>
          </div>
        </div>
      </div>

      {/* Provider List */}
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {providers.map((provider) => (
          <div 
            key={provider.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
          >
            {/* Provider Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  provider.type === 'government' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {provider.type === 'government' ? <Building2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    provider.type === 'government'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {provider.type === 'government' ? '🏛️ Government' : '🏢 Private'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Name Change Button - Only show if online_available */}
              {provider.online_available && (
                <button
                  onClick={() => onSelectProvider(provider, 'name_change')}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <FileEdit className="w-4 h-4" />
                  Name Change
                </button>
              )}

              {/* Official Portal Link */}
              {provider.portal_url && (
                <a
                  href={provider.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-300 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Portal
                </a>
              )}
            </div>

            {/* RPA Badge */}
            {provider.rpa_enabled && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Auto-submission enabled
              </div>
            )}

            {/* Offline Notice */}
            {!provider.online_available && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                ⚠️ Online service not available. Please visit the official portal.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Select a provider to continue with your application
        </p>
      </div>
    </div>
  );
};

export default ProviderSelector;
