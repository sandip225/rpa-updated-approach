import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, ExternalLink, Zap, Flame, Droplets, Building, CheckCircle } from 'lucide-react';
import { suppliers, getSuppliers } from '../data/supplierData';
import RPAController from '../components/RPAController';

const NameChangeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get category from URL path (e.g., /electricity -> electricity)
  const category = location.pathname.replace('/', '');
  
  const [step, setStep] = useState(1); // 1: Select Supplier, 2: Fill Form, 3: Choose Method, 4: RPA/Extension, 5: Success
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [automationMethod, setAutomationMethod] = useState(''); // 'rpa' or 'extension'

  const categoryData = suppliers[category];
  const supplierList = getSuppliers(category);

  const icons = {
    electricity: Zap,
    gas: Flame,
    water: Droplets,
    property: Building
  };

  const gradients = {
    electricity: 'from-amber-400 to-orange-500',
    gas: 'from-red-400 to-rose-600',
    water: 'from-cyan-400 to-blue-500',
    property: 'from-emerald-400 to-green-600'
  };

  const Icon = icons[category] || Zap;
  const gradient = gradients[category] || 'from-blue-400 to-blue-600';

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

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
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
      // Save application to our database
      const appResponse = await api.post('/applications/', {
        service_type: category,
        application_type: 'name_change',
        form_data: {
          ...formData,
          supplier_id: selectedSupplier.id,
          supplier_name: selectedSupplier.name,
          portal_url: selectedSupplier.nameChangeUrl
        }
      });

      await api.post(`/applications/${appResponse.data.id}/submit`);

      // Go to method selection step
      setStep(3);
      setMessage(`Application saved! Tracking ID: ${appResponse.data.tracking_id}`);
      
    } catch (error) {
      setMessage('Failed to save application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle automation method selection
  const handleMethodSelection = (method) => {
    setAutomationMethod(method);
    
    if (method === 'rpa') {
      // Go to RPA step
      setStep(4);
      setMessage('🤖 RPA Automation selected - Complete control from browser');
    } else {
      // Extension method
      handleExtensionMethod();
    }
  };

  // Handle extension method
  const handleExtensionMethod = () => {
    // Store form data for auto-fill
    localStorage.setItem('dgvcl_autofill_data', JSON.stringify({
      application_type: 'name_change',
      mobile: formData.mobile,
      consumer_number: formData.consumer_number || formData.service_number,
      provider: selectedSupplier.name,
      new_name: formData.new_name,
      reason: formData.reason,
      security_deposit_option: formData.security_deposit_option,
      old_security_deposit: formData.old_security_deposit,
      applicant_name: formData.applicant_name,
      email: formData.email,
      timestamp: Date.now()
    }));

    // Open DGVCL portal
    const portalUrl = `https://portal.guvnl.in/login.php?mobile=${formData.mobile}&discom=${selectedSupplier.name}`;
    window.open(portalUrl, '_blank');
    
    setStep(5);
    setMessage('✅ Extension method - DGVCL portal opened in new tab');
  };

  // Handle RPA completion
  const handleRPAComplete = (result) => {
    setStep(5);
    setMessage('🎉 RPA automation completed successfully!');
  };

  // Handle RPA error
  const handleRPAError = (error) => {
    setMessage(`❌ RPA automation failed: ${error.message}`);
  };

      // Store form data for auto-fill with specific key for name change
      localStorage.setItem('dgvcl_autofill_data', JSON.stringify({
        application_type: 'name_change',
        mobile: formData.mobile,
        consumer_number: formData.consumer_number || formData.service_number,
        provider: selectedSupplier.name,
        // Name change specific fields
        new_name: formData.new_name,
        reason: formData.reason,
        security_deposit_option: formData.security_deposit_option,
        old_security_deposit: formData.old_security_deposit,
        applicant_name: formData.applicant_name,
        email: formData.email,
        timestamp: Date.now()
      }));
      
      // Also store with specific name change key to avoid conflicts
      localStorage.setItem('dgvcl_name_change_data', JSON.stringify({
        application_type: 'name_change',
        mobile: formData.mobile,
        consumer_number: formData.consumer_number || formData.service_number,
        provider: selectedSupplier.name,
        new_name: formData.new_name,
        reason: formData.reason,
        security_deposit_option: formData.security_deposit_option,
        old_security_deposit: formData.old_security_deposit,
        applicant_name: formData.applicant_name,
        email: formData.email,
        timestamp: Date.now()
      }));

      // Option 1: Extension-based automation (current)
      const portalUrls = {
        'dgvcl': 'https://portal.guvnl.in/login.php',
        'pgvcl': 'https://portal.guvnl.in/login.php',
        'ugvcl': 'https://portal.guvnl.in/login.php',
        'mgvcl': 'https://portal.guvnl.in/login.php',
        'torrent-power': 'https://connect.torrentpower.com',
        'gujarat-gas': 'https://iconnect.gujaratgas.com/Portal/outer-service-request_template.aspx',
        'adani-gas': 'https://www.adanigas.com/name-transfer'
      };

      let portalUrl = portalUrls[selectedSupplier.id] || selectedSupplier.portal_url;
      
      // Add mobile number as URL parameter for GUVNL portals
      if (portalUrl && portalUrl.includes('portal.guvnl.in') && formData.mobile) {
        portalUrl += `?mobile=${formData.mobile}&discom=${selectedSupplier.name}`;
      }

      // Ask user for automation preference
      const useRPA = window.confirm(
        '🤖 Choose Automation Method:\n\n' +
        'OK = RPA Bot (No extension needed, fully automatic)\n' +
        'Cancel = Browser Extension (Manual captcha/OTP)\n\n' +
        'RPA Bot will handle everything automatically on server.'
      );

      if (useRPA) {
        // Option 2: RPA Bot automation (new)
        try {
          setStep(3); // Go to RPA processing step
          setMessage('🤖 Starting RPA Bot automation...');
          
          const rpaResponse = await api.post('/rpa/start', {
            provider: selectedSupplier.id,
            application_type: 'name_change',
            form_data: {
              mobile: formData.mobile,
              provider: selectedSupplier.name,
              new_name: formData.new_name,
              reason: formData.reason,
              security_deposit_option: formData.security_deposit_option,
              old_security_deposit: formData.old_security_deposit,
              applicant_name: formData.applicant_name,
              email: formData.email
            },
            user_id: user?.id
          });

          if (rpaResponse.data.success) {
            // Connect to WebSocket for real-time updates
            const ws = new WebSocket(`ws://localhost:8000/rpa/ws/${rpaResponse.data.session_id}`);
            
            ws.onmessage = (event) => {
              const status = JSON.parse(event.data);
              setMessage(`🤖 ${status.step}: ${status.message} (${status.progress}%)`);
              
              if (status.status === 'success') {
                setStep(4);
                setMessage('🎉 RPA automation completed successfully!');
              } else if (status.status === 'error') {
                setMessage(`❌ RPA automation failed: ${status.message}`);
              }
            };

            ws.onerror = () => {
              setMessage('⚠️ RPA connection lost. Check status manually.');
            };
          }
        } catch (error) {
          setMessage('❌ RPA Bot failed to start. Using extension method...');
          // Fallback to extension method
          if (portalUrl) {
            window.open(portalUrl, '_blank');
          }
        }
      } else {
        // Option 1: Extension method (existing)
        if (portalUrl) {
          const newWindow = window.open(portalUrl, '_blank');
          
          // Try to inject auto-fill script (may be blocked by CORS)
          if (newWindow) {
            setTimeout(() => {
              try {
                newWindow.postMessage({
                  type: 'AUTOFILL_DATA',
                  mobile: formData.mobile,
                  discom: selectedSupplier.name,
                  consumer_number: formData.consumer_number || formData.service_number
                }, 'https://portal.guvnl.in');
              } catch (e) {
                console.log('Could not send data to portal (CORS)');
              }
            }, 1000);
          }
        }
      }

      // Go to success step
      setStep(4);
      setMessage(`Application submitted successfully! Tracking ID: ${appResponse.data.tracking_id}`);
    } catch (error) {
      setMessage('Failed to save application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldInput = (fieldName) => {
    const fieldLabels = {
      city: 'City',
      service_number: 'Service Number',
      t_no: 'T No',
      consumer_number: 'Consumer Number',
      bp_number: 'BP Number',
      connection_number: 'Connection Number',
      applicant_name: 'Applicant Name',
      mobile: 'Mobile Number',
      email: 'Email Address',
      address: 'Address',
      zone: 'Zone',
      village: 'Village',
      taluka: 'Taluka',
      district: 'District',
      survey_number: 'Survey Number',
      property_id: 'Property ID',
      ward: 'Ward',
      document_number: 'Document Number',
      sub_registrar_office: 'Sub Registrar Office',
      // DGVCL Name Change fields
      new_name: 'New Name',
      reason: 'Reason for Name Change',
      security_deposit_option: 'Security Deposit Option',
      old_security_deposit: 'Old Security Deposit Amount'
    };

    const label = fieldLabels[fieldName] || fieldName;
    const isRequired = ['applicant_name', 'mobile', 'new_name'].includes(fieldName);

    // Special handling for dropdown fields
    if (fieldName === 'reason') {
      return (
        <div key={fieldName}>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}{isRequired && <span className="text-red-500">*</span>}
          </label>
          <select
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required={isRequired}
          >
            <option value="">Select Reason</option>
            <option value="Marriage">Marriage</option>
            <option value="Divorce">Divorce</option>
            <option value="Legal Name Change">Legal Name Change</option>
            <option value="Other">Other</option>
          </select>
        </div>
      );
    }

    if (fieldName === 'security_deposit_option') {
      return (
        <div key={fieldName}>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}{isRequired && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name={fieldName}
                value="entire"
                checked={formData[fieldName] === 'entire'}
                onChange={handleChange}
                className="mr-2"
              />
              Entire amount to be paid by consumer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={fieldName}
                value="difference"
                checked={formData[fieldName] === 'difference'}
                onChange={handleChange}
                className="mr-2"
              />
              Difference amount to be paid by consumer
            </label>
          </div>
        </div>
      );
    }

    return (
      <div key={fieldName}>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {label}{isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={fieldName === 'email' ? 'email' : fieldName === 'mobile' ? 'tel' : 'text'}
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          placeholder={`Enter ${label}`}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required={isRequired}
        />
      </div>
    );
  };

  if (!categoryData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Invalid category</p>
        <button onClick={() => navigate('/services')} className="mt-4 text-blue-600 hover:underline">
          Go back to Services
        </button>
      </div>
    );
  }

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
      <div className={`bg-gradient-to-r ${gradient} p-6 mb-6`}>
        <div className="flex items-center gap-4 w-full px-6">
          <div className="bg-white/25 backdrop-blur-sm p-3 rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {categoryData.name} - Name Change
            </h1>
            <p className="text-white/80">{categoryData.nameHindi} - नाम बदलें</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mx-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 5 && (
                <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Supplier */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Select Your Service Provider
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Choose the provider where you want to apply for name change
            </p>

            {/* All categories - Two separate boxes for Government and Private */}
            {['gas', 'electricity', 'water', 'property'].includes(category) ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Government Box */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                  <div className="bg-green-600 px-6 py-4">
                    <h3 className="text-white font-bold text-lg">🏛️ Government</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {supplierList.filter(s => s.type === 'Government').map((supplier) => (
                      <button
                        key={supplier.id}
                        onClick={() => handleSupplierSelect(supplier)}
                        className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800 group-hover:text-green-700">
                              {supplier.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                              supplier.hasOnlinePortal 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {supplier.hasOnlinePortal ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{supplier.areas}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2 group-hover:text-green-600" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private Box */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                  <div className="bg-red-600 px-6 py-4">
                    <h3 className="text-white font-bold text-lg">🏢 Private</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {supplierList.filter(s => s.type === 'Private').map((supplier) => (
                      <button
                        key={supplier.id}
                        onClick={() => handleSupplierSelect(supplier)}
                        className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800 group-hover:text-red-700">
                              {supplier.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                              supplier.hasOnlinePortal 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {supplier.hasOnlinePortal ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{supplier.areas}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2 group-hover:text-red-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Other categories - Original single list */
              <div className="grid gap-3">
                {supplierList.map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => handleSupplierSelect(supplier)}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 group-hover:text-blue-700">
                          {supplier.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          supplier.type === 'Government' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {supplier.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          supplier.hasOnlinePortal 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {supplier.hasOnlinePortal ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      {supplier.fullName && (
                        <p className="text-sm text-gray-500">{supplier.fullName}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{supplier.areas}</p>
                      {supplier.offlineNote && !supplier.hasOnlinePortal && (
                        <p className="text-xs text-orange-600 mt-1">{supplier.offlineNote}</p>
                      )}
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Show appropriate content based on portal availability */}
        {step === 2 && selectedSupplier && (
          <div>
            {/* Supplier Info Header */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">{selectedSupplier.name}</p>
                  <p className="text-sm text-blue-600">{selectedSupplier.areas}</p>
                  {selectedSupplier.fullName && (
                    <p className="text-xs text-gray-500">{selectedSupplier.fullName}</p>
                  )}
                </div>
                <a
                  href={selectedSupplier.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 flex items-center gap-1"
                >
                  Official Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* CASE 1: Online Portal Available - Show Form */}
            {selectedSupplier.hasOnlinePortal && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  Fill Your Details
                </h2>
                <p className="text-gray-500 text-center mb-6">
                  Enter your information for name change application
                </p>

                {message && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Use nameChangeFields for DGVCL, otherwise use regular fields */}
                  {(selectedSupplier.id === 'dgvcl' && selectedSupplier.nameChangeFields 
                    ? selectedSupplier.nameChangeFields 
                    : selectedSupplier.fields
                  ).map(field => renderFieldInput(field))}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Online Portal Available:</strong> After clicking submit, the official {selectedSupplier.name} portal will open. Your data will be saved for tracking.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-gradient-to-r ${gradient} text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {submitting ? 'Processing...' : `Submit & Open ${selectedSupplier.name} Portal`}
                  </button>
                </form>
              </>
            )}

            {/* CASE 2: Offline Form Available - Show Download Link */}
            {!selectedSupplier.hasOnlinePortal && selectedSupplier.offlineForm && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Offline Form Available
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedSupplier.name} does not have an online name change portal. 
                  Please download the offline form and submit it at their office.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                  <p className="font-semibold text-orange-800 mb-4">📋 How to Apply:</p>
                  <ol className="text-sm text-orange-700 space-y-2 text-left list-decimal list-inside">
                    <li>Download the name change form from the link below</li>
                    <li>Fill in all required details</li>
                    <li>Attach required documents (ID proof, address proof)</li>
                    <li>Submit at the nearest {selectedSupplier.name} office</li>
                  </ol>
                </div>

                <a
                  href={selectedSupplier.offlineForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  Download Name Change Form <ExternalLink className="w-5 h-5" />
                </a>

                <p className="text-xs text-gray-500 mt-4">
                  Form will open in a new tab
                </p>
              </div>
            )}

            {/* CASE 3: Neither Online nor Offline Form - Show Office Visit Info */}
            {!selectedSupplier.hasOnlinePortal && !selectedSupplier.offlineForm && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Office Visit Required
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedSupplier.name} does not have an online portal or downloadable form for name change. 
                  You need to visit their office in person.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <p className="font-semibold text-gray-800 mb-4">📍 How to Apply:</p>
                  <ol className="text-sm text-gray-700 space-y-2 text-left list-decimal list-inside">
                    <li>Visit the nearest {selectedSupplier.name} office</li>
                    <li>Request the name change application form</li>
                    <li>Fill in all required details</li>
                    <li>Attach required documents (ID proof, address proof, ownership proof)</li>
                    <li>Submit the form and collect acknowledgment receipt</li>
                  </ol>
                </div>

                {selectedSupplier.offlineNote && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      ℹ️ {selectedSupplier.offlineNote}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <a
                    href={selectedSupplier.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Visit Official Website <ExternalLink className="w-4 h-4" />
                  </a>
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
        )}

        {/* Step 3: Choose Automation Method */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Choose Automation Method
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Select how you want to complete the DGVCL automation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RPA Bot Option */}
              <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all cursor-pointer group"
                   onClick={() => handleMethodSelection('rpa')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">RPA Bot Automation</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete browser-based automation with real-time monitoring
                  </p>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No extension required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time progress tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete browser control</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span className="w-4 h-4 text-center">⚠️</span>
                      <span>Manual captcha & OTP entry</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose RPA Bot
                  </button>
                </div>
              </div>

              {/* Extension Option */}
              <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-all cursor-pointer group"
                   onClick={() => handleMethodSelection('extension')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200">
                    <span className="text-2xl">🧩</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Browser Extension</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Traditional extension-based automation in new tab
                  </p>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Fast and reliable</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Works on any device</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span className="w-4 h-4 text-center">⚠️</span>
                      <span>Extension installation required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span className="w-4 h-4 text-center">⚠️</span>
                      <span>Opens in new tab</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Choose Extension
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                <strong>Recommendation:</strong> Choose RPA Bot for the best experience - no extension needed and complete browser control!
              </p>
            </div>
          </div>
        )}

        {/* Step 4: RPA Automation Controller */}
        {step === 4 && automationMethod === 'rpa' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🤖 RPA Automation in Progress
            </h2>
            
            <RPAController 
              formData={{
                mobile: formData.mobile,
                provider: selectedSupplier.name,
                new_name: formData.new_name,
                reason: formData.reason,
                security_deposit_option: formData.security_deposit_option,
                old_security_deposit: formData.old_security_deposit,
                applicant_name: formData.applicant_name,
                email: formData.email
              }}
              onComplete={handleRPAComplete}
              onError={handleRPAError}
            />
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Application Saved!
            </h2>
            <p className="text-gray-600 mb-6">
              Your application has been saved. The official portal should have opened in a new tab.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="font-semibold text-blue-800 mb-2">Next Steps:</p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>The demo portal has opened with your data auto-filled</li>
                <li>Watch the RPA bot fill the form automatically</li>
                <li>Form will be submitted automatically</li>
                <li>Track your application status in "My Applications"</li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  const demoSite = selectedSupplier?.id;
                  const autoFillData = encodeURIComponent(JSON.stringify({
                    ...formData,
                    application_type: 'name_change',
                    city: formData.city || 'Ahmedabad'
                  }));
                  window.open(`/demo-govt/${demoSite}?rpa=true&data=${autoFillData}`, '_blank');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Open Demo Portal Again <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/applications')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                View My Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NameChangeForm;
