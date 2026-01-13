import { motion } from 'framer-motion';

export const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const StepIndicator = ({ currentStep = 1, totalSteps = 4 }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={stepNum} className="flex items-center flex-1">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                isActive
                  ? 'bg-orange-500 shadow-lg'
                  : isCompleted
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
            >
              {isCompleted ? '✓' : stepNum}
            </motion.div>

            {stepNum < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Breadcrumb = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <button
            onClick={() => onStepClick && onStepClick(index)}
            className={`px-3 py-1 rounded-full transition-all ${
              index === currentStep
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {step}
          </button>
          {index < steps.length - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
