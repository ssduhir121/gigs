
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   CurrencyDollarIcon,
//   UserIcon,
//   ShareIcon,
//   ClockIcon,
//   ChartBarIcon,
//   EyeIcon,
//   FireIcon,
//   ArrowPathIcon,
//   LockClosedIcon,
//   UserGroupIcon,
//   CheckBadgeIcon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';

// const MyGigs = () => {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState('all');

//   useEffect(() => {
//     fetchMyGigs();
//   }, []);

//   const fetchMyGigs = async () => {
//     try {
//       const res = await axios.get('/api/gigs/my-gigs');
//       setGigs(res.data.data?.data || res.data.data || []);
//       setError('');
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to load your gigs';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchMyGigs();
//   };

//   const filteredGigs = gigs.filter(gig => {
//     switch (activeTab) {
//       case 'public':
//         return gig.shareType === 'public';
//       case 'private':
//         return gig.shareType === 'private';
//       default:
//         return true;
//     }
//   });

//   const GigCard = ({ gig }) => {
//     const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
//     const amountPerShare = gig.budget / gig.sharesRequired;
//     const daysAgo = Math.floor((new Date() - new Date(gig.createdAt)) / (1000 * 60 * 60 * 24));
    
//     const applicationStats = gig.applicationStats || { pending: 0, approved: 0, rejected: 0, total: 0 };

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{gig.title}</h3>
//                 {gig.shareType === 'private' && (
//                   <LockClosedIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
//                 )}
//               </div>
//               <div className="flex items-center text-sm text-gray-500 mb-3">
//                 <ClockIcon className="w-4 h-4 mr-1" />
//                 <span>Created {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`}</span>
//                 <span className="mx-2">•</span>
//                 <span className={`capitalize ${gig.shareType === 'private' ? 'text-purple-600' : 'text-blue-600'}`}>
//                   {gig.shareType} gig
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-col items-end space-y-2">
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 gig.isActive 
//                   ? 'bg-green-100 text-green-800 border border-green-200' 
//                   : 'bg-gray-100 text-gray-800 border border-gray-200'
//               }`}>
//                 {gig.isActive ? 'Active' : 'Completed'}
//               </span>
//               {gig.isActive && (
//                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
//                   {gig.sharesRequired - gig.sharesCompleted} left
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig.description}</p>

//           {/* Private Gig Application Stats */}
//           {gig.shareType === 'private' && (
//             <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
//               <div className="flex items-center justify-between text-sm mb-2">
//                 <span className="text-purple-700 font-medium">Applications</span>
//                 <span className="text-gray-600">{applicationStats.total} total</span>
//               </div>
//               <div className="flex items-center justify-between text-xs">
//                 <div className="flex items-center">
//                   <ClockIcon className="w-3 h-3 text-yellow-600 mr-1" />
//                   <span className="text-yellow-700">{applicationStats.pending} pending</span>
//                 </div>
//                 <div className="flex items-center">
//                   <CheckBadgeIcon className="w-3 h-3 text-green-600 mr-1" />
//                   <span className="text-green-700">{applicationStats.approved} approved</span>
//                 </div>
//                 <div className="flex items-center">
//                   <XMarkIcon className="w-3 h-3 text-red-600 mr-1" />
//                   <span className="text-red-700">{applicationStats.rejected} rejected</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center text-sm">
//               <div className="p-2 bg-green-100 rounded-lg mr-3">
//                 <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">${gig.budget}</div>
//                 <div className="text-gray-500 text-xs">Total Budget</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <div className="p-2 bg-blue-100 rounded-lg mr-3">
//                 <ShareIcon className="w-4 h-4 text-blue-600" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   {gig.sharesCompleted}/{gig.sharesRequired}
//                 </div>
//                 <div className="text-gray-500 text-xs">Shares</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <div className="p-2 bg-orange-100 rounded-lg mr-3">
//                 <FireIcon className="w-4 h-4 text-orange-600" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">${amountPerShare.toFixed(2)}</div>
//                 <div className="text-gray-500 text-xs">Per Share</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <div className="p-2 bg-purple-100 rounded-lg mr-3">
//                 <ChartBarIcon className="w-4 h-4 text-purple-600" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">{progressPercentage.toFixed(0)}%</div>
//                 <div className="text-gray-500 text-xs">Progress</div>
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Completion</span>
//               <span>{progressPercentage.toFixed(1)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full transition-all duration-500 ${
//                   progressPercentage === 100 
//                     ? 'bg-green-500' 
//                     : 'bg-blue-500'
//                 }`}
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Link and CTA */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1 mr-4">
//               <a
//                 href={gig.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-700 text-sm truncate block transition-colors"
//                 title={gig.link}
//               >
//                 {gig.link}
//               </a>
//             </div>
//             <div className="flex items-center gap-2">
//               {gig.shareType === 'private' && gig.isActive && (
//                 <Link
//                   to={`/gigs/${gig._id}/applications`}
//                   className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
//                   title="Manage Applications"
//                 >
//                   <UserGroupIcon className="w-4 h-4" />
//                 </Link>
//               )}
//               <Link
//                 to={`/gigs/${gig._id}`}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 <EyeIcon className="w-4 h-4 mr-2" />
//                 View
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading your gigs...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && gigs.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">😕</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Gigs</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <button 
//                 onClick={fetchMyGigs}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 <ArrowPathIcon className="w-5 h-5 mr-2" />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Calculate stats for summary
//   const totalGigs = gigs.length;
//   const publicGigs = gigs.filter(g => g.shareType === 'public').length;
//   const privateGigs = gigs.filter(g => g.shareType === 'private').length;
//   const activeGigs = gigs.filter(g => g.isActive).length;
//   const totalBudget = gigs.reduce((sum, gig) => sum + gig.budget, 0);
//   const totalSharesCompleted = gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0);
//   const totalPendingApplications = gigs.reduce((sum, gig) => sum + (gig.applicationStats?.pending || 0), 0);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
//             <p className="text-gray-600">Manage and track your created gigs</p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//             >
//               <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <Link
//               to="/create-gig"
//               className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//             >
//               <PlusIcon className="w-5 h-5 mr-2" />
//               Create New Gig
//             </Link>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8 max-w-md">
//           <button
//             onClick={() => setActiveTab('all')}
//             className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'all'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             All Gigs ({totalGigs})
//           </button>
//           <button
//             onClick={() => setActiveTab('public')}
//             className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'public'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Public ({publicGigs})
//           </button>
//           <button
//             onClick={() => setActiveTab('private')}
//             className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'private'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Private ({privateGigs})
//           </button>
//         </div>

//         {/* Stats Summary */}
//         {gigs.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//               <div className="text-2xl font-bold text-blue-600">{totalGigs}</div>
//               <div className="text-sm text-gray-600">Total Gigs</div>
//             </div>
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//               <div className="text-2xl font-bold text-green-600">{activeGigs}</div>
//               <div className="text-sm text-gray-600">Active Gigs</div>
//             </div>
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//               <div className="text-2xl font-bold text-purple-600">${totalBudget.toFixed(0)}</div>
//               <div className="text-sm text-gray-600">Total Budget</div>
//             </div>
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//               <div className="text-2xl font-bold text-orange-600">{totalSharesCompleted}</div>
//               <div className="text-sm text-gray-600">Shares Completed</div>
//             </div>
//           </div>
//         )}

//         {/* Pending Applications Alert */}
//         {totalPendingApplications > 0 && (
//           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <div className="flex items-center">
//               <ClockIcon className="w-5 h-5 text-yellow-600 mr-3" />
//               <div>
//                 <h4 className="text-yellow-800 font-semibold">Pending Applications</h4>
//                 <p className="text-yellow-700 text-sm">
//                   You have {totalPendingApplications} pending application{totalPendingApplications !== 1 ? 's' : ''} waiting for review
//                 </p>
//               </div>
//               <Link
//                 to="/applications"
//                 className="ml-auto inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
//               >
//                 Review Now
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Gig Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredGigs.map((gig) => (
//             <GigCard key={gig._id} gig={gig} />
//           ))}
//         </div>

//         {/* Empty State for filtered results */}
//         {filteredGigs.length === 0 && gigs.length > 0 && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">
//                 {activeTab === 'public' ? '🌐' : activeTab === 'private' ? '🔒' : '📊'}
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 {activeTab === 'public' ? 'No Public Gigs' : activeTab === 'private' ? 'No Private Gigs' : 'No Gigs Found'}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {activeTab === 'public' 
//                   ? "You don't have any public gigs yet. Create a public gig to allow anyone to share your content."
//                   : activeTab === 'private'
//                   ? "You don't have any private gigs yet. Create a private gig to control who can share your content."
//                   : "No gigs match your current filters."}
//               </p>
//               <Link
//                 to="/create-gig"
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 <PlusIcon className="w-5 h-5 mr-2" />
//                 Create New Gig
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Empty State for no gigs at all */}
//         {gigs.length === 0 && !error && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">🚀</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gigs Yet</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 You haven't created any gigs yet. Start promoting your content and reach more people by creating your first gig.
//               </p>
//               <Link
//                 to="/create-gig"
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 <PlusIcon className="w-5 h-5 mr-2" />
//                 Create Your First Gig
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyGigs;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  PlusIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  FireIcon,
  ArrowPathIcon,
  LockClosedIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  XMarkIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const res = await axios.get('/api/gigs/my-gigs');
      setGigs(res.data.data?.data || res.data.data || []);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load your gigs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyGigs();
  };

  const filteredGigs = gigs.filter(gig => {
    switch (activeTab) {
      case 'public':
        return gig.shareType === 'public';
      case 'private':
        return gig.shareType === 'private';
      default:
        return true;
    }
  });

  // FIXED: Improved media URL function with better error handling
  const getMediaUrl = (gig) => {
    if (!gig) return null;
    
    // Priority 1: Use mediaFile if it contains a full URL or path
    if (gig.mediaFile) {
      if (gig.mediaFile.startsWith('http')) {
        return gig.mediaFile; // Full URL
      }
      if (gig.mediaFile.startsWith('/')) {
        return gig.mediaFile; // Absolute path
      }
      // If mediaFile is just a filename, construct path
      return `/uploads/${gig.mediaFile}`;
    }

    // Priority 2: Use mediaFileName to construct URL
    if (gig.mediaFileName) {
      return `/uploads/${gig.mediaFileName}`;
    }

    return null;
  };

  // FIXED: Improved media rendering with better fallbacks
  const renderMedia = (gig) => {
    const mediaUrl = getMediaUrl(gig);
    
    // Check if it's a video file
    const isVideo = gig.mediaFileName?.match(/\.(mp4|webm|ogg|mov|avi)$/i);

    if (mediaUrl) {
      if (isVideo) {
        return (
          <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              controls
              muted
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              VIDEO
            </div>
          </div>
        );
      } else {
        return (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={mediaUrl} 
              alt={gig.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Create a styled fallback
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                parent.className = "w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg";
                parent.innerHTML = `
                  <div class="text-center text-white p-4">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="font-medium text-sm">${gig.title}</p>
                    <p class="text-xs opacity-90 mt-1">Image not available</p>
                  </div>
                `;
              }}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              IMAGE
            </div>
          </div>
        );
      }
    }

    // If no media file but has link, show link preview
    if (gig.link) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-4">
            <LinkIcon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-600 font-medium text-sm">Link Content</p>
            <p className="text-gray-500 text-xs mt-2 truncate max-w-xs">{gig.link}</p>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center p-4">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Content Preview</p>
          <p className="text-gray-400 text-xs mt-1">No media available</p>
        </div>
      </div>
    );
  };

  const GigCard = ({ gig }) => {
    const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
    const amountPerShare = gig.budget / gig.sharesRequired;
    const daysAgo = Math.floor((new Date() - new Date(gig.createdAt)) / (1000 * 60 * 60 * 24));
    
    const applicationStats = gig.applicationStats || { pending: 0, approved: 0, rejected: 0, total: 0 };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Media Section */}
        <div className="relative">
          {renderMedia(gig)}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Gig Type Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
              gig.shareType === 'private' 
                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {gig.shareType === 'private' ? (
                <>
                  <LockClosedIcon className="w-3 h-3 mr-1" />
                  Private
                </>
              ) : (
                'Public'
              )}
            </div>
            
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              gig.isActive 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {gig.isActive ? 'Active' : 'Completed'}
            </span>
          </div>

          {/* Media Type Badge */}
          {gig.mediaFileName && (
            <div className="absolute top-3 left-3">
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                {gig.mediaFileName?.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? 'VIDEO' : 'IMAGE'}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
              {gig.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3 leading-relaxed">
              {gig.description}
            </p>
          </div>

          {/* Link Preview */}
          {gig.link && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                <LinkIcon className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <a 
                  href={gig.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="truncate hover:text-blue-600 transition-colors font-medium"
                >
                  {gig.link.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}

          {/* Private Gig Application Stats */}
          {gig.shareType === 'private' && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-purple-700 font-medium">Applications</span>
                <span className="text-gray-600">{applicationStats.total} total</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <ClockIcon className="w-3 h-3 text-yellow-600 mr-1" />
                  <span className="text-yellow-700">{applicationStats.pending} pending</span>
                </div>
                <div className="flex items-center">
                  <CheckBadgeIcon className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-green-700">{applicationStats.approved} approved</span>
                </div>
                <div className="flex items-center">
                  <XMarkIcon className="w-3 h-3 text-red-600 mr-1" />
                  <span className="text-red-700">{applicationStats.rejected} rejected</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">${gig.budget?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total Budget</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <ShareIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{gig.sharesCompleted}/{gig.sharesRequired}</div>
                <div className="text-xs text-gray-500">Shares</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <UserIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold truncate">{gig.user?.name || 'You'}</div>
                <div className="text-xs text-gray-500">Creator</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <ClockIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold">{new Date(gig.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">Created</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Campaign Progress</span>
              <span className="font-semibold">{progressPercentage.toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progressPercentage, 5)}%` }}
              ></div>
            </div>
          </div>

          {/* Earnings and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg mr-3">
                <FireIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  ${amountPerShare.toFixed(2)}/share
                </div>
                <div className="text-xs text-gray-500">Amount per share</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {gig.shareType === 'private' && gig.isActive && (
                <Link
                  to={`/gigs/${gig._id}/applications`}
                  className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                  title="Manage Applications"
                >
                  <UserGroupIcon className="w-4 h-4" />
                </Link>
              )}
              <Link
                to={`/gigs/${gig._id}`}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && gigs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Gigs</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={fetchMyGigs}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats for summary
  const totalGigs = gigs.length;
  const publicGigs = gigs.filter(g => g.shareType === 'public').length;
  const privateGigs = gigs.filter(g => g.shareType === 'private').length;
  const activeGigs = gigs.filter(g => g.isActive).length;
  const totalBudget = gigs.reduce((sum, gig) => sum + gig.budget, 0);
  const totalSharesCompleted = gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0);
  const totalPendingApplications = gigs.reduce((sum, gig) => sum + (gig.applicationStats?.pending || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Gigs
            </h1>
            <p className="text-gray-600 text-lg">Manage and track your created gigs</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/create-gig"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Gig
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Gigs ({totalGigs})
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'public'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Public ({publicGigs})
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'private'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Private ({privateGigs})
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{totalGigs}</div>
              <div className="text-sm text-gray-600">Total Gigs</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{activeGigs}</div>
              <div className="text-sm text-gray-600">Active Gigs</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">${totalBudget.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">{totalSharesCompleted}</div>
              <div className="text-sm text-gray-600">Shares Completed</div>
            </div>
          </div>
        )}

        {/* Pending Applications Alert */}
        {totalPendingApplications > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h4 className="text-yellow-800 font-semibold">Pending Applications</h4>
                <p className="text-yellow-700 text-sm">
                  You have {totalPendingApplications} pending application{totalPendingApplications !== 1 ? 's' : ''} waiting for review
                </p>
              </div>
              <Link
                to="/applications"
                className="ml-auto inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                Review Now
              </Link>
            </div>
          </div>
        )}

        {/* Gig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        {/* Empty State for filtered results */}
        {filteredGigs.length === 0 && gigs.length > 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">
                {activeTab === 'public' ? '🌐' : activeTab === 'private' ? '🔒' : '📊'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'public' ? 'No Public Gigs' : activeTab === 'private' ? 'No Private Gigs' : 'No Gigs Found'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {activeTab === 'public' 
                  ? "You don't have any public gigs yet. Create a public gig to allow anyone to share your content."
                  : activeTab === 'private'
                  ? "You don't have any private gigs yet. Create a private gig to control who can share your content."
                  : "No gigs match your current filters."}
              </p>
              <Link
                to="/create-gig"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Gig
              </Link>
            </div>
          </div>
        )}

        {/* Empty State for no gigs at all */}
        {gigs.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gigs Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't created any gigs yet. Start promoting your content and reach more people by creating your first gig.
              </p>
              <Link
                to="/create-gig"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Gig
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;