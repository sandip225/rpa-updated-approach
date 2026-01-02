import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useGuidedFlow from '../../hooks/useGuidedFlow';
import WelcomeScreen from './WelcomeScreen';
import ChatInterface from './ChatInterface';
import ProviderSelector from './ProviderSelector';
import ApplicationForm from './ApplicationForm';
import ConfirmationScreen from './ConfirmationScreen';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const GuidedFlowPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    currentStep,
    selectedCategory,
    selectedProvider,
    chatHistory,
    submissionResult,
    startFlow,
    selectCategory,
    selectProvider,
    submitSuccess,
    goBack,
    startNewApplication
  } = useGuidedFlow();

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch providers when category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchProviders(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/guided-flow/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async (category) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/guided-flow/providers/${category}`);
      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      setProviders(data.providers);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/guided-flow/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: selectedCategory.id,
          provider_id: selectedProvider.id,
          application_type: 'name_change',
          form_data: formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit application');
      }

      const result = await response.json();
      submitSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackApplication = () => {
    navigate('/applications');
  };

  // Render based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStartFlow={startFlow} />;

      case 'service-select':
        return (
          <div className="max-w-2xl mx-auto">
            <ChatInterface
              services={services}
              chatHistory={chatHistory}
              onSelectService={selectCategory}
              onBack={goBack}
              currentStep={currentStep}
            />
          </div>
        );

      case 'provider-select':
        return (
          <div className="max-w-2xl mx-auto">
            <ProviderSelector
              category={selectedCategory?.id}
              categoryName={selectedCategory?.name}
              categoryNameHindi={selectedCategory?.nameHindi}
              providers={providers}
              onSelectProvider={selectProvider}
              onBack={goBack}
            />
          </div>
        );

      case 'form':
        return (
          <div className="max-w-2xl mx-auto">
            <ApplicationForm
              provider={selectedProvider}
              category={selectedCategory?.id}
              onSubmit={handleSubmitApplication}
              onBack={goBack}
              isSubmitting={isSubmitting}
            />
          </div>
        );

      case 'confirmation':
        return (
          <div className="max-w-2xl mx-auto">
            <ConfirmationScreen
              trackingId={submissionResult?.tracking_id}
              message={submissionResult?.message}
              messageHindi={submissionResult?.messageHindi}
              estimatedTime={submissionResult?.estimated_time}
              onTrackApplication={handleTrackApplication}
              onNewApplication={startNewApplication}
            />
          </div>
        );

      default:
        return <WelcomeScreen onStartFlow={startFlow} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      {/* Error Banner */}
      {error && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-3">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderStep()}
    </div>
  );
};

export default GuidedFlowPage;
