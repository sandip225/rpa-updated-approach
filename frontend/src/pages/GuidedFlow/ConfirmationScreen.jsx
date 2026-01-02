import { CheckCircle, Copy, FileSearch, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const ConfirmationScreen = ({ 
  trackingId, 
  message,
  messageHindi,
  estimatedTime,
  onTrackApplication,
  onNewApplication 
}) => {
  const [copied, setCopied] = useState(false);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
