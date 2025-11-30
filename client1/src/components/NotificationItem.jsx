// // components/NotificationItem.jsx
// import React from 'react';
// import { 
//   CheckCircleIcon, 
//   XCircleIcon, 
//   ClockIcon,
//   CurrencyDollarIcon,
//   ShareIcon,
//   UserIcon,
//   ExclamationTriangleIcon,
//   InformationCircleIcon
// } from '@heroicons/react/24/outline';
// import { useNotifications } from '../context/NotificationContext';

// const NotificationItem = ({ notification, onClose }) => {
//   const { markAsRead, deleteNotification } = useNotifications();

//   const handleClick = () => {
//     if (!notification.isRead) {
//       markAsRead(notification._id);
//     }
    
//     // Handle notification action based on type
//     handleNotificationAction();
//     onClose?.();
//   };

//   const handleNotificationAction = () => {
//     switch (notification.type) {
//       case 'submission_approved':
//       case 'payment_received':
//         // Navigate to wallet
//         window.location.href = '/wallet';
//         break;
//       case 'submission_received':
//       case 'gig_created':
//         // Navigate to verify submissions or gigs
//         if (notification.data?.gigId) {
//           window.location.href = `/verify-submissions`;
//         }
//         break;
//       case 'withdrawal_processed':
//       case 'withdrawal_failed':
//         // Navigate to withdrawal history
//         window.location.href = '/wallet';
//         break;
//       default:
//         // Default action - mark as read
//         break;
//     }
//   };

//   const getNotificationIcon = () => {
//     switch (notification.type) {
//       case 'submission_approved':
//       case 'payment_received':
//         return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
//       case 'submission_rejected':
//       case 'withdrawal_failed':
//         return <XCircleIcon className="w-5 h-5 text-red-400" />;
//       case 'submission_received':
//         return <ShareIcon className="w-5 h-5 text-blue-400" />;
//       case 'gig_created':
//         return <UserIcon className="w-5 h-5 text-purple-400" />;
//       case 'withdrawal_requested':
//       case 'withdrawal_processed':
//         return <CurrencyDollarIcon className="w-5 h-5 text-yellow-400" />;
//       case 'gig_completed':
//         return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
//       default:
//         return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
//     }
//   };

//   const getPriorityColor = () => {
//     switch (notification.priority) {
//       case 'high':
//         return 'border-l-red-400 bg-red-400/10';
//       case 'medium':
//         return 'border-l-yellow-400 bg-yellow-400/10';
//       default:
//         return 'border-l-gray-400 bg-gray-400/10';
//     }
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
//         notification.isRead 
//           ? 'bg-white/5 border-l-gray-600 hover:bg-white/10' 
//           : `${getPriorityColor()} hover:opacity-90`
//       }`}
//     >
//       <div className="flex items-start space-x-3">
//         {/* Icon */}
//         <div className="flex-shrink-0 mt-0.5">
//           {getNotificationIcon()}
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between">
//             <h4 className={`text-sm font-semibold ${
//               notification.isRead ? 'text-gray-300' : 'text-white'
//             }`}>
//               {notification.title}
//             </h4>
//             <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
//               {formatTime(notification.createdAt)}
//             </span>
//           </div>
          
//           <p className="text-sm text-gray-300 mt-1 leading-relaxed">
//             {notification.message}
//           </p>

//           {/* Additional data display */}
//           {notification.data?.amount && (
//             <div className="flex items-center mt-2 text-xs">
//               <CurrencyDollarIcon className="w-3 h-3 text-green-400 mr-1" />
//               <span className="text-green-300 font-medium">
//                 ${notification.data.amount.toFixed(2)}
//               </span>
//             </div>
//           )}

//           {/* Unread indicator */}
//           {!notification.isRead && (
//             <div className="flex items-center mt-2">
//               <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//               <span className="text-xs text-blue-300 ml-2">New</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationItem;


import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  ShareIcon,
  UserIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // Handle notification action based on type
    handleNotificationAction();
    onClose?.();
  };

  const handleNotificationAction = () => {
    switch (notification.type) {
      case 'submission_approved':
      case 'payment_received':
        window.location.href = '/wallet';
        break;
      case 'submission_received':
      case 'gig_created':
        if (notification.data?.gigId) {
          window.location.href = `/verify-submissions`;
        }
        break;
      case 'withdrawal_processed':
      case 'withdrawal_failed':
        window.location.href = '/wallet';
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = () => {
    const iconClass = "w-5 h-5";
    
    switch (notification.type) {
      case 'submission_approved':
      case 'payment_received':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'submission_rejected':
      case 'withdrawal_failed':
        return <XCircleIcon className={`${iconClass} text-red-500`} />;
      case 'submission_received':
        return <ShareIcon className={`${iconClass} text-blue-500`} />;
      case 'gig_created':
        return <UserIcon className={`${iconClass} text-purple-500`} />;
      case 'withdrawal_requested':
      case 'withdrawal_processed':
        return <CurrencyDollarIcon className={`${iconClass} text-yellow-500`} />;
      case 'gig_completed':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationStyle = () => {
    if (notification.isRead) {
      return 'bg-white hover:bg-gray-50 border-l-gray-300';
    }

    switch (notification.priority) {
      case 'high':
        return 'bg-red-50 border-l-red-500 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-50 border-l-yellow-500 hover:bg-yellow-100';
      default:
        return 'bg-blue-50 border-l-blue-500 hover:bg-blue-100';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${getNotificationStyle()} group`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`text-sm font-semibold ${
              notification.isRead ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(notification.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {notification.message}
          </p>

          {/* Additional data display */}
          {notification.data?.amount && (
            <div className="flex items-center mt-2 text-xs">
              <CurrencyDollarIcon className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-green-700 font-medium">
                ${notification.data.amount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Unread indicator */}
          {!notification.isRead && (
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium ml-2">New</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;