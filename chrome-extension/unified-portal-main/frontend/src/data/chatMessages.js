/**
 * Bilingual chat messages for WhatsApp-style guided flow
 * Hindi/English message templates
 */

export const CHAT_MESSAGES = {
  welcome: {
    greeting: {
      en: "🙏 Namaste! Welcome to Gujarat Citizen Services Portal.",
      hi: "🙏 नमस्ते! गुजरात नागरिक सेवा पोर्टल में आपका स्वागत है।"
    },
    selectService: {
      en: "Please select the service you need:",
      hi: "कृपया अपनी आवश्यक सेवा चुनें:"
    }
  },
  
  serviceSelection: {
    selected: {
      en: (serviceName) => `You selected: ${serviceName}`,
      hi: (serviceName) => `आपने चुना: ${serviceName}`
    },
    providerPrompt: {
      en: (serviceName) => `Great choice! Here are the ${serviceName} providers available. Select your provider to continue:`,
      hi: (serviceName) => `बढ़िया! यहाँ ${serviceName} प्रदाता उपलब्ध हैं। जारी रखने के लिए अपना प्रदाता चुनें:`
    }
  },
  
  providerSelection: {
    selected: {
      en: (providerName, action) => `${providerName} - ${action}`,
      hi: (providerName, action) => `${providerName} - ${action}`
    },
    formPrompt: {
      en: (providerName, action) => `Please fill in the required details for your ${action.replace('_', ' ')} application with ${providerName}:`,
      hi: (providerName, action) => `कृपया ${providerName} के साथ अपने ${action.replace('_', ' ')} आवेदन के लिए आवश्यक विवरण भरें:`
    }
  },
  
  form: {
    validation: {
      required: {
        en: "This field is required",
        hi: "यह फ़ील्ड आवश्यक है"
      },
      invalidMobile: {
        en: "Enter valid 10-digit mobile number",
        hi: "वैध 10 अंकों का मोबाइल नंबर दर्ज करें"
      },
      invalidEmail: {
        en: "Enter valid email address",
        hi: "वैध ईमेल पता दर्ज करें"
      }
    },
    submit: {
      en: "Submit Application",
      hi: "आवेदन जमा करें"
    },
    submitting: {
      en: "Submitting...",
      hi: "जमा हो रहा है..."
    }
  },
  
  confirmation: {
    success: {
      en: "Application Submitted Successfully!",
      hi: "आवेदन सफलतापूर्वक जमा हो गया!"
    },
    trackingId: {
      en: "Your Tracking ID",
      hi: "आपकी ट्रैकिंग आईडी"
    },
    saveNote: {
      en: "Save your tracking ID for future reference. You can track your application status anytime.",
      hi: "भविष्य के संदर्भ के लिए अपनी ट्रैकिंग आईडी सहेजें। आप कभी भी अपने आवेदन की स्थिति ट्रैक कर सकते हैं।"
    },
    estimatedTime: {
      en: "Estimated Processing Time",
      hi: "अनुमानित प्रसंस्करण समय"
    }
  },
  
  actions: {
    chooseService: {
      en: "Choose Service",
      hi: "सेवा चुनें"
    },
    back: {
      en: "Back",
      hi: "वापस"
    },
    trackApplication: {
      en: "Track Application",
      hi: "आवेदन ट्रैक करें"
    },
    newApplication: {
      en: "New Application",
      hi: "नया आवेदन"
    },
    nameChange: {
      en: "Name Change",
      hi: "नाम परिवर्तन"
    },
    officialPortal: {
      en: "Official Portal",
      hi: "आधिकारिक पोर्टल"
    }
  },
  
  status: {
    submitted: {
      en: "Submitted",
      hi: "जमा किया गया"
    },
    processing: {
      en: "Processing",
      hi: "प्रसंस्करण में"
    },
    completed: {
      en: "Completed",
      hi: "पूर्ण"
    },
    rejected: {
      en: "Rejected",
      hi: "अस्वीकृत"
    },
    pending: {
      en: "Pending",
      hi: "लंबित"
    }
  },
  
  errors: {
    networkError: {
      en: "Network error. Please try again.",
      hi: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।"
    },
    submitError: {
      en: "Failed to submit application. Please try again.",
      hi: "आवेदन जमा करने में विफल। कृपया पुनः प्रयास करें।"
    },
    loadError: {
      en: "Failed to load data. Please refresh the page.",
      hi: "डेटा लोड करने में विफल। कृपया पेज रीफ्रेश करें।"
    }
  },
  
  providers: {
    government: {
      en: "Government",
      hi: "सरकारी"
    },
    private: {
      en: "Private",
      hi: "निजी"
    },
    autoSubmission: {
      en: "Auto-submission enabled",
      hi: "स्वचालित सबमिशन सक्षम"
    },
    offlineNotice: {
      en: "Online service not available. Please visit the official portal.",
      hi: "ऑनलाइन सेवा उपलब्ध नहीं है। कृपया आधिकारिक पोर्टल पर जाएं।"
    }
  }
};

// Field labels in Hindi/English
export const FIELD_LABELS = {
  consumer_number: { en: 'Consumer Number', hi: 'उपभोक्ता संख्या' },
  service_number: { en: 'Service Number', hi: 'सेवा संख्या' },
  connection_id: { en: 'Connection ID', hi: 'कनेक्शन आईडी' },
  old_name: { en: 'Current Name', hi: 'वर्तमान नाम' },
  new_name: { en: 'New Name', hi: 'नया नाम' },
  old_owner: { en: 'Current Owner', hi: 'वर्तमान मालिक' },
  new_owner: { en: 'New Owner', hi: 'नया मालिक' },
  mobile: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  email: { en: 'Email Address', hi: 'ईमेल पता' },
  ward: { en: 'Ward Number', hi: 'वार्ड नंबर' },
  district: { en: 'District', hi: 'जिला' },
  taluka: { en: 'Taluka', hi: 'तालुका' },
  survey_number: { en: 'Survey Number', hi: 'सर्वे नंबर' },
  property_id: { en: 'Property ID', hi: 'संपत्ति आईडी' },
  bp_number: { en: 'BP Number', hi: 'बीपी नंबर' },
  t_no: { en: 'T Number', hi: 'टी नंबर' }
};

// Service names in Hindi
export const SERVICE_NAMES = {
  electricity: { en: 'Electricity', hi: 'बिजली' },
  gas: { en: 'Gas', hi: 'गैस' },
  water: { en: 'Water', hi: 'पानी' },
  property: { en: 'Property', hi: 'संपत्ति' }
};

export default CHAT_MESSAGES;
