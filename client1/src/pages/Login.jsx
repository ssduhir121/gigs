
// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import logo from "../assets/logo.png"
// import { toast } from 'react-hot-toast';
// import {
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowRightIcon,
//   KeyIcon,
//   BuildingOfficeIcon
// } from '@heroicons/react/24/outline';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

//   const { login, googleLogin, forgotPassword } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { email, password } = formData;
//   const from = location.state?.from?.pathname || '/gigs';

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
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
//     const loginToast = toast.loading('Signing you in...');

//     try {
//       const result = await login(email, password);
      
//       if (result.success) {
//         toast.success('Welcome back!', { id: loginToast });
//         setTimeout(() => navigate(from, { replace: true }), 1000);
//       } else {
//         toast.error(result.message || 'Login failed', { id: loginToast });
//       }
//     } catch (err) {
//       toast.error('An unexpected error occurred', { id: loginToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async (credentialResponse) => {
//     setGoogleLoading(true);
//     const googleToast = toast.loading('Signing in with Google...');

//     try {
//       const result = await googleLogin(credentialResponse.credential);
      
//       if (result.success) {
//         toast.success('Google login successful!', { id: googleToast });
//         setTimeout(() => navigate(from, { replace: true }), 1000);
//       } else {
//         toast.error(result.message || 'Google login failed', { id: googleToast });
//       }
//     } catch (err) {
//       toast.error('Google login error', { id: googleToast });
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     toast.error('Google login failed. Please try again.');
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
    
//     if (!forgotPasswordEmail.trim()) {
//       toast.error('Please enter your email address');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     setLoading(true);
//     const forgotToast = toast.loading('Sending reset instructions...');

//     try {
//       const result = await forgotPassword(forgotPasswordEmail);
      
//       if (result.success) {
//         toast.success('Password reset instructions sent to your email!', { id: forgotToast });
//         setShowForgotPassword(false);
//         setForgotPasswordEmail('');
//       } else {
//         toast.error(result.message || 'Failed to send reset instructions', { id: forgotToast });
//       }
//     } catch (err) {
//       toast.error('Failed to send reset instructions', { id: forgotToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDemoLogin = async () => {
//     setLoading(true);
//     const demoToast = toast.loading('Signing in with demo account...');

//     try {
//       const result = await login('demo@example.com', 'password');
      
//       if (result.success) {
//         toast.success('Demo login successful!', { id: demoToast });
//         setTimeout(() => navigate('/gigs', { replace: true }), 1000);
//       } else {
//         toast.error('Demo login failed', { id: demoToast });
//       }
//     } catch (err) {
//       toast.error('Demo login error', { id: demoToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full">
//           {/* Forgot Password Modal */}
//           {showForgotPassword && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//               <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6">
//                 <div className="text-center mb-6">
//                   <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
//                     <KeyIcon className="w-8 h-8 text-orange-600" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                     Reset Password
//                   </h3>
//                   <p className="text-gray-600">
//                     Enter your email to receive reset instructions
//                   </p>
//                 </div>

//                 <form onSubmit={handleForgotPassword} className="space-y-4">
//                   <div>
//                     <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       id="forgot-email"
//                       type="email"
//                       required
//                       value={forgotPasswordEmail}
//                       onChange={(e) => setForgotPasswordEmail(e.target.value)}
//                       className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
//                       placeholder="Enter your email"
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(false)}
//                       className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                     >
//                       {loading ? 'Sending...' : 'Send Instructions'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="p-8">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//                   <img src={logo} alt="SPS" className="w-12 h-12 filter brightness-0 invert" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-600 mb-3">
//                   Sign in to your account to continue
//                 </p>
//                 <div className="text-sm text-blue-600 font-semibold tracking-wide">
//                   Empower.Share.Earn
//                 </div>
//               </div>

//               {/* Google Login Button */}
//               <div className="mb-6">
//                 <GoogleLogin
//                   onSuccess={handleGoogleLogin}
//                   onError={handleGoogleError}
//                   theme="outline"
//                   size="large"
//                   text="continue_with"
//                   shape="rectangular"
//                 />
//               </div>

//               {/* Divider */}
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with email</span>
//                 </div>
//               </div>

//               {/* Form */}
//               <form className="space-y-6" onSubmit={onSubmit}>
//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <EnvelopeIcon className="w-4 h-4 text-gray-500 mr-2" />
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       value={email}
//                       onChange={onChange}
//                       className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
//                         errors.email ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                   {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <LockClosedIcon className="w-4 h-4 text-gray-500 mr-2" />
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       autoComplete="current-password"
//                       required
//                       value={password}
//                       onChange={onChange}
//                       className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
//                         errors.password ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter your password"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
//                       ) : (
//                         <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
//                 </div>

//                 {/* Remember me & Forgot password */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                       Remember me
//                     </label>
//                   </div>

//                   <div className="text-sm">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(true)}
//                       className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                     >
//                       Forgot your password?
//                     </button>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={loading || googleLoading}
//                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Signing in...
//                     </>
//                   ) : (
//                     <>
//                       Sign in to your account
//                       <ArrowRightIcon className="w-4 h-4 ml-2" />
//                     </>
//                   )}
//                 </button>

//                 {/* Demo Login Button */}
//                 <button
//                   type="button"
//                   onClick={handleDemoLogin}
//                   disabled={loading || googleLoading}
//                   className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   Try Demo Account
//                 </button>
//               </form>

//               {/* Registration Links */}
//               <div className="mt-6">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">New to our platform?</span>
//                   </div>
//                 </div>
//               </div>

//               {/* User Registration */}
//               <div className="mt-6 text-center">
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center font-medium text-blue-600 hover:text-blue-500 transition-colors group mb-3"
//                 >
//                   Create personal account
//                   <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </div>

//               {/* Company Registration */}
//               <div className="text-center">
//                 <div className="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
//                   <BuildingOfficeIcon className="w-4 h-4 text-orange-600 mr-2" />
//                   <span className="text-sm text-gray-700 mr-3">Business account?</span>
//                   <Link
//                     to="/company/register"
//                     className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors group"
//                   >
//                     Register company
//                     <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
//               <p className="text-xs text-gray-600 text-center">
//                 By signing in, you agree to our{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>{' '}
//                 and{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
//               </p>
//             </div>
//           </div>

//           {/* Additional Info */}
//           <div className="mt-8 text-center">
//             <p className="text-sm text-white">
//               Need help?{' '}
//               <a href="#" className="font-medium text-blue-200 hover:text-white">
//                 Contact support
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;


import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from "../assets/logo.png?url";
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  KeyIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Login = ({ onClose, onSwitchToRegister, onSwitchToCompanyRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  const modalRef = useRef(null);
  const { login, googleLogin, forgotPassword } = useAuth();

  const { email, password } = formData;

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !showForgotPassword) {
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
  }, [onClose, showForgotPassword]);

  // Focus management
  useEffect(() => {
    if (!showForgotPassword) {
      const firstInput = modalRef.current?.querySelector('input');
      firstInput?.focus();
    }
  }, [showForgotPassword]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    const loginToast = toast.loading('Signing you in...');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Welcome back!', { id: loginToast });
        onClose?.();
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.', { id: loginToast });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred. Please try again.', { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setGoogleLoading(true);
    const googleToast = toast.loading('Signing in with Google...');

    try {
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        toast.success('Google login successful!', { id: googleToast });
        onClose?.();
      } else {
        toast.error(result.message || 'Google login failed. Please try again.', { id: googleToast });
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error('Google login failed. Please try again.', { id: googleToast });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again or use email login.');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const forgotToast = toast.loading('Sending reset instructions...');

    try {
      const result = await forgotPassword(forgotPasswordEmail);
      
      if (result.success) {
        toast.success('Password reset instructions sent to your email!', { id: forgotToast });
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        toast.error(result.message || 'Failed to send reset instructions. Please try again.', { id: forgotToast });
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Failed to send reset instructions. Please try again.', { id: forgotToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const demoToast = toast.loading('Signing in with demo account...');

    try {
      const result = await login('demo@example.com', 'password');
      
      if (result.success) {
        toast.success('Demo login successful!', { id: demoToast });
        onClose?.();
      } else {
        toast.error('Demo login failed. Please try again.', { id: demoToast });
      }
    } catch (err) {
      console.error('Demo login error:', err);
      toast.error('Demo login failed. Please try again.', { id: demoToast });
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in-50">
        <div 
          ref={modalRef}
          className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 animate-in slide-in-from-bottom-50 duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <KeyIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h3>
              <p className="text-gray-600">
                Enter your email to receive reset instructions
              </p>
            </div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              aria-label="Close forgot password"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  'Send Instructions'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md animate-in slide-in-from-bottom-50 duration-300"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              aria-label="Close login modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                 <img src={logo || "/src/assets/logo.png"} alt="SPS" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to your account to continue
            </p>
            <div className="text-xs text-blue-600 font-semibold tracking-wide mt-1">
              Empower.Share.Earn
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
              locale="en"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 text-xs font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-500 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <LockClosedIcon className="w-4 h-4 text-gray-500 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChange}
                  className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                    errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to your account
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || googleLoading}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Try Demo Account
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
                >
                  Sign up here
                </button>
              </p>
              
              <div className="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <BuildingOfficeIcon className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm text-gray-700 mr-3">Business account?</span>
                <button
                  onClick={onSwitchToCompanyRegister}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors focus:outline-none focus:underline"
                >
                  Register company
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;