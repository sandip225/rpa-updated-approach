import { useEffect, useRef } from 'react';
import { Zap, Flame, Droplets, Building, ArrowLeft } from 'lucide-react';
import { SystemMessage, UserMessage } from '../../components/ChatBubble';

const SERVICE_ICONS = {
  electricity: Zap,
  gas: Flame,
  water: Droplets,
  property: Building
};

const SERVICE_GRADIENTS = {
  electricity: 'from-amber-400 to-orange-500',
  gas: 'from-red-400 to-rose-600',
  water: 'from-cyan-400 to-blue-500',
  property: 'from-emerald-400 to-green-600'
};

const ChatInterface = ({ 
  services, 
  chatHistory, 
  onSelectService, 
  onBack,
  currentStep 
}) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
        {onBack && currentStep !== 'service-select' && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold">Gujarat Citizen Helper</h3>
          <p className="text-xs text-blue-100">गुजरात नागरिक सहायक • Online</p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Render chat history */}
        {chatHistory.map((item, index) => {
          if (item.type === 'system') {
            return (
              <SystemMessage 
                key={index} 
                message={item.content}
                animationDelay={item.delay || 0}
              >
                {item.children}
              </SystemMessage>
            );
          } else if (item.type === 'user') {
            return (
              <UserMessage 
                key={index} 
                message={item.content}
                animationDelay={item.delay || 0}
              />
            );
          } else if (item.type === 'options') {
            return (
              <div key={index} className="pl-10 mt-2">
                {item.children}
              </div>
            );
          }
          return null;
        })}

        {/* Service Selection Options */}
        {currentStep === 'service-select' && services.length > 0 && (
          <div className="pl-10 mt-4">
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => {
                const Icon = SERVICE_ICONS[service.id];
                return (
                  <button
                    key={service.id}
                    onClick={() => onSelectService(service)}
                    className={`bg-gradient-to-r ${SERVICE_GRADIENTS[service.id]} text-white p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2`}
                  >
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center">
                      {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-xs opacity-90">{service.nameHindi}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {service.providerCount} providers
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area (disabled for guided flow) */}
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-4 py-3 text-gray-400 text-sm border border-gray-200">
            Select an option above to continue...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
