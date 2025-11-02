const mongoose = require('mongoose');
const User = require('../models/User.js');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gigshare.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@gigshare.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully');
      console.log('Email: admin@gigshare.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();