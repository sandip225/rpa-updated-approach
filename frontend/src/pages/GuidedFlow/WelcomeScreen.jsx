import { Shield, ArrowRight, Sparkles } from 'lucide-react';

const WelcomeScreen = ({ onStartFlow }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="absolute top-10 left-10 w-20 h-20 md:w-32 md:h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 md:right-20 w-24 h-24 md:w-40 md:h-40 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-blue-200 rounded-full opacity-15 animate-bounce hidden md:block"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-lg w-full">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border-t-4 border-orange-500">
          {/* Header with Government Branding */}
          <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 p-1">
            <div className="bg-white p-6 md:p-8 text-center">
              {/* Ashoka Chakra / Government Logo */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl">
                    <Shield className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Gujarat Citizen Services Portal
              </h1>
              <p className="text-base md:text-lg text-orange-600 font-medium mb-1">
                गुजरात नागरिक सेवा पोर्टल
              </p>
              <p className="text-gray-500 text-xs md:text-sm">
                Unified Portal for Government Services
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="p-5 md:p-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-blue-100">
              <p className="text-gray-700 text-center leading-relaxed text-sm md:text-base">
                <span className="block text-base md:text-lg font-medium text-blue-800 mb-2">
                  🙏 नमस्ते! Welcome!
                </span>
                Apply for name change in your utility connections - 
                <span className="font-semibold text-orange-600"> Gas, Electricity, Water & Property</span> 
                - all in one place.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                Easy Process
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                Track Status
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                All Providers
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                Secure & Safe
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onStartFlow}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 group"
            >
              <span>Choose Service</span>
              <span className="text-xs md:text-sm opacity-80">सेवा चुनें</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Footer Note */}
            <p className="text-center text-[10px] md:text-xs text-gray-400 mt-3 md:mt-4">
              Powered by Gujarat Government • सुरक्षित और विश्वसनीय
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
