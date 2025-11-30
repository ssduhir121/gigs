

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Initialize axios defaults and check auth status
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get('/api/auth/me');
      
//       if (response.data.success) {
//         const userData = response.data.data;
//         setUser(userData);
//         setIsAuthenticated(true);
//         setIsAdmin(userData.role === 'admin');
        
//         // Success toast for returning users
//         toast.success(`Welcome back, ${userData.name || userData.email}!`, {
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
      
//       // Clear invalid token
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
      
//       // Show error toast for expired sessions
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     try {
//       const response = await axios.get('/api/auth/me');
//       if (response.data.success) {
//         const userData = response.data.data;
//         setUser(userData);
//         setIsAdmin(userData.role === 'admin');
//         return { success: true, data: userData };
//       }
//     } catch (error) {
//       console.error('Failed to refresh user:', error);
//       return { success: false, message: 'Failed to refresh user data' };
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/auth/login', { email, password });
      
//       if (response.data.success) {
//         const { token, data: userData } = response.data;

//         // Store token and set axios headers
//         localStorage.setItem('token', token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//         // Update state
//         setUser(userData);
//         setIsAuthenticated(true);
//         setIsAdmin(userData.role === 'admin');

//         // Success toast
//         toast.success(`Welcome back, ${userData.name || userData.email}!`);

//         return { success: true, data: userData };
//       } else {
//         const message = response.data.message || 'Login failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed. Please try again.';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/api/auth/register', userData);
      
//       if (response.data.success) {
//         // Handle OTP verification flow
//         if (response.data.data.requiresVerification) {
//           toast.success('Please check your email for verification code');
//           return { 
//             success: true, 
//             data: response.data.data,
//             requiresVerification: true 
//           };
//         }

//         // Immediate login (no verification required)
//         const { token, data: newUser } = response.data;
//         localStorage.setItem('token', token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//         setUser(newUser);
//         setIsAuthenticated(true);
//         setIsAdmin(newUser.role === 'admin');

//         toast.success(`Welcome to the platform, ${newUser.name || newUser.email}!`);

//         return { success: true, data: newUser };
//       } else {
//         const message = response.data.message || 'Registration failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed. Please try again.';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const googleLogin = async (googleToken) => {
//     try {
//       const response = await axios.post('/api/auth/google', { token: googleToken });
      
//       if (response.data.success) {
//         const { token, data: userData } = response.data;

//         localStorage.setItem('token', token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//         setUser(userData);
//         setIsAuthenticated(true);
//         setIsAdmin(userData.role === 'admin');

//         toast.success(`Welcome, ${userData.name || userData.email}!`);

//         return { success: true, data: userData };
//       } else {
//         const message = response.data.message || 'Google login failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Google login failed';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const verifyOTP = async (email, otp) => {
//     try {
//       const response = await axios.post('/api/auth/verify-otp', { email, otp });
      
//       if (response.data.success) {
//         const { token, data: userData } = response.data;

//         localStorage.setItem('token', token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//         setUser(userData);
//         setIsAuthenticated(true);
//         setIsAdmin(userData.role === 'admin');

//         toast.success('Account verified successfully!');

//         return { success: true, data: userData };
//       } else {
//         const message = response.data.message || 'OTP verification failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'OTP verification failed';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const resendOTP = async (email) => {
//     try {
//       const response = await axios.post('/api/auth/resend-otp', { email });
      
//       if (response.data.success) {
//         toast.success('Verification code sent to your email');
//         return { success: true, message: response.data.message };
//       } else {
//         const message = response.data.message || 'Failed to resend OTP';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to resend OTP';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await axios.post('/api/auth/forgot-password', { email });
      
//       if (response.data.success) {
//         toast.success('Password reset instructions sent to your email');
//         return { success: true, message: response.data.message };
//       } else {
//         const message = response.data.message || 'Failed to send reset instructions';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to send reset instructions';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const resetPassword = async (resetToken, password) => {
//     try {
//       const response = await axios.put(`/api/auth/reset-password/${resetToken}`, { password });
      
//       if (response.data.success) {
//         toast.success('Password reset successfully');
//         return { success: true, message: response.data.message };
//       } else {
//         const message = response.data.message || 'Password reset failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Password reset failed';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const logout = () => {
//     const userName = user?.name || user?.email || 'User';
    
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
    
//     setUser(null);
//     setIsAuthenticated(false);
//     setIsAdmin(false);
    
//     toast.success(`Goodbye, ${userName}! Come back soon.`);
//   };

//   const updateUserBalance = (newBalance) => {
//     setUser(prev => ({
//       ...prev,
//       walletBalance: newBalance
//     }));
//   };

//   const updateUserProfile = async (profileData) => {
//     try {
//       const response = await axios.put('/api/auth/profile', profileData);
      
//       if (response.data.success) {
//         const updatedUser = response.data.data;
//         setUser(updatedUser);
//         toast.success('Profile updated successfully');
//         return { success: true, data: updatedUser };
//       } else {
//         const message = response.data.message || 'Profile update failed';
//         toast.error(message);
//         return { success: false, message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Profile update failed';
//       toast.error(message);
//       return { success: false, message };
//     }
//   };

//   const value = {
//     // State
//     user,
//     isAuthenticated,
//     isAdmin,
//     loading,
    
//     // Auth methods
//     login,
//     register,
//     logout,
//     googleLogin,
    
//     // Verification methods
//     verifyOTP,
//     resendOTP,
    
//     // Password methods
//     forgotPassword,
//     resetPassword,
    
//     // User methods
//     updateUserBalance,
//     refreshUser,
//     updateUserProfile,
    
//     // Utility methods
//     hasRole: (role) => user?.role === role,
//     hasPermission: (permission) => user?.permissions?.includes(permission),
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize axios defaults and check auth status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/auth/me');
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
        
        // Success toast for returning users
        toast.success(`Welcome back, ${userData.name || userData.email}!`, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Clear invalid token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Show error toast for expired sessions
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        return { success: true, data: userData };
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return { success: false, message: 'Failed to refresh user data' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, data: userData } = response.data;

        // Store token and set axios headers
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        // Success toast
        toast.success(`Welcome back, ${userData.name || userData.email}!`);

        return { success: true, data: userData };
      } else {
        const message = response.data.message || 'Login failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        // Handle OTP verification flow
        if (response.data.data.requiresVerification) {
          toast.success('Please check your email for verification code');
          return { 
            success: true, 
            data: response.data.data,
            requiresVerification: true 
          };
        }

        // Immediate login (no verification required)
        const { token, data: newUser } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(newUser);
        setIsAuthenticated(true);
        setIsAdmin(newUser.role === 'admin');

        toast.success(`Welcome to the platform, ${newUser.name || newUser.email}!`);

        return { success: true, data: newUser };
      } else {
        const message = response.data.message || 'Registration failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const response = await axios.post('/api/auth/google', { token: googleToken });
      
      if (response.data.success) {
        const { token, data: userData } = response.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        toast.success(`Welcome, ${userData.name || userData.email}!`);

        return { success: true, data: userData };
      } else {
        const message = response.data.message || 'Google login failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      
      if (response.data.success) {
        const { token, data: userData } = response.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        toast.success('Account verified successfully!');

        return { success: true, data: userData };
      } else {
        const message = response.data.message || 'OTP verification failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
      
      if (response.data.success) {
        toast.success('Verification code sent to your email');
        return { success: true, message: response.data.message };
      } else {
        const message = response.data.message || 'Failed to resend OTP';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('Password reset instructions sent to your email');
        return { success: true, message: response.data.message };
      } else {
        const message = response.data.message || 'Failed to send reset instructions';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset instructions';
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const response = await axios.put(`/api/auth/reset-password/${resetToken}`, { password });
      
      if (response.data.success) {
        toast.success('Password reset successfully');
        return { success: true, message: response.data.message };
      } else {
        const message = response.data.message || 'Password reset failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    const userName = user?.name || user?.email || 'User';
    
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    toast.success(`Goodbye, ${userName}! Come back soon.`);
  };

  const updateUserBalance = (newBalance) => {
    setUser(prev => ({
      ...prev,
      walletBalance: newBalance
    }));
  };

  // Profile Methods
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/profile', profileData);
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        toast.success('Profile updated successfully');
        return { success: true, data: updatedUser };
      } else {
        const message = response.data.message || 'Profile update failed';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };
// Replace your updateProfilePicture method with this:
const updateProfilePicture = async (file) => {
  try {
    console.log('🚀 Starting profile picture upload...');
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const formData = new FormData();
    formData.append('profilePicture', file);

    console.log('📤 Sending request to /api/profile/picture...');

    const response = await axios.put('/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`📊 Upload Progress: ${percentCompleted}%`);
      }
    });
    
    console.log('✅ Server response:', response.data);

    if (response.data.success) {
      const updatedUser = response.data.data;
      console.log('🔄 Updating user state with new data:', updatedUser);
      
      setUser(updatedUser);
      toast.success('Profile picture updated successfully');
      return { success: true, data: updatedUser };
    } else {
      const message = response.data.message || 'Failed to update profile picture';
      console.error('❌ Server returned error:', message);
      toast.error(message);
      return { success: false, message };
    }
  } catch (error) {
    console.error('💥 Upload error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    let message = 'Failed to update profile picture';
    
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      message = 'Upload timeout. Please try again.';
    } else if (error.message) {
      message = error.message;
    }

    toast.error(message);
    return { success: false, message };
  }
};

  const removeProfilePicture = async () => {
    try {
      const response = await axios.delete('/api/profile/picture');
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        toast.success('Profile picture removed successfully');
        return { success: true, data: updatedUser };
      } else {
        const message = response.data.message || 'Failed to remove profile picture';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove profile picture';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updatePaypalEmail = async (paypalEmail) => {
    try {
      const response = await axios.put('/api/profile/paypal', { paypalEmail });
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        toast.success('PayPal email updated successfully');
        return { success: true, data: updatedUser };
      } else {
        const message = response.data.message || 'Failed to update PayPal email';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update PayPal email';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Utility Methods
  const hasCompany = () => {
    return !!(user?.company || user?.companyId);
  };

  const isCompanyUser = () => {
    return hasCompany() && user?.companyRole;
  };

  const isRegularUser = () => {
    return isAuthenticated && !isCompanyUser() && user?.role !== 'admin';
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatBalance = () => {
    try {
      const balance = user?.walletBalance?.$numberDecimal || user?.walletBalance || 0;
      return Number(balance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      return '0.00';
    }
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isAdmin,
    loading,
    
    // Auth methods
    login,
    register,
    logout,
    googleLogin,
    
    // Verification methods
    verifyOTP,
    resendOTP,
    
    // Password methods
    forgotPassword,
    resetPassword,
    
    // User methods
    updateUserBalance,
    refreshUser,
    
    // Profile methods
    updateProfile,
    updateProfilePicture,
    removeProfilePicture,
    updatePaypalEmail,
    
    // Utility methods
    hasRole: (role) => user?.role === role,
    hasPermission: (permission) => user?.permissions?.includes(permission),
    hasCompany,
    isCompanyUser,
    isRegularUser,
    getUserInitials,
    formatBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};