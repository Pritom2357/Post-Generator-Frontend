import React, { useState, useEffect } from 'react';
import URLInput from './URLInput';
import PlatformSelector from './PlatformSelector';
import LoadingSteps from './LoadingSteps';
import PostDisplay from './PostDisplay';

const PostGenerator = () => {
  const [currentStep, setCurrentStep] = useState('idle');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [allPosts, setAllPosts] = useState({}); // Store posts for all platforms
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');

  const API_BASE = 'http://localhost:3000/api';

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('generatedPosts');
      const savedSummary = localStorage.getItem('articleSummary');
      const savedUrl = localStorage.getItem('processedUrl');
      const savedPlatform = localStorage.getItem('selectedPlatform');

      if (savedPosts) {
        setAllPosts(JSON.parse(savedPosts));
      }
      if (savedSummary) {
        setSummary(savedSummary);
      }
      if (savedUrl) {
        setProcessedUrl(savedUrl);
      }
      if (savedPlatform) {
        setSelectedPlatform(savedPlatform);
      }
    } catch (error) {
      console.warn('Error loading saved data:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('generatedPosts', JSON.stringify(allPosts));
    } catch (error) {
      console.warn('Error saving posts:', error);
    }
  }, [allPosts]);

  useEffect(() => {
    try {
      if (summary) {
        localStorage.setItem('articleSummary', summary);
      }
    } catch (error) {
      console.warn('Error saving summary:', error);
    }
  }, [summary]);

  useEffect(() => {
    try {
      if (processedUrl) {
        localStorage.setItem('processedUrl', processedUrl);
      }
    } catch (error) {
      console.warn('Error saving URL:', error);
    }
  }, [processedUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('selectedPlatform', selectedPlatform);
    } catch (error) {
      console.warn('Error saving platform:', error);
    }
  }, [selectedPlatform]);

  const handleURLSubmit = async (url) => {
    try {
      setError('');
      setCurrentStep('processing');
      
      // Step 1: Process URL and get summary
      const processResponse = await fetch(`${API_BASE}/process-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!processResponse.ok) throw new Error('Failed to process URL');
      
      const processData = await processResponse.json();
      setSummary(processData.summary);
      setProcessedUrl(url);
      
      // Step 2: Generate initial post
      setCurrentStep('initial');
      const initialResponse = await fetch(`${API_BASE}/generate-initial/${selectedPlatform}`);
      if (!initialResponse.ok) throw new Error('Failed to generate initial post');
      
      const initialData = await initialResponse.json();
      
      // Step 3: Get roast analysis
      setCurrentStep('roasting');
      const roastResponse = await fetch(`${API_BASE}/roast-post/${selectedPlatform}`);
      if (!roastResponse.ok) throw new Error('Failed to get post analysis');
      
      const roastData = await roastResponse.json();
      
      // Step 4: Generate final post
      setCurrentStep('final');
      const finalResponse = await fetch(`${API_BASE}/generate-final/${selectedPlatform}`);
      if (!finalResponse.ok) throw new Error('Failed to generate final post');
      
      const finalData = await finalResponse.json();
      
      // Save posts for current platform
      const platformPosts = {
        initial: initialData.post,
        roast: roastData.roast,
        final: finalData.finalPost
      };

      setAllPosts(prevPosts => ({
        ...prevPosts,
        [selectedPlatform]: platformPosts
      }));
      
      setCurrentStep('completed');
      
    } catch (err) {
      setError(err.message);
      setCurrentStep('idle');
    }
  };

  const handlePlatformChange = async (platform) => {
    if (currentStep === 'processing' || currentStep === 'initial' || currentStep === 'roasting' || currentStep === 'final') {
      return; // Don't allow platform change during processing
    }

    setSelectedPlatform(platform);
    setError('');

    // If we have a summary but no posts for this platform, generate them
    if (summary && !allPosts[platform]) {
      try {
        setCurrentStep('initial');
        
        // Generate posts for the new platform
        const initialResponse = await fetch(`${API_BASE}/generate-initial/${platform}`);
        if (!initialResponse.ok) throw new Error('Failed to generate initial post');
        
        const initialData = await initialResponse.json();
        
        setCurrentStep('roasting');
        const roastResponse = await fetch(`${API_BASE}/roast-post/${platform}`);
        if (!roastResponse.ok) throw new Error('Failed to get post analysis');
        
        const roastData = await roastResponse.json();
        
        setCurrentStep('final');
        const finalResponse = await fetch(`${API_BASE}/generate-final/${platform}`);
        if (!finalResponse.ok) throw new Error('Failed to generate final post');
        
        const finalData = await finalResponse.json();
        
        const platformPosts = {
          initial: initialData.post,
          roast: roastData.roast,
          final: finalData.finalPost
        };

        setAllPosts(prevPosts => ({
          ...prevPosts,
          [platform]: platformPosts
        }));
        
        setCurrentStep('completed');
        
      } catch (err) {
        setError(err.message);
        setCurrentStep('completed');
      }
    } else if (allPosts[platform]) {
      setCurrentStep('completed');
    } else {
      setCurrentStep('idle');
    }
  };

  const resetGenerator = () => {
    setCurrentStep('idle');
    setAllPosts({});
    setSummary('');
    setError('');
    setProcessedUrl('');
    
    // Clear localStorage
    try {
      localStorage.removeItem('generatedPosts');
      localStorage.removeItem('articleSummary');
      localStorage.removeItem('processedUrl');
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };

  // Get current platform posts
  const currentPosts = allPosts[selectedPlatform] || {};
  const hasCurrentPosts = currentPosts.final;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 AI Social Media Post Generator
          </h1>
          <p className="text-xl text-gray-600">
            Transform any blog post into engaging social media content
          </p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Show processed URL info */}
        {processedUrl && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ Article processed: <span className="font-medium">{processedUrl}</span>
            </p>
          </div>
        )}

        <div className="space-y-12">
          {/* URL Input */}
          {(currentStep === 'idle' || currentStep === 'completed') && (
            <URLInput 
              onSubmit={handleURLSubmit} 
              isProcessing={currentStep !== 'idle' && currentStep !== 'completed'} 
            />
          )}

          {/* Platform Selector */}
          {(summary || currentStep === 'idle') && (
            <PlatformSelector 
              selectedPlatform={selectedPlatform}
              onPlatformChange={handlePlatformChange}
              isProcessing={currentStep === 'processing' || currentStep === 'initial' || currentStep === 'roasting' || currentStep === 'final'}
            />
          )}

          {/* Show generated platforms indicator */}
          {Object.keys(allPosts).length > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Posts generated for:</p>
              <div className="flex justify-center gap-2">
                {Object.keys(allPosts).map(platform => (
                  <span 
                    key={platform}
                    className={`px-3 py-1 text-xs rounded-full ${
                      platform === selectedPlatform 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {currentStep !== 'idle' && currentStep !== 'completed' && (
            <LoadingSteps 
              currentStep={currentStep} 
              platform={selectedPlatform}
            />
          )}

          {/* Generated Posts */}
          {currentStep === 'completed' && hasCurrentPosts && (
            <>
              <PostDisplay 
                posts={currentPosts} 
                platform={selectedPlatform}
              />
              <div className="text-center space-x-4">
                <button
                  onClick={resetGenerator}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate New Posts
                </button>
                {Object.keys(allPosts).length > 1 && (
                  <span className="text-sm text-gray-600">
                    Switch platforms above to view other generated posts
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;