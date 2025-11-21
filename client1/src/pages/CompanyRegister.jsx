// pages/CompanyRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { GradientBackground, GlassCard } from '../components/common/StyledComponents';

const CompanyRegister = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  // Correct enum values that match backend schema
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

  // Display names for better UX
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

  // Simple, reliable handleChange
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
    // Prepare data matching backend expectations
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
    navigate('/company/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(error.response?.data?.message || 'Company registration failed');
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

  // Progress Steps with better visual
  const ProgressSteps = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`flex flex-col items-center ${step >= stepNumber ? 'text-primary-400' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= stepNumber 
                  ? 'bg-primary-600 border-primary-500 text-white' 
                  : 'bg-gray-700 border-gray-600'
              }`}>
                {step > stepNumber ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className="text-xs mt-2 font-medium">
                {stepNumber === 1 && 'Company'}
                {stepNumber === 2 && 'Account'}
                {stepNumber === 3 && 'Address'}
              </span>
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 ${step > stepNumber ? 'bg-primary-500' : 'bg-gray-600'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <GradientBackground className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BuildingOfficeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Register Your Company</h1>
          <p className="text-gray-300 text-lg">Join thousands of businesses growing with our platform</p>
        </div>

        <ProgressSteps />

        <GlassCard className="p-8 backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Company Information</h2>
                  <p className="text-gray-300">Tell us about your business</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder="Acme Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
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
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="hello@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Industry *
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      >
                        <option value="" className="bg-gray-800">Select Industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry} className="bg-gray-800">
                            {industryDisplayNames[industry]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Company Size *
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      >
                        <option value="" className="bg-gray-800">Select Company Size</option>
                        {companySizes.map(size => (
                          <option key={size} value={size} className="bg-gray-800">
                            {companySizeDisplayNames[size]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Tax ID / VAT Number
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
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
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
                  <p className="text-gray-300">This will be your company admin account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        name="contactPersonPosition"
                        value={formData.contactPersonPosition}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder="CEO / Founder"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="tel"
                          name="contactPersonPhone"
                          value={formData.contactPersonPhone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
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
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="your.email@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
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
                          className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="Create a secure password"
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
                      <p className="text-xs text-gray-400 mt-2">Minimum 6 characters</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Company Address */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPinIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Company Address</h2>
                  <p className="text-gray-300">Where is your company located?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="United States"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold"
                >
                  ← Previous
                </button>
              ) : (
                <Link
                  to="/gigs"
                  className="px-8 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold"
                >
                  ← Back to Gigs
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </span>
                  ) : (
                    'Complete Registration ✓'
                  )}
                </button>
              )}
            </div>
          </form>
        </GlassCard>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <GlassCard className="p-6 text-center bg-blue-500/10 border-blue-400/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-semibold text-white mb-2">Team Management</h3>
            <p className="text-gray-300 text-sm">Invite team members and manage permissions</p>
          </GlassCard>

          <GlassCard className="p-6 text-center bg-green-500/10 border-green-400/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserIcon className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="font-semibold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-gray-300 text-sm">Track performance with detailed insights</p>
          </GlassCard>

          <GlassCard className="p-6 text-center bg-purple-500/10 border-purple-400/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <GlobeAltIcon className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="font-semibold text-white mb-2">Bulk Operations</h3>
            <p className="text-gray-300 text-sm">Manage multiple gigs and campaigns efficiently</p>
          </GlassCard>
        </div>
      </div>
    </GradientBackground>
  );
};

export default CompanyRegister;