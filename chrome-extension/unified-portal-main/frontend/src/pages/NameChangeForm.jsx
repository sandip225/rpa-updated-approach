import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, ExternalLink, Zap, Flame, Droplets, Building, CheckCircle } from 'lucide-react';
import { suppliers, getSuppliers } from '../data/supplierData';

const NameChangeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get category from URL path (e.g., /electricity -> electricity)
  const category = location.pathname.replace('/', '');
  
  const [step, setStep] = useState(1); // 1: Select Supplier, 2: Fill Form, 3: RPA Processing, 4: Success
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');

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

      // Store form data for auto-fill
      localStorage.setItem('dgvcl_autofill_data', JSON.stringify({
        mobile: formData.mobile,
        consumer_number: formData.consumer_number || formData.service_number,
        provider: selectedSupplier.name,
        timestamp: Date.now()
      }));

      // Open official portal directly with URL parameters (if supported)
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
      
      // Open portal in new tab
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
      sub_registrar_office: 'Sub Registrar Office'
    };

    const label = fieldLabels[fieldName] || fieldName;
    const isRequired = ['applicant_name', 'mobile'].includes(fieldName);

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
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
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
                  {selectedSupplier.fields.map(field => renderFieldInput(field))}

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

        {/* Step 3: RPA Processing with iframe */}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                🤖 RPA Bot is Processing Your Application
              </h2>
              <p className="text-gray-500">
                Watch the bot automatically fill and submit your form on {selectedSupplier?.name} portal
              </p>
            </div>

            {/* RPA Status Banner */}
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-blue-800 font-medium">RPA Bot is filling the form automatically...</span>
            </div>

            {/* iframe Container */}
            <div className="border-4 border-blue-500 rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={iframeUrl}
                className="w-full h-[600px]"
                title="RPA Demo Portal"
                onLoad={(e) => {
                  // Auto-advance to success page after form submission (detect success page)
                  try {
                    const iframeDoc = e.target.contentWindow.document;
                    const isSuccessPage = iframeDoc.body.innerHTML.includes('Application Submitted');
                    if (isSuccessPage) {
                      setTimeout(() => setStep(4), 3000); // Wait 3 seconds to show success, then go to step 4
                    }
                  } catch (err) {
                    // Cross-origin error - use timer fallback
                    setTimeout(() => {
                      // Auto-advance after 12 seconds (enough time for RPA to complete)
                      setStep(4);
                    }, 12000);
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                ✅ Done - View Summary
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Form
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
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
