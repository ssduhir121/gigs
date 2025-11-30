// // pages/Notifications.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   BellIcon,
//   CheckIcon,
//   TrashIcon,
//   ArchiveBoxXMarkIcon
// } from '@heroicons/react/24/outline';
// import { useNotifications } from '../context/NotificationContext';
// import { GradientBackground, GlassCard } from '../components/common/StyledComponents';
// import NotificationItem from '../components/NotificationItem';

// const Notifications = () => {
//   const { 
//     notifications, 
//     unreadCount, 
//     loading, 
//     fetchNotifications, 
//     markAllAsRead,
//     deleteNotification 
//   } = useNotifications();
  
//   const [filter, setFilter] = useState('all'); // 'all', 'unread'
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     fetchNotifications({ page: 1, limit: 20 });
//     setPage(1);
//     setHasMore(true);
//   }, [filter]);

//   const loadMore = () => {
//     const nextPage = page + 1;
//     fetchNotifications({ page: nextPage, limit: 20 });
//     setPage(nextPage);
//     // Simple pagination - assume no more if less than limit returned
//     if (notifications.length < page * 20) {
//       setHasMore(false);
//     }
//   };

//   const filteredNotifications = filter === 'unread' 
//     ? notifications.filter(n => !n.isRead)
//     : notifications;

//   const handleMarkAllAsRead = async () => {
//     await markAllAsRead();
//   };

//   const handleClearAll = async () => {
//     // This would need a backend endpoint to clear all notifications
//     // For now, we'll mark all as read as a temporary solution
//     await markAllAsRead();
//   };

//   return (
//     <GradientBackground className="py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
//               <BellIcon className="w-8 h-8 mr-3 text-primary-300" />
//               Notifications
//             </h1>
//             <p className="text-gray-200">
//               {unreadCount > 0 
//                 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
//                 : 'All caught up!'
//               }
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             {unreadCount > 0 && (
//               <button
//                 onClick={handleMarkAllAsRead}
//                 className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-300 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-all duration-200 backdrop-blur-sm"
//               >
//                 <CheckIcon className="w-4 h-4 mr-2" />
//                 Mark All Read
//               </button>
//             )}
            
//             <button
//               onClick={handleClearAll}
//               className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm"
//             >
//               <ArchiveBoxXMarkIcon className="w-4 h-4 mr-2" />
//               Clear All
//             </button>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <GlassCard className="p-6 mb-6">
//           <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
//             <button
//               onClick={() => setFilter('all')}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
//                 filter === 'all' 
//                   ? 'bg-primary-600 text-white shadow-lg' 
//                   : 'text-gray-300 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               All Notifications
//             </button>
//             <button
//               onClick={() => setFilter('unread')}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
//                 filter === 'unread' 
//                   ? 'bg-primary-600 text-white shadow-lg' 
//                   : 'text-gray-300 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               Unread ({unreadCount})
//             </button>
//           </div>
//         </GlassCard>

//         {/* Notifications List */}
//         <GlassCard className="overflow-hidden">
//           {loading && page === 1 ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           ) : filteredNotifications.length > 0 ? (
//             <>
//               <div className="divide-y divide-white/10">
//                 {filteredNotifications.map((notification) => (
//                   <NotificationItem 
//                     key={notification._id} 
//                     notification={notification}
//                   />
//                 ))}
//               </div>

//               {/* Load More */}
//               {hasMore && (
//                 <div className="px-6 py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
//                   <button
//                     onClick={loadMore}
//                     disabled={loading}
//                     className="w-full text-center text-primary-300 hover:text-primary-200 font-medium transition-colors disabled:opacity-50"
//                   >
//                     {loading ? 'Loading...' : 'Load More Notifications'}
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">📭</div>
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
//               </h3>
//               <p className="text-gray-300 mb-6">
//                 {filter === 'unread' 
//                   ? "You're all caught up! Check back later for new notifications."
//                   : "Notifications about your gigs, submissions, and payments will appear here."
//                 }
//               </p>
//               <Link
//                 to="/gigs"
//                 className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
//               >
//                 Browse Gigs
//               </Link>
//             </div>
//           )}
//         </GlassCard>

//         {/* Quick Stats */}
//         {notifications.length > 0 && (
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-2xl font-bold text-white">{notifications.length}</div>
//               <div className="text-sm text-gray-300">Total</div>
//             </GlassCard>
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-2xl font-bold text-yellow-300">{unreadCount}</div>
//               <div className="text-sm text-gray-300">Unread</div>
//             </GlassCard>
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-2xl font-bold text-green-300">
//                 {notifications.filter(n => n.type.includes('payment') || n.type.includes('approved')).length}
//               </div>
//               <div className="text-sm text-gray-300">Earnings</div>
//             </GlassCard>
//           </div>
//         )}
//       </div>
//     </GradientBackground>
//   );
// };

// export default Notifications;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BellIcon,
  CheckIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/NotificationItem';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    markAllAsRead,
    deleteNotification 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 });
    setPage(1);
    setHasMore(true);
  }, [filter]);

  const loadMore = () => {
    const nextPage = page + 1;
    fetchNotifications({ page: nextPage, limit: 20 });
    setPage(nextPage);
    if (notifications.length < page * 20) {
      setHasMore(false);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await markAllAsRead();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BellIcon className="w-6 h-6 text-blue-600" />
              </div>
              Notifications
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'All caught up!'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            )}
            
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArchiveBoxXMarkIcon className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification._id} 
                    notification={notification}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full text-center text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Notifications'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'unread' 
                  ? "You're all caught up! Check back later for new notifications."
                  : "Notifications about your gigs, submissions, and payments will appear here."
                }
              </p>
              <Link
                to="/gigs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Gigs
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type.includes('payment') || n.type.includes('approved')).length}
              </div>
              <div className="text-sm text-gray-600">Earnings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;