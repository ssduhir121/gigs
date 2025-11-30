// models/ServiceGig.js
const mongoose = require('mongoose');

const serviceGigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [5, 'Minimum price is $5']
  },
  image: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold'],
    default: 'active'
  },
  category: {
    type: String,
    enum: [
      'web-development',
      'graphic-design', 
      'digital-marketing',
      'writing-translation',
      'video-animation',
      'music-audio',
      'programming-tech',
      'business',
      'lifestyle',
      'other'
    ],
    default: 'other'
  },
  deliveryTime: {
    type: Number, // in days
    default: 7
  },
  revisions: {
    type: Number,
    default: 1
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  ordersCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
serviceGigSchema.index({ user: 1, createdAt: -1 });
serviceGigSchema.index({ status: 1, createdAt: -1 });
serviceGigSchema.index({ category: 1, status: 1 });
serviceGigSchema.index({ price: 1, status: 1 });

// Virtual for formatted price
serviceGigSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for delivery time text
serviceGigSchema.virtual('deliveryText').get(function() {
  if (this.deliveryTime === 1) return '24 Hours';
  if (this.deliveryTime <= 7) return `${this.deliveryTime} Days`;
  if (this.deliveryTime <= 30) return `${Math.ceil(this.deliveryTime / 7)} Weeks`;
  return `${Math.ceil(this.deliveryTime / 30)} Months`;
});

// Static method to get active gigs by user
serviceGigSchema.statics.getActiveGigsByUser = function(userId) {
  return this.find({ user: userId, status: 'active' })
    .populate('user', 'name email rating')
    .sort({ createdAt: -1 });
};

// Instance method to check if gig can be ordered
serviceGigSchema.methods.canBeOrdered = function() {
  return this.status === 'active';
};

module.exports = mongoose.model('ServiceGig', serviceGigSchema);