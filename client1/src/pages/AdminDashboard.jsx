

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   UsersIcon, 
//   BriefcaseIcon, 
//   ShareIcon, 
//   CurrencyDollarIcon,
//   ArrowTrendingUpIcon,
//   ClockIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   EyeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   UserGroupIcon,
//   ChartBarIcon,
//   BanknotesIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline';
// import { colors, colorVariants } from '../constants/colors';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [recentGigs, setRecentGigs] = useState([]);
//   const [recentShares, setRecentShares] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // NEW STATE FOR ENHANCED FEATURES
//   const [users, setUsers] = useState([]);
//   const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
//   const [flaggedGigs, setFlaggedGigs] = useState([]);
//   const [platformEarnings, setPlatformEarnings] = useState(0);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [userRoleFilter, setUserRoleFilter] = useState('all');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [
//         statsRes, 
//         gigsRes, 
//         sharesRes,
//         usersRes,
//         withdrawalsRes,
//         earningsRes,
//         flaggedGigsRes
//       ] = await Promise.all([
//         axios.get('/api/admin/stats'),
//         axios.get('/api/admin/gigs'),
//         axios.get('/api/admin/shares'),
//         axios.get('/api/admin/users'),
//         axios.get('/api/admin/pending-withdrawals'),
//         axios.get('/api/admin/platform-earnings'),
//         axios.get('/api/admin/flagged-gigs')
//       ]);

//       setStats(statsRes.data.data);
//       setRecentGigs(gigsRes.data.data.slice(0, 5));
//       setRecentShares(sharesRes.data.data.slice(0, 5));
//       setUsers(usersRes.data.data);
//       setPendingWithdrawals(withdrawalsRes.data.data);
//       setPlatformEarnings(earningsRes.data.data.totalEarnings || 0);
//       setFlaggedGigs(flaggedGigsRes.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced StatCard Component
//   const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
//     const colorVariant = colorVariants[color];
    
//     return (
//       <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
//             <p className="text-3xl font-bold text-white">{value}</p>
//             {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
//           </div>
//           <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to}`}>
//             <Icon className="w-6 h-6 text-white" />
//           </div>
//         </div>
//         {trend && (
//           <div className="flex items-center mt-3">
//             <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
//             <span className="text-sm text-green-300 font-medium">{trend}</span>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // DataCard Component
//   const DataCard = ({ title, children, emptyMessage, data }) => (
//     <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden text-white">
//       <div className="px-6 py-4 border-b border-white/20">
//         <h3 className="text-lg font-semibold flex items-center">{title}</h3>
//       </div>
//       <div className="divide-y divide-white/10">
//         {data.length > 0 ? children : (
//           <div className="px-6 py-8 text-center">
//             <div className="text-gray-300 mb-2 text-2xl">📊</div>
//             <p className="text-gray-300 text-sm">{emptyMessage}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // User Management Component
//   const UserManagement = () => {
//     const filteredUsers = users.filter(user => {
//       const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
//       return matchesSearch && matchesRole;
//     });

//     const handleRoleChange = async (userId, newRole) => {
//       try {
//         await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
//         fetchDashboardData(); // Refresh data
//       } catch (error) {
//         console.error('Error updating user role:', error);
//       }
//     };

//     return (
//       <DataCard 
//         title={
//           <div className="flex items-center justify-between w-full">
//             <span className="flex items-center">
//               <UserGroupIcon className="w-5 h-5 mr-2" />
//               User Management ({filteredUsers.length} users)
//             </span>
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm"
//                 />
//               </div>
//               <select
//                 value={userRoleFilter}
//                 onChange={(e) => setUserRoleFilter(e.target.value)}
//                 className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="user">Users</option>
//                 <option value="admin">Admins</option>
//                 <option value="moderator">Moderators</option>
//               </select>
//             </div>
//           </div>
//         }
//         data={filteredUsers}
//         emptyMessage="No users found"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-white/20">
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">User</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Email</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Role</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Balance</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-white/5 transition-colors">
//                   <td className="p-4">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
//                         {user.name.charAt(0).toUpperCase()}
//                       </div>
//                       <span className="font-medium">{user.name}</span>
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">{user.email}</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                       user.role === 'admin' ? 'bg-red-400/20 text-red-300' :
//                       user.role === 'moderator' ? 'bg-blue-400/20 text-blue-300' :
//                       'bg-green-400/20 text-green-300'
//                     }`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">
//                     ${parseFloat(user.walletBalance?.$numberDecimal || 0).toFixed(2)}
//                   </td>
//                   <td className="p-4">
//                     <select
//                       value={user.role}
//                       onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                       className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs"
//                     >
//                       <option value="user">User</option>
//                       <option value="moderator">Moderator</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </DataCard>
//     );
//   };

//   // Withdrawal Approval Component
//   const WithdrawalApproval = () => {
//     const handleWithdrawalAction = async (withdrawalId, action) => {
//       try {
//         await axios.post(`/api/admin/withdrawals/${withdrawalId}/${action}`);
//         fetchDashboardData(); // Refresh data
//       } catch (error) {
//         console.error(`Error ${action} withdrawal:`, error);
//       }
//     };

//     return (
//       <DataCard 
//         title={
//           <span className="flex items-center">
//             <BanknotesIcon className="w-5 h-5 mr-2" />
//             Pending Withdrawals ({pendingWithdrawals.length})
//           </span>
//         }
//         data={pendingWithdrawals}
//         emptyMessage="No pending withdrawals"
//       >
//         <div className="divide-y divide-white/10">
//           {pendingWithdrawals.map((withdrawal) => (
//             <div key={withdrawal._id} className="p-4 hover:bg-white/5 transition-colors">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
//                       <BanknotesIcon className="w-5 h-5 text-yellow-400" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white">{withdrawal.userName}</p>
//                       <p className="text-sm text-gray-300">{withdrawal.userEmail}</p>
//                       <p className="text-xs text-gray-400">
//                         Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-lg font-bold text-white">${withdrawal.amount}</p>
//                   <p className="text-sm text-gray-300 capitalize">{withdrawal.paymentMethod}</p>
//                 </div>
//                 <div className="flex space-x-2 ml-4">
//                   <button
//                     onClick={() => handleWithdrawalAction(withdrawal._id, 'approve')}
//                     className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
//                   >
//                     <CheckCircleIcon className="w-4 h-4 mr-1" />
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleWithdrawalAction(withdrawal._id, 'reject')}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center"
//                   >
//                     <XCircleIcon className="w-4 h-4 mr-1" />
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </DataCard>
//     );
//   };

//   // Gig Moderation Component
//   const GigModeration = () => {
//     const handleGigAction = async (gigId, action) => {
//       try {
//         await axios.post(`/api/admin/gigs/${gigId}/${action}`);
//         fetchDashboardData(); // Refresh data
//       } catch (error) {
//         console.error(`Error ${action} gig:`, error);
//       }
//     };

//     return (
//       <DataCard 
//         title={
//           <span className="flex items-center">
//             <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
//             Gig Moderation Queue ({flaggedGigs.length})
//           </span>
//         }
//         data={flaggedGigs}
//         emptyMessage="No gigs awaiting moderation"
//       >
//         <div className="divide-y divide-white/10">
//           {flaggedGigs.map((gig) => (
//             <div key={gig._id} className="p-4 hover:bg-white/5 transition-colors">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-white mb-1">{gig.title}</h4>
//                   <p className="text-sm text-gray-300 line-clamp-2 mb-2">{gig.description}</p>
//                   <div className="flex items-center space-x-4 text-xs text-gray-400">
//                     <span>By: {gig.user?.name}</span>
//                     <span>Budget: ${gig.budget}</span>
//                     <span>Type: {gig.contentType}</span>
//                     <span>Created: {new Date(gig.createdAt).toLocaleDateString()}</span>
//                   </div>
//                   {gig.flagReason && (
//                     <div className="mt-2 p-2 bg-red-400/20 border border-red-400/30 rounded">
//                       <p className="text-xs text-red-300">
//                         <strong>Flag Reason:</strong> {gig.flagReason}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex space-x-2 ml-4">
//                   <button
//                     onClick={() => handleGigAction(gig._id, 'approve')}
//                     className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleGigAction(gig._id, 'reject')}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
//                   >
//                     Reject
//                   </button>
//                   <button
//                     onClick={() => window.open(`/gigs/${gig._id}`, '_blank')}
//                     className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
//                   >
//                     <EyeIcon className="w-4 h-4 mr-1" />
//                     View
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </DataCard>
//     );
//   };

//   // Platform Analytics Component
//   const PlatformAnalytics = () => {
//     const growthData = {
//       users: stats?.totalUsers || 0,
//       gigs: stats?.totalGigs || 0,
//       shares: stats?.totalShares || 0,
//       revenue: platformEarnings
//     };

//     return (
//       <DataCard 
//         title={
//           <span className="flex items-center">
//             <ChartBarIcon className="w-5 h-5 mr-2" />
//             Platform Analytics
//           </span>
//         }
//         data={[growthData]} // Pass dummy data to show the card
//         emptyMessage="No analytics data available"
//       >
//         <div className="p-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <div className="text-center p-4 bg-white/5 rounded-lg">
//               <div className="text-2xl font-bold text-blue-300">{growthData.users}</div>
//               <div className="text-sm text-gray-300">Total Users</div>
//             </div>
//             <div className="text-center p-4 bg-white/5 rounded-lg">
//               <div className="text-2xl font-bold text-green-300">{growthData.gigs}</div>
//               <div className="text-sm text-gray-300">Total Gigs</div>
//             </div>
//             <div className="text-center p-4 bg-white/5 rounded-lg">
//               <div className="text-2xl font-bold text-purple-300">{growthData.shares}</div>
//               <div className="text-sm text-gray-300">Total Shares</div>
//             </div>
//             <div className="text-center p-4 bg-white/5 rounded-lg">
//               <div className="text-2xl font-bold text-yellow-300">${growthData.revenue.toFixed(2)}</div>
//               <div className="text-sm text-gray-300">Platform Revenue</div>
//             </div>
//           </div>

//           {/* Simple Growth Indicators */}
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm text-gray-300 mb-1">
//                 <span>User Growth</span>
//                 <span>+12% this month</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div className="bg-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm text-gray-300 mb-1">
//                 <span>Gig Creation</span>
//                 <span>+8% this month</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div className="bg-green-400 h-2 rounded-full" style={{ width: '50%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm text-gray-300 mb-1">
//                 <span>Revenue Growth</span>
//                 <span>+15% this month</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DataCard>
//     );
//   };

// // Add this component inside your AdminDashboard.jsx
// const AnalyticsDashboard = () => {
//   const [topSharers, setTopSharers] = useState([]);
//   const [topCreators, setTopCreators] = useState([]);
//   const [gigPerformance, setGigPerformance] = useState([]);
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
//   const [analyticsPeriod, setAnalyticsPeriod] = useState('month');

//   const fetchAnalytics = async () => {
//     setAnalyticsLoading(true);
//     try {
//       const [sharersRes, creatorsRes, performanceRes] = await Promise.all([
//         axios.get(`/api/admin/analytics/top-sharers?period=${analyticsPeriod}&limit=10`),
//         axios.get(`/api/admin/analytics/top-creators?period=${analyticsPeriod}&limit=10`),
//         axios.get(`/api/admin/analytics/gig-performance?period=${analyticsPeriod}&limit=15`)
//       ]);

//       setTopSharers(sharersRes.data.data);
//       setTopCreators(creatorsRes.data.data);
//       setGigPerformance(performanceRes.data.data);
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//     } finally {
//       setAnalyticsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//   }, [analyticsPeriod]);

//   const StatCard = ({ title, value, subtitle, color = 'blue' }) => (
//     <div className={`p-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm`}>
//       <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
//       <p className="text-2xl font-bold text-white">{value}</p>
//       {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Analytics Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-2">Platform Analytics</h2>
//           <p className="text-gray-200">Performance metrics for sharers and creators</p>
//         </div>
//         <div className="flex items-center space-x-2 mt-4 lg:mt-0">
//           <select
//             value={analyticsPeriod}
//             onChange={(e) => setAnalyticsPeriod(e.target.value)}
//             className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
//           >
//             <option value="week">Last 7 Days</option>
//             <option value="month">Last 30 Days</option>
//             <option value="all">All Time</option>
//           </select>
//           <button
//             onClick={fetchAnalytics}
//             disabled={analyticsLoading}
//             className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
//           >
//             {analyticsLoading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard
//           title="Top Sharer"
//           value={topSharers[0]?.userName || 'N/A'}
//           subtitle={`${topSharers[0]?.totalShares || 0} shares`}
//           color="green"
//         />
//         <StatCard
//           title="Top Creator"
//           value={topCreators[0]?.userName || 'N/A'}
//           subtitle={`${topCreators[0]?.totalGigs || 0} gigs`}
//           color="blue"
//         />
//         <StatCard
//           title="Total Shares"
//           value={topSharers.reduce((sum, user) => sum + user.totalShares, 0)}
//           subtitle={`${analyticsPeriod} period`}
//           color="purple"
//         />
//         <StatCard
//           title="Platform Revenue"
//           value={`$${topCreators.reduce((sum, creator) => sum + creator.platformRevenue, 0).toFixed(2)}`}
//           subtitle="From creators"
//           color="orange"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Sharers */}
//         <DataCard
//           title={
//             <span className="flex items-center">
//               <ShareIcon className="w-5 h-5 mr-2" />
//               Top Sharers
//             </span>
//           }
//           data={topSharers}
//           emptyMessage="No sharing data available"
//         >
//           <div className="divide-y divide-white/10">
//             {topSharers.map((user, index) => (
//               <div key={user.userId} className="p-4 hover:bg-white/5 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-8 h-8 bg-green-400/20 rounded-lg">
//                       <span className="text-green-300 font-bold text-sm">{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white">{user.userName}</p>
//                       <p className="text-xs text-gray-400">{user.userEmail}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-bold text-white">{user.totalShares} shares</p>
//                     <div className="flex items-center space-x-2 text-xs text-gray-300">
//                       <span>${user.totalEarnings.toFixed(2)}</span>
//                       <span>•</span>
//                       <span>{user.approvedShares} approved</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
//                   <span>{user.uniqueClicks} unique clicks</span>
//                   <span>CTR: {user.clickThroughRate.toFixed(1)}%</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </DataCard>

//         {/* Top Creators */}
//         <DataCard
//           title={
//             <span className="flex items-center">
//               <BriefcaseIcon className="w-5 h-5 mr-2" />
//               Top Creators
//             </span>
//           }
//           data={topCreators}
//           emptyMessage="No creator data available"
//         >
//           <div className="divide-y divide-white/10">
//             {topCreators.map((creator, index) => (
//               <div key={creator.userId} className="p-4 hover:bg-white/5 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-8 h-8 bg-blue-400/20 rounded-lg">
//                       <span className="text-blue-300 font-bold text-sm">{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white">{creator.userName}</p>
//                       <p className="text-xs text-gray-400">{creator.userEmail}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-bold text-white">{creator.totalGigs} gigs</p>
//                     <div className="flex items-center space-x-2 text-xs text-gray-300">
//                       <span>${creator.totalBudget.toFixed(2)} spent</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-400">
//                   <div>
//                     <span className="block">{creator.activeGigs} active</span>
//                     <span className="text-green-300">{creator.completedGigs} completed</span>
//                   </div>
//                   <div>
//                     <span className="block">{creator.totalSharesCompleted} shares</span>
//                     <span>{creator.avgCompletionRate.toFixed(1)}% rate</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="block text-yellow-300">
//                       ${creator.platformRevenue.toFixed(2)}
//                     </span>
//                     <span>platform revenue</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </DataCard>
//       </div>

//       {/* Gig Performance */}
//       <DataCard
//         title={
//           <span className="flex items-center">
//             <ChartBarIcon className="w-5 h-5 mr-2" />
//             Gig Performance
//           </span>
//         }
//         data={gigPerformance}
//         emptyMessage="No gig performance data available"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-white/20">
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Gig Title</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Creator</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Budget</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Progress</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Clicks</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Cost/Share</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {gigPerformance.map((gig) => (
//                 <tr key={gig._id} className="hover:bg-white/5 transition-colors">
//                   <td className="p-4">
//                     <p className="font-medium text-white text-sm line-clamp-1">{gig.title}</p>
//                     <p className="text-xs text-gray-400 capitalize">{gig.contentType}</p>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">{gig.creatorName}</td>
//                   <td className="p-4 text-sm text-gray-300">${gig.budget}</td>
//                   <td className="p-4">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-16 bg-white/20 rounded-full h-2">
//                         <div 
//                           className="bg-green-400 h-2 rounded-full"
//                           style={{ width: `${gig.completionRate}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-xs text-gray-300 w-8">
//                         {gig.completionRate.toFixed(0)}%
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">
//                       {gig.sharesCompleted}/{gig.sharesRequired}
//                     </p>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">{gig.totalClicks}</td>
//                   <td className="p-4 text-sm text-gray-300">
//                     ${gig.costPerShare.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </DataCard>
//     </div>
//   );
// };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white/80">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient">
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
//         {/* Header */}
//         <div className="mb-8 text-center md:text-left">
//           <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Admin Dashboard</h1>
//           <p className="text-gray-200">Complete platform management and analytics</p>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
//             {[
//               { id: 'overview', name: 'Overview', icon: ChartBarIcon },
//               { id: 'users', name: 'User Management', icon: UserGroupIcon },
//               { id: 'withdrawals', name: 'Withdrawals', icon: BanknotesIcon },
//               { id: 'moderation', name: 'Gig Moderation', icon: ExclamationTriangleIcon },
//               { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
//                   activeTab === tab.id 
//                     ? 'bg-primary-600 text-white shadow-lg' 
//                     : 'text-gray-300 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 <tab.icon className="w-4 h-4 mr-2" />
//                 {tab.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'overview' && (
//           <>
//             {/* Enhanced Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//               <StatCard
//                 icon={UsersIcon}
//                 title="Total Users"
//                 value={stats?.totalUsers || 0}
//                 color="blue"
//               />
//               <StatCard
//                 icon={BriefcaseIcon}
//                 title="Total Gigs"
//                 value={stats?.totalGigs || 0}
//                 color="green"
//               />
//               <StatCard
//                 icon={ShareIcon}
//                 title="Total Shares"
//                 value={stats?.totalShares || 0}
//                 color="purple"
//               />
//               <StatCard
//                 icon={CurrencyDollarIcon}
//                 title="Platform Revenue"
//                 value={`$${platformEarnings.toFixed(2)}`}
//                 color="orange"
//                 subtitle="Total commission earned"
//               />
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                   <UserGroupIcon className="w-5 h-5 mr-2" />
//                   Quick User Stats
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Pending Withdrawals:</span>
//                     <span className="text-yellow-300 font-medium">{pendingWithdrawals.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Gigs Awaiting Moderation:</span>
//                     <span className="text-red-300 font-medium">{flaggedGigs.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Admin Users:</span>
//                     <span className="text-blue-300 font-medium">
//                       {users.filter(u => u.role === 'admin').length}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Activity */}
//               <div className="lg:col-span-2">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <DataCard 
//                     title="Recent Gigs" 
//                     data={recentGigs}
//                     emptyMessage="No gigs created yet"
//                   >
//                     <ul className="divide-y divide-white/10">
//                       {recentGigs.map((gig) => (
//                         <li key={gig._id} className="px-6 py-4 hover:bg-white/10 transition-all duration-200 rounded-lg">
//                           <div className="flex items-center justify-between">
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-semibold text-white truncate mb-1">
//                                 {gig.title}
//                               </p>
//                               <div className="flex items-center text-xs text-gray-200">
//                                 <UsersIcon className="w-3 h-3 mr-1" />
//                                 <span>by {gig.user?.name}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-col items-end space-y-1">
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/30 text-white border border-white/20">
//                                 ${gig.budget}
//                               </span>
//                               <div className="flex items-center text-xs text-gray-200">
//                                 <ShareIcon className="w-3 h-3 mr-1" />
//                                 <span>{gig.sharesCompleted}/{gig.sharesRequired}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </DataCard>

//                   <DataCard 
//                     title="Recent Shares" 
//                     data={recentShares}
//                     emptyMessage="No shares completed yet"
//                   >
//                     <ul className="divide-y divide-white/10">
//                       {recentShares.map((share) => (
//                         <li key={share._id} className="px-6 py-4 hover:bg-white/10 transition-all duration-200 rounded-lg">
//                           <div className="flex items-center justify-between">
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-semibold text-white truncate mb-1">
//                                 {share.gig?.title}
//                               </p>
//                               <div className="flex items-center text-xs text-gray-200">
//                                 <UsersIcon className="w-3 h-3 mr-1" />
//                                 <span>by {share.user?.name}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-col items-end space-y-1">
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/30 text-white border border-white/20">
//                                 ${share.amountEarned?.toFixed(2)}
//                               </span>
//                               <div className="flex items-center text-xs text-gray-200">
//                                 <ClockIcon className="w-3 h-3 mr-1" />
//                                 <span>{new Date(share.createdAt).toLocaleDateString()}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </DataCard>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* User Management Tab */}
//         {activeTab === 'users' && (
//           <div className="space-y-6">
//             <UserManagement />
//           </div>
//         )}


//         {activeTab === 'analytics' && (
//   <div className="space-y-6">
//     <AnalyticsDashboard />
//   </div>
// )}

//         {/* Withdrawals Tab */}
//         {activeTab === 'withdrawals' && (
//           <div className="space-y-6">
//             <WithdrawalApproval />
//           </div>
//         )}

//         {/* Gig Moderation Tab */}
//         {activeTab === 'moderation' && (
//           <div className="space-y-6">
//             <GigModeration />
//           </div>
//         )}

//         {/* Analytics Tab */}
//         {activeTab === 'analytics' && (
//           <div className="space-y-6">
//             <PlatformAnalytics />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  ShareIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
// Try to import colors, fallback if not available
let colors = {};
let colorVariants = {};

try {
  const colorModule = require('../constants/colors');
  colors = colorModule.colors || {};
  colorVariants = colorModule.colorVariants || {};
} catch (error) {
  console.warn('Color constants not found, using defaults');
  // Fallback color variants
  colorVariants = {
    blue: { from: 'from-blue-500', to: 'to-blue-600' },
    green: { from: 'from-green-500', to: 'to-green-600' },
    purple: { from: 'from-purple-500', to: 'to-purple-600' },
    orange: { from: 'from-orange-500', to: 'to-orange-600' },
    yellow: { from: 'from-yellow-500', to: 'to-yellow-600' },
    red: { from: 'from-red-500', to: 'to-red-600' }
  };
}
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentGigs, setRecentGigs] = useState([]);
  const [recentShares, setRecentShares] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ENHANCED STATE WITH COMPANY DATA
  const [users, setUsers] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [flaggedGigs, setFlaggedGigs] = useState([]);
  const [platformEarnings, setPlatformEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // NEW STATE FOR COMPANY MANAGEMENT
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [companyStats, setCompanyStats] = useState(null);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [companyStatusFilter, setCompanyStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        statsRes, 
        gigsRes, 
        sharesRes,
        usersRes,
        withdrawalsRes,
        earningsRes,
        flaggedGigsRes,
        companiesRes,
        pendingCompaniesRes,
        companyStatsRes
      ] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/gigs'),
        axios.get('/api/admin/shares'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/pending-withdrawals'),
        axios.get('/api/admin/platform-earnings'),
        axios.get('/api/admin/flagged-gigs'),
        axios.get('/api/admin/companies'),
        axios.get('/api/admin/companies/pending'),
        axios.get('/api/admin/companies/stats')
      ]);

      console.log(companiesRes)
      setStats(statsRes.data.data);
      setRecentGigs(gigsRes.data.data.slice(0, 5));
      setRecentShares(sharesRes.data.data.slice(0, 5));
      setUsers(usersRes.data.data);
      setPendingWithdrawals(withdrawalsRes.data.data);
      setPlatformEarnings(earningsRes.data.data.totalEarnings || 0);
      setFlaggedGigs(flaggedGigsRes.data.data);
      setCompanies(companiesRes.data.data);
      setPendingCompanies(pendingCompaniesRes.data.data);
      setCompanyStats(companyStatsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced StatCard Component
  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
    const colorVariant = colorVariants[color];
    
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-3">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-sm text-green-300 font-medium">{trend}</span>
          </div>
        )}
      </div>
    );
  };

  // DataCard Component
  const DataCard = ({ title, children, emptyMessage, data }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden text-white">
      <div className="px-6 py-4 border-b border-white/20">
        <h3 className="text-lg font-semibold flex items-center">{title}</h3>
      </div>
      <div className="divide-y divide-white/10">
        {data.length > 0 ? children : (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-300 mb-2 text-2xl">📊</div>
            <p className="text-gray-300 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  // User Management Component
  const UserManagement = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });

    const handleRoleChange = async (userId, newRole) => {
      try {
        await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    };

    return (
      <DataCard 
        title={
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              User Management ({filteredUsers.length} users)
            </span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
                <option value="moderator">Moderators</option>
              </select>
            </div>
          </div>
        }
        data={filteredUsers}
        emptyMessage="No users found"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-4 text-sm font-medium text-gray-200">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Balance</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-red-400/20 text-red-300' :
                      user.role === 'moderator' ? 'bg-blue-400/20 text-blue-300' :
                      'bg-green-400/20 text-green-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    ${parseFloat(user.walletBalance?.$numberDecimal || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    );
  };

  // Withdrawal Approval Component
  const WithdrawalApproval = () => {
    const handleWithdrawalAction = async (withdrawalId, action) => {
      try {
        await axios.post(`/api/admin/withdrawals/${withdrawalId}/${action}`);
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error(`Error ${action} withdrawal:`, error);
      }
    };

    return (
      <DataCard 
        title={
          <span className="flex items-center">
            <BanknotesIcon className="w-5 h-5 mr-2" />
            Pending Withdrawals ({pendingWithdrawals.length})
          </span>
        }
        data={pendingWithdrawals}
        emptyMessage="No pending withdrawals"
      >
        <div className="divide-y divide-white/10">
          {pendingWithdrawals.map((withdrawal) => (
            <div key={withdrawal._id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{withdrawal.userName}</p>
                      <p className="text-sm text-gray-300">{withdrawal.userEmail}</p>
                      <p className="text-xs text-gray-400">
                        Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${withdrawal.amount}</p>
                  <p className="text-sm text-gray-300 capitalize">{withdrawal.paymentMethod}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleWithdrawalAction(withdrawal._id, 'approve')}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleWithdrawalAction(withdrawal._id, 'reject')}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center"
                  >
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    );
  };

  // Gig Moderation Component
  const GigModeration = () => {
    const handleGigAction = async (gigId, action) => {
      try {
        await axios.post(`/api/admin/gigs/${gigId}/${action}`);
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error(`Error ${action} gig:`, error);
      }
    };

    return (
      <DataCard 
        title={
          <span className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            Gig Moderation Queue ({flaggedGigs.length})
          </span>
        }
        data={flaggedGigs}
        emptyMessage="No gigs awaiting moderation"
      >
        <div className="divide-y divide-white/10">
          {flaggedGigs.map((gig) => (
            <div key={gig._id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{gig.title}</h4>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{gig.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>By: {gig.user?.name}</span>
                    <span>Budget: ${gig.budget}</span>
                    <span>Type: {gig.contentType}</span>
                    <span>Created: {new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                  {gig.flagReason && (
                    <div className="mt-2 p-2 bg-red-400/20 border border-red-400/30 rounded">
                      <p className="text-xs text-red-300">
                        <strong>Flag Reason:</strong> {gig.flagReason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleGigAction(gig._id, 'approve')}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleGigAction(gig._id, 'reject')}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => window.open(`/gigs/${gig._id}`, '_blank')}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    );
  };

  // Platform Analytics Component
  const PlatformAnalytics = () => {
    const growthData = {
      users: stats?.totalUsers || 0,
      gigs: stats?.totalGigs || 0,
      shares: stats?.totalShares || 0,
      revenue: platformEarnings
    };

    return (
      <DataCard 
        title={
          <span className="flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Platform Analytics
          </span>
        }
        data={[growthData]} // Pass dummy data to show the card
        emptyMessage="No analytics data available"
      >
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-300">{growthData.users}</div>
              <div className="text-sm text-gray-300">Total Users</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-300">{growthData.gigs}</div>
              <div className="text-sm text-gray-300">Total Gigs</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">{growthData.shares}</div>
              <div className="text-sm text-gray-300">Total Shares</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-yellow-300">${growthData.revenue.toFixed(2)}</div>
              <div className="text-sm text-gray-300">Platform Revenue</div>
            </div>
          </div>

          {/* Simple Growth Indicators */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>User Growth</span>
                <span>+12% this month</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Gig Creation</span>
                <span>+8% this month</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Revenue Growth</span>
                <span>+15% this month</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </DataCard>
    );
  };

// NEW: Company Management Component with Expandable Rows and Modal
const CompanyManagement = () => {
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
                         company.businessEmail.toLowerCase().includes(companySearchTerm.toLowerCase());
    const matchesStatus = companyStatusFilter === 'all' || company.verificationStatus === companyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCompanyAction = async (companyId, action, reason = '') => {
    try {
      if (action === 'verify') {
        await axios.post(`/api/admin/companies/${companyId}/verify`);
      } else if (action === 'reject') {
        await axios.post(`/api/admin/companies/${companyId}/reject`, { reason });
      } else if (action === 'updateStatus') {
        await axios.put(`/api/admin/companies/${companyId}/status`, { status: reason });
      }
      fetchDashboardData(); // Refresh data
      setExpandedCompany(null); // Close expanded row
    } catch (error) {
      console.error(`Error ${action} company:`, error);
    }
  };

  const toggleExpand = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  const openModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-400/20 text-yellow-300', label: 'Pending' },
      verified: { color: 'bg-green-400/20 text-green-300', label: 'Verified' },
      rejected: { color: 'bg-red-400/20 text-red-300', label: 'Rejected' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Company Details Modal
  const CompanyDetailsModal = ({ company, onClose }) => {
    if (!company) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{company.companyName}</h2>
                <p className="text-gray-300">{company.businessEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XCircleIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Industry</label>
                    <p className="text-white capitalize">{company.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Company Size</label>
                    <p className="text-white">{company.companySize}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Website</label>
                    <p className="text-white">{company.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Tax ID</label>
                    <p className="text-white">{company.taxId || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Contact Person</label>
                    <p className="text-white">{company.contactPerson?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Position</label>
                    <p className="text-white">{company.contactPerson?.position || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white">{company.contactPerson?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {company.address && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Street</label>
                    <p className="text-white">{company.address.street || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">City</label>
                    <p className="text-white">{company.address.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">State</label>
                    <p className="text-white">{company.address.state || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Country</label>
                    <p className="text-white">{company.address.country || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Preferences */}
            {company.billingPreferences && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Billing Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Payment Method</label>
                    <p className="text-white capitalize">{company.billingPreferences.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Billing Cycle</label>
                    <p className="text-white capitalize">{company.billingPreferences.billingCycle}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Credit Limit</label>
                    <p className="text-white">${company.billingPreferences.creditLimit}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Auto Replenish</label>
                    <p className="text-white">{company.billingPreferences.autoReplenish ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            {company.teamMembers && company.teamMembers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Team Members ({company.teamMembers.length})
                </h3>
                <div className="space-y-3">
                  {company.teamMembers.map((member, index) => (
                    <div key={member._id || index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-300 text-sm font-bold">
                            {member.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.user?.name}</p>
                          <p className="text-gray-300 text-sm">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm capitalize">{member.role}</p>
                        <p className={`text-xs capitalize ${
                          member.status === 'active' ? 'text-green-400' : 
                          member.status === 'pending' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {member.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/20">
              <div>
                <label className="text-sm text-gray-400">Created</label>
                <p className="text-white">{new Date(company.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Last Updated</label>
                <p className="text-white">{new Date(company.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            {company.verificationStatus === 'pending' && (
              <>
                <button
                  onClick={() => handleCompanyAction(company._id, 'verify')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Verify Company
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) handleCompanyAction(company._id, 'reject', reason);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Company Stats */}
      {companyStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Total Companies</p>
                <p className="text-2xl font-bold text-white">{companyStats.totalCompanies}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Verified</p>
                <p className="text-2xl font-bold text-white">{companyStats.verifiedCompanies}</p>
              </div>
              <ShieldCheckIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Pending</p>
                <p className="text-2xl font-bold text-white">{companyStats.pendingCompanies}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Rejected</p>
                <p className="text-2xl font-bold text-white">{companyStats.rejectedCompanies}</p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* All Companies Table with Expandable Rows */}
      <DataCard 
        title={
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              All Companies ({filteredCompanies.length})
            </span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm"
                />
              </div>
              <select
                value={companyStatusFilter}
                onChange={(e) => setCompanyStatusFilter(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        }
        data={filteredCompanies}
        emptyMessage="No companies found"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-4 text-sm font-medium text-gray-200 w-8"></th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Company</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Industry</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Team Size</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Registered</th>
                <th className="text-left p-4 text-sm font-medium text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCompanies.map((company) => (
                <>
                  {/* Main Row */}
                  <tr key={company._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => toggleExpand(company._id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <ChevronRightIcon 
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedCompany === company._id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center mr-3">
                          <BuildingOfficeIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{company.companyName}</p>
                          <p className="text-xs text-gray-400">{company.businessEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      <p>{company.contactPerson?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{company.contactPerson?.phone || 'No phone'}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-300 capitalize">{company.industry}</td>
                    <td className="p-4 text-sm text-gray-300">{company.companySize}</td>
                    <td className="p-4">
                      {getStatusBadge(company.verificationStatus)}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(company)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center"
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <select
                          value={company.verificationStatus}
                          onChange={(e) => handleCompanyAction(company._id, 'updateStatus', e.target.value)}
                          className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedCompany === company._id && (
                    <tr className="bg-white/5">
                      <td colSpan="8" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold text-white mb-3">Quick Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Contact:</span>
                                <span className="text-white">{company.contactPerson?.name || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Position:</span>
                                <span className="text-white">{company.contactPerson?.position || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Website:</span>
                                <span className="text-white">{company.website || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Team Members:</span>
                                <span className="text-white">{company.teamMembers?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => openModal(company)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
                              >
                                <EyeIcon className="w-4 h-4 mr-1" />
                                Full Details
                              </button>
                              {company.verificationStatus === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleCompanyAction(company._id, 'verify')}
                                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                                  >
                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                    Verify
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Enter rejection reason:');
                                      if (reason) handleCompanyAction(company._id, 'reject', reason);
                                    }}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center"
                                  >
                                    <XCircleIcon className="w-4 h-4 mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>

      {/* Company Details Modal */}
      {isModalOpen && (
        <CompanyDetailsModal 
          company={selectedCompany} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};
  // AnalyticsDashboard Component
  const AnalyticsDashboard = () => {
    const [topSharers, setTopSharers] = useState([]);
    const [topCreators, setTopCreators] = useState([]);
    const [gigPerformance, setGigPerformance] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsPeriod, setAnalyticsPeriod] = useState('month');

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const [sharersRes, creatorsRes, performanceRes] = await Promise.all([
          axios.get(`/api/admin/analytics/top-sharers?period=${analyticsPeriod}&limit=10`),
          axios.get(`/api/admin/analytics/top-creators?period=${analyticsPeriod}&limit=10`),
          axios.get(`/api/admin/analytics/gig-performance?period=${analyticsPeriod}&limit=15`)
        ]);

        setTopSharers(sharersRes.data.data);
        setTopCreators(creatorsRes.data.data);
        setGigPerformance(performanceRes.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    useEffect(() => {
      fetchAnalytics();
    }, [analyticsPeriod]);

    const StatCard = ({ title, value, subtitle, color = 'blue' }) => (
      <div className={`p-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm`}>
        <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Platform Analytics</h2>
            <p className="text-gray-200">Performance metrics for sharers and creators</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <select
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value)}
              className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchAnalytics}
              disabled={analyticsLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
            >
              {analyticsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Top Sharer"
            value={topSharers[0]?.userName || 'N/A'}
            subtitle={`${topSharers[0]?.totalShares || 0} shares`}
            color="green"
          />
          <StatCard
            title="Top Creator"
            value={topCreators[0]?.userName || 'N/A'}
            subtitle={`${topCreators[0]?.totalGigs || 0} gigs`}
            color="blue"
          />
          <StatCard
            title="Total Shares"
            value={topSharers.reduce((sum, user) => sum + user.totalShares, 0)}
            subtitle={`${analyticsPeriod} period`}
            color="purple"
          />
          <StatCard
            title="Platform Revenue"
            value={`$${topCreators.reduce((sum, creator) => sum + creator.platformRevenue, 0).toFixed(2)}`}
            subtitle="From creators"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Sharers */}
          <DataCard
            title={
              <span className="flex items-center">
                <ShareIcon className="w-5 h-5 mr-2" />
                Top Sharers
              </span>
            }
            data={topSharers}
            emptyMessage="No sharing data available"
          >
            <div className="divide-y divide-white/10">
              {topSharers.map((user, index) => (
                <div key={user.userId} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-400/20 rounded-lg">
                        <span className="text-green-300 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.userName}</p>
                        <p className="text-xs text-gray-400">{user.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{user.totalShares} shares</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span>${user.totalEarnings.toFixed(2)}</span>
                        <span>•</span>
                        <span>{user.approvedShares} approved</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>{user.uniqueClicks} unique clicks</span>
                    <span>CTR: {user.clickThroughRate.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>

          {/* Top Creators */}
          <DataCard
            title={
              <span className="flex items-center">
                <BriefcaseIcon className="w-5 h-5 mr-2" />
                Top Creators
              </span>
            }
            data={topCreators}
            emptyMessage="No creator data available"
          >
            <div className="divide-y divide-white/10">
              {topCreators.map((creator, index) => (
                <div key={creator.userId} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-400/20 rounded-lg">
                        <span className="text-blue-300 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{creator.userName}</p>
                        <p className="text-xs text-gray-400">{creator.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{creator.totalGigs} gigs</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span>${creator.totalBudget.toFixed(2)} spent</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-400">
                    <div>
                      <span className="block">{creator.activeGigs} active</span>
                      <span className="text-green-300">{creator.completedGigs} completed</span>
                    </div>
                    <div>
                      <span className="block">{creator.totalSharesCompleted} shares</span>
                      <span>{creator.avgCompletionRate.toFixed(1)}% rate</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-yellow-300">
                        ${creator.platformRevenue.toFixed(2)}
                      </span>
                      <span>platform revenue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Gig Performance */}
        <DataCard
          title={
            <span className="flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Gig Performance
            </span>
          }
          data={gigPerformance}
          emptyMessage="No gig performance data available"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Gig Title</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Creator</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Budget</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Progress</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Clicks</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-200">Cost/Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {gigPerformance.map((gig) => (
                  <tr key={gig._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-white text-sm line-clamp-1">{gig.title}</p>
                      <p className="text-xs text-gray-400 capitalize">{gig.contentType}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{gig.creatorName}</td>
                    <td className="p-4 text-sm text-gray-300">${gig.budget}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${gig.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-300 w-8">
                          {gig.completionRate.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {gig.sharesCompleted}/{gig.sharesRequired}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{gig.totalClicks}</td>
                    <td className="p-4 text-sm text-gray-300">
                      ${gig.costPerShare.toFixed(2)}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Admin Dashboard</h1>
          <p className="text-gray-200">Complete platform management and analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'users', name: 'User Management', icon: UserGroupIcon },
              { id: 'companies', name: 'Companies', icon: BuildingOfficeIcon },
              { id: 'withdrawals', name: 'Withdrawals', icon: BanknotesIcon },
              { id: 'moderation', name: 'Gig Moderation', icon: ExclamationTriangleIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Stats Grid with Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                icon={UsersIcon}
                title="Total Users"
                value={stats?.totalUsers || 0}
                color="blue"
              />
              <StatCard
                icon={BriefcaseIcon}
                title="Total Gigs"
                value={stats?.totalGigs || 0}
                color="green"
              />
              <StatCard
                icon={ShareIcon}
                title="Total Shares"
                value={stats?.totalShares || 0}
                color="purple"
              />
              <StatCard
                icon={CurrencyDollarIcon}
                title="Platform Revenue"
                value={`$${platformEarnings.toFixed(2)}`}
                color="orange"
                subtitle="Total commission earned"
              />
            </div>

            {/* Company Stats Row */}
            {companyStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                  icon={BuildingOfficeIcon}
                  title="Total Companies"
                  value={companyStats.totalCompanies || 0}
                  color="blue"
                />
                <StatCard
                  icon={ShieldCheckIcon}
                  title="Verified Companies"
                  value={companyStats.verifiedCompanies || 0}
                  color="green"
                />
                <StatCard
                  icon={ClockIcon}
                  title="Pending Companies"
                  value={companyStats.pendingCompanies || 0}
                  color="yellow"
                />
                <StatCard
                  icon={XCircleIcon}
                  title="Rejected Companies"
                  value={companyStats.rejectedCompanies || 0}
                  color="red"
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Quick User Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pending Withdrawals:</span>
                    <span className="text-yellow-300 font-medium">{pendingWithdrawals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Gigs Awaiting Moderation:</span>
                    <span className="text-red-300 font-medium">{flaggedGigs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pending Company Verifications:</span>
                    <span className="text-orange-300 font-medium">{pendingCompanies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Admin Users:</span>
                    <span className="text-blue-300 font-medium">
                      {users.filter(u => u.role === 'admin').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DataCard 
                    title="Recent Gigs" 
                    data={recentGigs}
                    emptyMessage="No gigs created yet"
                  >
                    <ul className="divide-y divide-white/10">
                      {recentGigs.map((gig) => (
                        <li key={gig._id} className="px-6 py-4 hover:bg-white/10 transition-all duration-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate mb-1">
                                {gig.title}
                              </p>
                              <div className="flex items-center text-xs text-gray-200">
                                <UsersIcon className="w-3 h-3 mr-1" />
                                <span>by {gig.user?.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/30 text-white border border-white/20">
                                ${gig.budget}
                              </span>
                              <div className="flex items-center text-xs text-gray-200">
                                <ShareIcon className="w-3 h-3 mr-1" />
                                <span>{gig.sharesCompleted}/{gig.sharesRequired}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </DataCard>

                  <DataCard 
                    title="Recent Shares" 
                    data={recentShares}
                    emptyMessage="No shares completed yet"
                  >
                    <ul className="divide-y divide-white/10">
                      {recentShares.map((share) => (
                        <li key={share._id} className="px-6 py-4 hover:bg-white/10 transition-all duration-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate mb-1">
                                {share.gig?.title}
                              </p>
                              <div className="flex items-center text-xs text-gray-200">
                                <UsersIcon className="w-3 h-3 mr-1" />
                                <span>by {share.user?.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/30 text-white border border-white/20">
                                ${share.amountEarned?.toFixed(2)}
                              </span>
                              <div className="flex items-center text-xs text-gray-200">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                <span>{new Date(share.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </DataCard>
                </div>
              </div>
            </div>
          </>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <UserManagement />
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <CompanyManagement />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsDashboard />
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <WithdrawalApproval />
          </div>
        )}

        {/* Gig Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <GigModeration />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;