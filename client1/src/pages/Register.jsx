
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import OTPVerification from '../components/OTPVerification';
// import { toast } from 'react-hot-toast';
// import logo from "../assets/logo.png"
// import {
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   CheckCircleIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline';

// // Import color system
// import { colors, colorVariants } from '../constants/colors';
// import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showOTPVerification, setShowOTPVerification] = useState(false);
//   const [pendingUser, setPendingUser] = useState(null);

//   const { register, googleLogin, verifyOTP, resendOTP } = useAuth();
//   const navigate = useNavigate();

//   const { name, email, password, confirmPassword } = formData;

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!name.trim()) {
//       newErrors.name = 'Full name is required';
//     } else if (name.trim().length < 2) {
//       newErrors.name = 'Name must be at least 2 characters';
//     }

//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase, and number';
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (password !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     setLoading(true);
//     const registerToast = toast.loading('Creating your account...');

//     try {
//       const result = await register({ 
//         name: name.trim(), 
//         email: email.trim(), 
//         password 
//       });
      
//       if (result.success) {
//         if (result.data.requiresVerification) {
//           // Show OTP verification
//           setPendingUser({
//             email: email.trim(),
//             name: name.trim()
//           });
//           setShowOTPVerification(true);
//           toast.success('OTP sent to your email!', { id: registerToast });
//         } else {
//           toast.success('Account created successfully!', { id: registerToast });
//           setTimeout(() => navigate('/gigs'), 1500);
//         }
//       } else {
//         toast.error(result.message || 'Registration failed', { id: registerToast });
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed';
//       toast.error(errorMessage, { id: registerToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleRegister = async (credentialResponse) => {
//     setGoogleLoading(true);
//     const googleToast = toast.loading('Creating account with Google...');

//     try {
//       const result = await googleLogin(credentialResponse.credential);
      
//       if (result.success) {
//         toast.success('Google registration successful!', { id: googleToast });
//         setTimeout(() => navigate('/gigs'), 1000);
//       } else {
//         toast.error(result.message || 'Google registration failed', { id: googleToast });
//       }
//     } catch (err) {
//       toast.error('Google registration error', { id: googleToast });
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     toast.error('Google registration failed. Please try again.');
//   };

//   const handleOTPVerification = async (otp) => {
//     try {
//       const result = await verifyOTP(pendingUser.email, otp);
      
//       if (result.success) {
//         toast.success('Email verified successfully!');
//         setTimeout(() => navigate('/gigs'), 1000);
//       } else {
//         toast.error(result.message || 'OTP verification failed');
//         throw new Error(result.message);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const result = await resendOTP(pendingUser.email);
      
//       if (result.success) {
//         return true;
//       } else {
//         toast.error(result.message || 'Failed to resend OTP');
//         return false;
//       }
//     } catch (error) {
//       toast.error('Failed to resend OTP');
//       return false;
//     }
//   };

//   const passwordRequirements = [
//     { met: password.length >= 6, text: 'At least 6 characters' },
//     { met: /[a-z]/.test(password), text: 'One lowercase letter' },
//     { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
//     { met: /\d/.test(password), text: 'One number' },
//   ];

//   // If OTP verification is showing, display the OTP component
//   if (showOTPVerification && pendingUser) {
//     return (
//       <GradientBackground className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <GlassCard className="max-w-md w-full backdrop-blur-lg">
//           <OTPVerification
//             email={pendingUser.email}
//             onVerificationSuccess={handleOTPVerification}
//             onResendOTP={handleResendOTP}
//           />
//         </GlassCard>
//       </GradientBackground>
//     );
//   }

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <GradientBackground className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full">
//           {/* Card */}
//           <GlassCard className="overflow-hidden backdrop-blur-lg">
//             <div className="p-8">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-400/40 to-primary-600/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm">
//                   <img src={logo} alt="SPS" className="w-12 h-12" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">
//                   Create Account
//                 </h2>
//                 <p className="text-gray-300">
//                   Join thousands of users sharing and earning
//                 </p>
//                 <div className="text-sm text-primary-300 font-semibold tracking-wide">
//                   Empower.Share.Earn
//                 </div>
//               </div>

//               {/* Google Register Button */}
//               <div className="mb-6">
//                 <GoogleLogin
//                   onSuccess={handleGoogleRegister}
//                   onError={handleGoogleError}
//                   theme="filled_blue"
//                   size="large"
//                   width={300}
//                   text="signup_with"
//                   shape="rectangular"
//                 />
//               </div>

//               {/* Divider */}
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-white/20" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-transparent text-gray-400">Or sign up with email</span>
//                 </div>
//               </div>

//               {/* Form */}
//               <form className="space-y-6" onSubmit={onSubmit}>
//                 {/* Name */}
//                 <div>
//                   <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="blue" className="!p-1 mr-2">
//                       <UserIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
//                     Full Name
//                   </label>
//                   <input
//                     name="name"
//                     type="text"
//                     required
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                       errors.name ? 'border-red-400/50' : 'border-white/20'
//                     }`}
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={onChange}
//                   />
//                   {errors.name && <p className="mt-2 text-sm text-red-300">{errors.name}</p>}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="purple" className="!p-1 mr-2">
//                       <EnvelopeIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
//                     Email Address
//                   </label>
//                   <input
//                     name="email"
//                     type="email"
//                     required
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                       errors.email ? 'border-red-400/50' : 'border-white/20'
//                     }`}
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={onChange}
//                   />
//                   {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="green" className="!p-1 mr-2">
//                       <LockClosedIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       required
//                       className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.password ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="Create a password"
//                       value={password}
//                       onChange={onChange}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
//                       ) : (
//                         <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password}</p>}
                  
//                   {/* Password Requirements */}
//                   {password && (
//                     <div className="mt-3 space-y-2">
//                       {passwordRequirements.map((req, index) => (
//                         <div key={index} className="flex items-center text-xs">
//                           <CheckCircleIcon className={`w-4 h-4 mr-2 ${
//                             req.met ? 'text-green-400' : 'text-gray-500'
//                           }`} />
//                           <span className={req.met ? 'text-green-300' : 'text-gray-400'}>
//                             {req.text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="orange" className="!p-1 mr-2">
//                       <LockClosedIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       name="confirmPassword"
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       required
//                       className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.confirmPassword ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="Confirm your password"
//                       value={confirmPassword}
//                       onChange={onChange}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? (
//                         <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
//                       ) : (
//                         <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.confirmPassword && <p className="mt-2 text-sm text-red-300">{errors.confirmPassword}</p>}
                  
//                   {/* Password Match Indicator */}
//                   {password && confirmPassword && (
//                     <div className="mt-2 flex items-center text-xs">
//                       <CheckCircleIcon className={`w-4 h-4 mr-2 ${
//                         password === confirmPassword ? 'text-green-400' : 'text-gray-500'
//                       }`} />
//                       <span className={password === confirmPassword ? 'text-green-300' : 'text-gray-400'}>
//                         Passwords {password === confirmPassword ? 'match' : 'do not match'}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Terms Agreement */}
//                 <div className="flex items-center">
//                   <input
//                     id="terms"
//                     name="terms"
//                     type="checkbox"
//                     required
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/30 rounded bg-white/5 backdrop-blur-sm"
//                   />
//                   <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
//                     I agree to the{' '}
//                     <a href="#" className="text-primary-300 hover:text-primary-200 font-medium">
//                       Terms of Service
//                     </a>{' '}
//                     and{' '}
//                     <a href="#" className="text-primary-300 hover:text-primary-200 font-medium">
//                       Privacy Policy
//                     </a>
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={loading || googleLoading}
//                   className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Creating Account...
//                     </>
//                   ) : (
//                     <>
//                       Create Account
//                       <ArrowRightIcon className="w-4 h-4 ml-2" />
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* Divider */}
//               <div className="mt-6">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-white/20" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-transparent text-gray-400">Already have an account?</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Login Link */}
//               <div className="mt-6 text-center">
//                 <Link
//                   to="/login"
//                   className="inline-flex items-center font-medium text-primary-300 hover:text-primary-200 transition-colors group"
//                 >
//                   Sign in to your account
//                   <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="bg-white/10 px-8 py-4 border-t border-white/20 backdrop-blur-sm">
//               <p className="text-xs text-gray-400 text-center">
//                 By creating an account, you agree to our{' '}
//                 <a href="#" className="text-primary-300 hover:text-primary-200">Terms</a> and{' '}
//                 <a href="#" className="text-primary-300 hover:text-primary-200">Privacy Policy</a>
//               </p>
//             </div>
//           </GlassCard>

//           {/* Benefits */}
//           <GlassCard className="p-6 mt-8 backdrop-blur-sm">
//             <h3 className="text-sm font-semibold text-white mb-4 text-center">Why Join Us?</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//               <div className="text-sm text-gray-300">
//                 <div className="text-2xl mb-1">🚀</div>
//                 <div>Earn Money</div>
//               </div>
//               <div className="text-sm text-gray-300">
//                 <div className="text-2xl mb-1">📈</div>
//                 <div>Grow Reach</div>
//               </div>
//               <div className="text-sm text-gray-300">
//                 <div className="text-2xl mb-1">💫</div>
//                 <div>Instant Payouts</div>
//               </div>
//             </div>
//           </GlassCard>
//         </div>
//       </GradientBackground>
//     </GoogleOAuthProvider>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import OTPVerification from '../components/OTPVerification';
import { toast } from 'react-hot-toast';
import logo from "../assets/logo.png"
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const { register, googleLogin, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    const registerToast = toast.loading('Creating your account...');

    try {
      const result = await register({ 
        name: name.trim(), 
        email: email.trim(), 
        password 
      });
      
      if (result.success) {
        if (result.data.requiresVerification) {
          setPendingUser({
            email: email.trim(),
            name: name.trim()
          });
          setShowOTPVerification(true);
          toast.success('OTP sent to your email!', { id: registerToast });
        } else {
          toast.success('Account created successfully!', { id: registerToast });
          setTimeout(() => navigate('/gigs'), 1500);
        }
      } else {
        toast.error(result.message || 'Registration failed', { id: registerToast });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage, { id: registerToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    setGoogleLoading(true);
    const googleToast = toast.loading('Creating account with Google...');

    try {
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        toast.success('Google registration successful!', { id: googleToast });
        setTimeout(() => navigate('/gigs'), 1000);
      } else {
        toast.error(result.message || 'Google registration failed', { id: googleToast });
      }
    } catch (err) {
      toast.error('Google registration error', { id: googleToast });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google registration failed. Please try again.');
  };

  const handleOTPVerification = async (otp) => {
    try {
      const result = await verifyOTP(pendingUser.email, otp);
      
      if (result.success) {
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/gigs'), 1000);
      } else {
        toast.error(result.message || 'OTP verification failed');
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP(pendingUser.email);
      
      if (result.success) {
        return true;
      } else {
        toast.error(result.message || 'Failed to resend OTP');
        return false;
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
      return false;
    }
  };

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /\d/.test(password), text: 'One number' },
  ];

  // If OTP verification is showing, display the OTP component
  if (showOTPVerification && pendingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <OTPVerification
            email={pendingUser.email}
            onVerificationSuccess={handleOTPVerification}
            onResendOTP={handleResendOTP}
          />
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                  <img src={logo || "/src/assets/logo.png"} alt="SPS" />
                
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join thousands of users sharing and earning
                </p>
                <div className="text-sm text-blue-600 font-semibold tracking-wide">
                  Empower.Share.Earn
                </div>
              </div>

              {/* Google Register Button */}
              <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width={300}
                  text="signup_with"
                  shape="rectangular"
                />
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={onSubmit}>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 text-gray-500 mr-2" />
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={onChange}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-4 h-4 text-gray-500 mr-2" />
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={onChange}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LockClosedIcon className="w-4 h-4 text-gray-500 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                      value={password}
                      onChange={onChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  
                  {/* Password Requirements */}
                  {password && (
                    <div className="mt-3 space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                            req.met ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LockClosedIcon className="w-4 h-4 text-gray-500 mr-2" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={onChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                  
                  {/* Password Match Indicator */}
                  {password && confirmPassword && (
                    <div className="mt-2 flex items-center text-xs">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                        password === confirmPassword ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <span className={password === confirmPassword ? 'text-green-600' : 'text-gray-500'}>
                        Passwords {password === confirmPassword ? 'match' : 'do not match'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center font-medium text-blue-600 hover:text-blue-500 transition-colors group"
                >
                  Sign in to your account
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </p>
            </div>
          </div>

        
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;