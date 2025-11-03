// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import logo from "../assets/logo.png"
// import { toast } from 'react-hot-toast';
// import {
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const { login } = useAuth();
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
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//   <div className="mx-auto w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//     <img src={logo} alt="SPS" className="w-12 h-12" />
//   </div>
//   <h2 className="text-3xl font-bold text-gray-900 mb-2">
//     Welcome Back
//   </h2>
//   <p className="text-gray-600 mb-3">
//     Sign in to your account to continue
//   </p>
//   <div className="text-sm text-primary-600 font-semibold tracking-wide">
//     Empower.Share.Earn
//   </div>
// </div>

//             {/* Form */}
//             <form className="space-y-6" onSubmit={onSubmit}>
//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                       errors.email ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <LockClosedIcon className="w-4 h-4 text-gray-400 mr-2" />
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="current-password"
//                     required
//                     value={password}
//                     onChange={onChange}
//                     className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
//                       errors.password ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
//               </div>

//               {/* Remember me & Forgot password */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                     Remember me
//                   </label>
//                 </div>

//                 {/* <div className="text-sm">
//                   <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
//                     Forgot your password?
//                   </a>
//                 </div> */}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign in to your account
//                     <ArrowRightIcon className="w-4 h-4 ml-2" />
//                   </>
//                 )}
//               </button>

//               {/* Demo Login Button */}
//               {/* <button
//                 type="button"
//                 onClick={handleDemoLogin}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 Try Demo Account
//               </button> */}
//             </form>

//             {/* Divider */}
//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">New to our platform?</span>
//                 </div>
//               </div>
//             </div>

//             {/* Sign Up Link */}
//             <div className="mt-6 text-center">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center font-medium text-primary-600 hover:text-primary-500 transition-colors group"
//               >
//                 Create your account
//                 <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500 text-center">
//               By signing in, you agree to our{' '}
//               <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>{' '}
//               and{' '}
//               <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
//             </p>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-gray-600">
//             Need help?{' '}
//             <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//               Contact support
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.png"
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, password } = formData;

  const from = location.state?.from?.pathname || '/gigs';

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
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
    <GradientBackground className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
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

                {/* <div className="text-sm">
                  <a href="#" className="font-medium text-primary-300 hover:text-primary-200 transition-colors">
                    Forgot your password?
                  </a>
                </div> */}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
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
              {/* <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
              >
                Try Demo Account
              </button> */}
            </form>

            {/* Divider */}
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

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-flex items-center font-medium text-primary-300 hover:text-primary-200 transition-colors group"
              >
                Create your account
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
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
  );
};

export default Login;