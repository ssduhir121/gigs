const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ✅ CREATE UPLOADS DIRECTORY IF IT DOESN'T EXIST
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads directory created');
}

// Configure multer for media uploads
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ FIXED: Improved file filter that accepts both images and videos
const mediaFileFilter = (req, file, cb) => {
  console.log('📁 File upload attempt:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    bodyType: req.body.type // Debug what type is being sent
  });

  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
  
  // ✅ ACCEPT BOTH IMAGES AND VIDEOS FOR GIG MEDIA
  if (imageTypes.includes(file.mimetype) || videoTypes.includes(file.mimetype)) {
    console.log('✅ File type accepted:', file.mimetype);
    cb(null, true);
  } else {
    console.log('❌ File type rejected:', file.mimetype);
    cb(new Error(`Invalid file type. Supported types: ${[...imageTypes, ...videoTypes].join(', ')}`), false);
  }
};

const mediaUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Configure multer for submission uploads (images only)
const submissionUpload = multer({
  storage: mediaStorage,
  fileFilter: (req, file, cb) => {
    console.log('📁 Submission file upload:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (imageTypes.includes(file.mimetype)) {
      console.log('✅ Submission image accepted');
      cb(null, true);
    } else {
      console.log('❌ Submission image rejected');
      cb(new Error('Only image files are allowed for submissions (JPEG, PNG, GIF, WebP)'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for submissions
  }
});

// ✅ IMPROVED: Upload media endpoint with better error handling
router.post('/media', (req, res, next) => {
  console.log('📤 Media upload request received:', {
    body: req.body,
    headers: req.headers
  });
  
  mediaUpload.single('file')(req, res, function(err) {
    if (err) {
      console.error('❌ Upload error:', err.message);
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      console.log('✅ File uploaded successfully:', {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimetype: req.file.mimetype,
        fileUrl: fileUrl
      });
      
      res.json({
        success: true,
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('❌ Upload processing error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process uploaded file' 
      });
    }
  });
});

// ✅ IMPROVED: Upload submission proof endpoint
router.post('/submission', (req, res, next) => {
  console.log('📤 Submission upload request received');
  
  submissionUpload.single('file')(req, res, function(err) {
    if (err) {
      console.error('❌ Submission upload error:', err.message);
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      console.log('✅ Submission file uploaded successfully:', {
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
      
      res.json({
        success: true,
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
    } catch (error) {
      console.error('❌ Submission upload processing error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process uploaded file' 
      });
    }
  });
});

// ✅ ADD: Serve uploaded files statically
router.use('/files', express.static(uploadsDir));

module.exports = router;