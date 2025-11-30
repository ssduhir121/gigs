// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  businessEmail: {
    type: String,
    required: [true, 'Please add a business email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Please select an industry'],
    enum: [
      'technology', 'ecommerce', 'healthcare', 'education', 'finance', 
      'entertainment', 'real_estate', 'travel', 'food_beverage', 'other'
    ]
  },

  
  companySize: {
    type: String,
    required: [true, 'Please select company size'],
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  taxId: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Please add contact person name']
    },
    position: String,
    phone: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  companyLogo: {
    type: String // URL to uploaded logo
  },
  billingPreferences: {
    paymentMethod: {
      type: String,
      enum: ['paypal', 'bank_transfer', 'credit_card'],
      default: 'paypal'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    },
    autoReplenish: {
      type: Boolean,
      default: false
    },
    creditLimit: {
      type: Number,
      default: 1000
    }
  },
  teamMembers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner','admin', 'manager', 'member'],
      default: 'member'
    },
    
    permissions: [String],
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending'
    }
  }],
  // 💰 PHASE 2: Advanced billing features (commented)
  /*
  billingHistory: [{
    invoiceId: String,
    amount: Number,
    period: String,
    status: String,
    dueDate: Date,
    paidAt: Date
  }],
  subscription: {
    plan: String,
    features: [String],
    expiresAt: Date
  }
  */
}, {
  timestamps: true
});

// Indexes
companySchema.index({ businessEmail: 1 });
companySchema.index({ verificationStatus: 1 });
companySchema.index({ 'teamMembers.user': 1 });

// Virtual for active team members count
companySchema.virtual('activeTeamMembers').get(function() {
  return this.teamMembers.filter(member => member.status === 'active').length;
});

// Virtual for pending invitations count
companySchema.virtual('pendingInvitations').get(function() {
  return this.teamMembers.filter(member => member.status === 'pending').length;
});

module.exports = mongoose.model('Company', companySchema);