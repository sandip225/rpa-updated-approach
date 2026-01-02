import { useState, useEffect } from 'react';

const ChatBubble = ({ 
  message, 
  isUser = false, 
  isTyping = false, 
  animationDelay = 0,
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Fade in animation
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    // Show content after typing indicator (if not user message)
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, animationDelay + (isUser ? 0 : 500));

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(contentTimer);
    };
  }, [animationDelay, isUser]);

  // Typing indicator dots
  const TypingIndicator = () => (
    <div className="flex items-center gap-1 py-2 px-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div 
        className={`max-w-[85%] ${
          isUser 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl rounded-br-md' 
            : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-md border border-gray-100'
        } px-4 py-3`}
      >
        {/* Show typing indicator first for system messages */}
        {!isUser && !showContent && isTyping && <TypingIndicator />}
        
        {/* Message content */}
        {(showContent || isUser) && (
          <>
            {message && (
              <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}>
                {message}
              </p>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
};

// System message with bot avatar
export const SystemMessage = ({ message, children, animationDelay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const visibleTimer = setTimeout(() => setIsVisible(true), animationDelay);
    const contentTimer = setTimeout(() => setShowContent(true), animationDelay + 600);
    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(contentTimer);
    };
  }, [animationDelay]);

  return (
    <div 
      className={`flex items-start gap-2 mb-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Bot Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-white text-xs">🤖</span>
      </div>
      
      {/* Message Bubble */}
      <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-md shadow-md border border-gray-100 px-4 py-3">
        {!showContent ? (
          <div className="flex items-center gap-1 py-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <>
            {message && <p className="text-sm text-gray-700 leading-relaxed">{message}</p>}
            {children}
          </>
        )}
      </div>
    </div>
  );
};

// User message bubble
export const UserMessage = ({ message, animationDelay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div 
      className={`flex justify-end mb-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-[75%] bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
