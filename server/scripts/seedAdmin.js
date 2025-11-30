const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ email: 'admin@gigshare.com' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: 'Admin User',
        email: 'admin@gigshare.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });

      console.log("Admin user created:");
      console.log("Email: admin@gigshare.com");
      console.log("Password: admin123");
    } else {
      console.log("Admin already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
