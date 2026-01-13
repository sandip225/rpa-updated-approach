import { ArrowLeft, ExternalLink, FileEdit, Building2, Briefcase, Star, Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProviderSelector = ({ 
  category, 
  providers, 
  onSelectProvider, 
  onBack,
  categoryName,
  categoryNameHindi,
  favorites = [],
  onToggleFavorite
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort providers
  const filteredProviders = providers
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'favorites') {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h3 className="font-semibold">{categoryName} {t('selectProvider')}</h3>
            <p className="text-xs text-blue-100">{categoryNameHindi} प्रदाता • {t('selectProvider')}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'name'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {t('filter')}
          </motion.button>
          <motion.button
            onClick={() => setSortBy('favorites')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
              sortBy === 'favorites'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4" />
            {t('favorite')}
          </motion.button>
        </div>
      </div>

      {/* Provider List */}
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('search')} results not found</p>
          </div>
        ) : (
          filteredProviders.map((provider, index) => (
            <motion.div 
              key={provider.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Provider Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
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
                <motion.button
                  onClick={() => onToggleFavorite && onToggleFavorite(provider.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star 
                    className={`w-5 h-5 ${
                      favorites.includes(provider.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {/* Name Change Button - Only show if online_available */}
                {provider.online_available && (
                  <motion.button
                    onClick={() => onSelectProvider(provider, 'name_change')}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileEdit className="w-4 h-4" />
                    {t('nameChange')}
                  </motion.button>
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
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {t('selectProvider')} to continue with your application
        </p>
      </div>
    </motion.div>
  );
};

export default ProviderSelector;
