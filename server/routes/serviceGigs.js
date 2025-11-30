// routes/serviceGigs.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const ServiceGig = require('../models/ServiceGig');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/service-gigs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for service gig images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gig-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create service gig
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    // Validate required fields
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and price are required'
      });
    }

    if (parseFloat(price) < 5) {
      return res.status(400).json({
        success: false,
        message: 'Minimum price is $5'
      });
    }

    // Prepare gig data
    const gigData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      user: req.user.id,
      status: 'active'
    };

    // Add image if uploaded
    if (req.file) {
      gigData.image = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/service-gigs/${req.file.filename}`
      };
    }

    // Create gig
    const gig = await ServiceGig.create(gigData);

    // Populate user data
    await gig.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Service gig created successfully',
      data: gig
    });

  } catch (error) {
    console.error('Create service gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service gig',
      error: error.message
    });
  }
});

// Get all service gigs (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, minPrice, maxPrice } = req.query;
    
    const query = { status: 'active' };
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const gigs = await ServiceGig.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ServiceGig.countDocuments(query);

    res.json({
      success: true,
      data: gigs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get service gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service gigs'
    });
  }
});

// Get single service gig
router.get('/:id', async (req, res) => {
  try {
    const gig = await ServiceGig.findById(req.params.id)
      .populate('user', 'name email rating');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Service gig not found'
      });
    }

    res.json({
      success: true,
      data: gig
    });
  } catch (error) {
    console.error('Get service gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service gig'
    });
  }
});

// Get user's service gigs
router.get('/user/my-gigs', protect, async (req, res) => {
  try {
    const gigs = await ServiceGig.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: gigs
    });
  } catch (error) {
    console.error('Get user gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your service gigs'
    });
  }
});

// Update service gig
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const gig = await ServiceGig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Service gig not found'
      });
    }

    // Check ownership
    if (gig.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    const updates = { ...req.body };
    
    // Handle image update
    if (req.file) {
      updates.image = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/service-gigs/${req.file.filename}`
      };
      
      // Delete old image file if exists
      if (gig.image && gig.image.filename) {
        const oldImagePath = path.join(uploadsDir, gig.image.filename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedGig = await ServiceGig.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Service gig updated successfully',
      data: updatedGig
    });
  } catch (error) {
    console.error('Update service gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service gig'
    });
  }
});

// Delete service gig
router.delete('/:id', protect, async (req, res) => {
  try {
    const gig = await ServiceGig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Service gig not found'
      });
    }

    // Check ownership
    if (gig.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    // Delete image file if exists
    if (gig.image && gig.image.filename) {
      const imagePath = path.join(uploadsDir, gig.image.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await ServiceGig.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service gig deleted successfully'
    });
  } catch (error) {
    console.error('Delete service gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service gig'
    });
  }
});

module.exports = router;