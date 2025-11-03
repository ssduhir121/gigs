

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext';
// import { 
//   DocumentTextIcon, 
//   LinkIcon, 
//   CurrencyDollarIcon,
//   ShareIcon,
//   InformationCircleIcon,
//   CreditCardIcon,
//   LockClosedIcon,
//   WalletIcon
// } from '@heroicons/react/24/outline';

// // Stripe Elements
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';

// // Initialize Stripe
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// // Payment Form Component
// const CheckoutForm = ({ gigData, onSuccess, onCancel }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setProcessing(true);

//     try {
//       const cardElement = elements.getElement(CardElement);

//       const { error, paymentIntent } = await stripe.confirmCardPayment(gigData.clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: gigData.gigTitle,
//           },
//         },
//       });

//       if (error) {
//         toast.error(error.message);
//         setProcessing(false);
//       } else if (paymentIntent.status === 'succeeded') {
//         toast.success('Payment successful! Your gig is now active.');
//         onSuccess();
//       }
//     } catch (error) {
//       toast.error('Payment failed. Please try again.');
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       <div className="flex items-center mb-4">
//         <CreditCardIcon className="w-6 h-6 text-gray-400 mr-2" />
//         <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Card Details
//           </label>
//           <div className="border border-gray-300 rounded-lg p-3 bg-white">
//             <CardElement
//               options={{
//                 style: {
//                   base: {
//                     fontSize: '16px',
//                     color: '#424770',
//                     '::placeholder': {
//                       color: '#aab7c4',
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-gray-50 rounded-lg p-4">
//           <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Summary</h4>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Gig:</span>
//               <span className="font-medium">{gigData.gigTitle}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Total Budget:</span>
//               <span className="font-medium">${gigData.budget}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Shares:</span>
//               <span className="font-medium">{gigData.sharesRequired}</span>
//             </div>
//             <div className="flex justify-between border-t border-gray-200 pt-2">
//               <span className="text-gray-800 font-semibold">Total:</span>
//               <span className="text-green-600 font-semibold">${gigData.budget}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={processing}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={!stripe || processing}
//             className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
//           >
//             {processing ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <LockClosedIcon className="w-4 h-4 mr-2" />
//                 Pay ${gigData.budget}
//               </>
//             )}
//           </button>
//         </div>

//         <div className="flex items-center justify-center text-xs text-gray-500">
//           <LockClosedIcon className="w-3 h-3 mr-1" />
//           Payments are secure and encrypted
//         </div>
//       </form>
//     </div>
//   );
// };

// // Wallet Payment Component
// const WalletPayment = ({ gigData, onSuccess, onCancel }) => {
//   const [processing, setProcessing] = useState(false);
//   const { user, updateUserBalance } = useAuth();

//   const handleWalletPayment = async () => {
//     setProcessing(true);
    
//     try {
//       const res = await axios.post('/api/gigs/create-with-wallet', {
//         title: gigData.gigTitle,
//         description: gigData.description,
//         link: gigData.link,
//         budget: parseFloat(gigData.budget),
//         sharesRequired: parseInt(gigData.sharesRequired)
//       });

//       // Update local user balance
//       updateUserBalance(res.data.newBalance);
      
//       toast.success('Gig created successfully using wallet balance!');
//       onSuccess();
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Payment failed';
//       toast.error(errorMessage);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       <div className="flex items-center mb-4">
//         <WalletIcon className="w-6 h-6 text-green-500 mr-2" />
//         <h3 className="text-lg font-semibold text-gray-900">Pay with Wallet</h3>
//       </div>

//       <div className="space-y-4">
//         {/* Balance Info */}
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium text-green-800">Your Balance:</span>
//             <span className="text-lg font-bold text-green-600">${user?.walletBalance?.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between items-center mt-2">
//             <span className="text-sm font-medium text-green-800">Amount to Pay:</span>
//             <span className="text-lg font-bold text-green-600">${gigData.budget}</span>
//           </div>
//           <div className="flex justify-between items-center mt-2 border-t border-green-200 pt-2">
//             <span className="text-sm font-medium text-green-800">Remaining Balance:</span>
//             <span className="text-lg font-bold text-green-600">
//               ${(user?.walletBalance - parseFloat(gigData.budget)).toFixed(2)}
//             </span>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-gray-50 rounded-lg p-4">
//           <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Summary</h4>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Gig:</span>
//               <span className="font-medium">{gigData.gigTitle}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Total Budget:</span>
//               <span className="font-medium">${gigData.budget}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Shares:</span>
//               <span className="font-medium">{gigData.sharesRequired}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={processing}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleWalletPayment}
//             disabled={processing}
//             className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
//           >
//             {processing ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <WalletIcon className="w-4 h-4 mr-2" />
//                 Pay with Wallet
//               </>
//             )}
//           </button>
//         </div>

//         <div className="text-center text-xs text-gray-500">
//           Instant payment from your wallet balance
//         </div>
//       </div>
//     </div>
//   );
// };

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
//   const [paymentData, setPaymentData] = useState(null);
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState(null); // 'wallet' or 'stripe'
//   const { user } = useAuth();

//   const navigate = useNavigate();

//   const { title, description, link, budget, sharesRequired } = formData;

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
//     if (!budget || parseFloat(budget) < 1) newErrors.budget = 'Budget must be at least $1';
//     if (!sharesRequired || parseInt(sharesRequired) < 1) newErrors.sharesRequired = 'At least 1 share is required';

//     // Validate URL format
//     if (link && !link.match(/^https?:\/\/.+\..+/)) {
//       newErrors.link = 'Please enter a valid URL';
//     }

//     // Validate minimum amount per share
//     const amountPerShare = budget && sharesRequired ? parseFloat(budget) / parseInt(sharesRequired) : 0;
//     if (amountPerShare < 0.5) {
//       newErrors.budget = 'Amount per share must be at least $0.50';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     const totalAmount = parseFloat(budget);
//     const hasSufficientBalance = user?.walletBalance >= totalAmount;

//     // Prepare gig data
//     const gigData = {
//       gigTitle: title,
//       description: description,
//       link: link,
//       budget: totalAmount.toFixed(2),
//       sharesRequired: sharesRequired
//     };

//     if (hasSufficientBalance) {
//       // Show payment method selection
//       setPaymentData(gigData);
//       setShowPayment(true);
//     } else {
//       // Proceed directly to Stripe payment
//       await createGigWithStripe(gigData);
//     }
//   };

//   const createGigWithStripe = async (gigData) => {
//     setLoading(true);

//     try {
//       const res = await axios.post('/api/gigs', {
//         title: gigData.gigTitle.trim(),
//         description: gigData.description.trim(),
//         link: gigData.link.trim(),
//         budget: parseFloat(gigData.budget),
//         sharesRequired: parseInt(gigData.sharesRequired)
//       });

//       if (res.data.clientSecret) {
//         setPaymentData({
//           ...gigData,
//           clientSecret: res.data.clientSecret
//         });
//         setPaymentMethod('stripe');
//         setShowPayment(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Error creating gig';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = () => {
//     toast.success('Gig created successfully!');
//     setTimeout(() => navigate('/my-gigs'), 2000);
//   };

//   const handlePaymentCancel = () => {
//     setShowPayment(false);
//     setPaymentData(null);
//     setPaymentMethod(null);
//     toast.info('Payment cancelled. You can try again.');
//   };

//   const handlePaymentMethodSelect = (method) => {
//     setPaymentMethod(method);
//     if (method === 'wallet') {
//       // Wallet payment will be handled in WalletPayment component
//     } else {
//       createGigWithStripe(paymentData);
//     }
//   };

//   const amountPerShare = budget && sharesRequired ? (parseFloat(budget) / parseInt(sharesRequired)).toFixed(2) : 0;
//   const hasSufficientBalance = user?.walletBalance >= parseFloat(budget || 0);

//   if (showPayment && paymentData) {
//     // Payment method selection screen
//     if (!paymentMethod && hasSufficientBalance) {
//       return (
//         <div className="min-h-screen bg-gray-50 py-8">
//           <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Payment Method</h1>
//               <p className="text-gray-600">Select how you'd like to pay for your gig</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Wallet Payment Option */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
//                    onClick={() => handlePaymentMethodSelect('wallet')}>
//                 <div className="flex items-center mb-4">
//                   <WalletIcon className="w-8 h-8 text-green-500 mr-3" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
//                     <p className="text-sm text-gray-600">Use your available balance</p>
//                   </div>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-green-700">Your Balance:</span>
//                     <span className="font-semibold text-green-700">${user?.walletBalance?.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm mt-1">
//                     <span className="text-green-700">Cost:</span>
//                     <span className="font-semibold text-green-700">${paymentData.budget}</span>
//                   </div>
//                 </div>
//                 <div className="mt-4 text-center">
//                   <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
//                     Pay with Wallet
//                   </button>
//                 </div>
//               </div>

//               {/* Stripe Payment Option */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
//                    onClick={() => handlePaymentMethodSelect('stripe')}>
//                 <div className="flex items-center mb-4">
//                   <CreditCardIcon className="w-8 h-8 text-blue-500 mr-3" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Credit Card</h3>
//                     <p className="text-sm text-gray-600">Pay with card</p>
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-3">
//                   <div className="text-sm text-blue-700">
//                     Secure payment processed by Stripe
//                   </div>
//                 </div>
//                 <div className="mt-4 text-center">
//                   <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
//                     Pay with Card
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="text-center mt-6">
//               <button
//                 onClick={handlePaymentCancel}
//                 className="text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // Actual payment screens
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {paymentMethod === 'wallet' ? 'Pay with Wallet' : 'Complete Payment'}
//             </h1>
//             <p className="text-gray-600">Almost done! Complete payment to activate your gig.</p>
//           </div>

//           {paymentMethod === 'wallet' ? (
//             <WalletPayment 
//               gigData={paymentData}
//               onSuccess={handlePaymentSuccess}
//               onCancel={handlePaymentCancel}
//             />
//           ) : (
//             <Elements stripe={stripePromise}>
//               <CheckoutForm 
//                 gigData={paymentData}
//                 onSuccess={handlePaymentSuccess}
//                 onCancel={handlePaymentCancel}
//               />
//             </Elements>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Gig</h1>
//           <p className="text-gray-600">Promote your content and reach more people</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="px-6 py-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Title */}
//               <div>
//                 <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
//                   Gig Title
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   id="title"
//                   required
//                   value={title}
//                   onChange={onChange}
//                   className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                     errors.title ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter a compelling title for your gig"
//                 />
//                 {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
//               </div>

//               {/* Description */}
//               <div>
//                 <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   id="description"
//                   rows={4}
//                   required
//                   value={description}
//                   onChange={onChange}
//                   className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                     errors.description ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Describe what people need to share and any specific instructions..."
//                 />
//                 {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//               </div>

//               {/* Link */}
//               <div>
//                 <label htmlFor="link" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
//                   Link to Share
//                 </label>
//                 <input
//                   type="url"
//                   name="link"
//                   id="link"
//                   required
//                   value={link}
//                   onChange={onChange}
//                   className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                     errors.link ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="https://example.com/your-content"
//                 />
//                 {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
//               </div>

//               {/* Budget and Shares */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Total Budget ($)
//                   </label>
//                   <input
//                     type="number"
//                     name="budget"
//                     id="budget"
//                     min="1"
//                     step="0.01"
//                     required
//                     value={budget}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                       errors.budget ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="0.00"
//                   />
//                   {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
//                 </div>

//                 <div>
//                   <label htmlFor="sharesRequired" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <ShareIcon className="w-5 h-5 text-gray-400 mr-2" />
//                     Shares Required
//                   </label>
//                   <input
//                     type="number"
//                     name="sharesRequired"
//                     id="sharesRequired"
//                     min="1"
//                     required
//                     value={sharesRequired}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                       errors.sharesRequired ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Number of shares needed"
//                   />
//                   {errors.sharesRequired && <p className="mt-1 text-sm text-red-600">{errors.sharesRequired}</p>}
//                 </div>
//               </div>

//               {/* Cost Breakdown */}
//               {budget && sharesRequired && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <div className="flex items-center mb-2">
//                     <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
//                     <h4 className="text-sm font-semibold text-blue-900">Cost Breakdown</h4>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-600">Total budget:</span>
//                       <span className="font-semibold ml-2">${parseFloat(budget).toFixed(2)}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Shares required:</span>
//                       <span className="font-semibold ml-2">{sharesRequired}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Cost per share:</span>
//                       <span className="font-semibold text-green-600 ml-2">${amountPerShare}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">You'll pay:</span>
//                       <span className="font-semibold ml-2">${parseFloat(budget).toFixed(2)}</span>
//                     </div>
//                   </div>
//                   {parseFloat(amountPerShare) < 0.5 && (
//                     <p className="text-xs text-red-600 mt-2">
//                       Minimum amount per share is $0.50. Please increase your budget or reduce shares.
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Payment Info with Wallet Status */}
//               <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
//                 <div className="flex items-start">
//                   <InformationCircleIcon className="w-5 h-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-primary-800 font-medium mb-1">Payment Information</p>
//                     <p className="text-sm text-primary-700 mb-2">
//                       {hasSufficientBalance ? (
//                         <>You have sufficient balance (${user?.walletBalance?.toFixed(2)}) to pay for this gig. You can choose to pay with wallet or card.</>
//                       ) : (
//                         <>Your wallet balance (${user?.walletBalance?.toFixed(2)}) is insufficient. You'll need to pay with card.</>
//                       )}
//                     </p>
//                     <p className="text-sm text-primary-700">
//                       Funds are held in escrow and only released when shares are completed.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Creating Gig...
//                     </>
//                   ) : hasSufficientBalance ? (
//                     'Continue to Payment'
//                   ) : (
//                     'Create Gig & Pay with Card'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateGig;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  DocumentTextIcon, 
  LinkIcon, 
  CurrencyDollarIcon,
  ShareIcon,
  InformationCircleIcon,
  CreditCardIcon,
  LockClosedIcon,
  WalletIcon
} from '@heroicons/react/24/outline';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

// Stripe Elements
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const CheckoutForm = ({ gigData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(gigData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: gigData.gigTitle,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Your gig is now active.');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center mb-4">
        <StatIconWrapper color="blue">
          <CreditCardIcon className="w-6 h-6 text-white" />
        </StatIconWrapper>
        <h3 className="text-lg font-semibold text-white ml-3">Complete Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Card Details
          </label>
          <div className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <h4 className="text-sm font-semibold text-white mb-2">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Gig:</span>
              <span className="font-medium text-white">{gigData.gigTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Budget:</span>
              <span className="font-medium text-white">${gigData.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Shares:</span>
              <span className="font-medium text-white">{gigData.sharesRequired}</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-2">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-green-300 font-semibold">${gigData.budget}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 px-4 py-3 border border-white/30 text-gray-200 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Pay ${gigData.budget}
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-400">
          <LockClosedIcon className="w-3 h-3 mr-1" />
          Payments are secure and encrypted
        </div>
      </form>
    </GlassCard>
  );
};

// Wallet Payment Component
const WalletPayment = ({ gigData, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const { user, updateUserBalance } = useAuth();

  const handleWalletPayment = async () => {
    setProcessing(true);
    
    try {
      const res = await axios.post('/api/gigs/create-with-wallet', {
        title: gigData.gigTitle,
        description: gigData.description,
        link: gigData.link,
        budget: parseFloat(gigData.budget),
        sharesRequired: parseInt(gigData.sharesRequired)
      });

      // Update local user balance
      updateUserBalance(res.data.newBalance);
      
      toast.success('Gig created successfully using wallet balance!');
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Payment failed';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center mb-4">
        <StatIconWrapper color="green">
          <WalletIcon className="w-6 h-6 text-white" />
        </StatIconWrapper>
        <h3 className="text-lg font-semibold text-white ml-3">Pay with Wallet</h3>
      </div>

      <div className="space-y-4">
        {/* Balance Info */}
        <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-300">Your Balance:</span>
            <span className="text-lg font-bold text-green-300">${user?.walletBalance?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-green-300">Amount to Pay:</span>
            <span className="text-lg font-bold text-green-300">${gigData.budget}</span>
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-green-400/30 pt-2">
            <span className="text-sm font-medium text-green-300">Remaining Balance:</span>
            <span className="text-lg font-bold text-green-300">
              ${(user?.walletBalance - parseFloat(gigData.budget)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <h4 className="text-sm font-semibold text-white mb-2">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Gig:</span>
              <span className="font-medium text-white">{gigData.gigTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Budget:</span>
              <span className="font-medium text-white">${gigData.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Shares:</span>
              <span className="font-medium text-white">{gigData.sharesRequired}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 px-4 py-3 border border-white/30 text-gray-200 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleWalletPayment}
            disabled={processing}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <WalletIcon className="w-4 h-4 mr-2" />
                Pay with Wallet
              </>
            )}
          </button>
        </div>

        <div className="text-center text-xs text-gray-400">
          Instant payment from your wallet balance
        </div>
      </div>
    </GlassCard>
  );
};

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    budget: '',
    sharesRequired: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentData, setPaymentData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'wallet' or 'stripe'
  const { user } = useAuth();

  const navigate = useNavigate();

  const { title, description, link, budget, sharesRequired } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!link.trim()) newErrors.link = 'Link is required';
    if (!budget || parseFloat(budget) < 1) newErrors.budget = 'Budget must be at least $1';
    if (!sharesRequired || parseInt(sharesRequired) < 1) newErrors.sharesRequired = 'At least 1 share is required';

    // Validate URL format
    if (link && !link.match(/^https?:\/\/.+\..+/)) {
      newErrors.link = 'Please enter a valid URL';
    }

    // Validate minimum amount per share
    const amountPerShare = budget && sharesRequired ? parseFloat(budget) / parseInt(sharesRequired) : 0;
    if (amountPerShare < 0.5) {
      newErrors.budget = 'Amount per share must be at least $0.50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const totalAmount = parseFloat(budget);
    const hasSufficientBalance = user?.walletBalance >= totalAmount;

    // Prepare gig data
    const gigData = {
      gigTitle: title,
      description: description,
      link: link,
      budget: totalAmount.toFixed(2),
      sharesRequired: sharesRequired
    };

    if (hasSufficientBalance) {
      // Show payment method selection
      setPaymentData(gigData);
      setShowPayment(true);
    } else {
      // Proceed directly to Stripe payment
      await createGigWithStripe(gigData);
    }
  };

  const createGigWithStripe = async (gigData) => {
    setLoading(true);

    try {
      const res = await axios.post('/api/gigs', {
        title: gigData.gigTitle.trim(),
        description: gigData.description.trim(),
        link: gigData.link.trim(),
        budget: parseFloat(gigData.budget),
        sharesRequired: parseInt(gigData.sharesRequired)
      });

      if (res.data.clientSecret) {
        setPaymentData({
          ...gigData,
          clientSecret: res.data.clientSecret
        });
        setPaymentMethod('stripe');
        setShowPayment(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating gig';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Gig created successfully!');
    setTimeout(() => navigate('/my-gigs'), 2000);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPaymentData(null);
    setPaymentMethod(null);
    toast.info('Payment cancelled. You can try again.');
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'wallet') {
      // Wallet payment will be handled in WalletPayment component
    } else {
      createGigWithStripe(paymentData);
    }
  };

  const amountPerShare = budget && sharesRequired ? (parseFloat(budget) / parseInt(sharesRequired)).toFixed(2) : 0;
  const hasSufficientBalance = user?.walletBalance >= parseFloat(budget || 0);

  if (showPayment && paymentData) {
    // Payment method selection screen
    if (!paymentMethod && hasSufficientBalance) {
      return (
        <GradientBackground className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Choose Payment Method</h1>
              <p className="text-gray-200">Select how you'd like to pay for your gig</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Payment Option */}
              <GlassCard 
                hover={true}
                className="p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => handlePaymentMethodSelect('wallet')}
              >
                <div className="flex items-center mb-4">
                  <StatIconWrapper color="green">
                    <WalletIcon className="w-6 h-6 text-white" />
                  </StatIconWrapper>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
                    <p className="text-sm text-gray-200">Use your available balance</p>
                  </div>
                </div>
                <div className="bg-green-400/20 rounded-lg p-3 border border-green-400/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-300">Your Balance:</span>
                    <span className="font-semibold text-green-300">${user?.walletBalance?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-green-300">Cost:</span>
                    <span className="font-semibold text-green-300">${paymentData.budget}</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
                    Pay with Wallet
                  </button>
                </div>
              </GlassCard>

              {/* Stripe Payment Option */}
              <GlassCard 
                hover={true}
                className="p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => handlePaymentMethodSelect('stripe')}
              >
                <div className="flex items-center mb-4">
                  <StatIconWrapper color="blue">
                    <CreditCardIcon className="w-6 h-6 text-white" />
                  </StatIconWrapper>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">Credit Card</h3>
                    <p className="text-sm text-gray-200">Pay with card</p>
                  </div>
                </div>
                <div className="bg-blue-400/20 rounded-lg p-3 border border-blue-400/30">
                  <div className="text-sm text-blue-300">
                    Secure payment processed by Stripe
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                    Pay with Card
                  </button>
                </div>
              </GlassCard>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handlePaymentCancel}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </GradientBackground>
      );
    }

    // Actual payment screens
    return (
      <GradientBackground className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {paymentMethod === 'wallet' ? 'Pay with Wallet' : 'Complete Payment'}
            </h1>
            <p className="text-gray-200">Almost done! Complete payment to activate your gig.</p>
          </div>

          {paymentMethod === 'wallet' ? (
            <WalletPayment 
              gigData={paymentData}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                gigData={paymentData}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </Elements>
          )}
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Gig</h1>
          <p className="text-gray-200">Promote your content and reach more people</p>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Gig Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
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
                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={description}
                  onChange={onChange}
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                    errors.description ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Describe what people need to share and any specific instructions..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-300">{errors.description}</p>}
              </div>

              {/* Link */}
              <div>
                <label htmlFor="link" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                  <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
                  Link to Share
                </label>
                <input
                  type="url"
                  name="link"
                  id="link"
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

              {/* Budget and Shares */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    id="budget"
                    min="1"
                    step="0.01"
                    required
                    value={budget}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                      errors.budget ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.budget && <p className="mt-1 text-sm text-red-300">{errors.budget}</p>}
                </div>

                <div>
                  <label htmlFor="sharesRequired" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <ShareIcon className="w-5 h-5 text-gray-400 mr-2" />
                    Shares Required
                  </label>
                  <input
                    type="number"
                    name="sharesRequired"
                    id="sharesRequired"
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
                      <span className="text-gray-300">You'll pay:</span>
                      <span className="font-semibold text-white ml-2">${parseFloat(budget).toFixed(2)}</span>
                    </div>
                  </div>
                  {parseFloat(amountPerShare) < 0.5 && (
                    <p className="text-xs text-red-300 mt-2">
                      Minimum amount per share is $0.50. Please increase your budget or reduce shares.
                    </p>
                  )}
                </div>
              )}

              {/* Payment Info with Wallet Status */}
              <div className="bg-primary-400/20 border border-primary-400/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-primary-300 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-primary-300 font-medium mb-1">Payment Information</p>
                    <p className="text-sm text-primary-200 mb-2">
                      {hasSufficientBalance ? (
                        <>You have sufficient balance (${user?.walletBalance?.toFixed(2)}) to pay for this gig. You can choose to pay with wallet or card.</>
                      ) : (
                        <>Your wallet balance (${user?.walletBalance?.toFixed(2)}) is insufficient. You'll need to pay with card.</>
                      )}
                    </p>
                    <p className="text-sm text-primary-200">
                      Funds are held in escrow and only released when shares are completed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Gig...
                    </>
                  ) : hasSufficientBalance ? (
                    'Continue to Payment'
                  ) : (
                    'Create Gig & Pay with Card'
                  )}
                </button>
              </div>
            </form>
          </div>
        </GlassCard>
      </div>
    </GradientBackground>
  );
};

export default CreateGig;