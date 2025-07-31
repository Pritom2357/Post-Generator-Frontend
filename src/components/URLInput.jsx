import React, { useState } from 'react';
import { useEffect } from 'react';

const URLInput = ({ onSubmit, isProcessing }) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      sessionStorage.setItem("url", url.trim())
      onSubmit(url.trim());
    }
  };

  useEffect(()=>{
    if(sessionStorage.getItem("url")){
      setUrl(sessionStorage.getItem("url"))
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog post URL..."
          className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isProcessing}
          required
        />
        <button
          type="submit"
          disabled={isProcessing || !url.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Generate Posts'}
        </button>
      </div>
    </form>
  );
};

export default URLInput;