
// pages/CompanyDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  UsersIcon,
  BriefcaseIcon,
  ShareIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  UserPlusIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  CogIcon,
  GlobeAltIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  LinkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  RocketLaunchIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';

// Custom Hooks
const useCompanyData = () => {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState({
    dashboard: null,
    gigs: [],
    team: [],
    shares: [],
    invitations: [],
    settings: null,
    serviceGigs: [],
    serviceInvitations: {
      sent: [],
      received: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic data
      const [dashboardRes, gigsRes, teamRes, sharesRes, invitationsRes] = await Promise.all([
        axios.get('/api/company/dashboard'),
        axios.get('/api/company/gigs?limit=10'),
        axios.get('/api/company/team'),
        axios.get('/api/company/shares?limit=10'),
        axios.get('/api/company/invitations')
      ]);

      const dashboardData = dashboardRes.data.data;

      // Only fetch settings if user has admin access
      let settingsData = null;
      if (user?.companyRole && ['admin', 'owner'].includes(user.companyRole)) {
        try {
          const settingsRes = await axios.get('/api/company/settings');
          settingsData = settingsRes.data.data;
        } catch (settingsError) {
          console.warn('Settings access not available:', settingsError.response?.data?.message);
        }
      }

      // Fetch service gigs and invitations if user has company
      let serviceGigsData = [];
      let serviceInvitationsData = { sent: [], received: [] };
      
      if (user?.company) {
        try {
          // Fetch available service gigs
          const serviceGigsRes = await axios.get('/api/service-gigs');
          serviceGigsData = serviceGigsRes.data.data || [];
        } catch (serviceGigsError) {
          console.warn('Service gigs not available:', serviceGigsError.response?.data?.message);
        }

        try {
          // Fetch service invitations
          const [sentRes, receivedRes] = await Promise.all([
            axios.get('/api/invitations/sent'),
            axios.get('/api/invitations/received')
          ]);
          serviceInvitationsData = {
            sent: sentRes.data.data || [],
            received: receivedRes.data.data || []
          };
        } catch (invitationsError) {
          console.warn('Service invitations not available:', invitationsError.response?.data?.message);
        }
      }

      setData({
        dashboard: dashboardData,
        gigs: gigsRes.data.data,
        team: teamRes.data.data,
        shares: sharesRes.data.data,
        invitations: invitationsRes.data.data,
        settings: settingsData,
        serviceGigs: serviceGigsData,
        serviceInvitations: serviceInvitationsData
      });

    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err.response?.data?.message || 'Failed to load company data');
      toast.error('Failed to load company dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.company) {
      fetchData();
    }
  }, [user, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Reusable Components
const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend > 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : 
               trend < 0 ? <ArrowDownIcon className="w-3 h-3 mr-1" /> : 
               <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].bg} ${colorClasses[color].text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, action }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {action && (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {action}
        </button>
      )}
    </div>
    {children}
  </div>
);

const DataCard = ({ title, children, emptyMessage, data, className = '', action }) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action && action}
      </div>
    </div>
    <div className="divide-y divide-gray-200">
      {data && data.length > 0 ? children : (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 mb-2 text-2xl">📊</div>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Company Dashboard</h2>
      <p className="text-gray-600">Preparing your company overview...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Service Gig Invitation Component
// const ServiceGigInvitations = ({ data, userRole, onRefresh }) => {
//   const { serviceGigs, serviceInvitations, gigs } = data;
//   const [activeTab, setActiveTab] = useState('send');
//   const [selectedServiceGig, setSelectedServiceGig] = useState(null);
//   const [selectedTargetGig, setSelectedTargetGig] = useState(null);
//   const [invitationMessage, setInvitationMessage] = useState('');
//   const [compensation, setCompensation] = useState('');
//   const [sendingInvitation, setSendingInvitation] = useState(false);

//   const hasInviteAccess = userRole && ['admin', 'owner', 'manager'].includes(userRole);

//   const handleSendInvitation = async (e) => {
//     e.preventDefault();
    
//     if (!selectedServiceGig || !selectedTargetGig || !invitationMessage.trim()) {
//       toast.error('Please select a service gig, target gig, and add a message');
//       return;
//     }

//     if (!hasInviteAccess) {
//       toast.error('You do not have permission to send invitations');
//       return;
//     }

//     setSendingInvitation(true);
//     try {
//       await axios.post('/api/invitations', {
//         serviceGigId: selectedServiceGig._id,
//         targetGigId: selectedTargetGig._id,
//         message: invitationMessage,
//         compensation: compensation ? parseFloat(compensation) : null
//       });

//       toast.success('Invitation sent successfully!');
//       setSelectedServiceGig(null);
//       setSelectedTargetGig(null);
//       setInvitationMessage('');
//       setCompensation('');
//       onRefresh();
//     } catch (error) {
//       console.error('Error sending invitation:', error);
//       toast.error(error.response?.data?.message || 'Failed to send invitation');
//     } finally {
//       setSendingInvitation(false);
//     }
//   };

//   const handleAcceptInvitation = async (invitationId, responseMessage = '') => {
//     try {
//       await axios.post(`/api/invitations/${invitationId}/accept`, {
//         responseMessage
//       });
//       toast.success('Invitation accepted successfully!');
//       onRefresh();
//     } catch (error) {
//       console.error('Error accepting invitation:', error);
//       toast.error(error.response?.data?.message || 'Failed to accept invitation');
//     }
//   };

//   const handleRejectInvitation = async (invitationId, responseMessage = '') => {
//     try {
//       await axios.post(`/api/invitations/${invitationId}/reject`, {
//         responseMessage
//       });
//       toast.success('Invitation rejected');
//       onRefresh();
//     } catch (error) {
//       console.error('Error rejecting invitation:', error);
//       toast.error(error.response?.data?.message || 'Failed to reject invitation');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'expired': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <ClockIcon className="w-4 h-4" />;
//       case 'accepted': return <CheckBadgeIconSolid className="w-4 h-4" />;
//       case 'rejected': return <XMarkIconSolid className="w-4 h-4" />;
//       case 'expired': return <ClockIcon className="w-4 h-4" />;
//       default: return <ClockIcon className="w-4 h-4" />;
//     }
//   };

//   // Filter private gigs for invitations
//   const privateGigs = gigs.filter(gig => gig.shareType === 'private' && gig.isActive);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Service Gig Invitations</h2>
//         <p className="text-gray-600">Invite service gig owners to share your private gigs</p>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white rounded-xl border border-gray-200">
//         <div className="border-b border-gray-200">
//           <nav className="flex -mb-px">
//             <button
//               onClick={() => setActiveTab('send')}
//               className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                 activeTab === 'send'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Send Invitations
//             </button>
//             <button
//               onClick={() => setActiveTab('sent')}
//               className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                 activeTab === 'sent'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Sent ({serviceInvitations.sent.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('received')}
//               className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                 activeTab === 'received'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Received ({serviceInvitations.received.length})
//             </button>
//           </nav>
//         </div>

//         <div className="p-6">
//           {/* Send Invitation Form */}
//           {activeTab === 'send' && (
//             <div className="space-y-6">
//               {!hasInviteAccess ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <div className="flex items-center">
//                     <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
//                     <p className="text-yellow-800 text-sm">
//                       You need manager, admin, or owner privileges to send invitations.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSendInvitation} className="space-y-6">
//                   {/* Service Gig Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Service Gig to Invite
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
//                       {serviceGigs.map((serviceGig) => (
//                         <div
//                           key={serviceGig._id}
//                           onClick={() => setSelectedServiceGig(serviceGig)}
//                           className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                             selectedServiceGig?._id === serviceGig._id
//                               ? 'border-blue-500 bg-blue-50'
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                         >
//                           <div className="flex items-center space-x-3">
//                             {serviceGig.image?.url ? (
//                               <img
//                                 src={serviceGig.image.url}
//                                 alt={serviceGig.title}
//                                 className="w-12 h-12 rounded-lg object-cover"
//                               />
//                             ) : (
//                               <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
//                                 <RocketLaunchIcon className="w-6 h-6 text-gray-400" />
//                               </div>
//                             )}
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-900 text-sm">{serviceGig.title}</h4>
//                               <p className="text-sm text-gray-600">${serviceGig.price}</p>
//                               <p className="text-xs text-gray-500">by {serviceGig.user?.name}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {serviceGigs.length === 0 && (
//                       <p className="text-sm text-gray-500 text-center py-4">
//                         No service gigs available to invite.
//                       </p>
//                     )}
//                   </div>

//                   {/* Target Gig Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Your Private Gig to Share
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
//                       {privateGigs.map((gig) => (
//                         <div
//                           key={gig._id}
//                           onClick={() => setSelectedTargetGig(gig)}
//                           className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                             selectedTargetGig?._id === gig._id
//                               ? 'border-blue-500 bg-blue-50'
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                         >
//                           <h4 className="font-medium text-gray-900 text-sm">{gig.title}</h4>
//                           <p className="text-sm text-gray-600">Budget: ${gig.budget}</p>
//                           <p className="text-xs text-gray-500">
//                             {gig.sharesCompleted}/{gig.sharesRequired} shares completed
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                     {privateGigs.length === 0 && (
//                       <p className="text-sm text-gray-500 text-center py-4">
//                         No private gigs available. Create a private gig first.
//                       </p>
//                     )}
//                   </div>

//                   {/* Invitation Details */}
//                   {(selectedServiceGig && selectedTargetGig) && (
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Invitation Message *
//                         </label>
//                         <textarea
//                           value={invitationMessage}
//                           onChange={(e) => setInvitationMessage(e.target.value)}
//                           placeholder="Explain why you're inviting this service gig owner and what you expect..."
//                           rows={4}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Additional Compensation (Optional)
//                         </label>
//                         <div className="relative">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <span className="text-gray-500 sm:text-sm">$</span>
//                           </div>
//                           <input
//                             type="number"
//                             value={compensation}
//                             onChange={(e) => setCompensation(e.target.value)}
//                             placeholder="0.00"
//                             min="0"
//                             step="0.01"
//                             className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           />
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Additional payment beyond the service gig price
//                         </p>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h4 className="font-medium text-gray-900 text-sm mb-2">Invitation Summary</h4>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Service Gig:</span>
//                             <span className="font-medium">{selectedServiceGig.title}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Service Price:</span>
//                             <span className="font-medium">${selectedServiceGig.price}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Target Gig:</span>
//                             <span className="font-medium">{selectedTargetGig.title}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Gig Budget:</span>
//                             <span className="font-medium">${selectedTargetGig.budget}</span>
//                           </div>
//                           {compensation && (
//                             <div className="flex justify-between">
//                               <span className="text-gray-600">Additional Compensation:</span>
//                               <span className="font-medium">${parseFloat(compensation).toFixed(2)}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <button
//                         type="submit"
//                         disabled={sendingInvitation}
//                         className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
//                       >
//                         <PaperAirplaneIcon className="w-4 h-4 mr-2" />
//                         {sendingInvitation ? 'Sending Invitation...' : 'Send Invitation'}
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               )}
//             </div>
//           )}

//           {/* Sent Invitations */}
//           {activeTab === 'sent' && (
//             <DataCard
//               data={serviceInvitations.sent}
//               emptyMessage="No invitations sent yet"
//             >
//               <div className="space-y-4">
//                 {serviceInvitations.sent.map((invitation) => (
//                   <div key={invitation._id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           {invitation.serviceGig?.image?.url ? (
//                             <img
//                               src={invitation.serviceGig.image.url}
//                               alt={invitation.serviceGig.title}
//                               className="w-10 h-10 rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                               <RocketLaunchIcon className="w-5 h-5 text-gray-400" />
//                             </div>
//                           )}
//                           <div>
//                             <h4 className="font-medium text-gray-900">{invitation.serviceGig?.title}</h4>
//                             <p className="text-sm text-gray-600">To: {invitation.recipient?.name}</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-700 mb-2">{invitation.message}</p>
//                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                           <span>Target: {invitation.targetGig?.title}</span>
//                           <span>Sent: {new Date(invitation.sentAt).toLocaleDateString()}</span>
//                           {invitation.compensation && (
//                             <span>+${invitation.compensation} bonus</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invitation.status)}`}>
//                           {getStatusIcon(invitation.status)}
//                           <span className="ml-1">{invitation.status}</span>
//                         </span>
//                       </div>
//                     </div>
//                     {invitation.responseMessage && (
//                       <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
//                         <strong>Response:</strong> {invitation.responseMessage}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </DataCard>
//           )}

//           {/* Received Invitations */}
//           {activeTab === 'received' && (
//             <DataCard
//               data={serviceInvitations.received}
//               emptyMessage="No invitations received yet"
//             >
//               <div className="space-y-4">
//                 {serviceInvitations.received.map((invitation) => (
//                   <div key={invitation._id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <UserCircleIcon className="w-10 h-10 text-gray-400" />
//                           <div>
//                             <h4 className="font-medium text-gray-900">Invitation from {invitation.sender?.name}</h4>
//                             <p className="text-sm text-gray-600">Company: {invitation.company?.companyName}</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-700 mb-2">{invitation.message}</p>
//                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                           <span>Target Gig: {invitation.targetGig?.title}</span>
//                           <span>Budget: ${invitation.targetGig?.budget}</span>
//                           {invitation.compensation && (
//                             <span className="text-green-600 font-medium">+${invitation.compensation} bonus</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {invitation.status === 'pending' && !invitation.isExpired ? (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleAcceptInvitation(invitation._id)}
//                               className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
//                             >
//                               <CheckBadgeIconSolid className="w-4 h-4 mr-1" />
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => handleRejectInvitation(invitation._id)}
//                               className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
//                             >
//                               <XMarkIconSolid className="w-4 h-4 mr-1" />
//                               Reject
//                             </button>
//                           </div>
//                         ) : (
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invitation.status)}`}>
//                             {getStatusIcon(invitation.status)}
//                             <span className="ml-1">{invitation.status}</span>
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {invitation.isExpired && invitation.status === 'pending' && (
//                       <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
//                         This invitation has expired
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </DataCard>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// Service Gig Invitation Component - UPDATED VERSION
const ServiceGigInvitations = ({ data, userRole, onRefresh }) => {
  const { serviceGigs, serviceInvitations, gigs } = data;
  const [activeTab, setActiveTab] = useState('send');
  const [selectedTargetGig, setSelectedTargetGig] = useState(null);
  const [selectedServiceGigs, setSelectedServiceGigs] = useState([]);
  const [showServiceGigDetails, setShowServiceGigDetails] = useState(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [compensation, setCompensation] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [showServiceGigDropdown, setShowServiceGigDropdown] = useState(false);
  const [serviceGigSearch, setServiceGigSearch] = useState('');

  const hasInviteAccess = userRole && ['admin', 'owner', 'manager'].includes(userRole);

  // Filter private gigs for invitations
  const privateGigs = gigs.filter(gig => gig.shareType === 'private' && gig.isActive);

  // Filter service gigs based on search
  const filteredServiceGigs = serviceGigs.filter(serviceGig =>
    serviceGig.title?.toLowerCase().includes(serviceGigSearch.toLowerCase()) ||
    serviceGig.description?.toLowerCase().includes(serviceGigSearch.toLowerCase()) ||
    serviceGig.user?.name?.toLowerCase().includes(serviceGigSearch.toLowerCase())
  );

  const handleAddServiceGig = (serviceGig) => {
    if (!selectedServiceGigs.find(sg => sg._id === serviceGig._id)) {
      setSelectedServiceGigs(prev => [...prev, serviceGig]);
    }
    setShowServiceGigDropdown(false);
    setServiceGigSearch('');
  };

  const handleRemoveServiceGig = (serviceGigId) => {
    setSelectedServiceGigs(prev => prev.filter(sg => sg._id !== serviceGigId));
  };

  const handleSendInvitations = async (e) => {
    e.preventDefault();
    
    if (!selectedTargetGig || selectedServiceGigs.length === 0 || !invitationMessage.trim()) {
      toast.error('Please select a target gig, at least one service gig, and add a message');
      return;
    }

    if (!hasInviteAccess) {
      toast.error('You do not have permission to send invitations');
      return;
    }

    setSendingInvitation(true);
    try {
      // Send invitations to all selected service gigs
      const invitationPromises = selectedServiceGigs.map(serviceGig =>
        axios.post('/api/invitations', {
          serviceGigId: serviceGig._id,
          targetGigId: selectedTargetGig._id,
          message: invitationMessage,
          compensation: compensation ? parseFloat(compensation) : null
        })
      );

      await Promise.all(invitationPromises);
      toast.success(`Invitations sent to ${selectedServiceGigs.length} service gig(s) successfully!`);
      
      // Reset form
      setSelectedTargetGig(null);
      setSelectedServiceGigs([]);
      setInvitationMessage('');
      setCompensation('');
      onRefresh();
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitations');
    } finally {
      setSendingInvitation(false);
    }
  };

  const handleAcceptInvitation = async (invitationId, responseMessage = '') => {
    try {
      await axios.post(`/api/invitations/${invitationId}/accept`, {
        responseMessage
      });
      toast.success('Invitation accepted successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to accept invitation');
    }
  };

  const handleRejectInvitation = async (invitationId, responseMessage = '') => {
    try {
      await axios.post(`/api/invitations/${invitationId}/reject`, {
        responseMessage
      });
      toast.success('Invitation rejected');
      onRefresh();
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to reject invitation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'accepted': return <CheckBadgeIconSolid className="w-4 h-4" />;
      case 'rejected': return <XMarkIconSolid className="w-4 h-4" />;
      case 'expired': return <ClockIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Service Gig Invitations</h2>
        <p className="text-gray-600">Invite service gig owners to share your private gigs</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('send')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'send'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Send Invitations
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sent ({serviceInvitations.sent.length})
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Received ({serviceInvitations.received.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Send Invitation Form */}
          {activeTab === 'send' && (
            <div className="space-y-6">
              {!hasInviteAccess ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 text-sm">
                      You need manager, admin, or owner privileges to send invitations.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendInvitations} className="space-y-6">
                  {/* Step 1: Select Your Private Gig */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1. Select Your Private Gig to Share *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                      {privateGigs.map((gig) => (
                        <div
                          key={gig._id}
                          onClick={() => {
                            setSelectedTargetGig(gig);
                            setSelectedServiceGigs([]); // Reset service gigs when target changes
                          }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTargetGig?._id === gig._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900 text-sm">{gig.title}</h4>
                          <p className="text-sm text-gray-600">Budget: ${gig.budget}</p>
                          <p className="text-xs text-gray-500">
                            {gig.sharesCompleted}/{gig.sharesRequired} shares completed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {gig.description?.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                    {privateGigs.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No private gigs available. Create a private gig first.
                      </p>
                    )}
                  </div>

                  {/* Step 2: Select Service Gigs (only show after target gig is selected) */}
                  {selectedTargetGig && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. Select Service Gigs to Invite *
                      </label>
                      
                      {/* Selected Service Gigs */}
                      {selectedServiceGigs.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Selected Service Gigs ({selectedServiceGigs.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedServiceGigs.map((serviceGig) => (
                              <div
                                key={serviceGig._id}
                                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                <span>{serviceGig.title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveServiceGig(serviceGig._id)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Service Gig Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowServiceGigDropdown(!showServiceGigDropdown)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">
                              {selectedServiceGigs.length > 0 
                                ? `${selectedServiceGigs.length} service gig(s) selected`
                                : 'Click to browse service gigs...'
                              }
                            </span>
                            <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${
                              showServiceGigDropdown ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </button>

                        {showServiceGigDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                            {/* Search Bar */}
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                  type="text"
                                  placeholder="Search service gigs..."
                                  value={serviceGigSearch}
                                  onChange={(e) => setServiceGigSearch(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            {/* Service Gig List */}
                            <div className="p-2 space-y-2">
                              {filteredServiceGigs.map((serviceGig) => (
                                <div
                                  key={serviceGig._id}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                    selectedServiceGigs.find(sg => sg._id === serviceGig._id)
                                      ? 'bg-blue-50 border-blue-200'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    {serviceGig.image?.url ? (
                                      <img
                                        src={serviceGig.image.url}
                                        alt={serviceGig.title}
                                        className="w-10 h-10 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <RocketLaunchIcon className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 text-sm">{serviceGig.title}</h4>
                                      <p className="text-sm text-gray-600">${serviceGig.price}</p>
                                      <p className="text-xs text-gray-500">by {serviceGig.user?.name}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setShowServiceGigDetails(serviceGig)}
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                      title="View Details"
                                    >
                                      <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAddServiceGig(serviceGig)}
                                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                      {selectedServiceGigs.find(sg => sg._id === serviceGig._id) ? 'Added' : 'Add'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              
                              {filteredServiceGigs.length === 0 && (
                                <p className="text-center text-gray-500 py-4 text-sm">
                                  No service gigs found matching your search.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        You can select multiple service gigs to send invitations to all of them at once.
                      </p>
                    </div>
                  )}

                  {/* Step 3: Invitation Details (only show after service gigs are selected) */}
                  {selectedTargetGig && selectedServiceGigs.length > 0 && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900">3. Invitation Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invitation Message *
                        </label>
                        <textarea
                          value={invitationMessage}
                          onChange={(e) => setInvitationMessage(e.target.value)}
                          placeholder={`Explain why you're inviting these service gig owners to share "${selectedTargetGig.title}"...`}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Compensation (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            value={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Additional payment beyond the service gig price (applies to all selected service gigs)
                        </p>
                      </div> */}

                      {/* Invitation Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 text-sm mb-3">Invitation Summary</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Target Gig:</span>
                            <span className="font-medium">{selectedTargetGig.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gig Budget:</span>
                            <span className="font-medium">${selectedTargetGig.budget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Gigs Selected:</span>
                            <span className="font-medium">{selectedServiceGigs.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block mb-1">Selected Service Gigs:</span>
                            <div className="space-y-1">
                              {selectedServiceGigs.map((serviceGig) => (
                                <div key={serviceGig._id} className="flex justify-between text-xs">
                                  <span>{serviceGig.title}</span>
                                  <span>${serviceGig.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {compensation && (
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-gray-600">Additional Compensation:</span>
                              <span className="font-medium text-green-600">
                                ${parseFloat(compensation).toFixed(2)} each
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={sendingInvitation}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        {sendingInvitation 
                          ? `Sending ${selectedServiceGigs.length} Invitation(s)...` 
                          : `Send ${selectedServiceGigs.length} Invitation(s)`
                        }
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Service Gig Details Modal */}
          {showServiceGigDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{showServiceGigDetails.title}</h3>
                    <button
                      onClick={() => setShowServiceGigDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {showServiceGigDetails.image?.url && (
                      <img
                        src={showServiceGigDetails.image.url}
                        alt={showServiceGigDetails.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{showServiceGigDetails.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Price</h4>
                        <p className="text-2xl font-bold text-blue-600">${showServiceGigDetails.price}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Time</h4>
                        <p className="text-gray-600">{showServiceGigDetails.deliveryText}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Service Provider</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {showServiceGigDetails.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{showServiceGigDetails.user?.name}</p>
                          <p className="text-sm text-gray-500">{showServiceGigDetails.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {showServiceGigDetails.tags && showServiceGigDetails.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {showServiceGigDetails.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowServiceGigDetails(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          handleAddServiceGig(showServiceGigDetails);
                          setShowServiceGigDetails(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to Selection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sent Invitations */}
          {activeTab === 'sent' && (
            <DataCard
              data={serviceInvitations.sent}
              emptyMessage="No invitations sent yet"
            >
              <div className="space-y-4">
                {serviceInvitations.sent.map((invitation) => (
                  <div key={invitation._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {invitation.serviceGig?.image?.url ? (
                            <img
                              src={invitation.serviceGig.image.url}
                              alt={invitation.serviceGig.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <RocketLaunchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{invitation.serviceGig?.title}</h4>
                            <p className="text-sm text-gray-600">To: {invitation.recipient?.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{invitation.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Target: {invitation.targetGig?.title}</span>
                          <span>Sent: {new Date(invitation.sentAt).toLocaleDateString()}</span>
                          {invitation.compensation && (
                            <span>+${invitation.compensation} bonus</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invitation.status)}`}>
                          {getStatusIcon(invitation.status)}
                          <span className="ml-1">{invitation.status}</span>
                        </span>
                      </div>
                    </div>
                    {invitation.responseMessage && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Response:</strong> {invitation.responseMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DataCard>
          )}

          {/* Received Invitations */}
          {activeTab === 'received' && (
            <DataCard
              data={serviceInvitations.received}
              emptyMessage="No invitations received yet"
            >
              <div className="space-y-4">
                {serviceInvitations.received.map((invitation) => (
                  <div key={invitation._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <UserCircleIcon className="w-10 h-10 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">Invitation from {invitation.sender?.name}</h4>
                            <p className="text-sm text-gray-600">Company: {invitation.company?.companyName}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{invitation.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Target Gig: {invitation.targetGig?.title}</span>
                          <span>Budget: ${invitation.targetGig?.budget}</span>
                          {invitation.compensation && (
                            <span className="text-green-600 font-medium">+${invitation.compensation} bonus</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {invitation.status === 'pending' && !invitation.isExpired ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptInvitation(invitation._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                            >
                              <CheckBadgeIconSolid className="w-4 h-4 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectInvitation(invitation._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                            >
                              <XMarkIconSolid className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invitation.status)}`}>
                            {getStatusIcon(invitation.status)}
                            <span className="ml-1">{invitation.status}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {invitation.isExpired && invitation.status === 'pending' && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                        This invitation has expired
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DataCard>
          )}
        </div>
      </div>
    </div>
  );
};

// Gigs Management Component
const GigsManagement = ({ data, userRole, onRefresh }) => {
  const { gigs } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateGig = () => {
    toast.info('Create gig feature coming soon');
  };

  const handleEditGig = (gigId) => {
    toast.info(`Edit gig ${gigId} - feature coming soon`);
  };

  const handleDeleteGig = (gigId) => {
    if (confirm('Are you sure you want to delete this gig?')) {
      toast.info(`Delete gig ${gigId} - feature coming soon`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gigs Management</h2>
          <p className="text-gray-600">Manage your company's gigs and campaigns</p>
        </div>
        <button
          onClick={handleCreateGig}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New Gig
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Gigs List */}
      <DataCard
        title={`All Gigs (${filteredGigs.length})`}
        data={filteredGigs}
        emptyMessage="No gigs found. Create your first gig to get started."
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">Gig Title</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Budget</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Shares</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Created</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGigs.map((gig) => (
                <tr key={gig._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{gig.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{gig.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    ${gig.budget?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                      {gig.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {gig.sharesCount || 0}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditGig(gig._id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit Gig"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGig(gig._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete Gig"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};

// Team Management Component
const TeamManagement = ({ data, userRole, onRefresh }) => {
  const { team } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredTeam = team.filter(member => {
    const matchesSearch = member.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRemoveMember = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      toast.info(`Remove member ${memberId} - feature coming soon`);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        <p className="text-gray-600">Manage your company team members and their roles</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>

      {/* Team List */}
      <DataCard
        title={`Team Members (${filteredTeam.length})`}
        data={filteredTeam}
        emptyMessage="No team members found. Invite members to join your company."
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">Member</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeam.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {member.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.user?.name}</p>
                        <p className="text-sm text-gray-500">{member.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};

// Shares Management Component
const SharesManagement = ({ data, userRole, onRefresh }) => {
  const { shares } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShares = shares.filter(share => {
    const matchesSearch = share.gig?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         share.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || share.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveShare = (shareId) => {
    toast.info(`Approve share ${shareId} - feature coming soon`);
  };

  const handleRejectShare = (shareId) => {
    toast.info(`Reject share ${shareId} - feature coming soon`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Shares Management</h2>
        <p className="text-gray-600">Track and manage all shares from your team members</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">{shares.length}</p>
          <p className="text-sm text-gray-600">Total Shares</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {shares.filter(s => s.status === 'approved').length}
          </p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {shares.filter(s => s.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">
            ${shares.reduce((total, share) => total + (share.amountEarned || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Earned</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shares by gig or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Shares List */}
      <DataCard
        title={`All Shares (${filteredShares.length})`}
        data={filteredShares}
        emptyMessage="No shares found. Team members will appear here when they start sharing gigs."
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Gig</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Shared Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShares.map((share) => (
                <tr key={share._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {share.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{share.user?.name}</p>
                        <p className="text-xs text-gray-500">{share.platform}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900 text-sm">{share.gig?.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{share.gig?.description}</p>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900">
                    ${share.amountEarned?.toLocaleString() || '0'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                      {share.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(share.sharedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {share.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveShare(share._id)}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectShare(share._id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => toast.info(`View details for ${share._id}`)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};

// Main Dashboard Components
const DashboardOverview = ({ data, userRole }) => {
  const { dashboard, gigs, team, shares, invitations } = data;
  
  if (!dashboard) return null;

  const { company, stats: dashboardStats, recentActivity } = dashboard;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {company.companyName}!</h1>
            <p className="text-blue-100 mt-1">
              {userRole ? `Your role: ${userRole}` : 'Here\'s your company performance overview.'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Total Spent</p>
            <p className="text-2xl font-bold">${dashboardStats.financial?.totalSpent?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          title="Active Gigs"
          value={dashboardStats.activeGigs || 0}
          subtitle="Currently running"
          trend={8}
          color="blue"
        />
        <StatCard
          icon={ShareIcon}
          title="Total Shares"
          value={dashboardStats.totalShares || 0}
          subtitle="Completed shares"
          trend={15}
          color="green"
        />
        <StatCard
          icon={CurrencyDollarIcon}
          title="Total Spent"
          value={`$${dashboardStats.financial?.totalSpent?.toLocaleString() || '0'}`}
          subtitle="All time spending"
          trend={22}
          color="orange"
        />
        <StatCard
          icon={UsersIcon}
          title="Team Members"
          value={team.length || 0}
          subtitle="Active team"
          trend={5}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Gigs */}
        <DataCard
          title="Recent Gigs"
          data={recentActivity?.gigs}
          emptyMessage="No recent gigs"
        >
          {recentActivity?.gigs?.map((gig) => (
            <div key={gig._id} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {gig.title}
                  </h4>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <span>${gig.budget}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      gig.isActive 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {gig.isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </DataCard>

        {/* Recent Shares */}
        <DataCard
          title="Recent Shares"
          data={recentActivity?.shares}
          emptyMessage="No recent shares"
        >
          {recentActivity?.shares?.map((share) => (
            <div key={share._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {share.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{share.user?.name}</p>
                      <p className="text-xs text-gray-600">Shared {share.gig?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Earned: ${share.amountEarned || 0}</span>
                    <span>Status: {share.submissionStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </DataCard>
      </div>
    </div>
  );
};

const InvitationsManagement = ({ data, userRole, onRefresh }) => {
  const { invitations } = data;
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const hasAdminAccess = userRole && ['admin', 'owner'].includes(userRole);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!hasAdminAccess) {
      toast.error('You do not have permission to send invitations');
      return;
    }

    setSendingInvite(true);
    try {
      await axios.post('/api/company/invite', {
        email: inviteEmail,
        role: inviteRole,
        message: inviteMessage
      });
      toast.success('Invitation sent successfully');
      setInviteEmail('');
      setInviteRole('member');
      setInviteMessage('');
      setShowInviteForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setSendingInvite(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Team Member Form */}
      {showInviteForm && hasAdminAccess && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingInvite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                {sendingInvite ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invitations List */}
      <DataCard 
        title={
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Team Invitations ({invitations.length})
            </span>
            {hasAdminAccess ? (
              <button
                onClick={() => setShowInviteForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Invite Member
              </button>
            ) : (
              <div className="text-sm text-gray-500 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                Admin access required
              </div>
            )}
          </div>
        }
        data={invitations}
        emptyMessage="No invitations sent yet"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">Recipient</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Sent</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {invitation.recipient?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invitation.recipient?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{invitation.recipient?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 capitalize">
                    {invitation.customOffer?.role || 'member'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                      {invitation.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(invitation.sentAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {hasAdminAccess && invitation.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this invitation?')) {
                            toast.info('Cancel invitation feature coming soon');
                          }
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Cancel Invitation"
                      >
                        <XCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};

const CompanySettings = ({ data, userRole, onRefresh }) => {
  const { settings } = data;
  const { user } = useAuth();
  const [settingsForm, setSettingsForm] = useState({
    companyName: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
    address: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });
  const [saving, setSaving] = useState(false);

  // FIX: Make sure this also includes 'owner'
  const hasAdminAccess = userRole && ['admin', 'owner'].includes(userRole);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        companyName: settings.companyName || '',
        description: settings.description || '',
        website: settings.website || '',
        industry: settings.industry || '',
        companySize: settings.companySize || '',
        address: settings.address || '',
        socialMedia: settings.socialMedia || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      });
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!hasAdminAccess) {
      toast.error('You do not have permission to update settings');
      return;
    }

    setSaving(true);
    try {
      await axios.put('/api/company/profile', settingsForm);
      toast.success('Company settings updated successfully');
      onRefresh();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setSettingsForm(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  if (!hasAdminAccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You need admin or owner privileges to access company settings.
        </p>
        <p className="text-sm text-gray-500">
          Current role: <span className="font-medium">{userRole || 'Unknown'}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Company Profile Settings</h3>
          <p className="text-sm text-gray-600 mt-1">Admin access required</p>
        </div>
        
        <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={settingsForm.industry}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={settingsForm.companySize}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="url"
                    value={settingsForm.website}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              value={settingsForm.description}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your company..."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <CogIcon className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, sidebarOpen, onClose, navigationTabs, userRole }) => (
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  }`}>
    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <BuildingOfficeIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-900 font-bold text-lg">Company Panel</span>
      </div>
      <button
        onClick={onClose}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <XMarkIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <nav className="mt-8 px-4 space-y-2">
      {navigationTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-700 border border-blue-200',
          green: 'bg-green-50 text-green-700 border border-green-200',
          purple: 'bg-purple-50 text-purple-700 border border-purple-200',
          orange: 'bg-orange-50 text-orange-700 border border-orange-200',
          indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
          gray: 'bg-gray-50 text-gray-700 border border-gray-200'
        };
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
              isActive
                ? colorClasses[tab.color]
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon className={`w-5 h-5 mr-3 transition-colors ${
              isActive ? 'text-current' : 'text-gray-400 group-hover:text-gray-600'
            }`} />
            <span className="flex-1 font-medium">{tab.name}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-6 flex items-center justify-center ${
                isActive
                  ? 'bg-current text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Your Role</p>
        <p className="text-lg font-bold text-gray-900 capitalize">{userRole}</p>
      </div>
    </div>
  </div>
);

// Main Company Dashboard Component
const CompanyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useCompanyData();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = user?.companyRole;
  const hasAdminAccess = userRole && ['admin', 'owner'].includes(userRole);

  // Navigation tabs - conditionally include settings based on role
  const navigationTabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: HomeIcon,
      color: 'blue'
    },
    { 
      id: 'gigs', 
      name: 'Gigs', 
      icon: BriefcaseIcon,
      color: 'green',
      count: data.gigs.length
    },
    { 
      id: 'team', 
      name: 'Team', 
      icon: UserGroupIcon,
      color: 'purple',
      count: data.team.length
    },
    { 
      id: 'shares', 
      name: 'Shares', 
      icon: ShareIcon,
      color: 'orange',
      count: data.shares.length
    },
    { 
      id: 'invitations', 
      name: 'Team Invites', 
      icon: EnvelopeIcon,
      color: 'indigo',
      count: data.invitations.filter(inv => inv.status === 'pending').length
    },
    { 
      id: 'service-invitations', 
      name: 'Service Invites', 
      icon: RocketLaunchIcon,
      color: 'pink',
      count: data.serviceInvitations.sent.filter(inv => inv.status === 'pending').length + 
             data.serviceInvitations.received.filter(inv => inv.status === 'pending').length
    },
    // Only show settings tab for admin/owner
    ...(hasAdminAccess ? [{
      id: 'settings', 
      name: 'Settings', 
      icon: CogIcon,
      color: 'gray'
    }] : [])
  ];

  // Check if user belongs to a company
  if (!authLoading && !user?.company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Company Found</h2>
          <p className="text-gray-600 mb-4">You are not associated with any company.</p>
          <button
            onClick={() => window.location.href = '/company/register'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Company
          </button>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview data={data} userRole={userRole} />;
      case 'gigs':
        return <GigsManagement data={data} userRole={userRole} onRefresh={refetch} />;
      case 'team':
        return <TeamManagement data={data} userRole={userRole} onRefresh={refetch} />;
      case 'shares':
        return <SharesManagement data={data} userRole={userRole} onRefresh={refetch} />;
      case 'invitations':
        return <InvitationsManagement data={data} userRole={userRole} onRefresh={refetch} />;
      case 'service-invitations':
        return <ServiceGigInvitations data={data} userRole={userRole} onRefresh={refetch} />;
      case 'settings':
        return <CompanySettings data={data} userRole={userRole} onRefresh={refetch} />;
      default:
        return <DashboardOverview data={data} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigationTabs={navigationTabs}
        userRole={userRole}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationTabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {data.dashboard?.company?.companyName} • {userRole}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refetch}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 min-h-screen">
          {renderActiveTab()}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyDashboard;