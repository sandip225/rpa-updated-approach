import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Eye, EyeOff, Zap, AlertCircle, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import api from '../api/axios';

const RPAController = ({ formData, onComplete, onError }) => {
  const [rpaStatus, setRpaStatus] = useState('idle'); // idle, starting, running, waiting, success, error
  const [rpaLogs, setRpaLogs] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showLiveView, setShowLiveView] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const wsRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rpaLogs]);

  // WebSocket connection for real-time updates
  const connectWebSocket = (sessionId) => {
    const wsUrl = `ws://localhost:8000/rpa/ws/${sessionId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      addLog('🔗 Connected to RPA server', 'info');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRPAUpdate(data);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      addLog('🔌 Disconnected from RPA server', 'warning');
    };

    wsRef.current.onerror = (error) => {
      addLog('❌ WebSocket error: Connection failed', 'error');
      setIsConnected(false);
    };
  };

  // Handle RPA status updates
  const handleRPAUpdate = (data) => {
    setCurrentStep(data.step || '');
    setProgress(data.progress || 0);
    setRpaStatus(data.status || 'running');

    // Add log entry
    addLog(data.message, data.status);

    // Handle completion
    if (data.status === 'success') {
      setRpaStatus('success');
      onComplete && onComplete(data);
    } else if (data.status === 'error') {
      setRpaStatus('error');
      onError && onError(data);
    }
  };

  // Add log entry
  const addLog = (message, type = 'info') => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setRpaLogs(prev => [...prev, logEntry]);
  };

  // Start RPA automation
  const startRPA = async () => {
    try {
      setRpaStatus('starting');
      setRpaLogs([]);
      setProgress(0);
      
      addLog('🚀 Starting RPA automation...', 'info');

      const response = await api.post('/rpa/start', {
        provider: 'dgvcl',
        application_type: 'name_change',
        form_data: formData,
        user_id: 1 // Replace with actual user ID
      });

      if (response.data.success) {
        const newSessionId = response.data.session_id;
        setSessionId(newSessionId);
        setRpaStatus('running');
        
        addLog(`✅ RPA session started: ${newSessionId}`, 'success');
        addLog('🔗 Connecting to real-time updates...', 'info');
        
        // Connect WebSocket for real-time updates
        connectWebSocket(newSessionId);
      } else {
        throw new Error(response.data.error || 'Failed to start RPA');
      }
    } catch (error) {
      setRpaStatus('error');
      addLog(`❌ Failed to start RPA: ${error.message}`, 'error');
      onError && onError(error);
    }
  };

  // Stop RPA automation
  const stopRPA = async () => {
    if (!sessionId) return;

    try {
      await api.delete(`/rpa/stop/${sessionId}`);
      setRpaStatus('idle');
      addLog('🛑 RPA automation stopped', 'warning');
      
      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
    } catch (error) {
      addLog(`❌ Failed to stop RPA: ${error.message}`, 'error');
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (rpaStatus) {
      case 'idle': return <Square className="w-5 h-5 text-gray-500" />;
      case 'starting': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'running': return <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'waiting': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Square className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (rpaStatus) {
      case 'idle': return 'bg-gray-100 text-gray-700';
      case 'starting': return 'bg-blue-100 text-blue-700';
      case 'running': return 'bg-yellow-100 text-yellow-700';
      case 'waiting': return 'bg-orange-100 text-orange-700';
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get log icon
  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  return (
    <div className="rpa-controller bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">RPA Automation Controller</h3>
              <p className="text-white/80 text-sm">DGVCL Name Change Automation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 text-white/80">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white/60">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize">{rpaStatus}</span>
          </div>
          <div className="text-sm text-gray-500">
            Session: {sessionId || 'Not started'}
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{currentStep}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {rpaStatus === 'idle' || rpaStatus === 'error' ? (
            <button
              onClick={startRPA}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Automation
            </button>
          ) : (
            <button
              onClick={stopRPA}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop Automation
            </button>
          )}

          <button
            onClick={() => setShowLiveView(!showLiveView)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showLiveView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showLiveView ? 'Hide' : 'Show'} Live View
          </button>
        </div>
      </div>

      {/* Live View */}
      {showLiveView && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">🔴 Live Browser View</h4>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="bg-white rounded border-2 border-dashed border-gray-300 h-64 flex items-center justify-center">
              {sessionId ? (
                <div className="text-center">
                  <div className="animate-pulse text-4xl mb-2">🌐</div>
                  <p className="text-gray-600">Browser automation in progress...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    RPA bot is controlling DGVCL portal
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📺</div>
                  <p>Live view will appear when automation starts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logs Panel */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 mb-3">📋 Automation Logs</h4>
        <div className="bg-gray-50 rounded-lg p-3 h-64 overflow-y-auto">
          {rpaLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-2xl mb-2">📝</div>
              <p>Logs will appear here when automation starts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rpaLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-400 text-xs mt-0.5 font-mono">
                    {log.timestamp}
                  </span>
                  <span className="text-lg leading-none">
                    {getLogIcon(log.type)}
                  </span>
                  <span className={`flex-1 ${
                    log.type === 'error' ? 'text-red-600' :
                    log.type === 'success' ? 'text-green-600' :
                    log.type === 'warning' ? 'text-orange-600' :
                    'text-gray-700'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-t border-blue-200 rounded-b-lg">
        <h5 className="font-semibold text-blue-800 mb-2">📖 How it works:</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. 🚀 Click "Start Automation" to begin RPA process</p>
          <p>2. 🤖 Bot will auto-fill mobile number and DISCOM</p>
          <p>3. ✋ You'll need to manually enter captcha and OTP</p>
          <p>4. 🔄 Bot will handle rest of the form submission</p>
          <p>5. ✅ Get notified when process completes</p>
        </div>
      </div>
    </div>
  );
};

export default RPAController;