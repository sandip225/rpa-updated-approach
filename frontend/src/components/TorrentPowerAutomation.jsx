import { useState, useEffect } from 'react';
import { Bot, CheckCircle, AlertCircle, Play, ExternalLink } from 'lucide-react';
import api from '../api/axios';

const TorrentPowerAutomation = ({ userData, onComplete, onClose }) => {
  const [automationStatus, setAutomationStatus] = useState('idle'); // idle, running, completed, failed
  const [result, setResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fieldsFilled, setFieldsFilled] = useState(0);
  const [currentField, setCurrentField] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);

  // Poll for status updates
  useEffect(() => {
    if (!taskId) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/torrent-automation/status/${taskId}`);
        const data = response.data;
        
        console.log('📊 Status update:', data);
        
        setStatusMessage(data.message || 'Processing...');
        setProgress(data.progress_percentage || 0);
        setFieldsFilled(data.fields_filled || 0);
        setCurrentField(data.current_field || '');

        // Update automation status based on task status
        if (data.status === 'completed') {
          setAutomationStatus('completed');
          setResult(data.result);
          clearInterval(interval);
          if (data.result && onComplete) {
            onComplete(data.result);
          }
        } else if (data.status === 'failed') {
          setAutomationStatus('failed');
          setResult({ success: false, message: data.message, error: data.message });
          clearInterval(interval);
        } else if (data.status === 'progress') {
          setAutomationStatus('running');
        }
      } catch (error) {
        console.error('❌ Error polling status:', error);
        if (error.response?.status === 404) {
          setStatusMessage('❌ Task not found');
          setAutomationStatus('failed');
          clearInterval(interval);
        }
      }
    }, 1000); // Poll every 1 second
    
    setPollingInterval(interval);
    
    return () => clearInterval(interval);
  }, [taskId, onComplete]);

  const startAutomation = async () => {
    try {
      setAutomationStatus('running');
      setStatusMessage('🚀 Starting automation...');
      setProgress(0);
      setFieldsFilled(0);

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
      setAutomationStatus('failed');
      
      let errorMessage = 'Failed to start automation';
      if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 'Invalid request data';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error';
      }
      
      setStatusMessage(`❌ ${errorMessage}`);
      setResult({
        success: false,
        error: errorMessage,
        message: 'Automation Failed'
      });
    }
  };

  const openTorrentPowerManually = () => {
    // Store data in localStorage for potential auto-fill
    const torrentData = {
      city: userData.city || 'Ahmedabad',
      service_number: userData.serviceNumber || userData.service_number || '',
      t_number: userData.tNumber || userData.t_number || '',
      mobile: userData.mobile || '',
      email: userData.email || '',
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('torrent_autofill_data', JSON.stringify(torrentData));
      console.log('💾 Data stored in localStorage for manual opening');
    } catch (e) {
      console.warn('Could not store data in localStorage:', e);
    }
    
    // Open the website
    window.open('https://connect.torrentpower.com/tplcp/application/namechangerequest', '_blank');
    setStatusMessage('🌐 Torrent Power website opened manually. Data stored for potential auto-fill.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-white" />
              <h2 className="text-lg font-bold text-white">Torrent Power Automation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Progress Bar */}
          {automationStatus === 'running' && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {fieldsFilled}/5 Fields Filled
                </span>
              </div>
            </div>
          )}
          
          {/* Status Display */}
          <div className="mb-4">
            <div className={`p-4 rounded-lg border ${
              automationStatus === 'idle' ? 'bg-gray-50 border-gray-200' :
              automationStatus === 'running' ? 'bg-blue-50 border-blue-200' :
              automationStatus === 'completed' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {automationStatus === 'running' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {automationStatus === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {automationStatus === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {automationStatus === 'idle' && <Bot className="w-5 h-5 text-gray-600" />}
                
                <p className={`font-medium ${
                  automationStatus === 'running' ? 'text-blue-800' :
                  automationStatus === 'completed' ? 'text-green-800' :
                  automationStatus === 'failed' ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  {statusMessage || 'Ready to start automation'}
                </p>
              </div>
              {currentField && automationStatus === 'running' && (
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Currently filling:</strong> {currentField}
                </p>
              )}
            </div>
          </div>

          {/* Results Display */}
          {result && result.success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Form Auto-filled Successfully!</h3>
              <p className="text-sm text-green-700 mb-3">
                Torrent Power form has been automatically filled with your data. Chrome browser opened and all available fields were filled.
              </p>
              
              {/* Show actual field count */}
              <div className="mb-3 p-3 bg-white rounded border border-green-200">
                <p className="text-sm font-medium text-green-800">📊 Auto-fill Summary:</p>
                <p className="text-lg font-bold text-green-700 mt-1">
                  {result.fields_filled}/{result.total_fields} Fields Filled ({result.success_rate || '0%'})
                </p>
              </div>

              {result.next_steps && (
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-2">🎯 Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 bg-white p-3 rounded border">
                    {result.next_steps && result.next_steps.map((step, idx) => (
                      <li key={idx} className="text-green-700">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                💡 <strong>Tip:</strong> Complete the CAPTCHA manually and click the SUBMIT button to proceed
              </div>
            </div>
          )}

          {result && !result.success && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ Automation Failed</h3>
              <p className="text-sm text-red-700">{result.message || result.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {automationStatus === 'idle' && (
              <button
                onClick={startAutomation}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Auto-fill
              </button>
            )}
            
            <button
              onClick={openTorrentPowerManually}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentPowerAutomation;