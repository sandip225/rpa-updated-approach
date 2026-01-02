import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  currentStep: 'welcome', // welcome, service-select, provider-select, form, confirmation
  selectedCategory: null,
  selectedProvider: null,
  chatHistory: [],
  formData: {},
  submissionResult: null
};

const useGuidedFlow = () => {
  const [state, setState] = useState(INITIAL_STATE);

  // Add message to chat history
  const addMessage = useCallback((type, content, options = {}) => {
    setState(prev => ({
      ...prev,
      chatHistory: [
        ...prev.chatHistory,
        {
          type,
          content,
          timestamp: new Date(),
          ...options
        }
      ]
    }));
  }, []);

  // Start the flow from welcome screen
  const startFlow = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'service-select',
      chatHistory: [
        {
          type: 'system',
          content: '🙏 नमस्ते! Welcome to Gujarat Citizen Services Portal. Please select the service you need:',
          delay: 0
        }
      ]
    }));
  }, []);

  // Select a service category
  const selectCategory = useCallback((category) => {
    setState(prev => ({
      ...prev,
      currentStep: 'provider-select',
      selectedCategory: category,
      chatHistory: [
        ...prev.chatHistory,
        {
          type: 'user',
          content: `${category.name} (${category.nameHindi})`,
          delay: 0
        },
        {
          type: 'system',
          content: `Great choice! Here are the ${category.name} providers available. Select your provider to continue:`,
          delay: 300
        }
      ]
    }));
  }, []);

  // Select a provider and action
  const selectProvider = useCallback((provider, action) => {
    setState(prev => ({
      ...prev,
      currentStep: 'form',
      selectedProvider: provider,
      chatHistory: [
        ...prev.chatHistory,
        {
          type: 'user',
          content: `${provider.name} - ${action === 'name_change' ? 'Name Change' : action}`,
          delay: 0
        },
        {
          type: 'system',
          content: `Please fill in the required details for your ${action.replace('_', ' ')} application with ${provider.name}:`,
          delay: 300
        }
      ]
    }));
  }, []);

  // Update form data
  const updateFormData = useCallback((data) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  }, []);

  // Submit application and show confirmation
  const submitSuccess = useCallback((result) => {
    setState(prev => ({
      ...prev,
      currentStep: 'confirmation',
      submissionResult: result,
      chatHistory: [
        ...prev.chatHistory,
        {
          type: 'system',
          content: `✅ ${result.message}`,
          delay: 0
        }
      ]
    }));
  }, []);

  // Go back one step
  const goBack = useCallback(() => {
    setState(prev => {
      const { currentStep } = prev;
      
      switch (currentStep) {
        case 'service-select':
          return {
            ...prev,
            currentStep: 'welcome',
            chatHistory: []
          };
        case 'provider-select':
          return {
            ...prev,
            currentStep: 'service-select',
            selectedCategory: null,
            // Keep only the first system message
            chatHistory: prev.chatHistory.slice(0, 1)
          };
        case 'form':
          return {
            ...prev,
            currentStep: 'provider-select',
            selectedProvider: null,
            // Remove the last user and system messages (provider selection)
            chatHistory: prev.chatHistory.slice(0, -2)
          };
        case 'confirmation':
          // Don't allow going back from confirmation
          return prev;
        default:
          return prev;
      }
    });
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Start new application (from confirmation)
  const startNewApplication = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      currentStep: 'service-select',
      chatHistory: [
        {
          type: 'system',
          content: '🙏 Welcome back! Please select the service you need:',
          delay: 0
        }
      ]
    });
  }, []);

  return {
    // State
    currentStep: state.currentStep,
    selectedCategory: state.selectedCategory,
    selectedProvider: state.selectedProvider,
    chatHistory: state.chatHistory,
    formData: state.formData,
    submissionResult: state.submissionResult,
    
    // Actions
    startFlow,
    selectCategory,
    selectProvider,
    updateFormData,
    submitSuccess,
    goBack,
    reset,
    startNewApplication,
    addMessage
  };
};

export default useGuidedFlow;
