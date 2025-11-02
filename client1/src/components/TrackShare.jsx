// components/TrackShare.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TrackShare = () => {
  const { trackingToken } = useParams();

  useEffect(() => {
    // Redirect to the backend tracking endpoint
    window.location.href = `/api/track-share/${trackingToken}`;
  }, [trackingToken]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default TrackShare;