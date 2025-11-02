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
    required: [true, 'Please add a link'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [1, 'Budget must be at least $1']
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
  paymentIntentId: {
    type: String
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  uniqueClicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gig', gigSchema);