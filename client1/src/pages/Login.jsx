

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
//   KeyIcon
// } from '@heroicons/react/24/outline';

// // Import color system
// import { colors, colorVariants } from '../constants/colors';
// import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

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
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
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
//       <GradientBackground className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full">
//           {/* Forgot Password Modal */}
//           {showForgotPassword && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//               <GlassCard className="max-w-md w-full p-6 backdrop-blur-lg">
//                 <div className="text-center mb-6">
//                   <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400/40 to-orange-600/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm">
//                     <KeyIcon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     Reset Password
//                   </h3>
//                   <p className="text-gray-300">
//                     Enter your email to receive reset instructions
//                   </p>
//                 </div>

//                 <form onSubmit={handleForgotPassword} className="space-y-4">
//                   <div>
//                     <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-200 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       id="forgot-email"
//                       type="email"
//                       required
//                       value={forgotPasswordEmail}
//                       onChange={(e) => setForgotPasswordEmail(e.target.value)}
//                       className="block w-full px-4 py-3 border border-white/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
//                       placeholder="Enter your email"
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(false)}
//                       className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                     >
//                       {loading ? 'Sending...' : 'Send Instructions'}
//                     </button>
//                   </div>
//                 </form>
//               </GlassCard>
//             </div>
//           )}

//           {/* Card */}
//           <GlassCard className="overflow-hidden backdrop-blur-lg">
//             <div className="p-8">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-400/40 to-primary-600/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm">
//                   <img src={logo} alt="SPS" className="w-12 h-12" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-300 mb-3">
//                   Sign in to your account to continue
//                 </p>
//                 <div className="text-sm text-primary-300 font-semibold tracking-wide">
//                   Empower.Share.Earn
//                 </div>
//               </div>

//               {/* Google Login Button */}
//               <div className="mb-6">
//                 <GoogleLogin
//                   onSuccess={handleGoogleLogin}
//                   onError={handleGoogleError}
//                   theme="filled_blue"
//                   size="large"
//                   width="100%"
//                   text="continue_with"
//                   shape="rectangular"
//                 />
//               </div>

//               {/* Divider */}
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-white/20" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-transparent text-gray-400">Or continue with email</span>
//                 </div>
//               </div>

//               {/* Form */}
//               <form className="space-y-6" onSubmit={onSubmit}>
//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="blue" className="!p-1 mr-2">
//                       <EnvelopeIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
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
//                       className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.email ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                   {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-200 mb-2">
//                     <StatIconWrapper color="purple" className="!p-1 mr-2">
//                       <LockClosedIcon className="w-4 h-4 text-white" />
//                     </StatIconWrapper>
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
//                       className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
//                         errors.password ? 'border-red-400/50' : 'border-white/20'
//                       }`}
//                       placeholder="Enter your password"
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
//                 </div>

//                 {/* Remember me & Forgot password */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/30 rounded bg-white/5 backdrop-blur-sm"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
//                       Remember me
//                     </label>
//                   </div>

//                   <div className="text-sm">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(true)}
//                       className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
//                     >
//                       Forgot your password?
//                     </button>
//                   </div>
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
//                   className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
//                 >
//                   Try Demo Account
//                 </button>
//               </form>

//               {/* Divider */}
//               <div className="mt-6">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-white/20" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-transparent text-gray-400">New to our platform?</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Sign Up Link */}
//               <div className="mt-6 text-center">
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center font-medium text-primary-300 hover:text-primary-200 transition-colors group"
//                 >
//                   Create your account
//                   <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="bg-white/10 px-8 py-4 border-t border-white/20 backdrop-blur-sm">
//               <p className="text-xs text-gray-400 text-center">
//                 By signing in, you agree to our{' '}
//                 <a href="#" className="text-primary-300 hover:text-primary-200">Terms of Service</a>{' '}
//                 and{' '}
//                 <a href="#" className="text-primary-300 hover:text-primary-200">Privacy Policy</a>
//               </p>
//             </div>
//           </GlassCard>

//           {/* Additional Info */}
//           <div className="mt-8 text-center">
//             <p className="text-sm text-gray-300">
//               Need help?{' '}
//               <a href="#" className="font-medium text-primary-300 hover:text-primary-200">
//                 Contact support
//               </a>
//             </p>
//           </div>
//         </div>
//       </GradientBackground>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from "../assets/logo.png"
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  KeyIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

import { GradientBackground, GlassCard, StatIconWrapper } from '../components/common/StyledComponents';

const Login = () => {
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

  const { login, googleLogin, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log('All env vars:', import.meta.env);
  const { email, password } = formData;

  const from = location.state?.from?.pathname || '/gigs';

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
      newErrors.email = 'Email is invalid';
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
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        toast.error(result.message || 'Login failed', { id: loginToast });
      }
    } catch (err) {
      toast.error('An unexpected error occurred', { id: loginToast });
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
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        toast.error(result.message || 'Google login failed', { id: googleToast });
      }
    } catch (err) {
      toast.error('Google login error', { id: googleToast });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
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
        toast.error(result.message || 'Failed to send reset instructions', { id: forgotToast });
      }
    } catch (err) {
      toast.error('Failed to send reset instructions', { id: forgotToast });
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
        setTimeout(() => navigate('/gigs', { replace: true }), 1000);
      } else {
        toast.error('Demo login failed', { id: demoToast });
      }
    } catch (err) {
      toast.error('Demo login error', { id: demoToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GradientBackground className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <GlassCard className="max-w-md w-full p-6 backdrop-blur-lg">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400/40 to-orange-600/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm">
                    <KeyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Reset Password
                  </h3>
                  <p className="text-gray-300">
                    Enter your email to receive reset instructions
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-200 mb-2">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="block w-full px-4 py-3 border border-white/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? 'Sending...' : 'Send Instructions'}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          )}

          {/* Card */}
          <GlassCard className="overflow-hidden backdrop-blur-lg">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-400/40 to-primary-600/60 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm">
                  <img src={logo} alt="SPS" className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-300 mb-3">
                  Sign in to your account to continue
                </p>
                <div className="text-sm text-primary-300 font-semibold tracking-wide">
                  Empower.Share.Earn
                </div>
              </div>

              {/* Google Login Button */}
              <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={onSubmit}>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <StatIconWrapper color="blue" className="!p-1 mr-2">
                      <EnvelopeIcon className="w-4 h-4 text-white" />
                    </StatIconWrapper>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                        errors.email ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-200 mb-2">
                    <StatIconWrapper color="purple" className="!p-1 mr-2">
                      <LockClosedIcon className="w-4 h-4 text-white" />
                    </StatIconWrapper>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={onChange}
                      className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 ${
                        errors.password ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password}</p>}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/30 rounded bg-white/5 backdrop-blur-sm"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
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
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                >
                  Try Demo Account
                </button>
              </form>

              {/* Registration Links */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">New to our platform?</span>
                  </div>
                </div>
              </div>

              {/* User Registration */}
              <div className="mt-6 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center font-medium text-primary-300 hover:text-primary-200 transition-colors group mb-3"
                >
                  Create personal account
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Company Registration with distinct styling */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-lg backdrop-blur-sm">
                  <BuildingOfficeIcon className="w-4 h-4 text-orange-300 mr-2" />
                  <span className="text-sm text-gray-300 mr-3">Business account?</span>
                  <Link
                    to="/company/register"
                    className="text-sm font-medium text-orange-300 hover:text-orange-200 transition-colors group"
                  >
                    Register company
                    <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white/10 px-8 py-4 border-t border-white/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 text-center">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary-300 hover:text-primary-200">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary-300 hover:text-primary-200">Privacy Policy</a>
              </p>
            </div>
          </GlassCard>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-300">
              Need help?{' '}
              <a href="#" className="font-medium text-primary-300 hover:text-primary-200">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </GradientBackground>
    </GoogleOAuthProvider>
  );
};

export default Login;