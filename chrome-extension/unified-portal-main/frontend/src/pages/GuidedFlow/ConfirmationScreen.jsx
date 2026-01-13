import { CheckCircle, Copy, FileSearch, RefreshCw, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const ConfirmationScreen = ({ 
  trackingId, 
  message,
  messageHindi,
  estimatedTime,
  onTrackApplication,
  onNewApplication,
  portalUrl,
  providerName,
  formData
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleOpenPortal = () => {
    // Store form data in localStorage for chrome extension to use
    if (formData) {
      localStorage.setItem('dgvcl_autofill_data', JSON.stringify({
        mobile: formData.mobile,
        consumer_number: formData.consumer_number,
        provider: providerName,
        timestamp: Date.now()
      }));
    }
    
    // Open portal in new tab
    window.open(portalUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
        <p className="text-green-100">आवेदन सफलतापूर्वक जमा हो गया!</p>
      </div>

      {/* Tracking ID Card */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-6 border-2 border-dashed border-orange-300 text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">Your Tracking ID / आपकी ट्रैकिंग आईडी</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-orange-600 tracking-wider">
              {trackingId}
            </span>
            <button
              onClick={copyTrackingId}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
              title="Copy to clipboard"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : 'text-gray-500'}`} />
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-sm mt-2 animate-pulse">✓ Copied to clipboard!</p>
          )}
        </div>

        {/* Message */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-sm">{message}</p>
          <p className="text-gray-500 text-xs mt-2">{messageHindi}</p>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="font-medium">Estimated Processing Time</p>
            <p className="text-orange-600 font-bold">{estimatedTime}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* DGVCL Portal Instructions */}
          {portalUrl && formData && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Fill these details on {providerName} Portal:
                </h3>
                
                {/* Mobile Number */}
                <div className="bg-white rounded-lg p-3 mb-2 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Mobile Number / मोबाइल नंबर</p>
                    <p className="text-lg font-bold text-gray-800">{formData.mobile}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formData.mobile, 'mobile')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedField === 'mobile' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Discom Selection */}
                <div className="bg-white rounded-lg p-3 mb-2 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Select Discom / डिस्कॉम चुनें</p>
                    <p className="text-lg font-bold text-orange-600">{providerName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(providerName, 'discom')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedField === 'discom' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Consumer Number (if available) */}
                {formData.consumer_number && (
                  <div className="bg-white rounded-lg p-3 mb-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Consumer Number / उपभोक्ता संख्या</p>
                      <p className="text-lg font-bold text-gray-800">{formData.consumer_number}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(formData.consumer_number, 'consumer')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedField === 'consumer' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-yellow-800 mb-2">📝 Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                    <li>Click "Open {providerName} Portal" button below</li>
                    <li>Paste Mobile Number (use Copy button above)</li>
                    <li>Select "{providerName}" from dropdown</li>
                    <li>Enter Captcha and click Login</li>
                    <li>Enter OTP sent to your mobile</li>
                  </ol>
                </div>
              </div>
              
              <button
                onClick={handleOpenPortal}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all animate-pulse"
              >
                <ExternalLink className="w-6 h-6" />
                Open {providerName} Portal Now
                <span className="text-sm opacity-90">अभी पोर्टल खोलें</span>
              </button>
            </>
          )}

          <button
            onClick={onTrackApplication}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <FileSearch className="w-5 h-5" />
            Track Application
            <span className="text-sm opacity-80">आवेदन ट्रैक करें</span>
          </button>

          <button
            onClick={onNewApplication}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            New Application
            <span className="text-sm opacity-60">नया आवेदन</span>
          </button>
        </div>

        {/* Help Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Save your tracking ID for future reference. You can track your application status anytime.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            भविष्य के संदर्भ के लिए अपनी ट्रैकिंग आईडी सहेजें।
          </p>
          
          {/* Chrome Extension Download */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <p className="text-sm font-semibold text-purple-800 mb-2">
              🚀 Want Automatic Fill? Install Chrome Extension!
            </p>
            <p className="text-xs text-purple-600 mb-2">
              Extension automatically fills mobile & DGVCL - No copy-paste needed!
            </p>
            <a
              href="https://github.com/Vaidehip0407/unified-portal/archive/refs/heads/main.zip"
              download
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
            >
              📥 Download Extension (2 min setup)
            </a>
            <p className="text-xs text-purple-500 mt-2">
              Extract ZIP → chrome-extension folder → Load in Chrome
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
