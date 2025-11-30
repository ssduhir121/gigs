// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';
// import {
//   EyeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   UserIcon,
//   CurrencyDollarIcon,
//   ShareIcon,
//   PhotoIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   DocumentCheckIcon,
//   DocumentMagnifyingGlassIcon
// } from '@heroicons/react/24/outline';
// import { GradientBackground, GlassCard, StatusBadge } from '../components/common/StyledComponents';

// const VerifySubmissions = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const { user } = useAuth();

//   const filters = [
//     { id: 'all', name: 'All Submissions', icon: DocumentMagnifyingGlassIcon, count: 0 },
//     { id: 'submitted', name: 'Pending Review', icon: ClockIcon, count: 0 },
//     { id: 'approved', name: 'Verified', icon: CheckCircleIcon, count: 0 },
//     { id: 'rejected', name: 'Rejected', icon: XCircleIcon, count: 0 }
//   ];

//   useEffect(() => {
//     fetchSubmissions();
//   }, []);

//   useEffect(() => {
//     // Filter submissions based on active filter
//     if (activeFilter === 'all') {
//       setFilteredSubmissions(submissions);
//     } else {
//       setFilteredSubmissions(
//         submissions.filter(sub => sub.submissionStatus === activeFilter)
//       );
//     }

//     // Update counts
//     const updatedFilters = filters.map(filter => ({
//       ...filter,
//       count: filter.id === 'all' 
//         ? submissions.length 
//         : submissions.filter(sub => sub.submissionStatus === filter.id).length
//     }));
//     setFilters(updatedFilters);
//   }, [submissions, activeFilter]);

//   const [filterItems, setFilters] = useState(filters);

//   const fetchSubmissions = async () => {
//     try {
//       const res = await axios.get('/api/gigs/my-gigs');
//       const myGigs = res.data.data;
      
//       // Get submissions for all gigs
//       const allSubmissions = [];
//       for (const gig of myGigs) {
//         try {
//           const submissionsRes = await axios.get(`/api/submission/gigs/${gig._id}/submissions`);
//           const gigSubmissions = submissionsRes.data.data.map(submission => ({
//             ...submission,
//             gig: gig
//           }));
//           allSubmissions.push(...gigSubmissions);
//         } catch (error) {
//           console.error(`Error fetching submissions for gig ${gig._id}:`, error);
//         }
//       }
      
//       setSubmissions(allSubmissions);
//     } catch (error) {
//       console.error('Error fetching submissions:', error);
//       toast.error('Failed to load submissions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (shareId) => {
//     setProcessing(shareId);
//     try {
//       await axios.post(`/api/submission/shares/${shareId}/approve`, {
//         notes: 'Submission approved'
//       });
//       toast.success('Submission approved and payment processed!');
//       fetchSubmissions();
//     } catch (error) {
//       console.error('Error approving submission:', error);
//       toast.error(error.response?.data?.message || 'Error approving submission');
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const handleReject = async (shareId) => {
//     const reason = prompt('Please provide a reason for rejection:');
//     if (!reason) return;

//     setProcessing(shareId);
//     try {
//       await axios.post(`/api/submission/shares/${shareId}/reject`, {
//         reason: reason
//       });
//       toast.success('Submission rejected');
//       fetchSubmissions();
//     } catch (error) {
//       console.error('Error rejecting submission:', error);
//       toast.error(error.response?.data?.message || 'Error rejecting submission');
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const toggleExpand = (submissionId) => {
//     setExpandedId(expandedId === submissionId ? null : submissionId);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'submitted': return 'yellow';
//       case 'approved': return 'green';
//       case 'rejected': return 'red';
//       default: return 'gray';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'submitted': return <ClockIcon className="w-4 h-4" />;
//       case 'approved': return <CheckCircleIcon className="w-4 h-4" />;
//       case 'rejected': return <XCircleIcon className="w-4 h-4" />;
//       default: return <ClockIcon className="w-4 h-4" />;
//     }
//   };

//   if (loading) {
//     return (
//       <GradientBackground className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white/80">Loading submissions...</p>
//         </div>
//       </GradientBackground>
//     );
//   }

//   return (
//     <GradientBackground className="min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Verify Submissions</h1>
//           <p className="text-gray-200">Review and approve proof of sharing for your gigs</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Sidebar */}
//           <div className="lg:w-64 flex-shrink-0">
//             <GlassCard className="p-4">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 <DocumentCheckIcon className="w-5 h-5 mr-2" />
//                 Filters
//               </h3>
//               <nav className="space-y-2">
//                 {filterItems.map((filter) => {
//                   const Icon = filter.icon;
//                   return (
//                     <button
//                       key={filter.id}
//                       onClick={() => setActiveFilter(filter.id)}
//                       className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
//                         activeFilter === filter.id
//                           ? 'bg-primary-500 text-white'
//                           : 'text-gray-300 hover:bg-white/10 hover:text-white'
//                       }`}
//                     >
//                       <div className="flex items-center">
//                         <Icon className="w-4 h-4 mr-3" />
//                         <span className="text-sm font-medium">{filter.name}</span>
//                       </div>
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         activeFilter === filter.id
//                           ? 'bg-white/20 text-white'
//                           : 'bg-gray-600 text-gray-300'
//                       }`}>
//                         {filter.count}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </nav>

//               {/* Stats Summary */}
//               <div className="mt-6 pt-4 border-t border-white/20">
//                 <h4 className="text-sm font-medium text-gray-200 mb-3">Quick Stats</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-300">Pending:</span>
//                     <span className="text-yellow-400 font-medium">
//                       {filterItems.find(f => f.id === 'submitted')?.count || 0}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-300">Verified:</span>
//                     <span className="text-green-400 font-medium">
//                       {filterItems.find(f => f.id === 'approved')?.count || 0}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-300">Rejected:</span>
//                     <span className="text-red-400 font-medium">
//                       {filterItems.find(f => f.id === 'rejected')?.count || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <Link
//                 to="/my-gigs"
//                 className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-sm"
//               >
//                 View My Gigs
//               </Link>
//             </GlassCard>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {submissions.length === 0 ? (
//               <GlassCard className="text-center p-12">
//                 <div className="text-6xl mb-4">📸</div>
//                 <h3 className="text-xl font-semibold text-white mb-2">No Submissions Yet</h3>
//                 <p className="text-gray-300 mb-4">
//                   When users submit proof for your gigs, they will appear here for review.
//                 </p>
//                 <Link
//                   to="/my-gigs"
//                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
//                 >
//                   View My Gigs
//                 </Link>
//               </GlassCard>
//             ) : filteredSubmissions.length === 0 ? (
//               <GlassCard className="text-center p-12">
//                 <div className="text-6xl mb-4">
//                   {activeFilter === 'submitted' && '⏳'}
//                   {activeFilter === 'approved' && '✅'}
//                   {activeFilter === 'rejected' && '❌'}
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   No {activeFilter !== 'all' ? filterItems.find(f => f.id === activeFilter)?.name : 'Submissions'}
//                 </h3>
//                 <p className="text-gray-300">
//                   {activeFilter === 'submitted' && 'All submissions have been reviewed!'}
//                   {activeFilter === 'approved' && 'No verified submissions yet.'}
//                   {activeFilter === 'rejected' && 'No rejected submissions.'}
//                   {activeFilter === 'all' && 'No submissions found.'}
//                 </p>
//               </GlassCard>
//             ) : (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-semibold text-white">
//                     {activeFilter === 'all' ? 'All Submissions' : filterItems.find(f => f.id === activeFilter)?.name}
//                     <span className="text-gray-300 text-sm font-normal ml-2">
//                       ({filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'item' : 'items'})
//                     </span>
//                   </h2>
//                 </div>

//                 {filteredSubmissions.map((submission) => (
//                   <GlassCard key={submission._id} className="p-4">
//                     {/* Compact Row View */}
//                     <div className="flex items-center justify-between">
//                       {/* Left Side - Basic Info */}
//                       <div className="flex items-center space-x-4 flex-1">
//                         <div className="flex-shrink-0">
//                           <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
//                             <UserIcon className="w-5 h-5 text-white" />
//                           </div>
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-lg font-semibold text-white truncate">
//                             {submission.gig.title}
//                           </h3>
//                           <div className="flex items-center text-gray-300 text-sm">
//                             <UserIcon className="w-3 h-3 mr-1" />
//                             <span className="truncate">{submission.user?.name}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Center - Stats */}
//                       <div className="hidden md:flex items-center space-x-6">
//                         <div className="text-center">
//                           <div className="text-sm font-bold text-white">{submission.totalClicks || 0}</div>
//                           <div className="text-xs text-gray-300">Total Clicks</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-sm font-bold text-green-400">{submission.uniqueClicks || 0}</div>
//                           <div className="text-xs text-gray-300">Unique</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-sm font-bold text-yellow-400">
//                             ${((submission.gig.availableFunds / submission.gig.sharesRequired) || 0).toFixed(2)}
//                           </div>
//                           <div className="text-xs text-gray-300">Amount</div>
//                         </div>
//                       </div>

//                       {/* Right Side - Status & Actions */}
//                       <div className="flex items-center space-x-4">
//                         <StatusBadge color={getStatusColor(submission.submissionStatus)}>
//                           <div className="flex items-center">
//                             {getStatusIcon(submission.submissionStatus)}
//                             <span className="ml-1 text-xs capitalize">{submission.submissionStatus}</span>
//                           </div>
//                         </StatusBadge>

//                         {/* Action Buttons for Submitted Status */}
//                         {submission.submissionStatus === 'submitted' && (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleApprove(submission._id)}
//                               disabled={processing === submission._id}
//                               className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
//                               title="Approve & Pay"
//                             >
//                               {processing === submission._id ? (
//                                 <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               ) : (
//                                 <CheckCircleIcon className="w-4 h-4" />
//                               )}
//                             </button>
//                             <button
//                               onClick={() => handleReject(submission._id)}
//                               disabled={processing === submission._id}
//                               className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-200"
//                               title="Reject"
//                             >
//                               <XCircleIcon className="w-4 h-4" />
//                             </button>
//                           </div>
//                         )}

//                         {/* Expand Button */}
//                         <button
//                           onClick={() => toggleExpand(submission._id)}
//                           className="flex items-center justify-center w-8 h-8 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
//                         >
//                           {expandedId === submission._id ? (
//                             <ChevronUpIcon className="w-4 h-4" />
//                           ) : (
//                             <ChevronDownIcon className="w-4 h-4" />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Expanded Details */}
//                     {expandedId === submission._id && (
//                       <div className="mt-4 pt-4 border-t border-white/20">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                           {/* Proof Images */}
//                           {submission.submissionProof && submission.submissionProof.length > 0 && (
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
//                                 <PhotoIcon className="w-4 h-4 mr-2" />
//                                 Submitted Proof:
//                               </h4>
//                               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                 {submission.submissionProof.map((proof, index) => (
//                                   <div key={index} className="relative group">
//                                     <img
//                                       src={proof.imageUrl}
//                                       alt={`Proof ${index + 1}`}
//                                       className="w-full h-20 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
//                                       onClick={() => window.open(proof.imageUrl, '_blank')}
//                                     />
//                                     <button
//                                       onClick={() => window.open(proof.imageUrl, '_blank')}
//                                       className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
//                                     >
//                                       <EyeIcon className="w-5 h-5 text-white" />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                               {submission.submissionProof[0]?.description && (
//                                 <p className="text-sm text-gray-300 mt-2">
//                                   <strong>Notes:</strong> {submission.submissionProof[0].description}
//                                 </p>
//                               )}
//                             </div>
//                           )}

//                           {/* Additional Info & Actions */}
//                           <div className="space-y-4">
//                             {/* Mobile Stats */}
//                             <div className="md:hidden grid grid-cols-3 gap-3">
//                               <div className="text-center p-2 bg-white/10 rounded-lg">
//                                 <div className="text-sm font-bold text-white">{submission.totalClicks || 0}</div>
//                                 <div className="text-xs text-gray-300">Total Clicks</div>
//                               </div>
//                               <div className="text-center p-2 bg-white/10 rounded-lg">
//                                 <div className="text-sm font-bold text-green-400">{submission.uniqueClicks || 0}</div>
//                                 <div className="text-xs text-gray-300">Unique Clicks</div>
//                               </div>
//                               <div className="text-center p-2 bg-white/10 rounded-lg">
//                                 <div className="text-sm font-bold text-yellow-400">
//                                   ${((submission.gig.availableFunds / submission.gig.sharesRequired) || 0).toFixed(2)}
//                                 </div>
//                                 <div className="text-xs text-gray-300">Amount</div>
//                               </div>
//                             </div>

//                             {/* Approval/Rejection Info */}
//                             {submission.submissionStatus === 'approved' && submission.submissionProof?.[0]?.verifiedAt && (
//                               <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-3">
//                                 <p className="text-sm text-green-300 font-medium">Approved</p>
//                                 <p className="text-xs text-green-200">
//                                   {new Date(submission.submissionProof[0].verifiedAt).toLocaleDateString()}
//                                 </p>
//                                 {submission.submissionProof[0].verificationNotes && (
//                                   <p className="text-xs text-green-200 mt-1">
//                                     {submission.submissionProof[0].verificationNotes}
//                                   </p>
//                                 )}
//                               </div>
//                             )}

//                             {submission.submissionStatus === 'rejected' && submission.submissionProof?.[0]?.verificationNotes && (
//                               <div className="bg-red-400/20 border border-red-400/30 rounded-lg p-3">
//                                 <p className="text-sm text-red-300 font-medium">Rejected</p>
//                                 <p className="text-xs text-red-200">
//                                   Reason: {submission.submissionProof[0].verificationNotes}
//                                 </p>
//                               </div>
//                             )}

//                             {/* Expanded Action Buttons for Mobile */}
//                             {submission.submissionStatus === 'submitted' && (
//                               <div className="flex space-x-3 md:hidden">
//                                 <button
//                                   onClick={() => handleApprove(submission._id)}
//                                   disabled={processing === submission._id}
//                                   className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
//                                 >
//                                   {processing === submission._id ? (
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                                   ) : (
//                                     <CheckCircleIcon className="w-4 h-4 mr-2" />
//                                   )}
//                                   Approve & Pay
//                                 </button>
//                                 <button
//                                   onClick={() => handleReject(submission._id)}
//                                   disabled={processing === submission._id}
//                                   className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-200"
//                                 >
//                                   <XCircleIcon className="w-4 h-4 mr-2" />
//                                   Reject
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </GlassCard>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </GradientBackground>
//   );
// };

// export default VerifySubmissions;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShareIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentCheckIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const VerifySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  const filters = [
    { id: 'all', name: 'All Submissions', icon: DocumentMagnifyingGlassIcon, count: 0 },
    { id: 'submitted', name: 'Pending Review', icon: ClockIcon, count: 0 },
    { id: 'approved', name: 'Verified', icon: CheckCircleIcon, count: 0 },
    { id: 'rejected', name: 'Rejected', icon: XCircleIcon, count: 0 }
  ];

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(
        submissions.filter(sub => sub.submissionStatus === activeFilter)
      );
    }

    const updatedFilters = filters.map(filter => ({
      ...filter,
      count: filter.id === 'all' 
        ? submissions.length 
        : submissions.filter(sub => sub.submissionStatus === filter.id).length
    }));
    setFilters(updatedFilters);
  }, [submissions, activeFilter]);

  const [filterItems, setFilters] = useState(filters);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('/api/gigs/my-gigs');
      const myGigs = res.data.data;
      
      const allSubmissions = [];
      for (const gig of myGigs) {
        try {
          const submissionsRes = await axios.get(`/api/submission/gigs/${gig._id}/submissions`);
          const gigSubmissions = submissionsRes.data.data.map(submission => ({
            ...submission,
            gig: gig
          }));
          allSubmissions.push(...gigSubmissions);
        } catch (error) {
          console.error(`Error fetching submissions for gig ${gig._id}:`, error);
        }
      }
      
      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shareId) => {
    setProcessing(shareId);
    try {
      await axios.post(`/api/submission/shares/${shareId}/approve`, {
        notes: 'Submission approved'
      });
      toast.success('Submission approved and payment processed!');
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error(error.response?.data?.message || 'Error approving submission');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (shareId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(shareId);
    try {
      await axios.post(`/api/submission/shares/${shareId}/reject`, {
        reason: reason
      });
      toast.success('Submission rejected');
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error(error.response?.data?.message || 'Error rejecting submission');
    } finally {
      setProcessing(null);
    }
  };

  const toggleExpand = (submissionId) => {
    setExpandedId(expandedId === submissionId ? null : submissionId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <ClockIcon className="w-4 h-4" />;
      case 'approved': return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Submissions</h1>
          <p className="text-gray-600">Review and approve proof of sharing for your gigs</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentCheckIcon className="w-5 h-5 mr-2 text-gray-600" />
                Filters
              </h3>
              <nav className="space-y-2">
                {filterItems.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeFilter === filter.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        <span className="text-sm font-medium">{filter.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === filter.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Stats Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="text-yellow-600 font-medium">
                      {filterItems.find(f => f.id === 'submitted')?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Verified:</span>
                    <span className="text-green-600 font-medium">
                      {filterItems.find(f => f.id === 'approved')?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rejected:</span>
                    <span className="text-red-600 font-medium">
                      {filterItems.find(f => f.id === 'rejected')?.count || 0}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/my-gigs"
                className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View My Gigs
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center p-12">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
                <p className="text-gray-600 mb-4">
                  When users submit proof for your gigs, they will appear here for review.
                </p>
                <Link
                  to="/my-gigs"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Gigs
                </Link>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center p-12">
                <div className="text-6xl mb-4">
                  {activeFilter === 'submitted' && '⏳'}
                  {activeFilter === 'approved' && '✅'}
                  {activeFilter === 'rejected' && '❌'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeFilter !== 'all' ? filterItems.find(f => f.id === activeFilter)?.name : 'Submissions'}
                </h3>
                <p className="text-gray-600">
                  {activeFilter === 'submitted' && 'All submissions have been reviewed!'}
                  {activeFilter === 'approved' && 'No verified submissions yet.'}
                  {activeFilter === 'rejected' && 'No rejected submissions.'}
                  {activeFilter === 'all' && 'No submissions found.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeFilter === 'all' ? 'All Submissions' : filterItems.find(f => f.id === activeFilter)?.name}
                    <span className="text-gray-500 text-sm font-normal ml-2">
                      ({filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'item' : 'items'})
                    </span>
                  </h2>
                </div>

                {filteredSubmissions.map((submission) => (
                  <div key={submission._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    {/* Compact Row View */}
                    <div className="flex items-center justify-between">
                      {/* Left Side - Basic Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {submission.gig.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <UserIcon className="w-3 h-3 mr-1" />
                            <span className="truncate">{submission.user?.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center - Stats */}
                      <div className="hidden md:flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-900">{submission.totalClicks || 0}</div>
                          <div className="text-xs text-gray-500">Total Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-green-600">{submission.uniqueClicks || 0}</div>
                          <div className="text-xs text-gray-500">Unique</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-yellow-600">
                            ${((submission.gig.availableFunds / submission.gig.sharesRequired) || 0).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Amount</div>
                        </div>
                      </div>

                      {/* Right Side - Status & Actions */}
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center ${getStatusColor(submission.submissionStatus)}`}>
                          {getStatusIcon(submission.submissionStatus)}
                          <span className="ml-1 capitalize">{submission.submissionStatus}</span>
                        </div>

                        {/* Action Buttons for Submitted Status */}
                        {submission.submissionStatus === 'submitted' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(submission._id)}
                              disabled={processing === submission._id}
                              className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                              title="Approve & Pay"
                            >
                              {processing === submission._id ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CheckCircleIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(submission._id)}
                              disabled={processing === submission._id}
                              className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                              title="Reject"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(submission._id)}
                          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {expandedId === submission._id ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === submission._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Proof Images */}
                          {submission.submissionProof && submission.submissionProof.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <PhotoIcon className="w-4 h-4 mr-2" />
                                Submitted Proof:
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {submission.submissionProof.map((proof, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={proof.imageUrl}
                                      alt={`Proof ${index + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => window.open(proof.imageUrl, '_blank')}
                                    />
                                    <button
                                      onClick={() => window.open(proof.imageUrl, '_blank')}
                                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                    >
                                      <EyeIcon className="w-5 h-5 text-white" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              {submission.submissionProof[0]?.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  <strong>Notes:</strong> {submission.submissionProof[0].description}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Additional Info & Actions */}
                          <div className="space-y-4">
                            {/* Mobile Stats */}
                            <div className="md:hidden grid grid-cols-3 gap-3">
                              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-sm font-bold text-gray-900">{submission.totalClicks || 0}</div>
                                <div className="text-xs text-gray-500">Total Clicks</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-sm font-bold text-green-600">{submission.uniqueClicks || 0}</div>
                                <div className="text-xs text-gray-500">Unique Clicks</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-sm font-bold text-yellow-600">
                                  ${((submission.gig.availableFunds / submission.gig.sharesRequired) || 0).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">Amount</div>
                              </div>
                            </div>

                            {/* Approval/Rejection Info */}
                            {submission.submissionStatus === 'approved' && submission.submissionProof?.[0]?.verifiedAt && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800 font-medium">Approved</p>
                                <p className="text-xs text-green-700">
                                  {new Date(submission.submissionProof[0].verifiedAt).toLocaleDateString()}
                                </p>
                                {submission.submissionProof[0].verificationNotes && (
                                  <p className="text-xs text-green-700 mt-1">
                                    {submission.submissionProof[0].verificationNotes}
                                  </p>
                                )}
                              </div>
                            )}

                            {submission.submissionStatus === 'rejected' && submission.submissionProof?.[0]?.verificationNotes && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800 font-medium">Rejected</p>
                                <p className="text-xs text-red-700">
                                  Reason: {submission.submissionProof[0].verificationNotes}
                                </p>
                              </div>
                            )}

                            {/* Expanded Action Buttons for Mobile */}
                            {submission.submissionStatus === 'submitted' && (
                              <div className="flex space-x-3 md:hidden">
                                <button
                                  onClick={() => handleApprove(submission._id)}
                                  disabled={processing === submission._id}
                                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                >
                                  {processing === submission._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                                  )}
                                  Approve & Pay
                                </button>
                                <button
                                  onClick={() => handleReject(submission._id)}
                                  disabled={processing === submission._id}
                                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                                >
                                  <XCircleIcon className="w-4 h-4 mr-2" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySubmissions;