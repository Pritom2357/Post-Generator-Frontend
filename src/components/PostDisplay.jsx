import React, { useState } from 'react';

const PostDisplay = ({ posts, platform }) => {
  const [copiedPost, setCopiedPost] = useState(null);

  const copyToClipboard = async (text, postType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPost(postType);
      setTimeout(() => setCopiedPost(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatPlatformName = (platform) => {
    const names = {
      facebook: 'Facebook',
      x: 'X (Twitter)',
      linkedin: 'LinkedIn',
      instagram: 'Instagram'
    };
    return names[platform] || platform;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: 'blue',
      x: 'gray',
      linkedin: 'blue',
      instagram: 'pink'
    };
    return colors[platform] || 'gray';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {formatPlatformName(platform)} Posts Generated
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-${getPlatformColor(platform)}-100 text-${getPlatformColor(platform)}-800`}>
          {getPlatformIcon(platform)} {formatPlatformName(platform)}
        </div>
      </div>

      {/* Final Post - Most Prominent */}
      {posts.final && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              ✨ Final Optimized Post
            </h3>
            <button
              onClick={() => copyToClipboard(posts.final, 'final')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                copiedPost === 'final'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {copiedPost === 'final' ? '✅ Copied!' : '📋 Copy Post'}
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
              {posts.final}
            </pre>
          </div>
        </div>
      )}

      {/* Collapsible sections for initial post and roast */}
      <details className="bg-white border border-gray-200 rounded-xl">
        <summary className="cursor-pointer p-4 hover:bg-gray-50 rounded-t-xl">
          <span className="font-semibold text-gray-700">📝 View Initial Post & Analysis</span>
        </summary>
        
        <div className="p-6 space-y-6 border-t border-gray-200">
          {/* Initial Post */}
          {posts.initial && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-blue-800">Initial Generated Post</h4>
                <button
                  onClick={() => copyToClipboard(posts.initial, 'initial')}
                  className={`px-3 py-1 text-sm rounded ${
                    copiedPost === 'initial'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copiedPost === 'initial' ? '✅' : '📋'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                {posts.initial}
              </pre>
            </div>
          )}

          {/* Roast Analysis */}
          {posts.roast && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-3">🔍 AI Analysis & Feedback</h4>
              <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                {posts.roast}
              </pre>
            </div>
          )}
        </div>
      </details>
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

export default PostDisplay;