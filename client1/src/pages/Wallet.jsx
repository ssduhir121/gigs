// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';
// import {
//   CurrencyDollarIcon,
//   ArrowDownTrayIcon,
//   ArrowUpTrayIcon,
//   ChartBarIcon,
//   ClockIcon,
//   PlusIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon as ClockSolidIcon,
//   CreditCardIcon
// } from '@heroicons/react/24/outline';
// import {
//   CheckCircleIcon as CheckCircleSolidIcon,
//   XCircleIcon as XCircleSolidIcon
// } from '@heroicons/react/24/solid';

// // Import color system
// import { colors, colorVariants } from '../constants/colors';
// import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

// const Wallet = () => {
//   const [walletData, setWalletData] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [paypalEmail, setPaypalEmail] = useState('');
//   const [linkingPaypal, setLinkingPaypal] = useState(false);
//   const [paypalStatus, setPaypalStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [withdrawLoading, setWithdrawLoading] = useState(false);
//   const [showBalance, setShowBalance] = useState(true);
//   const [activeTab, setActiveTab] = useState('transactions');
//   const { user, updateUserBalance, refreshUser } = useAuth();

//   useEffect(() => {
//     fetchWalletData();
//     checkPaypalStatus();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       const [walletRes, statsRes, withdrawalsRes] = await Promise.all([
//         axios.get('/api/wallet'),
//         axios.get('/api/wallet/stats'),
//         axios.get('/api/withdrawals')
//       ]);

//       setWalletData(walletRes.data.data);
//       setTransactions(walletRes.data.data.transactions || []);
//       setWithdrawals(withdrawalsRes.data.data || []);
//       setStats(statsRes.data.data);
//     } catch (error) {
//       console.error('Error fetching wallet data:', error);
//       toast.error('Failed to load wallet data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkPaypalStatus = async () => {
//     try {
//       const res = await axios.get('/api/withdrawals/paypal-status');
//       setPaypalStatus(res.data.data);
//       if (res.data.data.paypalEmail) {
//         setPaypalEmail(res.data.data.paypalEmail);
//       }
//     } catch (error) {
//       console.error('Error checking PayPal status:', error);
//     }
//   };

//   const linkPaypalAccount = async () => {
//     if (!paypalEmail) {
//       toast.error('Please enter your PayPal email');
//       return;
//     }

//     try {
//       const res = await axios.post('/api/withdrawals/link-paypal', { paypalEmail });
//       toast.success('PayPal account linked successfully!');
//       setLinkingPaypal(false);
//       await checkPaypalStatus();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to link PayPal');
//     }
//   };

//   const handleWithdraw = async (e) => {
//     e.preventDefault();
    
//     if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }

//     const amount = parseFloat(withdrawAmount);
//     const minWithdrawal = 5.00;

//     if (amount < minWithdrawal) {
//       toast.error(`Minimum withdrawal amount is $${minWithdrawal}`);
//       return;
//     }

//     if (amount > user.walletBalance) {
//       toast.error('Insufficient balance');
//       return;
//     }

//     // Check for pending withdrawals
//     const hasPendingWithdrawal = withdrawals.some(w => 
//       w.status === 'pending' || w.status === 'processing'
//     );

//     if (hasPendingWithdrawal) {
//       toast.error('You already have a pending withdrawal request');
//       return;
//     }

//     setWithdrawLoading(true);
//     const withdrawToast = toast.loading('Processing withdrawal request...');

//     try {
//       const payload = {
//         amount: amount,
//         paymentMethod: 'paypal'
//       };

//       // Include PayPal email if provided (for linking)
//       if (paypalEmail && !paypalStatus?.paypalLinked) {
//         payload.paypalEmail = paypalEmail;
//       }

//       const res = await axios.post('/api/withdrawals', payload);

//       // Update local user balance
//       updateUserBalance(res.data.data.newBalance);
//       await refreshUser();
      
//       if (res.data.data.isNewPaypalLinked) {
//         toast.success(`Withdrawal processing! PayPal account ${paypalEmail} linked successfully. Funds will be sent within 2-3 business days.`, { 
//           id: withdrawToast,
//           duration: 6000
//         });
//       } else {
//         toast.success(`Withdrawal processing! $${amount.toFixed(2)} sent to ${res.data.data.paypalEmail}. Funds will arrive within 2-3 business days.`, { 
//           id: withdrawToast,
//           duration: 6000
//         });
//       }
      
//       setWithdrawAmount('');
//       fetchWalletData();
//       setActiveTab('withdrawals');
//     } catch (error) {
//       const errorData = error.response?.data;
      
//       if (errorData?.actionRequired && errorData.action === 'link_paypal') {
//         toast.error('Please link your PayPal account first', { id: withdrawToast });
//         setLinkingPaypal(true);
//       } else {
//         toast.error(errorData?.message || 'Withdrawal failed', { id: withdrawToast });
//       }
//     } finally {
//       setWithdrawLoading(false);
//     }
//   };

//   const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
//     const colorVariant = colorVariants[color];
    
//     return (
//       <GlassCard className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
//             <p className="text-2xl font-bold text-white">{value}</p>
//             {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
//           </div>
//           <StatIconWrapper color={color}>
//             <Icon className="w-6 h-6 text-white" />
//           </StatIconWrapper>
//         </div>
//         {trend && (
//           <div className="flex items-center mt-3">
//             <ArrowUpTrayIcon className="w-4 h-4 text-green-400 mr-1" />
//             <span className="text-sm text-green-300 font-medium">{trend}</span>
//           </div>
//         )}
//       </GlassCard>
//     );
//   };

//   const TransactionItem = ({ transaction }) => {
//     const isCredit = transaction.type === 'credit';
    
//     return (
//       <div className="flex items-center justify-between p-4 hover:bg-white/10 rounded-lg transition-all duration-150 group">
//         <div className="flex items-center space-x-4">
//           <StatIconWrapper color={isCredit ? 'green' : 'red'} className="!p-2 group-hover:scale-110 transition-transform">
//             {isCredit ? (
//               <ArrowDownTrayIcon className="w-5 h-5 text-white" />
//             ) : (
//               <ArrowUpTrayIcon className="w-5 h-5 text-white" />
//             )}
//           </StatIconWrapper>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
//             <div className="flex items-center text-xs text-gray-300 mt-1">
//               <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
//               <span className="truncate">{new Date(transaction.createdAt).toLocaleDateString()}</span>
//               {transaction.gig?.title && (
//                 <>
//                   <span className="mx-2">•</span>
//                   <span className="truncate">{transaction.gig.title}</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="text-right min-w-0 ml-4">
//           <p className={`text-sm font-semibold truncate ${
//             isCredit ? 'text-green-300' : 'text-red-300'
//           }`}>
//             {isCredit ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
//           </p>
//           <p className="text-xs text-gray-400 truncate">
//             Balance: ${Number(transaction.balanceAfter || 0).toFixed(2)}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const WithdrawalStatus = ({ withdrawal }) => {
//     const getStatusConfig = (status) => {
//       switch (status) {
//         case 'completed':
//           return {
//             color: 'text-green-300',
//             bgColor: 'bg-green-400/20',
//             icon: CheckCircleSolidIcon,
//             label: 'Completed',
//             message: 'Funds sent successfully'
//           };
//         case 'processing':
//           return {
//             color: 'text-blue-300',
//             bgColor: 'bg-blue-400/20',
//             icon: ClockSolidIcon,
//             label: 'Processing',
//             message: 'Being processed (2-3 business days)'
//           };
//         case 'failed':
//           return {
//             color: 'text-red-300',
//             bgColor: 'bg-red-400/20',
//             icon: XCircleSolidIcon,
//             label: 'Failed',
//             message: 'Payment failed - funds returned to wallet'
//           };
//         default:
//           return {
//             color: 'text-yellow-300',
//             bgColor: 'bg-yellow-400/20',
//             icon: ClockSolidIcon,
//             label: 'Pending',
//             message: 'Awaiting processing'
//           };
//       }
//     };

//     const statusConfig = getStatusConfig(withdrawal.status);
//     const StatusIcon = statusConfig.icon;

//     return (
//       <div className="flex items-center justify-between p-4 hover:bg-white/10 rounded-lg transition-all duration-150 group">
//         <div className="flex items-center space-x-4 flex-1 min-w-0">
//           <div className={`p-2 rounded-lg ${statusConfig.bgColor} group-hover:scale-110 transition-transform`}>
//             <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-2 mb-1">
//               <p className="text-sm font-medium text-white truncate">
//                 Withdrawal #{(withdrawal._id).toString().slice(-8).toUpperCase()}
//               </p>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
//                 {statusConfig.label}
//               </span>
//             </div>
//             <div className="flex items-center text-xs text-gray-300 mb-1">
//               <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
//               <span className="truncate">
//                 {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric',
//                   year: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </span>
//               <span className="mx-2">•</span>
//               <span className="capitalize truncate">{withdrawal.paymentMethod}</span>
//             </div>
//             <p className="text-xs text-gray-400 truncate">
//               {statusConfig.message}
//             </p>
//             {withdrawal.failureReason && (
//               <p className="text-xs text-red-300 mt-1 truncate">{withdrawal.failureReason}</p>
//             )}
//             {withdrawal.processedAt && (
//               <p className="text-xs text-gray-400 mt-1">
//                 Processed: {new Date(withdrawal.processedAt).toLocaleDateString()}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="text-right min-w-0 ml-4">
//           <p className="text-sm font-semibold text-white truncate">
//            -${Number(withdrawal.amount).toFixed(2)}
//           </p>
//           <p className={`text-xs capitalize truncate ${statusConfig.color}`}>
//             {withdrawal.status}
//           </p>
//           {withdrawal.payoutBatchId && (
//             <p className="text-xs text-gray-400 truncate" title={withdrawal.payoutBatchId}>
//               ID: {withdrawal.payoutBatchId.slice(0, 8)}...
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const PendingWithdrawalWarning = () => {
//     const pendingWithdrawal = withdrawals.find(w => 
//       w.status === 'pending' || w.status === 'processing'
//     );

//     if (!pendingWithdrawal) return null;

//     return (
//       <div className="mb-6">
//         <GlassCard className="bg-yellow-400/20 border-yellow-400/30">
//           <div className="flex items-center">
//             <ClockSolidIcon className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-sm font-medium text-yellow-300 mb-1">
//                 Withdrawal In Progress
//               </p>
//               <p className="text-xs text-yellow-200">
//                 You have a pending withdrawal of <strong>${Number(pendingWithdrawal.amount).toFixed(2)}</strong>. 
//                 {pendingWithdrawal.status === 'processing' 
//                   ? ' It is currently being processed and should complete within 2-3 business days.'
//                   : ' It is awaiting processing.'
//                 }
//               </p>
//             </div>
//           </div>
//         </GlassCard>
//       </div>
//     );
//   };

//   const PayPalLinkingSection = () => {
//     if (!linkingPaypal) return null;

//     return (
//       <div className="mb-6">
//         <GlassCard className="bg-blue-400/20 border-blue-400/30">
//           <div className="flex items-start">
//             <CreditCardIcon className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-sm font-medium text-blue-300 mb-2">
//                 Link PayPal Account
//               </p>
//               <p className="text-xs text-blue-200 mb-3">
//                 Enter your PayPal email to receive withdrawals. This email must be registered with PayPal.
//               </p>
              
//               <div className="flex space-x-2 mb-3">
//                 <input
//                   type="email"
//                   value={paypalEmail}
//                   onChange={(e) => setPaypalEmail(e.target.value)}
//                   placeholder="your-email@paypal.com"
//                   className="flex-1 px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <button
//                   onClick={linkPaypalAccount}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Link
//                 </button>
//               </div>
              
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setLinkingPaypal(false)}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     setLinkingPaypal(false);
//                     // Retry withdrawal after linking
//                     if (withdrawAmount) {
//                       setTimeout(() => handleWithdraw(new Event('submit')), 500);
//                     }
//                   }}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
//                 >
//                   Link & Withdraw
//                 </button>
//               </div>
//             </div>
//           </div>
//         </GlassCard>
//       </div>
//     );
//   };

//   const PayPalStatusBadge = () => {
//     if (!paypalStatus) return null;

//     return (
//       <div className="mb-4">
//         <GlassCard className={`p-3 ${paypalStatus.paypalLinked ? 'bg-green-400/20 border-green-400/30' : 'bg-blue-400/20 border-blue-400/30'}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <CreditCardIcon className={`w-4 h-4 ${paypalStatus.paypalLinked ? 'text-green-300' : 'text-blue-300'} mr-2`} />
//               <span className={`text-sm font-medium ${paypalStatus.paypalLinked ? 'text-green-300' : 'text-blue-300'}`}>
//                 PayPal: {paypalStatus.paypalLinked ? 'Linked' : 'Not Linked'}
//               </span>
//             </div>
//             {paypalStatus.paypalLinked ? (
//               <span className="text-xs text-green-200">
//                 {paypalStatus.paypalEmail}
//               </span>
//             ) : (
//               <button
//                 onClick={() => setLinkingPaypal(true)}
//                 className="text-xs text-blue-300 hover:text-blue-200 underline"
//               >
//                 Link Now
//               </button>
//             )}
//           </div>
//         </GlassCard>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <GradientBackground className="py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-16">
//             <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-white/80">Loading wallet data...</p>
//           </div>
//         </div>
//       </GradientBackground>
//     );
//   }

//   const hasPendingWithdrawal = withdrawals.some(w => 
//     w.status === 'pending' || w.status === 'processing'
//   );

//   return (
//     <GradientBackground className="py-8">
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
//             <p className="text-gray-200">Manage your earnings and withdrawals</p>
//           </div>
//           <Link
//             to="/gigs"
//             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 mt-4 lg:mt-0 backdrop-blur-sm"
//           >
//             <PlusIcon className="w-5 h-5 mr-2" />
//             Start Earning
//           </Link>
//         </div>

//         {/* PayPal Linking Section */}
//         <PayPalLinkingSection />

//         {/* Pending Withdrawal Warning */}
//         <PendingWithdrawalWarning />

//         {/* Wallet Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {console.log(user)}
//           <StatCard
//             icon={CurrencyDollarIcon}
//             title="Current Balance"
//             value={
//               showBalance 
//                 ? `$${Number(user?.walletBalance?.$numberDecimal ?? user?.walletBalance ?? 0).toFixed(2)}`

//                 : '••••'
//             }
//             color="green"
//           />
//           <StatCard
//             icon={ChartBarIcon}
//             title="Total Earnings"
//             value={`$${Number(stats?.totalEarnings || 0).toFixed(2)}`}
//             subtitle="All time"
//             color="blue"
//           />
//           <StatCard
//             icon={ArrowUpTrayIcon}
//             title="Total Withdrawn"
//             value={`$${Number(stats?.totalWithdrawn || 0).toFixed(2)}`}
//             subtitle="Completed withdrawals"
//             color="purple"
//           />
//           <StatCard
//             icon={ClockIcon}
//             title="Total Transactions"
//             value={stats?.totalTransactions || 0}
//             color="orange"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Withdrawal Form */}
//           <div className="lg:col-span-1">
//             <GlassCard className="p-6 sticky top-8 backdrop-blur-lg">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 <StatIconWrapper color="green" className="!p-1 mr-2">
//                   <ArrowUpTrayIcon className="w-5 h-5 text-white" />
//                 </StatIconWrapper>
//                 Withdraw Funds
//               </h3>
              
//               {/* PayPal Status */}
//               <PayPalStatusBadge />

//               {/* Balance Toggle */}
//               <div className="flex items-center justify-between mb-6 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
//                 <span className="text-sm font-medium text-gray-200">Available Balance</span>
//                 <div className="flex items-center">
//                   <span className="text-lg font-bold text-white mr-2">
//                     {showBalance ? `$${Number(user?.walletBalance?.$numberDecimal || 0).toFixed(2)}` : '••••'}
//                   </span>
//                   <button
//                     onClick={() => setShowBalance(!showBalance)}
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     {showBalance ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleWithdraw}>
//                 <div className="mb-4">
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-2">
//                     Amount to Withdraw
//                   </label>
//                   <div className="relative rounded-lg shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-400 sm:text-sm">$</span>
//                     </div>
//                     <input
//                       type="number"
//                       name="amount"
//                       id="amount"
//                       min="5"
//                       step="0.01"
//                       max={user?.walletBalance}
//                       value={withdrawAmount}
//                       onChange={(e) => setWithdrawAmount(e.target.value)}
//                       className="block w-full pl-7 pr-12 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
//                       placeholder="0.00"
//                       disabled={hasPendingWithdrawal}
//                     />
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                       <span className="text-gray-400 sm:text-sm">USD</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-400 mt-2">
//                     Minimum: $5.00 • Available: ${Number(user?.walletBalance || 0).toFixed(2)}
//                   </p>
//                 </div>

//                 {/* PayPal Email Input (if not linked) */}
//                 {!paypalStatus?.paypalLinked && !linkingPaypal && (
//                   <div className="mb-4">
//                     <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-200 mb-2">
//                       PayPal Email
//                     </label>
//                     <input
//                       type="email"
//                       id="paypalEmail"
//                       value={paypalEmail}
//                       onChange={(e) => setPaypalEmail(e.target.value)}
//                       className="block w-full px-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
//                       placeholder="your-email@paypal.com"
//                       disabled={hasPendingWithdrawal}
//                     />
//                     <p className="text-xs text-gray-400 mt-1">
//                       Enter your PayPal email to receive funds
//                     </p>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) < 5 || hasPendingWithdrawal}
//                   className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
//                 >
//                   {withdrawLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Processing...
//                     </>
//                   ) : hasPendingWithdrawal ? (
//                     'Withdrawal In Progress'
//                   ) : (
//                     'Request Withdrawal'
//                   )}
//                 </button>
//               </form>

//               {/* Withdrawal Info */}
//               <div className="mt-6 p-4 bg-blue-400/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
//                 <h4 className="text-sm font-medium text-blue-300 mb-2">How it works:</h4>
//                 <ul className="text-sm text-blue-200 space-y-1">
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
//                     Minimum withdrawal: $5.00
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
//                     Processing time: 2-3 business days
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
//                     Funds sent via PayPal to your email
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
//                     One withdrawal at a time
//                   </li>
//                 </ul>
//               </div>
//             </GlassCard>
//           </div>

//           {/* Transaction & Withdrawal History */}
//           <div className="lg:col-span-2">
//             {/* Tabs */}
//             <div className="mb-6">
//               <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
//                 <button
//                   onClick={() => setActiveTab('transactions')}
//                   className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
//                     activeTab === 'transactions' 
//                       ? 'bg-primary-600 text-white shadow-lg' 
//                       : 'text-gray-300 hover:text-white hover:bg-white/10'
//                   }`}
//                 >
//                   Transactions
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('withdrawals')}
//                   className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
//                     activeTab === 'withdrawals' 
//                       ? 'bg-primary-600 text-white shadow-lg' 
//                       : 'text-gray-300 hover:text-white hover:bg-white/10'
//                   }`}
//                 >
//                   Withdrawals ({withdrawals.length})
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             {activeTab === 'transactions' ? (
//               <GlassCard className="overflow-hidden">
//                 <div className="px-6 py-4 border-b border-white/20">
//                   <h3 className="text-lg font-semibold text-white flex items-center">
//                     <StatIconWrapper color="orange" className="!p-1 mr-2">
//                       <ClockIcon className="w-5 h-5 text-white" />
//                     </StatIconWrapper>
//                     Recent Transactions
//                   </h3>
//                 </div>
                
//                 <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
//                   {transactions.length > 0 ? (
//                     transactions.map((transaction) => (
//                       <TransactionItem key={transaction._id} transaction={transaction} />
//                     ))
//                   ) : (
//                     <div className="px-6 py-12 text-center">
//                       <div className="text-6xl mb-4">💸</div>
//                       <p className="text-gray-300 text-lg mb-2">No transactions yet</p>
//                       <p className="text-gray-400 text-sm mb-6">
//                         Start sharing gigs to earn money and see your transactions here!
//                       </p>
//                       <Link
//                         to="/gigs"
//                         className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
//                       >
//                         <PlusIcon className="w-5 h-5 mr-2" />
//                         Browse Gigs
//                       </Link>
//                     </div>
//                   )}
//                 </div>

//                 {/* View All Transactions */}
//                 {transactions.length > 0 && (
//                   <div className="px-6 py-4 border-t border-white/20 bg-white/10 backdrop-blur-sm">
//                     <button 
//                       onClick={() => toast.success('Showing all transactions would load more records here')}
//                       className="w-full text-center text-sm text-primary-300 hover:text-primary-200 font-medium transition-colors"
//                     >
//                       View All Transactions
//                     </button>
//                   </div>
//                 )}
//               </GlassCard>
//             ) : (
//               <GlassCard className="overflow-hidden">
//                 <div className="px-6 py-4 border-b border-white/20">
//                   <h3 className="text-lg font-semibold text-white flex items-center">
//                     <StatIconWrapper color="green" className="!p-1 mr-2">
//                       <ArrowUpTrayIcon className="w-5 h-5 text-white" />
//                     </StatIconWrapper>
//                     Withdrawal History
//                   </h3>
//                 </div>
                
//                 <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
//                   {withdrawals.length > 0 ? (
//                     withdrawals.map((withdrawal) => (
//                       <WithdrawalStatus key={withdrawal._id} withdrawal={withdrawal} />
//                     ))
//                   ) : (
//                     <div className="px-6 py-12 text-center">
//                       <div className="text-6xl mb-4">🏦</div>
//                       <p className="text-gray-300 text-lg mb-2">No withdrawals yet</p>
//                       <p className="text-gray-400 text-sm mb-6">
//                         Request a withdrawal to see your payment history here!
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </GlassCard>
//             )}
//           </div>
//         </div>

//         {/* Quick Stats Footer */}
//         {stats && (
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-sm text-gray-300 mb-1">Available Balance</div>
//               <div className="text-xl font-bold text-white">${Number(user?.walletBalance?.$numberDecimal || 0).toFixed(2)}</div>
//             </GlassCard>
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-sm text-gray-300 mb-1">Total Earned</div>
//               <div className="text-xl font-bold text-green-300">${Number(stats?.totalEarnings || 0).toFixed(2)}</div>
//             </GlassCard>
//             <GlassCard className="p-4 bg-white/5">
//               <div className="text-sm text-gray-300 mb-1">Pending Withdrawals</div>
//               <div className="text-xl font-bold text-yellow-300">
//                 {withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length}
//               </div>
//             </GlassCard>
//           </div>
//         )}
//       </div>
//     </GradientBackground>
//   );
// };

// export default Wallet;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  XCircleIcon as XCircleSolidIcon
} from '@heroicons/react/24/solid';

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [linkingPaypal, setLinkingPaypal] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const { user, updateUserBalance, refreshUser } = useAuth();

  useEffect(() => {
    fetchWalletData();
    checkPaypalStatus();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, statsRes, withdrawalsRes] = await Promise.all([
        axios.get('/api/wallet'),
        axios.get('/api/wallet/stats'),
        axios.get('/api/withdrawals')
      ]);

      setWalletData(walletRes.data.data);
      setTransactions(walletRes.data.data.transactions || []);
      setWithdrawals(withdrawalsRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const checkPaypalStatus = async () => {
    try {
      const res = await axios.get('/api/withdrawals/paypal-status');
      setPaypalStatus(res.data.data);
      if (res.data.data.paypalEmail) {
        setPaypalEmail(res.data.data.paypalEmail);
      }
    } catch (error) {
      console.error('Error checking PayPal status:', error);
    }
  };

  const linkPaypalAccount = async () => {
    if (!paypalEmail) {
      toast.error('Please enter your PayPal email');
      return;
    }

    try {
      const res = await axios.post('/api/withdrawals/link-paypal', { paypalEmail });
      toast.success('PayPal account linked successfully!');
      setLinkingPaypal(false);
      await checkPaypalStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to link PayPal');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const minWithdrawal = 5.00;

    if (amount < minWithdrawal) {
      toast.error(`Minimum withdrawal amount is $${minWithdrawal}`);
      return;
    }

    if (amount > user.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    const hasPendingWithdrawal = withdrawals.some(w => 
      w.status === 'pending' || w.status === 'processing'
    );

    if (hasPendingWithdrawal) {
      toast.error('You already have a pending withdrawal request');
      return;
    }

    setWithdrawLoading(true);
    const withdrawToast = toast.loading('Processing withdrawal request...');

    try {
      const payload = {
        amount: amount,
        paymentMethod: 'paypal'
      };

      if (paypalEmail && !paypalStatus?.paypalLinked) {
        payload.paypalEmail = paypalEmail;
      }

      const res = await axios.post('/api/withdrawals', payload);

      updateUserBalance(res.data.data.newBalance);
      await refreshUser();
      
      if (res.data.data.isNewPaypalLinked) {
        toast.success(`Withdrawal processing! PayPal account ${paypalEmail} linked successfully. Funds will be sent within 2-3 business days.`, { 
          id: withdrawToast,
          duration: 6000
        });
      } else {
        toast.success(`Withdrawal processing! $${amount.toFixed(2)} sent to ${res.data.data.paypalEmail}. Funds will arrive within 2-3 business days.`, { 
          id: withdrawToast,
          duration: 6000
        });
      }
      
      setWithdrawAmount('');
      fetchWalletData();
      setActiveTab('withdrawals');
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.actionRequired && errorData.action === 'link_paypal') {
        toast.error('Please link your PayPal account first', { id: withdrawToast });
        setLinkingPaypal(true);
      } else {
        toast.error(errorData?.message || 'Withdrawal failed', { id: withdrawToast });
      }
    } finally {
      setWithdrawLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200'
    };

    const iconClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };

    return (
      <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-200 hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${iconClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const TransactionItem = ({ transaction }) => {
    const isCredit = transaction.type === 'credit';
    
    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all duration-150 border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isCredit ? (
              <ArrowDownTrayIcon className="w-5 h-5" />
            ) : (
              <ArrowUpTrayIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{new Date(transaction.createdAt).toLocaleDateString()}</span>
              {transaction.gig?.title && (
                <>
                  <span className="mx-2">•</span>
                  <span className="truncate">{transaction.gig.title}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right min-w-0 ml-4">
          <p className={`text-sm font-semibold truncate ${
            isCredit ? 'text-green-600' : 'text-red-600'
          }`}>
            {isCredit ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 truncate">
            Balance: ${Number(transaction.balanceAfter || 0).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  const WithdrawalStatus = ({ withdrawal }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 'completed':
          return {
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            icon: CheckCircleSolidIcon,
            label: 'Completed',
            message: 'Funds sent successfully'
          };
        case 'processing':
          return {
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            icon: ClockIcon,
            label: 'Processing',
            message: 'Being processed (2-3 business days)'
          };
        case 'failed':
          return {
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            icon: XCircleSolidIcon,
            label: 'Failed',
            message: 'Payment failed - funds returned to wallet'
          };
        default:
          return {
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            icon: ClockIcon,
            label: 'Pending',
            message: 'Awaiting processing'
          };
      }
    };

    const statusConfig = getStatusConfig(withdrawal.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all duration-150 border border-gray-100">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                Withdrawal #{(withdrawal._id).toString().slice(-8).toUpperCase()}
              </p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="mx-2">•</span>
              <span className="capitalize truncate">{withdrawal.paymentMethod}</span>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {statusConfig.message}
            </p>
            {withdrawal.failureReason && (
              <p className="text-xs text-red-600 mt-1 truncate">{withdrawal.failureReason}</p>
            )}
            {withdrawal.processedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Processed: {new Date(withdrawal.processedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="text-right min-w-0 ml-4">
          <p className="text-sm font-semibold text-gray-900 truncate">
           -${Number(withdrawal.amount).toFixed(2)}
          </p>
          <p className={`text-xs capitalize truncate ${statusConfig.color}`}>
            {withdrawal.status}
          </p>
          {withdrawal.payoutBatchId && (
            <p className="text-xs text-gray-500 truncate" title={withdrawal.payoutBatchId}>
              ID: {withdrawal.payoutBatchId.slice(0, 8)}...
            </p>
          )}
        </div>
      </div>
    );
  };

  const PendingWithdrawalWarning = () => {
    const pendingWithdrawal = withdrawals.find(w => 
      w.status === 'pending' || w.status === 'processing'
    );

    if (!pendingWithdrawal) return null;

    return (
      <div className="mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Withdrawal In Progress
              </p>
              <p className="text-xs text-yellow-700">
                You have a pending withdrawal of <strong>${Number(pendingWithdrawal.amount).toFixed(2)}</strong>. 
                {pendingWithdrawal.status === 'processing' 
                  ? ' It is currently being processed and should complete within 2-3 business days.'
                  : ' It is awaiting processing.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PayPalLinkingSection = () => {
    if (!linkingPaypal) return null;

    return (
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <CreditCardIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Link PayPal Account
              </p>
              <p className="text-xs text-blue-700 mb-3">
                Enter your PayPal email to receive withdrawals. This email must be registered with PayPal.
              </p>
              
              <div className="flex space-x-2 mb-3">
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your-email@paypal.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={linkPaypalAccount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Link
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setLinkingPaypal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setLinkingPaypal(false);
                    if (withdrawAmount) {
                      setTimeout(() => handleWithdraw(new Event('submit')), 500);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Link & Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PayPalStatusBadge = () => {
    if (!paypalStatus) return null;

    return (
      <div className="mb-4">
        <div className={`p-3 rounded-lg border ${
          paypalStatus.paypalLinked 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCardIcon className={`w-4 h-4 ${
                paypalStatus.paypalLinked ? 'text-green-600' : 'text-blue-600'
              } mr-2`} />
              <span className={`text-sm font-medium ${
                paypalStatus.paypalLinked ? 'text-green-800' : 'text-blue-800'
              }`}>
                PayPal: {paypalStatus.paypalLinked ? 'Linked' : 'Not Linked'}
              </span>
            </div>
            {paypalStatus.paypalLinked ? (
              <span className="text-xs text-green-700">
                {paypalStatus.paypalEmail}
              </span>
            ) : (
              <button
                onClick={() => setLinkingPaypal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Link Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet data...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPendingWithdrawal = withdrawals.some(w => 
    w.status === 'pending' || w.status === 'processing'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
            <p className="text-gray-600">Manage your earnings and withdrawals</p>
          </div>
          <Link
            to="/gigs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-4 lg:mt-0"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Start Earning
          </Link>
        </div>

        {/* PayPal Linking Section */}
        <PayPalLinkingSection />

        {/* Pending Withdrawal Warning */}
        <PendingWithdrawalWarning />

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CurrencyDollarIcon}
            title="Current Balance"
            value={
              showBalance 
                ? `$${Number(user?.walletBalance?.$numberDecimal ?? user?.walletBalance ?? 0).toFixed(2)}`
                : '••••'
            }
            color="green"
          />
          <StatCard
            icon={ChartBarIcon}
            title="Total Earnings"
            value={`$${Number(stats?.totalEarnings || 0).toFixed(2)}`}
            subtitle="All time"
            color="blue"
          />
          <StatCard
            icon={ArrowUpTrayIcon}
            title="Total Withdrawn"
            value={`$${Number(stats?.totalWithdrawn || 0).toFixed(2)}`}
            subtitle="Completed withdrawals"
            color="purple"
          />
          <StatCard
            icon={ClockIcon}
            title="Total Transactions"
            value={stats?.totalTransactions || 0}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-2">
                  <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
                </div>
                Withdraw Funds
              </h3>
              
              {/* PayPal Status */}
              <PayPalStatusBadge />

              {/* Balance Toggle */}
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Available Balance</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {showBalance ? `$${Number(user?.walletBalance?.$numberDecimal || 0).toFixed(2)}` : '••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showBalance ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      min="5"
                      step="0.01"
                      max={user?.walletBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="0.00"
                      disabled={hasPendingWithdrawal}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum: $5.00 • Available: ${Number(user?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>

                {/* PayPal Email Input (if not linked) */}
                {!paypalStatus?.paypalLinked && !linkingPaypal && (
                  <div className="mb-4">
                    <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email
                    </label>
                    <input
                      type="email"
                      id="paypalEmail"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="your-email@paypal.com"
                      disabled={hasPendingWithdrawal}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your PayPal email to receive funds
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) < 5 || hasPendingWithdrawal}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {withdrawLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : hasPendingWithdrawal ? (
                    'Withdrawal In Progress'
                  ) : (
                    'Request Withdrawal'
                  )}
                </button>
              </form>

              {/* Withdrawal Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Minimum withdrawal: $5.00
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Processing time: 2-3 business days
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Funds sent via PayPal to your email
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    One withdrawal at a time
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transaction & Withdrawal History */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'transactions' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'withdrawals' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Withdrawals ({withdrawals.length})
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'transactions' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-1 bg-orange-100 rounded-lg mr-2">
                      <ClockIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    Recent Transactions
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TransactionItem key={transaction._id} transaction={transaction} />
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">💸</div>
                      <p className="text-gray-600 text-lg mb-2">No transactions yet</p>
                      <p className="text-gray-500 text-sm mb-6">
                        Start sharing gigs to earn money and see your transactions here!
                      </p>
                      <Link
                        to="/gigs"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Browse Gigs
                      </Link>
                    </div>
                  )}
                </div>

                {transactions.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button 
                      onClick={() => toast.success('Showing all transactions would load more records here')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View All Transactions
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-1 bg-green-100 rounded-lg mr-2">
                      <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
                    </div>
                    Withdrawal History
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <WithdrawalStatus key={withdrawal._id} withdrawal={withdrawal} />
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">🏦</div>
                      <p className="text-gray-600 text-lg mb-2">No withdrawals yet</p>
                      <p className="text-gray-500 text-sm mb-6">
                        Request a withdrawal to see your payment history here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Footer */}
        {stats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Available Balance</div>
              <div className="text-xl font-bold text-gray-900">${Number(user?.walletBalance?.$numberDecimal || 0).toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Earned</div>
              <div className="text-xl font-bold text-green-600">${Number(stats?.totalEarnings || 0).toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Pending Withdrawals</div>
              <div className="text-xl font-bold text-yellow-600">
                {withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;