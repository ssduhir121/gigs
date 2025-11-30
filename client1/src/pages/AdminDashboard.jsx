

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { 
//   UsersIcon, 
//   BriefcaseIcon, 
//   ShareIcon, 
//   CurrencyDollarIcon,
//   ArrowTrendingUpIcon,
//   ClockIcon,
//   MagnifyingGlassIcon,
//   EyeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   UserGroupIcon,
//   ChartBarIcon,
//   BanknotesIcon,
//   ExclamationTriangleIcon,
//   BuildingOfficeIcon,
//   ShieldCheckIcon,
//   ChevronRightIcon,
//   LockClosedIcon,
//   DocumentTextIcon,
//   UserPlusIcon,
//   CheckBadgeIcon,
//   ArrowPathIcon,
//   EnvelopeIcon,
//   ChevronLeftIcon,
//   ChartPieIcon,
//   CalendarIcon,
//   ArrowUpIcon,
//   ArrowDownIcon,
//   PlusIcon,
//   StarIcon,
//   HomeIcon,
//   Bars3Icon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';

// // Color system
// const colorVariants = {
//   blue: { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-500/20' },
//   green: { from: 'from-green-500', to: 'to-green-600', bg: 'bg-green-500/20' },
//   purple: { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-500/20' },
//   orange: { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-500/20' },
//   yellow: { from: 'from-yellow-500', to: 'to-yellow-600', bg: 'bg-yellow-500/20' },
//   red: { from: 'from-red-500', to: 'to-red-600', bg: 'bg-red-500/20' }
// };

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [recentGigs, setRecentGigs] = useState([]);
//   const [recentShares, setRecentShares] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
//   const [flaggedGigs, setFlaggedGigs] = useState([]);
//   const [platformEarnings, setPlatformEarnings] = useState(0);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [userRoleFilter, setUserRoleFilter] = useState('all');
//   const [companies, setCompanies] = useState([]);
//   const [pendingCompanies, setPendingCompanies] = useState([]);
//   const [companyStats, setCompanyStats] = useState(null);
//   const [companySearchTerm, setCompanySearchTerm] = useState('');
//   const [companyStatusFilter, setCompanyStatusFilter] = useState('all');
//   const [privateGigStats, setPrivateGigStats] = useState(null);
//   const [recentApplications, setRecentApplications] = useState([]);
//   const [applicationAnalytics, setApplicationAnalytics] = useState(null);
//   const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
//   const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
//   const [serviceGigs, setServiceGigs] = useState([]);
//   const [adminInvitations, setAdminInvitations] = useState([]);
//   const [invitationStats, setInvitationStats] = useState(null);
//   const [analyticsData, setAnalyticsData] = useState({
//     topSharers: [],
//     topCreators: [],
//     gigPerformance: []
//   });
//   const [analyticsPeriod, setAnalyticsPeriod] = useState('month');
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Navigation tabs with icons and counts
//   const navigationTabs = [
//     { 
//       id: 'overview', 
//       name: 'Overview', 
//       icon: HomeIcon,
//       color: 'blue'
//     },
//     { 
//       id: 'users', 
//       name: 'User Management', 
//       icon: UsersIcon,
//       color: 'green',
//       count: users.length
//     },
//     { 
//       id: 'withdrawals', 
//       name: 'Withdrawals', 
//       icon: BanknotesIcon,
//       color: 'orange',
//       count: pendingWithdrawals.length
//     },
//     { 
//       id: 'moderation', 
//       name: 'Content Moderation', 
//       icon: ShieldCheckIcon,
//       color: 'red',
//       count: flaggedGigs.length
//     },
//     { 
//       id: 'companies', 
//       name: 'Companies', 
//       icon: BuildingOfficeIcon,
//       color: 'purple',
//       count: pendingCompanies.length
//     },
//     { 
//       id: 'private-gigs', 
//       name: 'Private Gigs', 
//       icon: LockClosedIcon,
//       color: 'yellow',
//       count: privateGigStats?.pendingApplications || 0
//     },
//     { 
//       id: 'invitations', 
//       name: 'Invitations', 
//       icon: UserPlusIcon,
//       color: 'blue'
//     },
//     { 
//       id: 'analytics', 
//       name: 'Analytics', 
//       icon: ChartBarIcon,
//       color: 'green'
//     }
//   ];

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
//         flaggedGigsRes,
//         companiesRes,
//         pendingCompaniesRes,
//         companyStatsRes,
//         serviceGigsRes,
//         invitationsRes,
//         invitationStatsRes,
//         privateGigStatsRes,
//         recentApplicationsRes,
//         applicationAnalyticsRes
//       ] = await Promise.all([
//         axios.get('/api/admin/stats'),
//         axios.get('/api/admin/gigs'),
//         axios.get('/api/admin/shares'),
//         axios.get('/api/admin/users'),
//         axios.get('/api/admin/pending-withdrawals'),
//         axios.get('/api/admin/platform-earnings'),
//         axios.get('/api/admin/flagged-gigs'),
//         axios.get('/api/admin/companies'),
//         axios.get('/api/admin/companies/pending'),
//         axios.get('/api/admin/companies/stats'),
//         axios.get('/api/service-gigs?limit=50'),
//         axios.get('/api/invitations/sent'),
//         axios.get('/api/invitations/stats'),
//         axios.get('/api/admin/private-gigs/stats'),
//         axios.get('/api/admin/applications/recent'),
//         axios.get('/api/admin/applications/analytics')
//       ]);

//       setStats(statsRes.data.data);
//       setRecentGigs(gigsRes.data.data.slice(0, 5));
//       setRecentShares(sharesRes.data.data.slice(0, 5));
//       setUsers(usersRes.data.data);
//       setPendingWithdrawals(withdrawalsRes.data.data);
//       setPlatformEarnings(earningsRes.data.data.totalEarnings || 0);
//       setFlaggedGigs(flaggedGigsRes.data.data);
//       setCompanies(companiesRes.data.data);
//       setPendingCompanies(pendingCompaniesRes.data.data);
//       setCompanyStats(companyStatsRes.data.data);
//       setServiceGigs(serviceGigsRes.data.data);
//       setAdminInvitations(invitationsRes.data.data);
//       setInvitationStats(invitationStatsRes.data.data);
//       setPrivateGigStats(privateGigStatsRes.data.data);
//       setRecentApplications(recentApplicationsRes.data.data);
//       setApplicationAnalytics(applicationAnalyticsRes.data.data);

//       await fetchAnalyticsData();

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAnalyticsData = async (period = analyticsPeriod) => {
//     setAnalyticsLoading(true);
//     try {
//       const [topSharersRes, topCreatorsRes, gigPerformanceRes] = await Promise.all([
//         axios.get(`/api/admin/analytics/top-sharers?period=${period}`),
//         axios.get(`/api/admin/analytics/top-creators?period=${period}`),
//         axios.get(`/api/admin/analytics/gig-performance?period=${period}`)
//       ]);

//       setAnalyticsData({
//         topSharers: topSharersRes.data.data || [],
//         topCreators: topCreatorsRes.data.data || [],
//         gigPerformance: gigPerformanceRes.data.data || []
//       });
//       setAnalyticsPeriod(period);
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       toast.error('Failed to load analytics data');
//     } finally {
//       setAnalyticsLoading(false);
//     }
//   };

//   // Stat Card Component
//   const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
//     const colorVariant = colorVariants[color];
    
//     return (
//       <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 text-white group">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
//             <p className="text-3xl font-bold text-white">{value}</p>
//             {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
//           </div>
//           <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to} group-hover:scale-110 transition-transform duration-300`}>
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

//   // Data Card Component
//   const DataCard = ({ title, children, emptyMessage, data, className = '' }) => (
//     <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden text-white ${className}`}>
//       <div className="px-6 py-4 border-b border-white/20 bg-white/5">
//         <h3 className="text-lg font-semibold flex items-center">{title}</h3>
//       </div>
//       <div className="divide-y divide-white/10">
//         {data && data.length > 0 ? children : (
//           <div className="px-6 py-8 text-center">
//             <div className="text-gray-300 mb-2 text-2xl">📊</div>
//             <p className="text-gray-300 text-sm">{emptyMessage}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Main Dashboard Overview
//   const DashboardOverview = () => {
//     if (!stats) return null;

//     return (
//       <div className="space-y-6">
//         {/* Welcome Header */}
//         <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-white/20">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-white">Welcome back, Admin!</h1>
//               <p className="text-gray-300 mt-1">Here's what's happening with your platform today.</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-300">Platform Revenue</p>
//               <p className="text-2xl font-bold text-white">${platformEarnings.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Key Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             icon={UsersIcon}
//             title="Total Users"
//             value={stats.totalUsers}
//             subtitle="Active this month"
//             trend="+12%"
//             color="blue"
//           />
//           <StatCard
//             icon={BriefcaseIcon}
//             title="Active Gigs"
//             value={stats.activeGigs}
//             subtitle="Public & Private"
//             trend="+8%"
//             color="green"
//           />
//           <StatCard
//             icon={ShareIcon}
//             title="Total Shares"
//             value={stats.totalShares}
//             subtitle="Completed shares"
//             trend="+15%"
//             color="purple"
//           />
//           <StatCard
//             icon={CurrencyDollarIcon}
//             title="Platform Revenue"
//             value={`$${platformEarnings.toLocaleString()}`}
//             subtitle="All time earnings"
//             trend="+22%"
//             color="orange"
//           />
//         </div>

//         {/* Secondary Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//             <div className="text-2xl font-bold text-white">{stats.pendingWithdrawals || 0}</div>
//             <div className="text-sm text-gray-300">Pending Withdrawals</div>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//             <div className="text-2xl font-bold text-white">{stats.flaggedContent || 0}</div>
//             <div className="text-sm text-gray-300">Flagged Content</div>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//             <div className="text-2xl font-bold text-white">{stats.pendingCompanies || 0}</div>
//             <div className="text-sm text-gray-300">Pending Companies</div>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//             <div className="text-2xl font-bold text-white">{stats.avgResponseTime || '24h'}</div>
//             <div className="text-sm text-gray-300">Avg Response Time</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Recent Gigs */}
//           <DataCard
//             title={
//               <span className="flex items-center">
//                 <BriefcaseIcon className="w-5 h-5 mr-2" />
//                 Recent Gigs
//               </span>
//             }
//             data={recentGigs}
//             emptyMessage="No recent gigs"
//           >
//             <div className="divide-y divide-white/10">
//               {recentGigs.map((gig) => (
//                 <div key={gig._id} className="p-4 hover:bg-white/5 transition-colors group">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">{gig.title}</h4>
//                       <p className="text-xs text-gray-300 line-clamp-2">{gig.description}</p>
//                       <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
//                         <span>By: {gig.user?.name}</span>
//                         <span>${gig.budget}</span>
//                         <span className={`px-2 py-1 rounded-full ${
//                           gig.shareType === 'private' 
//                             ? 'bg-purple-500/20 text-purple-300'
//                             : 'bg-blue-500/20 text-blue-300'
//                         }`}>
//                           {gig.shareType}
//                         </span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => window.open(`/gigs/${gig._id}`, '_blank')}
//                       className="ml-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
//                     >
//                       <EyeIcon className="w-4 h-4 text-gray-300" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </DataCard>

//           {/* Recent Shares */}
//           <DataCard
//             title={
//               <span className="flex items-center">
//                 <ShareIcon className="w-5 h-5 mr-2" />
//                 Recent Shares
//               </span>
//             }
//             data={recentShares}
//             emptyMessage="No recent shares"
//           >
//             <div className="divide-y divide-white/10">
//               {recentShares.map((share) => (
//                 <div key={share._id} className="p-4 hover:bg-white/5 transition-colors">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
//                           {share.sharer?.name?.charAt(0) || 'U'}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-white text-sm">{share.sharer?.name}</p>
//                           <p className="text-xs text-gray-400">Shared {share.gig?.title}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4 text-xs text-gray-400">
//                         <span>Earned: ${share.earnings || 0}</span>
//                         <span>Status: {share.status}</span>
//                         <span>{new Date(share.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </DataCard>
//         </div>
//       </div>
//     );
//   };

//   // User Management Component
//   const UserManagement = () => {
//     const filteredUsers = users.filter(user => {
//       const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
//       return matchesSearch && matchesRole;
//     });

//     const handleRoleChange = async (userId, newRole) => {
//       try {
//         await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
//         toast.success('User role updated successfully');
//         fetchDashboardData();
//       } catch (error) {
//         console.error('Error updating user role:', error);
//         toast.error('Failed to update user role');
//       }
//     };

//     const handleUserStatus = async (userId, isActive) => {
//       try {
//         await axios.put(`/api/admin/users/${userId}/status`, { isActive });
//         toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
//         fetchDashboardData();
//       } catch (error) {
//         console.error('Error updating user status:', error);
//         toast.error('Failed to update user status');
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
//                   className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <select
//                 value={userRoleFilter}
//                 onChange={(e) => setUserRoleFilter(e.target.value)}
//                 className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="user">Users</option>
//                 <option value="admin">Admins</option>
//                 <option value="moderator">Moderators</option>
//                 <option value="company">Companies</option>
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
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Status</th>
//                 <th className="text-left p-4 text-sm font-medium text-gray-200">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-white/5 transition-colors">
//                   <td className="p-4">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
//                         {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                       </div>
//                       <div>
//                         <span className="font-medium text-white block">{user.name || 'Unknown'}</span>
//                         <span className="text-xs text-gray-400">
//                           Joined {new Date(user.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">{user.email}</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                       user.role === 'admin' ? 'bg-red-400/20 text-red-300' :
//                       user.role === 'moderator' ? 'bg-blue-400/20 text-blue-300' :
//                       user.role === 'company' ? 'bg-green-400/20 text-green-300' :
//                       'bg-gray-400/20 text-gray-300'
//                     }`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="p-4 text-sm text-gray-300">
//                     ${parseFloat(user.walletBalance || 0).toFixed(2)}
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       user.isActive 
//                         ? 'bg-green-400/20 text-green-300' 
//                         : 'bg-red-400/20 text-red-300'
//                     }`}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center space-x-2">
//                       <select
//                         value={user.role}
//                         onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                         className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                       >
//                         <option value="user">User</option>
//                         <option value="moderator">Moderator</option>
//                         <option value="company">Company</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                       <button
//                         onClick={() => handleUserStatus(user._id, !user.isActive)}
//                         className={`px-2 py-1 rounded text-xs ${
//                           user.isActive 
//                             ? 'bg-red-500 hover:bg-red-600' 
//                             : 'bg-green-500 hover:bg-green-600'
//                         } text-white transition-colors`}
//                       >
//                         {user.isActive ? 'Deactivate' : 'Activate'}
//                       </button>
//                     </div>
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
//         toast.success(`Withdrawal ${action}d successfully`);
//         fetchDashboardData();
//       } catch (error) {
//         console.error(`Error ${action} withdrawal:`, error);
//         toast.error(`Failed to ${action} withdrawal`);
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
//         toast.success(`Gig ${action}d successfully`);
//         fetchDashboardData();
//       } catch (error) {
//         console.error(`Error ${action} gig:`, error);
//         toast.error(`Failed to ${action} gig`);
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

//   // Company Management Component
//   const CompanyManagement = () => {
//     const [expandedCompany, setExpandedCompany] = useState(null);

//     const filteredCompanies = companies.filter(company => {
//       const matchesSearch = company.companyName?.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
//                          company.businessEmail?.toLowerCase().includes(companySearchTerm.toLowerCase());
//       const matchesStatus = companyStatusFilter === 'all' || company.verificationStatus === companyStatusFilter;
//       return matchesSearch && matchesStatus;
//     });

//     const handleCompanyAction = async (companyId, action, reason = '') => {
//       try {
//         if (action === 'verify') {
//           await axios.post(`/api/admin/companies/${companyId}/verify`);
//         } else if (action === 'reject') {
//           await axios.post(`/api/admin/companies/${companyId}/reject`, { reason });
//         } else if (action === 'updateStatus') {
//           await axios.put(`/api/admin/companies/${companyId}/status`, { status: reason });
//         }
//         toast.success(`Company ${action} successful`);
//         fetchDashboardData();
//         setExpandedCompany(null);
//       } catch (error) {
//         console.error(`Error ${action} company:`, error);
//         toast.error(`Failed to ${action} company`);
//       }
//     };

//     const getStatusBadge = (status) => {
//       const statusConfig = {
//         pending: { color: 'bg-yellow-400/20 text-yellow-300', label: 'Pending' },
//         verified: { color: 'bg-green-400/20 text-green-300', label: 'Verified' },
//         rejected: { color: 'bg-red-400/20 text-red-300', label: 'Rejected' }
//       };
//       const config = statusConfig[status] || statusConfig.pending;
//       return (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
//           {config.label}
//         </span>
//       );
//     };

//     return (
//       <div className="space-y-6">
//         {companyStats && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Total Companies</p>
//                   <p className="text-2xl font-bold text-white">{companyStats.totalCompanies}</p>
//                 </div>
//                 <BuildingOfficeIcon className="w-8 h-8 text-blue-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Verified</p>
//                   <p className="text-2xl font-bold text-white">{companyStats.verifiedCompanies}</p>
//                 </div>
//                 <ShieldCheckIcon className="w-8 h-8 text-green-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Pending</p>
//                   <p className="text-2xl font-bold text-white">{companyStats.pendingCompanies}</p>
//                 </div>
//                 <ClockIcon className="w-8 h-8 text-yellow-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Rejected</p>
//                   <p className="text-2xl font-bold text-white">{companyStats.rejectedCompanies}</p>
//                 </div>
//                 <XCircleIcon className="w-8 h-8 text-red-400" />
//               </div>
//             </div>
//           </div>
//         )}

//         <DataCard 
//           title={
//             <div className="flex items-center justify-between w-full">
//               <span className="flex items-center">
//                 <BuildingOfficeIcon className="w-5 h-5 mr-2" />
//                 All Companies ({filteredCompanies.length})
//               </span>
//               <div className="flex items-center space-x-2">
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                   <input
//                     type="text"
//                     placeholder="Search companies..."
//                     value={companySearchTerm}
//                     onChange={(e) => setCompanySearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <select
//                   value={companyStatusFilter}
//                   onChange={(e) => setCompanyStatusFilter(e.target.value)}
//                   className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="verified">Verified</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           }
//           data={filteredCompanies}
//           emptyMessage="No companies found"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/20">
//                   <th className="text-left p-4 text-sm font-medium text-gray-200 w-8"></th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Company</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Contact</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Industry</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Status</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Registered</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/10">
//                 {filteredCompanies.map((company) => (
//                   <>
//                     <tr key={company._id} className="hover:bg-white/5 transition-colors">
//                       <td className="p-4">
//                         <button
//                           onClick={() => setExpandedCompany(expandedCompany === company._id ? null : company._id)}
//                           className="p-1 hover:bg-white/10 rounded transition-colors"
//                         >
//                           <ChevronRightIcon 
//                             className={`w-4 h-4 text-gray-400 transition-transform ${
//                               expandedCompany === company._id ? 'rotate-90' : ''
//                             }`}
//                           />
//                         </button>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center mr-3">
//                             <BuildingOfficeIcon className="w-5 h-5 text-blue-400" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-white">{company.companyName}</p>
//                             <p className="text-xs text-gray-400">{company.businessEmail}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4 text-sm text-gray-300">
//                         {company.contactPerson?.name || 'N/A'}
//                       </td>
//                       <td className="p-4 text-sm text-gray-300 capitalize">{company.industry}</td>
//                       <td className="p-4">
//                         {getStatusBadge(company.verificationStatus)}
//                       </td>
//                       <td className="p-4 text-sm text-gray-300">
//                         {new Date(company.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center space-x-2">
//                           <select
//                             value={company.verificationStatus}
//                             onChange={(e) => handleCompanyAction(company._id, 'updateStatus', e.target.value)}
//                             className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="verified">Verified</option>
//                             <option value="rejected">Rejected</option>
//                           </select>
//                         </div>
//                       </td>
//                     </tr>

//                     {expandedCompany === company._id && (
//                       <tr className="bg-white/5">
//                         <td colSpan="7" className="p-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//                             <div>
//                               <h4 className="font-semibold text-white mb-3">Quick Details</h4>
//                               <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-400">Contact:</span>
//                                   <span className="text-white">{company.contactPerson?.name || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-400">Website:</span>
//                                   <span className="text-white">{company.website || 'Not provided'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-400">Industry:</span>
//                                   <span className="text-white capitalize">{company.industry}</span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {company.verificationStatus === 'pending' && (
//                                   <>
//                                     <button
//                                       onClick={() => handleCompanyAction(company._id, 'verify')}
//                                       className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
//                                     >
//                                       <CheckCircleIcon className="w-4 h-4 mr-1" />
//                                       Verify
//                                     </button>
//                                     <button
//                                       onClick={() => {
//                                         const reason = prompt('Enter rejection reason:');
//                                         if (reason) handleCompanyAction(company._id, 'reject', reason);
//                                       }}
//                                       className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center"
//                                     >
//                                       <XCircleIcon className="w-4 h-4 mr-1" />
//                                       Reject
//                                     </button>
//                                   </>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </DataCard>
//       </div>
//     );
//   };

//   // Private Gig Applications Component
//   const PrivateGigApplications = () => {
//     const [applications, setApplications] = useState([]);
//     const [applicationsLoading, setApplicationsLoading] = useState(false);

//     const fetchApplications = async () => {
//       setApplicationsLoading(true);
//       try {
//         const res = await axios.get('/api/admin/applications', {
//           params: {
//             search: applicationSearchTerm,
//             status: applicationStatusFilter === 'all' ? undefined : applicationStatusFilter
//           }
//         });
//         setApplications(res.data.data);
//       } catch (error) {
//         console.error('Error fetching applications:', error);
//         toast.error('Failed to load applications');
//       } finally {
//         setApplicationsLoading(false);
//       }
//     };

//     useEffect(() => {
//       fetchApplications();
//     }, [applicationSearchTerm, applicationStatusFilter]);

//     const handleApplicationAction = async (applicationId, action, notes = '') => {
//       try {
//         const endpoint = `/api/admin/applications/${applicationId}/${action}`;
//         await axios.post(endpoint, action === 'reject' ? { reason: notes } : { notes });
        
//         toast.success(`Application ${action}d successfully`);
//         fetchApplications();
//         fetchDashboardData();
//       } catch (error) {
//         toast.error(error.response?.data?.message || `Failed to ${action} application`);
//       }
//     };

//     const ApplicationCard = ({ application }) => {
//       const [showActions, setShowActions] = useState(false);
//       const [actionLoading, setActionLoading] = useState(false);
//       const [rejectNotes, setRejectNotes] = useState('');

//       const handleApprove = async () => {
//         setActionLoading(true);
//         try {
//           await handleApplicationAction(application._id, 'approve', 'Application approved by admin');
//           setShowActions(false);
//         } finally {
//           setActionLoading(false);
//         }
//       };

//       const handleReject = async () => {
//         if (!rejectNotes.trim()) {
//           toast.error('Please provide a reason for rejection');
//           return;
//         }

//         setActionLoading(true);
//         try {
//           await handleApplicationAction(application._id, 'reject', rejectNotes);
//           setShowActions(false);
//           setRejectNotes('');
//         } finally {
//           setActionLoading(false);
//         }
//       };

//       const getStatusBadge = (status) => {
//         const statusConfig = {
//           pending: { color: 'bg-yellow-400/20 text-yellow-300', icon: ClockIcon },
//           approved: { color: 'bg-green-400/20 text-green-300', icon: CheckCircleIcon },
//           rejected: { color: 'bg-red-400/20 text-red-300', icon: XCircleIcon }
//         };
//         const config = statusConfig[status] || statusConfig.pending;
//         const IconComponent = config.icon;
        
//         return (
//           <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${config.color}`}>
//             <IconComponent className="w-3 h-3 mr-1" />
//             {status}
//           </span>
//         );
//       };

//       return (
//         <div className="p-6 hover:bg-white/5 transition-all duration-300 border-b border-white/10 last:border-b-0">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <h4 className="font-semibold text-white text-lg">{application.gig?.title}</h4>
//                 <LockClosedIcon className="w-4 h-4 text-purple-400" />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                 <div>
//                   <p className="text-sm text-gray-300 mb-1">
//                     <strong>Applicant:</strong> {application.user?.name} ({application.user?.email})
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     <strong>Gig Owner:</strong> {application.gig?.user?.name}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-300 mb-1">
//                     <strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     <strong>Budget:</strong> ${application.gig?.budget}
//                   </p>
//                 </div>
//               </div>

//               {application.message && (
//                 <div className="bg-white/10 rounded-lg p-3 mb-3">
//                   <p className="text-sm text-gray-200">
//                     <strong>Application Message:</strong> {application.message}
//                   </p>
//                 </div>
//               )}

//               <div className="flex items-center space-x-4 text-sm text-gray-400">
//                 <span>Gig Type: {application.gig?.shareType}</span>
//                 <span>•</span>
//                 <span>Shares Required: {application.gig?.sharesRequired}</span>
//                 <span>•</span>
//                 <span>Per Share: ${(application.gig?.budget / application.gig?.sharesRequired).toFixed(2)}</span>
//               </div>
//             </div>
            
//             <div className="flex flex-col items-end space-y-2 ml-4">
//               {getStatusBadge(application.status)}
//               {application.reviewedAt && (
//                 <p className="text-xs text-gray-400">
//                   Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>

//           {!showActions ? (
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowActions(true)}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center"
//               >
//                 <EyeIcon className="w-4 h-4 mr-2" />
//                 Review
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3 bg-white/5 rounded-lg p-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-200 mb-2">
//                   Rejection Reason (if rejecting)
//                 </label>
//                 <textarea
//                   value={rejectNotes}
//                   onChange={(e) => setRejectNotes(e.target.value)}
//                   placeholder="Provide feedback for the applicant..."
//                   rows="2"
//                   className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => {
//                     setShowActions(false);
//                     setRejectNotes('');
//                   }}
//                   disabled={actionLoading}
//                   className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleReject}
//                   disabled={actionLoading}
//                   className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 flex items-center"
//                 >
//                   <XCircleIcon className="w-4 h-4 mr-2" />
//                   Reject
//                 </button>
//                 <button
//                   onClick={handleApprove}
//                   disabled={actionLoading}
//                   className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 flex items-center"
//                 >
//                   <CheckCircleIcon className="w-4 h-4 mr-2" />
//                   Approve
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     };

//     return (
//       <div className="space-y-6">
//         {privateGigStats && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Total Private Gigs</p>
//                   <p className="text-2xl font-bold text-white">{privateGigStats.totalPrivateGigs}</p>
//                 </div>
//                 <LockClosedIcon className="w-8 h-8 text-purple-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Total Applications</p>
//                   <p className="text-2xl font-bold text-white">{privateGigStats.totalApplications}</p>
//                 </div>
//                 <DocumentTextIcon className="w-8 h-8 text-blue-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Approval Rate</p>
//                   <p className="text-2xl font-bold text-white">
//                     {privateGigStats.approvalRate ? `${privateGigStats.approvalRate}%` : 'N/A'}
//                   </p>
//                 </div>
//                 <CheckBadgeIcon className="w-8 h-8 text-green-400" />
//               </div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-200">Pending Reviews</p>
//                   <p className="text-2xl font-bold text-white">{privateGigStats.pendingApplications}</p>
//                 </div>
//                 <ClockIcon className="w-8 h-8 text-yellow-400" />
//               </div>
//             </div>
//           </div>
//         )}

//         <DataCard 
//           title={
//             <div className="flex items-center justify-between w-full">
//               <span className="flex items-center">
//                 <DocumentTextIcon className="w-5 h-5 mr-2" />
//                 Private Gig Applications ({applications.length})
//               </span>
//               <div className="flex items-center space-x-2">
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                   <input
//                     type="text"
//                     placeholder="Search applications..."
//                     value={applicationSearchTerm}
//                     onChange={(e) => setApplicationSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <select
//                   value={applicationStatusFilter}
//                   onChange={(e) => setApplicationStatusFilter(e.target.value)}
//                   className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//                 <button
//                   onClick={fetchApplications}
//                   disabled={applicationsLoading}
//                   className="px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
//                 >
//                   <ArrowPathIcon className={`w-4 h-4 ${applicationsLoading ? 'animate-spin' : ''}`} />
//                 </button>
//               </div>
//             </div>
//           }
//           data={applications}
//           emptyMessage="No applications found"
//         >
//           <div className="divide-y divide-white/10">
//             {applications.map((application) => (
//               <ApplicationCard key={application._id} application={application} />
//             ))}
//           </div>
//         </DataCard>

//         {applicationAnalytics && (
//           <DataCard 
//             title={
//               <span className="flex items-center">
//                 <ChartBarIcon className="w-5 h-5 mr-2" />
//                 Application Analytics
//               </span>
//             }
//             data={[applicationAnalytics]}
//             emptyMessage="No analytics data available"
//           >
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
//                   <div className="text-2xl font-bold text-blue-300">{applicationAnalytics.totalApplications}</div>
//                   <div className="text-sm text-gray-300">Total Applications</div>
//                 </div>
//                 <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
//                   <div className="text-2xl font-bold text-green-300">{applicationAnalytics.approvedApplications}</div>
//                   <div className="text-sm text-gray-300">Approved</div>
//                 </div>
//                 <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
//                   <div className="text-2xl font-bold text-yellow-300">{applicationAnalytics.pendingApplications}</div>
//                   <div className="text-sm text-gray-300">Pending</div>
//                 </div>
//                 <div className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
//                   <div className="text-2xl font-bold text-red-300">{applicationAnalytics.rejectedApplications}</div>
//                   <div className="text-sm text-gray-300">Rejected</div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-semibold text-white mb-4">Application Trends</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <div className="flex justify-between text-sm text-gray-300 mb-1">
//                       <span>Approval Rate</span>
//                       <span>{applicationAnalytics.approvalRate}%</span>
//                     </div>
//                     <div className="w-full bg-white/20 rounded-full h-2">
//                       <div 
//                         className="bg-green-400 h-2 rounded-full transition-all duration-1000" 
//                         style={{ width: `${applicationAnalytics.approvalRate}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm text-gray-300 mb-1">
//                       <span>Average Response Time</span>
//                       <span>{applicationAnalytics.avgResponseTime || 'N/A'}</span>
//                     </div>
//                     <div className="w-full bg-white/20 rounded-full h-2">
//                       <div 
//                         className="bg-blue-400 h-2 rounded-full transition-all duration-1000" 
//                         style={{ width: '60%' }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </DataCard>
//         )}
//       </div>
//     );
//   };

//   // Admin Service Gig Invitation Flow Component
//   const AdminServiceGigInvitationFlow = () => {
//     const [selectedServiceGig, setSelectedServiceGig] = useState(null);
//     const [allGigs, setAllGigs] = useState([]);
//     const [inviteLoading, setInviteLoading] = useState(false);
//     const [step, setStep] = useState('browse');

//     const [inviteData, setInviteData] = useState({
//       targetGigId: '',
//       message: '',
//       compensation: '',
//       customOffer: ''
//     });

//     useEffect(() => {
//       fetchAllGigs();
//     }, []);

//     const fetchAllGigs = async () => {
//       try {
//         const res = await axios.get('/api/admin/gigs');
//         setAllGigs(res.data.data.filter(gig => gig.isActive));
//       } catch (error) {
//         console.error('Error fetching all gigs:', error);
//       }
//     };

//     const startInvitationFlow = (serviceGig) => {
//       setSelectedServiceGig(serviceGig);
//       setStep('select-gig');
//     };

//     const handleGigSelection = (gigId) => {
//       setInviteData(prev => ({ ...prev, targetGigId: gigId }));
//       setStep('send-invite');
//     };

//     const handleSendInvitation = async (e) => {
//       e.preventDefault();
//       if (!inviteData.targetGigId || !inviteData.message) {
//         toast.error('Please select a gig and add a message');
//         return;
//       }

//       setInviteLoading(true);
//       try {
//         await axios.post('/api/invitations', {
//           serviceGigId: selectedServiceGig._id,
//           targetGigId: inviteData.targetGigId,
//           message: inviteData.message,
//           compensation: inviteData.compensation,
//           customOffer: inviteData.customOffer
//         });

//         toast.success(`Invitation sent to ${selectedServiceGig.user?.name}!`);
        
//         setStep('browse');
//         setSelectedServiceGig(null);
//         setInviteData({
//           targetGigId: '',
//           message: '',
//           compensation: '',
//           customOffer: ''
//         });
        
//         fetchDashboardData();
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to send invitation');
//       } finally {
//         setInviteLoading(false);
//       }
//     };

//     const cancelInvitationFlow = () => {
//       setStep('browse');
//       setSelectedServiceGig(null);
//       setInviteData({
//         targetGigId: '',
//         message: '',
//         compensation: '',
//         customOffer: ''
//       });
//     };

//     const BrowseServiceGigs = () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {serviceGigs.map((gig) => (
//           <div key={gig._id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 group">
//             <div className="flex items-start space-x-3 mb-3">
//               {gig.image?.url && (
//                 <img 
//                   src={gig.image.url} 
//                   alt={gig.title}
//                   className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               )}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">{gig.title}</h4>
//                 <p className="text-blue-300 font-bold">${gig.price}</p>
//               </div>
//             </div>
//             <p className="text-gray-300 text-xs mb-3 line-clamp-2">
//               {gig.description}
//             </p>
//             <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
//               <span className="flex items-center">
//                 <UserGroupIcon className="w-3 h-3 mr-1" />
//                 {gig.user?.name}
//               </span>
//               <span className="capitalize">{gig.category?.replace('-', ' ')}</span>
//             </div>
//             <button
//               onClick={() => startInvitationFlow(gig)}
//               className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center group-hover:scale-105"
//             >
//               <UserPlusIcon className="w-4 h-4 mr-2" />
//               Invite to Share
//             </button>
//           </div>
//         ))}
//       </div>
//     );

//     const SelectTargetGig = () => (
//       <div className="bg-white/5 rounded-lg p-6 border border-white/10">
//         <div className="flex items-center mb-4">
//           <button
//             onClick={cancelInvitationFlow}
//             className="p-2 mr-3 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
//           </button>
//           <div>
//             <h3 className="text-lg font-semibold text-white">Select Gig to Share</h3>
//             <p className="text-gray-300 text-sm">
//               Choose which gig you want {selectedServiceGig?.user?.name} to share
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {allGigs.map((gig) => (
//             <div
//               key={gig._id}
//               onClick={() => handleGigSelection(gig._id)}
//               className="p-4 border border-white/20 rounded-lg hover:border-blue-400 hover:bg-white/5 cursor-pointer transition-all duration-200 group"
//             >
//               <div className="flex items-start justify-between mb-2">
//                 <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">{gig.title}</h4>
//                 {gig.shareType === 'private' && (
//                   <LockClosedIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
//                 )}
//               </div>
//               <p className="text-gray-300 text-xs mb-2 line-clamp-2">
//                 {gig.description}
//               </p>
//               <div className="flex items-center justify-between text-xs">
//                 <span className="text-blue-300 font-bold">${gig.budget}</span>
//                 <span className={`px-2 py-1 rounded-full ${
//                   gig.shareType === 'private' 
//                     ? 'bg-purple-500/20 text-purple-300'
//                     : 'bg-blue-500/20 text-blue-300'
//                 }`}>
//                   {gig.shareType}
//                 </span>
//                 <span className="text-gray-400 text-xs">by {gig.user?.name}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {allGigs.length === 0 && (
//           <div className="text-center py-8">
//             <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-300">No active gigs found</p>
//           </div>
//         )}
//       </div>
//     );

//     const SendInvitation = () => {
//       const selectedGig = allGigs.find(g => g._id === inviteData.targetGigId);

//       return (
//         <div className="bg-white/5 rounded-lg p-6 border border-white/10">
//           <div className="flex items-center mb-6">
//             <button
//               onClick={() => setStep('select-gig')}
//               className="p-2 mr-3 hover:bg-white/10 rounded-lg transition-colors"
//             >
//               <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
//             </button>
//             <div>
//               <h3 className="text-lg font-semibold text-white">Send Invitation as Admin</h3>
//               <p className="text-gray-300 text-sm">
//                 Invite {selectedServiceGig?.user?.name} to share a gig
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white/5 rounded-lg p-4">
//               <h4 className="font-semibold text-white text-sm mb-2">Service Provider</h4>
//               <div className="flex items-center space-x-3 mb-3">
//                 {selectedServiceGig?.image?.url && (
//                   <img 
//                     src={selectedServiceGig.image.url} 
//                     alt={selectedServiceGig.title}
//                     className="w-10 h-10 rounded object-cover"
//                   />
//                 )}
//                 <div>
//                   <p className="text-white font-medium text-sm">{selectedServiceGig?.title}</p>
//                   <p className="text-gray-300 text-xs">by {selectedServiceGig?.user?.name}</p>
//                 </div>
//               </div>
//               <p className="text-blue-300 font-bold">${selectedServiceGig?.price}</p>
//             </div>

//             <div className="bg-white/5 rounded-lg p-4">
//               <h4 className="font-semibold text-white text-sm mb-2">Gig to Share</h4>
//               <div className="mb-3">
//                 <p className="text-white font-medium text-sm">{selectedGig?.title}</p>
//                 <p className="text-gray-300 text-xs line-clamp-2">{selectedGig?.description}</p>
//                 <p className="text-gray-400 text-xs">by {selectedGig?.user?.name}</p>
//               </div>
//               <div className="flex items-center justify-between text-xs">
//                 <span className="text-blue-300 font-bold">${selectedGig?.budget}</span>
//                 <span className={`px-2 py-1 rounded-full ${
//                   selectedGig?.shareType === 'private' 
//                     ? 'bg-purple-500/20 text-purple-300'
//                     : 'bg-blue-500/20 text-blue-300'
//                 }`}>
//                   {selectedGig?.shareType}
//                 </span>
//               </div>
//             </div>

//             <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
//               <h4 className="font-semibold text-white text-sm mb-2">Admin Invitation Flow</h4>
//               <div className="space-y-2 text-xs">
//                 <div className="flex items-center text-green-300">
//                   <CheckCircleIcon className="w-4 h-4 mr-2" />
//                   <span>Service gig selected</span>
//                 </div>
//                 <div className="flex items-center text-green-300">
//                   <CheckCircleIcon className="w-4 h-4 mr-2" />
//                   <span>Target gig selected</span>
//                 </div>
//                 <div className="flex items-center text-yellow-300">
//                   <ClockIcon className="w-4 h-4 mr-2" />
//                   <span>Send invitation</span>
//                 </div>
//                 <div className="flex items-center text-gray-400">
//                   <UserPlusIcon className="w-4 h-4 mr-2" />
//                   <span>Wait for acceptance</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSendInvitation} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">
//                 Invitation Message *
//               </label>
//               <textarea
//                 value={inviteData.message}
//                 onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
//                 placeholder={`Hi ${selectedServiceGig?.user?.name}, I'd like to invite you to share the gig "${selectedGig?.title}". Please let me know if you're interested!`}
//                 rows="4"
//                 className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-200 mb-2">
//                   Compensation Offer ($)
//                 </label>
//                 <input
//                   type="number"
//                   value={inviteData.compensation}
//                   onChange={(e) => setInviteData({...inviteData, compensation: e.target.value})}
//                   placeholder="Optional bonus amount"
//                   className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-200 mb-2">
//                   Custom Terms
//                 </label>
//                 <input
//                   type="text"
//                   value={inviteData.customOffer}
//                   onChange={(e) => setInviteData({...inviteData, customOffer: e.target.value})}
//                   placeholder="Special collaboration terms"
//                   className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={cancelInvitationFlow}
//                 className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={inviteLoading}
//                 className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 flex items-center"
//               >
//                 {inviteLoading ? (
//                   <>
//                     <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <EnvelopeIcon className="w-4 h-4 mr-2" />
//                     Send Invitation
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       );
//     };

//     return (
//       <div className="space-y-6">
//         {invitationStats && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//               <div className="text-2xl font-bold text-white">{invitationStats.total}</div>
//               <div className="text-sm text-gray-300">Total Sent</div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//               <div className="text-2xl font-bold text-yellow-400">{invitationStats.pending}</div>
//               <div className="text-sm text-gray-300">Pending</div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//               <div className="text-2xl font-bold text-green-400">{invitationStats.accepted}</div>
//               <div className="text-sm text-gray-300">Accepted</div>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
//               <div className="text-2xl font-bold text-red-400">{invitationStats.rejected}</div>
//               <div className="text-sm text-gray-300">Rejected</div>
//             </div>
//           </div>
//         )}

//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white flex items-center">
//               <UserPlusIcon className="w-6 h-6 mr-2" />
//               Admin Service Gig Invitations
//             </h2>
//             <p className="text-gray-300 mt-1">
//               Invite service gig owners to share specific gigs across the platform
//             </p>
//           </div>
//           <button
//             onClick={fetchDashboardData}
//             className="px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
//           >
//             <ArrowPathIcon className="w-4 h-4" />
//           </button>
//         </div>

//         {step !== 'browse' && (
//           <div className="flex items-center justify-center space-x-8">
//             {['browse', 'select-gig', 'send-invite'].map((stepName, index) => (
//               <div key={stepName} className="flex items-center">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
//                   (step === 'browse' && index === 0) ||
//                   (step === 'select-gig' && index <= 1) ||
//                   (step === 'send-invite' && index <= 2)
//                     ? 'bg-blue-600 text-white scale-110' 
//                     : 'bg-white/10 text-gray-400'
//                 }`}>
//                   {index + 1}
//                 </div>
//                 <div className={`ml-2 text-sm transition-colors duration-300 ${
//                   (step === 'browse' && index === 0) ||
//                   (step === 'select-gig' && index <= 1) ||
//                   (step === 'send-invite' && index <= 2)
//                     ? 'text-white' 
//                     : 'text-gray-400'
//                 }`}>
//                   {stepName === 'browse' && 'Browse Services'}
//                   {stepName === 'select-gig' && 'Select Gig'}
//                   {stepName === 'send-invite' && 'Send Invite'}
//                 </div>
//                 {index < 2 && (
//                   <div className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
//                     (step === 'select-gig' && index === 0) ||
//                     (step === 'send-invite' && index <= 1)
//                       ? 'bg-blue-600' 
//                       : 'bg-white/10'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {step === 'browse' ? (
//           <BrowseServiceGigs />
//         ) : step === 'select-gig' ? (
//           <SelectTargetGig />
//         ) : (
//           <SendInvitation />
//         )}

//         <DataCard 
//           title={
//             <span className="flex items-center">
//               <EnvelopeIcon className="w-5 h-5 mr-2" />
//               Admin Sent Invitations ({adminInvitations.length})
//             </span>
//           }
//           data={adminInvitations}
//           emptyMessage="No invitations sent yet"
//         >
//           <div className="divide-y divide-white/10">
//             {adminInvitations.map((invitation) => (
//               <div key={invitation._id} className="p-4 hover:bg-white/5 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     {invitation.serviceGig?.image?.url && (
//                       <img 
//                         src={invitation.serviceGig.image.url} 
//                         alt={invitation.serviceGig.title}
//                         className="w-10 h-10 rounded object-cover"
//                       />
//                     )}
//                     <div>
//                       <p className="text-white font-medium">
//                         {invitation.serviceGig?.title}
//                       </p>
//                       <p className="text-gray-300 text-sm">
//                         To: {invitation.recipient?.name} • Gig: {invitation.targetGig?.title}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       invitation.status === 'pending' ? 'bg-yellow-400/20 text-yellow-300' :
//                       invitation.status === 'accepted' ? 'bg-green-400/20 text-green-300' :
//                       invitation.status === 'rejected' ? 'bg-red-400/20 text-red-300' :
//                       'bg-gray-400/20 text-gray-300'
//                     }`}>
//                       {invitation.status}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       {new Date(invitation.sentAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//                 {invitation.message && (
//                   <p className="text-gray-300 text-sm mt-2">{invitation.message}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </DataCard>
//       </div>
//     );
//   };

//   // Analytics Dashboard Component
//   const AnalyticsDashboard = () => {
//     const AnalyticsMetricCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'blue' }) => {
//       const isPositive = change >= 0;
//       const colorVariant = colorVariants[color];
      
//       return (
//         <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <p className="text-sm font-medium text-gray-200">{title}</p>
//               <p className="text-3xl font-bold text-white mt-1">{value}</p>
//             </div>
//             <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to} hover:scale-110 transition-transform duration-300`}>
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//           </div>
//           <div className="flex items-center">
//             {isPositive ? (
//               <ArrowUpIcon className="w-4 h-4 text-green-400 mr-1" />
//             ) : (
//               <ArrowDownIcon className="w-4 h-4 text-red-400 mr-1" />
//             )}
//             <span className={`text-sm font-medium ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
//               {isPositive ? '+' : ''}{change}%
//             </span>
//             <span className="text-xs text-gray-400 ml-2">vs previous period</span>
//           </div>
//         </div>
//       );
//     };

//     if (analyticsLoading) {
//       return (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
//             <p className="text-white">Loading analytics data...</p>
//           </div>
//         </div>
//       );
//     }

//     const totalShares = analyticsData.topSharers.reduce((sum, sharer) => sum + sharer.totalShares, 0);
//     const totalEarnings = analyticsData.topSharers.reduce((sum, sharer) => sum + sharer.totalEarnings, 0);
//     const totalGigs = analyticsData.topCreators.reduce((sum, creator) => sum + creator.totalGigs, 0);
//     const totalBudget = analyticsData.topCreators.reduce((sum, creator) => sum + creator.totalBudget, 0);

//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
//             <p className="text-gray-300">Comprehensive insights into platform performance</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <select
//               value={analyticsPeriod}
//               onChange={(e) => fetchAnalyticsData(e.target.value)}
//               disabled={analyticsLoading}
//               className="px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="week">Last 7 Days</option>
//               <option value="month">Last 30 Days</option>
//               <option value="all">All Time</option>
//             </select>
//             <button
//               onClick={() => fetchAnalyticsData()}
//               disabled={analyticsLoading}
//               className="px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
//             >
//               <ArrowPathIcon className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <AnalyticsMetricCard
//             icon={UsersIcon}
//             title="Top Sharers"
//             value={analyticsData.topSharers.length}
//             change={8}
//             trend="up"
//             color="blue"
//           />
//           <AnalyticsMetricCard
//             icon={BriefcaseIcon}
//             title="Active Creators"
//             value={analyticsData.topCreators.length}
//             change={12}
//             trend="up"
//             color="green"
//           />
//           <AnalyticsMetricCard
//             icon={ShareIcon}
//             title="Total Shares"
//             value={totalShares}
//             change={15}
//             trend="up"
//             color="purple"
//           />
//           <AnalyticsMetricCard
//             icon={CurrencyDollarIcon}
//             title="Total Earnings"
//             value={`$${totalEarnings.toFixed(0)}`}
//             change={22}
//             trend="up"
//             color="orange"
//           />
//         </div>

//         <DataCard
//           title={
//             <span className="flex items-center">
//               <StarIcon className="w-5 h-5 mr-2" />
//               Top Sharers ({analyticsData.topSharers.length})
//             </span>
//           }
//           data={analyticsData.topSharers}
//           emptyMessage="No sharers data available"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/20">
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">User</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Total Shares</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Approved</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Earnings</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Click Rate</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Last Share</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/10">
//                 {analyticsData.topSharers.map((sharer, index) => (
//                   <tr key={sharer.userId} className="hover:bg-white/5 transition-colors">
//                     <td className="p-4">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
//                           {sharer.userName?.charAt(0)?.toUpperCase() || 'U'}
//                         </div>
//                         <div>
//                           <span className="font-medium text-white block">{sharer.userName || 'Unknown'}</span>
//                           <span className="text-xs text-gray-400">{sharer.userEmail}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4 text-sm text-white font-medium">{sharer.totalShares}</td>
//                     <td className="p-4 text-sm text-green-300">{sharer.approvedShares}</td>
//                     <td className="p-4 text-sm text-green-300">${sharer.totalEarnings?.toFixed(2) || '0.00'}</td>
//                     <td className="p-4 text-sm text-blue-300">{sharer.clickThroughRate?.toFixed(1) || '0'}%</td>
//                     <td className="p-4 text-sm text-gray-300">
//                       {sharer.lastShareDate ? new Date(sharer.lastShareDate).toLocaleDateString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </DataCard>

//         <DataCard
//           title={
//             <span className="flex items-center">
//               <BriefcaseIcon className="w-5 h-5 mr-2" />
//               Top Gig Creators ({analyticsData.topCreators.length})
//             </span>
//           }
//           data={analyticsData.topCreators}
//           emptyMessage="No creators data available"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/20">
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Creator</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Total Gigs</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Active</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Total Budget</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Platform Revenue</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Completion Rate</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/10">
//                 {analyticsData.topCreators.map((creator, index) => (
//                   <tr key={creator.userId} className="hover:bg-white/5 transition-colors">
//                     <td className="p-4">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
//                           {creator.userName?.charAt(0)?.toUpperCase() || 'U'}
//                         </div>
//                         <div>
//                           <span className="font-medium text-white block">{creator.userName || 'Unknown'}</span>
//                           <span className="text-xs text-gray-400">{creator.userEmail}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4 text-sm text-white font-medium">{creator.totalGigs}</td>
//                     <td className="p-4 text-sm text-green-300">{creator.activeGigs}</td>
//                     <td className="p-4 text-sm text-purple-300">${creator.totalBudget?.toFixed(2) || '0.00'}</td>
//                     <td className="p-4 text-sm text-orange-300">${creator.platformRevenue?.toFixed(2) || '0.00'}</td>
//                     <td className="p-4 text-sm text-blue-300">{creator.avgCompletionRate?.toFixed(1) || '0'}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </DataCard>

//         <DataCard
//           title={
//             <span className="flex items-center">
//               <ChartBarIcon className="w-5 h-5 mr-2" />
//               Gig Performance ({analyticsData.gigPerformance.length})
//             </span>
//           }
//           data={analyticsData.gigPerformance}
//           emptyMessage="No gig performance data available"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/20">
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Gig Title</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Creator</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Budget</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Shares</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Completion</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Cost/Share</th>
//                   <th className="text-left p-4 text-sm font-medium text-gray-200">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/10">
//                 {analyticsData.gigPerformance.map((gig) => (
//                   <tr key={gig._id} className="hover:bg-white/5 transition-colors">
//                     <td className="p-4">
//                       <div className="max-w-xs">
//                         <span className="font-medium text-white text-sm block truncate">{gig.title}</span>
//                         <span className="text-xs text-gray-400 capitalize">{gig.contentType}</span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-sm text-gray-300">{gig.creatorName}</td>
//                     <td className="p-4 text-sm text-purple-300">${gig.budget}</td>
//                     <td className="p-4 text-sm text-white">
//                       {gig.sharesCompleted}/{gig.sharesRequired}
//                     </td>
//                     <td className="p-4 text-sm text-blue-300">{gig.completionRate?.toFixed(1) || '0'}%</td>
//                     <td className="p-4 text-sm text-green-300">${gig.costPerShare?.toFixed(2) || '0.00'}</td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         gig.isActive 
//                           ? 'bg-green-400/20 text-green-300' 
//                           : 'bg-gray-400/20 text-gray-300'
//                       }`}>
//                         {gig.isActive ? 'Active' : 'Completed'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </DataCard>
//       </div>
//     );
//   };

//   // Sidebar Navigation Component
//   const Sidebar = () => (
//     <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
//       sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//     }`}>
//       <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
//         <div className="flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
//             <ShieldCheckIcon className="w-5 h-5 text-white" />
//           </div>
//           <span className="text-white font-bold text-lg">Admin Panel</span>
//         </div>
//         <button
//           onClick={() => setSidebarOpen(false)}
//           className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
//         >
//           <XMarkIcon className="w-5 h-5 text-gray-400" />
//         </button>
//       </div>

//       <nav className="mt-8 px-4 space-y-2">
//         {navigationTabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
//           const colorVariant = colorVariants[tab.color];
          
//           return (
//             <button
//               key={tab.id}
//               onClick={() => {
//                 setActiveTab(tab.id);
//                 setSidebarOpen(false);
//               }}
//               className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
//                 isActive
//                   ? `bg-gradient-to-r ${colorVariant.from} ${colorVariant.to} text-white shadow-lg`
//                   : 'text-gray-300 hover:bg-white/10 hover:text-white'
//               }`}
//             >
//               <Icon className={`w-5 h-5 mr-3 transition-colors ${
//                 isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
//               }`} />
//               <span className="flex-1 font-medium">{tab.name}</span>
//               {tab.count > 0 && (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-6 flex items-center justify-center ${
//                   isActive
//                     ? 'bg-white/20 text-white'
//                     : 'bg-red-500/20 text-red-300'
//                 }`}>
//                   {tab.count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </nav>

//       <div className="absolute bottom-4 left-4 right-4">
//         <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//           <p className="text-sm text-gray-300">Platform Revenue</p>
//           <p className="text-xl font-bold text-white">${platformEarnings.toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Main content area
//   const MainContent = () => (
//     <div className="flex-1 lg:ml-0">
//       <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
//         <div className="flex items-center">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden p-2 mr-4 rounded-lg hover:bg-white/10 transition-colors"
//           >
//             <Bars3Icon className="w-6 h-6 text-gray-400" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-white">
//               {navigationTabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {activeTab === 'overview' && 'Platform overview and recent activity'}
//               {activeTab === 'users' && 'Manage user accounts and permissions'}
//               {activeTab === 'withdrawals' && 'Approve or reject withdrawal requests'}
//               {activeTab === 'moderation' && 'Review and moderate gig content'}
//               {activeTab === 'companies' && 'Verify and manage business accounts'}
//               {activeTab === 'private-gigs' && 'Manage private gig applications'}
//               {activeTab === 'invitations' && 'Send and track gig invitations'}
//               {activeTab === 'analytics' && 'Platform performance insights'}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={fetchDashboardData}
//             className="flex items-center px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
//           >
//             <ArrowPathIcon className="w-4 h-4 mr-2" />
//             Refresh
//           </button>
//           <div className="hidden md:block text-right">
//             <p className="text-sm text-gray-300">Total Users</p>
//             <p className="text-lg font-bold text-white">{stats?.totalUsers || 0}</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         {activeTab === 'overview' && <DashboardOverview />}
//         {activeTab === 'users' && <UserManagement />}
//         {activeTab === 'withdrawals' && <WithdrawalApproval />}
//         {activeTab === 'moderation' && <GigModeration />}
//         {activeTab === 'companies' && <CompanyManagement />}
//         {activeTab === 'private-gigs' && <PrivateGigApplications />}
//         {activeTab === 'invitations' && <AdminServiceGigInvitationFlow />}
//         {activeTab === 'analytics' && <AnalyticsDashboard />}
//       </div>
//     </div>
//   );

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-xl font-bold text-white mb-2">Loading Admin Dashboard</h2>
//           <p className="text-gray-400">Preparing your admin interface...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex">
//       {/* Sidebar */}
//       <Sidebar />
      
//       {/* Main Content */}
//       <MainContent />

//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



// pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  BriefcaseIcon,
  ShareIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  LockClosedIcon,
  DocumentTextIcon,
  UserPlusIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChartPieIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  StarIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  EnvelopeOpenIcon
} from '@heroicons/react/24/outline';

// Chart Components
const BarChart = ({ data, labels, color = 'blue' }) => {
  const maxValue = Math.max(...data, 1);
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="flex items-end justify-between h-32 space-x-1">
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-full ${colorClasses[color]} rounded-t transition-all duration-500`}
            style={{ height: `${(value / maxValue) * 80}%` }}
          ></div>
          <span className="text-xs text-gray-600 mt-2 text-center">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data, colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'] }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let accumulated = 0;

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
        {data.map((value, index) => {
          const percentage = (value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -accumulated;
          accumulated += percentage;

          return (
            <circle
              key={index}
              cx="16"
              cy="16"
              r="15.915"
              fill="none"
              stroke={colors[index]}
              strokeWidth="2"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
            />
          );
        })}
      </svg>
    </div>
  );
};

const LineChart = ({ data, labels, color = 'blue' }) => {
  const maxValue = Math.max(...data, 1);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    orange: '#F59E0B'
  }[color];

  return (
    <div className="h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
          className="transition-all duration-1000"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (value / maxValue) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={strokeColor}
              className="transition-all duration-1000"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentGigs, setRecentGigs] = useState([]);
  const [recentShares, setRecentShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [flaggedGigs, setFlaggedGigs] = useState([]);
  const [platformEarnings, setPlatformEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [companyStats, setCompanyStats] = useState(null);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [companyStatusFilter, setCompanyStatusFilter] = useState('all');
  const [privateGigStats, setPrivateGigStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [applicationAnalytics, setApplicationAnalytics] = useState(null);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    topSharers: [],
    topCreators: [],
    gigPerformance: []
  });
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Invitation Management State
  const [invitations, setInvitations] = useState([]);
  const [invitationStats, setInvitationStats] = useState(null);
  const [invitationSearchTerm, setInvitationSearchTerm] = useState('');
  const [invitationStatusFilter, setInvitationStatusFilter] = useState('all');
  const [invitationTypeFilter, setInvitationTypeFilter] = useState('all');

  // Navigation tabs with icons and counts
  const navigationTabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: HomeIcon,
      color: 'blue'
    },
    { 
      id: 'users', 
      name: 'User Management', 
      icon: UsersIcon,
      color: 'green',
      count: users.length
    },
    { 
      id: 'withdrawals', 
      name: 'Withdrawals', 
      icon: BanknotesIcon,
      color: 'orange',
      count: pendingWithdrawals.length
    },
    { 
      id: 'moderation', 
      name: 'Content Moderation', 
      icon: ShieldCheckIcon,
      color: 'red',
      count: flaggedGigs.length
    },
    { 
      id: 'companies', 
      name: 'Companies', 
      icon: BuildingOfficeIcon,
      color: 'purple',
      count: pendingCompanies.length
    },
    { 
      id: 'private-gigs', 
      name: 'Private Gigs', 
      icon: LockClosedIcon,
      color: 'yellow',
      count: privateGigStats?.pendingApplications || 0
    },
    { 
      id: 'invitations', 
      name: 'Invitations', 
      icon: EnvelopeIcon,
      color: 'indigo',
      count: invitationStats?.pending || 0
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: ChartBarIcon,
      color: 'green'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    } else if (activeTab === 'invitations') {
      fetchInvitations();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
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
        companyStatsRes,
        privateGigStatsRes,
        recentApplicationsRes,
        applicationAnalyticsRes,
        invitationsRes,
        invitationStatsRes
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
        axios.get('/api/admin/companies/stats'),
        axios.get('/api/admin/private-gigs/stats'),
        axios.get('/api/admin/applications/recent'),
        axios.get('/api/admin/applications/analytics'),
        axios.get('/api/admin/invitations'),
        axios.get('/api/admin/invitations/stats')
      ]);

      setStats(statsRes.data.data || {});
      setRecentGigs(gigsRes.data.data?.slice(0, 5) || []);
      setRecentShares(sharesRes.data.data?.slice(0, 5) || []);
      setUsers(usersRes.data.data || []);
      setPendingWithdrawals(withdrawalsRes.data.data || []);
      setPlatformEarnings(earningsRes.data.data?.totalEarnings || 0);
      setFlaggedGigs(flaggedGigsRes.data.data || []);
      setCompanies(companiesRes.data.data || []);
      setPendingCompanies(pendingCompaniesRes.data.data || []);
      setCompanyStats(companyStatsRes.data.data || {});
      setPrivateGigStats(privateGigStatsRes.data.data || {});
      setRecentApplications(recentApplicationsRes.data.data || []);
      setApplicationAnalytics(applicationAnalyticsRes.data.data || {});
      setInvitations(invitationsRes.data.data || []);
      setInvitationStats(invitationStatsRes.data.data || {});

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (period = analyticsPeriod) => {
    setAnalyticsLoading(true);
    try {
      const [topSharersRes, topCreatorsRes, gigPerformanceRes] = await Promise.all([
        axios.get(`/api/admin/analytics/top-sharers?period=${period}`),
        axios.get(`/api/admin/analytics/top-creators?period=${period}`),
        axios.get(`/api/admin/analytics/gig-performance?period=${period}`)
      ]);

      setAnalyticsData({
        topSharers: topSharersRes.data.data || [],
        topCreators: topCreatorsRes.data.data || [],
        gigPerformance: gigPerformanceRes.data.data || []
      });
      setAnalyticsPeriod(period);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await axios.get('/api/admin/invitations', {
        params: {
          search: invitationSearchTerm,
          status: invitationStatusFilter === 'all' ? undefined : invitationStatusFilter,
          type: invitationTypeFilter === 'all' ? undefined : invitationTypeFilter
        }
      });
      setInvitations(res.data.data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    }
  };

  const handleInvitationAction = async (invitationId, action) => {
    try {
      await axios.post(`/api/admin/invitations/${invitationId}/${action}`);
      toast.success(`Invitation ${action}ed successfully`);
      fetchInvitations();
      fetchDashboardData();
    } catch (error) {
      console.error(`Error ${action} invitation:`, error);
      toast.error(`Failed to ${action} invitation`);
    }
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
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
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  // Chart Card Component
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

  // Data Card Component
  const DataCard = ({ title, children, emptyMessage, data, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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

  // Main Dashboard Overview
  const DashboardOverview = () => {
    if (!stats) return null;

    // Chart data from real stats
    const platformGrowthData = [
      stats.totalUsers || 0,
      stats.totalGigs || 0,
      stats.totalShares || 0,
      stats.totalRevenue || 0,
      stats.totalCompanies || 0
    ];

    const revenueDistribution = [
      stats.totalRevenue * 0.6 || 0,
      stats.totalRevenue * 0.25 || 0,
      stats.totalRevenue * 0.10 || 0,
      stats.totalRevenue * 0.05 || 0
    ];

    const userActivityData = [
      stats.activeGigs || 0,
      stats.completedGigs || 0,
      stats.pendingWithdrawals || 0
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
              <p className="text-blue-100 mt-1">Here's what's happening with your platform today.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Platform Revenue</p>
              <p className="text-2xl font-bold">${platformEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={UsersIcon}
            title="Total Users"
            value={stats.totalUsers || 0}
            subtitle="Active this month"
            trend={12}
            color="blue"
          />
          <StatCard
            icon={BriefcaseIcon}
            title="Active Gigs"
            value={stats.activeGigs || 0}
            subtitle="Public & Private"
            trend={8}
            color="green"
          />
          <StatCard
            icon={ShareIcon}
            title="Total Shares"
            value={stats.totalShares || 0}
            subtitle="Completed shares"
            trend={15}
            color="purple"
          />
          <StatCard
            icon={CurrencyDollarIcon}
            title="Platform Revenue"
            value={`$${platformEarnings.toLocaleString()}`}
            subtitle="All time earnings"
            trend={22}
            color="orange"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">{stats.pendingWithdrawals || 0}</div>
            <div className="text-sm text-gray-600">Pending Withdrawals</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">{flaggedGigs.length}</div>
            <div className="text-sm text-gray-600">Flagged Content</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">{stats.pendingCompanies || 0}</div>
            <div className="text-sm text-gray-600">Pending Companies</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900">{invitationStats?.pending || 0}</div>
            <div className="text-sm text-gray-600">Pending Invitations</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Platform Growth" action="View Details">
            <BarChart 
              data={platformGrowthData}
              labels={['Users', 'Gigs', 'Shares', 'Revenue', 'Companies']}
              color="blue"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Platform Metrics</span>
              <span>Total Count</span>
            </div>
          </ChartCard>

          <ChartCard title="Revenue Distribution" action="Manage Revenue">
            <div className="flex items-center justify-between">
              <DonutChart 
                data={revenueDistribution}
                colors={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']}
              />
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>Gig Commissions (60%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Withdrawal Fees (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                  <span>Premium Features (10%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                  <span>Other (5%)</span>
                </div>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Activity Overview" action="View Report">
            <LineChart 
              data={userActivityData}
              labels={['Active Gigs', 'Completed', 'Pending']}
              color="green"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Last 30 days</span>
              <span>Activity Metrics</span>
            </div>
          </ChartCard>

          <ChartCard title="Content Types Distribution" action="Analyze">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Public Gigs</span>
                <span className="text-sm font-semibold">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: '65%' }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-4 mb-2">
                <span className="text-sm text-gray-600">Private Gigs</span>
                <span className="text-sm font-semibold">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: '35%' }}
                ></div>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Gigs */}
          <DataCard
            title={
              <span className="flex items-center">
                <BriefcaseIcon className="w-5 h-5 mr-2" />
                Recent Gigs
              </span>
            }
            data={recentGigs}
            emptyMessage="No recent gigs"
          >
            {recentGigs.map((gig) => (
              <div key={gig._id} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{gig.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{gig.description}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <span>By: {gig.user?.name}</span>
                      <span>${gig.budget}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        gig.shareType === 'private' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {gig.shareType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`/gigs/${gig._id}`, '_blank')}
                    className="ml-4 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <EyeIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </DataCard>

          {/* Recent Shares */}
          <DataCard
            title={
              <span className="flex items-center">
                <ShareIcon className="w-5 h-5 mr-2" />
                Recent Shares
              </span>
            }
            data={recentShares}
            emptyMessage="No recent shares"
          >
            {recentShares.map((share) => (
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
                      <span>{new Date(share.createdAt).toLocaleDateString()}</span>
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

  // User Management Component
  const UserManagement = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });

    const handleRoleChange = async (userId, newRole) => {
      try {
        await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
        toast.success('User role updated successfully');
        fetchDashboardData();
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role');
      }
    };

    const handleUserStatus = async (userId, isActive) => {
      try {
        await axios.put(`/api/admin/users/${userId}/status`, { isActive });
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error updating user status:', error);
        toast.error('Failed to update user status');
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
                <option value="moderator">Moderators</option>
                <option value="company">Companies</option>
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
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-700">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Balance</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 block">{user.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'company' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    ${parseFloat(user.walletBalance || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="company">Company</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleUserStatus(user._id, !user.isActive)}
                        className={`px-2 py-1 rounded text-xs ${
                          user.isActive 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white transition-colors`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
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
        toast.success(`Withdrawal ${action}d successfully`);
        fetchDashboardData();
      } catch (error) {
        console.error(`Error ${action} withdrawal:`, error);
        toast.error(`Failed to ${action} withdrawal`);
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
        <div className="divide-y divide-gray-200">
          {pendingWithdrawals.map((withdrawal) => (
            <div key={withdrawal._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{withdrawal.user?.name}</p>
                      <p className="text-sm text-gray-600">{withdrawal.user?.email}</p>
                      <p className="text-xs text-gray-500">
                        Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${withdrawal.amount}</p>
                  <p className="text-sm text-gray-600 capitalize">{withdrawal.paymentMethod}</p>
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
        toast.success(`Gig ${action}d successfully`);
        fetchDashboardData();
      } catch (error) {
        console.error(`Error ${action} gig:`, error);
        toast.error(`Failed to ${action} gig`);
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
        <div className="divide-y divide-gray-200">
          {flaggedGigs.map((gig) => (
            <div key={gig._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{gig.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gig.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By: {gig.user?.name}</span>
                    <span>Budget: ${gig.budget}</span>
                    <span>Type: {gig.contentType}</span>
                    <span>Created: {new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                  {gig.flagReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-red-700">
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

  // Company Management Component
  const CompanyManagement = () => {
    const [expandedCompany, setExpandedCompany] = useState(null);

    const filteredCompanies = companies.filter(company => {
      const matchesSearch = company.companyName?.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
                         company.businessEmail?.toLowerCase().includes(companySearchTerm.toLowerCase());
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
        toast.success(`Company ${action} successful`);
        fetchDashboardData();
        setExpandedCompany(null);
      } catch (error) {
        console.error(`Error ${action} company:`, error);
        toast.error(`Failed to ${action} company`);
      }
    };

    const getStatusBadge = (status) => {
      const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        verified: { color: 'bg-green-100 text-green-800', label: 'Verified' },
        rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
      };
      const config = statusConfig[status] || statusConfig.pending;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      );
    };

    return (
      <div className="space-y-6">
        {companyStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{companyStats.totalCompanies}</p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{companyStats.verifiedCompanies}</p>
                </div>
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{companyStats.pendingCompanies}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{companyStats.rejectedCompanies}</p>
                </div>
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={companyStatusFilter}
                  onChange={(e) => setCompanyStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700 w-8"></th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Company</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Industry</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Registered</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <React.Fragment key={company._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => setExpandedCompany(expandedCompany === company._id ? null : company._id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronRightIcon 
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              expandedCompany === company._id ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{company.companyName}</p>
                            <p className="text-xs text-gray-500">{company.businessEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {company.contactPerson?.name || 'N/A'}
                      </td>
                      <td className="p-4 text-sm text-gray-600 capitalize">{company.industry}</td>
                      <td className="p-4">
                        {getStatusBadge(company.verificationStatus)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={company.verificationStatus}
                            onChange={(e) => handleCompanyAction(company._id, 'updateStatus', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>

                    {expandedCompany === company._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Quick Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Contact:</span>
                                  <span className="text-gray-900">{company.contactPerson?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Website:</span>
                                  <span className="text-gray-900">{company.website || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Industry:</span>
                                  <span className="text-gray-900 capitalize">{company.industry}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
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
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      </div>
    );
  };

  // Private Gig Applications Component
  const PrivateGigApplications = () => {
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const fetchApplications = async () => {
      setApplicationsLoading(true);
      try {
        const res = await axios.get('/api/admin/applications', {
          params: {
            search: applicationSearchTerm,
            status: applicationStatusFilter === 'all' ? undefined : applicationStatusFilter
          }
        });
        setApplications(res.data.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setApplicationsLoading(false);
      }
    };

    useEffect(() => {
      fetchApplications();
    }, [applicationSearchTerm, applicationStatusFilter]);

    const handleApplicationAction = async (applicationId, action, notes = '') => {
      try {
        const endpoint = `/api/admin/applications/${applicationId}/${action}`;
        await axios.post(endpoint, action === 'reject' ? { reason: notes } : { notes });
        
        toast.success(`Application ${action}d successfully`);
        fetchApplications();
        fetchDashboardData();
      } catch (error) {
        toast.error(error.response?.data?.message || `Failed to ${action} application`);
      }
    };

    const ApplicationCard = ({ application }) => {
      const [showActions, setShowActions] = useState(false);
      const [actionLoading, setActionLoading] = useState(false);
      const [rejectNotes, setRejectNotes] = useState('');

      const handleApprove = async () => {
        setActionLoading(true);
        try {
          await handleApplicationAction(application._id, 'approve', 'Application approved by admin');
          setShowActions(false);
        } finally {
          setActionLoading(false);
        }
      };

      const handleReject = async () => {
        if (!rejectNotes.trim()) {
          toast.error('Please provide a reason for rejection');
          return;
        }

        setActionLoading(true);
        try {
          await handleApplicationAction(application._id, 'reject', rejectNotes);
          setShowActions(false);
          setRejectNotes('');
        } finally {
          setActionLoading(false);
        }
      };

      const getStatusBadge = (status) => {
        const statusConfig = {
          pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
          approved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
          rejected: { color: 'bg-red-100 text-red-800', icon: XCircleIcon }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const IconComponent = config.icon;
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${config.color}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      };

      return (
        <div className="p-6 hover:bg-gray-50 transition-all duration-300 border-b border-gray-200 last:border-b-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 text-lg">{application.gig?.title}</h4>
                <LockClosedIcon className="w-4 h-4 text-purple-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Applicant:</strong> {application.user?.name} ({application.user?.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Gig Owner:</strong> {application.gig?.user?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Budget:</strong> ${application.gig?.budget}
                  </p>
                </div>
              </div>

              {application.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Application Message:</strong> {application.message}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Gig Type: {application.gig?.shareType}</span>
                <span>•</span>
                <span>Shares Required: {application.gig?.sharesRequired}</span>
                <span>•</span>
                <span>Per Share: ${(application.gig?.budget / application.gig?.sharesRequired).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              {getStatusBadge(application.status)}
              {application.reviewedAt && (
                <p className="text-xs text-gray-500">
                  Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {!showActions ? (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowActions(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 flex items-center"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Review
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Provide feedback for the applicant..."
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowActions(false);
                    setRejectNotes('');
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center"
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 flex items-center"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {privateGigStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Private Gigs</p>
                  <p className="text-2xl font-bold text-gray-900">{privateGigStats.totalPrivateGigs}</p>
                </div>
                <LockClosedIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{privateGigStats.totalApplications}</p>
                </div>
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {privateGigStats.approvalRate ? `${privateGigStats.approvalRate}%` : 'N/A'}
                  </p>
                </div>
                <CheckBadgeIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{privateGigStats.pendingApplications}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        <DataCard 
          title={
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Private Gig Applications ({applications.length})
              </span>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={applicationSearchTerm}
                    onChange={(e) => setApplicationSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={applicationStatusFilter}
                  onChange={(e) => setApplicationStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={fetchApplications}
                  disabled={applicationsLoading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                >
                  <ArrowPathIcon className={`w-4 h-4 ${applicationsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          }
          data={applications}
          emptyMessage="No applications found"
        >
          <div className="divide-y divide-gray-200">
            {applications.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
        </DataCard>

        {applicationAnalytics && (
          <DataCard 
            title={
              <span className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Application Analytics
              </span>
            }
            data={[applicationAnalytics]}
            emptyMessage="No analytics data available"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-blue-600">{applicationAnalytics.totalApplications}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">{applicationAnalytics.approvedApplications}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-yellow-600">{applicationAnalytics.pendingApplications}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-red-600">{applicationAnalytics.rejectedApplications}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-4">Application Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Approval Rate</span>
                      <span>{applicationAnalytics.approvalRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${applicationAnalytics.approvalRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Average Response Time</span>
                      <span>{applicationAnalytics.avgResponseTime || 'N/A'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DataCard>
        )}
      </div>
    );
  };

  // Invitation Management Component
  const InvitationManagement = () => {
    const filteredInvitations = invitations.filter(invitation => {
      const matchesSearch = 
        invitation.recipient?.name?.toLowerCase().includes(invitationSearchTerm.toLowerCase()) ||
        invitation.recipient?.email?.toLowerCase().includes(invitationSearchTerm.toLowerCase()) ||
        invitation.serviceGig?.title?.toLowerCase().includes(invitationSearchTerm.toLowerCase()) ||
        invitation.targetGig?.title?.toLowerCase().includes(invitationSearchTerm.toLowerCase());
      
      const matchesStatus = invitationStatusFilter === 'all' || invitation.status === invitationStatusFilter;
      const matchesType = invitationTypeFilter === 'all' || invitation.senderType === invitationTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status) => {
      const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
        accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
        rejected: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
        expired: { color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
      };
      const config = statusConfig[status] || statusConfig.pending;
      const IconComponent = config.icon;
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${config.color}`}>
          <IconComponent className="w-3 h-3 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    const getSenderTypeBadge = (senderType, company) => {
      const typeConfig = {
        admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
        company: { color: 'bg-purple-100 text-purple-800', label: company?.companyName || 'Company' },
        user: { color: 'bg-blue-100 text-blue-800', label: 'User' }
      };
      const config = typeConfig[senderType] || typeConfig.user;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      );
    };

    return (
      <div className="space-y-6">
        {/* Invitation Stats */}
        {invitationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">{invitationStats.total}</p>
                </div>
                <EnvelopeIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{invitationStats.pending}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{invitationStats.accepted}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{invitationStats.rejected}</p>
                </div>
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

        <DataCard 
          title={
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Invitation Management ({filteredInvitations.length})
              </span>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search invitations..."
                    value={invitationSearchTerm}
                    onChange={(e) => setInvitationSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={invitationStatusFilter}
                  onChange={(e) => setInvitationStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
                <select
                  value={invitationTypeFilter}
                  onChange={(e) => setInvitationTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="admin">Admin</option>
                  <option value="company">Company</option>
                  <option value="user">User</option>
                </select>
                <button
                  onClick={fetchInvitations}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          }
          data={filteredInvitations}
          emptyMessage="No invitations found"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Sender</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Recipient</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Service Gig</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Target Gig</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Sent</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvitations.map((invitation) => (
                  <tr key={invitation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {invitation.sender?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">{invitation.sender?.name || 'Unknown'}</span>
                          {getSenderTypeBadge(invitation.senderType, invitation.company)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {invitation.recipient?.name?.charAt(0)?.toUpperCase() || 'R'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">{invitation.recipient?.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{invitation.recipient?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <span className="font-medium text-gray-900 text-sm block truncate">
                          {invitation.serviceGig?.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${invitation.serviceGig?.price || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <span className="font-medium text-gray-900 text-sm block truncate">
                          {invitation.targetGig?.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${invitation.targetGig?.budget || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(invitation.status)}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(invitation.sentAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`/gigs/${invitation.serviceGig?._id}`, '_blank')}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Service Gig"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/gigs/${invitation.targetGig?._id}`, '_blank')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="View Target Gig"
                        >
                          <BriefcaseIcon className="w-4 h-4" />
                        </button>
                        {invitation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleInvitationAction(invitation._id, 'accept')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Accept Invitation"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleInvitationAction(invitation._id, 'reject')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject Invitation"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>

        {/* Invitation Analytics */}
        {invitationStats && (
          <DataCard 
            title={
              <span className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Invitation Analytics
              </span>
            }
            data={[invitationStats]}
            emptyMessage="No analytics data available"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Invitation Status Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Pending', value: invitationStats.pending, color: 'bg-yellow-500', percentage: ((invitationStats.pending / invitationStats.total) * 100).toFixed(1) },
                      { label: 'Accepted', value: invitationStats.accepted, color: 'bg-green-500', percentage: ((invitationStats.accepted / invitationStats.total) * 100).toFixed(1) },
                      { label: 'Rejected', value: invitationStats.rejected, color: 'bg-red-500', percentage: ((invitationStats.rejected / invitationStats.total) * 100).toFixed(1) },
                      { label: 'Expired', value: invitationStats.expired, color: 'bg-gray-500', percentage: ((invitationStats.expired / invitationStats.total) * 100).toFixed(1) }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{item.value}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-700">Acceptance Rate</span>
                      <span className="text-lg font-bold text-blue-700">
                        {invitationStats.total > 0 ? ((invitationStats.accepted / invitationStats.total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Avg Response Time</span>
                      <span className="text-lg font-bold text-green-700">24h</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-purple-700">Active Invitations</span>
                      <span className="text-lg font-bold text-purple-700">{invitationStats.pending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DataCard>
        )}
      </div>
    );
  };

  // Analytics Dashboard Component
  const AnalyticsDashboard = () => {
    const AnalyticsMetricCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'blue' }) => {
      const isPositive = change >= 0;
      const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600'
      };

      return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]} hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center">
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous period</span>
          </div>
        </div>
      );
    };

    if (analyticsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      );
    }

    const totalShares = analyticsData.topSharers.reduce((sum, sharer) => sum + sharer.totalShares, 0);
    const totalEarnings = analyticsData.topSharers.reduce((sum, sharer) => sum + sharer.totalEarnings, 0);
    const totalGigs = analyticsData.topCreators.reduce((sum, creator) => sum + creator.totalGigs, 0);
    const totalBudget = analyticsData.topCreators.reduce((sum, creator) => sum + creator.totalBudget, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
            <p className="text-gray-600">Comprehensive insights into platform performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={analyticsPeriod}
              onChange={(e) => fetchAnalyticsData(e.target.value)}
              disabled={analyticsLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => fetchAnalyticsData()}
              disabled={analyticsLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
            >
              <ArrowPathIcon className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsMetricCard
            icon={UsersIcon}
            title="Top Sharers"
            value={analyticsData.topSharers.length}
            change={8}
            trend="up"
            color="blue"
          />
          <AnalyticsMetricCard
            icon={BriefcaseIcon}
            title="Active Creators"
            value={analyticsData.topCreators.length}
            change={12}
            trend="up"
            color="green"
          />
          <AnalyticsMetricCard
            icon={ShareIcon}
            title="Total Shares"
            value={totalShares}
            change={15}
            trend="up"
            color="purple"
          />
          <AnalyticsMetricCard
            icon={CurrencyDollarIcon}
            title="Total Earnings"
            value={`$${totalEarnings.toFixed(0)}`}
            change={22}
            trend="up"
            color="orange"
          />
        </div>

        <DataCard
          title={
            <span className="flex items-center">
              <StarIcon className="w-5 h-5 mr-2" />
              Top Sharers ({analyticsData.topSharers.length})
            </span>
          }
          data={analyticsData.topSharers}
          emptyMessage="No sharers data available"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Total Shares</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Approved</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Earnings</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Click Rate</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Last Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.topSharers.map((sharer, index) => (
                  <tr key={sharer.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {sharer.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">{sharer.userName || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{sharer.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{sharer.totalShares}</td>
                    <td className="p-4 text-sm text-green-600">{sharer.approvedShares}</td>
                    <td className="p-4 text-sm text-green-600">${sharer.totalEarnings?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-sm text-blue-600">{sharer.clickThroughRate?.toFixed(1) || '0'}%</td>
                    <td className="p-4 text-sm text-gray-500">
                      {sharer.lastShareDate ? new Date(sharer.lastShareDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard
          title={
            <span className="flex items-center">
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              Top Gig Creators ({analyticsData.topCreators.length})
            </span>
          }
          data={analyticsData.topCreators}
          emptyMessage="No creators data available"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Creator</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Total Gigs</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Active</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Total Budget</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Platform Revenue</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.topCreators.map((creator, index) => (
                  <tr key={creator.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {creator.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">{creator.userName || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{creator.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{creator.totalGigs}</td>
                    <td className="p-4 text-sm text-green-600">{creator.activeGigs}</td>
                    <td className="p-4 text-sm text-purple-600">${creator.totalBudget?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-sm text-orange-600">${creator.platformRevenue?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-sm text-blue-600">{creator.avgCompletionRate?.toFixed(1) || '0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard
          title={
            <span className="flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Gig Performance ({analyticsData.gigPerformance.length})
            </span>
          }
          data={analyticsData.gigPerformance}
          emptyMessage="No gig performance data available"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Gig Title</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Creator</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Budget</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Shares</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Completion</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Cost/Share</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.gigPerformance.map((gig) => (
                  <tr key={gig._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="max-w-xs">
                        <span className="font-medium text-gray-900 text-sm block truncate">{gig.title}</span>
                        <span className="text-xs text-gray-500 capitalize">{gig.contentType}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{gig.creatorName}</td>
                    <td className="p-4 text-sm text-purple-600">${gig.budget}</td>
                    <td className="p-4 text-sm text-gray-900">
                      {gig.sharesCompleted}/{gig.sharesRequired}
                    </td>
                    <td className="p-4 text-sm text-blue-600">{gig.completionRate?.toFixed(1) || '0'}%</td>
                    <td className="p-4 text-sm text-green-600">${gig.costPerShare?.toFixed(2) || '0.00'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gig.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gig.isActive ? 'Active' : 'Completed'}
                      </span>
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

  // Sidebar Navigation Component
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-lg">Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
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
            yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            red: 'bg-red-50 text-red-700 border border-red-200',
            indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          };
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
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
                    : 'bg-red-100 text-red-700'
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
          <p className="text-sm text-gray-600">Platform Revenue</p>
          <p className="text-xl font-bold text-gray-900">${platformEarnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  // Main content area
  const MainContent = () => (
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
              {activeTab === 'overview' && 'Platform overview and recent activity'}
              {activeTab === 'users' && 'Manage user accounts and permissions'}
              {activeTab === 'withdrawals' && 'Approve or reject withdrawal requests'}
              {activeTab === 'moderation' && 'Review and moderate gig content'}
              {activeTab === 'companies' && 'Verify and manage business accounts'}
              {activeTab === 'private-gigs' && 'Manage private gig applications'}
              {activeTab === 'invitations' && 'Monitor and manage invitation system'}
              {activeTab === 'analytics' && 'Platform performance insights'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchDashboardData}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-lg font-bold text-gray-900">{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'withdrawals' && <WithdrawalApproval />}
        {activeTab === 'moderation' && <GigModeration />}
        {activeTab === 'companies' && <CompanyManagement />}
        {activeTab === 'private-gigs' && <PrivateGigApplications />}
        {activeTab === 'invitations' && <InvitationManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Admin Dashboard</h2>
          <p className="text-gray-600">Preparing your admin interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <MainContent />

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

export default AdminDashboard;