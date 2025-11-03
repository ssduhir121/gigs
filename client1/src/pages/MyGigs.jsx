// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   CurrencyDollarIcon,
//   UserIcon,
//   ShareIcon,
//   ClockIcon,
//   ChartBarIcon,
//   EyeIcon,
//   FireIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';

// const MyGigs = () => {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchMyGigs();
//   }, []);

//   const fetchMyGigs = async () => {
//     try {
//       const res = await axios.get('/api/gigs/my-gigs');
//       setGigs(res.data.data || []);
//       setError('');
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to load your gigs';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchMyGigs();
//   };

//   const GigCard = ({ gig }) => {
//     const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
//     const amountPerShare = gig.budget / gig.sharesRequired;
//     const daysAgo = Math.floor((new Date() - new Date(gig.createdAt)) / (1000 * 60 * 60 * 24));

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h3>
//               <div className="flex items-center text-sm text-gray-500 mb-3">
//                 <ClockIcon className="w-4 h-4 mr-1" />
//                 <span>Created {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`}</span>
//               </div>
//             </div>
//             <div className="flex flex-col items-end space-y-2">
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                 gig.isActive 
//                   ? 'bg-green-100 text-green-800 border border-green-200'
//                   : 'bg-gray-100 text-gray-800 border border-gray-200'
//               }`}>
//                 {gig.isActive ? 'Active' : 'Completed'}
//               </span>
//               {gig.isActive && (
//                 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
//                   {gig.sharesRequired - gig.sharesCompleted} left
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig.description}</p>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center text-sm">
//               <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
//               <div>
//                 <div className="font-semibold text-gray-900">${gig.budget}</div>
//                 <div className="text-gray-500 text-xs">Total Budget</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <ShareIcon className="w-4 h-4 mr-2 text-blue-500" />
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   {gig.sharesCompleted}/{gig.sharesRequired}
//                 </div>
//                 <div className="text-gray-500 text-xs">Shares</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <FireIcon className="w-4 h-4 mr-2 text-orange-500" />
//               <div>
//                 <div className="font-semibold text-gray-900">${amountPerShare.toFixed(2)}</div>
//                 <div className="text-gray-500 text-xs">Per Share</div>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <ChartBarIcon className="w-4 h-4 mr-2 text-purple-500" />
//               <div>
//                 <div className="font-semibold text-gray-900">{progressPercentage.toFixed(0)}%</div>
//                 <div className="text-gray-500 text-xs">Progress</div>
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Completion</span>
//               <span>{progressPercentage.toFixed(1)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full transition-all duration-500 ${
//                   progressPercentage === 100 
//                     ? 'bg-green-500' 
//                     : 'bg-gradient-to-r from-blue-400 to-blue-500'
//                 }`}
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Link and CTA */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1 mr-4">
//               <a
//                 href={gig.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-700 text-sm truncate block"
//                 title={gig.link}
//               >
//                 {gig.link}
//               </a>
//             </div>
//             <Link
//               to={`/gigs/${gig._id}`}
//               className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
//             >
//               <EyeIcon className="w-4 h-4 mr-2" />
//               View
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading your gigs...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && gigs.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">😕</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Gigs</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <button 
//                 onClick={fetchMyGigs}
//                 className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 <ArrowPathIcon className="w-5 h-5 mr-2" />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
//             <p className="text-gray-600">Manage and track your created gigs</p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//             >
//               <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <Link
//               to="/create-gig"
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <PlusIcon className="w-5 h-5 mr-2" />
//               Create New Gig
//             </Link>
//           </div>
//         </div>

//         {/* Stats Summary */}
//         {gigs.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
//               <div className="text-2xl font-bold text-blue-600">{gigs.length}</div>
//               <div className="text-sm text-blue-700">Total Gigs</div>
//             </div>
//             <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
//               <div className="text-2xl font-bold text-green-600">
//                 {gigs.filter(g => g.isActive).length}
//               </div>
//               <div className="text-sm text-green-700">Active Gigs</div>
//             </div>
//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
//               <div className="text-2xl font-bold text-purple-600">
//                 ${gigs.reduce((sum, gig) => sum + gig.budget, 0).toFixed(0)}
//               </div>
//               <div className="text-sm text-purple-700">Total Budget</div>
//             </div>
//             <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
//               <div className="text-2xl font-bold text-orange-600">
//                 {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
//               </div>
//               <div className="text-sm text-orange-700">Shares Completed</div>
//             </div>
//           </div>
//         )}

//         {/* Gig Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {gigs.map((gig) => (
//             <GigCard key={gig._id} gig={gig} />
//           ))}
//         </div>

//         {/* Empty State */}
//         {gigs.length === 0 && !error && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">🚀</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gigs Yet</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 You haven't created any gigs yet. Start promoting your content and reach more people by creating your first gig.
//               </p>
//               <Link
//                 to="/create-gig"
//                 className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 <PlusIcon className="w-5 h-5 mr-2" />
//                 Create Your First Gig
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyGigs;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  FireIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const res = await axios.get('/api/gigs/my-gigs');
      setGigs(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load your gigs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyGigs();
  };

  const GigCard = ({ gig }) => {
    const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
    const amountPerShare = gig.budget / gig.sharesRequired;
    const daysAgo = Math.floor((new Date() - new Date(gig.createdAt)) / (1000 * 60 * 60 * 24));

    return (
      <GlassCard className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{gig.title}</h3>
              <div className="flex items-center text-sm text-gray-300 mb-3">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>Created {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge color={gig.isActive ? 'green' : 'gray'}>
                {gig.isActive ? 'Active' : 'Completed'}
              </StatusBadge>
              {gig.isActive && (
                <StatusBadge color="blue">
                  {gig.sharesRequired - gig.sharesCompleted} left
                </StatusBadge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{gig.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <StatIconWrapper color="green" className="!p-1 mr-2">
                <CurrencyDollarIcon className="w-4 h-4 text-white" />
              </StatIconWrapper>
              <div>
                <div className="font-semibold text-white">${gig.budget}</div>
                <div className="text-gray-400 text-xs">Total Budget</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <StatIconWrapper color="blue" className="!p-1 mr-2">
                <ShareIcon className="w-4 h-4 text-white" />
              </StatIconWrapper>
              <div>
                <div className="font-semibold text-white">
                  {gig.sharesCompleted}/{gig.sharesRequired}
                </div>
                <div className="text-gray-400 text-xs">Shares</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <StatIconWrapper color="orange" className="!p-1 mr-2">
                <FireIcon className="w-4 h-4 text-white" />
              </StatIconWrapper>
              <div>
                <div className="font-semibold text-white">${amountPerShare.toFixed(2)}</div>
                <div className="text-gray-400 text-xs">Per Share</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <StatIconWrapper color="purple" className="!p-1 mr-2">
                <ChartBarIcon className="w-4 h-4 text-white" />
              </StatIconWrapper>
              <div>
                <div className="font-semibold text-white">{progressPercentage.toFixed(0)}%</div>
                <div className="text-gray-400 text-xs">Progress</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Completion</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
              <div 
                className={`h-2 rounded-full transition-all duration-500 backdrop-blur-sm ${
                  progressPercentage === 100 
                    ? 'bg-green-500' 
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Link and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <a
                href={gig.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 text-sm truncate block transition-colors"
                title={gig.link}
              >
                {gig.link}
              </a>
            </div>
            <Link
              to={`/gigs/${gig._id}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View
            </Link>
          </div>
        </div>
      </GlassCard>
    );
  };

  if (loading) {
    return (
      <GradientBackground className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">Loading your gigs...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  if (error && gigs.length === 0) {
    return (
      <GradientBackground className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <GlassCard className="p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-bold text-white mb-2">Unable to Load Gigs</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <button 
                onClick={fetchMyGigs}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </GlassCard>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">My Gigs</h1>
            <p className="text-gray-200">Manage and track your created gigs</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/create-gig"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Gig
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        {gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-blue-400/30">
              <div className="text-2xl font-bold text-blue-300">{gigs.length}</div>
              <div className="text-sm text-blue-200">Total Gigs</div>
            </GlassCard>
            <GlassCard className="p-6 bg-gradient-to-br from-green-400/20 to-green-600/20 border-green-400/30">
              <div className="text-2xl font-bold text-green-300">
                {gigs.filter(g => g.isActive).length}
              </div>
              <div className="text-sm text-green-200">Active Gigs</div>
            </GlassCard>
            <GlassCard className="p-6 bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-purple-400/30">
              <div className="text-2xl font-bold text-purple-300">
                ${gigs.reduce((sum, gig) => sum + gig.budget, 0).toFixed(0)}
              </div>
              <div className="text-sm text-purple-200">Total Budget</div>
            </GlassCard>
            <GlassCard className="p-6 bg-gradient-to-br from-orange-400/20 to-orange-600/20 border-orange-400/30">
              <div className="text-2xl font-bold text-orange-300">
                {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
              </div>
              <div className="text-sm text-orange-200">Shares Completed</div>
            </GlassCard>
          </div>
        )}

        {/* Gig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        {/* Empty State */}
        {gigs.length === 0 && !error && (
          <div className="text-center py-16">
            <GlassCard className="p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Gigs Yet</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                You haven't created any gigs yet. Start promoting your content and reach more people by creating your first gig.
              </p>
              <Link
                to="/create-gig"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Gig
              </Link>
            </GlassCard>
          </div>
        )}
      </div>
    </GradientBackground>
  );
};

export default MyGigs;