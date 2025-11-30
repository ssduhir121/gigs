// src/components/GigDisplay.jsx
import React from 'react';
import { EyeIcon, LinkIcon } from '@heroicons/react/24/outline';

const GigDisplay = ({ gig }) => {
  const { title, description, link, contentType, mediaFileName } = gig;

  const renderContent = () => {
    switch (contentType) {
      case 'link':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300 truncate">{link}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View
              </a>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">Image: {mediaFileName}</span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View Image
              </a>
            </div>
            <img
              src={link}
              alt={title}
              className="w-full max-h-64 object-contain rounded-lg"
            />
          </div>
        );

      case 'video':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">Video: {mediaFileName}</span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View Video
              </a>
            </div>
            <video
              src={link}
              controls
              className="w-full max-h-64 object-contain rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default GigDisplay;