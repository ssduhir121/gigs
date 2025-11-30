

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';
// import logo from "../assets/logo.png"
// import NotificationBell from './NotificationBell';
// import { 
//   Bars3Icon, 
//   XMarkIcon,
//   ChevronDownIcon,
//   CurrencyDollarIcon,
//   WalletIcon,
//   CheckBadgeIcon,
//   BuildingOfficeIcon,
//   PlusCircleIcon,
//   ArrowRightOnRectangleIcon,
//   UserCircleIcon,
//   CogIcon,
//   ChartBarIcon,
//   InboxIcon
// } from '@heroicons/react/24/outline';

// // Import modal components
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import CompanyRegister from '../pages/CompanyRegister';

// const Header = () => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'company-register'
//   const location = useLocation();
//   const navigate = useNavigate();
//   const profileRef = useRef(null);
//   const mobileMenuRef = useRef(null);

//   const hasCompany = user?.company || user?.companyId;
//   const isCompanyUser = hasCompany && user?.companyRole;
//   const isRegularUser = isAuthenticated && !isCompanyUser && user?.role !== 'admin';

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle scroll for header effects
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollPosition(window.pageYOffset);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Modal wrapper component
//   const Modal = ({ children, onClose, wide = false }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-in fade-in-50">
//       <div className={`${wide ? 'max-w-[95vw] lg:max-w-6xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`}>
//         {children}
//       </div>
//     </div>
//   );

//   // Main navigation with proper accessibility
//   const navigation = [
//     { 
//       name: 'Browse Gigs', 
//       href: '/gigs', 
//       current: location.pathname === '/gigs',
//       description: 'Discover available campaigns'
//     },
//     ...(isAuthenticated ? [
//       { 
//         name: 'My Gigs', 
//         href: '/my-gigs', 
//         current: location.pathname === '/my-gigs',
//         description: 'Manage your active gigs'
//       },
//       { 
//         name: 'Create Gig', 
//         href: '/create-gig', 
//         current: location.pathname === '/create-gig',
//         description: 'Start a new campaign'
//       },
//       { 
//         name: 'Service Gig', 
//         href: '/create-service-gig', 
//         current: location.pathname === '/create-service-gig',
//         description: 'Create service-based gigs'
//       },
//       { 
//         name: 'Verify', 
//         href: '/verify-submissions', 
//         current: location.pathname === '/verify-submissions',
//         description: 'Review submissions'
//       },
//       // Add Invitations for regular users (no separate notification)
//       ...(isRegularUser ? [
//         { 
//           name: 'My Invitations', 
//           href: '/my-invitations', 
//           current: location.pathname === '/my-invitations',
//           description: 'Manage service gig invitations'
//         }
//       ] : []),
//       ...(isCompanyUser ? [
//         { 
//           name: 'Company', 
//           href: '/company/dashboard', 
//           current: location.pathname === '/company/dashboard',
//           description: 'Company dashboard'
//         }
//       ] : []),
//     ] : []),
//     ...(user?.role === 'admin' ? [
//       { 
//         name: 'Admin', 
//         href: '/admin', 
//         current: location.pathname === '/admin',
//         description: 'Administration panel'
//       },
//     ] : []),
//   ];

//   // User dropdown navigation
//   const userNavigation = [
//     { name: 'Wallet', href: '/wallet', icon: WalletIcon, description: 'Manage your earnings' },
//     { name: 'Verify', href: '/verify-submissions', icon: CheckBadgeIcon, description: 'Review submissions' },
//     { name: 'Service Gig', href: '/create-service-gig', icon: PlusCircleIcon, description: 'Create service gigs' },
//     // Add Invitations section for regular users (no badge)
//     ...(isRegularUser ? [
//       { 
//         name: 'My Invitations', 
//         href: '/my-invitations', 
//         icon: InboxIcon, 
//         description: 'Manage service gig invitations'
//       }
//     ] : []),
//     ...(isCompanyUser ? [
//       { name: 'Company', href: '/company/dashboard', icon: BuildingOfficeIcon, description: 'Company dashboard' }
//     ] : []),
//     { name: 'Profile', href: '/profile', icon: UserCircleIcon, description: 'Manage your account' },
//     ...(user?.role === 'admin' ? [
//       { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, description: 'View platform analytics' }
//     ] : []),
//   ];

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsProfileOpen(false);
//       setIsOpen(false);
//       toast.success('Logged out successfully');
//       navigate('/');
//     } catch (error) {
//       toast.error('Error logging out');
//     }
//   };

//   // Get user initials for avatar with fallback
//   const getUserInitials = () => {
//     if (!user?.name) return 'U';
//     return user.name
//       .split(' ')
//       .map(n => n.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Format wallet balance with proper error handling
//   const formatBalance = () => {
//     try {
//       const balance = user?.walletBalance?.$numberDecimal || user?.walletBalance || 0;
//       return Number(balance).toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });
//     } catch (error) {
//       return '0.00';
//     }
//   };

//   // Close mobile menu when navigating
//   const handleMobileLinkClick = () => {
//     setIsOpen(false);
//   };

//   // Handle profile dropdown keyboard navigation
//   const handleProfileKeyDown = (e) => {
//     if (e.key === 'Escape') {
//       setIsProfileOpen(false);
//     }
//   };

//   // Handle mobile menu keyboard navigation
//   const handleMobileMenuKeyDown = (e) => {
//     if (e.key === 'Escape') {
//       setIsOpen(false);
//     }
//   };

//   // Handle modal open/close
//   const handleModalOpen = (modalType) => {
//     setActiveModal(modalType);
//     setIsOpen(false);
//     setIsProfileOpen(false);
//   };

//   const handleModalClose = () => {
//     setActiveModal(null);
//   };

//   const headerClass = scrollPosition > 10 
//     ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/80 sticky top-0 z-50 transition-all duration-300"
//     : "bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300";

//   return (
//     <>
//       {/* Modals */}
//       {activeModal === 'login' && (
//         <Modal onClose={handleModalClose}>
//           <Login 
//             onClose={handleModalClose}
//             onSwitchToRegister={() => setActiveModal('register')}
//             onSwitchToCompanyRegister={() => setActiveModal('company-register')}
//           />
//         </Modal>
//       )}

//       {activeModal === 'register' && (
//         <Modal onClose={handleModalClose}>
//           <Register 
//             onClose={handleModalClose}
//             onSwitchToLogin={() => setActiveModal('login')}
//             onSwitchToCompanyRegister={() => setActiveModal('company-register')}
//           />
//         </Modal>
//       )}

//       {activeModal === 'company-register' && (
//         <Modal onClose={handleModalClose} wide={true}>
//           <CompanyRegister 
//             onClose={handleModalClose}
//             onSwitchToLogin={() => setActiveModal('login')}
//             onSwitchToRegister={() => setActiveModal('register')}
//           />
//         </Modal>
//       )}

//       <nav className={headerClass}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             {/* Logo and main navigation */}
//             <div className="flex items-center">
//               <Link 
//                 to="/" 
//                 className="flex-shrink-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200"
//                 aria-label="Social Posts Sharers Home"
//               >
//                 <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
//                   <img 
//                     src={logo} 
//                     alt="SPS" 
//                     className="w-5 h-5 filter brightness-0 invert"
//                     loading="eager"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
//                     SOCIAL POSTS SHARERS
//                   </span>
//                   <span className="text-xs text-gray-500 font-medium -mt-1 group-hover:text-blue-500 transition-colors duration-200">
//                     Empower.Share.Earn
//                   </span>
//                 </div>
//               </Link>
              
//               {/* Desktop Navigation */}
//               <nav className="hidden md:ml-8 md:flex md:space-x-1" aria-label="Main navigation">
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`${
//                       item.current
//                         ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
//                         : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-transparent'
//                     } px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 flex items-center group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//                     aria-current={item.current ? 'page' : undefined}
//                     title={item.description}
//                   >
//                     {item.name}
//                     {item.current && (
//                       <div 
//                         className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-2 animate-pulse"
//                         aria-hidden="true"
//                       />
//                     )}
//                   </Link>
//                 ))}
//               </nav>
//             </div>

//             {/* Desktop menu - right side */}
//             <div className="hidden md:flex items-center space-x-3">
//               {isAuthenticated ? (
//                 <div className="flex items-center space-x-3">
//                   {/* Balance display */}
//                   <div 
//                     className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-default"
//                     title="Your current balance"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
//                       <span className="text-sm font-semibold text-gray-900 tabular-nums">
//                         ${formatBalance()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Company Badge */}
//                   {isCompanyUser && (
//                     <div 
//                       className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors duration-200 cursor-default"
//                       title={`Company ${user.companyRole}`}
//                     >
//                       <div className="flex items-center space-x-2">
//                         <BuildingOfficeIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
//                         <span className="text-sm font-semibold text-orange-700 capitalize">
//                           {user.companyRole}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {/* Single Notification Bell - Handles ALL notifications including invitations */}
//                   <NotificationBell />

//                   {/* User profile dropdown */}
//                   <div className="relative" ref={profileRef}>
//                     <button
//                       onClick={() => setIsProfileOpen(!isProfileOpen)}
//                       onKeyDown={handleProfileKeyDown}
//                       className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                       aria-expanded={isProfileOpen}
//                       aria-haspopup="true"
//                       aria-label="User menu"
//                     >
//                       <div 
//                         className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
//                         title={user?.name || 'User'}
//                       >
//                         {getUserInitials()}
//                       </div>
//                       <ChevronDownIcon 
//                         className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
//                           isProfileOpen ? 'rotate-180' : ''
//                         }`}
//                         aria-hidden="true"
//                       />
//                     </button>

//                     {isProfileOpen && (
//                       <div 
//                         className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white border border-gray-200 divide-y divide-gray-100 overflow-hidden z-50 animate-in fade-in-80"
//                         role="menu"
//                         aria-orientation="vertical"
//                       >
//                         {/* User Info */}
//                         <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
//                           <p className="text-sm font-semibold text-gray-900 truncate" title={user.name}>
//                             {user.name}
//                           </p>
//                           <p className="text-sm text-gray-600 truncate" title={user.email}>
//                             {user.email}
//                           </p>
//                           {isCompanyUser && (
//                             <div className="flex items-center mt-2">
//                               <BuildingOfficeIcon className="w-3 h-3 text-orange-600 mr-1 flex-shrink-0" />
//                               <span className="text-xs text-orange-600 font-medium capitalize">
//                                 {user.companyRole} • {user.company}
//                               </span>
//                             </div>
//                           )}
//                           {isRegularUser && (
//                             <div className="flex items-center mt-2">
//                               <UserCircleIcon className="w-3 h-3 text-blue-600 mr-1 flex-shrink-0" />
//                               <span className="text-xs text-blue-600 font-medium">
//                                 Individual User
//                               </span>
//                             </div>
//                           )}
//                           <div className="flex items-center mt-1">
//                             <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
//                             <span className="text-xs text-gray-500">Online</span>
//                           </div>
//                         </div>
                        
//                         {/* Navigation */}
//                         <div className="py-2">
//                           {userNavigation.map((item) => (
//                             <Link
//                               key={item.name}
//                               to={item.href}
//                               className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group focus:outline-none focus:bg-gray-50"
//                               role="menuitem"
//                               onClick={() => setIsProfileOpen(false)}
//                               title={item.description}
//                             >
//                               <item.icon className="w-4 h-4 text-gray-400 mr-3 group-hover:text-gray-600 flex-shrink-0" />
//                               <div className="flex-1">
//                                 <span>{item.name}</span>
//                               </div>
//                             </Link>
//                           ))}
//                         </div>
                        
//                         {/* Logout */}
//                         <div className="py-2">
//                           <button
//                             onClick={handleLogout}
//                             className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 group focus:outline-none focus:bg-red-50"
//                             role="menuitem"
//                           >
//                             <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 mr-3 group-hover:text-red-600 flex-shrink-0" />
//                             Sign out
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => handleModalOpen('login')}
//                     className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                     title="Sign in to your account"
//                   >
//                     Sign in
//                   </button>
//                   <button
//                     onClick={() => handleModalOpen('register')}
//                     className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                     title="Create new account"
//                   >
//                     Get Started
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center">
//               <button
//                 data-mobile-menu-button
//                 onClick={() => setIsOpen(!isOpen)}
//                 onKeyDown={handleMobileMenuKeyDown}
//                 className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
//                 aria-expanded={isOpen}
//                 aria-label="Main menu"
//                 aria-controls="mobile-menu"
//               >
//                 <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
//                 {isOpen ? (
//                   <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                 ) : (
//                   <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isOpen && (
//           <div 
//             id="mobile-menu"
//             ref={mobileMenuRef}
//             className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-in slide-in-from-top duration-300"
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {/* Navigation Links */}
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`${
//                     item.current
//                       ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
//                       : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
//                   } block px-3 py-2 rounded-r-lg text-base font-medium transition-colors duration-200 flex items-center focus:outline-none focus:bg-gray-50`}
//                   onClick={handleMobileLinkClick}
//                   aria-current={item.current ? 'page' : undefined}
//                 >
//                   {item.name}
//                   {item.current && (
//                     <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 animate-pulse" aria-hidden="true" />
//                   )}
//                 </Link>
//               ))}
              
//               {isAuthenticated && (
//                 <>
//                   {/* User Info Section */}
//                   <div className="px-3 py-4 border-t border-gray-200 bg-gray-50 rounded-lg mx-2 mt-4">
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
//                         {getUserInitials()}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
//                         <p className="text-xs text-gray-600 truncate">{user.email}</p>
//                         <p className="text-xs text-gray-500 capitalize mt-1">
//                           {user.role}
//                           {isCompanyUser && ` • ${user.companyRole}`}
//                           {isRegularUser && ' • Individual User'}
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Balance & Company */}
//                     <div className="grid grid-cols-2 gap-2 mb-4">
//                       <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center shadow-sm">
//                         <div className="flex items-center justify-center space-x-1">
//                           <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
//                           <span className="text-sm font-semibold text-gray-900 tabular-nums">
//                             ${formatBalance()}
//                           </span>
//                         </div>
//                         <span className="text-xs text-gray-500">Balance</span>
//                       </div>
//                       {isCompanyUser && (
//                         <div className="bg-white px-3 py-2 rounded-lg border border-orange-200 text-center shadow-sm">
//                           <div className="flex items-center justify-center space-x-1">
//                             <BuildingOfficeIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
//                             <span className="text-sm font-semibold text-orange-700 capitalize text-xs">
//                               {user.companyRole}
//                             </span>
//                           </div>
//                           <span className="text-xs text-gray-500">Role</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* User Navigation */}
//                     <div className="space-y-1">
//                       {userNavigation.map((item) => (
//                         <Link
//                           key={item.name}
//                           to={item.href}
//                           className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg text-base font-medium transition-colors duration-200 focus:outline-none focus:bg-white"
//                           onClick={handleMobileLinkClick}
//                         >
//                           <item.icon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                           {item.name}
//                         </Link>
//                       ))}
                      
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center w-full px-3 py-2.5 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg text-base font-medium transition-colors duration-200 focus:outline-none focus:bg-red-50"
//                       >
//                         <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                         Sign out
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {!isAuthenticated && (
//                 <div className="border-t border-gray-200 pt-4 space-y-2 px-2">
//                   <button
//                     onClick={() => handleModalOpen('login')}
//                     className="block w-full px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors duration-200 text-center focus:outline-none focus:bg-gray-50"
//                   >
//                     Sign in
//                   </button>
//                   <button
//                     onClick={() => handleModalOpen('register')}
//                     className="block w-full px-3 py-2.5 bg-blue-600 text-white rounded-lg text-base font-medium text-center hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Get Started
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Header;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import logo from "../assets/logo.png?url";
import NotificationBell from './NotificationBell';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  WalletIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CogIcon,
  ChartBarIcon,
  InboxIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

// Import modal components
import Login from '../pages/Login';
import Register from '../pages/Register';
import CompanyRegister from '../pages/CompanyRegister';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Header = () => {
  const { 
    user, 
    logout, 
    isAuthenticated, 
    getUserInitials, 
    formatBalance, 
    isCompanyUser, 
    isRegularUser,
    hasCompany
  } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'company-register'
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Use AuthContext methods instead of local calculations
  const userHasCompany = hasCompany();
  const userIsCompanyUser = isCompanyUser();
  const userIsRegularUser = isRegularUser();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modal wrapper component
  const Modal = ({ children, onClose, wide = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-in fade-in-50">
      <div className={`${wide ? 'max-w-[95vw] lg:max-w-6xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );

  // Main navigation with proper accessibility
  const navigation = [
    { 
      name: 'Browse Gigs', 
      href: '/gigs', 
      current: location.pathname === '/gigs',
      description: 'Discover available campaigns'
    },
    ...(isAuthenticated ? [
      { 
        name: 'My Gigs', 
        href: '/my-gigs', 
        current: location.pathname === '/my-gigs',
        description: 'Manage your active gigs'
      },
      { 
        name: 'Create Gig', 
        href: '/create-gig', 
        current: location.pathname === '/create-gig',
        description: 'Start a new campaign'
      },
      { 
        name: 'Service Gig', 
        href: '/create-service-gig', 
        current: location.pathname === '/create-service-gig',
        description: 'Create service-based gigs'
      },
      { 
        name: 'Verify', 
        href: '/verify-submissions', 
        current: location.pathname === '/verify-submissions',
        description: 'Review submissions'
      },
      // Add Invitations for regular users (no separate notification)
      ...(userIsRegularUser ? [
        { 
          name: 'My Invitations', 
          href: '/my-invitations', 
          current: location.pathname === '/my-invitations',
          description: 'Manage service gig invitations'
        }
      ] : []),
      ...(userIsCompanyUser ? [
        { 
          name: 'Company', 
          href: '/company/dashboard', 
          current: location.pathname === '/company/dashboard',
          description: 'Company dashboard'
        }
      ] : []),
    ] : []),
    ...(user?.role === 'admin' ? [
      { 
        name: 'Admin', 
        href: '/admin', 
        current: location.pathname === '/admin',
        description: 'Administration panel'
      },
    ] : []),
  ];

  // User dropdown navigation
  const userNavigation = [
    { name: 'Wallet', href: '/wallet', icon: WalletIcon, description: 'Manage your earnings' },
    { name: 'Verify', href: '/verify-submissions', icon: CheckBadgeIcon, description: 'Review submissions' },
    { name: 'Service Gig', href: '/create-service-gig', icon: PlusCircleIcon, description: 'Create service gigs' },
    // Add Invitations section for regular users (no badge)
    ...(userIsRegularUser ? [
      { 
        name: 'My Invitations', 
        href: '/my-invitations', 
        icon: InboxIcon, 
        description: 'Manage service gig invitations'
      }
    ] : []),
    ...(userIsCompanyUser ? [
      { name: 'Company', href: '/company/dashboard', icon: BuildingOfficeIcon, description: 'Company dashboard' }
    ] : []),
    { name: 'Profile', href: '/profile', icon: UserCircleIcon, description: 'Manage your account' },
    ...(user?.role === 'admin' ? [
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, description: 'View platform analytics' }
    ] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsOpen(false);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  // Close mobile menu when navigating
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  // Handle profile dropdown keyboard navigation
  const handleProfileKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsProfileOpen(false);
    }
  };

  // Handle mobile menu keyboard navigation
  const handleMobileMenuKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Handle modal open/close
  const handleModalOpen = (modalType) => {
    setActiveModal(modalType);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const headerClass = scrollPosition > 10 
    ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/80 sticky top-0 z-50 transition-all duration-300"
    : "bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300";

  return (
    <>
      {/* Modals */}
      {activeModal === 'login' && (
        <Modal onClose={handleModalClose}>
          <Login 
            onClose={handleModalClose}
            onSwitchToRegister={() => setActiveModal('register')}
            onSwitchToCompanyRegister={() => setActiveModal('company-register')}
          />
        </Modal>
      )}

      {activeModal === 'register' && (
        <Modal onClose={handleModalClose}>
          <Register 
            onClose={handleModalClose}
            onSwitchToLogin={() => setActiveModal('login')}
            onSwitchToCompanyRegister={() => setActiveModal('company-register')}
          />
        </Modal>
      )}

      {activeModal === 'company-register' && (
        <Modal onClose={handleModalClose} wide={true}>
          <CompanyRegister 
            onClose={handleModalClose}
            onSwitchToLogin={() => setActiveModal('login')}
            onSwitchToRegister={() => setActiveModal('register')}
          />
        </Modal>
      )}

      <nav className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex-shrink-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200"
                aria-label="Social Posts Sharers Home"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  {/* <img 
                    src="/src/assets/logo.png" 
                    alt="SPS" 
                    className="w-5 h-5 filter brightness-0 invert"
                    loading="eager"
                  /> */}
                  <img src={logo || "/src/assets/logo.png"} alt="SPS" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                    SOCIAL POSTS SHARERS
                  </span>
                  <span className="text-xs text-gray-500 font-medium -mt-1 group-hover:text-blue-500 transition-colors duration-200">
                    Empower.Share.Earn
                  </span>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-8 md:flex md:space-x-1" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                    } px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 flex items-center group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    aria-current={item.current ? 'page' : undefined}
                    title={item.description}
                  >
                    {item.name}
                    {item.current && (
                      <div 
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-2 animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop menu - right side */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Balance display */}
                  <div 
                    className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-default"
                    title="Your current balance"
                  >
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        ${formatBalance()}
                      </span>
                    </div>
                  </div>

                  {/* Company Badge */}
                  {userIsCompanyUser && (
                    <div 
                      className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors duration-200 cursor-default"
                      title={`Company ${user.companyRole}`}
                    >
                      <div className="flex items-center space-x-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-orange-700 capitalize">
                          {user.companyRole}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Single Notification Bell - Handles ALL notifications including invitations */}
                  <NotificationBell />

                  {/* User profile dropdown */}
                  <div className="relative" ref={profileRef}>
  <button
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    onKeyDown={handleProfileKeyDown}
    className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-expanded={isProfileOpen}
    aria-haspopup="true"
    aria-label="User menu"
  >
    {/* Profile Picture with fallback to initials */}
    {user?.profilePicture ? (
      <img
        src={`${API_URL}/${user.profilePicture}`}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
        title={user?.name || 'User'}
        onError={(e) => {
          console.error('Profile image failed to load:', user.profilePicture);
          // Fallback to initials if image fails to load
          e.target.style.display = 'none';
        }}
        onLoad={() => console.log('Profile image loaded successfully')}
      />
    ) : (
      <div 
        className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
        title={user?.name || 'User'}
      >
        {getUserInitials()}
      </div>
    )}
    <ChevronDownIcon 
      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
        isProfileOpen ? 'rotate-180' : ''
      }`}
      aria-hidden="true"
    />
  </button>

  {isProfileOpen && (
    <div 
      className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white border border-gray-200 divide-y divide-gray-100 overflow-hidden z-50 animate-in fade-in-80"
      role="menu"
      aria-orientation="vertical"
    >
      {/* User Info */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3 mb-2">
          {user?.profilePicture ? (
            <img
              src={`${API_URL}/${user.profilePicture}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                console.error('Dropdown profile image failed to load:', user.profilePicture);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Dropdown profile image loaded successfully')}
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {getUserInitials()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate" title={user.name}>
              {user.name}
            </p>
            <p className="text-sm text-gray-600 truncate" title={user.email}>
              {user.email}
            </p>
          </div>
        </div>
        
        {userIsCompanyUser && (
          <div className="flex items-center mt-2">
            <BuildingOfficeIcon className="w-3 h-3 text-orange-600 mr-1 flex-shrink-0" />
            <span className="text-xs text-orange-600 font-medium capitalize">
              {user.companyRole} • {user.company?.companyName || 'Company'}
            </span>
          </div>
        )}
        {userIsRegularUser && (
          <div className="flex items-center mt-2">
            <UserCircleIcon className="w-3 h-3 text-blue-600 mr-1 flex-shrink-0" />
            <span className="text-xs text-blue-600 font-medium">
              Individual User
            </span>
          </div>
        )}
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="py-2">
        {userNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group focus:outline-none focus:bg-gray-50"
            role="menuitem"
            onClick={() => setIsProfileOpen(false)}
            title={item.description}
          >
            <item.icon className="w-4 h-4 text-gray-400 mr-3 group-hover:text-gray-600 flex-shrink-0" />
            <div className="flex-1">
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Logout */}
      <div className="py-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 group focus:outline-none focus:bg-red-50"
          role="menuitem"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 mr-3 group-hover:text-red-600 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )}
</div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleModalOpen('login')}
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Sign in to your account"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleModalOpen('register')}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Create new account"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                data-mobile-menu-button
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleMobileMenuKeyDown}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
                aria-expanded={isOpen}
                aria-label="Main menu"
                aria-controls="mobile-menu"
              >
                <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div 
            id="mobile-menu"
            ref={mobileMenuRef}
            className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-in slide-in-from-top duration-300"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                  } block px-3 py-2 rounded-r-lg text-base font-medium transition-colors duration-200 flex items-center focus:outline-none focus:bg-gray-50`}
                  onClick={handleMobileLinkClick}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                  {item.current && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 animate-pulse" aria-hidden="true" />
                  )}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  {/* User Info Section */}
                  <div className="px-3 py-4 border-t border-gray-200 bg-gray-50 rounded-lg mx-2 mt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {user?.profilePicture ? (
                        <img
                           src={`${API_URL}/${user.profilePicture}`}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {getUserInitials()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                          {user.role}
                          {userIsCompanyUser && ` • ${user.companyRole}`}
                          {userIsRegularUser && ' • Individual User'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Balance & Company */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center shadow-sm">
                        <div className="flex items-center justify-center space-x-1">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-900 tabular-nums">
                            ${formatBalance()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Balance</span>
                      </div>
                      {userIsCompanyUser && (
                        <div className="bg-white px-3 py-2 rounded-lg border border-orange-200 text-center shadow-sm">
                          <div className="flex items-center justify-center space-x-1">
                            <BuildingOfficeIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-orange-700 capitalize text-xs">
                              {user.companyRole}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">Role</span>
                        </div>
                      )}
                    </div>
                    
                    {/* User Navigation */}
                    <div className="space-y-1">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg text-base font-medium transition-colors duration-200 focus:outline-none focus:bg-white"
                          onClick={handleMobileLinkClick}
                        >
                          <item.icon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          {item.name}
                        </Link>
                      ))}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg text-base font-medium transition-colors duration-200 focus:outline-none focus:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 space-y-2 px-2">
                  <button
                    onClick={() => handleModalOpen('login')}
                    className="block w-full px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-base font-medium transition-colors duration-200 text-center focus:outline-none focus:bg-gray-50"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleModalOpen('register')}
                    className="block w-full px-3 py-2.5 bg-blue-600 text-white rounded-lg text-base font-medium text-center hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;