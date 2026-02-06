import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SeleniumDemo = () => {
  const { t } = useTranslation();
  const [automationTasks, setAutomationTasks] = useState([]);
  const [supportedServices, setSupportedServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState(null);
  const [visibleModalOpen, setVisibleModalOpen] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState('Idle');
  const [visibleResult, setVisibleResult] = useState(null);
  const [visibleError, setVisibleError] = useState(null);

  const startVisibleDemo = async () => {
    if (!selectedService) { alert('Please select a service'); return; }
    setIsLoading(true);
    setVisibleModalOpen(true);
    setVisibleStatus('Starting visible automation...');
    setVisibleResult(null);
    setVisibleError(null);

    try {
      const response = await fetch('/api/torrent-automation/start-visible-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: formData.city || 'Ahmedabad',
          service_number: formData.service_number || formData.serviceNumber || '',
          t_number: formData.t_number || formData.tNumber || '',
          mobile: formData.mobile || formData.mobileNumber || '',
          email: formData.email || formData.emailAddress || '',
          options: { interactive: true, pause_between: 1, keep_open: 600 }
        })
      });

      setVisibleStatus('Running... waiting for response');
      const result = await response.json();
      if (response.ok) {
        setVisibleStatus(result.success ? 'Completed' : 'Failed');
        setVisibleResult(result);
      } else {
        setVisibleStatus('Failed');
        setVisibleError(result.detail || result.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      setVisibleStatus('Error');
      setVisibleError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportedServices();
    fetchActiveTasks();
  }, []);

  const fetchSupportedServices = async () => {
    try {
      const response = await fetch('/api/selenium/supported-services');
      const data = await response.json();
      setSupportedServices(data.services);
    } catch (error) {
      console.error('Failed to fetch supported services:', error);
    }
  };

  const fetchActiveTasks = async () => {
    try {
      const response = await fetch('/api/selenium/active-tasks');
      const data = await response.json();
      setAutomationTasks(Object.values(data.active_tasks));
    } catch (error) {
      console.error('Failed to fetch active tasks:', error);
    }
  };

  const handleServiceChange = (serviceType) => {
    setSelectedService(serviceType);
    const service = supportedServices.find(s => s.service_type === serviceType);
    if (service) {
      const initialFormData = {};
      service.fields.forEach(field => {
        initialFormData[field] = '';
      });
      setFormData(initialFormData);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startAutomation = async () => {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/selenium/start-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_type: selectedService,
          form_data: formData,
          source: 'frontend_demo',
          options: {
            headless: false, // Show browser for demo
            mobile_emulation: false
          }
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Automation started! Task ID: ${result.task_id}`);
        monitorTask(result.task_id);
        fetchActiveTasks();
      } else {
        alert(`Failed to start automation: ${result.detail}`);
      }
    } catch (error) {
      console.error('Failed to start automation:', error);
      alert('Failed to start automation');
    } finally {
      setIsLoading(false);
    }
  };

  const monitorTask = async (taskId) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/selenium/task-status/${taskId}`);
        const status = await response.json();
        setTaskStatus(status);

        if (status.status === 'running' || status.status === 'queued') {
          setTimeout(checkStatus, 2000); // Check every 2 seconds
        } else {
          // Task completed or failed
          fetchActiveTasks();
          if (status.status === 'completed') {
            alert(`Automation completed! Confirmation: ${status.result?.confirmation_number}`);
          } else if (status.status === 'failed') {
            alert(`Automation failed: ${status.error}`);
          }
        }
      } catch (error) {
        console.error('Failed to check task status:', error);
      }
    };

    checkStatus();
  };

  const validateSite = async () => {
    const url = prompt('Enter website URL to validate:');
    if (!url) return;

    try {
      const response = await fetch('/api/selenium/validate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      if (result.supported) {
        alert(`✅ Site is supported!\nService: ${result.service_type}\nURL: ${result.url}`);
      } else {
        alert(`❌ Site is not supported yet.\nURL: ${result.url}`);
      }
    } catch (error) {
      console.error('Failed to validate site:', error);
      alert('Failed to validate site');
    }
  };

  const extractFormData = async () => {
    const url = prompt('Enter website URL to extract form data:');
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/selenium/extract-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          options: { headless: true }
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ Form data extracted!\nFields found: ${Object.keys(result.form_data).length}\nScreenshot: ${result.screenshot_path}`);
        console.log('Extracted form data:', result.form_data);
      } else {
        alert(`❌ Failed to extract form data: ${result.detail}`);
      }
    } catch (error) {
      console.error('Failed to extract form data:', error);
      alert('Failed to extract form data');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceData = supportedServices.find(s => s.service_type === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 Selenium Automation Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Test and demonstrate Selenium automation capabilities for government websites
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={validateSite}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              🔍 Validate Website
            </button>
            <button
              onClick={extractFormData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              📋 Extract Form Data
            </button>
            <button
              onClick={fetchActiveTasks}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh Tasks
            </button>
          </div>

          {/* Service Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Service for Automation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedServices.map((service) => (
                <div
                  key={service.service_type}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedService === service.service_type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceChange(service.service_type)}
                >
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Fields: {service.fields.length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Data Input */}
          {selectedServiceData && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Form Data for {selectedServiceData.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedServiceData.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={formData[field] || ''}
                      onChange={(e) => handleFormDataChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.replace('_', ' ')}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={startAutomation}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? '🔄 Starting...' : '🚀 Start Automation'}
                </button>
                <button
                  onClick={startVisibleDemo}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  👀 Visible Demo
                </button>
              </div>
            </div>
          )}

          {/* Task Status */}
          {taskStatus && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Task Status</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Task ID: {taskStatus.task_id}</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    taskStatus.status === 'completed' ? 'bg-green-100 text-green-800' :
                    taskStatus.status === 'failed' ? 'bg-red-100 text-red-800' :
                    taskStatus.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {taskStatus.status.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${taskStatus.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Progress: {taskStatus.progress}%</p>
                {taskStatus.error && (
                  <p className="text-sm text-red-600 mt-2">Error: {taskStatus.error}</p>
                )}
                {taskStatus.result && taskStatus.result.confirmation_number && (
                  <p className="text-sm text-green-600 mt-2">
                    Confirmation: {taskStatus.result.confirmation_number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Active Tasks */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Automation Tasks</h2>
            {automationTasks.length === 0 ? (
              <p className="text-gray-500">No active tasks</p>
            ) : (
              <div className="space-y-3">
                {automationTasks.map((task) => (
                  <div key={task.task_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{task.service_type}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(task.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'failed' ? 'bg-red-100 text-red-800' :
                        task.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div 
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

          {/* Visible RPA Modal */}
          {visibleModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">Visible RPA Progress</h3>
                  <button onClick={() => setVisibleModalOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Status: <strong>{visibleStatus}</strong></p>

                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <div className="loader-border w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p>Starting visible automation — check the opened browser.</p>
                    </div>
                  )}

                  {visibleError && (
                    <div className="mt-3 text-sm text-red-600">Error: {visibleError}</div>
                  )}

                  {visibleResult && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-700 mb-2">Message: {visibleResult.message}</div>
                      {visibleResult.automation_details && visibleResult.automation_details.length > 0 && (
                        <div className="mb-2">
                          <div className="font-medium">Details:</div>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {visibleResult.automation_details.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      )}
                      {visibleResult.screenshots && visibleResult.screenshots.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium">Screenshots (saved on backend):</div>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {visibleResult.screenshots.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setVisibleModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md">Close</button>
                </div>
              </div>
            </div>
          )}

        {/* Selenium Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Selenium in Your Portal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">✨ Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Automated form filling</li>
                <li>• Cross-browser compatibility</li>
                <li>• Screenshot capture</li>
                <li>• Error handling & recovery</li>
                <li>• Real-time progress tracking</li>
                <li>• Chrome Extension integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">🛠️ Supported Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Torrent Power (Electricity)</li>
                <li>• Adani Gas (Gas Connection)</li>
                <li>• AMC Water (Water Services)</li>
                <li>• AnyRoR Gujarat (Property)</li>
                <li>• DGVCL, GUVNL (Electricity)</li>
                <li>• Gujarat Gas (Gas Services)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 How It Works
            </h3>
            <p className="text-blue-800">
              Your portal uses Selenium WebDriver to automate browser interactions. 
              When you submit a form, Selenium opens a browser, navigates to the government website, 
              fills out the form with your data, and submits it automatically. 
              You get real-time updates and confirmation numbers upon successful submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleniumDemo;