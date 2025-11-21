// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';
// import {
//   CurrencyDollarIcon,
//   ShareIcon,
//   UserIcon,
//   CalendarIcon,
//   LinkIcon,
//   InformationCircleIcon,
//   ChartBarIcon,
//   ClockIcon,
//   DocumentDuplicateIcon,
//   XMarkIcon,
//   EyeIcon,
//   QrCodeIcon
// } from '@heroicons/react/24/outline';

// // Import color system
// import { colors, colorVariants } from '../constants/colors';
// import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

// const GigDetail = () => {
//   const [gig, setGig] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sharing, setSharing] = useState(false);
//   const [shareData, setShareData] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [existingShare, setExistingShare] = useState(null);
//   const { id } = useParams();
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchGig();
//     checkExistingShare();
//   }, [id]);

//   const fetchGig = async () => {
//     try {
//       const res = await axios.get(`/api/gigs/${id}`);
//       setGig(res.data.data);
//     } catch (error) {
//       console.error('Error fetching gig:', error);
//       toast.error('Failed to load gig details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkExistingShare = async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       const res = await axios.get('/api/gigs/my-shares');
//       const userShares = res.data.data;
//       const existing = userShares.find(share => share.gig._id === id);
//       setExistingShare(existing);
//     } catch (error) {
//       console.error('Error checking existing shares:', error);
//     }
//   };

//   // Calculate earnings based on backend commission structure
//   const calculateEarnings = (gigData) => {
//     if (!gigData) return { userEarning: 0, platformFee: 0 };
    
//     const amountPerShare = gigData.availableFunds / gigData.sharesRequired;
//     const userEarning = amountPerShare;
//     const platformFee = 0;
    
//     return {
//       userEarning: parseFloat(userEarning.toFixed(2)),
//       platformFee: parseFloat(platformFee.toFixed(2)),
//       amountPerShare: parseFloat(amountPerShare.toFixed(2))
//     };
//   };

//   const handleShare = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to share this gig');
//       navigate('/login');
//       return;
//     }

//     // If user already has a share link, show it in modal
//     if (existingShare) {
//       const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
//       setShareData({
//         url: shareUrl,
//         title: gig.title,
//         link: gig.link,
//         trackingToken: existingShare.trackingToken,
//         stats: {
//           totalClicks: existingShare.totalClicks,
//           uniqueClicks: existingShare.uniqueClicks,
//           amountEarned: existingShare.amountEarned
//         }
//       });
//       setShowShareModal(true);
//       return;
//     }

//     setSharing(true);
//     const shareToast = toast.loading('Generating your unique share link...');

//     try {
//       const shareRes = await axios.post(`/api/gigs/${id}/generate-share-url`);
      
//       console.log('Share response:', shareRes.data);
      
//       const { shareUrl, trackingToken, existing } = shareRes.data.data;
      
//       const frontendShareUrl = `${window.location.origin}/track-share/${trackingToken}`;
      
//       if (existing) {
//         toast.success('Using your existing share link!', { id: shareToast });
//       } else {
//         toast.success('Share link generated successfully!', { id: shareToast });
//       }

//       setShareData({
//         url: frontendShareUrl,
//         title: gig.title,
//         link: gig.link,
//         trackingToken: trackingToken,
//         stats: {
//           totalClicks: 0,
//           uniqueClicks: 0,
//           amountEarned: 0
//         }
//       });
//       setShowShareModal(true);
      
//       // Refresh data
//       fetchGig();
//       checkExistingShare();
      
//     } catch (error) {
//       console.error('Error generating share link:', error);
//       toast.error(error.response?.data?.message || 'Error generating share link', {
//         id: shareToast
//       });
//     } finally {
//       setSharing(false);
//     }
//   };

//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success('Copied to clipboard!');
//     } catch (err) {
//       toast.error('Failed to copy to clipboard');
//     }
//   };

//   const handlePreview = () => {
//     if (existingShare) {
//       const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
//       setShareData({
//         url: shareUrl,
//         title: gig.title,
//         link: gig.link,
//         trackingToken: existingShare.trackingToken,
//         stats: {
//           totalClicks: existingShare.totalClicks,
//           uniqueClicks: existingShare.uniqueClicks,
//           amountEarned: existingShare.amountEarned
//         }
//       });
//       setShowPreviewModal(true);
//     }
//   };

//   // Share Modal Component
//   const ShareModal = ({ userEarning }) => (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <GlassCard className="max-w-md w-full p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-white">
//             {existingShare ? 'Your Share Link' : 'Share This Gig'}
//           </h3>
//           <button
//             onClick={() => setShowShareModal(false)}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           {/* Share Stats (if existing share) */}
//           {existingShare && shareData?.stats && (
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
//                 <div className="text-2xl font-bold text-white">{shareData.stats.totalClicks}</div>
//                 <div className="text-xs text-gray-300">Total Clicks</div>
//               </div>
//               <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
//                 <div className="text-2xl font-bold text-green-400">{shareData.stats.uniqueClicks}</div>
//                 <div className="text-xs text-gray-300">Unique Clicks</div>
//               </div>
//               <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
//                 <div className="text-2xl font-bold text-yellow-400">${shareData.stats.amountEarned}</div>
//                 <div className="text-xs text-gray-300">Earned</div>
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-200 mb-2">
//               Your Unique Share Link
//             </label>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={shareData?.url}
//                 readOnly
//                 className="flex-1 px-3 py-2 border border-white/20 rounded-lg text-sm bg-white/5 backdrop-blur-sm text-white"
//               />
//               <button
//                 onClick={() => copyToClipboard(shareData?.url)}
//                 className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center backdrop-blur-sm"
//               >
//                 <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
//                 Copy
//               </button>
//             </div>
//           </div>
          
//           <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-3 backdrop-blur-sm">
//             <div className="flex items-start">
//               <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-blue-300 font-medium mb-1">How it works:</p>
//                 <ul className="text-xs text-blue-200 space-y-1">
//                   <li>• Share your unique link with others</li>
//                   <li>• Each new person who clicks earns you <strong>${userEarning.toFixed(2)}</strong></li>
//                   <li>• Same person clicking multiple times doesn't count</li>
//                   <li>• Payment is instant when someone clicks</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between space-x-3 pt-2">
//             <button
//               onClick={() => setShowShareModal(false)}
//               className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
//             >
//               Close
//             </button>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handlePreview}
//                 className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center backdrop-blur-sm"
//               >
//                 <EyeIcon className="w-4 h-4 mr-1" />
//                 Preview
//               </button>
//               <button
//                 onClick={() => {
//                   window.open(shareData?.link, '_blank');
//                   setShowShareModal(false);
//                 }}
//                 className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center backdrop-blur-sm"
//               >
//                 <LinkIcon className="w-4 h-4 mr-1" />
//                 Open Gig
//               </button>
//             </div>
//           </div>
//         </div>
//       </GlassCard>
//     </div>
//   );

//   // Preview Modal Component
//   const PreviewModal = () => (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <GlassCard className="max-w-2xl w-full p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-white">Preview Share Link</h3>
//           <button
//             onClick={() => setShowPreviewModal(false)}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-6">
//           {/* Preview Card */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="p-6">
//               <h4 className="text-lg font-semibold text-gray-900 mb-2">{gig?.title}</h4>
//               <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig?.description}</p>
              
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center text-sm text-gray-500">
//                   <UserIcon className="w-4 h-4 mr-1" />
//                   <span>Shared by {user?.name}</span>
//                 </div>
//                 <div className="text-sm font-semibold text-green-600">
//                   Earn ${userEarning.toFixed(2)}
//                 </div>
//               </div>
              
//               <div className="bg-gray-100 rounded-lg p-4 mb-4">
//                 <div className="text-xs text-gray-500 mb-2">Share this link to earn money:</div>
//                 <div className="text-sm font-mono text-gray-800 bg-white p-2 rounded border break-all">
//                   {shareData?.url}
//                 </div>
//               </div>
              
//               <button 
//                 onClick={() => window.open(gig?.link, '_blank')}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 Visit Gig Website
//               </button>
//             </div>
//           </div>

//           {/* QR Code Section */}
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-lg p-4 mb-4">
//               <div className="text-center text-gray-500">
//                 <QrCodeIcon className="w-12 h-12 mx-auto mb-2" />
//                 <div className="text-xs">QR Code Preview</div>
//               </div>
//             </div>
//             <p className="text-sm text-gray-300">Scan to visit your share link</p>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setShowPreviewModal(false)}
//               className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
//             >
//               Close
//             </button>
//             <button
//               onClick={() => copyToClipboard(shareData?.url)}
//               className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center backdrop-blur-sm"
//             >
//               <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
//               Copy Link
//             </button>
//           </div>
//         </div>
//       </GlassCard>
//     </div>
//   );

//   if (loading) {
//     return (
//       <GradientBackground className="flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white/80">Loading gig details...</p>
//         </div>
//       </GradientBackground>
//     );
//   }

//   if (!gig) {
//     return (
//       <GradientBackground className="flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😕</div>
//           <h2 className="text-2xl font-bold text-white mb-2">Gig Not Found</h2>
//           <p className="text-gray-200 mb-4">The gig you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate('/gigs')}
//             className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 backdrop-blur-sm"
//           >
//             Browse Available Gigs
//           </button>
//         </div>
//       </GradientBackground>
//     );
//   }

//   const { userEarning, platformFee, amountPerShare } = calculateEarnings(gig);
//   const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;

//   const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
//     const colorVariant = colorVariants[color];
    
//     return (
//       <GlassCard className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
//             <p className="text-2xl font-bold text-white">{value}</p>
//             {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
//           </div>
//           <StatIconWrapper color={color}>
//             <Icon className="w-6 h-6 text-white" />
//           </StatIconWrapper>
//         </div>
//       </GlassCard>
//     );
//   };

//   return (
//     <GradientBackground className="py-8">
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Gig Header */}
//         <GlassCard className="overflow-hidden mb-8">
//           <div className="p-8">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
//                 <div className="flex items-center text-gray-200">
//                   <UserIcon className="w-4 h-4 mr-2" />
//                   <span>Posted by <strong className="text-white">{gig.user?.name}</strong></span>
//                   <CalendarIcon className="w-4 h-4 ml-4 mr-2" />
//                   <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//               <StatusBadge color={gig.isActive ? 'green' : 'gray'}>
//                 {gig.isActive ? 'Active' : 'Completed'}
//               </StatusBadge>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <StatCard
//                 icon={CurrencyDollarIcon}
//                 title="Total Budget"
//                 value={`$${gig.budget}`}
//                 color="green"
//               />
//               <StatCard
//                 icon={ShareIcon}
//                 title="Progress"
//                 value={`${gig.sharesCompleted}/${gig.sharesRequired}`}
//                 subtitle="shares completed"
//                 color="blue"
//               />
//               <StatCard
//                 icon={ChartBarIcon}
//                 title="Per Share"
//                 value={`$${amountPerShare.toFixed(2)}`}
//                 subtitle={`You get: $${userEarning.toFixed(2)}`}
//                 color="purple"
//               />
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm text-gray-200 mb-2">
//                 <span>Progress</span>
//                 <span>{progressPercentage.toFixed(1)}%</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
//                 <div 
//                   className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 backdrop-blur-sm"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </GlassCard>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Description */}
//             <GlassCard className="p-6">
//              <div>
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                 <InformationCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
//                 Description
//               </h3>
//               <p className="text-gray-200 leading-relaxed">{gig.description}</p>
//             </div>
//             {/* link to share */}
//             <div>
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                 <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
//                 Link to Share
//               </h3>
//               <a 
//                 href={gig.link} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center px-4 py-2 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-all duration-200 backdrop-blur-sm border border-blue-400/30 break-all"
//               >
//                 <LinkIcon className="w-4 h-4 mr-2" />
//                 {gig.link}
//               </a>
//             </div>
//             </GlassCard>
           
           

//             {/* Existing Share Link (if any) */}
//             {existingShare && (
//               <GlassCard className="p-6 border-l-4 border-l-green-500">
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                   <ShareIcon className="w-5 h-5 text-green-400 mr-2" />
//                   Your Share Link
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
//                     <div className="flex-1">
//                       <div className="text-sm text-gray-300 mb-1">Your Unique Link</div>
//                       <div className="text-white font-mono text-sm break-all">
//                         {`${window.location.origin}/track-share/${existingShare.trackingToken}`}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => copyToClipboard(`${window.location.origin}/track-share/${existingShare.trackingToken}`)}
//                       className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
//                     >
//                       <DocumentDuplicateIcon className="w-5 h-5" />
//                     </button>
//                   </div>
                  
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="p-2 bg-white/5 rounded-lg">
//                       <div className="text-lg font-bold text-white">{existingShare.totalClicks}</div>
//                       <div className="text-xs text-gray-300">Total Clicks</div>
//                     </div>
//                     <div className="p-2 bg-white/5 rounded-lg">
//                       <div className="text-lg font-bold text-green-400">{existingShare.uniqueClicks}</div>
//                       <div className="text-xs text-gray-300">Unique Clicks</div>
//                     </div>
//                     <div className="p-2 bg-white/5 rounded-lg">
//                       <div className="text-lg font-bold text-yellow-400">${existingShare.amountEarned}</div>
//                       <div className="text-xs text-gray-300">Earned</div>
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>
//             )}

          
//           </div>

//           {/* Share Action Card */}
//           <div className="lg:col-span-1">
//             <GlassCard className="sticky top-8 backdrop-blur-lg">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-white mb-4 text-center">
//                   {existingShare ? 'Your Share Link' : 'Ready to Earn?'}
//                 </h3>
                
//                 {existingShare ? (
//                   <div className="space-y-4">
//                     <button
//                       onClick={() => {
//                         const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
//                         copyToClipboard(shareUrl);
//                         toast.success('Share link copied!');
//                       }}
//                       className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center"
//                     >
//                       <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
//                       Copy Share Link
//                     </button>
                    
//                     <button
//                       onClick={handlePreview}
//                       className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center"
//                     >
//                       <EyeIcon className="w-5 h-5 mr-2" />
//                       Preview Link
//                     </button>
                    
//                     <div className="text-center text-sm text-gray-300">
//                        {/* Fee Breakdown */}
//             <GlassCard className="p-6">
//               <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                 <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
//                 Earnings Breakdown
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Total per share:</span>
//                     <span className="font-semibold text-white">${amountPerShare.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Platform fee:</span>
//                     <span className="font-semibold text-red-300">-${platformFee.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between border-t border-white/20 pt-3">
//                     <span className="text-white font-medium">You earn:</span>
//                     <span className="font-semibold text-green-300">${userEarning.toFixed(2)}</span>
//                   </div>
//                 </div>
//                 <div className="bg-white/10 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
//                   <p className="text-sm text-gray-300 mb-2">Fee Structure:</p>
//                   <p className="text-sm font-medium text-white">
//                     Commission already deducted from total budget
//                   </p>
//                 </div>
//               </div>
//             </GlassCard>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <button
//                       onClick={handleShare}
//                       disabled={sharing || !gig.isActive || gig.sharesCompleted >= gig.sharesRequired}
//                       className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl mb-4 backdrop-blur-sm"
//                     >
//                       {!isAuthenticated 
//                         ? 'Login to Share' 
//                         : !gig.isActive 
//                         ? 'Gig Completed' 
//                         : gig.sharesCompleted >= gig.sharesRequired 
//                         ? 'All Shares Completed' 
//                         : sharing 
//                         ? (
//                           <div className="flex items-center justify-center">
//                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Generating...
//                           </div>
//                         ) 
//                         : `Get Share Link & Earn $${userEarning.toFixed(2)}`
//                       }
//                     </button>
                    
//                     <div className="text-center space-y-2">
//                       <div className="text-sm text-gray-300">
//                         After platform fee: <span className="font-semibold text-green-300">${userEarning.toFixed(2)}</span>
//                       </div>
                      
//                       {gig.isActive && gig.sharesCompleted < gig.sharesRequired && (
//                         <>
//                           <div className="text-xs text-gray-400 flex items-center justify-center">
//                             <ClockIcon className="w-3 h-3 mr-1" />
//                             Payment when someone clicks your link
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {gig.sharesRequired - gig.sharesCompleted} shares remaining
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </GlassCard>
//           </div>
//         </div>

//         {/* Modals */}
//         {showShareModal && <ShareModal userEarning={userEarning} />}
//         {showPreviewModal && <PreviewModal />}
//       </div>
//     </GradientBackground>
//   );
// };

// export default GigDetail;



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
  XMarkIcon,
  EyeIcon,
  QrCodeIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const GigDetail = () => {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [existingShare, setExistingShare] = useState(null);
  const [submissionImages, setSubmissionImages] = useState([]);
  const [submissionDescription, setSubmissionDescription] = useState('');
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGig();
    checkExistingShare();
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

  const checkExistingShare = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await axios.get('/api/gigs/my-shares');
      const userShares = res.data.data;
      const existing = userShares.find(share => share.gig && share.gig._id === id);
      setExistingShare(existing);
    } catch (error) {
      console.error('Error checking existing shares:', error);
    }
  };

  const calculateEarnings = (gigData) => {
    if (!gigData) return { userEarning: 0, platformFee: 0, amountPerShare: 0 };
    
    const amountPerShare = gigData.availableFunds / gigData.sharesRequired;
    const userEarning = amountPerShare;
    const platformFee = 0;
    
    return {
      userEarning: parseFloat(userEarning.toFixed(2)),
      platformFee: parseFloat(platformFee.toFixed(2)),
      amountPerShare: parseFloat(amountPerShare.toFixed(2))
    };
  };

  // Safe calculation functions
  const getProgressPercentage = () => {
    if (!gig) return 0;
    return (gig.sharesCompleted / gig.sharesRequired) * 100;
  };

  const getRemainingShares = () => {
    if (!gig) return 0;
    return gig.sharesRequired - gig.sharesCompleted;
  };

  const isGigActive = () => {
    return gig && gig.isActive;
  };

  const areAllSharesCompleted = () => {
    if (!gig) return false;
    return gig.sharesCompleted >= gig.sharesRequired;
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to share this gig');
      navigate('/login');
      return;
    }

    if (!gig) {
      toast.error('Gig data not loaded yet');
      return;
    }

    if (existingShare) {
      const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
      setShareData({
        url: shareUrl,
        title: gig.title,
        link: gig.link,
        trackingToken: existingShare.trackingToken,
        stats: {
          totalClicks: existingShare.totalClicks || 0,
          uniqueClicks: existingShare.uniqueClicks || 0,
          amountEarned: existingShare.amountEarned || 0
        },
        submissionStatus: existingShare.submissionStatus || 'pending'
      });
      setShowShareModal(true);
      return;
    }

    setSharing(true);
    const shareToast = toast.loading('Generating your unique share link...');

    try {
      const shareRes = await axios.post(`/api/gigs/${id}/generate-share-url`);
      
      const { shareUrl, trackingToken, existing } = shareRes.data.data;
      
      const frontendShareUrl = `${window.location.origin}/track-share/${trackingToken}`;
      
      if (existing) {
        toast.success('Using your existing share link!', { id: shareToast });
      } else {
        toast.success('Share link generated successfully!', { id: shareToast });
      }

      setShareData({
        url: frontendShareUrl,
        title: gig.title,
        link: gig.link,
        trackingToken: trackingToken,
        stats: {
          totalClicks: 0,
          uniqueClicks: 0,
          amountEarned: 0
        },
        submissionStatus: 'pending'
      });
      setShowShareModal(true);
      
      fetchGig();
      checkExistingShare();
      
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error(error.response?.data?.message || 'Error generating share link', {
        id: shareToast
      });
    } finally {
      setSharing(false);
    }
  };

  const handleImageUpload = async (files) => {
    const newImages = [...submissionImages];
    
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image.`);
        continue;
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'submission');
      
      try {
        const uploadToast = toast.loading(`Uploading ${file.name}...`);
        const res = await axios.post('/api/upload/submission', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        toast.success('Image uploaded successfully!', { id: uploadToast });
        newImages.push({
          url: res.data.fileUrl,
          filename: file.name,
          id: Date.now() + Math.random()
        });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        console.error('Upload error:', error);
      }
    }
    
    setSubmissionImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = submissionImages.filter((_, i) => i !== index);
    setSubmissionImages(newImages);
  };

  const handleSubmitProof = async () => {
  if (submissionImages.length === 0) {
    toast.error('Please upload at least one screenshot as proof');
    return;
  }

  if (!existingShare) {
    toast.error('No share found to submit proof for');
    return;
  }

  setSubmitting(true);
  const submitToast = toast.loading('Submitting your proof...');

  try {
    // ✅ CORRECTED: Use the proper submission API endpoint
    const res = await axios.post(`/api/submission/shares/${existingShare._id}/submit-proof`, {
      images: submissionImages,
      description: submissionDescription
    });

    toast.success('Proof submitted successfully! Waiting for approval.', { id: submitToast });
    setShowSubmitModal(false);
    setSubmissionImages([]);
    setSubmissionDescription('');
    
    checkExistingShare();
    fetchGig();
  } catch (error) {
    console.error('Error submitting proof:', error);
    toast.error(error.response?.data?.message || 'Error submitting proof', {
      id: submitToast
    });
  } finally {
    setSubmitting(false);
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

  const handlePreview = () => {
    if (existingShare && gig) {
      const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
      setShareData({
        url: shareUrl,
        title: gig.title,
        link: gig.link,
        trackingToken: existingShare.trackingToken,
        stats: {
          totalClicks: existingShare.totalClicks || 0,
          uniqueClicks: existingShare.uniqueClicks || 0,
          amountEarned: existingShare.amountEarned || 0
        },
        submissionStatus: existingShare.submissionStatus || 'pending'
      });
      setShowPreviewModal(true);
    }
  };

  // Share Modal Component
  const ShareModal = ({ userEarning }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {existingShare ? 'Your Share Link' : 'Share This Gig'}
          </h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Submission Status */}
          {existingShare && (
            <div className={`p-3 rounded-lg border ${
              existingShare.submissionStatus === 'approved' ? 'bg-green-400/20 border-green-400/30' :
              existingShare.submissionStatus === 'submitted' ? 'bg-blue-400/20 border-blue-400/30' :
              existingShare.submissionStatus === 'rejected' ? 'bg-red-400/20 border-red-400/30' :
              'bg-yellow-400/20 border-yellow-400/30'
            }`}>
              <div className="flex items-center">
                {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />}
                {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-400 mr-2" />}
                {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />}
                {existingShare.submissionStatus === 'pending' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2" />}
                <span className="text-sm font-medium capitalize text-white">
                  Status: {existingShare.submissionStatus || 'pending'}
                </span>
              </div>
              {existingShare.submissionStatus === 'rejected' && existingShare.submissionProof?.[0]?.verificationNotes && (
                <p className="text-xs text-red-300 mt-1">
                  Reason: {existingShare.submissionProof[0].verificationNotes}
                </p>
              )}
            </div>
          )}

          {/* Share Stats */}
          {existingShare && shareData?.stats && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{shareData.stats.totalClicks}</div>
                <div className="text-xs text-gray-300">Total Clicks</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">{shareData.stats.uniqueClicks}</div>
                <div className="text-xs text-gray-300">Unique Clicks</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">${shareData.stats.amountEarned}</div>
                <div className="text-xs text-gray-300">Earned</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Your Unique Share Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareData?.url || ''}
                readOnly
                className="flex-1 px-3 py-2 border border-white/20 rounded-lg text-sm bg-white/5 backdrop-blur-sm text-white"
              />
              <button
                onClick={() => copyToClipboard(shareData?.url)}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center backdrop-blur-sm"
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                Copy
              </button>
            </div>
          </div>
          
          <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">How it works:</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• Share your unique link on social media</li>
                  <li>• Take screenshots as proof of sharing</li>
                  <li>• Submit screenshots for verification</li>
                  <li>• Get paid after gig owner approves</li>
                  <li>• Earn <strong>${userEarning.toFixed(2)}</strong> per approved submission</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-3 pt-2">
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-2">
              {existingShare && existingShare.submissionStatus === 'pending' && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center backdrop-blur-sm"
                >
                  <CameraIcon className="w-4 h-4 mr-1" />
                  Submit Proof
                </button>
              )}
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center backdrop-blur-sm"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  // Submit Proof Modal
  const SubmitProofModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Submit Proof of Sharing</h3>
            <button
              onClick={() => setShowSubmitModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">📸 What to include in your screenshots:</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• Show your post with the share link visible</li>
                <li>• Include timestamp if possible</li>
                <li>• Show the platform/group where you shared</li>
                <li>• Make sure the content is readable</li>
                <li>• Multiple angles/views increase approval chances</li>
              </ul>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Upload Screenshots (Required)
              </label>
              
              {/* Image Preview Grid */}
              {submissionImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {submissionImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Proof ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-white/20"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center transition-all duration-200 hover:border-primary-500/50 hover:bg-white/5">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="cursor-pointer block"
                >
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300 mb-2">Click to upload screenshots</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={submissionDescription}
                onChange={(e) => setSubmissionDescription(e.target.value)}
                placeholder="Describe where and how you shared the link..."
                rows={3}
                className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={submitting || submissionImages.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center backdrop-blur-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  // Preview Modal Component
  const PreviewModal = () => {
    if (!gig) return null;
    
    const { userEarning } = calculateEarnings(gig);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <GlassCard className="max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Preview Share Link</h3>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{gig.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span>Shared by {user?.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    Earn ${userEarning.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="text-xs text-gray-500 mb-2">Share this link to earn money:</div>
                  <div className="text-sm font-mono text-gray-800 bg-white p-2 rounded border break-all">
                    {shareData?.url}
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open(gig.link, '_blank')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Visit Gig Website
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-lg p-4 mb-4">
                <div className="text-center text-gray-500">
                  <QrCodeIcon className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-xs">QR Code Preview</div>
                </div>
              </div>
              <p className="text-sm text-gray-300">Scan to visit your share link</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => copyToClipboard(shareData?.url)}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center backdrop-blur-sm"
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                Copy Link
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <GradientBackground className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading gig details...</p>
        </div>
      </GradientBackground>
    );
  }

  // Error State - gig is null after loading
  if (!gig) {
    return (
      <GradientBackground className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Gig Not Found</h2>
          <p className="text-gray-200 mb-4">The gig you're looking for doesn't exist or failed to load.</p>
          <button
            onClick={() => navigate('/gigs')}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 backdrop-blur-sm"
          >
            Browse Available Gigs
          </button>
        </div>
      </GradientBackground>
    );
  }

  // Safe calculations now that gig is confirmed to exist
  const { userEarning, platformFee, amountPerShare } = calculateEarnings(gig);
  const progressPercentage = getProgressPercentage();
  const remainingShares = getRemainingShares();

 const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  // Define color variants locally since colorVariants is not available
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30',
    green: 'bg-green-500/20 border-green-500/30', 
    purple: 'bg-purple-500/20 border-purple-500/30',
    red: 'bg-red-500/20 border-red-500/30',
    yellow: 'bg-yellow-500/20 border-yellow-500/30'
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </GlassCard>
  );
};
  return (
    <GradientBackground className="py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gig Header */}
        <GlassCard className="overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
                <div className="flex items-center text-gray-200">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>Posted by <strong className="text-white">{gig.user?.name || 'Unknown User'}</strong></span>
                  <CalendarIcon className="w-4 h-4 ml-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <StatusBadge color={isGigActive() ? 'green' : 'gray'}>
                {isGigActive() ? 'Active' : 'Completed'}
              </StatusBadge>
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
              <div className="flex justify-between text-sm text-gray-200 mb-2">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 backdrop-blur-sm"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <GlassCard className="p-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Description
                </h3>
                <p className="text-gray-200 leading-relaxed">{gig.description}</p>
              </div>
              
              {/* Link to Share */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Link to Share
                </h3>
                <a 
                  href={gig.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-all duration-200 backdrop-blur-sm border border-blue-400/30 break-all"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {gig.link}
                </a>
              </div>
            </GlassCard>

            {/* Existing Share Link (if any) */}
            {existingShare && (
              <GlassCard className="p-6 border-l-4 border-l-green-500">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <ShareIcon className="w-5 h-5 text-green-400 mr-2" />
                  Your Share Link
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 mb-1">Your Unique Link</div>
                      <div className="text-white font-mono text-sm break-all">
                        {`${window.location.origin}/track-share/${existingShare.trackingToken}`}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/track-share/${existingShare.trackingToken}`)}
                      className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-lg font-bold text-white">{existingShare.totalClicks || 0}</div>
                      <div className="text-xs text-gray-300">Total Clicks</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-lg font-bold text-green-400">{existingShare.uniqueClicks || 0}</div>
                      <div className="text-xs text-gray-300">Unique Clicks</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">${existingShare.amountEarned || 0}</div>
                      <div className="text-xs text-gray-300">Earned</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Share Action Card */}
          <div className="lg:col-span-1">
            <GlassCard className="sticky top-8 backdrop-blur-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  {existingShare ? 'Your Share Status' : 'Ready to Earn?'}
                </h3>
                
                {/* Submission Status Badge */}
                {existingShare && (
                  <div className={`mb-4 p-3 rounded-lg border text-center ${
                    existingShare.submissionStatus === 'approved' ? 'bg-green-400/20 border-green-400/30' :
                    existingShare.submissionStatus === 'submitted' ? 'bg-blue-400/20 border-blue-400/30' :
                    existingShare.submissionStatus === 'rejected' ? 'bg-red-400/20 border-red-400/30' :
                    'bg-yellow-400/20 border-yellow-400/30'
                  }`}>
                    <div className="flex items-center justify-center">
                      {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />}
                      {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-400 mr-2" />}
                      {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />}
                      {existingShare.submissionStatus === 'pending' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2" />}
                      <span className="font-medium capitalize text-white">
                        {existingShare.submissionStatus || 'pending'}
                      </span>
                    </div>
                    {existingShare.submissionStatus === 'rejected' && (
                      <p className="text-xs text-red-300 mt-1">
                        Please check reason and resubmit
                      </p>
                    )}
                  </div>
                )}

                {existingShare ? (
                  <div className="space-y-3">
                    {/* Different buttons based on status */}
                    {existingShare.submissionStatus === 'pending' && (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center"
                      >
                        <CameraIcon className="w-5 h-5 mr-2" />
                        Submit Proof
                      </button>
                    )}

                    {existingShare.submissionStatus === 'submitted' && (
                      <button
                        disabled
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed transform transition-all duration-200 shadow-lg backdrop-blur-sm flex items-center justify-center"
                      >
                        <ClockIcon className="w-5 h-5 mr-2" />
                        Under Review
                      </button>
                    )}

                    {existingShare.submissionStatus === 'approved' && !existingShare.isPaid && (
                      <button
                        disabled
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed transform transition-all duration-200 shadow-lg backdrop-blur-sm flex items-center justify-center"
                      >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Approved - Payment Pending
                      </button>
                    )}

                    {existingShare.isPaid && (
                      <button
                        disabled
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed transform transition-all duration-200 shadow-lg backdrop-blur-sm flex items-center justify-center"
                      >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Paid - ${existingShare.amountEarned || 0}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
                        copyToClipboard(shareUrl);
                        toast.success('Share link copied!');
                      }}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 backdrop-blur-sm flex items-center justify-center"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Copy Share Link
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleShare}
                      disabled={sharing || !isGigActive() || areAllSharesCompleted()}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl mb-4 backdrop-blur-sm"
                    >
                      {!isAuthenticated 
                        ? 'Login to Share' 
                        : !isGigActive() 
                        ? 'Gig Completed' 
                        : areAllSharesCompleted() 
                        ? 'All Shares Completed' 
                        : sharing 
                        ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Generating...
                          </div>
                        ) 
                        : `Get Share Link - Earn $${userEarning.toFixed(2)}`
                      }
                    </button>
                    
                    <div className="text-center space-y-2">
                      <div className="text-sm text-gray-300">
                        Potential earnings: <span className="font-semibold text-green-300">${userEarning.toFixed(2)}</span>
                      </div>
                      
                      {isGigActive() && !areAllSharesCompleted() && (
                        <>
                          <div className="text-xs text-gray-400 flex items-center justify-center">
                            <CameraIcon className="w-3 h-3 mr-1" />
                            Submit screenshots for approval
                          </div>
                          <div className="text-xs text-gray-500">
                            {remainingShares} submissions needed
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Modals */}
        {showShareModal && <ShareModal userEarning={userEarning} />}
        {showSubmitModal && <SubmitProofModal />}
        {showPreviewModal && <PreviewModal />}
      </div>
    </GradientBackground>
  );
};

export default GigDetail;