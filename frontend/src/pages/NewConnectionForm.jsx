import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, ExternalLink, Zap, CheckCircle } from 'lucide-react';

const NewConnectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Select Provider, 2: Fill Form, 3: Success
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // DGVCL Providers
  const providers = [
    { 
      id: 'dgvcl', 
      name: 'DGVCL', 
      fullName: 'Dakshin Gujarat Vij Company Limited',
      areas: 'Surat, Navsari, Valsad, Tapi',
      portal: 'https://portal.guvnl.in',
      newConnectionUrl: 'https://portal.guvnl.in/LTConsumerReg.php'
    }
  ];

  useEffect(() => {
    // Pre-fill user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicant_name: user.full_name || '',
        mobile: user.mobile || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Save application to database
      const appResponse = await api.post('/applications/', {
        service_type: 'electricity',
        application_type: 'new_connection',
        form_data: {
          ...formData,
          provider_id: selectedProvider.id,
          provider_name: selectedProvider.name,
          portal_url: selectedProvider.newConnectionUrl
        }
      });

      await api.post(`/applications/${appResponse.data.id}/submit`);

      // Store data for extension auto-fill
      localStorage.setItem('dgvcl_autofill_data', JSON.stringify({
        // Login data
        mobile: formData.mobile,
        discom: selectedProvider.name,
        
        // New Connection form data
        consumer_type: formData.consumer_type,
        category: formData.category,
        area_type: formData.area_type,
        applicant_name: formData.applicant_name,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        district: formData.district,
        taluka: formData.taluka,
        pincode: formData.pincode,
        email: formData.email,
        nearest_consumer_no: formData.nearest_consumer_no,
        connection_load: formData.connection_load,
        
        timestamp: Date.now(),
        application_type: 'new_connection'
      }));
      
      // Store with specific new connection key to avoid conflicts with name change
      localStorage.setItem('dgvcl_new_connection_data', JSON.stringify({
        mobile: formData.mobile,
        consumer_type: formData.consumer_type,
        category: formData.category,
        area_type: formData.area_type,
        connection_load: formData.connection_load,
        applicant_name: formData.applicant_name,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        district: formData.district,
        taluka: formData.taluka,
        pincode: formData.pincode,
        email: formData.email,
        nearest_consumer_no: formData.nearest_consumer_no,
        connection_load: formData.connection_load,
        
        timestamp: Date.now(),
        application_type: 'new_connection'
      }));

      // Open DGVCL portal with login data
      const portalUrl = `https://portal.guvnl.in/login.php?mobile=${formData.mobile}&discom=${selectedProvider.name}`;
      window.open(portalUrl, '_blank');

      setStep(3);
      setMessage(`Application submitted! Tracking ID: ${appResponse.data.tracking_id}`);
    } catch (error) {
      setMessage('Failed to save application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full -m-6">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <button
          onClick={() => step === 1 ? navigate('/services') : setStep(step - 1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" /> 
          {step === 1 ? 'Back to Services' : 'Back'}
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 mb-6">
        <div className="flex items-center gap-4 w-full px-6">
          <div className="bg-white/25 backdrop-blur-sm p-3 rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Electricity - New Connection
            </h1>
            <p className="text-white/80">बिजली - नया कनेक्शन</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mx-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Provider */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Select Your Electricity Provider
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Choose the provider for new electricity connection
            </p>

            <div className="grid gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider)}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 group-hover:text-orange-700">
                        {provider.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Government
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Online
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{provider.fullName}</p>
                    <p className="text-xs text-gray-400 mt-1">{provider.areas}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Fill Form */}
        {step === 2 && selectedProvider && (
          <div>
            {/* Provider Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-orange-800">{selectedProvider.name}</p>
                  <p className="text-sm text-orange-600">{selectedProvider.areas}</p>
                </div>
                <a
                  href={selectedProvider.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 flex items-center gap-1"
                >
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              New Connection Details
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Fill all required information for new electricity connection
            </p>

            {message && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Request Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-4">📋 Service Request Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Consumer Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="consumer_type"
                      value={formData.consumer_type || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    >
                      <option value="">Select Consumer Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="LT-I">LT-I (Residential)</option>
                      <option value="LT-II">LT-II (Non-Residential)</option>
                      <option value="LT-III">LT-III (Industrial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Area Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="area_type"
                      value={formData.area_type || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    >
                      <option value="">Select Area Type</option>
                      <option value="Urban">Urban</option>
                      <option value="Rural">Rural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Connection Load (KW) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="connection_load"
                      value={formData.connection_load || ''}
                      onChange={handleChange}
                      placeholder="Enter load in KW"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Applicant Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-4">👤 Applicant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Applicant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicant_name"
                      value={formData.applicant_name || ''}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile || ''}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Connection Address */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-4">📍 Connection Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1 || ''}
                      onChange={handleChange}
                      placeholder="House/Plot No, Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2 || ''}
                      onChange={handleChange}
                      placeholder="Area, Landmark"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        required
                      >
                        <option value="">Select District</option>
                        <option value="Surat">Surat</option>
                        <option value="Navsari">Navsari</option>
                        <option value="Valsad">Valsad</option>
                        <option value="Tapi">Tapi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Taluka <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="taluka"
                        value={formData.taluka || ''}
                        onChange={handleChange}
                        placeholder="Enter taluka"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode || ''}
                        onChange={handleChange}
                        placeholder="Enter pin code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Nearest Consumer Number
                    </label>
                    <input
                      type="text"
                      name="nearest_consumer_no"
                      value={formData.nearest_consumer_no || ''}
                      onChange={handleChange}
                      placeholder="Enter nearest consumer number (if known)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  ✅ <strong>Auto-Fill Enabled:</strong> After clicking submit, the DGVCL portal will open and your data will be automatically filled. You only need to enter Captcha and OTP.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Processing...' : `Submit & Open ${selectedProvider.name} Portal`}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Application Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your new connection application has been saved and the DGVCL portal has opened.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
              <p className="font-semibold text-green-800 mb-2">Next Steps:</p>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>Login form will be auto-filled with your mobile & DGVCL</li>
                <li>Enter Captcha and click Login</li>
                <li>Enter OTP sent to your mobile</li>
                <li>Navigate to "New Connection" → "LT New Connection"</li>
                <li>Form will be auto-filled with your details</li>
                <li>Upload required documents and submit</li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/applications')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                View My Applications
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewConnectionForm;