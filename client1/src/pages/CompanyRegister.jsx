
// // pages/CompanyRegister.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import {
//   BuildingOfficeIcon,
//   UserIcon,
//   PhoneIcon,
//   MapPinIcon,
//   GlobeAltIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   CheckCircleIcon,
//   ArrowLeftIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline';

// const CompanyRegister = () => {
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     // Company Details
//     companyName: '',
//     businessEmail: '',
//     website: '',
//     industry: '',
//     companySize: '',
//     taxId: '',

//     // Contact Person
//     contactPersonName: '',
//     contactPersonPosition: '',
//     contactPersonPhone: '',
//     contactPersonEmail: '',
//     contactPersonPassword: '',

//     // Address
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: ''
//   });

//   const industries = [
//     'technology',
//     'ecommerce', 
//     'healthcare',
//     'education',
//     'finance',
//     'entertainment',
//     'real_estate',
//     'travel',
//     'food_beverage',
//     'other'
//   ];

//   const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

//   const industryDisplayNames = {
//     'technology': 'Technology',
//     'ecommerce': 'E-commerce',
//     'healthcare': 'Healthcare',
//     'education': 'Education',
//     'finance': 'Finance',
//     'entertainment': 'Entertainment',
//     'real_estate': 'Real Estate',
//     'travel': 'Travel',
//     'food_beverage': 'Food & Beverage',
//     'other': 'Other'
//   };

//   const companySizeDisplayNames = {
//     '1-10': '1-10 employees',
//     '11-50': '11-50 employees',
//     '51-200': '51-200 employees',
//     '201-500': '201-500 employees',
//     '500+': '500+ employees'
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const apiData = {
//         companyName: formData.companyName,
//         businessEmail: formData.businessEmail,
//         website: formData.website,
//         industry: formData.industry,
//         companySize: formData.companySize,
//         taxId: formData.taxId,
//         address: {
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           country: formData.country,
//           zipCode: formData.zipCode
//         },
//         contactPersonName: formData.contactPersonName,
//         contactPersonPosition: formData.contactPersonPosition,
//         contactPersonPhone: formData.contactPersonPhone,
//         contactPersonEmail: formData.contactPersonEmail,
//         contactPersonPassword: formData.contactPersonPassword
//       };

//       console.log('Submitting company registration:', apiData);
      
//       const res = await axios.post('/api/company/register', apiData);
      
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token);
//       }
      
//       toast.success('Company registered successfully!');
//       navigate('/company/dashboard');
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast.error(error.response?.data?.message || 'Company registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = (e) => {
//     if (e) {
//       e.preventDefault();
//     }
    
//     if (step === 1) {
//       if (!formData.companyName || !formData.businessEmail || !formData.industry || !formData.companySize) {
//         toast.error('Please fill in all required company details');
//         return;
//       }
//     }
//     if (step === 2) {
//       if (!formData.contactPersonName || !formData.contactPersonEmail || !formData.contactPersonPassword) {
//         toast.error('Please fill in all required user account fields');
//         return;
//       }
//       if (formData.contactPersonPassword.length < 6) {
//         toast.error('Password must be at least 6 characters');
//         return;
//       }
//     }
//     setStep(prev => prev + 1);
//   };

//   const prevStep = () => {
//     setStep(prev => prev - 1);
//   };

//   // StatIconWrapper component matching GigDetail
//   const StatIconWrapper = ({ color = 'blue', children }) => {
//     const colorClasses = {
//       blue: 'bg-blue-100 text-blue-600',
//       green: 'bg-green-100 text-green-600',
//       purple: 'bg-purple-100 text-purple-600',
//       yellow: 'bg-yellow-100 text-yellow-600',
//       red: 'bg-red-100 text-red-600'
//     };

//     return (
//       <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
//         {children}
//       </div>
//     );
//   };

//   // Progress Steps - Matching GigDetail style
//   const ProgressSteps = () => (
//     <div className="flex justify-center mb-8">
//       <div className="flex items-center space-x-4">
//         {[1, 2, 3].map((stepNumber) => (
//           <React.Fragment key={stepNumber}>
//             <div className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                 step >= stepNumber 
//                   ? 'bg-blue-600 border-blue-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-400'
//               }`}>
//                 {step > stepNumber ? (
//                   <CheckCircleIcon className="w-5 h-5" />
//                 ) : (
//                   stepNumber
//                 )}
//               </div>
//               <span className="ml-2 text-sm font-medium">
//                 {stepNumber === 1 && 'Company'}
//                 {stepNumber === 2 && 'Account'}
//                 {stepNumber === 3 && 'Address'}
//               </span>
//             </div>
//             {stepNumber < 3 && (
//               <div className={`w-12 h-0.5 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <BuildingOfficeIcon className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-3">Register Your Company</h1>
//           <p className="text-gray-600 text-lg">Join thousands of businesses growing with our platform</p>
//         </div>

//         <ProgressSteps />

//         {/* Main Card - Matching GigDetail style */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//           <div className="px-6 py-8">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Step 1: Company Information */}
//               {step === 1 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
//                     <p className="text-gray-600">Tell us about your business</p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Company Name *
//                         </label>
//                         <input
//                           type="text"
//                           name="companyName"
//                           value={formData.companyName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                           placeholder="Acme Inc."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Business Email *
//                         </label>
//                         <div className="relative">
//                           <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                           <input
//                             type="email"
//                             name="businessEmail"
//                             value={formData.businessEmail}
//                             onChange={handleChange}
//                             required
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                             placeholder="hello@company.com"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Website
//                         </label>
//                         <div className="relative">
//                           <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                           <input
//                             type="url"
//                             name="website"
//                             value={formData.website}
//                             onChange={handleChange}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                             placeholder="https://example.com"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Industry *
//                         </label>
//                         <select
//                           name="industry"
//                           value={formData.industry}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
//                         >
//                           <option value="">Select Industry</option>
//                           {industries.map(industry => (
//                             <option key={industry} value={industry}>
//                               {industryDisplayNames[industry]}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Company Size *
//                         </label>
//                         <select
//                           name="companySize"
//                           value={formData.companySize}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
//                         >
//                           <option value="">Select Company Size</option>
//                           {companySizes.map(size => (
//                             <option key={size} value={size}>
//                               {companySizeDisplayNames[size]}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Tax ID / VAT Number
//                         </label>
//                         <input
//                           type="text"
//                           name="taxId"
//                           value={formData.taxId}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                           placeholder="Optional for verification"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 2: Account Creation */}
//               {step === 2 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-6">
//                     <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                       <UserIcon className="w-8 h-8 text-white" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
//                     <p className="text-gray-600">This will be your company admin account</p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Full Name *
//                         </label>
//                         <input
//                           type="text"
//                           name="contactPersonName"
//                           value={formData.contactPersonName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                           placeholder="John Doe"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Position
//                         </label>
//                         <input
//                           type="text"
//                           name="contactPersonPosition"
//                           value={formData.contactPersonPosition}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                           placeholder="CEO / Founder"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <div className="relative">
//                           <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                           <input
//                             type="tel"
//                             name="contactPersonPhone"
//                             value={formData.contactPersonPhone}
//                             onChange={handleChange}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                             placeholder="+1 (555) 123-4567"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Email Address *
//                         </label>
//                         <div className="relative">
//                           <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                           <input
//                             type="email"
//                             name="contactPersonEmail"
//                             value={formData.contactPersonEmail}
//                             onChange={handleChange}
//                             required
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                             placeholder="your.email@company.com"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Password *
//                         </label>
//                         <div className="relative">
//                           <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                           <input
//                             type={showPassword ? 'text' : 'password'}
//                             name="contactPersonPassword"
//                             value={formData.contactPersonPassword}
//                             onChange={handleChange}
//                             required
//                             minLength="6"
//                             className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                             placeholder="Create a secure password"
//                           />
//                           <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? (
//                               <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//                             ) : (
//                               <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//                             )}
//                           </button>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 3: Company Address */}
//               {step === 3 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-6">
//                     <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                       <MapPinIcon className="w-8 h-8 text-white" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Address</h2>
//                     <p className="text-gray-600">Where is your company located?</p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Street Address
//                       </label>
//                       <input
//                         type="text"
//                         name="street"
//                         value={formData.street}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                         placeholder="123 Main Street"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                         placeholder="New York"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         State / Province
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                         placeholder="New York"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Country
//                       </label>
//                       <input
//                         type="text"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                         placeholder="United States"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         ZIP / Postal Code
//                       </label>
//                       <input
//                         type="text"
//                         name="zipCode"
//                         value={formData.zipCode}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                         placeholder="10001"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between pt-6 border-t border-gray-200">
//                 {step > 1 ? (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
//                   >
//                     <ArrowLeftIcon className="w-5 h-5 mr-2" />
//                     Previous
//                   </button>
//                 ) : (
//                   <Link
//                     to="/gigs"
//                     className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
//                   >
//                     <ArrowLeftIcon className="w-5 h-5 mr-2" />
//                     Back to Gigs
//                   </Link>
//                 )}

//                 {step < 3 ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
//                   >
//                     Continue
//                     <ArrowRightIcon className="w-5 h-5 ml-2" />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 font-medium"
//                   >
//                     {loading ? (
//                       <span className="flex items-center">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Creating Account...
//                       </span>
//                     ) : (
//                       'Complete Registration'
//                     )}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Benefits */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
//             <StatIconWrapper color="blue">
//               <BuildingOfficeIcon className="w-6 h-6" />
//             </StatIconWrapper>
//             <h3 className="font-semibold text-gray-900 mb-2 mt-3">Team Management</h3>
//             <p className="text-gray-600 text-sm">Invite team members and manage permissions</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
//             <StatIconWrapper color="green">
//               <UserIcon className="w-6 h-6" />
//             </StatIconWrapper>
//             <h3 className="font-semibold text-gray-900 mb-2 mt-3">Analytics Dashboard</h3>
//             <p className="text-gray-600 text-sm">Track performance with detailed insights</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
//             <StatIconWrapper color="purple">
//               <GlobeAltIcon className="w-6 h-6" />
//             </StatIconWrapper>
//             <h3 className="font-semibold text-gray-900 mb-2 mt-3">Bulk Operations</h3>
//             <p className="text-gray-600 text-sm">Manage multiple gigs and campaigns efficiently</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyRegister;



import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CompanyRegister = ({ onClose, onSwitchToLogin, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    businessEmail: '',
    website: '',
    industry: '',
    companySize: '',
    taxId: '',

    // Contact Person
    contactPersonName: '',
    contactPersonPosition: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    contactPersonPassword: '',

    // Address
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  const industries = [
    'technology',
    'ecommerce', 
    'healthcare',
    'education',
    'finance',
    'entertainment',
    'real_estate',
    'travel',
    'food_beverage',
    'other'
  ];

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  const industryDisplayNames = {
    'technology': 'Technology',
    'ecommerce': 'E-commerce',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'finance': 'Finance',
    'entertainment': 'Entertainment',
    'real_estate': 'Real Estate',
    'travel': 'Travel',
    'food_beverage': 'Food & Beverage',
    'other': 'Other'
  };

  const companySizeDisplayNames = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '500+': '500+ employees'
  };

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Focus management
  useEffect(() => {
    const firstInput = modalRef.current?.querySelector('input');
    firstInput?.focus();
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiData = {
        companyName: formData.companyName,
        businessEmail: formData.businessEmail,
        website: formData.website,
        industry: formData.industry,
        companySize: formData.companySize,
        taxId: formData.taxId,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        contactPersonName: formData.contactPersonName,
        contactPersonPosition: formData.contactPersonPosition,
        contactPersonPhone: formData.contactPersonPhone,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPassword: formData.contactPersonPassword
      };

      console.log('Submitting company registration:', apiData);
      
      const res = await axios.post('/api/company/register', apiData);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      toast.success('Company registered successfully!');
      onClose?.();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Company registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (step === 1) {
      if (!formData.companyName || !formData.businessEmail || !formData.industry || !formData.companySize) {
        toast.error('Please fill in all required company details');
        return;
      }
    }
    if (step === 2) {
      if (!formData.contactPersonName || !formData.contactPersonEmail || !formData.contactPersonPassword) {
        toast.error('Please fill in all required user account fields');
        return;
      }
      if (formData.contactPersonPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Progress Steps
  const ProgressSteps = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= stepNumber 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step > stepNumber ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">
                {stepNumber === 1 && 'Company'}
                {stepNumber === 2 && 'Account'}
                {stepNumber === 3 && 'Address'}
              </span>
            </div>
            {stepNumber < 3 && (
              <div className={`w-8 h-0.5 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
  <div 
  ref={modalRef}
  className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-50 duration-300"
>
      {/* Header */}
      <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Close company registration"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Register Your Company</h1>
          <p className="text-gray-600">Join thousands of businesses growing with our platform</p>
        </div>
      </div>

      <ProgressSteps />

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">Tell us about your business</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="hello@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>
                          {industryDisplayNames[industry]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size *
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                    >
                      <option value="">Select Company Size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>
                          {companySizeDisplayNames[size]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID / VAT Number
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Optional for verification"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Account Creation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">This will be your company admin account</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="contactPersonPosition"
                      value={formData.contactPersonPosition}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="CEO / Founder"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="tel"
                        name="contactPersonPhone"
                        value={formData.contactPersonPhone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        name="contactPersonEmail"
                        value={formData.contactPersonEmail}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="contactPersonPassword"
                        value={formData.contactPersonPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Company Address */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Company Address</h2>
                <p className="text-gray-600">Where is your company located?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Continue
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Alternative Auth Links */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Looking for personal account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
            >
              Register here
            </button>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;