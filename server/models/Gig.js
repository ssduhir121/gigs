// const mongoose = require('mongoose');

// const gigSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please add a title'],
//     trim: true,
//     maxlength: [100, 'Title cannot be more than 100 characters']
//   },
//   description: {
//     type: String,
//     required: [true, 'Please add a description'],
//     maxlength: [500, 'Description cannot be more than 500 characters']
//   },
//   link: {
//     type: String,
//     required: [true, 'Please add a link'],
//     match: [
//       /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
//       'Please use a valid URL with HTTP or HTTPS'
//     ]
//   },
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   budget: {
//     type: Number,
//     required: [true, 'Please add a budget'],
//     min: [15, 'Minimum gig amount must be $15']
//   },
//   sharesRequired: {
//     type: Number,
//     required: [true, 'Please specify number of shares required'],
//     min: [1, 'Shares required must be at least 1']
//   },
//   sharesCompleted: {
//     type: Number,
//     default: 0
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['paypal', 'wallet'],
//     default: 'paypal'
//   },
//   paypalOrderId: {
//     type: String
//   },
//   payerEmail: {
//     type: String
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   // ✅ ADD THESE CRITICAL FIELDS
//   availableFunds: {
//     type: Number,
//     default: 0
//   },
//   platformFee: {
//     type: Number,
//     default: 0
//   },
//   totalClicks: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Gig', gigSchema);


// models/Gig.js
const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  link: {
    type: String,
    required: [true, 'Please add a link or media URL'],
    // Updated validation to support both URLs and file paths
    validate: {
      validator: function(v) {
        // Allow both URLs and file paths for uploaded media
        if (this.contentType === 'link') {
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v);
        }
        return true; // For image/video, any string is acceptable as it could be a file path
      },
      message: 'Please use a valid URL for links'
    }
  },
  // ✅ NEW FIELDS FOR CONTENT TYPE SUPPORT
  contentType: {
    type: String,
    enum: ['link', 'image', 'video'],
    default: 'link',
    required: true
  },
  mediaFileName: {
    type: String,
    trim: true,
    maxlength: [255, 'File name too long']
  },
  mediaFileSize: {
    type: Number, // Size in bytes
    min: 0
  },
  mediaMimeType: {
    type: String,
    trim: true
  },
  // ✅ EXISTING FIELDS (keep these)
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [15, 'Minimum gig amount must be $15']
  },
  sharesRequired: {
    type: Number,
    required: [true, 'Please specify number of shares required'],
    min: [1, 'Shares required must be at least 1']
  },
  sharesCompleted: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'wallet'],
    default: 'paypal'
  },
  paypalOrderId: {
    type: String
  },
  payerEmail: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  availableFunds: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  // ✅ NEW FIELD FOR TRACKING MEDIA VIEWS
  totalViews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
gigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for amount per share
gigSchema.virtual('amountPerShare').get(function() {
  return this.budget / this.sharesRequired;
});

// Virtual for checking if gig is fully funded
gigSchema.virtual('isFullyFunded').get(function() {
  return this.availableFunds >= this.budget;
});

// Virtual for progress percentage
gigSchema.virtual('progressPercentage').get(function() {
  return (this.sharesCompleted / this.sharesRequired) * 100;
});

module.exports = mongoose.model('Gig', gigSchema);