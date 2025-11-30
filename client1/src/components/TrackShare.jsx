
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Import color system
import { colors, colorVariants } from '../constants/colors';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const TrackShare = () => {
  const { trackingToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gigLink, setGigLink] = useState('');
  const [earnedAmount, setEarnedAmount] = useState(null);

  useEffect(() => {
    const trackAndRedirect = async () => {
      try {
        setLoading(true);
        
        // Step 1: Track the share via API
        const trackResponse = await axios.get(`/api/gigs/track-share/${trackingToken}`);
        
        const { gigLink, earnedMoney, earningsAmount, message } = trackResponse.data.data;
        
        // Set the gig link for potential fallback use
        setGigLink(gigLink);
        
        // Set earned amount for display
        if (earnedMoney && earningsAmount) {
          setEarnedAmount(earningsAmount);
        }
        
        // Show success message
        if (earnedMoney) {
          toast.success(`🎉 ${message}`);
        } else {
          toast.success('Share tracked successfully!');
        }
        
        // Step 2: Open the gig link in a new tab
        if (gigLink) {
          window.open(gigLink, '_blank', 'noopener,noreferrer');
        }
        
        // Step 3: Redirect to gigs page after a delay
        setTimeout(() => {
          navigate('/gigs');
        }, 3000);
        
      } catch (error) {
        console.error('Error tracking share:', error);
        
        // Fallback: Try to get share details to find the gig link
        try {
          const shareRes = await axios.get(`/api/gigs/shares/${trackingToken}`);
          if (shareRes.data.data && shareRes.data.data.gig) {
            const link = shareRes.data.data.gig.link;
            setGigLink(link);
            window.open(link, '_blank', 'noopener,noreferrer');
            toast.success('Redirecting to gig...');
          }
        } catch (shareError) {
          console.log('Could not get gig link from share details');
          toast.error('Failed to track share and get gig link');
        }
        
        // Redirect to gigs page after a delay
        setTimeout(() => {
          navigate('/gigs');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    trackAndRedirect();
  }, [trackingToken, navigate]);

  if (loading) {
    return (
      <GradientBackground className="flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Tracking your share and redirecting...</p>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="flex items-center justify-center">
      <GlassCard className="max-w-md w-full mx-4 p-8 text-center backdrop-blur-lg">
        {earnedAmount ? (
          <>
            {/* Success with Earnings */}
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <p className="text-green-300 text-lg font-semibold">
                You earned ${earnedAmount.toFixed(2)}!
              </p>
            </div>
            <p className="text-gray-300 mb-6">
              Thank you for sharing! The money has been added to your wallet.
            </p>
          </>
        ) : (
          <>
            {/* Success without Earnings */}
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Share Tracked!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for clicking the share link!
            </p>
          </>
        )}
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            You should be redirected to the gig shortly. If not,{' '}
            <a 
              href={gigLink} 
              className="text-primary-300 hover:text-primary-200 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here to open the gig
            </a>
            .
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/gigs')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 backdrop-blur-sm"
            >
              Browse More Gigs
            </button>
            {earnedAmount && (
              <button
                onClick={() => navigate('/wallet')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 backdrop-blur-sm"
              >
                View Wallet
              </button>
            )}
          </div>
        </div>

        {/* Loading animation for redirect */}
        <div className="mt-6">
          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-primary-400 to-primary-500 h-2 rounded-full transition-all duration-3000"
              style={{ width: '100%' }}
            ></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Redirecting to gigs page...
          </p>
        </div>
      </GlassCard>
    </GradientBackground>
  );
};

export default TrackShare;


// // components/TrackShare.jsx - Updated version
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const TrackShare = () => {
//   const { trackingToken } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [gigLink, setGigLink] = useState('');

//   useEffect(() => {
//     const trackAndRedirect = async () => {
//       try {
//         setLoading(true);
        
//         // Step 1: Track the share via API
//         const trackResponse = await axios.get(`/api/gigs/track-share/${trackingToken}`);
        
//         const { gigLink, earnedMoney, earningsAmount, message } = trackResponse.data.data;
        
//         // Set the gig link for potential fallback use
//         setGigLink(gigLink);
        
//         // Show success message
//         if (earnedMoney) {
//           toast.success(`🎉 ${message}`);
//         } else {
//           toast.success('Share tracked successfully!');
//         }
        
//         // Step 2: Open the gig link in a new tab
//         if (gigLink) {
//           window.open(gigLink, '_blank', 'noopener,noreferrer');
//         }
        
//         // Step 3: Redirect to gigs page after a delay
//         setTimeout(() => {
//           navigate('/gigs');
//         }, 2000);
        
//       } catch (error) {
//         console.error('Error tracking share:', error);
        
//         // Fallback: Try to get share details to find the gig link
//         try {
//           const shareRes = await axios.get(`/api/gigs/shares/${trackingToken}`);
//           if (shareRes.data.data && shareRes.data.data.gig) {
//             const link = shareRes.data.data.gig.link;
//             setGigLink(link);
//             window.open(link, '_blank', 'noopener,noreferrer');
//             toast.success('Redirecting to gig...');
//           }
//         } catch (shareError) {
//           console.log('Could not get gig link from share details');
//           toast.error('Failed to track share and get gig link');
//         }
        
//         // Redirect to gigs page after a delay
//         setTimeout(() => {
//           navigate('/gigs');
//         }, 2000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     trackAndRedirect();
//   }, [trackingToken, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Tracking your share and redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="text-6xl mb-4">✅</div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
//         <p className="text-gray-600 mb-4">
//           You should be redirected to the gig shortly. If not, <a href={gigLink} className="text-primary-600 hover:underline">click here</a>.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TrackShare;


// // components/TrackShare.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const TrackShare = () => {
//   const { trackingToken } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const trackShare = async () => {
//       try {
//         setLoading(true);
        
//         // Call the backend tracking endpoint
//         const response = await axios.get(`/api/gigs/track-share/${trackingToken}`, {
//           // This will follow redirects automatically
//         });

//         // If we get here, the backend should have redirected us
//         // But if not, we can handle the response
//         console.log('Track share response:', response);
        
//       } catch (error) {
//         console.error('Error tracking share:', error);
        
//         // If there's an error, we can still try to get the gig link
//         try {
//           // Get the share details to find the gig link
//           const shareRes = await axios.get(`/api/gigs/shares/${trackingToken}`);
//           if (shareRes.data.data && shareRes.data.data.gig) {
//             // Redirect to the actual gig link
//             window.location.href = shareRes.data.data.gig.link;
//             return;
//           }
//         } catch (fallbackError) {
//           console.error('Fallback error:', fallbackError);
//         }
        
//         // If everything fails, show error and redirect to gigs page
//         setError('Unable to track share. Redirecting to gigs...');
//         setTimeout(() => navigate('/gigs'), 3000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     trackShare();
//   }, [trackingToken, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Tracking your share and redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😕</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => navigate('/gigs')}
//             className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//           >
//             Browse Gigs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default TrackShare;


// // components/TrackShare.jsx
// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const TrackShare = () => {
//   const { trackingToken } = useParams();

//   useEffect(() => {
//     // Simple redirect - let the backend handle everything
//     window.location.href = `/api/gigs/track-share/${trackingToken}`;
//   }, [trackingToken]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-gray-600">Tracking your share and redirecting to content...</p>
//       </div>
//     </div>
//   );
// };

// export default TrackShare;