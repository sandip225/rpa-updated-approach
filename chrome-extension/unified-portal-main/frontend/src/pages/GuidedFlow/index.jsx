import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import useGuidedFlow from '../../hooks/useGuidedFlow';
import PageTransition from '../../components/animations/PageTransition';
import { ProgressBar, StepIndicator, Breadcrumb } from '../../components/progress/ProgressBar';
import LanguageToggle from '../../components/LanguageToggle';
import WelcomeScreen from './WelcomeScreen';
import ChatInterface from './ChatInterface';
import ProviderSelector from './ProviderSelector';
import ApplicationForm from './ApplicationForm';
import ConfirmationScreen from './ConfirmationScreen';

const API_BASE = '/api';

const GuidedFlowPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProviders');
    return saved ? JSON.parse(saved) : [];
  });

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
      const response = await fetch(`${API_BASE}/guided-flow/services`);
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
      const response = await fetch(`${API_BASE}/guided-flow/providers/${category}`);
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
      
      // Store form data for later use
      setSubmittedFormData(formData);

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/guided-flow/applications`, {
        method: 'POST',
        headers,
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

  const toggleFavorite = (providerId) => {
    const newFavorites = favorites.includes(providerId)
      ? favorites.filter(id => id !== providerId)
      : [...favorites, providerId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteProviders', JSON.stringify(newFavorites));
  };

  const handleTrackApplication = () => {
    navigate('/applications');
  };

  // Calculate progress
  const steps = ['welcome', 'service-select', 'provider-select', 'form', 'confirmation'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Render based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStartFlow={startFlow} />;

      case 'service-select':
        return (
          <div className="max-w-6xl mx-auto">
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
          <div className="max-w-6xl mx-auto">
            <ProviderSelector
              category={selectedCategory?.id}
              categoryName={selectedCategory?.name}
              categoryNameHindi={selectedCategory?.nameHindi}
              providers={providers}
              onSelectProvider={selectProvider}
              onBack={goBack}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        );

      case 'form':
        return (
          <div className="max-w-6xl mx-auto">
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
          <div className="max-w-6xl mx-auto">
            <ConfirmationScreen
              trackingId={submissionResult?.tracking_id}
              message={submissionResult?.message}
              messageHindi={submissionResult?.messageHindi}
              estimatedTime={submissionResult?.estimated_time}
              onTrackApplication={handleTrackApplication}
              onNewApplication={startNewApplication}
              portalUrl={selectedProvider?.name_change_url || selectedProvider?.portal_url}
              providerName={selectedProvider?.name}
              formData={submittedFormData}
            />
          </div>
        );

      default:
        return <WelcomeScreen onStartFlow={startFlow} />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
        {/* Header with Language Toggle */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('welcome')}</h1>
          <LanguageToggle />
        </div>

        {/* Progress Bar */}
        {currentStep !== 'welcome' && (
          <div className="max-w-6xl mx-auto mb-6">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Step Indicator */}
        {currentStep !== 'welcome' && (
          <div className="max-w-6xl mx-auto mb-6">
            <StepIndicator currentStep={currentStepIndex + 1} totalSteps={steps.length} />
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="max-w-6xl mx-auto mb-4 relative z-50">
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
              <p className="text-gray-600 mt-3">{t('loading')}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderStep()}
      </div>
    </PageTransition>
  );
};

export default GuidedFlowPage;
