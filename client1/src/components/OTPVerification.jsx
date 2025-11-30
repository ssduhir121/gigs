import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowPathIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const OTPVerification = ({ email, onVerificationSuccess, onResendOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => /^\d?$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus last filled input
      const lastFilledIndex = pastedOtp.findIndex(char => !char) - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : Math.min(5, pastedOtp.length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      await onVerificationSuccess(otpString);
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await onResendOTP();
      setTimeLeft(600); // Reset timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <EnvelopeIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-gray-900 font-semibold">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter verification code
          </label>
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className={`text-sm ${timeLeft > 0 ? 'text-gray-600' : 'text-red-600'}`}>
            {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying...
            </>
          ) : (
            <>
              Verify Email
              <CheckCircleIcon className="w-4 h-4 ml-2" />
            </>
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading || timeLeft > 0}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
          >
            {resendLoading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Resend Code {timeLeft > 0 && `(in ${formatTime(timeLeft)})`}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;