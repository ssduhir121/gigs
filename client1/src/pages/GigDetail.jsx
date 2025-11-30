

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
//   CameraIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   LockClosedIcon,
//   UserGroupIcon,
//   CheckBadgeIcon,
//   ArrowRightIcon,
//   PlayIcon
// } from '@heroicons/react/24/outline';

// const GigDetail = () => {
//   const [gig, setGig] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sharing, setSharing] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [applying, setApplying] = useState(false);
//   const [sharingFacebook, setSharingFacebook] = useState(false);
//   const [shareData, setShareData] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [existingShare, setExistingShare] = useState(null);
//   const [submissionImages, setSubmissionImages] = useState([]);
//   const [submissionDescription, setSubmissionDescription] = useState('');
//   const [applicationMessage, setApplicationMessage] = useState('');
//   const [userApplication, setUserApplication] = useState(null);
//   const { id } = useParams();
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchGig();
//     checkExistingShare();
//     checkUserApplication();
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
//       const existing = userShares.find(share => share.gig && share.gig._id === id);
//       setExistingShare(existing);
//     } catch (error) {
//       console.error('Error checking existing shares:', error);
//     }
//   };

//   const checkUserApplication = async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       const res = await axios.get('/api/applications/my-applications');
//       const userApplications = res.data.data;
//       const application = userApplications.find(app => app.gig && app.gig._id === id);
//       setUserApplication(application);
//     } catch (error) {
//       console.error('Error checking user applications:', error);
//     }
//   };

//   const calculateEarnings = (gigData) => {
//     if (!gigData) return { userEarning: 0, platformFee: 0, amountPerShare: 0 };
    
//     const amountPerShare = gigData.availableFunds / gigData.sharesRequired;
//     const userEarning = amountPerShare;
//     const platformFee = 0;
    
//     return {
//       userEarning: parseFloat(userEarning.toFixed(2)),
//       platformFee: parseFloat(platformFee.toFixed(2)),
//       amountPerShare: parseFloat(amountPerShare.toFixed(2))
//     };
//   };

//   const getProgressPercentage = () => {
//     if (!gig) return 0;
//     return (gig.sharesCompleted / gig.sharesRequired) * 100;
//   };

//   const getRemainingShares = () => {
//     if (!gig) return 0;
//     return gig.sharesRequired - gig.sharesCompleted;
//   };

//   const isGigActive = () => {
//     return gig && gig.isActive;
//   };

//   const areAllSharesCompleted = () => {
//     if (!gig) return false;
//     return gig.sharesCompleted >= gig.sharesRequired;
//   };

//   const isUserApprovedForPrivateGig = () => {
//     if (!gig || !user) return false;
    
//     return gig.approvedSharers?.some(sharer => {
//       const sharerUserId = sharer.user?._id || sharer.user || sharer.user?.id;
      
//       if (!sharerUserId) return false;
      
//       const sharerIdStr = sharerUserId.toString();
//       const userIdStr = user.id.toString();
      
//       return sharerIdStr === userIdStr;
//     });
//   };

//   const canUserApply = () => {
//     if (!gig || !user) return false;
//     if (gig.shareType !== 'private') return false;
//     if (!isGigActive()) return false;
//     if (areAllSharesCompleted()) return false;
//     if (userApplication) return false;
//     if (isUserApprovedForPrivateGig()) return false;
//     return true;
//   };

//   const trackSocialShare = async (platform) => {
//     if (!existingShare) return;
    
//     try {
//       const response = await axios.post(`/api/gigs/shares/${existingShare._id}/track-social-share`, {
//         platform: platform,
//         shareUrl: `${window.location.origin}/track-share/${existingShare.trackingToken}`,
//         timestamp: new Date().toISOString()
//       });
      
//       console.log('Social share tracked:', response.data);
//     } catch (error) {
//       console.error('Error tracking social share:', error);
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

//   const handleFacebookShare = () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to share this gig');
//       navigate('/login');
//       return;
//     }

//     if (!gig) {
//       toast.error('Gig data not loaded yet');
//       return;
//     }

//     if (gig.shareType === 'private' && !isUserApprovedForPrivateGig()) {
//       toast.error('You need to be approved to share this private gig');
//       return;
//     }

//     setSharingFacebook(true);

//     const shareUrl = existingShare 
//       ? `${window.location.origin}/track-share/${existingShare.trackingToken}`
//       : gig.link;

//     const shareContent = `🌟 ${gig.title} 🌟

// ${gig.description}

// 💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share

// ${shareUrl}

// #GigShare #EarnMoney #SideHustle #Opportunity`;

//     copyToClipboard(shareContent);

//     let mediaDownloadUrl = '';
//     let mediaType = '';
    
//     if (gig.mediaFileName) {
//       mediaDownloadUrl = `/api/gigs/media/${gig.mediaFileName}`;
//       mediaType = gig.mediaFileName.split('.').pop().toLowerCase();
//     }

//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    
//     const width = 600;
//     const height = 500;
//     const left = (window.screen.width - width) / 2;
//     const top = (window.screen.height - height) / 2;
    
//     const facebookWindow = window.open(
//       facebookUrl,
//       'facebook-share-dialog',
//       `width=${width},height=${height},left=${left},top=${top}`
//     );

//     if (existingShare) {
//       trackSocialShare('facebook');
//     }

//     const MediaDownloadSection = () => (
//       gig.mediaFileName ? (
//         <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mb-3">
//           <p className="text-purple-800 font-medium text-sm mb-2 flex items-center">
//             <CameraIcon className="w-4 h-4 mr-2" />
//             {mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'avi' ? 'Video Available' : 'Image Available'}
//           </p>
//           <p className="text-purple-700 text-xs mb-2">
//             Download the {mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'avi' ? 'video' : 'image'} to include in your Facebook post
//           </p>
//           <a 
//             href={mediaDownloadUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             download={gig.mediaFileName}
//             className="w-full bg-purple-600 text-white py-2 px-3 rounded text-xs font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
//             onClick={() => toast.success(`Downloading ${gig.mediaFileName}...`)}
//           >
//             <ArrowRightIcon className="w-3 h-3 mr-1" />
//             Download {mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'avi' ? 'Video' : 'Image'}
//           </a>
//         </div>
//       ) : null
//     );

//     toast.success(
//       <div className="text-center max-w-sm">
//         <div className="flex items-center justify-center mb-2">
//           <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
//             <DocumentDuplicateIcon className="w-4 h-4 text-green-600" />
//           </div>
//           <span className="font-semibold text-green-800">Share Content Copied!</span>
//         </div>
        
//         <MediaDownloadSection />
        
//         <div className="bg-gray-50 p-3 rounded-lg text-xs text-left mb-3 border">
//           <p className="font-medium text-gray-700 mb-2">📝 Complete Share Guide:</p>
//           <ol className="space-y-1 text-gray-600">
//             <li>1. <strong>Facebook will open</strong> with the gig link</li>
//             {gig.mediaFileName && (
//               <li>2. <strong>Download the {mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'avi' ? 'video' : 'image'} above</strong> for your post</li>
//             )}
//             <li>{gig.mediaFileName ? '3' : '2'}. <strong>Paste the copied text</strong> as your post description</li>
//             <li>{gig.mediaFileName ? '4' : '3'}. <strong>Upload the {mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'avi' ? 'video' : 'image'}</strong> to your post</li>
//             <li>{gig.mediaFileName ? '5' : '4'}. <strong>Add your personal touch</strong> to increase engagement</li>
//             <li>{gig.mediaFileName ? '6' : '5'}. <strong>Take a screenshot</strong> after posting for proof</li>
//           </ol>
//         </div>

//         {!facebookWindow && (
//           <a 
//             href={facebookUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
//             onClick={() => setSharingFacebook(false)}
//           >
//             📲 Open Facebook Manually
//           </a>
//         )}
//       </div>,
//       { 
//         duration: 12000,
//         icon: '📋'
//       }
//     );

//     setSharingFacebook(false);
//   };

//   const handleApplyForPrivateGig = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to apply for this gig');
//       navigate('/login');
//       return;
//     }

//     if (!applicationMessage.trim()) {
//       toast.error('Please add a message to your application');
//       return;
//     }

//     setApplying(true);
//     const applyToast = toast.loading('Submitting your application...');

//     try {
//       const res = await axios.post(`/api/gigs/${id}/apply`, {
//         message: applicationMessage
//       });

//       toast.success(res.data.message, { id: applyToast });
//       setShowApplyModal(false);
//       setApplicationMessage('');
      
//       fetchGig();
//       checkUserApplication();
      
//     } catch (error) {
//       console.error('Error applying for gig:', error);
//       toast.error(error.response?.data?.message || 'Error submitting application', {
//         id: applyToast
//       });
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleShare = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to share this gig');
//       navigate('/login');
//       return;
//     }

//     if (!gig) {
//       toast.error('Gig data not loaded yet');
//       return;
//     }

//     if (gig.shareType === 'private' && !isUserApprovedForPrivateGig()) {
//       toast.error('You need to be approved to share this private gig');
//       return;
//     }

//     if (existingShare) {
//       const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
//       setShareData({
//         url: shareUrl,
//         title: gig.title,
//         link: gig.link,
//         trackingToken: existingShare.trackingToken,
//         stats: {
//           totalClicks: existingShare.totalClicks || 0,
//           uniqueClicks: existingShare.uniqueClicks || 0,
//           amountEarned: existingShare.amountEarned || 0
//         },
//         submissionStatus: existingShare.submissionStatus || 'pending'
//       });
//       setShowShareModal(true);
//       return;
//     }

//     setSharing(true);
//     const shareToast = toast.loading('Generating your unique share link...');

//     try {
//       const shareRes = await axios.post(`/api/gigs/${id}/generate-share-url`);
      
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
//         },
//         submissionStatus: 'pending'
//       });
//       setShowShareModal(true);
      
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

//   const handleImageUpload = async (files) => {
//     const newImages = [...submissionImages];
    
//     for (let file of files) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
//         continue;
//       }
      
//       if (!file.type.startsWith('image/')) {
//         toast.error(`File ${file.name} is not an image.`);
//         continue;
//       }
      
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('type', 'submission');
      
//       try {
//         const uploadToast = toast.loading(`Uploading ${file.name}...`);
//         const res = await axios.post('/api/upload/submission', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
        
//         toast.success('Image uploaded successfully!', { id: uploadToast });
//         newImages.push({
//           url: res.data.fileUrl,
//           filename: file.name,
//           id: Date.now() + Math.random()
//         });
//       } catch (error) {
//         toast.error(`Failed to upload ${file.name}`);
//         console.error('Upload error:', error);
//       }
//     }
    
//     setSubmissionImages(newImages);
//   };

//   const removeImage = (index) => {
//     const newImages = submissionImages.filter((_, i) => i !== index);
//     setSubmissionImages(newImages);
//   };

//   const handleSubmitProof = async () => {
//     if (submissionImages.length === 0) {
//       toast.error('Please upload at least one screenshot as proof');
//       return;
//     }

//     if (!existingShare) {
//       toast.error('No share found to submit proof for');
//       return;
//     }

//     setSubmitting(true);
//     const submitToast = toast.loading('Submitting your proof...');

//     try {
//       const res = await axios.post(`/api/submission/shares/${existingShare._id}/submit-proof`, {
//         images: submissionImages,
//         description: submissionDescription
//       });

//       toast.success('Proof submitted successfully! Waiting for approval.', { id: submitToast });
//       setShowSubmitModal(false);
//       setSubmissionImages([]);
//       setSubmissionDescription('');
      
//       checkExistingShare();
//       fetchGig();
//     } catch (error) {
//       console.error('Error submitting proof:', error);
//       toast.error(error.response?.data?.message || 'Error submitting proof', {
//         id: submitToast
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getMediaType = (filename) => {
//     if (!filename) return null;
//     const ext = filename.split('.').pop().toLowerCase();
//     const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    
//     if (videoExtensions.includes(ext)) return 'video';
//     if (imageExtensions.includes(ext)) return 'image';
//     return null;
//   };

//   // Preview Modal Component
//   const PreviewModal = () => (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-gray-900">Content Preview</h3>
//             <button
//               onClick={() => setShowPreviewModal(false)}
//               className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="space-y-6">
//             {/* Media Preview */}
//             {gig.mediaFileName && (
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <CameraIcon className="w-5 h-5 mr-2" />
//                   Media Preview
//                 </h4>
//                 <div className="flex justify-center">
//                   {getMediaType(gig.mediaFileName) === 'video' ? (
//                     <div className="relative w-full max-w-2xl">
//                       <video
//                         controls
//                         className="w-full h-auto rounded-lg shadow-lg max-h-96 object-contain bg-black"
//                         poster={`/api/gigs/media/thumbnail/${gig.mediaFileName}`}
//                       >
//                         <source src={`/api/gigs/media/${gig.mediaFileName}`} type={`video/${gig.mediaFileName.split('.').pop()}`} />
//                         Your browser does not support the video tag.
//                       </video>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <PlayIcon className="w-16 h-16 text-white opacity-80" />
//                       </div>
//                     </div>
//                   ) : (
//                     <img
//                       src={`/api/gigs/media/${gig.mediaFileName}`}
//                       alt="Gig media"
//                       className="max-w-full h-auto rounded-lg shadow-lg max-h-96 object-contain"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   )}
//                 </div>
//                 <div className="mt-3 text-center">
//                   <a
//                     href={`/api/gigs/media/${gig.mediaFileName}`}
//                     download={gig.mediaFileName}
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                   >
//                     <ArrowRightIcon className="w-4 h-4 mr-2" />
//                     Download {getMediaType(gig.mediaFileName) === 'video' ? 'Video' : 'Image'}
//                   </a>
//                 </div>
//               </div>
//             )}

//             {/* Title & Description */}
//             <div className="bg-white rounded-xl p-6 border border-gray-200">
//               <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <InformationCircleIcon className="w-5 h-5 mr-2" />
//                 Content Details
//               </h4>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
//                   <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border">
//                     {gig.title}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                   <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">
//                     {gig.description}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
//                   <div className="flex items-center space-x-2">
//                     <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-blue-600 break-all">
//                       {gig.link}
//                     </div>
//                     <button
//                       onClick={() => copyToClipboard(gig.link)}
//                       className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
//                     >
//                       <DocumentDuplicateIcon className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Share Preview */}
//             <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
//               <h4 className="text-lg font-semibold text-blue-900 mb-4">📋 Share Content Preview</h4>
//               <div className="bg-white p-4 rounded-lg border border-blue-200">
//                 <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
//                   {`🌟 ${gig.title} 🌟

// ${gig.description}

// 💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share

// ${gig.link}

// #GigShare #EarnMoney #SideHustle #Opportunity`}
//                 </div>
//                 <div className="mt-3 flex justify-between items-center">
//                   <span className="text-xs text-gray-500">
//                     This content will be copied when you click "Share on Facebook"
//                   </span>
//                   <button
//                     onClick={() => {
//                       const shareContent = `🌟 ${gig.title} 🌟\n\n${gig.description}\n\n💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share\n\n${gig.link}\n\n#GigShare #EarnMoney #SideHustle #Opportunity`;
//                       copyToClipboard(shareContent);
//                     }}
//                     className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
//                   >
//                     <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
//                     Copy Text
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
//             <button
//               onClick={() => setShowPreviewModal(false)}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Close Preview
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Application Modal
//   const ApplyModal = () => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">Apply to Share Gig</h3>
//           <button
//             onClick={() => setShowApplyModal(false)}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <InformationCircleIcon className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-purple-800 font-medium mb-1">Private Gig Application</p>
//                 <p className="text-xs text-purple-700">
//                   This is a private gig. You need approval from the gig owner before you can share it.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div>
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

//           <div className="flex space-x-3 pt-2">
//             <button
//               onClick={() => setShowApplyModal(false)}
//               className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleApplyForPrivateGig}
//               disabled={applying || !applicationMessage.trim()}
//               className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {applying ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Applying...
//                 </div>
//               ) : (
//                 'Submit Application'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Share Modal Component
//   const ShareModal = ({ userEarning }) => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {existingShare ? 'Your Share Link' : 'Share This Gig'}
//           </h3>
//           <button
//             onClick={() => setShowShareModal(false)}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           {/* Submission Status */}
//           {existingShare && (
//             <div className={`p-3 rounded-lg border ${
//               existingShare.submissionStatus === 'approved' ? 'bg-green-50 border-green-200' :
//               existingShare.submissionStatus === 'submitted' ? 'bg-blue-50 border-blue-200' :
//               existingShare.submissionStatus === 'rejected' ? 'bg-red-50 border-red-200' :
//               'bg-yellow-50 border-yellow-200'
//             }`}>
//               <div className="flex items-center">
//                 {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />}
//                 {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />}
//                 {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
//                 {existingShare.submissionStatus === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
//                 <span className="text-sm font-medium capitalize text-gray-900">
//                   Status: {existingShare.submissionStatus || 'pending'}
//                 </span>
//               </div>
//               {existingShare.submissionStatus === 'rejected' && existingShare.submissionProof?.[0]?.verificationNotes && (
//                 <p className="text-xs text-red-600 mt-1">
//                   Reason: {existingShare.submissionProof[0].verificationNotes}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Share Stats */}
//           {existingShare && shareData?.stats && (
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="text-2xl font-bold text-gray-900">{shareData.stats.totalClicks}</div>
//                 <div className="text-xs text-gray-600">Total Clicks</div>
//               </div>
//               <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="text-2xl font-bold text-green-600">{shareData.stats.uniqueClicks}</div>
//                 <div className="text-xs text-gray-600">Unique Clicks</div>
//               </div>
//               <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="text-2xl font-bold text-yellow-600">${shareData.stats.amountEarned}</div>
//                 <div className="text-xs text-gray-600">Earned</div>
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Your Unique Share Link
//             </label>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={shareData?.url || ''}
//                 readOnly
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-900"
//               />
//               <button
//                 onClick={() => copyToClipboard(shareData?.url)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
//               >
//                 <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
//                 Copy
//               </button>
//             </div>
//           </div>

//           {/* Facebook Share Button in Modal */}
//           <button
//             onClick={handleFacebookShare}
//             disabled={sharingFacebook}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
//           >
//             {sharingFacebook ? (
//               <div className="flex items-center">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Sharing...
//               </div>
//             ) : (
//               <>
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//                 Share on Facebook
//               </>
//             )}
//           </button>
          
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//             <div className="flex items-start">
//               <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-blue-800 font-medium mb-1">Facebook Sharing Made Easy:</p>
//                 <ul className="text-xs text-blue-700 space-y-1">
//                   <li>• <strong>Auto-filled post:</strong> Title, description, budget & link</li>
//                   <li>• <strong>No login required:</strong> Uses Facebook's simple share tool</li>
//                   <li>• <strong>Take screenshots:</strong> Capture your Facebook post as proof</li>
//                   <li>• <strong>Submit for approval:</strong> Upload screenshots to get paid</li>
//                   <li>• <strong>Earn ${userEarning.toFixed(2)}</strong> per approved submission</li>
//                 </ul>
//                 <p className="text-xs text-blue-600 mt-2 font-medium">
//                   💡 Tip: If popup is blocked, share content will be copied to clipboard!
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between space-x-3 pt-2">
//             <button
//               onClick={() => setShowShareModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               Close
//             </button>
//             <div className="flex space-x-2">
//               {existingShare && existingShare.submissionStatus === 'pending' && (
//                 <button
//                   onClick={() => setShowSubmitModal(true)}
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
//                 >
//                   <CameraIcon className="w-4 h-4 mr-1" />
//                   Submit Proof
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Submit Proof Modal
//   const SubmitProofModal = () => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-gray-900">Submit Proof of Sharing</h3>
//             <button
//               onClick={() => setShowSubmitModal(false)}
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="space-y-6">
//             {/* Instructions */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h4 className="text-sm font-semibold text-blue-800 mb-2">📸 What to include in your screenshots:</h4>
//               <ul className="text-xs text-blue-700 space-y-1">
//                 <li>• Show your post with the share link visible</li>
//                 <li>• Include timestamp if possible</li>
//                 <li>• Show the platform/group where you shared</li>
//                 <li>• Make sure the content is readable</li>
//                 <li>• Multiple angles/views increase approval chances</li>
//               </ul>
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Upload Screenshots (Required)
//               </label>
              
//               {/* Image Preview Grid */}
//               {submissionImages.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//                   {submissionImages.map((image, index) => (
//                     <div key={image.id} className="relative group">
//                       <img
//                         src={image.url}
//                         alt={`Proof ${index + 1}`}
//                         className="w-full h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                       <button
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <XMarkIcon className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Upload Area */}
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-blue-500 hover:bg-gray-50">
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(Array.from(e.target.files))}
//                   className="hidden"
//                   id="proof-upload"
//                 />
//                 <label
//                   htmlFor="proof-upload"
//                   className="cursor-pointer block"
//                 >
//                   <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                   <p className="text-gray-600 mb-2">Click to upload screenshots</p>
//                   <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
//                 </label>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Additional Notes (Optional)
//               </label>
//               <textarea
//                 value={submissionDescription}
//                 onChange={(e) => setSubmissionDescription(e.target.value)}
//                 placeholder="Describe where and how you shared the link..."
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 onClick={() => setShowSubmitModal(false)}
//                 className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitProof}
//                 disabled={submitting || submissionImages.length === 0}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
//               >
//                 {submitting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircleIcon className="w-4 h-4 mr-2" />
//                     Submit for Approval
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading gig details...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error State - gig is null after loading
//   if (!gig) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😕</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig Not Found</h2>
//           <p className="text-gray-600 mb-4">The gig you're looking for doesn't exist or failed to load.</p>
//           <button
//             onClick={() => navigate('/gigs')}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Browse Available Gigs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Safe calculations now that gig is confirmed to exist
//   const { userEarning, platformFee, amountPerShare } = calculateEarnings(gig);
//   const progressPercentage = getProgressPercentage();
//   const remainingShares = getRemainingShares();

//   const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
//     const colorClasses = {
//       blue: 'bg-blue-100 text-blue-600',
//       green: 'bg-green-100 text-green-600', 
//       purple: 'bg-purple-100 text-purple-600',
//       red: 'bg-red-100 text-red-600',
//       yellow: 'bg-yellow-100 text-yellow-600'
//     };

//     return (
//       <div className="bg-white p-6 rounded-xl border border-gray-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//             <p className="text-2xl font-bold text-gray-900">{value}</p>
//             {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//           </div>
//           <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
//             <Icon className="w-6 h-6" />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Main Action Button Logic
//   const renderMainActionButton = () => {
//     if (!isAuthenticated) {
//       return (
//         <button
//           onClick={() => navigate('/login')}
//           className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
//         >
//           Login to Share
//         </button>
//       );
//     }

//     // Private gig logic
//     if (gig.shareType === 'private') {
//       if (isUserApprovedForPrivateGig()) {
//         // User is approved for private gig - show share management
//         if (existingShare) {
//           return renderExistingShareButton();
//         } else {
//           // User is approved but hasn't generated a share link yet
//           return (
//             <button
//               onClick={handleShare}
//               disabled={sharing || !isGigActive() || areAllSharesCompleted()}
//               className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {!isGigActive() 
//                 ? 'Gig Completed' 
//                 : areAllSharesCompleted() 
//                 ? 'All Shares Completed' 
//                 : sharing 
//                 ? (
//                   <div className="flex items-center justify-center">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Generating...
//                   </div>
//                 ) 
//                 : `Get Share Link - Earn $${userEarning.toFixed(2)}`
//               }
//             </button>
//           );
//         }
//       } else if (userApplication) {
//         // User has applied but not approved yet
//         return (
//           <button
//             disabled
//             className="w-full bg-yellow-600 text-white py-4 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
//           >
//             <ClockIcon className="w-5 h-5 mr-2" />
//             Application {userApplication.status === 'pending' ? 'Pending' : userApplication.status}
//           </button>
//         );
//       } else if (canUserApply()) {
//         // User can apply for private gig
//         return (
//           <button
//             onClick={() => setShowApplyModal(true)}
//             className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
//           >
//             <UserGroupIcon className="w-5 h-5 mr-2" />
//             Apply to Share - Earn ${userEarning.toFixed(2)}
//           </button>
//         );
//       } else {
//         // User cannot apply (gig completed, not active, etc.)
//         return (
//           <button
//             disabled
//             className="w-full bg-gray-600 text-white py-4 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed"
//           >
//             Cannot Apply to This Gig
//           </button>
//         );
//       }
//     } else {
//       // Public gig logic
//       if (existingShare) {
//         return renderExistingShareButton();
//       } else {
//         return (
//           <button
//             onClick={handleShare}
//             disabled={sharing || !isGigActive() || areAllSharesCompleted()}
//             className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {!isGigActive() 
//               ? 'Gig Completed' 
//               : areAllSharesCompleted() 
//               ? 'All Shares Completed' 
//               : sharing 
//               ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Generating...
//                 </div>
//               ) 
//               : `Get Share Link - Earn $${userEarning.toFixed(2)}`
//             }
//           </button>
//         );
//       }
//     }
//   };

//   const renderExistingShareButton = () => {
//     if (!existingShare) return null;

//     switch (existingShare.submissionStatus) {
//       case 'pending':
//         return (
//           <button
//             onClick={() => setShowSubmitModal(true)}
//             className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
//           >
//             <CameraIcon className="w-5 h-5 mr-2" />
//             Submit Proof
//           </button>
//         );
//       case 'submitted':
//         return (
//           <button
//             disabled
//             className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
//           >
//             <ClockIcon className="w-5 h-5 mr-2" />
//             Under Review
//           </button>
//         );
//       case 'approved':
//         return (
//           <button
//             disabled
//             className="w-full bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
//           >
//             <CheckCircleIcon className="w-5 h-5 mr-2" />
//             Approved - Payment Pending
//           </button>
//         );
//       default:
//         return (
//           <button
//             onClick={handleShare}
//             className="w-full bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
//           >
//             Manage Share
//           </button>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Gig Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//           <div className="p-8">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
//                   {gig.shareType === 'private' && (
//                     <LockClosedIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
//                   )}
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <UserIcon className="w-4 h-4 mr-2" />
//                   <span>Posted by <strong className="text-gray-900">{gig.user?.name || 'Unknown User'}</strong></span>
//                   <CalendarIcon className="w-4 h-4 ml-4 mr-2" />
//                   <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
//                   <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium border ${
//                     gig.shareType === 'private' 
//                       ? 'bg-purple-100 text-purple-700 border-purple-200' 
//                       : 'bg-blue-100 text-blue-700 border-blue-200'
//                   }`}>
//                     {gig.shareType === 'private' ? 'Private Gig' : 'Public Gig'}
//                   </span>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 isGigActive() 
//                   ? 'bg-green-100 text-green-800 border border-green-200' 
//                   : 'bg-gray-100 text-gray-800 border border-gray-200'
//               }`}>
//                 {isGigActive() ? 'Active' : 'Completed'}
//               </span>
//             </div>

//             {/* Application Status Banner for Private Gigs */}
//             {gig.shareType === 'private' && isAuthenticated && (
//               <div className={`mb-6 p-4 rounded-lg border ${
//                 isUserApprovedForPrivateGig() 
//                   ? 'bg-green-50 border-green-200' 
//                   : userApplication
//                   ? userApplication.status === 'pending'
//                     ? 'bg-yellow-50 border-yellow-200'
//                     : userApplication.status === 'approved'
//                     ? 'bg-green-50 border-green-200'
//                     : 'bg-red-50 border-red-200'
//                   : 'bg-purple-50 border-purple-200'
//               }`}>
//                 <div className="flex items-center">
//                   {isUserApprovedForPrivateGig() ? (
//                     <>
//                       <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-3" />
//                       <div>
//                         <h4 className="text-green-800 font-semibold">Approved Sharer</h4>
//                         <p className="text-green-700 text-sm">You are approved to share this private gig</p>
//                       </div>
//                     </>
//                   ) : userApplication ? (
//                     <>
//                       {userApplication.status === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-3" />}
//                       {userApplication.status === 'approved' && <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-3" />}
//                       {userApplication.status === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-3" />}
//                       <div>
//                         <h4 className="capitalize font-semibold ${
//                           userApplication.status === 'pending' ? 'text-yellow-800' :
//                           userApplication.status === 'approved' ? 'text-green-800' : 'text-red-800'
//                         }">
//                           Application {userApplication.status}
//                         </h4>
//                         <p className="text-sm ${
//                           userApplication.status === 'pending' ? 'text-yellow-700' :
//                           userApplication.status === 'approved' ? 'text-green-700' : 'text-red-700'
//                         }">
//                           {userApplication.status === 'pending' 
//                             ? 'Waiting for gig owner approval' 
//                             : userApplication.status === 'approved'
//                             ? 'You can now share this gig'
//                             : 'Your application was not approved'
//                           }
//                         </p>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <LockClosedIcon className="w-5 h-5 text-purple-600 mr-3" />
//                       <div>
//                         <h4 className="text-purple-800 font-semibold">Private Gig</h4>
//                         <p className="text-purple-700 text-sm">Apply to get approved for sharing this gig</p>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

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
//               <div className="flex justify-between text-sm text-gray-600 mb-2">
//                 <span>Progress</span>
//                 <span>{progressPercentage.toFixed(1)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div 
//                   className="bg-green-500 h-3 rounded-full transition-all duration-500"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Preview Button */}
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => setShowPreviewModal(true)}
//                 className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//               >
//                 <EyeIcon className="w-5 h-5 mr-2" />
//                 Preview Content
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Description */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <InformationCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
//                   Description
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">{gig.description}</p>
//               </div>
              
//               {/* Link to Share */}
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
//                   Link to Share
//                 </h3>
//                 <a 
//                   href={gig.link} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 break-all"
//                 >
//                   <LinkIcon className="w-4 h-4 mr-2" />
//                   {gig.link}
//                 </a>
//               </div>

//               {/* Private Gig Instructions */}
//               {gig.shareType === 'private' && gig.privateSettings?.applicationInstructions && (
//                 <div className="mt-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <LockClosedIcon className="w-5 h-5 text-purple-600 mr-2" />
//                     Application Instructions
//                   </h3>
//                   <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                     <p className="text-purple-700 text-sm">{gig.privateSettings.applicationInstructions}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Existing Share Link (if any) */}
//             {existingShare && (
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <ShareIcon className="w-5 h-5 text-green-600 mr-2" />
//                   Your Share Link
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <div className="flex-1">
//                       <div className="text-sm text-gray-600 mb-1">Your Unique Link</div>
//                       <div className="text-gray-900 font-mono text-sm break-all">
//                         {`${window.location.origin}/track-share/${existingShare.trackingToken}`}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => copyToClipboard(`${window.location.origin}/track-share/${existingShare.trackingToken}`)}
//                       className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                       <DocumentDuplicateIcon className="w-5 h-5" />
//                     </button>
//                   </div>
                  
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="text-lg font-bold text-gray-900">{existingShare.totalClicks || 0}</div>
//                       <div className="text-xs text-gray-600">Total Clicks</div>
//                     </div>
//                     <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="text-lg font-bold text-green-600">{existingShare.uniqueClicks || 0}</div>
//                       <div className="text-xs text-gray-600">Unique Clicks</div>
//                     </div>
//                     <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="text-lg font-bold text-yellow-600">${existingShare.amountEarned || 0}</div>
//                       <div className="text-xs text-gray-600">Earned</div>
//                     </div>
//                   </div>

//                   {/* Facebook Share Button */}
//                   <button
//                     onClick={handleFacebookShare}
//                     disabled={sharingFacebook}
//                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
//                   >
//                     {sharingFacebook ? (
//                       <div className="flex items-center">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Sharing...
//                       </div>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                         </svg>
//                         Share on Facebook
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Share Action Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
//                   {existingShare ? 'Your Share Status' : 
//                    gig.shareType === 'private' && !isUserApprovedForPrivateGig() ? 'Apply to Share' : 
//                    'Ready to Earn?'}
//                 </h3>
                
//                 {/* Application Status Badge */}
//                 {userApplication && gig.shareType === 'private' && (
//                   <div className={`mb-4 p-3 rounded-lg border text-center ${
//                     userApplication.status === 'approved' ? 'bg-green-50 border-green-200' :
//                     userApplication.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
//                     'bg-red-50 border-red-200'
//                   }`}>
//                     <div className="flex items-center justify-center">
//                       {userApplication.status === 'approved' && <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-2" />}
//                       {userApplication.status === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
//                       {userApplication.status === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
//                       <span className="font-medium capitalize text-gray-900">
//                         Application {userApplication.status}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Submission Status Badge - Only show if user has a share */}
//                 {existingShare && (
//                   <div className={`mb-4 p-3 rounded-lg border text-center ${
//                     existingShare.submissionStatus === 'approved' ? 'bg-green-50 border-green-200' :
//                     existingShare.submissionStatus === 'submitted' ? 'bg-blue-50 border-blue-200' :
//                     existingShare.submissionStatus === 'rejected' ? 'bg-red-50 border-red-200' :
//                     'bg-yellow-50 border-yellow-200'
//                   }`}>
//                     <div className="flex items-center justify-center">
//                       {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />}
//                       {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />}
//                       {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
//                       {existingShare.submissionStatus === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
//                       <span className="font-medium capitalize text-gray-900">
//                         Submission {existingShare.submissionStatus || 'pending'}
//                       </span>
//                     </div>
//                     {existingShare.submissionStatus === 'rejected' && existingShare.submissionProof?.[0]?.verificationNotes && (
//                       <p className="text-xs text-red-600 mt-1">
//                         {existingShare.submissionProof[0].verificationNotes}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Main Action Button */}
//                 {renderMainActionButton()}

//                 {/* Facebook Share Button (shown when user has a share link) */}
//                 {existingShare && (
//                   <button
//                     onClick={handleFacebookShare}
//                     disabled={sharingFacebook}
//                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mt-4"
//                   >
//                     {sharingFacebook ? (
//                       <div className="flex items-center">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Sharing...
//                       </div>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                         </svg>
//                         Share on Facebook
//                       </>
//                     )}
//                   </button>
//                 )}

//                 {/* Additional Actions */}
//                 {existingShare && (
//                   <div className="space-y-2 mt-4">
//                     <button
//                       onClick={() => {
//                         const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
//                         copyToClipboard(shareUrl);
//                         toast.success('Share link copied!');
//                       }}
//                       className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
//                     >
//                       <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
//                       Copy Share Link
//                     </button>
//                   </div>
//                 )}

//                 {/* Preview Button in Action Card */}
//                 <button
//                   onClick={() => setShowPreviewModal(true)}
//                   className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center mt-4"
//                 >
//                   <EyeIcon className="w-5 h-5 mr-2" />
//                   Preview Content
//                 </button>

//                 {/* Earnings Info */}
//                 {!existingShare && (
//                   <div className="text-center space-y-2 mt-4">
//                     <div className="text-sm text-gray-600">
//                       Potential earnings: <span className="font-semibold text-green-600">${userEarning.toFixed(2)}</span>
//                     </div>
                    
//                     {isGigActive() && !areAllSharesCompleted() && (
//                       <>
//                         <div className="text-xs text-gray-500 flex items-center justify-center">
//                           <CameraIcon className="w-3 h-3 mr-1" />
//                           Submit screenshots for approval
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {remainingShares} submissions needed
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modals */}
//         {showShareModal && <ShareModal userEarning={userEarning} />}
//         {showSubmitModal && <SubmitProofModal />}
//         {showApplyModal && <ApplyModal />}
//         {showPreviewModal && <PreviewModal />}
//       </div>
//     </div>
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
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  LockClosedIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PlayIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const GigDetail = () => {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applying, setApplying] = useState(false);
  const [sharingFacebook, setSharingFacebook] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [existingShare, setExistingShare] = useState(null);
  const [submissionImages, setSubmissionImages] = useState([]);
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [userApplication, setUserApplication] = useState(null);
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();


useEffect(() => {
  if (gig) {
    console.log('🔍 Gig media data:', {
      mediaFile: gig.mediaFile,
      mediaFileName: gig.mediaFileName,
      constructedUrl: getMediaUrl(),
      fullGig: gig
    });
  }
}, [gig]);

  useEffect(() => {
    fetchGig();
    checkExistingShare();
    checkUserApplication();
  }, [id]);

  const fetchGig = async () => {
    try {
      const res = await axios.get(`/api/gigs/${id}`);
      setGig(res.data.data);
      console.log(res.data.data)
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

  const checkUserApplication = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await axios.get('/api/applications/my-applications');
      const userApplications = res.data.data;
      const application = userApplications.find(app => app.gig && app.gig._id === id);
      setUserApplication(application);
    } catch (error) {
      console.error('Error checking user applications:', error);
    }
  };

// Function to get proper media URL - uses actual stored URL from gig data
const getMediaUrl = () => {
  if (!gig) return null;
  
  // If mediaFile field contains the full URL, use it directly
  if (gig.mediaFile && gig.mediaFile.startsWith('http')) {
    return gig.mediaFile;
  }
  
  // Otherwise construct from mediaFileName
  if (gig.mediaFileName) {
    return `/uploads/${gig.mediaFileName}`;
  }
  
  return null;
};

 // MINIMAL: Simple download function
// SIMPLE: Client-side only download function
const handleDownloadMedia = async () => {
  if (!gig || !gig.mediaFileName) {
    toast.error('No media file available for download');
    return;
  }

  const downloadToast = toast.loading('Preparing download...');

  try {
    // Get the media URL that's working in preview
    const mediaUrl = getMediaUrl();
    
    if (!mediaUrl) {
      throw new Error('Media URL not available');
    }

    console.log('📥 Downloading from:', mediaUrl);

    // Method 1: Simple anchor tag download (works for same-origin files)
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = gig.mediaFileName; // This forces download with original filename
    link.target = '_blank'; // Open in new tab as fallback
    
    // For cross-origin files, we need to fetch and create a blob
    if (mediaUrl.startsWith('http') && !mediaUrl.includes(window.location.host)) {
      // Cross-origin - use fetch approach
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      link.href = blobUrl;
      link.download = gig.mediaFileName;
      
      // Append and click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
    } else {
      // Same origin - simple download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success(`Download started for ${gig.mediaFileName}`, { 
      id: downloadToast,
      duration: 3000 
    });

  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: Provide user with manual instructions
    toast.error(
      <div className="text-center max-w-sm">
        <p className="font-semibold mb-2">Automatic download failed</p>
        <p className="text-sm mb-3">You can save the file manually:</p>
        <div className="space-y-2 text-xs text-left">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">1</span>
            <span>Right-click on the preview image/video</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">2</span>
            <span>Select "Save image as..." or "Save video as..."</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">3</span>
            <span>Choose download location and save</span>
          </div>
        </div>
      </div>, 
      { 
        id: downloadToast,
        duration: 8000 
      }
    );
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

  const isUserApprovedForPrivateGig = () => {
    if (!gig || !user) return false;
    
    return gig.approvedSharers?.some(sharer => {
      const sharerUserId = sharer.user?._id || sharer.user || sharer.user?.id;
      
      if (!sharerUserId) return false;
      
      const sharerIdStr = sharerUserId.toString();
      const userIdStr = user.id.toString();
      
      return sharerIdStr === userIdStr;
    });
  };

  const canUserApply = () => {
    if (!gig || !user) return false;
    if (gig.shareType !== 'private') return false;
    if (!isGigActive()) return false;
    if (areAllSharesCompleted()) return false;
    if (userApplication) return false;
    if (isUserApprovedForPrivateGig()) return false;
    return true;
  };

  const trackSocialShare = async (platform) => {
    if (!existingShare) return;
    
    try {
      const response = await axios.post(`/api/gigs/shares/${existingShare._id}/track-social-share`, {
        platform: platform,
        shareUrl: `${window.location.origin}/track-share/${existingShare.trackingToken}`,
        timestamp: new Date().toISOString()
      });
      
      console.log('Social share tracked:', response.data);
    } catch (error) {
      console.error('Error tracking social share:', error);
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

  const handleFacebookShare = () => {
    if (!isAuthenticated) {
      toast.error('Please login to share this gig');
      navigate('/login');
      return;
    }

    if (!gig) {
      toast.error('Gig data not loaded yet');
      return;
    }

    if (gig.shareType === 'private' && !isUserApprovedForPrivateGig()) {
      toast.error('You need to be approved to share this private gig');
      return;
    }

    setSharingFacebook(true);

    const shareUrl = existingShare 
      ? `${window.location.origin}/track-share/${existingShare.trackingToken}`
      : gig.link;

    const shareContent = `🌟 ${gig.title} 🌟

${gig.description}

💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share

${shareUrl}

#GigShare #EarnMoney #SideHustle #Opportunity`;

    copyToClipboard(shareContent);

    let mediaType = '';
    
    if (gig.mediaFileName) {
      mediaType = gig.mediaFileName.split('.').pop().toLowerCase();
    }

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    
    const width = 600;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const facebookWindow = window.open(
      facebookUrl,
      'facebook-share-dialog',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (existingShare) {
      trackSocialShare('facebook');
    }

 const MediaDownloadSection = () => (
  gig && gig.mediaFileName ? (
    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mb-3">
      <p className="text-purple-800 font-medium text-sm mb-2 flex items-center">
        <CameraIcon className="w-4 h-4 mr-2" />
        {getMediaType(gig.mediaFileName) === 'video' ? 'Video Available' : 'Image Available'}
      </p>
      <p className="text-purple-700 text-xs mb-2">
        Download the {getMediaType(gig.mediaFileName) === 'video' ? 'video' : 'image'} to include in your Facebook post
      </p>
     <button
  onClick={handleDownloadMedia}
  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-xs font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
>
  <ArrowRightIcon className="w-3 h-3 mr-1" />
  Download {getMediaType(gig.mediaFileName) === 'video' ? 'Video' : 'Image'}
</button>
    </div>
  ) : null
);

    toast.success(
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
            <DocumentDuplicateIcon className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-semibold text-green-800">Share Content Copied!</span>
        </div>
        
        <MediaDownloadSection />
        
        <div className="bg-gray-50 p-3 rounded-lg text-xs text-left mb-3 border">
          <p className="font-medium text-gray-700 mb-2">📝 Complete Share Guide:</p>
          <ol className="space-y-1 text-gray-600">
            <li>1. <strong>Facebook will open</strong> with the gig link</li>
            {gig.mediaFile && (
              <li>2. <strong>Download the {getMediaType(gig.mediaFileName) === 'video' ? 'video' : 'image'} above</strong> for your post</li>
            )}
            <li>{gig.mediaFile ? '3' : '2'}. <strong>Paste the copied text</strong> as your post description</li>
            <li>{gig.mediaFile ? '4' : '3'}. <strong>Upload the {getMediaType(gig.mediaFileName) === 'video' ? 'video' : 'image'}</strong> to your post</li>
            <li>{gig.mediaFile ? '5' : '4'}. <strong>Add your personal touch</strong> to increase engagement</li>
            <li>{gig.mediaFile ? '6' : '5'}. <strong>Take a screenshot</strong> after posting for proof</li>
          </ol>
        </div>

        {!facebookWindow && (
          <a 
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
            onClick={() => setSharingFacebook(false)}
          >
            📲 Open Facebook Manually
          </a>
        )}
      </div>,
      { 
        duration: 12000,
        icon: '📋'
      }
    );

    setSharingFacebook(false);
  };

  const handleApplyForPrivateGig = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for this gig');
      navigate('/login');
      return;
    }

    if (!applicationMessage.trim()) {
      toast.error('Please add a message to your application');
      return;
    }

    setApplying(true);
    const applyToast = toast.loading('Submitting your application...');

    try {
      const res = await axios.post(`/api/gigs/${id}/apply`, {
        message: applicationMessage
      });

      toast.success(res.data.message, { id: applyToast });
      setShowApplyModal(false);
      setApplicationMessage('');
      
      fetchGig();
      checkUserApplication();
      
    } catch (error) {
      console.error('Error applying for gig:', error);
      toast.error(error.response?.data?.message || 'Error submitting application', {
        id: applyToast
      });
    } finally {
      setApplying(false);
    }
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

    if (gig.shareType === 'private' && !isUserApprovedForPrivateGig()) {
      toast.error('You need to be approved to share this private gig');
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

  const getMediaType = (filename) => {
    if (!filename) return null;
    const ext = filename.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    
    if (videoExtensions.includes(ext)) return 'video';
    if (imageExtensions.includes(ext)) return 'image';
    return null;
  };

  // Function to render media with proper URL handling
  const renderMedia = (gig) => {
  const mediaUrl = getMediaUrl(); // Use the fixed function
  
  if (!mediaUrl && !gig.link) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No Media</p>
        </div>
      </div>
    );
  }

  // Check if it's a video file
  const isVideo = getMediaType(gig.mediaFileName) === 'video';

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
              console.error('Image failed to load:', mediaUrl);
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              parent.innerHTML = `
                <div class="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg">
                  <div class="text-center text-white">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="font-medium">${gig.title}</p>
                    <p class="text-sm opacity-90 mt-1">Click to view details</p>
                  </div>
                </div>
              `;
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', mediaUrl);
            }}
          />
        </div>
      );
    }
  }

    // If no media file but has link, show link preview
    if (gig.link) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <LinkIcon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">Link Content</p>
            <p className="text-gray-500 text-xs mt-2 truncate max-w-xs">{gig.link}</p>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Media Content</p>
        </div>
      </div>
    );
  };

  // Preview Modal Component
  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Content Preview</h3>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Media Preview */}
{/* Media Preview */}
{gig.mediaFileName && (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <CameraIcon className="w-5 h-5 mr-2" />
      Media Preview
    </h4>
    <div className="flex justify-center">
      {getMediaType(gig.mediaFileName) === 'video' ? (
        <div className="relative w-full max-w-2xl">
          <video
            controls
            className="w-full h-auto rounded-lg shadow-lg max-h-96 object-contain bg-black"
          >
            <source src={getMediaUrl()} type={`video/${gig.mediaFileName.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayIcon className="w-16 h-16 text-white opacity-80" />
          </div>
        </div>
      ) : (
        <img
          src={getMediaUrl()}
          alt="Gig media"
          className="max-w-full h-auto rounded-lg shadow-lg max-h-96 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            parent.innerHTML = `
              <div class="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg">
                <div class="text-center text-white">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="font-medium">${gig.title}</p>
                  <p class="text-sm opacity-90 mt-1">Click to view details</p>
                </div>
              </div>
            `;
          }}
        />
      )}
    </div>
    <div className="mt-3 text-center">
     <button
  onClick={handleDownloadMedia}
  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
>
  <ArrowRightIcon className="w-4 h-4 mr-2" />
  Download {getMediaType(gig.mediaFileName) === 'video' ? 'Video' : 'Image'}
</button>
    </div>
  </div>
)}

            {/* Title & Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                Content Details
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border">
                    {gig.title}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">
                    {gig.description}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-blue-600 break-all">
                      {gig.link}
                    </div>
                    <button
                      onClick={() => copyToClipboard(gig.link)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Preview */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">📋 Share Content Preview</h4>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                  {`🌟 ${gig.title} 🌟

${gig.description}

💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share

${gig.link}

#GigShare #EarnMoney #SideHustle #Opportunity`}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    This content will be copied when you click "Share on Facebook"
                  </span>
                  <button
                    onClick={() => {
                      const shareContent = `🌟 ${gig.title} 🌟\n\n${gig.description}\n\n💰 Budget: $${gig.budget} | 💵 Earn: $${calculateEarnings(gig).userEarning.toFixed(2)} per share\n\n${gig.link}\n\n#GigShare #EarnMoney #SideHustle #Opportunity`;
                      copyToClipboard(shareContent);
                    }}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                    Copy Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Application Modal
  const ApplyModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Apply to Share Gig</h3>
          <button
            onClick={() => setShowApplyModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-purple-800 font-medium mb-1">Private Gig Application</p>
                <p className="text-xs text-purple-700">
                  This is a private gig. You need approval from the gig owner before you can share it.
                </p>
              </div>
            </div>
          </div>

          <div>
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

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setShowApplyModal(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyForPrivateGig}
              disabled={applying || !applicationMessage.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {applying ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Applying...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Share Modal Component
  const ShareModal = ({ userEarning }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {existingShare ? 'Your Share Link' : 'Share This Gig'}
          </h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Submission Status */}
          {existingShare && (
            <div className={`p-3 rounded-lg border ${
              existingShare.submissionStatus === 'approved' ? 'bg-green-50 border-green-200' :
              existingShare.submissionStatus === 'submitted' ? 'bg-blue-50 border-blue-200' :
              existingShare.submissionStatus === 'rejected' ? 'bg-red-50 border-red-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center">
                {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />}
                {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />}
                {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
                {existingShare.submissionStatus === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
                <span className="text-sm font-medium capitalize text-gray-900">
                  Status: {existingShare.submissionStatus || 'pending'}
                </span>
              </div>
              {existingShare.submissionStatus === 'rejected' && existingShare.submissionProof?.[0]?.verificationNotes && (
                <p className="text-xs text-red-600 mt-1">
                  Reason: {existingShare.submissionProof[0].verificationNotes}
                </p>
              )}
            </div>
          )}

          {/* Share Stats */}
          {existingShare && shareData?.stats && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{shareData.stats.totalClicks}</div>
                <div className="text-xs text-gray-600">Total Clicks</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{shareData.stats.uniqueClicks}</div>
                <div className="text-xs text-gray-600">Unique Clicks</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-yellow-600">${shareData.stats.amountEarned}</div>
                <div className="text-xs text-gray-600">Earned</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Unique Share Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareData?.url || ''}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-900"
              />
              <button
                onClick={() => copyToClipboard(shareData?.url)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                Copy
              </button>
            </div>
          </div>

          {/* Facebook Share Button in Modal */}
          <button
            onClick={handleFacebookShare}
            disabled={sharingFacebook}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {sharingFacebook ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sharing...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
              </>
            )}
          </button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">Facebook Sharing Made Easy:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Auto-filled post:</strong> Title, description, budget & link</li>
                  <li>• <strong>No login required:</strong> Uses Facebook's simple share tool</li>
                  <li>• <strong>Take screenshots:</strong> Capture your Facebook post as proof</li>
                  <li>• <strong>Submit for approval:</strong> Upload screenshots to get paid</li>
                  <li>• <strong>Earn ${userEarning.toFixed(2)}</strong> per approved submission</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  💡 Tip: If popup is blocked, share content will be copied to clipboard!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-3 pt-2">
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-2">
              {existingShare && existingShare.submissionStatus === 'pending' && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <CameraIcon className="w-4 h-4 mr-1" />
                  Submit Proof
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Submit Proof Modal
  const SubmitProofModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Submit Proof of Sharing</h3>
            <button
              onClick={() => setShowSubmitModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">📸 What to include in your screenshots:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Show your post with the share link visible</li>
                <li>• Include timestamp if possible</li>
                <li>• Show the platform/group where you shared</li>
                <li>• Make sure the content is readable</li>
                <li>• Multiple angles/views increase approval chances</li>
              </ul>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
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
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-blue-500 hover:bg-gray-50">
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
                  <p className="text-gray-600 mb-2">Click to upload screenshots</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={submissionDescription}
                onChange={(e) => setSubmissionDescription(e.target.value)}
                placeholder="Describe where and how you shared the link..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={submitting || submissionImages.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
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
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gig details...</p>
        </div>
      </div>
    );
  }

  // Error State - gig is null after loading
  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig Not Found</h2>
          <p className="text-gray-600 mb-4">The gig you're looking for doesn't exist or failed to load.</p>
          <button
            onClick={() => navigate('/gigs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Gigs
          </button>
        </div>
      </div>
    );
  }

  // Safe calculations now that gig is confirmed to exist
  const { userEarning, platformFee, amountPerShare } = calculateEarnings(gig);
  const progressPercentage = getProgressPercentage();
  const remainingShares = getRemainingShares();

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600', 
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  // Main Action Button Logic
  const renderMainActionButton = () => {
    if (!isAuthenticated) {
      return (
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Login to Share
        </button>
      );
    }

    // Private gig logic
    if (gig.shareType === 'private') {
      if (isUserApprovedForPrivateGig()) {
        // User is approved for private gig - show share management
        if (existingShare) {
          return renderExistingShareButton();
        } else {
          // User is approved but hasn't generated a share link yet
          return (
            <button
              onClick={handleShare}
              disabled={sharing || !isGigActive() || areAllSharesCompleted()}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {!isGigActive() 
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
          );
        }
      } else if (userApplication) {
        // User has applied but not approved yet
        return (
          <button
            disabled
            className="w-full bg-yellow-600 text-white py-4 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
          >
            <ClockIcon className="w-5 h-5 mr-2" />
            Application {userApplication.status === 'pending' ? 'Pending' : userApplication.status}
          </button>
        );
      } else if (canUserApply()) {
        // User can apply for private gig
        return (
          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Apply to Share - Earn ${userEarning.toFixed(2)}
          </button>
        );
      } else {
        // User cannot apply (gig completed, not active, etc.)
        return (
          <button
            disabled
            className="w-full bg-gray-600 text-white py-4 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed"
          >
            Cannot Apply to This Gig
          </button>
        );
      }
    } else {
      // Public gig logic
      if (existingShare) {
        return renderExistingShareButton();
      } else {
        return (
          <button
            onClick={handleShare}
            disabled={sharing || !isGigActive() || areAllSharesCompleted()}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {!isGigActive() 
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
        );
      }
    }
  };

  const renderExistingShareButton = () => {
    if (!existingShare) return null;

    switch (existingShare.submissionStatus) {
      case 'pending':
        return (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Submit Proof
          </button>
        );
      case 'submitted':
        return (
          <button
            disabled
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
          >
            <ClockIcon className="w-5 h-5 mr-2" />
            Under Review
          </button>
        );
      case 'approved':
        return (
          <button
            disabled
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center"
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Approved - Payment Pending
          </button>
        );
      default:
        return (
          <button
            onClick={handleShare}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Manage Share
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gig Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                  {gig.shareType === 'private' && (
                    <LockClosedIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>Posted by <strong className="text-gray-900">{gig.user?.name || 'Unknown User'}</strong></span>
                  <CalendarIcon className="w-4 h-4 ml-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                  <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium border ${
                    gig.shareType === 'private' 
                      ? 'bg-purple-100 text-purple-700 border-purple-200' 
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {gig.shareType === 'private' ? 'Private Gig' : 'Public Gig'}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isGigActive() 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {isGigActive() ? 'Active' : 'Completed'}
              </span>
            </div>

            {/* Application Status Banner for Private Gigs */}
            {gig.shareType === 'private' && isAuthenticated && (
              <div className={`mb-6 p-4 rounded-lg border ${
                isUserApprovedForPrivateGig() 
                  ? 'bg-green-50 border-green-200' 
                  : userApplication
                  ? userApplication.status === 'pending'
                    ? 'bg-yellow-50 border-yellow-200'
                    : userApplication.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-center">
                  {isUserApprovedForPrivateGig() ? (
                    <>
                      <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-green-800 font-semibold">Approved Sharer</h4>
                        <p className="text-green-700 text-sm">You are approved to share this private gig</p>
                      </div>
                    </>
                  ) : userApplication ? (
                    <>
                      {userApplication.status === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-3" />}
                      {userApplication.status === 'approved' && <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-3" />}
                      {userApplication.status === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-3" />}
                      <div>
                        <h4 className="capitalize font-semibold ${
                          userApplication.status === 'pending' ? 'text-yellow-800' :
                          userApplication.status === 'approved' ? 'text-green-800' : 'text-red-800'
                        }">
                          Application {userApplication.status}
                        </h4>
                        <p className="text-sm ${
                          userApplication.status === 'pending' ? 'text-yellow-700' :
                          userApplication.status === 'approved' ? 'text-green-700' : 'text-red-700'
                        }">
                          {userApplication.status === 'pending' 
                            ? 'Waiting for gig owner approval' 
                            : userApplication.status === 'approved'
                            ? 'You can now share this gig'
                            : 'Your application was not approved'
                          }
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <h4 className="text-purple-800 font-semibold">Private Gig</h4>
                        <p className="text-purple-700 text-sm">Apply to get approved for sharing this gig</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

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
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Preview Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                Preview Content
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{gig.description}</p>
              </div>
              
              {/* Link to Share */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
                  Link to Share
                </h3>
                <a 
                  href={gig.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 break-all"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {gig.link}
                </a>
              </div>

              {/* Private Gig Instructions */}
              {gig.shareType === 'private' && gig.privateSettings?.applicationInstructions && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <LockClosedIcon className="w-5 h-5 text-purple-600 mr-2" />
                    Application Instructions
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-700 text-sm">{gig.privateSettings.applicationInstructions}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Share Link (if any) */}
            {existingShare && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShareIcon className="w-5 h-5 text-green-600 mr-2" />
                  Your Share Link
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Your Unique Link</div>
                      <div className="text-gray-900 font-mono text-sm break-all">
                        {`${window.location.origin}/track-share/${existingShare.trackingToken}`}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/track-share/${existingShare.trackingToken}`)}
                      className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-gray-900">{existingShare.totalClicks || 0}</div>
                      <div className="text-xs text-gray-600">Total Clicks</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-green-600">{existingShare.uniqueClicks || 0}</div>
                      <div className="text-xs text-gray-600">Unique Clicks</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-yellow-600">${existingShare.amountEarned || 0}</div>
                      <div className="text-xs text-gray-600">Earned</div>
                    </div>
                  </div>

                  {/* Facebook Share Button */}
                  <button
                    onClick={handleFacebookShare}
                    disabled={sharingFacebook}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {sharingFacebook ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sharing...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Share on Facebook
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  {existingShare ? 'Your Share Status' : 
                   gig.shareType === 'private' && !isUserApprovedForPrivateGig() ? 'Apply to Share' : 
                   'Ready to Earn?'}
                </h3>
                
                {/* Application Status Badge */}
                {userApplication && gig.shareType === 'private' && (
                  <div className={`mb-4 p-3 rounded-lg border text-center ${
                    userApplication.status === 'approved' ? 'bg-green-50 border-green-200' :
                    userApplication.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-center">
                      {userApplication.status === 'approved' && <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-2" />}
                      {userApplication.status === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
                      {userApplication.status === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
                      <span className="font-medium capitalize text-gray-900">
                        Application {userApplication.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submission Status Badge - Only show if user has a share */}
                {existingShare && (
                  <div className={`mb-4 p-3 rounded-lg border text-center ${
                    existingShare.submissionStatus === 'approved' ? 'bg-green-50 border-green-200' :
                    existingShare.submissionStatus === 'submitted' ? 'bg-blue-50 border-blue-200' :
                    existingShare.submissionStatus === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-center">
                      {existingShare.submissionStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />}
                      {existingShare.submissionStatus === 'submitted' && <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />}
                      {existingShare.submissionStatus === 'rejected' && <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />}
                      {existingShare.submissionStatus === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />}
                      <span className="font-medium capitalize text-gray-900">
                        Submission {existingShare.submissionStatus || 'pending'}
                      </span>
                    </div>
                    {existingShare.submissionStatus === 'rejected' && existingShare.submissionProof?.[0]?.verificationNotes && (
                      <p className="text-xs text-red-600 mt-1">
                        {existingShare.submissionProof[0].verificationNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Main Action Button */}
                {renderMainActionButton()}

                {/* Facebook Share Button (shown when user has a share link) */}
                {existingShare && (
                  <button
                    onClick={handleFacebookShare}
                    disabled={sharingFacebook}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mt-4"
                  >
                    {sharingFacebook ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sharing...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Share on Facebook
                      </>
                    )}
                  </button>
                )}

                {/* Additional Actions */}
                {existingShare && (
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/track-share/${existingShare.trackingToken}`;
                        copyToClipboard(shareUrl);
                        toast.success('Share link copied!');
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Copy Share Link
                    </button>
                  </div>
                )}

                {/* Preview Button in Action Card */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center mt-4"
                >
                  <EyeIcon className="w-5 h-5 mr-2" />
                  Preview Content
                </button>

                {/* Earnings Info */}
                {!existingShare && (
                  <div className="text-center space-y-2 mt-4">
                    <div className="text-sm text-gray-600">
                      Potential earnings: <span className="font-semibold text-green-600">${userEarning.toFixed(2)}</span>
                    </div>
                    
                    {isGigActive() && !areAllSharesCompleted() && (
                      <>
                        <div className="text-xs text-gray-500 flex items-center justify-center">
                          <CameraIcon className="w-3 h-3 mr-1" />
                          Submit screenshots for approval
                        </div>
                        <div className="text-xs text-gray-500">
                          {remainingShares} submissions needed
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showShareModal && <ShareModal userEarning={userEarning} />}
        {showSubmitModal && <SubmitProofModal />}
        {showApplyModal && <ApplyModal />}
        {showPreviewModal && <PreviewModal />}
      </div>
    </div>
  );
};

export default GigDetail;