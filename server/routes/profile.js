// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const User = require('../models/User');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Function to ensure upload directory exists
// const ensureUploadDir = (uploadPath) => {
//   if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
//     console.log(`✅ Created upload directory: ${uploadPath}`);
//   }
// };

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = 'uploads/profile-pictures/';
    
//     // Ensure directory exists
//     ensureUploadDir(uploadDir);
    
//     console.log(`📁 Saving file to: ${uploadDir}`);
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Generate unique filename: userid-timestamp-random.extension
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     const fileName = req.user.id + '-' + uniqueSuffix + fileExtension;
    
//     console.log(`📄 Generated filename: ${fileName}`);
//     cb(null, fileName);
//   }
// });

// // File filter for images only
// const fileFilter = (req, file, cb) => {
//   console.log(`🔍 Checking file type: ${file.mimetype}`);
  
//   if (file.mimetype.startsWith('image/')) {
//     console.log('✅ File type accepted');
//     cb(null, true);
//   } else {
//     console.log('❌ File type rejected - not an image');
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   },
//   fileFilter: fileFilter
// });

// // Helper function to fix image paths for frontend
// const fixImagePath = (user) => {
//   const userObj = user.toObject ? user.toObject() : { ...user };
  
//   if (userObj.profilePicture) {
//     // Replace backslashes with forward slashes for URLs
//     userObj.profilePicture = userObj.profilePicture.replace(/\\/g, '/');
    
//     // Remove any leading slashes that might cause issues
//     userObj.profilePicture = userObj.profilePicture.replace(/^\/+/, '');
    
//     console.log(`🖼️ Fixed image path: ${userObj.profilePicture}`);
//   }
  
//   return userObj;
// };

// // Helper function to safely delete file
// const safeDeleteFile = (filePath) => {
//   try {
//     if (filePath && fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`🗑️ Deleted file: ${filePath}`);
//     } else {
//       console.log(`⚠️ File not found for deletion: ${filePath}`);
//     }
//   } catch (error) {
//     console.error('❌ Error deleting file:', error);
//   }
// };

// // @desc    Update profile picture
// // @route   PUT /api/profile/picture
// // @access  Private
// router.put('/picture', protect, upload.single('profilePicture'), async (req, res) => {
//   console.log('🚀 PUT /api/profile/picture - Starting upload process');
  
//   try {
//     console.log('📦 Request details:', {
//       hasFile: !!req.file,
//       file: req.file ? {
//         originalname: req.file.originalname,
//         size: req.file.size,
//         mimetype: req.file.mimetype,
//         path: req.file.path
//       } : 'No file',
//       user: req.user ? { id: req.user.id, email: req.user.email } : 'No user'
//     });

//     if (!req.file) {
//       console.log('❌ No file received in request');
//       return res.status(400).json({
//         success: false,
//         message: 'Please upload an image file'
//       });
//     }

//     console.log('👤 Finding user in database...');
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       console.log('❌ User not found in database');
//       // Delete the uploaded file if user not found
//       safeDeleteFile(req.file.path);
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     console.log('✅ User found:', user.email);

//     // Delete old profile picture if exists
//     if (user.profilePicture) {
//       console.log(`🗑️ Deleting old profile picture: ${user.profilePicture}`);
//       const oldImagePath = user.profilePicture.replace(/\\/g, '/');
//       safeDeleteFile(oldImagePath);
//     }

//     // Update user's profile picture
//     console.log(`💾 Saving new profile picture path: ${req.file.path}`);
//     user.profilePicture = req.file.path;
    
//     console.log('💾 Saving user to database...');
//     await user.save();
//     console.log('✅ User saved successfully');

//     // Return updated user without password
//     console.log('🔄 Fetching updated user data...');
//     const updatedUser = await User.findById(req.user.id)
//       .select('-password')
//       .populate('company', 'companyName businessEmail verificationStatus');

//     // Fix image path for frontend
//     const userData = fixImagePath(updatedUser);

//     console.log('🎉 Profile picture update completed successfully');
//     res.status(200).json({
//       success: true,
//       message: 'Profile picture updated successfully',
//       data: userData
//     });

//   } catch (error) {
//     console.error('💥 Upload error:', error);
    
//     // Delete the uploaded file if error occurred
//     if (req.file) {
//       console.log('🗑️ Cleaning up uploaded file due to error');
//       safeDeleteFile(req.file.path);
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/profile
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     console.log('👤 GET /api/profile - Fetching user profile');
    
//     const user = await User.findById(req.user.id)
//       .select('-password')
//       .populate('company', 'companyName businessEmail verificationStatus');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Fix image path for frontend
//     const userData = fixImagePath(user);

//     res.status(200).json({
//       success: true,
//       data: userData
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/profile
// // @access  Private
// router.put('/', protect, async (req, res) => {
//   try {
//     const { name, phone, bio, location, paypalEmail } = req.body;
    
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Update fields if provided
//     if (name) user.name = name;
//     if (phone !== undefined) user.phone = phone;
//     if (bio !== undefined) user.bio = bio;
//     if (location !== undefined) user.location = location;
//     if (paypalEmail !== undefined) user.paypalEmail = paypalEmail;

//     await user.save();

//     // Return updated user without password
//     const updatedUser = await User.findById(req.user.id)
//       .select('-password')
//       .populate('company', 'companyName businessEmail verificationStatus');

//     // Fix image path for frontend
//     const userData = fixImagePath(updatedUser);

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: userData
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Delete profile picture
// // @route   DELETE /api/profile/picture
// // @access  Private
// router.delete('/picture', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Delete the image file if it exists locally
//     if (user.profilePicture) {
//       const imagePath = user.profilePicture.replace(/\\/g, '/');
//       safeDeleteFile(imagePath);
//     }

//     // Clear profile picture field
//     user.profilePicture = null;
//     await user.save();

//     // Return updated user without password
//     const updatedUser = await User.findById(req.user.id)
//       .select('-password')
//       .populate('company', 'companyName businessEmail verificationStatus');

//     // Fix image path for frontend
//     const userData = fixImagePath(updatedUser);

//     res.status(200).json({
//       success: true,
//       message: 'Profile picture removed successfully',
//       data: userData
//     });
//   } catch (error) {
//     console.error('Delete profile picture error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Update PayPal email
// // @route   PUT /api/profile/paypal
// // @access  Private
// router.put('/paypal', protect, async (req, res) => {
//   try {
//     const { paypalEmail } = req.body;
    
//     if (!paypalEmail) {
//       return res.status(400).json({
//         success: false,
//         message: 'PayPal email is required'
//       });
//     }

//     // Basic email validation
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(paypalEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid PayPal email'
//       });
//     }

//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     user.paypalEmail = paypalEmail;
//     user.paypalVerified = false; // Reset verification when email changes
//     await user.save();

//     const updatedUser = await User.findById(req.user.id)
//       .select('-password')
//       .populate('company', 'companyName businessEmail verificationStatus');

//     // Fix image path for frontend
//     const userData = fixImagePath(updatedUser);

//     res.status(200).json({
//       success: true,
//       message: 'PayPal email updated successfully',
//       data: userData
//     });
//   } catch (error) {
//     console.error('Update PayPal email error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Error handling middleware for multer
// router.use((error, req, res, next) => {
//   console.error('🛑 Multer error:', error);
  
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File too large. Maximum size is 5MB.'
//       });
//     }
//   } else if (error.message === 'Only image files are allowed!') {
//     return res.status(400).json({
//       success: false,
//       message: 'Only image files (JPEG, PNG, GIF) are allowed.'
//     });
//   }
  
//   res.status(500).json({
//     success: false,
//     message: 'Server error: ' + error.message
//   });
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure upload directory exists
const ensureUploadDir = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadPath}`);
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-pictures/';
    
    // Ensure directory exists
    ensureUploadDir(uploadDir);
    
    console.log(`📁 Saving file to: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userid-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = req.user.id + '-' + uniqueSuffix + fileExtension;
    
    console.log(`📄 Generated filename: ${fileName}`);
    cb(null, fileName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  console.log(`🔍 Checking file type: ${file.mimetype}`);
  
  if (file.mimetype.startsWith('image/')) {
    console.log('✅ File type accepted');
    cb(null, true);
  } else {
    console.log('❌ File type rejected - not an image');
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Helper function to fix image paths for frontend
const fixImagePath = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  
  if (userObj.profilePicture) {
    // Replace backslashes with forward slashes for URLs
    userObj.profilePicture = userObj.profilePicture.replace(/\\/g, '/');
    
    // Remove any leading slashes that might cause issues
    userObj.profilePicture = userObj.profilePicture.replace(/^\/+/, '');
    
    console.log(`🖼️ Fixed image path: ${userObj.profilePicture}`);
  }
  
  return userObj;
};

// Helper function to safely delete file
const safeDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
    } else {
      console.log(`⚠️ File not found for deletion: ${filePath}`);
    }
  } catch (error) {
    console.error('❌ Error deleting file:', error);
  }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    console.log('👤 GET /api/profile - Fetching user profile');
    
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('company', 'companyName businessEmail verificationStatus');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fix image path for frontend
    const userData = fixImagePath(user);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { name, phone, bio, location, paypalEmail } = req.body;
    
    console.log('📝 Updating profile with data:', { name, phone, bio, location, paypalEmail });
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (paypalEmail !== undefined) user.paypalEmail = paypalEmail;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('company', 'companyName businessEmail verificationStatus');

    // Fix image path for frontend
    const userData = fixImagePath(updatedUser);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update profile picture
// @route   PUT /api/profile/picture
// @access  Private
router.put('/picture', protect, upload.single('profilePicture'), async (req, res) => {
  console.log('🚀 PUT /api/profile/picture - Starting upload process');
  
  try {
    console.log('📦 Request details:', {
      hasFile: !!req.file,
      file: req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      } : 'No file',
      user: req.user ? { id: req.user.id, email: req.user.email } : 'No user'
    });

    if (!req.file) {
      console.log('❌ No file received in request');
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    console.log('👤 Finding user in database...');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('❌ User not found in database');
      // Delete the uploaded file if user not found
      safeDeleteFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.email);

    // Delete old profile picture if exists
    if (user.profilePicture) {
      console.log(`🗑️ Deleting old profile picture: ${user.profilePicture}`);
      const oldImagePath = user.profilePicture.replace(/\\/g, '/');
      safeDeleteFile(oldImagePath);
    }

    // Update user's profile picture
    console.log(`💾 Saving new profile picture path: ${req.file.path}`);
    user.profilePicture = req.file.path;
    
    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully');

    // Return updated user without password
    console.log('🔄 Fetching updated user data...');
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('company', 'companyName businessEmail verificationStatus');

    // Fix image path for frontend
    const userData = fixImagePath(updatedUser);

    console.log('🎉 Profile picture update completed successfully');
    console.log('📸 New profile picture path:', userData.profilePicture);

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: userData
    });

  } catch (error) {
    console.error('💥 Upload error:', error);
    
    // Delete the uploaded file if error occurred
    if (req.file) {
      console.log('🗑️ Cleaning up uploaded file due to error');
      safeDeleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// @desc    Delete profile picture
// @route   DELETE /api/profile/picture
// @access  Private
router.delete('/picture', protect, async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/profile/picture - Removing profile picture');
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User found:', user.email);
    console.log('📸 Current profile picture:', user.profilePicture);

    // Delete the image file if it exists locally
    if (user.profilePicture) {
      const imagePath = user.profilePicture.replace(/\\/g, '/');
      safeDeleteFile(imagePath);
    }

    // Clear profile picture field
    user.profilePicture = null;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('company', 'companyName businessEmail verificationStatus');

    // Fix image path for frontend
    const userData = fixImagePath(updatedUser);

    console.log('✅ Profile picture removed successfully');

    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully',
      data: userData
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update PayPal email
// @route   PUT /api/profile/paypal
// @access  Private
router.put('/paypal', protect, async (req, res) => {
  try {
    const { paypalEmail } = req.body;
    
    console.log('💰 Updating PayPal email:', paypalEmail);
    
    if (!paypalEmail) {
      return res.status(400).json({
        success: false,
        message: 'PayPal email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(paypalEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid PayPal email'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.paypalEmail = paypalEmail;
    user.paypalVerified = false; // Reset verification when email changes
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('company', 'companyName businessEmail verificationStatus');

    // Fix image path for frontend
    const userData = fixImagePath(updatedUser);

    res.status(200).json({
      success: true,
      message: 'PayPal email updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update PayPal email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user profile by ID (for public viewing)
// @route   GET /api/profile/:userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('👤 GET /api/profile/:userId - Fetching public profile for:', userId);
    
    const user = await User.findById(userId)
      .select('name profilePicture bio location socialMedia createdAt')
      .populate('company', 'companyName verificationStatus');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fix image path for frontend
    const userData = fixImagePath(user);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  console.error('🛑 Multer error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  } else if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG, GIF) are allowed.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Server error: ' + error.message
  });
});

module.exports = router;