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
//   EyeSlashIcon
// } from '@heroicons/react/24/outline';

// const Wallet = () => {
//   const [walletData, setWalletData] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [withdrawLoading, setWithdrawLoading] = useState(false);
//   const [showBalance, setShowBalance] = useState(true);
//   const { user, updateUserBalance } = useAuth();

//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       const [walletRes, statsRes] = await Promise.all([
//         axios.get('/api/wallet'),
//         axios.get('/api/wallet/stats')
//       ]);

//       setWalletData(walletRes.data.data);
//       setTransactions(walletRes.data.data.transactions || []);
//       setStats(statsRes.data.data);
//     } catch (error) {
//       console.error('Error fetching wallet data:', error);
//       toast.error('Failed to load wallet data');
//     } finally {
//       setLoading(false);
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

//     setWithdrawLoading(true);
//     const withdrawToast = toast.loading('Processing withdrawal request...');

//     try {
//       const res = await axios.post('/api/wallet/withdraw', { amount });

//       // Update local user balance
//       updateUserBalance(res.data.newBalance);
      
//       toast.success('Withdrawal request submitted successfully!', { id: withdrawToast });
//       setWithdrawAmount('');
//       fetchWalletData(); // Refresh data
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Withdrawal failed';
//       toast.error(errorMessage, { id: withdrawToast });
//     } finally {
//       setWithdrawLoading(false);
//     }
//   };

//   const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//         </div>
//         <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100`}>
//           <Icon className={`w-6 h-6 text-${color}-600`} />
//         </div>
//       </div>
//       {trend && (
//         <div className="flex items-center mt-3">
//           <ArrowUpTrayIcon className="w-4 h-4 text-green-500 mr-1" />
//           <span className="text-sm text-green-600 font-medium">{trend}</span>
//         </div>
//       )}
//     </div>
//   );

//   const TransactionItem = ({ transaction }) => {
//     const isCredit = transaction.type === 'credit';
    
//     return (
//       <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
//         <div className="flex items-center space-x-4">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//             isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//           }`}>
//             {isCredit ? (
//               <ArrowDownTrayIcon className="w-5 h-5" />
//             ) : (
//               <ArrowUpTrayIcon className="w-5 h-5" />
//             )}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
//             <div className="flex items-center text-xs text-gray-500 mt-1">
//               <ClockIcon className="w-3 h-3 mr-1" />
//               <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
//               {transaction.gig?.title && (
//                 <>
//                   <span className="mx-2">•</span>
//                   <span>{transaction.gig.title}</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className={`text-sm font-semibold ${
//             isCredit ? 'text-green-600' : 'text-red-600'
//           }`}>
//             {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
//           </p>
//           <p className="text-xs text-gray-500">
//             Balance: ${transaction.balanceAfter.toFixed(2)}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-16">
//             <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading wallet data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
//             <p className="text-gray-600">Manage your earnings and withdrawals</p>
//           </div>
//           <Link
//             to="/gigs"
//             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 mt-4 lg:mt-0"
//           >
//             <PlusIcon className="w-5 h-5 mr-2" />
//             Start Earning
//           </Link>
//         </div>

//         {/* Wallet Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={CurrencyDollarIcon}
//             title="Current Balance"
//             value={
//               showBalance 
//                 ? `$${(user?.walletBalance || 0).toFixed(2)}`
//                 : '••••'
//             }
//             color="green"
//           />
//           <StatCard
//             icon={ChartBarIcon}
//             title="Total Earnings"
//             value={`$${(stats?.totalEarnings || 0).toFixed(2)}`}
//             subtitle="All time"
//             color="blue"
//           />
//           <StatCard
//             icon={ArrowUpTrayIcon}
//             title="This Month"
//             value={`$${(stats?.monthlyEarnings || 0).toFixed(2)}`}
//             trend="+12% from last month"
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
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <ArrowUpTrayIcon className="w-5 h-5 text-gray-400 mr-2" />
//                 Withdraw Funds
//               </h3>
              
//               {/* Balance Toggle */}
//               <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
//                 <span className="text-sm font-medium text-gray-700">Available Balance</span>
//                 <div className="flex items-center">
//                   <span className="text-lg font-bold text-gray-900 mr-2">
//                     {showBalance ? `$${(user?.walletBalance || 0).toFixed(2)}` : '••••'}
//                   </span>
//                   <button
//                     onClick={() => setShowBalance(!showBalance)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showBalance ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleWithdraw}>
//                 <div className="mb-4">
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
//                     Amount to Withdraw
//                   </label>
//                   <div className="relative rounded-lg shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500 sm:text-sm">$</span>
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
//                       className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
//                       placeholder="0.00"
//                     />
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500 sm:text-sm">USD</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Minimum: $5.00 • Available: ${(user?.walletBalance || 0).toFixed(2)}
//                   </p>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) < 5}
//                   className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
//                 >
//                   {withdrawLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     'Request Withdrawal'
//                   )}
//                 </button>
//               </form>

//               {/* Withdrawal Info */}
//               <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                     Minimum withdrawal: $5.00
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                     Processing time: 2-3 business days
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                     Funds sent to your registered payment method
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Transaction History */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                   <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
//                   Recent Transactions
//                 </h3>
//               </div>
              
//               <div className="divide-y divide-gray-100">
//                 {transactions.length > 0 ? (
//                   transactions.map((transaction) => (
//                     <TransactionItem key={transaction._id} transaction={transaction} />
//                   ))
//                 ) : (
//                   <div className="px-6 py-12 text-center">
//                     <div className="text-6xl mb-4">💸</div>
//                     <p className="text-gray-500 text-lg mb-2">No transactions yet</p>
//                     <p className="text-gray-400 text-sm mb-6">
//                       Start sharing gigs to earn money and see your transactions here!
//                     </p>
//                     <Link
//                       to="/gigs"
//                       className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
//                     >
//                       <PlusIcon className="w-5 h-5 mr-2" />
//                       Browse Gigs
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* View All Transactions */}
//               {transactions.length > 0 && (
//                 <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//                   <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
//                     View All Transactions
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
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
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const { user, updateUserBalance } = useAuth();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, statsRes] = await Promise.all([
        axios.get('/api/wallet'),
        axios.get('/api/wallet/stats')
      ]);

      setWalletData(walletRes.data.data);
      setTransactions(walletRes.data.data.transactions || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
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

    setWithdrawLoading(true);
    const withdrawToast = toast.loading('Processing withdrawal request...');

    try {
      const res = await axios.post('/api/wallet/withdraw', { amount });

      // Update local user balance
      updateUserBalance(res.data.newBalance);
      
      toast.success('Withdrawal request submitted successfully!', { id: withdrawToast });
      setWithdrawAmount('');
      fetchWalletData(); // Refresh data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Withdrawal failed';
      toast.error(errorMessage, { id: withdrawToast });
    } finally {
      setWithdrawLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => {
    const colorVariant = colorVariants[color];
    
    return (
      <GlassCard className="p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
          </div>
          <StatIconWrapper color={color}>
            <Icon className="w-6 h-6 text-white" />
          </StatIconWrapper>
        </div>
        {trend && (
          <div className="flex items-center mt-3">
            <ArrowUpTrayIcon className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-sm text-green-300 font-medium">{trend}</span>
          </div>
        )}
      </GlassCard>
    );
  };

  const TransactionItem = ({ transaction }) => {
    const isCredit = transaction.type === 'credit';
    
    return (
      <div className="flex items-center justify-between p-4 hover:bg-white/10 rounded-lg transition-all duration-150">
        <div className="flex items-center space-x-4">
          <StatIconWrapper color={isCredit ? 'green' : 'red'} className="!p-2">
            {isCredit ? (
              <ArrowDownTrayIcon className="w-5 h-5 text-white" />
            ) : (
              <ArrowUpTrayIcon className="w-5 h-5 text-white" />
            )}
          </StatIconWrapper>
          <div>
            <p className="text-sm font-medium text-white">{transaction.description}</p>
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
              {transaction.gig?.title && (
                <>
                  <span className="mx-2">•</span>
                  <span>{transaction.gig.title}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${
            isCredit ? 'text-green-300' : 'text-red-300'
          }`}>
            {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            Balance: ${transaction.balanceAfter.toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <GradientBackground className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">Loading wallet data...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
            <p className="text-gray-200">Manage your earnings and withdrawals</p>
          </div>
          <Link
            to="/gigs"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 mt-4 lg:mt-0 backdrop-blur-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Start Earning
          </Link>
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CurrencyDollarIcon}
            title="Current Balance"
            value={
              showBalance 
                ? `$${(user?.walletBalance || 0).toFixed(2)}`
                : '••••'
            }
            color="green"
          />
          <StatCard
            icon={ChartBarIcon}
            title="Total Earnings"
            value={`$${(stats?.totalEarnings || 0).toFixed(2)}`}
            subtitle="All time"
            color="blue"
          />
          <StatCard
            icon={ArrowUpTrayIcon}
            title="This Month"
            value={`$${(stats?.monthlyEarnings || 0).toFixed(2)}`}
            trend="+12% from last month"
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
            <GlassCard className="p-6 sticky top-8 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <StatIconWrapper color="green" className="!p-1 mr-2">
                  <ArrowUpTrayIcon className="w-5 h-5 text-white" />
                </StatIconWrapper>
                Withdraw Funds
              </h3>
              
              {/* Balance Toggle */}
              <div className="flex items-center justify-between mb-6 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-200">Available Balance</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-white mr-2">
                    {showBalance ? `$${(user?.walletBalance || 0).toFixed(2)}` : '••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showBalance ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">$</span>
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
                      className="block w-full pl-7 pr-12 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">USD</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Minimum: $5.00 • Available: ${(user?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) < 5}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                >
                  {withdrawLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Request Withdrawal'
                  )}
                </button>
              </form>

              {/* Withdrawal Info */}
              <div className="mt-6 p-4 bg-blue-400/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-blue-300 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Minimum withdrawal: $5.00
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Processing time: 2-3 business days
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Funds sent to your registered payment method
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <StatIconWrapper color="orange" className="!p-1 mr-2">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </StatIconWrapper>
                  Recent Transactions
                </h3>
              </div>
              
              <div className="divide-y divide-white/10">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TransactionItem key={transaction._id} transaction={transaction} />
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">💸</div>
                    <p className="text-gray-300 text-lg mb-2">No transactions yet</p>
                    <p className="text-gray-400 text-sm mb-6">
                      Start sharing gigs to earn money and see your transactions here!
                    </p>
                    <Link
                      to="/gigs"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Browse Gigs
                    </Link>
                  </div>
                )}
              </div>

              {/* View All Transactions */}
              {transactions.length > 0 && (
                <div className="px-6 py-4 border-t border-white/20 bg-white/10 backdrop-blur-sm">
                  <button className="w-full text-center text-sm text-primary-300 hover:text-primary-200 font-medium transition-colors">
                    View All Transactions
                  </button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Wallet;