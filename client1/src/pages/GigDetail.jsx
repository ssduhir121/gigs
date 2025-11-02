import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  ShareIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const GigDetail = () => {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const res = await axios.get(`/api/gigs/${id}`);
      setGig(res.data.data);
    } catch (error) {
      console.error('Error fetching gig:', error);
      toast.error('Failed to load gig details');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate earnings
  const calculateEarnings = (amountPerShare) => {
    let platformFee, userEarning;

    if (amountPerShare < 2) {
      platformFee = 0.30;
      userEarning = amountPerShare - platformFee;
    } else {
      const percentageFee = amountPerShare * 0.065;
      platformFee = percentageFee + 0.60;
      userEarning = amountPerShare - platformFee;
    }

    userEarning = Math.max(userEarning, 0);

    return {
      userEarning: parseFloat(userEarning.toFixed(2)),
      platformFee: parseFloat(platformFee.toFixed(2))
    };
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to share this gig');
      navigate('/login');
      return;
    }

    setSharing(true);
    const shareToast = toast.loading('Generating your unique share link...');

    try {
      // Generate unique share URL
      const shareRes = await axios.post(`/api/gigs/${id}/generate-share-url`);
      
      const { shareUrl, gigTitle, gigLink } = shareRes.data.data;
      
      // Copy share URL to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast.success('Unique share link copied to clipboard! Share this URL with others to earn money.', {
        id: shareToast,
        duration: 6000
      });

      // Show modal with share options
      setShareData({
        url: shareUrl,
        title: gigTitle,
        link: gigLink
      });
      setShowShareModal(true);

      fetchGig(); // Refresh gig data
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating share link', {
        id: shareToast
      });
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Share Modal Component
  const ShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share This Gig</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Unique Share Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareData?.url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(shareData?.url)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center"
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share this unique link. Each unique person who clicks it earns you money.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">How it works:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Share your unique link with others</li>
                  <li>• Each new person who clicks earns you <strong>${userEarning.toFixed(2)}</strong></li>
                  <li>• Same person clicking multiple times doesn't count</li>
                  <li>• Payment is instant when someone clicks</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                window.open(shareData?.link, '_blank');
                setShowShareModal(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Open Gig Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig Not Found</h2>
          <p className="text-gray-600 mb-4">The gig you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/gigs')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Available Gigs
          </button>
        </div>
      </div>
    );
  }

  // Calculate earnings only when gig is available
  const amountPerShare = gig.budget / gig.sharesRequired;
  const { userEarning, platformFee } = calculateEarnings(amountPerShare);
  const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500 bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gig Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                <div className="flex items-center text-gray-600">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>Posted by <strong>{gig.user?.name}</strong></span>
                  <CalendarIcon className="w-4 h-4 ml-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                gig.isActive 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {gig.isActive ? 'Active' : 'Completed'}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={CurrencyDollarIcon}
                title="Total Budget"
                value={`$${gig.budget}`}
                color="green"
              />
              <StatCard
                icon={ShareIcon}
                title="Progress"
                value={`${gig.sharesCompleted}/${gig.sharesRequired}`}
                subtitle="shares completed"
                color="blue"
              />
              <StatCard
                icon={ChartBarIcon}
                title="Per Share"
                value={`$${amountPerShare.toFixed(2)}`}
                subtitle={`You get: $${userEarning.toFixed(2)}`}
                color="purple"
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <InformationCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{gig.description}</p>
            </div>

            {/* Link to Share */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
                Link to Share
              </h3>
              <a 
                href={gig.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors break-all"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {gig.link}
              </a>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
                Earnings Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total per share:</span>
                    <span className="font-semibold">${amountPerShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee:</span>
                    <span className="font-semibold text-red-600">-${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-gray-800 font-medium">You earn:</span>
                    <span className="font-semibold text-green-600">${userEarning.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Fee Structure:</p>
                  <p className="text-sm font-medium">
                    {amountPerShare < 2 ? 'Flat $0.30 fee' : '6.5% + $0.60 fee'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Ready to Earn?
                </h3>
                
                <button
                  onClick={handleShare}
                  disabled={sharing || !gig.isActive || gig.sharesCompleted >= gig.sharesRequired}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
                >
                  {!isAuthenticated 
                    ? 'Login to Share' 
                    : !gig.isActive 
                    ? 'Gig Completed' 
                    : gig.sharesCompleted >= gig.sharesRequired 
                    ? 'All Shares Completed' 
                    : sharing 
                    ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </div>
                    ) 
                    : `Get Share Link & Earn $${userEarning.toFixed(2)}`
                  }
                </button>
                
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600">
                    After platform fee: <span className="font-semibold text-green-600">${userEarning.toFixed(2)}</span>
                  </div>
                  
                  {gig.isActive && gig.sharesCompleted < gig.sharesRequired && (
                    <>
                      <div className="text-xs text-gray-500 flex items-center justify-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Payment when someone clicks your link
                      </div>
                      <div className="text-xs text-gray-400">
                        {gig.sharesRequired - gig.sharesCompleted} shares remaining
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && <ShareModal />}
      </div>
    </div>
  );
};

export default GigDetail;