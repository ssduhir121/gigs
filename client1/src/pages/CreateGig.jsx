// // src/pages/CreateGig.jsx
// import React, { useState } from 'react';
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
// } from '@heroicons/react/24/outline';
// import { GradientBackground, GlassCard, StatIconWrapper } from '../components/common/StyledComponents';

// const CreateGig = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     link: '',
//     budget: '',
//     sharesRequired: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPayment, setShowPayment] = useState(false);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const { title, description, link, budget, sharesRequired } = formData;

//   // Vite environment variables
//   const paypalOptions = {
//     "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
//     currency: "USD",
//     intent: "capture",
//     debug: true,
//   };

//   const hasPaypalConfig = !!import.meta.env.VITE_PAYPAL_CLIENT_ID;

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!title.trim()) newErrors.title = 'Title is required';
//     if (!description.trim()) newErrors.description = 'Description is required';
//     if (!link.trim()) newErrors.link = 'Link is required';
//     if (!budget || parseFloat(budget) < 15) newErrors.budget = 'Budget must be at least $15';
//     if (!sharesRequired || parseInt(sharesRequired, 10) < 1) newErrors.sharesRequired = 'At least 1 share is required';

//     // Validate URL format (comprehensive validation from old code)
//     if (link && !link.match(/^https?:\/\/.+\..+/)) {
//       newErrors.link = 'Please enter a valid URL';
//     }

//     // Validate minimum amount per share (from old code)
//     const amountPerShare = budget && sharesRequired ? parseFloat(budget) / parseInt(sharesRequired, 10) : 0;
//     if (amountPerShare < 0.5) {
//       newErrors.budget = 'Amount per share must be at least $0.50';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleContinue = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     setShowPayment(true);
//   };

//   // Wallet path
//   const handlePayWithWallet = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post('/api/gigs/create-with-wallet', {
//         title: title.trim(),
//         description: description.trim(),
//         link: link.trim(),
//         budget: parseFloat(budget),
//         sharesRequired: parseInt(sharesRequired, 10)
//       });
//       toast.success('Gig created successfully using wallet balance!');
//       navigate('/my-gigs');
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Wallet payment failed');
//     } finally {
//       setLoading(false);
//     }
//   };

// const handlePayPalOnApprove = async (data, actions) => {
//   console.log('🎯 PayPal onApprove triggered:', data);
  
//   try {
//     console.log('🔄 Capturing PayPal order...');
//     const captureDetails = await actions.order.capture();
//     console.log('✅ PayPal capture details:', captureDetails);

//     // Verify capture was successful
//     if (captureDetails.status !== 'COMPLETED') {
//       console.log('❌ PayPal capture not completed. Status:', captureDetails.status);
//       toast.error('Payment not completed. Please try again.');
//       return;
//     }

//     console.log('📤 Sending capture info to backend...', {
//       orderId: data.orderID, // ✅ Using data.orderID
//       title: title.trim(),
//       budget: parseFloat(budget),
//       sharesRequired: parseInt(sharesRequired, 10)
//     });

//     // Send capture info to your backend
//     const res = await axios.post('/api/gigs/paypal/capture', {
//       orderId: data.orderID, // ✅ FIXED: Use data.orderID instead of captureDetails.id
//       title: title.trim(),
//       description: description.trim(),
//       link: link.trim(),
//       budget: parseFloat(budget),
//       sharesRequired: parseInt(sharesRequired, 10)
//     });

//     console.log('✅ Backend response:', res.data);

//     if (res.data.success) {
//       toast.success('Payment completed and gig created!');
//       navigate('/my-gigs');
//     } else {
//       console.log('❌ Backend returned error:', res.data.message);
//       toast.error(res.data.message || 'Gig creation failed');
//     }
//   } catch (err) {
//     console.error('❌ PayPal capture error:', err);
//     console.error('Error response:', err.response?.data);
    
//     // Handle specific error cases
//     if (err.response?.data?.message?.includes('already processed')) {
//       toast.success('Payment was already processed. Redirecting to your gigs...');
//       navigate('/my-gigs');
//     } else if (err.response?.data?.message) {
//       toast.error(err.response.data.message);
//     } else {
//       toast.error('Payment processing failed. Please try again.');
//     }
//   }
// };


//   const amountPerShare = budget && sharesRequired ? (parseFloat(budget) / parseInt(sharesRequired, 10)).toFixed(2) : '0.00';
//   const hasSufficientBalance = user?.walletBalance >= parseFloat(budget || 0);

//   return (
//     <GradientBackground className="py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Create New Gig</h1>
//           <p className="text-gray-200">Promote your content and reach more people</p>
//         </div>

//         <GlassCard className="overflow-hidden">
//           <div className="px-6 py-8">
//             {!showPayment ? (
//               <form onSubmit={handleContinue} className="space-y-6">
//                 {/* Title */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Gig Title
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
//                     Description
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
//                     Link to Share
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

//                 {/* Budget and Shares */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                       <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
//                       Total Budget ($)
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
//                       Shares Required
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

//                 {/* Payment Info with Wallet Status */}
//                 <div className="bg-primary-400/20 border border-primary-400/30 rounded-lg p-4 backdrop-blur-sm">
//                   <div className="flex items-start">
//                     <InformationCircleIcon className="w-5 h-5 text-primary-300 mr-2 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-primary-300 font-medium mb-1">Payment Information</p>
//                       <p className="text-sm text-primary-200 mb-2">
//                         {hasSufficientBalance ? (
//                           <>You have sufficient balance (${Number(user?.walletBalance || 0).toFixed(2)}) to pay for this gig. You can choose to pay with wallet or PayPal.</>
//                         ) : (
//                           <>Your wallet balance (${Number(user?.walletBalance || 0).toFixed(2)}) is insufficient. You'll need to pay with PayPal.</>
//                         )}
//                       </p>
//                       <p className="text-sm text-primary-200">
//                         Funds are held in escrow and only released when shares are completed.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="submit"
//                     className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
//                   >
//                     Continue to Payment
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div>
//                 <div className="text-center mb-6">
//                   <h2 className="text-xl text-white font-semibold">Choose Payment Method</h2>
//                   <p className="text-gray-300">Minimum amount is $15. Platform fee (6.5% + $2) is taken at creation.</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Wallet */}
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

//                   {/* PayPal - Simplified Version */}
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
//                           <details className="mt-2 text-left">
//                             <summary className="text-yellow-200 text-xs cursor-pointer">Debug Info</summary>
//                             <pre className="text-yellow-200 text-xs mt-1 whitespace-pre-wrap">
//                               Current Client ID: {import.meta.env.VITE_PAYPAL_CLIENT_ID || 'NOT FOUND'}
//                             </pre>
//                           </details>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-center mt-6">
//                   <button 
//                     onClick={() => setShowPayment(false)} 
//                     className="text-gray-300 underline hover:text-white transition-colors duration-200"
//                   >
//                     Go back to form
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
} from '@heroicons/react/24/outline';
import { GradientBackground, GlassCard, StatIconWrapper } from '../components/common/StyledComponents';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    budget: '',
    sharesRequired: '',
    contentType: 'link',
    mediaFile: null
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'preview', 'payment'
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { title, description, link, budget, sharesRequired, contentType, mediaFile } = formData;

  // Vite environment variables
  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: "USD",
    intent: "capture",
    debug: true,
  };

  const hasPaypalConfig = !!import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Supported file types
  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const supportedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const onContentTypeChange = (type) => {
    setFormData({ 
      ...formData, 
      contentType: type,
      mediaFile: null,
      link: type === 'link' ? link : ''
    });
    setPreviewUrl('');
    setErrors({ ...errors, mediaFile: '' });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ ...errors, mediaFile: 'File size must be less than 10MB' });
      return;
    }

    if (contentType === 'image' && !supportedImageTypes.includes(file.type)) {
      setErrors({ ...errors, mediaFile: 'Please select a valid image (JPEG, PNG, GIF, WebP)' });
      return;
    }

    if (contentType === 'video' && !supportedVideoTypes.includes(file.type)) {
      setErrors({ ...errors, mediaFile: 'Please select a valid video (MP4, MOV, AVI, WebM)' });
      return;
    }

    setFormData({ ...formData, mediaFile: file });
    setErrors({ ...errors, mediaFile: '' });

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
    
    if (contentType === 'link' && !link.trim()) {
      newErrors.link = 'Link is required';
    } else if (contentType === 'link' && link && !link.match(/^https?:\/\/.+\..+/)) {
      newErrors.link = 'Please enter a valid URL';
    } else if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      newErrors.mediaFile = `${contentType === 'image' ? 'Image' : 'Video'} is required`;
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

  const uploadMedia = async () => {
    if (!mediaFile) return null;

    const formData = new FormData();
    formData.append('file', mediaFile);
    formData.append('type', contentType);

    try {
      const response = await axios.post('/api/upload/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      setUploadProgress(100);
      return response.data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media file');
      throw error;
    }
  };

  // Wallet path
  const handlePayWithWallet = async () => {
    setLoading(true);
    try {
      let mediaUrl = '';
      
      if (contentType !== 'link' && mediaFile) {
        mediaUrl = await uploadMedia();
      }

      const res = await axios.post('/api/gigs/create-with-wallet', {
        title: title.trim(),
        description: description.trim(),
        link: contentType === 'link' ? link.trim() : mediaUrl,
        budget: parseFloat(budget),
        sharesRequired: parseInt(sharesRequired, 10),
        contentType: contentType,
        mediaFileName: mediaFile ? mediaFile.name : ''
      });
      
      toast.success('Gig created successfully using wallet balance!');
      navigate('/my-gigs');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Wallet payment failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handlePayPalOnApprove = async (data, actions) => {
    console.log('🎯 PayPal onApprove triggered:', data);
    
    try {
      console.log('🔄 Capturing PayPal order...');
      const captureDetails = await actions.order.capture();
      console.log('✅ PayPal capture details:', captureDetails);

      if (captureDetails.status !== 'COMPLETED') {
        console.log('❌ PayPal capture not completed. Status:', captureDetails.status);
        toast.error('Payment not completed. Please try again.');
        return;
      }

      let mediaUrl = '';
      
      if (contentType !== 'link' && mediaFile) {
        mediaUrl = await uploadMedia();
      }

      console.log('📤 Sending capture info to backend...', {
        orderId: data.orderID,
        title: title.trim(),
        budget: parseFloat(budget),
        sharesRequired: parseInt(sharesRequired, 10),
        contentType: contentType
      });

      const res = await axios.post('/api/gigs/paypal/capture', {
        orderId: data.orderID,
        title: title.trim(),
        description: description.trim(),
        link: contentType === 'link' ? link.trim() : mediaUrl,
        budget: parseFloat(budget),
        sharesRequired: parseInt(sharesRequired, 10),
        contentType: contentType,
        mediaFileName: mediaFile ? mediaFile.name : ''
      });

      console.log('✅ Backend response:', res.data);

      if (res.data.success) {
        toast.success('Payment completed and gig created!');
        navigate('/my-gigs');
      } else {
        console.log('❌ Backend returned error:', res.data.message);
        toast.error(res.data.message || 'Gig creation failed');
      }
    } catch (err) {
      console.error('❌ PayPal capture error:', err);
      console.error('Error response:', err.response?.data);
      
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
  const hasSufficientBalance = user?.walletBalance >= parseFloat(budget || 0);

  // Render content preview based on type
  const renderContentPreview = () => {
    switch (contentType) {
      case 'link':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            <div className="flex items-center">
              <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300 truncate">{link}</span>
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Test Link
            </a>
          </div>
        );

      case 'image':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden bg-black/20">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-contain"
                />
              </div>
            )}
            <p className="text-sm text-gray-300 mt-2">
              {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
        );

      case 'video':
        return (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden bg-black/20">
                <video
                  src={previewUrl}
                  className="w-full h-48 object-contain"
                  controls
                />
              </div>
            )}
            <p className="text-sm text-gray-300 mt-2">
              {mediaFile?.name} ({(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <GradientBackground className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'form' ? 'text-primary-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'form' ? 'bg-primary-600 text-white' : 'bg-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm">Details</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-600"></div>
            
            <div className={`flex items-center ${currentStep === 'preview' ? 'text-primary-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'preview' ? 'bg-primary-600 text-white' : 
                currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm">Preview</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-600"></div>
            
            <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Gig</h1>
          <p className="text-gray-200">Promote your content and reach more people</p>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="px-6 py-8">
            {/* STEP 1: Form */}
            {currentStep === 'form' && (
              <form onSubmit={handleContinueToPreview} className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Content Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => onContentTypeChange('link')}
                      className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                        contentType === 'link' 
                          ? 'border-primary-500 bg-primary-500/20 text-white' 
                          : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <LinkIcon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Website Link</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onContentTypeChange('image')}
                      className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                        contentType === 'image' 
                          ? 'border-primary-500 bg-primary-500/20 text-white' 
                          : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <PhotoIcon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Image</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onContentTypeChange('video')}
                      className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                        contentType === 'video' 
                          ? 'border-primary-500 bg-primary-500/20 text-white' 
                          : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <VideoCameraIcon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Video</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                    Gig Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                      errors.title ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="Enter a compelling title for your gig"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-300">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={description}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                      errors.description ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="Describe what people need to share and any specific instructions..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-300">{errors.description}</p>}
                </div>

                {/* Content Input - Dynamic based on type */}
                {contentType === 'link' && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                      <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
                      Link to Share
                    </label>
                    <input
                      type="url"
                      name="link"
                      required
                      value={link}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                        errors.link ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="https://example.com/your-content"
                    />
                    {errors.link && <p className="mt-1 text-sm text-red-300">{errors.link}</p>}
                  </div>
                )}

                {(contentType === 'image' || contentType === 'video') && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                      {contentType === 'image' ? (
                        <PhotoIcon className="w-5 h-5 text-gray-400 mr-2" />
                      ) : (
                        <VideoCameraIcon className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      {contentType === 'image' ? 'Image to Share' : 'Video to Share'}
                    </label>
                    
                    {!mediaFile ? (
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center transition-all duration-200 hover:border-primary-500/50 hover:bg-white/5">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={contentType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Choose {contentType === 'image' ? 'Image' : 'Video'}
                        </button>
                        <p className="mt-2 text-sm text-gray-400">
                          Max 10MB. {contentType === 'image' ? 'JPEG, PNG, GIF, WebP' : 'MP4, MOV, AVI, WebM'}
                        </p>
                      </div>
                    ) : (
                      <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-sm text-white font-medium truncate">
                              {mediaFile.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={removeMedia}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {previewUrl && (
                          <div className="relative rounded-lg overflow-hidden bg-black/20">
                            {contentType === 'image' ? (
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
                    
                    {errors.mediaFile && <p className="mt-1 text-sm text-red-300">{errors.mediaFile}</p>}
                  </div>
                )}

                {/* Budget and Shares */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
                      Total Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      min="15"
                      step="0.01"
                      required
                      value={budget}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                        errors.budget ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="15.00"
                    />
                    {errors.budget && <p className="mt-1 text-sm text-red-300">{errors.budget}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-200 mb-2">
                      <ShareIcon className="w-5 h-5 text-gray-400 mr-2" />
                      Shares Required
                    </label>
                    <input
                      type="number"
                      name="sharesRequired"
                      min="1"
                      required
                      value={sharesRequired}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                        errors.sharesRequired ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Number of shares needed"
                    />
                    {errors.sharesRequired && <p className="mt-1 text-sm text-red-300">{errors.sharesRequired}</p>}
                  </div>
                </div>

                {/* Cost Breakdown */}
                {budget && sharesRequired && (
                  <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2" />
                      <h4 className="text-sm font-semibold text-blue-300">Cost Breakdown</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-300">Total budget:</span>
                        <span className="font-semibold text-white ml-2">${parseFloat(budget).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Shares required:</span>
                        <span className="font-semibold text-white ml-2">{sharesRequired}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Cost per share:</span>
                        <span className="font-semibold text-green-300 ml-2">${amountPerShare}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Platform commission (6.5% + $2):</span>
                        <span className="font-semibold text-white ml-2">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
                      </div>
                    </div>
                    {parseFloat(amountPerShare) < 0.5 && (
                      <p className="text-xs text-red-300 mt-2">
                        Minimum amount per share is $0.50. Please increase your budget or reduce shares.
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
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
                  <h2 className="text-2xl font-bold text-white mb-2">Preview Your Gig</h2>
                  <p className="text-gray-300">Review your gig before proceeding to payment</p>
                </div>

                {/* Gig Preview */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Gig Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Title</label>
                      <p className="text-white mt-1">{title}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Description</label>
                      <p className="text-white mt-1 whitespace-pre-wrap">{description}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Content Type</label>
                      <p className="text-white mt-1 capitalize">{contentType}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Content Preview</label>
                      <div className="mt-2">
                        {renderContentPreview()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Budget</label>
                        <p className="text-white mt-1">${parseFloat(budget).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Shares Required</label>
                        <p className="text-white mt-1">{sharesRequired}</p>
                      </div>
                    </div>

                    <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-300 mr-2" />
                        <h4 className="text-sm font-semibold text-blue-300">Payment Summary</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Total budget:</span>
                          <span className="font-semibold text-white">${parseFloat(budget).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Platform commission:</span>
                          <span className="font-semibold text-white">${(parseFloat(budget) * 0.065 + 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-400/30 pt-2">
                          <span className="text-gray-300">Amount per share:</span>
                          <span className="font-semibold text-green-300">${amountPerShare}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBackToForm}
                    className="inline-flex items-center px-6 py-3 border border-white/20 text-base font-medium rounded-lg text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Edit
                  </button>
                  
                  <button
                    onClick={handleContinueToPayment}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Continue to Payment
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment (same as before) */}
            {currentStep === 'payment' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl text-white font-semibold">Choose Payment Method</h2>
                  <p className="text-gray-300">Minimum amount is $15. Platform fee (6.5% + $2) is taken at creation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wallet Payment */}
                  <div className="p-6 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center mb-3">
                      <StatIconWrapper color="green">
                        <WalletIcon className="w-6 h-6 text-white" />
                      </StatIconWrapper>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-white">Pay with Wallet</h3>
                        <p className="text-sm text-gray-300">Balance: ${Number(user?.walletBalance || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={handlePayWithWallet}
                        disabled={!hasSufficientBalance || loading}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          hasSufficientBalance 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transform hover:-translate-y-0.5' 
                            : 'bg-gray-600 cursor-not-allowed text-gray-300'
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
                  <div className="p-6 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center mb-3">
                      <StatIconWrapper color="blue">
                        <CreditCardIcon className="w-6 h-6 text-white" />
                      </StatIconWrapper>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-white">Pay with PayPal</h3>
                        <p className="text-sm text-gray-300">Secure checkout via PayPal</p>
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
                                console.log('Creating PayPal order...');
                                const res = await axios.post('/api/gigs/paypal/create-order', { 
                                  budget: parseFloat(budget) 
                                });
                                console.log('Order created:', res.data.data.orderId);
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
                        <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-300 text-sm mb-2">
                            PayPal is not configured.
                          </p>
                          <p className="text-yellow-200 text-xs">
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
                    className="text-gray-300 underline hover:text-white transition-colors duration-200"
                  >
                    Go back to preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </GradientBackground>
  );
};

export default CreateGig;