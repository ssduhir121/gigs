
// // src/pages/CreateGig.jsx
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// import {
//   DocumentTextIcon,
//   LinkIcon,
//   CurrencyDollarIcon,
//   ShareIcon,
//   InformationCircleIcon,
//   CreditCardIcon,
//   WalletIcon,
//   PhotoIcon,
//   VideoCameraIcon,
//   XMarkIcon,
//   EyeIcon,
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   UserGroupIcon,
//   GlobeAltIcon,
//   LockClosedIcon,
// } from '@heroicons/react/24/outline';
// import { GradientBackground, GlassCard, StatIconWrapper } from '../components/common/StyledComponents';

// const CreateGig = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     link: '',
//     budget: '',
//     sharesRequired: '',
//     mediaFile: null,
//     shareType: 'public' // 'public' or 'private'
//   });
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errors, setErrors] = useState({});
//   const [currentStep, setCurrentStep] = useState('form'); // 'form', 'preview', 'payment'
//   const [previewUrl, setPreviewUrl] = useState('');
//   const fileInputRef = useRef(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const { title, description, link, budget, sharesRequired, mediaFile, shareType } = formData;

//   // Vite environment variables
//   const paypalOptions = {
//     "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
//     currency: "USD",
//     intent: "capture",
//     debug: true,
//   };

//   const hasPaypalConfig = !!import.meta.env.VITE_PAYPAL_CLIENT_ID;

//   // Supported file types
//   const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//   const supportedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const maxSize = 10 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setErrors({ ...errors, mediaFile: 'File size must be less than 10MB' });
//       return;
//     }

//     // Check if file is image or video
//     if (supportedImageTypes.includes(file.type)) {
//       // It's an image
//       setFormData({ ...formData, mediaFile: file });
//       setErrors({ ...errors, mediaFile: '' });
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewUrl(objectUrl);
//     } else if (supportedVideoTypes.includes(file.type)) {
//       // It's a video
//       setFormData({ ...formData, mediaFile: file });
//       setErrors({ ...errors, mediaFile: '' });
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewUrl(objectUrl);
//     } else {
//       setErrors({ ...errors, mediaFile: 'Please select a valid image or video file' });
//     }
//   };

//   const removeMedia = () => {
//     setFormData({ ...formData, mediaFile: null });
//     setPreviewUrl('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!title.trim()) newErrors.title = 'Title is required';
//     if (!description.trim()) newErrors.description = 'Description is required';
    
//     if (!link.trim()) {
//       newErrors.link = 'Link is required';
//     } else if (link && !link.match(/^https?:\/\/.+\..+/)) {
//       newErrors.link = 'Please enter a valid URL';
//     }

//     if (!budget || parseFloat(budget) < 15) newErrors.budget = 'Budget must be at least $15';
//     if (!sharesRequired || parseInt(sharesRequired, 10) < 1) newErrors.sharesRequired = 'At least 1 share is required';

//     const amountPerShare = budget && sharesRequired ? parseFloat(budget) / parseInt(sharesRequired, 10) : 0;
//     if (amountPerShare < 0.5) {
//       newErrors.budget = 'Amount per share must be at least $0.50';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleContinueToPreview = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     console.log('Form data before preview:', formData); // Debug log
//     setCurrentStep('preview');
//   };

//   const handleContinueToPayment = () => {
//     console.log('Form data before payment:', formData); // Debug log
//     setCurrentStep('payment');
//   };

//   const handleBackToForm = () => {
//     setCurrentStep('form');
//   };

//   const uploadMedia = async () => {
//     if (!mediaFile) return null;

//     const formData = new FormData();
//     formData.append('file', mediaFile);
//     // Determine if it's image or video
//     const fileType = supportedImageTypes.includes(mediaFile.type) ? 'image' : 'video';
//     formData.append('type', fileType);

//     try {
//       const response = await axios.post('/api/upload/media', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentCompleted);
//         },
//       });
      
//       setUploadProgress(100);
//       return response.data.fileUrl;
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload media file');
//       throw error;
//     }
//   };

//   // Wallet path
//   const handlePayWithWallet = async () => {
//     setLoading(true);
//     try {
//       let mediaUrl = '';
      
//       if (mediaFile) {
//         mediaUrl = await uploadMedia();
//       }

//       console.log('Creating gig with data:', {
//         title: title.trim(),
//         description: description.trim(),
//         link: link.trim(),
//         budget: parseFloat(budget),
//         sharesRequired: parseInt(sharesRequired, 10),
//         mediaFile: mediaUrl,
//         mediaFileName: mediaFile ? mediaFile.name : '',
//         shareType: shareType // This should now be correct
//       });

//       const res = await axios.post('/api/gigs/create-with-wallet', {
//         title: title.trim(),
//         description: description.trim(),
//         link: link.trim(),
//         budget: parseFloat(budget),
//         sharesRequired: parseInt(sharesRequired, 10),
//         mediaFile: mediaUrl,
//         mediaFileName: mediaFile ? mediaFile.name : '',
//         shareType: shareType
//       });
      
//       console.log('Gig creation response:', res.data);
//       toast.success('Gig created successfully using wallet balance!');
//       navigate('/my-gigs');
//     } catch (error) {
//       console.error('Wallet payment error:', error);
//       console.error('Error response:', error.response?.data);
//       toast.error(error.response?.data?.message || 'Wallet payment failed');
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handlePayPalOnApprove = async (data, actions) => {
//     console.log('🎯 PayPal onApprove triggered:', data);
    
//     try {
//       console.log('🔄 Capturing PayPal order...');
//       const captureDetails = await actions.order.capture();
//       console.log('✅ PayPal capture details:', captureDetails);

//       if (captureDetails.status !== 'COMPLETED') {
//         console.log('❌ PayPal capture not completed. Status:', captureDetails.status);
//         toast.error('Payment not completed. Please try again.');
//         return;
//       }

//       let mediaUrl = '';
      
//       if (mediaFile) {
//         mediaUrl = await uploadMedia();
//       }

//       console.log('📤 Sending capture info to backend...', {
//         orderId: data.orderID,
//         title: title.trim(),
//         budget: parseFloat(budget),
//         sharesRequired: parseInt(sharesRequired, 10),
//         shareType: shareType // This should now be correct
//       });

//       const res = await axios.post('/api/gigs/paypal/capture', {
//         orderId: data.orderID,
//         title: title.trim(),
//         description: description.trim(),
//         link: link.trim(),
//         budget: parseFloat(budget),
//         sharesRequired: parseInt(sharesRequired, 10),
//         mediaFile: mediaUrl,
//         mediaFileName: mediaFile ? mediaFile.name : '',
//         shareType: shareType
//       });

//       console.log('✅ Backend response:', res.data);

//       if (res.data.success) {
//         toast.success('Payment completed and gig created!');
//         navigate('/my-gigs');
//       } else {
//         console.log('❌ Backend returned error:', res.data.message);
//         toast.error(res.data.message || 'Gig creation failed');
//       }
//     } catch (err) {
//       console.error('❌ PayPal capture error:', err);
//       console.error('Error response:', err.response?.data);
      
//       if (err.response?.data?.message?.includes('already processed')) {
//         toast.success('Payment was already processed. Redirecting to your gigs...');
//         navigate('/my-gigs');
//       } else if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error('Payment processing failed. Please try again.');
//       }
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const amountPerShare = budget && sharesRequired ? (parseFloat(budget) / parseInt(sharesRequired, 10)).toFixed(2) : '0.00';
//   const hasSufficientBalance = user?.walletBalance >= parseFloat(budget || 0);

//   // Check if media file is image or video
//   const isImageFile = mediaFile && supportedImageTypes.includes(mediaFile.type);
//   const isVideoFile = mediaFile && supportedVideoTypes.includes(mediaFile.type);

//   // Render content preview
//   const renderContentPreview = () => {
//     if (isImageFile && previewUrl) {
//       return (
//         <div className="bg-white/5 rounded-lg p-4 border border-white/20">
//           <div className="relative rounded-lg overflow-hidden bg-black/20">
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="w-full h-48 object-contain"
//             />
//           </div>
//           <p className="text-sm text-gray-300 mt-2">
//             {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
//           </p>
//         </div>
//       );
//     } else if (isVideoFile && previewUrl) {
//       return (
//         <div className="bg-white/5 rounded-lg p-4 border border-white/20">
//           <div className="relative rounded-lg overflow-hidden bg-black/20">
//             <video
//               src={previewUrl}
//               className="w-full h-48 object-contain"
//               controls
//             />
//           </div>
//           <p className="text-sm text-gray-300 mt-2">
//             {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
//           </p>
//         </div>
//       );
//     } else if (link) {
//       return (
//         <div className="bg-white/5 rounded-lg p-4 border border-white/20">
//           <div className="flex items-center">
//             <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
//             <span className="text-sm text-gray-300 truncate">{link}</span>
//           </div>
//           <a
//             href={link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center mt-2 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
//           >
//             <EyeIcon className="w-4 h-4 mr-1" />
//             Test Link
//           </a>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <GradientBackground className="py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Progress Steps */}
//         <div className="flex justify-center mb-8">
//           <div className="flex items-center space-x-4">
//             <div className={`flex items-center ${currentStep === 'form' ? 'text-primary-400' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'form' ? 'bg-primary-600 text-white' : 'bg-gray-600'
//               }`}>
//                 1
//               </div>
//               <span className="ml-2 text-sm">Details</span>
//             </div>
            
//             <div className="w-12 h-0.5 bg-gray-600"></div>
            
//             <div className={`flex items-center ${currentStep === 'preview' ? 'text-primary-400' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'preview' ? 'bg-primary-600 text-white' : 
//                 currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-600'
//               }`}>
//                 2
//               </div>
//               <span className="ml-2 text-sm">Preview</span>
//             </div>
            
//             <div className="w-12 h-0.5 bg-gray-600"></div>
            
//             <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary-400' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-600'
//               }`}>
//                 3
//               </div>
//               <span className="ml-2 text-sm">Payment</span>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Create New Gig</h1>
//           <p className="text-gray-200">Promote your content and reach more people</p>
//         </div>

//         <GlassCard className="overflow-hidden">
//           <div className="px-6 py-8">
//             {/* STEP 1: Form */}
//             {currentStep === 'form' && (
//               <form onSubmit={handleContinueToPreview} className="space-y-6">
//                 {/* Title */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Gig Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     required
//                     value={title}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                       errors.title ? 'border-red-400/50' : 'border-white/20'
//                     }`}
//                     placeholder="Enter a compelling title for your gig"
//                   />
//                   {errors.title && <p className="mt-1 text-sm text-red-300">{errors.title}</p>}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Description *
//                   </label>
//                   <textarea
//                     name="description"
//                     required
//                     rows={4}
//                     value={description}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                       errors.description ? 'border-red-400/50' : 'border-white/20'
//                     }`}
//                     placeholder="Describe what people need to share and any specific instructions..."
//                   />
//                   {errors.description && <p className="mt-1 text-sm text-red-300">{errors.description}</p>}
//                 </div>

//                 {/* Link */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Link to Share *
//                   </label>
//                   <input
//                     type="url"
//                     name="link"
//                     required
//                     value={link}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                       errors.link ? 'border-red-400/50' : 'border-white/20'
//                     }`}
//                     placeholder="https://example.com/your-content"
//                   />
//                   {errors.link && <p className="mt-1 text-sm text-red-300">{errors.link}</p>}
//                 </div>

//                 {/* Image/Video Upload */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <PhotoIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Image or Video (Optional)
//                   </label>
                  
//                   {!mediaFile ? (
//                     <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center transition-all duration-200 hover:border-primary-500/50 hover:bg-white/5">
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept="image/*,video/*"
//                         onChange={handleFileSelect}
//                         className="hidden"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => fileInputRef.current?.click()}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                       >
//                         Choose Image or Video
//                       </button>
//                       <p className="mt-2 text-sm text-gray-400">
//                         Max 10MB. Images: JPEG, PNG, GIF, WebP. Videos: MP4, MOV, AVI, WebM
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="border border-white/20 rounded-lg p-4 bg-white/5">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center">
//                           <span className="text-sm text-white font-medium truncate">
//                             {mediaFile.name}
//                           </span>
//                           <span className="ml-2 text-xs text-gray-400">
//                             ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
//                           </span>
//                           <span className="ml-2 text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
//                             {isImageFile ? 'Image' : isVideoFile ? 'Video' : 'File'}
//                           </span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={removeMedia}
//                           className="text-gray-400 hover:text-red-400 transition-colors"
//                         >
//                           <XMarkIcon className="w-5 h-5" />
//                         </button>
//                       </div>
                      
//                       {previewUrl && (
//                         <div className="relative rounded-lg overflow-hidden bg-black/20">
//                           {isImageFile ? (
//                             <img
//                               src={previewUrl}
//                               alt="Preview"
//                               className="w-full h-48 object-contain"
//                             />
//                           ) : (
//                             <video
//                               src={previewUrl}
//                               className="w-full h-48 object-contain"
//                               controls
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {errors.mediaFile && <p className="mt-1 text-sm text-red-300">{errors.mediaFile}</p>}
//                 </div>

//                 {/* Share Type Selection - FIXED */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-3">
//                     Who can share this gig?
//                   </label>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         console.log('Setting shareType to public');
//                         setFormData(prev => ({ ...prev, shareType: 'public' }));
//                       }}
//                       className={`p-4 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center ${
//                         shareType === 'public' 
//                           ? 'border-green-500 bg-green-500/20 text-white shadow-lg' 
//                           : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30'
//                       }`}
//                     >
//                       <GlobeAltIcon className="w-6 h-6 mb-2" />
//                       <span className="text-sm font-medium">Public</span>
//                       <p className="text-xs text-gray-400 mt-1">Anyone can share</p>
//                       {shareType === 'public' && (
//                         <div className="mt-2 text-xs text-green-300 flex items-center">
//                           <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
//                           Selected
//                         </div>
//                       )}
//                     </button>
                    
//                     <button
//                       type="button"
//                       onClick={() => {
//                         console.log('Setting shareType to private');
//                         setFormData(prev => ({ ...prev, shareType: 'private' }));
//                       }}
//                       className={`p-4 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center ${
//                         shareType === 'private' 
//                           ? 'border-purple-500 bg-purple-500/20 text-white shadow-lg' 
//                           : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30'
//                       }`}
//                     >
//                       <LockClosedIcon className="w-6 h-6 mb-2" />
//                       <span className="text-sm font-medium">Private</span>
//                       <p className="text-xs text-gray-400 mt-1">Only approved users</p>
//                       {shareType === 'private' && (
//                         <div className="mt-2 text-xs text-purple-300 flex items-center">
//                           <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
//                           Selected
//                         </div>
//                       )}
//                     </button>
//                   </div>
//                   <div className="mt-2 text-xs text-gray-400">
//                     Current selection: <span className="font-semibold text-white">{shareType}</span>
//                   </div>
//                 </div>

//                 {/* Budget and Shares */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                       <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
//                       Total Budget ($) *
//                     </label>
//                     <input
//                       type="number"
//                       name="budget"
//                       min="15"
//                       step="0.01"
//                       required
//                       value={budget}
//                       onChange={onChange}
//                       className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.budget ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="15.00"
//                     />
//                     {errors.budget && <p className="mt-1 text-sm text-red-300">{errors.budget}</p>}
//                   </div>

//                   <div>
//                     <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                       <ShareIcon className="w-5 h-5 text-gray-400 mr-2" />
//                       Shares Required *
//                     </label>
//                     <input
//                       type="number"
//                       name="sharesRequired"
//                       min="1"
//                       required
//                       value={sharesRequired}
//                       onChange={onChange}
//                       className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.sharesRequired ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="Number of shares needed"
//                     />
//                     {errors.sharesRequired && <p className="mt-1 text-sm text-red-300">{errors.sharesRequired}</p>}
//                   </div>
//                 </div>

//                 {/* Cost Breakdown */}
//                 {budget && sharesRequired && (
//                   <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
//                     <div className="flex items-center mb-2">
//                       <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2" />
//                       <h4 className="text-sm font-semibold text-blue-300">Cost Breakdown</h4>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-300">Total budget:</span>
//                         <span className="font-semibold text-white ml-2">${parseFloat(budget).toFixed(2)}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-300">Shares required:</span>
//                         <span className="font-semibold text-white ml-2">{sharesRequired}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-300">Cost per share:</span>
//                         <span className="font-semibold text-green-300 ml-2">${amountPerShare}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-300">Platform commission (6.5% + $2):</span>
//                         <span className="font-semibold text-white ml-2">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     {parseFloat(amountPerShare) < 0.5 && (
//                       <p className="text-xs text-red-300 mt-2">
//                         Minimum amount per share is $0.50. Please increase your budget or reduce shares.
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="submit"
//                     className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
//                   >
//                     Preview Gig
//                     <ArrowRightIcon className="w-5 h-5 ml-2" />
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* STEP 2: Preview */}
//             {currentStep === 'preview' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <h2 className="text-2xl font-bold text-white mb-2">Preview Your Gig</h2>
//                   <p className="text-gray-300">Review your gig before proceeding to payment</p>
//                 </div>

//                 {/* Gig Preview */}
//                 <div className="bg-white/5 rounded-lg p-6 border border-white/20">
//                   <h3 className="text-lg font-semibold text-white mb-4">Gig Details</h3>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-300">Title</label>
//                       <p className="text-white mt-1">{title}</p>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-300">Description</label>
//                       <p className="text-white mt-1 whitespace-pre-wrap">{description}</p>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-300">Link</label>
//                       <p className="text-white mt-1">{link}</p>
//                     </div>

//                     {mediaFile && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-300">
//                           {isImageFile ? 'Image' : 'Video'} Preview
//                         </label>
//                         <div className="mt-2">
//                           {renderContentPreview()}
//                         </div>
//                       </div>
//                     )}

//                     <div>
//                       <label className="text-sm font-medium text-gray-300">Share Type</label>
//                       <div className="flex items-center mt-1">
//                         {shareType === 'public' ? (
//                           <>
//                             <GlobeAltIcon className="w-5 h-5 text-green-400 mr-2" />
//                             <span className="text-green-300 font-semibold">Public - Anyone can share</span>
//                           </>
//                         ) : (
//                           <>
//                             <LockClosedIcon className="w-5 h-5 text-purple-400 mr-2" />
//                             <span className="text-purple-300 font-semibold">Private - Only approved users</span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-300">Budget</label>
//                         <p className="text-white mt-1">${parseFloat(budget).toFixed(2)}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-300">Shares Required</label>
//                         <p className="text-white mt-1">{sharesRequired}</p>
//                       </div>
//                     </div>

//                     <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-4">
//                       <div className="flex items-center mb-2">
//                         <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2" />
//                         <h4 className="text-sm font-semibold text-blue-300">Payment Summary</h4>
//                       </div>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-300">Total budget:</span>
//                           <span className="font-semibold text-white">${parseFloat(budget).toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-300">Platform commission:</span>
//                           <span className="font-semibold text-white">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between border-t border-blue-400/30 pt-2">
//                           <span className="text-gray-300">Amount per share:</span>
//                           <span className="font-semibold text-green-300">${amountPerShare}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between pt-4">
//                   <button
//                     onClick={handleBackToForm}
//                     className="inline-flex items-center px-6 py-3 border border-white/20 text-base font-medium rounded-lg text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
//                   >
//                     <ArrowLeftIcon className="w-5 h-5 mr-2" />
//                     Back to Edit
//                   </button>
                  
//                   <button
//                     onClick={handleContinueToPayment}
//                     className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200"
//                   >
//                     Continue to Payment
//                     <ArrowRightIcon className="w-5 h-5 ml-2" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: Payment */}
//             {currentStep === 'payment' && (
//               <div>
//                 <div className="text-center mb-6">
//                   <h2 className="text-xl text-white font-semibold">Choose Payment Method</h2>
//                   <p className="text-gray-300">Minimum amount is $15. Platform fee (6.5% + $2) is taken at creation.</p>
//                   <div className="mt-2 text-sm text-gray-400">
//                     Gig type: <span className={`font-semibold ${shareType === 'public' ? 'text-green-300' : 'text-purple-300'}`}>
//                       {shareType === 'public' ? 'Public' : 'Private'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Wallet Payment */}
//                   <div className="p-6 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm">
//                     <div className="flex items-center mb-3">
//                       <StatIconWrapper color="green">
//                         <WalletIcon className="w-6 h-6 text-white" />
//                       </StatIconWrapper>
//                       <div className="ml-3">
//                         <h3 className="text-lg font-semibold text-white">Pay with Wallet</h3>
//                         <p className="text-sm text-gray-300">Balance: ${Number(user?.walletBalance || 0).toFixed(2)}</p>
//                       </div>
//                     </div>

//                     <div className="mt-4">
//                       <button
//                         onClick={handlePayWithWallet}
//                         disabled={!hasSufficientBalance || loading}
//                         className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
//                           hasSufficientBalance 
//                             ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transform hover:-translate-y-0.5' 
//                             : 'bg-gray-600 cursor-not-allowed text-gray-300'
//                         }`}
//                       >
//                         {loading ? (
//                           <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
//                             Processing...
//                           </>
//                         ) : (
//                           hasSufficientBalance ? 'Pay with Wallet' : 'Insufficient Balance'
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* PayPal Payment */}
//                   <div className="p-6 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm">
//                     <div className="flex items-center mb-3">
//                       <StatIconWrapper color="blue">
//                         <CreditCardIcon className="w-6 h-6 text-white" />
//                       </StatIconWrapper>
//                       <div className="ml-3">
//                         <h3 className="text-lg font-semibold text-white">Pay with PayPal</h3>
//                         <p className="text-sm text-gray-300">Secure checkout via PayPal</p>
//                       </div>
//                     </div>

//                     <div className="mt-4">
//                       {hasPaypalConfig ? (
//                         <PayPalScriptProvider 
//                           options={paypalOptions}
//                           deferLoading={false}
//                         >
//                           <PayPalButtons
//                             style={{ 
//                               layout: "vertical", 
//                               color: "gold", 
//                               shape: "rect", 
//                               label: "paypal",
//                               height: 45
//                             }}
//                             createOrder={async (data, actions) => {
//                               try {
//                                 console.log('Creating PayPal order...');
//                                 const res = await axios.post('/api/gigs/paypal/create-order', { 
//                                   budget: parseFloat(budget) 
//                                 });
//                                 console.log('Order created:', res.data.data.orderId);
//                                 return res.data.data.orderId;
//                               } catch (err) {
//                                 console.error('createOrder error', err);
//                                 toast.error('Unable to create PayPal order');
//                                 throw err;
//                               }
//                             }}
//                             onApprove={handlePayPalOnApprove}
//                             onError={(err) => {
//                               console.error('PayPal buttons error:', err);
//                               toast.error('PayPal checkout error');
//                             }}
//                             onCancel={(data) => {
//                               console.log('PayPal checkout cancelled:', data);
//                               toast.error('Payment cancelled');
//                             }}
//                           />
//                         </PayPalScriptProvider>
//                       ) : (
//                         <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
//                           <p className="text-yellow-300 text-sm mb-2">
//                             PayPal is not configured.
//                           </p>
//                           <p className="text-yellow-200 text-xs">
//                             Add VITE_PAYPAL_CLIENT_ID to your .env file
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-center mt-6">
//                   <button 
//                     onClick={() => setCurrentStep('preview')} 
//                     className="text-gray-300 underline hover:text-white transition-colors duration-200"
//                   >
//                     Go back to preview
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </GlassCard>
//       </div>
//     </GradientBackground>
//   );
// };

// export default CreateGig;



// src/pages/CreateGig.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  DocumentTextIcon,
  LinkIcon,
  CurrencyDollarIcon,
  ShareIcon,
  InformationCircleIcon,
  CreditCardIcon,
  WalletIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    budget: '',
    sharesRequired: '',
    mediaFile: null,
    shareType: 'public'
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState('form');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { title, description, link, budget, sharesRequired, mediaFile, shareType } = formData;

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: "USD",
    intent: "capture",
    debug: true,
  };

  const hasPaypalConfig = !!import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const supportedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ ...errors, mediaFile: 'File size must be less than 10MB' });
      return;
    }

    if (supportedImageTypes.includes(file.type)) {
      setFormData({ ...formData, mediaFile: file });
      setErrors({ ...errors, mediaFile: '' });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else if (supportedVideoTypes.includes(file.type)) {
      setFormData({ ...formData, mediaFile: file });
      setErrors({ ...errors, mediaFile: '' });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setErrors({ ...errors, mediaFile: 'Please select a valid image or video file' });
    }
  };

  const removeMedia = () => {
    setFormData({ ...formData, mediaFile: null });
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (!link.trim()) {
      newErrors.link = 'Link is required';
    } else if (link && !link.match(/^https?:\/\/.+\..+/)) {
      newErrors.link = 'Please enter a valid URL';
    }

    if (!budget || parseFloat(budget) < 15) newErrors.budget = 'Budget must be at least $15';
    if (!sharesRequired || parseInt(sharesRequired, 10) < 1) newErrors.sharesRequired = 'At least 1 share is required';

    const amountPerShare = budget && sharesRequired ? parseFloat(budget) / parseInt(sharesRequired, 10) : 0;
    if (amountPerShare < 0.5) {
      newErrors.budget = 'Amount per share must be at least $0.50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPreview = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setCurrentStep('preview');
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

 // FIXED: uploadMedia function with better error handling
const uploadMedia = async () => {
  if (!mediaFile) {
    console.log('❌ No media file selected');
    return null;
  }

  console.log('🔍 Starting upload process...', {
    fileName: mediaFile.name,
    fileType: mediaFile.type,
    fileSize: mediaFile.size,
    isFileInstance: mediaFile instanceof File
  });

  // Validate file type
  const isValidType = supportedImageTypes.includes(mediaFile.type) || 
                     supportedVideoTypes.includes(mediaFile.type);
  
  if (!isValidType) {
    toast.error('Unsupported file type');
    return null;
  }

  const formData = new FormData();
  formData.append('file', mediaFile);
  formData.append('type', supportedImageTypes.includes(mediaFile.type) ? 'image' : 'video');

  try {
    console.log('🚀 Sending upload request...');
    
    const response = await axios.post('/api/upload/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          console.log(`📊 Upload Progress: ${percentCompleted}%`);
        }
      },
    });
    
    console.log('✅ Upload Successful:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Upload failed');
    }
    
    return response.data.fileUrl || response.data.url;
  } catch (error) {
    console.error('❌ Upload Failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    let errorMessage = 'Failed to upload media file';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Upload timeout - file might be too large';
    }
    
    toast.error(errorMessage);
    return null;
  }
};

  const handlePayWithWallet = async () => {
    setLoading(true);
    try {
      let mediaUrl = '';
      
      if (mediaFile) {
        mediaUrl = await uploadMedia();
      }

      const res = await axios.post('/api/gigs/create-with-wallet', {
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        budget: parseFloat(budget),
        sharesRequired: parseInt(sharesRequired, 10),
        mediaFile: mediaUrl,
        mediaFileName: mediaFile ? mediaFile.name : '',
        shareType: shareType
      });
      
      toast.success('Gig created successfully using wallet balance!');
      navigate('/my-gigs');
    } catch (error) {
      console.error('Wallet payment error:', error);
      toast.error(error.response?.data?.message || 'Wallet payment failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handlePayPalOnApprove = async (data, actions) => {
    try {
      const captureDetails = await actions.order.capture();

      if (captureDetails.status !== 'COMPLETED') {
        toast.error('Payment not completed. Please try again.');
        return;
      }

      let mediaUrl = '';
      
      if (mediaFile) {
        mediaUrl = await uploadMedia();
      }

      const res = await axios.post('/api/gigs/paypal/capture', {
        orderId: data.orderID,
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        budget: parseFloat(budget),
        sharesRequired: parseInt(sharesRequired, 10),
        mediaFile: mediaUrl,
        mediaFileName: mediaFile ? mediaFile.name : '',
        shareType: shareType
      });

      if (res.data.success) {
        toast.success('Payment completed and gig created!');
        navigate('/my-gigs');
      } else {
        toast.error(res.data.message || 'Gig creation failed');
      }
    } catch (err) {
      console.error('PayPal capture error:', err);
      
      if (err.response?.data?.message?.includes('already processed')) {
        toast.success('Payment was already processed. Redirecting to your gigs...');
        navigate('/my-gigs');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Payment processing failed. Please try again.');
      }
    } finally {
      setUploadProgress(0);
    }
  };

  const amountPerShare = budget && sharesRequired ? (parseFloat(budget) / parseInt(sharesRequired, 10)).toFixed(2) : '0.00';
  const walletBalance = parseFloat(user?.walletBalance?.$numberDecimal || user?.walletBalance || 0);
const hasSufficientBalance = walletBalance >= parseFloat(budget || 0);
  console.log(user.walletBalance)
  console.log(hasSufficientBalance)
  const isImageFile = mediaFile && supportedImageTypes.includes(mediaFile.type);
  const isVideoFile = mediaFile && supportedVideoTypes.includes(mediaFile.type);

  const renderContentPreview = () => {
    if (isImageFile && previewUrl) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="relative rounded-lg overflow-hidden bg-white">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </div>
      );
    } else if (isVideoFile && previewUrl) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="relative rounded-lg overflow-hidden bg-white">
            <video
              src={previewUrl}
              className="w-full h-48 object-contain"
              controls
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </div>
      );
    } else if (link) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate">{link}</span>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Test Link
          </a>
        </div>
      );
    }
    return null;
  };

  // StatIconWrapper component matching GigDetail
  const StatIconWrapper = ({ color = 'blue', children }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };

    return (
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Matching GigDetail style */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'form' ? 'bg-blue-600 border-blue-600 text-white' : 
                'bg-white border-gray-300 text-gray-400'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Details</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${currentStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'preview' ? 'bg-blue-600 border-blue-600 text-white' : 
                currentStep === 'payment' ? 'bg-blue-600 border-blue-600 text-white' : 
                'bg-white border-gray-300 text-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Preview</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'payment' ? 'bg-blue-600 border-blue-600 text-white' : 
                'bg-white border-gray-300 text-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Gig</h1>
          <p className="text-gray-600">Promote your content and reach more people</p>
        </div>

        {/* Main Card - Matching GigDetail style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-8">
            {/* STEP 1: Form */}
            {currentStep === 'form' && (
              <form onSubmit={handleContinueToPreview} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                    Gig Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                      errors.title ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Enter a compelling title for your gig"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={description}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                      errors.description ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Describe what people need to share and any specific instructions..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Link */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
                    Link to Share *
                  </label>
                  <input
                    type="url"
                    name="link"
                    required
                    value={link}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                      errors.link ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/your-content"
                  />
                  {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
                </div>

                {/* Image/Video Upload */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <PhotoIcon className="w-5 h-5 text-gray-500 mr-2" />
                    Image or Video (Optional)
                  </label>
                  
                  {!mediaFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-500 hover:bg-gray-50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Choose Image or Video
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        Max 10MB. Images: JPEG, PNG, GIF, WebP. Videos: MP4, MOV, AVI, WebM
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 font-medium truncate">
                            {mediaFile.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-600">
                            ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {isImageFile ? 'Image' : isVideoFile ? 'Video' : 'File'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeMedia}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {previewUrl && (
                        <div className="relative rounded-lg overflow-hidden bg-white">
                          {isImageFile ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-48 object-contain"
                            />
                          ) : (
                            <video
                              src={previewUrl}
                              className="w-full h-48 object-contain"
                              controls
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.mediaFile && <p className="mt-1 text-sm text-red-600">{errors.mediaFile}</p>}
                </div>

                {/* Share Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Who can share this gig?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, shareType: 'public' }))}
                      className={`p-4 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center ${
                        shareType === 'public' 
                          ? 'border-green-500 bg-green-50 text-gray-900 shadow-sm' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <GlobeAltIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Public</span>
                      <p className="text-xs text-gray-500 mt-1">Anyone can share</p>
                      {shareType === 'public' && (
                        <div className="mt-2 text-xs text-green-600 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Selected
                        </div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, shareType: 'private' }))}
                      className={`p-4 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center ${
                        shareType === 'private' 
                          ? 'border-purple-500 bg-purple-50 text-gray-900 shadow-sm' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <LockClosedIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Private</span>
                      <p className="text-xs text-gray-500 mt-1">Only approved users</p>
                      {shareType === 'private' && (
                        <div className="mt-2 text-xs text-purple-600 flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                          Selected
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Current selection: <span className="font-semibold text-gray-700">{shareType}</span>
                  </div>
                </div>

                {/* Budget and Shares */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-gray-500 mr-2" />
                      Total Budget ($) *
                    </label>
                    <input
                      type="number"
                      name="budget"
                      min="15"
                      step="0.01"
                      required
                      value={budget}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                        errors.budget ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="15.00"
                    />
                    {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <ShareIcon className="w-5 h-5 text-gray-500 mr-2" />
                      Shares Required *
                    </label>
                    <input
                      type="number"
                      name="sharesRequired"
                      min="1"
                      required
                      value={sharesRequired}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                        errors.sharesRequired ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Number of shares needed"
                    />
                    {errors.sharesRequired && <p className="mt-1 text-sm text-red-600">{errors.sharesRequired}</p>}
                  </div>
                </div>

                {/* Cost Breakdown */}
                {budget && sharesRequired && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="text-sm font-semibold text-blue-800">Cost Breakdown</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-700">Total budget:</span>
                        <span className="font-semibold text-gray-900 ml-2">${parseFloat(budget).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Shares required:</span>
                        <span className="font-semibold text-gray-900 ml-2">{sharesRequired}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Cost per share:</span>
                        <span className="font-semibold text-green-600 ml-2">${amountPerShare}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Platform commission (6.5% + $2):</span>
                        <span className="font-semibold text-gray-900 ml-2">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
                      </div>
                    </div>
                    {parseFloat(amountPerShare) < 0.5 && (
                      <p className="text-xs text-red-600 mt-2">
                        Minimum amount per share is $0.50. Please increase your budget or reduce shares.
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Preview Gig
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Preview */}
            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Gig</h2>
                  <p className="text-gray-600">Review your gig before proceeding to payment</p>
                </div>

                {/* Gig Preview */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gig Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <p className="text-gray-900 mt-1">{title}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap">{description}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Link</label>
                      <p className="text-gray-900 mt-1">{link}</p>
                    </div>

                    {mediaFile && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {isImageFile ? 'Image' : 'Video'} Preview
                        </label>
                        <div className="mt-2">
                          {renderContentPreview()}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700">Share Type</label>
                      <div className="flex items-center mt-1">
                        {shareType === 'public' ? (
                          <>
                            <GlobeAltIcon className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-green-700 font-semibold">Public - Anyone can share</span>
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-purple-700 font-semibold">Private - Only approved users</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Budget</label>
                        <p className="text-gray-900 mt-1">${parseFloat(budget).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Shares Required</label>
                        <p className="text-gray-900 mt-1">{sharesRequired}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="text-sm font-semibold text-blue-800">Payment Summary</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Total budget:</span>
                          <span className="font-semibold text-gray-900">${parseFloat(budget).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Platform commission:</span>
                          <span className="font-semibold text-gray-900">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2">
                          <span className="text-gray-700">Amount per share:</span>
                          <span className="font-semibold text-green-600">${amountPerShare}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBackToForm}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Edit
                  </button>
                  
                  <button
                    onClick={handleContinueToPayment}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Continue to Payment
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 'payment' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl text-gray-900 font-semibold">Choose Payment Method</h2>
                  <p className="text-gray-600">Minimum amount is $15. Platform fee (6.5% + $2) is taken at creation.</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Gig type: <span className={`font-semibold ${shareType === 'public' ? 'text-green-600' : 'text-purple-600'}`}>
                      {shareType === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wallet Payment */}
                  <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-3">
                      <StatIconWrapper color="green">
                        <WalletIcon className="w-6 h-6 text-white" />
                      </StatIconWrapper>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">Pay with Wallet</h3>
                        <p className="text-sm text-gray-600">Balance: ${walletBalance}</p>
                      </div>
                    </div>
                
                    <div className="mt-4">
                      <button
                        onClick={handlePayWithWallet}
                        disabled={!hasSufficientBalance || loading}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          hasSufficientBalance 
                            ? 'bg-green-600 hover:bg-green-700 text-white transform hover:-translate-y-0.5' 
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                            Processing...
                          </>
                        ) : (
                          hasSufficientBalance ? 'Pay with Wallet' : 'Insufficient Balance'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PayPal Payment */}
                  <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-3">
                      <StatIconWrapper color="blue">
                        <CreditCardIcon className="w-6 h-6 text-white" />
                      </StatIconWrapper>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">Pay with PayPal</h3>
                        <p className="text-sm text-gray-600">Secure checkout via PayPal</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {hasPaypalConfig ? (
                        <PayPalScriptProvider 
                          options={paypalOptions}
                          deferLoading={false}
                        >
                          <PayPalButtons
                            style={{ 
                              layout: "vertical", 
                              color: "gold", 
                              shape: "rect", 
                              label: "paypal",
                              height: 45
                            }}
                            createOrder={async (data, actions) => {
                              try {
                                const res = await axios.post('/api/gigs/paypal/create-order', { 
                                  budget: parseFloat(budget) 
                                });
                                return res.data.data.orderId;
                              } catch (err) {
                                console.error('createOrder error', err);
                                toast.error('Unable to create PayPal order');
                                throw err;
                              }
                            }}
                            onApprove={handlePayPalOnApprove}
                            onError={(err) => {
                              console.error('PayPal buttons error:', err);
                              toast.error('PayPal checkout error');
                            }}
                            onCancel={(data) => {
                              console.log('PayPal checkout cancelled:', data);
                              toast.error('Payment cancelled');
                            }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm mb-2">
                            PayPal is not configured.
                          </p>
                          <p className="text-yellow-700 text-xs">
                            Add VITE_PAYPAL_CLIENT_ID to your .env file
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button 
                    onClick={() => setCurrentStep('preview')} 
                    className="text-blue-600 underline hover:text-blue-700 transition-colors duration-200"
                  >
                    Go back to preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;