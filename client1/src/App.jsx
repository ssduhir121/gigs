import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/gigs" replace />;
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

// 404 Not Found Component
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">😕</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => window.history.back()} 
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/gigs" replace />} />
              <Route path="/gigs" element={<GigList />} />
              <Route path="/gigs/:id" element={<GigDetail />} />
              <Route path="/track-share/:trackingToken" element={<TrackShare />} />
              
              {/* Auth Routes (Public only) */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/create-gig" element={
                <ProtectedRoute>
                  <CreateGig />
                </ProtectedRoute>
              } />
              <Route path="/my-gigs" element={
                <ProtectedRoute>
                  <MyGigs />
                </ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } />

              {/* Admin Only Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* React Hot Toast Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
              error: {
                duration: 5000,
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;