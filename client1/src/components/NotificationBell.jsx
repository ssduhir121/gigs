// // components/NotificationBell.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { BellIcon } from '@heroicons/react/24/outline';
// import { useNotifications } from '../context/NotificationContext';
// import NotificationItem from './NotificationItem';
// const NotificationBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { unreadCount, fetchNotifications, notifications, loading } = useNotifications();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleBellClick = () => {
//     if (!isOpen) {
//       fetchNotifications(); // Load notifications when opening
//     }
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Notification Bell Button */}
//       <button
//         onClick={handleBellClick}
//         className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg backdrop-blur-sm"
//       >
//         <BellIcon className="w-6 h-6" />
        
//         {/* Unread Count Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
//           {/* Dropdown Header */}
//           <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-primary-400/20 to-blue-400/20">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-white">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
//                   {unreadCount} new
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="max-h-96 overflow-y-auto">
//             {loading ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             ) : notifications.length > 0 ? (
//               <div className="divide-y divide-white/10">
//                 {notifications.slice(0, 10).map((notification) => (
//                   <NotificationItem 
//                     key={notification._id} 
//                     notification={notification} 
//                     onClose={() => setIsOpen(false)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <div className="text-4xl mb-2">🔔</div>
//                 <p className="text-gray-300 text-sm">No notifications yet</p>
//                 <p className="text-gray-400 text-xs mt-1">
//                   Notifications will appear here
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Dropdown Footer */}
//           {notifications.length > 0 && (
//             <div className="px-4 py-3 border-t border-white/20 bg-white/5">
//               <button
//                 onClick={() => {
//                   // Navigate to full notifications page
//                   window.location.href = '/notifications';
//                 }}
//                 className="w-full text-center text-primary-300 hover:text-primary-200 text-sm font-medium transition-colors"
//               >
//                 View All Notifications
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;


import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { unreadCount, fetchNotifications, notifications, loading } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBellClick = () => {
    if (!isOpen) {
      fetchNotifications(); // Load notifications when opening
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <BellIcon className="w-6 h-6" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Dropdown Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 10).map((notification) => (
                  <NotificationItem 
                    key={notification._id} 
                    notification={notification} 
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BellIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm font-medium">No notifications yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  Notifications will appear here
                </p>
              </div>
            )}
          </div>

          {/* Dropdown Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/notifications';
                }}
                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors py-2 hover:bg-blue-50 rounded-md"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;