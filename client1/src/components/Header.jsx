import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import logo from "../assets/logo.png"
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  WalletIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Browse Gigs', href: '/gigs', current: location.pathname === '/gigs' },
    ...(isAuthenticated ? [
      { name: 'My Gigs', href: '/my-gigs', current: location.pathname === '/my-gigs' },
      { name: 'Create Gig', href: '/create-gig', current: location.pathname === '/create-gig' },
    ] : []),
    ...(user?.role === 'admin' ? [
      { name: 'Admin', href: '/admin', current: location.pathname === '/admin' },
    ] : []),
  ];

  const userNavigation = [
    { name: 'My Wallet', href: '/wallet', icon: WalletIcon },
    // { name: 'My Profile', href: '/profile', icon: UserCircleIcon },
    // { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    toast.success('Logged out successfully');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
       
            <Link to="/" className="flex-shrink-0 flex items-center group">
  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
    <img src={logo} alt="SPS" className="w-8 h-8" />
  </div>
  <div className="flex flex-col">
    <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
      SOCIAL POSTS SHARERS
    </span>
    <span className="text-xs text-primary-600 font-medium tracking-wide -mt-1">
      Empower.Share.Earn
    </span>
  </div>
</Link>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-50 text-primary-700 border-primary-500 shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 border-transparent'
                  } px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 flex items-center group`}
                >
                  {item.name}
                  {item.current && (
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full ml-2"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop menu - right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Balance display */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200/60 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      ${user?.walletBalance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* User profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 bg-white rounded-xl px-3 py-2 hover:bg-gray-50 border border-gray-200/60 shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <ChevronDownIcon 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white/95 backdrop-blur-md border border-gray-200/60 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-blue-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {/* Navigation */}
                      <div className="py-2">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <item.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary-500" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      
                      {/* Logout */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 border-l-4 border-transparent'
                } block px-3 py-2 rounded-r-lg text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                {/* Balance */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Balance</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ${user?.walletBalance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="px-3 py-2 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  {/* User Navigation */}
                  <div className="space-y-1">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-2 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors duration-200 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-base font-medium text-center hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;