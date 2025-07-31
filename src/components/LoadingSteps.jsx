import React from 'react';

const LoadingSteps = ({ currentStep, platform }) => {
  const steps = [
    { 
      key: 'processing', 
      label: 'Processing URL', 
      icon: '🔗',
      description: 'Extracting content from the article...'
    },
    { 
      key: 'summarizing', 
      label: 'Creating Summary', 
      icon: '📄',
      description: 'Generating intelligent summary...'
    },
    { 
      key: 'initial', 
      label: `Generating ${platform} Post`, 
      icon: getPlatformIcon(platform),
      description: `Creating initial ${platform} content...`
    },
    { 
      key: 'roasting', 
      label: 'Analyzing Content', 
      icon: '🔍',
      description: 'Getting feedback and suggestions...'
    },
    { 
      key: 'final', 
      label: 'Finalizing Post', 
      icon: '✨',
      description: 'Improving based on analysis...'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              index === currentStepIndex 
                ? 'bg-blue-50 border-2 border-blue-200' 
                : index < currentStepIndex 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`text-2xl ${index === currentStepIndex ? 'animate-pulse' : ''}`}>
              {index < currentStepIndex ? '✅' : step.icon}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${
                index === currentStepIndex ? 'text-blue-700' : 
                index < currentStepIndex ? 'text-green-700' : 'text-gray-500'
              }`}>
                {step.label}
              </div>
              {index === currentStepIndex && (
                <div className="text-sm text-blue-600 mt-1">
                  {step.description}
                </div>
              )}
            </div>
            {index === currentStepIndex && (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const getPlatformIcon = (platform) => {
  const icons = {
    facebook: '📘',
    x: '🐦',
    linkedin: '💼',
    instagram: '📸'
  };
  return icons[platform] || '📱';
};

export default LoadingSteps;