// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');     // FIXED
// const path = require('path'); 
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const connectDB = require('./config/database.js');
// const errorHandler = require('./middleware/errorHandler.js');
// const withdrawalRoutes = require('./routes/withdrawalRoutes');
// const paypalRoutes = require('./routes/paypalRoutes');
// const submissionRoutes = require("./routes/submissions.js")
// require('dotenv').config();

// // Route files
// const auth = require('./routes/auth.js');
// const gigs = require('./routes/gigs.js');
// const admin = require('./routes/admin.js');
// const wallet = require('./routes/wallet');

// // Connect to database
// connectDB();

// const app = express();

// // Security headers
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // Body parser
// app.use(express.json());


// const submissionStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Save to main uploads directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });
// // CORS
// // CORS
// // CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://gigs-eight.vercel.app",
//   "https://gigs-l5uh.onrender.com",
//   "*"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



// // Mount routers
// app.use('/api/auth', auth);
// app.use('/api/gigs', gigs);
// app.use('/api/admin', admin);
// app.use('/api/wallet', wallet);
// app.use('/api/withdrawals', withdrawalRoutes);
// app.use('/api/paypal', paypalRoutes);
// app.use('/api/submission', submissionRoutes)
// app.use('/uploads', express.static('uploads'));
// app.use('/api/submission', submissionRoutes);
// // Error handler
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });


const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database.js');
const errorHandler = require('./middleware/errorHandler.js');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const paypalRoutes = require('./routes/paypalRoutes');
const submissionRoutes = require("./routes/submissions.js");
const companyRoutes = require("./routes/company.js")
const serviceGigsRoutes = require('./routes/serviceGigs');
const privateGigsRoutes = require('./routes/privateGigs');
const applicationsRoutes = require('./routes/applications');
const invitationRoutes =  require('./routes/invitations.js')
const profileRoutes = require('./routes/profile');
// Route files
const notifications = require('./routes/notifications');
const auth = require('./routes/auth.js');
const gigs = require('./routes/gigs.js');
const admin = require('./routes/admin.js');
const wallet = require('./routes/wallet');
const upload = require('./routes/upload.js'); // ✅ ADD THIS LINE

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gigs-eight.vercel.app",
  "https://gigs-l5uh.onrender.com",
  "*"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/gigs', gigs);
app.use('/api/gigs', privateGigsRoutes); // This extends the existing gigs routes
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', admin);
app.use('/api/wallet', wallet);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/upload', upload); // ✅ ADD THIS LINE
app.use('/api/company', companyRoutes)
app.use('/api/service-gigs', serviceGigsRoutes);
app.use('/api/profile', profileRoutes);
// Add this to your routes in server.js
app.use('/api/invitations', invitationRoutes);
// app.use('/uploads', cors(), express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Set proper headers for images
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    }
  }
}));
app.use('/api/notifications', notifications);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});