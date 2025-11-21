// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   CurrencyDollarIcon,
//   UserIcon,
//   ShareIcon,
//   ClockIcon,
//   FireIcon
// } from '@heroicons/react/24/outline';

// const GigList = () => {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState(true);

//   useEffect(() => {
//     fetchGigs();
//   }, []);

//   const fetchGigs = async () => {
//     try {
//       const res = await axios.get('/api/gigs');
//       setGigs(res.data.data);
//     } catch (error) {
//       console.error('Error fetching gigs:', error);
//       toast.error('Failed to load gigs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredGigs = gigs.filter(gig => {
//     const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterActive ? gig.isActive : true;
//     return matchesSearch && matchesFilter;
//   });

//   const GigCard = ({ gig }) => {
//     const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
//     const amountPerShare = gig.budget / gig.sharesRequired;

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h3>
//               <p className="text-gray-600 text-sm line-clamp-2 mb-3">{gig.description}</p>
//             </div>
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//               gig.isActive 
//                 ? 'bg-green-100 text-green-800 border border-green-200'
//                 : 'bg-gray-100 text-gray-800 border border-gray-200'
//             }`}>
//               {gig.isActive ? 'Active' : 'Completed'}
//             </span>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center text-sm text-gray-600">
//               <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
//               <span>${gig.budget}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <ShareIcon className="w-4 h-4 mr-2 text-blue-500" />
//               <span>{gig.sharesCompleted}/{gig.sharesRequired}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <UserIcon className="w-4 h-4 mr-2 text-purple-500" />
//               <span className="truncate">{gig.user?.name}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <ClockIcon className="w-4 h-4 mr-2 text-orange-500" />
//               <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Progress</span>
//               <span>{progressPercentage.toFixed(0)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Earnings and CTA */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FireIcon className="w-4 h-4 text-orange-500 mr-1" />
//               <span className="text-sm font-semibold text-gray-900">
//                 ${amountPerShare.toFixed(2)}/share
//               </span>
//             </div>
//             <Link
//               to={`/gigs/${gig._id}`}
//               className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
//             >
//               View Details
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
//             <p className="text-gray-600">Loading available gigs...</p>
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
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Gigs</h1>
//             <p className="text-gray-600">Find gigs to share and start earning money</p>
//           </div>
//           <Link
//             to="/create-gig"
//             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <PlusIcon className="w-5 h-5 mr-2" />
//             Create New Gig
//           </Link>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               {/* <div className="relative">
//                 <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <input
//                   type="text"
//                   placeholder="Search gigs by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div> */}
//             </div>
            
//             {/* Filter */}
//             {/* <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setFilterActive(!filterActive)}
//                 className={`inline-flex items-center px-4 py-3 rounded-lg border transition-all duration-200 ${
//                   filterActive
//                     ? 'bg-primary-50 border-primary-200 text-primary-700'
//                     : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FunnelIcon className="w-4 h-4 mr-2" />
//                 {filterActive ? 'Active Only' : 'Show All'}
//               </button>
              
//               <div className="text-sm text-gray-600">
//                 {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Gig Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredGigs.map((gig) => (
//             <GigCard key={gig._id} gig={gig} />
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredGigs.length === 0 && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 {searchTerm ? 'No matching gigs found' : 'No gigs available'}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {searchTerm 
//                   ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
//                   : 'There are no gigs available at the moment. Check back later or create your own gig to get started.'
//                 }
//               </p>
//               {!searchTerm && (
//                 <Link
//                   to="/create-gig"
//                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
//                 >
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Create Your First Gig
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Quick Stats */}
//         {filteredGigs.length > 0 && (
//           <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//               <div>
//                 <div className="text-2xl font-bold text-primary-600">{gigs.length}</div>
//                 <div className="text-sm text-primary-700">Total Gigs</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-green-600">
//                   {gigs.filter(g => g.isActive).length}
//                 </div>
//                 <div className="text-sm text-green-700">Active Gigs</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-purple-600">
//                   ${gigs.reduce((sum, gig) => sum + gig.budget, 0).toFixed(0)}
//                 </div>
//                 <div className="text-sm text-purple-700">Total Budget</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-orange-600">
//                   {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
//                 </div>
//                 <div className="text-sm text-orange-700">Shares Completed</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GigList;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get('/api/gigs');
      setGigs(res.data.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive ? gig.isActive : true;
    return matchesSearch && matchesFilter;
  });

  const GigCard = ({ gig }) => {
    const progressPercentage = (gig.sharesCompleted / gig.sharesRequired) * 100;
    const amountPerShare = gig.budget / gig.sharesRequired;

    return (
      <GlassCard className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{gig.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">{gig.description}</p>
            </div>
            <StatusBadge color={gig.isActive ? 'green' : 'gray'}>
              {gig.isActive ? 'Active' : 'Completed'}
            </StatusBadge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-300">
              <StatIconWrapper color="green" className="!p-1 mr-2">
                <CurrencyDollarIcon className="w-3 h-3 text-white" />
              </StatIconWrapper>
              <span>${gig.budget}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <StatIconWrapper color="blue" className="!p-1 mr-2">
                <ShareIcon className="w-3 h-3 text-white" />
              </StatIconWrapper>
              <span>{gig.sharesCompleted}/{gig.sharesRequired}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <StatIconWrapper color="purple" className="!p-1 mr-2">
                <UserIcon className="w-3 h-3 text-white" />
              </StatIconWrapper>
              <span className="truncate">{gig.user?.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <StatIconWrapper color="orange" className="!p-1 mr-2">
                <ClockIcon className="w-3 h-3 text-white" />
              </StatIconWrapper>
              <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 backdrop-blur-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Earnings and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StatIconWrapper color="orange" className="!p-1 mr-2">
                <FireIcon className="w-3 h-3 text-white" />
              </StatIconWrapper>
              <span className="text-sm font-semibold text-white">
                ${amountPerShare.toFixed(2)}/share
              </span>
            </div>
            <Link
              to={`/gigs/${gig._id}`}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
            >
              View Details
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
            <p className="text-white/80">Loading available gigs...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">Available Gigs</h1>
            <p className="text-gray-200">Find gigs to share and start earning money</p>
          </div>
          <Link
            to="/create-gig"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Gig
          </Link>
        </div>

        {/* Search and Filter */}
        {/* <GlassCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
          
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gigs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFilterActive(!filterActive)}
                className={`inline-flex items-center px-4 py-3 rounded-lg border transition-all duration-200 backdrop-blur-sm ${
                  filterActive
                    ? 'bg-primary-400/20 border-primary-400/30 text-primary-300'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                {filterActive ? 'Active Only' : 'Show All'}
              </button>
              
              <div className="text-sm text-gray-300">
                {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
              </div>
            </div>
          </div>
        </GlassCard> */}

        {/* Gig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        {/* Empty State */}
        {filteredGigs.length === 0 && (
          <div className="text-center py-16">
            <GlassCard className="p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm ? 'No matching gigs found' : 'No gigs available'}
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'There are no gigs available at the moment. Check back later or create your own gig to get started.'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/create-gig"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Gig
                </Link>
              )}
            </GlassCard>
          </div>
        )}

        {/* Quick Stats */}
        {filteredGigs.length > 0 && (
          <GlassCard className="p-6 bg-gradient-to-r from-primary-400/20 to-blue-400/20 border-primary-400/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-300">{gigs.length}</div>
                <div className="text-sm text-primary-200">Total Gigs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {gigs.filter(g => g.isActive).length}
                </div>
                <div className="text-sm text-green-200">Active Gigs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-300">
                  ${gigs.reduce((sum, gig) => sum + gig.budget, 0).toFixed(0)}
                </div>
                <div className="text-sm text-purple-200">Total Budget</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-300">
                  {gigs.reduce((sum, gig) => sum + gig.sharesCompleted, 0)}
                </div>
                <div className="text-sm text-orange-200">Shares Completed</div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </GradientBackground>
  );
};

export default GigList;