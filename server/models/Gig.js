
// // models/Gig.js - UPDATED VERSION
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
//     required: [true, 'Please add a link or media URL'],
//     validate: {
//       validator: function(v) {
//         if (this.contentType === 'link') {
//           return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v);
//         }
//         return true;
//       },
//       message: 'Please use a valid URL for links'
//     }
//   },
//   contentType: {
//     type: String,
//     enum: ['link', 'image', 'video'],
//     default: 'link',
//     required: true
//   },
//   mediaFileName: {
//     type: String,
//     trim: true,
//     maxlength: [255, 'File name too long']
//   },
//   shareType: {
//     type: String,
//     enum: ['public', 'private'],
//     default: 'public',
//     required: true
//   },
  
//   // NEW: Private gig application system
//   privateSettings: {
//     requireApproval: {
//       type: Boolean,
//       default: true
//     },
//     maxApplicants: {
//       type: Number,
//       default: 50
//     },
//     applicationInstructions: {
//       type: String,
//       maxlength: 500
//     },
//     autoApprove: {
//       type: Boolean,
//       default: false
//     }
//   },
  
//   // NEW: Track applications
//   applications: [{
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending'
//     },
//     message: {
//       type: String,
//       maxlength: 500
//     },
//     appliedAt: {
//       type: Date,
//       default: Date.now
//     },
//     reviewedAt: Date,
//     reviewedBy: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User'
//     },
//     reviewNotes: String
//   }],
  
//   // NEW: Approved sharers
//   approvedSharers: [{
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     approvedAt: {
//       type: Date,
//       default: Date.now
//     },
//     approvedBy: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User'
//     },
//     notes: String
//   }],

//   // Existing fields
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   budget: {
//     type: Number,
//     required: [true, 'Please add a budget'],
//     min: [15, 'Minimum gig amount is $15']
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
//     enum: ['pending', 'completed', 'failed', 'refunded'],
//     default: 'pending'
//   },
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
//   totalViews: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Update the updatedAt field before saving
// gigSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Virtuals
// gigSchema.virtual('amountPerShare').get(function() {
//   if (this.sharesRequired > 0) {
//     return this.availableFunds / this.sharesRequired;
//   }
//   return 0;
// });

// gigSchema.virtual('progressPercentage').get(function() {
//   if (this.sharesRequired > 0) {
//     return (this.sharesCompleted / this.sharesRequired) * 100;
//   }
//   return 0;
// });

// gigSchema.virtual('remainingShares').get(function() {
//   return Math.max(0, this.sharesRequired - this.sharesCompleted);
// });

// gigSchema.virtual('isCompleted').get(function() {
//   return this.sharesCompleted >= this.sharesRequired;
// });

// // NEW: Application stats virtual
// // gigSchema.virtual('applicationStats').get(function() {
// //   const pending = this.applications.filter(app => app.status === 'pending').length;
// //   const approved = this.applications.filter(app => app.status === 'approved').length;
// //   const rejected = this.applications.filter(app => app.status === 'rejected').length;
  
// //   return { pending, approved, rejected, total: this.applications.length };
// // });

// // NEW: Application stats virtual - FIXED VERSION
// gigSchema.virtual('applicationStats').get(function() {
//   // Safely handle cases where applications might be undefined/null
//   const applications = this.applications || [];
  
//   const pending = applications.filter(app => app.status === 'pending').length;
//   const approved = applications.filter(app => app.status === 'approved').length;
//   const rejected = applications.filter(app => app.status === 'rejected').length;
  
//   return { 
//     pending, 
//     approved, 
//     rejected, 
//     total: applications.length 
//   };
// });

// // NEW: Methods for private gig management
// gigSchema.methods.canUserApply = function(userId) {
//   if (this.shareType !== 'private') return false;
//   if (!this.isActive) return false;
//   if (this.isCompleted) return false;
  
//   // Check if user already applied
//   const existingApplication = this.applications.find(app => 
//     app.user.toString() === userId.toString()
//   );
//   if (existingApplication) return false;
  
//   // Check if user is already approved
//   const isApproved = this.approvedSharers.find(sharer =>
//     sharer.user.toString() === userId.toString()
//   );
//   if (isApproved) return false;
  
//   // Check max applicants
//   if (this.applications.length >= this.privateSettings.maxApplicants) return false;
  
//   return true;
// };

// gigSchema.methods.canUserShare = function(userId) {
//   if (this.shareType === 'public') return true;
//   if (this.shareType === 'private') {
//     return this.approvedSharers.some(sharer =>
//       sharer.user.toString() === userId.toString()
//     );
//   }
//   return false;
// };

// gigSchema.methods.isUserApplied = function(userId) {
//   return this.applications.some(app => 
//     app.user.toString() === userId.toString()
//   );
// };

// gigSchema.methods.isUserApproved = function(userId) {
//   return this.approvedSharers.some(sharer =>
//     sharer.user.toString() === userId.toString()
//   );
// };

// // Indexes
// gigSchema.index({ user: 1, createdAt: -1 });
// gigSchema.index({ isActive: 1, shareType: 1, createdAt: -1 });
// gigSchema.index({ shareType: 1, isActive: 1 });
// gigSchema.index({ 'applications.user': 1 });
// gigSchema.index({ 'approvedSharers.user': 1 });

// module.exports = mongoose.model('Gig', gigSchema);


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
    validate: {
      validator: function(v) {
        if (this.contentType === 'link') {
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v);
        }
        return true;
      },
      message: 'Please use a valid URL for links'
    }
  },
  contentType: {
    type: String,
    enum: ['link', 'image', 'video'],
    default: 'link',
    required: true
  },
  mediaFile: {
    type: String,
    trim: true
  },
  mediaFileName: {
    type: String,
    trim: true,
    maxlength: [255, 'File name too long']
  },
  shareType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true
  },
  
  // Private gig application system
  privateSettings: {
    requireApproval: {
      type: Boolean,
      default: true
    },
    maxApplicants: {
      type: Number,
      default: 50
    },
    applicationInstructions: {
      type: String,
      maxlength: 500
    },
    autoApprove: {
      type: Boolean,
      default: false
    }
  },
  
  // Track applications
  applications: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    message: {
      type: String,
      maxlength: 500
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reviewNotes: String
  }],
  
  // Approved sharers
  approvedSharers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    approvedAt: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    notes: String
  }],

  // Existing fields
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [15, 'Minimum gig amount is $15']
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
  paypalTransaction: {
    orderId: String,
    payerEmail: String,
    payerId: String,
    amount: Number,
    status: String,
    captureId: String
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
gigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtuals
gigSchema.virtual('amountPerShare').get(function() {
  if (this.sharesRequired > 0) {
    return this.availableFunds / this.sharesRequired;
  }
  return 0;
});

gigSchema.virtual('progressPercentage').get(function() {
  if (this.sharesRequired > 0) {
    return (this.sharesCompleted / this.sharesRequired) * 100;
  }
  return 0;
});

gigSchema.virtual('remainingShares').get(function() {
  return Math.max(0, this.sharesRequired - this.sharesCompleted);
});

gigSchema.virtual('isCompleted').get(function() {
  return this.sharesCompleted >= this.sharesRequired;
});

// Application stats virtual
gigSchema.virtual('applicationStats').get(function() {
  const applications = this.applications || [];
  
  const pending = applications.filter(app => app.status === 'pending').length;
  const approved = applications.filter(app => app.status === 'approved').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  
  return { 
    pending, 
    approved, 
    rejected, 
    total: applications.length 
  };
});

// Methods for private gig management
gigSchema.methods.canUserApply = function(userId) {
  if (this.shareType !== 'private') return false;
  if (!this.isActive) return false;
  if (this.isCompleted) return false;
  
  // Check if user already applied
  const existingApplication = this.applications.find(app => 
    app.user.toString() === userId.toString()
  );
  if (existingApplication) return false;
  
  // Check if user is already approved
  const isApproved = this.approvedSharers.find(sharer =>
    sharer.user.toString() === userId.toString()
  );
  if (isApproved) return false;
  
  // Check max applicants
  if (this.applications.length >= this.privateSettings.maxApplicants) return false;
  
  return true;
};

gigSchema.methods.canUserShare = function(userId) {
  if (this.shareType === 'public') return true;
  if (this.shareType === 'private') {
    return this.approvedSharers.some(sharer =>
      sharer.user.toString() === userId.toString()
    );
  }
  return false;
};

gigSchema.methods.isUserApplied = function(userId) {
  return this.applications.some(app => 
    app.user.toString() === userId.toString()
  );
};

gigSchema.methods.isUserApproved = function(userId) {
  return this.approvedSharers.some(sharer =>
    sharer.user.toString() === userId.toString()
  );
};

// Indexes
gigSchema.index({ user: 1, createdAt: -1 });
gigSchema.index({ isActive: 1, shareType: 1, createdAt: -1 });
gigSchema.index({ shareType: 1, isActive: 1 });
gigSchema.index({ 'applications.user': 1 });
gigSchema.index({ 'approvedSharers.user': 1 });

module.exports = mongoose.model('Gig', gigSchema);