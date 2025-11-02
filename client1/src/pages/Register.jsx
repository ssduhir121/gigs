import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
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
      await register({ name: name.trim(), email: email.trim(), password });
      toast.success('Account created successfully!', { id: registerToast });
      setTimeout(() => navigate('/gigs'), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage, { id: registerToast });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /\d/.test(password), text: 'One number' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">SPS</span>
              </div> */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <img src={logo} alt="SPS" className="w-12 h-12" />
                </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Join thousands of users sharing and earning
              </p>
              <div className="text-sm text-primary-600 font-semibold tracking-wide">
    Empower.Share.Earn
  </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
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
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
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
                  <LockClosedIcon className="w-4 h-4 text-gray-400 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
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
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
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
                          req.met ? 'text-green-500' : 'text-gray-300'
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
                  <LockClosedIcon className="w-4 h-4 text-gray-400 mr-2" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`block w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
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
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                
                {/* Password Match Indicator */}
                {password && confirmPassword && (
                  <div className="mt-2 flex items-center text-xs">
                    <CheckCircleIcon className={`w-4 h-4 mr-2 ${
                      password === confirmPassword ? 'text-green-500' : 'text-gray-300'
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
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg text-sm font-semibold shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
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
                className="inline-flex items-center font-medium text-primary-600 hover:text-primary-500 transition-colors group"
              >
                Sign in to your account
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">Terms</a> and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">Why Join Us?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="text-sm text-gray-600">
              <div className="text-2xl mb-1">🚀</div>
              <div>Earn Money</div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="text-2xl mb-1">📈</div>
              <div>Grow Reach</div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="text-2xl mb-1">💫</div>
              <div>Instant Payouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;