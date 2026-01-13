import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Zap, Flame, Droplets, Building, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGuidedFlow from '../hooks/useGuidedFlow';
import api from '../api/axios';

const GuidedFlow = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selectedCategory,
    selectedProvider,
    chatHistory,
    formData,
    submissionResult,
    startFlow,
    selectCategory,
    selectProvider,
    updateFormData,
    submitSuccess,
    goBack,
    startNewApplication
  } = useGuidedFlow();

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([
    { id: 'electricity', name: 'Electricity', nameHindi: 'बिजली', icon: Zap, color: 'bg-yellow-500', providers: [] },
    { id: 'gas', name: 'Gas', nameHindi: 'गैस', icon: Flame, color: 'bg-red-500', providers: [] },
    { id: 'water', name: 'Water', nameHindi: 'पानी', icon: Droplets, color: 'bg-blue-500', providers: [] },
    { id: 'property', name: 'Property', nameHindi: 'संपत्ति', icon: Building, color: 'bg-green-500', providers: [] }
  ]);
  const [currentProviders, setCurrentProviders] = useState([]);
  const [formValues, setFormValues] = useState({
    consumerNumber: '',
    oldName: '',
    newName: '',
    mobile: '',
    email: ''
  });

  // Fetch providers when service is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchProviders(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchProviders = async (categoryId) => {
    try {
      const response = await api.get(`/guided-flow/providers/${categoryId}`);
      setCurrentProviders(response.data.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setCurrentProviders([]);
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'welcome': return 1;
      case 'service-select': return 2;
      case 'provider-select': return 3;
      case 'form': return 4;
      case 'confirmation': return 5;
      default: return 1;
    }
  };

  const handleStart = () => {
    startFlow();
  };

  const handleServiceSelect = (service) => {
    selectCategory(service);
  };

  const handleProviderSelect = (provider) => {
    selectProvider({ name: provider }, 'name_change');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/guided-flow/applications', {
        category: selectedCategory.id,
        provider_id: selectedProvider.name.toLowerCase().replace(/\s+/g, '-'),
        application_type: 'name_change',
        form_data: {
          consumer_number: formValues.consumerNumber,
          old_name: formValues.oldName,
          new_name: formValues.newName,
          mobile: formValues.mobile,
          email: formValues.email
        }
      });

      submitSuccess({
        message: 'Application submitted successfully!',
        trackingId: response.data.tracking_id
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar - Modern Design */}
        {currentStep !== 'welcome' && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
              <div 
                className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-green-500 to-orange-500 transition-all duration-500" 
                style={{ 
                  width: `${((getStepNumber() - 1) / 4) * 100}%`,
                  zIndex: 1 
                }} 
              />
              
              {/* Step Circles */}
              {[
                { num: 1, label: 'Start', icon: '🚀' },
                { num: 2, label: 'Service', icon: '⚡' },
                { num: 3, label: 'Provider', icon: '🏢' },
                { num: 4, label: 'Details', icon: '📝' },
                { num: 5, label: 'Done', icon: '✅' }
              ].map((step, idx) => (
                <div key={step.num} className="flex flex-col items-center relative" style={{ zIndex: 2 }}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.num < getStepNumber() 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-110' 
                      : step.num === getStepNumber() 
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg scale-125 animate-pulse' 
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {step.num < getStepNumber() ? '✓' : step.icon}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${
                    step.num <= getStepNumber() ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content - Modern Card Design */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header - Gradient with Glass Effect */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              {currentStep !== 'welcome' && currentStep !== 'confirmation' && (
                <button 
                  onClick={goBack} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Gujarat Citizen Helper
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>
                </h2>
                <p className="text-xs text-blue-100">गुजरात नागरिक सेवा सहायक</p>
              </div>
            </div>
          </div>

          {/* Chat Area - Modern Spacing */}
          <div className="p-4 min-h-[300px] bg-gradient-to-b from-gray-50 to-white">
            {/* Welcome Screen */}
            {currentStep === 'welcome' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Gujarat Citizen Services Portal
                </h1>
                <p className="text-lg text-gray-600 mb-1">
                  एकीकृत नागरिक सेवा पोर्टल
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Unified Portal for Government Services
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-xl mx-auto">
                  <p className="text-base text-gray-700 mb-3">
                    🙏 <strong>नमस्ते! Welcome!</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Apply for name change in your utility connections - <strong>Gas, Electricity, Water & Property</strong> - all in one place
                  </p>
                  <ul className="text-left text-sm text-gray-600 space-y-1">
                    <li>✓ Easy Process</li>
                    <li>✓ Track Status</li>
                    <li>✓ All Providers</li>
                    <li>✓ Secure & Safe</li>
                  </ul>
                </div>
                <button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Start Application →
                </button>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.length > 0 && (
              <div className="space-y-3 mb-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Selection - Modern Cards */}
            {currentStep === 'service-select' && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="relative p-5 rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all text-center group overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                      }}
                    >
                      {/* Hover Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.nameHindi}</p>
                        <div className="mt-2 inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                          Apply Now →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Provider Selection - Modern List */}
            {currentStep === 'provider-select' && selectedCategory && (
              <div className="mt-4">
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Selected Service:</p>
                  <p className="text-base font-bold text-blue-600 flex items-center gap-2">
                    {selectedCategory.name} ({selectedCategory.nameHindi})
                    <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">Step 3/5</span>
                  </p>
                </div>
                {currentProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading providers...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentProviders.map((provider, idx) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.name)}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all text-left flex items-center justify-between group shadow-sm hover:shadow-md"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            provider.type === 'government' 
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
                              : 'bg-gradient-to-br from-purple-100 to-purple-200'
                          }`}>
                            {provider.type === 'government' ? '🏛️' : '🏢'}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                              {provider.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {provider.type === 'government' ? 'Government' : 'Private'} • 
                              {provider.online_available ? ' Online Available' : ' Offline Only'}
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                          <span className="text-white text-sm font-bold">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            {currentStep === 'form' && (
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-3">
                <div className="p-3 bg-green-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-600">Selected Provider:</p>
                  <p className="text-sm font-bold text-green-600">{selectedProvider.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Consumer Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.consumerNumber}
                    onChange={(e) => setFormValues({...formValues, consumerNumber: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your consumer number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Current Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.oldName}
                    onChange={(e) => setFormValues({...formValues, oldName: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    New Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.newName}
                    onChange={(e) => setFormValues({...formValues, newName: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formValues.mobile}
                    onChange={(e) => setFormValues({...formValues, mobile: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address (optional)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application →'}
                </button>
              </form>
            )}

            {/* Confirmation */}
            {currentStep === 'confirmation' && submissionResult && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ✅ Application Submitted!
                </h2>
                <div className="bg-green-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-xs text-gray-600 mb-1">Tracking ID:</p>
                  <p className="text-xl font-bold text-green-600 mb-3">
                    {submissionResult.trackingId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your application has been submitted successfully. You can track your application status anytime.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/applications')}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Track Application
                  </button>
                  <button
                    onClick={startNewApplication}
                    className="bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                  >
                    New Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedFlow;
