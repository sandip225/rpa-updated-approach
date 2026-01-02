import { useState } from 'react';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

// Field labels in Hindi/English
const FIELD_LABELS = {
  consumer_number: { en: 'Consumer Number', hi: 'उपभोक्ता संख्या' },
  service_number: { en: 'Service Number', hi: 'सेवा संख्या' },
  connection_id: { en: 'Connection ID', hi: 'कनेक्शन आईडी' },
  old_name: { en: 'Current Name', hi: 'वर्तमान नाम' },
  new_name: { en: 'New Name', hi: 'नया नाम' },
  old_owner: { en: 'Current Owner', hi: 'वर्तमान मालिक' },
  new_owner: { en: 'New Owner', hi: 'नया मालिक' },
  mobile: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  email: { en: 'Email Address', hi: 'ईमेल पता' },
  ward: { en: 'Ward Number', hi: 'वार्ड नंबर' },
  district: { en: 'District', hi: 'जिला' },
  taluka: { en: 'Taluka', hi: 'तालुका' },
  survey_number: { en: 'Survey Number', hi: 'सर्वे नंबर' },
  property_id: { en: 'Property ID', hi: 'संपत्ति आईडी' },
  bp_number: { en: 'BP Number', hi: 'बीपी नंबर' },
  t_no: { en: 'T Number', hi: 'टी नंबर' }
};

const ApplicationForm = ({ 
  provider, 
  category,
  onSubmit, 
  onBack,
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    provider.form_fields.forEach(field => {
      const value = formData[field]?.trim();
      
      if (!value) {
        newErrors[field] = 'This field is required';
      } else if (field === 'mobile' && !/^[6-9]\d{9}$/.test(value)) {
        newErrors[field] = 'Enter valid 10-digit mobile number';
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = 'Enter valid email address';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldLabel = (field) => {
    const labels = FIELD_LABELS[field] || { en: field.replace(/_/g, ' '), hi: field };
    return labels;
  };

  const getInputType = (field) => {
    if (field === 'email') return 'email';
    if (field === 'mobile') return 'tel';
    return 'text';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-semibold">Name Change Application</h3>
            <p className="text-xs text-orange-100">{provider.name} • नाम परिवर्तन आवेदन</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <p>📝 Fill in all details carefully. Fields marked with * are required.</p>
          <p className="text-xs mt-1 text-blue-600">सभी विवरण सावधानी से भरें। * वाले फ़ील्ड आवश्यक हैं।</p>
        </div>

        {/* Dynamic Form Fields */}
        {provider.form_fields.map((field) => {
          const labels = getFieldLabel(field);
          const hasError = errors[field];
          
          return (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {labels.en} <span className="text-gray-400 text-xs">({labels.hi})</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type={getInputType(field)}
                value={formData[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${labels.en.toLowerCase()}`}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                  hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {hasError && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {hasError}
                </p>
              )}
            </div>
          );
        })}

        {/* Terms */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p>By submitting this form, you agree to the terms and conditions of the service provider.</p>
          <p className="mt-1 text-gray-500">इस फॉर्म को जमा करके, आप सेवा प्रदाता के नियमों और शर्तों से सहमत हैं।</p>
        </div>
      </form>

      {/* Submit Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Application
              <span className="text-sm opacity-80">आवेदन जमा करें</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApplicationForm;
