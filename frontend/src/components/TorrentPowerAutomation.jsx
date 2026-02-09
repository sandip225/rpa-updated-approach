import { useState, useEffect } from 'react';
import api from '../api/axios';

const TorrentPowerAutomation = ({ userData, onComplete, onClose }) => {
  const [result, setResult] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Poll for status updates
  useEffect(() => {
    if (!taskId) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/torrent-automation/status/${taskId}`);
        const data = response.data;
        
        console.log('📊 Status update:', data);

        // Update result based on task status
        if (data.status === 'completed') {
          setResult(data.result);
          setIsLoading(false);
          clearInterval(interval);
          if (data.result && onComplete) {
            onComplete(data.result);
          }
        } else if (data.status === 'failed') {
          setResult({ success: false, message: data.message, error: data.message });
          setIsLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('❌ Error polling status:', error);
        if (error.response?.status === 404) {
          setIsLoading(false);
          clearInterval(interval);
        }
      }
    }, 1000); // Poll every 1 second
    
    return () => clearInterval(interval);
  }, [taskId, onComplete]);

  const startAutomation = async () => {
    try {
      setIsLoading(true);

      // Debug: Log the userData
      console.log('🔍 userData:', userData);

      // Prepare request data
      const requestData = {
        city: userData.city || 'Ahmedabad',
        service_number: userData.serviceNumber || userData.service_number || '',
        t_number: userData.tNumber || userData.t_number || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
        confirm_email: userData.confirmEmail || userData.email || ''
      };

      console.log('📤 Sending:', requestData);

      // Validate required fields
      if (!requestData.service_number || !requestData.t_number || !requestData.mobile || !requestData.email) {
        throw new Error('Missing required fields: Service Number, T Number, Mobile, or Email');
      }

      // Call async start endpoint
      const response = await api.post('/torrent-automation/start-automation-async', requestData);

      console.log('✅ Async start response:', response.data);

      if (response.data.success && response.data.task_id) {
        setTaskId(response.data.task_id);
        // Polling will start automatically via useEffect
      } else {
        throw new Error(response.data.message || 'Failed to start automation');
      }

    } catch (error) {
      console.error('❌ Automation error:', error);
      setIsLoading(false);
      
      let errorMessage = 'Failed to start automation';
      if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 'Invalid request data';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error';
      }
      
      setResult({
        success: false,
        error: errorMessage,
        message: 'Automation Failed'
      });
    }
  };

  // Show form modal if result has modal data
  if (result && result.modal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
          
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h3 className="font-bold text-lg">Torrent Power | Name Change Application</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6 bg-pink-50 space-y-4">
            {/* Error Status Box - Red */}
            <div className="border-2 border-red-500 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 justify-center">
                <span className="text-red-600 text-3xl">⊘</span>
                <p className="text-red-600 font-bold text-center text-lg">Form not Submitted</p>
              </div>
            </div>
            
            {/* Checklist - Green */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="space-y-3">
                {result.modal.checklist && result.modal.checklist.map((item, idx) => {
                  // Skip the last item (Form filled successfully)
                  if (idx === result.modal.checklist.length - 1) return null;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-green-600 text-xl">☑</span>
                      <span className="text-green-700 font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* OK Button */}
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
            >
              {result.modal.button?.text || 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Processing your request...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (result && !result.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
          <h3 className="font-bold text-red-600 text-lg mb-2">❌ Error</h3>
          <p className="text-gray-700 mb-4">{result.message || result.error}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Show initial state with start button
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Torrent Power Automation</h2>
        <p className="text-gray-600 mb-6">Click the button below to start auto-filling the Torrent Power form with your data.</p>
        <button
          onClick={startAutomation}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          Start Auto-fill
        </button>
      </div>
    </div>
  );
};

export default TorrentPowerAutomation;
