
// // export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { Toaster } from 'react-hot-toast';
// import Header from './components/Header';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import CreateGig from './pages/CreateGig';
// import AdminDashboard from './pages/AdminDashboard';
// import GigList from './pages/GigList';
// import GigDetail from './pages/GigDetail';
// import MyGigs from './pages/MyGigs';
// import Wallet from './pages/Wallet';
// import TrackShare from './components/TrackShare';
// import VerifySubmissions from './pages/VerifySubmissions';
// import Notifications from './pages/Notifications';
// import ServiceGigcreator from './pages/ServiceGigCreatror';
// import Footer from './components/Footer';
// import Home from './pages/Home';

// // ✅ COMPANY PAGES
// import CompanyDashboard from './pages/CompanyDashboard';
// import CompanyRegister from './pages/CompanyRegister';

// // ✅ NEW: My Invitations page
// import MyInvitations from './pages/MyInvitations';

// // Loading Component
// const LoadingSpinner = () => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//     <div className="flex flex-col items-center space-y-4">
//       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       <p className="text-gray-600 text-sm font-medium">Loading...</p>
//     </div>
//   </div>
// );

// // Protected Route Component
// const ProtectedRoute = ({ children, adminOnly = false, requireCompany = false }) => {
//   const { isAuthenticated, user, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && user?.role !== 'admin') {
//     return <Navigate to="/gigs" replace />;
//   }

//   if (requireCompany && !user?.company) {
//     return <Navigate to="/company/register" replace />;
//   }

//   return children;
// };

// // Public Route Component (redirect if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/gigs" replace />;
//   }

//   return children;
// };

// // Company Route Component (accessible to all)
// const CompanyRoute = ({ children }) => {
//   const { loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return children;
// };

// // 404 Not Found Component
// const NotFound = () => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//     <div className="text-center max-w-md">
//       <div className="text-6xl mb-6">😕</div>
//       <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
//       <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
//       <button 
//         onClick={() => window.history.back()} 
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
//       >
//         Go Back
//       </button>
//     </div>
//   </div>
// );

// // Main Layout Component (now used for all pages including auth)
// const MainLayout = ({ children }) => (
//   <div className="min-h-screen bg-gray-50 flex flex-col">
//     <Header />
//     <main className="flex-1">{children}</main>
//     <Footer />
//   </div>
// );

// function App() {
//   return (
//     <AuthProvider>
//       <NotificationProvider>
//         <Router>
//           <div className="App">
//             <Routes>
//               {/* Home Page with Main Layout */}
//               <Route path="/" element={
//                 <MainLayout>
//                   <Home />
//                 </MainLayout>
//               } />
              
//               {/* Public Routes with Main Layout */}
//               <Route path="/gigs" element={
//                 <MainLayout>
//                   <GigList />
//                 </MainLayout>
//               } />
//               <Route path="/gigs/:id" element={
//                 <MainLayout>
//                   <GigDetail />
//                 </MainLayout>
//               } />
//               <Route path="/track-share/:trackingToken" element={
//                 <MainLayout>
//                   <TrackShare />
//                 </MainLayout>
//               } />

//               {/* Auth Routes with Main Layout (now includes header) */}
//               <Route path="/login" element={
//                 <PublicRoute>
//                   <MainLayout>
//                     <Login />
//                   </MainLayout>
//                 </PublicRoute>
//               } />
//               <Route path="/register" element={
//                 <PublicRoute>
//                   <MainLayout>
//                     <Register />
//                   </MainLayout>
//                 </PublicRoute>
//               } />

//               {/* Company Routes with Main Layout */}
//               <Route path="/company/register" element={
//                 <CompanyRoute>
//                   <MainLayout>
//                     <CompanyRegister />
//                   </MainLayout>
//                 </CompanyRoute>
//               } />
//               <Route path="/company/dashboard" element={
//                 <ProtectedRoute requireCompany={true}>
//                   <MainLayout>
//                     <CompanyDashboard />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />

//               {/* Protected Routes with Main Layout */}
//               <Route path="/create-gig" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <CreateGig />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/create-service-gig" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <ServiceGigcreator />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/my-gigs" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <MyGigs />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/wallet" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <Wallet />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/verify-submissions" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <VerifySubmissions />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/notifications" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <Notifications />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />
              
//               {/* ✅ NEW: My Invitations Route */}
//               <Route path="/my-invitations" element={
//                 <ProtectedRoute>
//                   <MainLayout>
//                     <MyInvitations />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />

//               {/* Admin Routes */}
//               <Route path="/admin" element={
//                 <ProtectedRoute adminOnly={true}>
//                   <MainLayout>
//                     <AdminDashboard />
//                   </MainLayout>
//                 </ProtectedRoute>
//               } />

//               {/* 404 Catch All */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>

//             {/* React Hot Toast Container */}
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   background: '#1F2937',
//                   color: '#F9FAFB',
//                   borderRadius: '8px',
//                   fontSize: '14px',
//                   padding: '12px 16px',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                 },
//                 success: {
//                   iconTheme: {
//                     primary: '#10B981',
//                     secondary: '#FFFFFF',
//                   },
//                   style: {
//                     background: '#065F46',
//                     color: '#FFFFFF',
//                   },
//                 },
//                 error: {
//                   iconTheme: {
//                     primary: '#EF4444',
//                     secondary: '#FFFFFF',
//                   },
//                   style: {
//                     background: '#7F1D1D',
//                     color: '#FFFFFF',
//                   },
//                   duration: 5000,
//                 },
//               }}
//             />
//           </div>
//         </Router>
//       </NotificationProvider>
//     </AuthProvider>
//   );
// }

// export default App;


// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import AdminDashboard from './pages/AdminDashboard';
import GigList from './pages/GigList';
import GigDetail from './pages/GigDetail';
import MyGigs from './pages/MyGigs';
import Wallet from './pages/Wallet';
import TrackShare from './components/TrackShare';
import VerifySubmissions from './pages/VerifySubmissions';
import Notifications from './pages/Notifications';
import ServiceGigcreator from './pages/ServiceGigCreatror';
import Footer from './components/Footer';
import Home from './pages/Home';

// ✅ COMPANY PAGES
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyRegister from './pages/CompanyRegister';

// ✅ NEW: My Invitations page
import MyInvitations from './pages/MyInvitations';

// ✅ ADD: Profile page
import Profile from './pages/profile.jsx';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, requireCompany = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/gigs" replace />;
  }

  if (requireCompany && !user?.company) {
    return <Navigate to="/company/register" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/gigs" replace />;
  }

  return children;
};

// Company Route Component (accessible to all)
const CompanyRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return children;
};

// 404 Not Found Component
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <button 
        onClick={() => window.history.back()} 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Main Layout Component (now used for all pages including auth)
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Home Page with Main Layout */}
              <Route path="/" element={
                <MainLayout>
                  <Home />
                </MainLayout>
              } />
              
              {/* Public Routes with Main Layout */}
              <Route path="/gigs" element={
                <MainLayout>
                  <GigList />
                </MainLayout>
              } />
              <Route path="/gigs/:id" element={
                <MainLayout>
                  <GigDetail />
                </MainLayout>
              } />
              <Route path="/track-share/:trackingToken" element={
                <MainLayout>
                  <TrackShare />
                </MainLayout>
              } />

              {/* Auth Routes with Main Layout (now includes header) */}
              <Route path="/login" element={
                <PublicRoute>
                  <MainLayout>
                    <Login />
                  </MainLayout>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <MainLayout>
                    <Register />
                  </MainLayout>
                </PublicRoute>
              } />

              {/* Company Routes with Main Layout */}
              <Route path="/company/register" element={
                <CompanyRoute>
                  <MainLayout>
                    <CompanyRegister />
                  </MainLayout>
                </CompanyRoute>
              } />
              <Route path="/company/dashboard" element={
                <ProtectedRoute requireCompany={true}>
                  <MainLayout>
                    <CompanyDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Protected Routes with Main Layout */}
              <Route path="/create-gig" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateGig />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/create-service-gig" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ServiceGigcreator />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/my-gigs" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyGigs />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Wallet />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/verify-submissions" element={
                <ProtectedRoute>
                  <MainLayout>
                    <VerifySubmissions />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* ✅ NEW: My Invitations Route */}
              <Route path="/my-invitations" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyInvitations />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* ✅ ADD: Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* React Hot Toast Container */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1F2937',
                  color: '#F9FAFB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                  style: {
                    background: '#065F46',
                    color: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                  style: {
                    background: '#7F1D1D',
                    color: '#FFFFFF',
                  },
                  duration: 5000,
                },
              }}
            />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;