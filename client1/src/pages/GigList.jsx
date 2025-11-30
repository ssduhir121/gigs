
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { resolveValue, toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   CurrencyDollarIcon,
//   UserIcon,
//   ShareIcon,
//   ClockIcon,
//   FireIcon,
//   LockClosedIcon,
//   UserGroupIcon,
//   CheckBadgeIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline';

// const GigList = () => {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState(true);
//   const [filterType, setFilterType] = useState('all');
//   const [applyingGig, setApplyingGig] = useState(null);
//   const [applicationMessage, setApplicationMessage] = useState('');

//   useEffect(() => {
//     fetchGigs();
//   }, []);

//   const fetchGigs = async () => {
//     try {
//       const res = await axios.get('/api/gigs');
//       console.log(res)
//       setGigs(res.data.data);
//     } catch (error) {
//       console.error('Error fetching gigs:', error);
//       toast.error('Failed to load gigs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredGigs = gigs.filter(gig => {
//     const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterActive ? gig.isActive : true;
//     const matchesType = filterType === 'all' ? true : gig.shareType === filterType;
    
//     return matchesSearch && matchesFilter && matchesType;
//   });

//   const handleApplyForGig = async (gigId) => {
//     if (!applicationMessage.trim()) {
//       toast.error('Please add a message to your application');
//       return;
//     }

//     try {
//       const res = await axios.post(`/api/gigs/${gigId}/apply`, {
//         message: applicationMessage
//       });

//       toast.success(res.data.message);
//       setApplyingGig(null);
//       setApplicationMessage('');
      
//       fetchGigs();
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to apply for gig';
//       toast.error(errorMessage);
//     }
//   };

//   const GigCard = ({ gig }) => {
//     const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
//     const amountPerShare = gig.budget / gig.sharesRequired;
    
//     const hasApplied = gig.applications?.some(app => app.user?._id === gig.currentUserId) || false;
//     const isApproved = gig.approvedSharers?.some(sharer => sharer.user?._id === gig.currentUserId) || false;

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
//               <p className="text-gray-600 text-sm line-clamp-2 mb-3">{gig.description}</p>
              
//               {/* Gig Type Badge */}
//               <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 border ${
//                 gig.shareType === 'private' 
//                   ? 'bg-purple-100 text-purple-700 border-purple-200' 
//                   : 'bg-blue-100 text-blue-700 border-blue-200'
//               }`}>
//                 {gig.shareType === 'private' ? (
//                   <>
//                     <LockClosedIcon className="w-3 h-3 mr-1" />
//                     Private Gig
//                   </>
//                 ) : (
//                   'Public Gig'
//                 )}
//               </div>
//             </div>
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//               gig.isActive 
//                 ? 'bg-green-100 text-green-800 border border-green-200' 
//                 : 'bg-gray-100 text-gray-800 border border-gray-200'
//             }`}>
//               {gig.isActive ? 'Active' : 'Completed'}
//             </span>
//           </div>

//           {/* Application Status for Private Gigs */}
//           {gig.shareType === 'private' && gig.isActive && (
//             <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//               {hasApplied ? (
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center text-yellow-700">
//                     <ClockIcon className="w-4 h-4 mr-2" />
//                     <span>Application Pending</span>
//                   </div>
//                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                     Waiting
//                   </span>
//                 </div>
//               ) : isApproved ? (
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center text-green-700">
//                     <CheckBadgeIcon className="w-4 h-4 mr-2" />
//                     <span>Approved to Share</span>
//                   </div>
//                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
//                     Approved
//                   </span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center text-purple-700">
//                     <UserGroupIcon className="w-4 h-4 mr-2" />
//                     <span>Apply to share this gig</span>
//                   </div>
//                   <button
//                     onClick={() => setApplyingGig(gig._id)}
//                     className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
//                   >
//                     Apply Now
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center text-sm text-gray-600">
//               <div className="p-2 bg-green-100 rounded-lg mr-2">
//                 <CurrencyDollarIcon className="w-3 h-3 text-green-600" />
//               </div>
//               <span>${gig.budget}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <div className="p-2 bg-blue-100 rounded-lg mr-2">
//                 <ShareIcon className="w-3 h-3 text-blue-600" />
//               </div>
//               <span>{gig.sharesCompleted}/{gig.sharesRequired}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <div className="p-2 bg-purple-100 rounded-lg mr-2">
//                 <UserIcon className="w-3 h-3 text-purple-600" />
//               </div>
//               <span className="truncate">{gig.user?.name}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <div className="p-2 bg-orange-100 rounded-lg mr-2">
//                 <ClockIcon className="w-3 h-3 text-orange-600" />
//               </div>
//               <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Progress</span>
//               <span>{progressPercentage.toFixed(0)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Earnings and CTA */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="p-2 bg-orange-100 rounded-lg mr-2">
//                 <FireIcon className="w-3 h-3 text-orange-600" />
//               </div>
//               <span className="text-sm font-semibold text-gray-900">
//                 ${amountPerShare.toFixed(2)}/share
//               </span>
//             </div>
            
//             {gig.shareType === 'private' && !isApproved && !hasApplied ? (
//               <button
//                 onClick={() => setApplyingGig(gig._id)}
//                 className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
//               >
//                 <UserGroupIcon className="w-4 h-4 mr-2" />
//                 Apply to Share
//               </button>
//             ) : (
//               <Link
//                 to={`/gigs/${gig._id}`}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 View Details
//                 <ArrowRightIcon className="w-4 h-4 ml-2" />
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Application Modal
//   const ApplicationModal = () => {
//     if (!applyingGig) return null;

//     const gig = gigs.find(g => g._id === applyingGig);

//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Apply to Share Gig</h3>
//           <p className="text-gray-600 mb-4">{gig?.title}</p>
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Why should you be approved to share this gig?
//             </label>
//             <textarea
//               value={applicationMessage}
//               onChange={(e) => setApplicationMessage(e.target.value)}
//               placeholder="Tell the gig owner about your audience, sharing strategy, or why you'd be a good fit..."
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
//             />
//           </div>
          
//           <div className="flex space-x-3">
//             <button
//               onClick={() => {
//                 setApplyingGig(null);
//                 setApplicationMessage('');
//               }}
//               className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => handleApplyForGig(applyingGig)}
//               className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
//             >
//               Submit Application
//             </button>
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
//             <p className="text-gray-600">Loading available gigs...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Gigs</h1>
//             <p className="text-gray-600">Find gigs to share and start earning money</p>
//           </div>
//           <Link
//             to="/create-gig"
//             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//           >
//             <PlusIcon className="w-5 h-5 mr-2" />
//             Create New Gig
//           </Link>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <input
//                   type="text"
//                   placeholder="Search gigs by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>
//             </div>
            
//             {/* Filters */}
//             <div className="flex items-center space-x-4">
//               {/* Gig Type Filter */}
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               >
//                 <option value="all">All Gigs</option>
//                 <option value="public">Public Only</option>
//                 <option value="private">Private Only</option>
//               </select>

//               {/* Active Filter */}
//               <button
//                 onClick={() => setFilterActive(!filterActive)}
//                 className={`inline-flex items-center px-4 py-3 rounded-lg border transition-colors ${
//                   filterActive
//                     ? 'bg-blue-100 border-blue-300 text-blue-700'
//                     : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <FunnelIcon className="w-4 h-4 mr-2" />
//                 {filterActive ? 'Active Only' : 'Show All'}
//               </button>
              
//               <div className="text-sm text-gray-600">
//                 {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Gig Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredGigs.map((gig) => (
//             <GigCard key={gig._id} gig={gig} />
//           ))}
//         </div>

//         {/* Application Modal */}
//         <ApplicationModal />

//         {/* Empty State */}
//         {filteredGigs.length === 0 && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">
//                 {filterType === 'private' ? '🔒' : filterType === 'public' ? '🌐' : '🔍'}
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 {searchTerm 
//                   ? 'No matching gigs found' 
//                   : filterType === 'private' 
//                     ? 'No private gigs available' 
//                     : filterType === 'public'
//                       ? 'No public gigs available'
//                       : 'No gigs available'
//                 }
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {searchTerm 
//                   ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
//                   : filterType === 'private'
//                     ? 'Private gigs require approval from the gig owner. Check back later for new opportunities.'
//                     : 'There are no gigs available at the moment. Check back later or create your own gig to get started.'
//                 }
//               </p>
//               {!searchTerm && (
//                 <Link
//                   to="/create-gig"
//                   className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Create Your First Gig
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Quick Stats */}
//         {filteredGigs.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//               <div>
//                 <div className="text-2xl font-bold text-blue-600">{gigs.length}</div>
//                 <div className="text-sm text-gray-600">Total Gigs</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-green-600">
//                   {gigs.filter(g => g.isActive).length}
//                 </div>
//                 <div className="text-sm text-gray-600">Active Gigs</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-purple-600">
//                   {gigs.filter(g => g.shareType === 'private').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Private Gigs</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-orange-600">
//                   {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
//                 </div>
//                 <div className="text-sm text-gray-600">Shares Completed</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GigList;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  FireIcon,
  LockClosedIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  EyeIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [applyingGig, setApplyingGig] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get('/api/gigs');
      setGigs(res.data.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive ? gig.isActive : true;
    const matchesType = filterType === 'all' ? true : gig.shareType === filterType;
    
    return matchesSearch && matchesFilter && matchesType;
  });

  const handleApplyForGig = async (gigId) => {
    if (!applicationMessage.trim()) {
      toast.error('Please add a message to your application');
      return;
    }

    try {
      const res = await axios.post(`/api/gigs/${gigId}/apply`, {
        message: applicationMessage
      });

      toast.success(res.data.message);
      setApplyingGig(null);
      setApplicationMessage('');
      
      fetchGigs();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply for gig';
      toast.error(errorMessage);
    }
  };

  // FIXED: Improved media URL function with better error handling
  const getMediaUrl = (gig) => {
    if (!gig) return null;
    
    console.log('🔍 Media analysis for gig:', {
      gigId: gig._id,
      mediaFile: gig.mediaFile,
      mediaFileName: gig.mediaFileName,
      hasMediaFile: !!gig.mediaFile,
      hasMediaFileName: !!gig.mediaFileName
    });

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
    
    console.log('🎨 Rendering media:', {
      gigId: gig._id,
      mediaUrl,
      mediaFileName: gig.mediaFileName,
      hasLink: !!gig.link
    });

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
                console.error('❌ Image failed to load:', mediaUrl);
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
              onLoad={(e) => {
                console.log('✅ Image loaded successfully:', mediaUrl);
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
    
    // FIXED: Use actual user ID from auth context
    const hasApplied = gig.applications?.some(app => {
      const applicantId = app.user?._id || app.user;
      return applicantId === user?.id;
    }) || false;
    
    const isApproved = gig.approvedSharers?.some(sharer => {
      const sharerId = sharer.user?._id || sharer.user;
      return sharerId === user?.id;
    }) || false;

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

          {/* Application Status for Private Gigs */}
          {gig.shareType === 'private' && gig.isActive && user && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {hasApplied ? (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-yellow-700">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>Application Pending</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Waiting
                  </span>
                </div>
              ) : isApproved ? (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-700">
                    <CheckBadgeIcon className="w-4 h-4 mr-2" />
                    <span>Approved to Share</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    Approved
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-purple-700">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    <span>Apply to share this gig</span>
                  </div>
                  <button
                    onClick={() => setApplyingGig(gig._id)}
                    className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              )}
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
                <div className="font-semibold truncate">{gig.user?.name || 'Unknown'}</div>
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
                <div className="text-xs text-gray-500">Earnings per share</div>
              </div>
            </div>
            
            {gig.shareType === 'private' && !isApproved && !hasApplied && user ? (
              <button
                onClick={() => setApplyingGig(gig._id)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <UserGroupIcon className="w-4 h-4 mr-2" />
                Apply to Share
              </button>
            ) : (
              <Link
                to={`/gigs/${gig._id}`}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View Details
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Application Modal
  const ApplicationModal = () => {
    if (!applyingGig) return null;

    const gig = gigs.find(g => g._id === applyingGig);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Apply to Share Gig</h3>
          <p className="text-gray-600 mb-4">{gig?.title}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why should you be approved to share this gig?
            </label>
            <textarea
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="Tell the gig owner about your audience, sharing strategy, or why you'd be a good fit..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setApplyingGig(null);
                setApplicationMessage('');
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleApplyForGig(applyingGig)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Submit Application
            </button>
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
            <p className="text-gray-600">Loading available gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Available Gigs
            </h1>
            <p className="text-gray-600 text-lg">Find gigs to share and start earning money</p>
          </div>
          <Link
            to="/create-gig"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Gig
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gigs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Gig Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="all">All Gigs</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>

              {/* Active Filter */}
              <button
                onClick={() => setFilterActive(!filterActive)}
                className={`inline-flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  filterActive
                    ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                {filterActive ? 'Active Only' : 'Show All'}
              </button>
              
              <div className="text-sm text-gray-600 font-medium">
                {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
              </div>
            </div>
          </div>
        </div>

        {/* Gig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        {/* Application Modal */}
        <ApplicationModal />

        {/* Empty State */}
        {filteredGigs.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">
                {searchTerm ? '🔍' : filterType === 'private' ? '🔒' : filterType === 'public' ? '🌐' : '💼'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm 
                  ? 'No matching gigs found' 
                  : filterType === 'private' 
                    ? 'No private gigs available' 
                    : filterType === 'public'
                      ? 'No public gigs available'
                      : 'No gigs available'
                }
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : filterType === 'private'
                    ? 'Private gigs require approval from the gig owner. Check back later for new opportunities.'
                    : 'There are no gigs available at the moment. Check back later or create your own gig to get started.'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/create-gig"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Gig
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {filteredGigs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Platform Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{gigs.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Gigs</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {gigs.filter(g => g.isActive).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active Gigs</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">
                  {gigs.filter(g => g.shareType === 'private').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Private Gigs</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-2xl font-bold text-orange-600">
                  {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Shares Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigList;