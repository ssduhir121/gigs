// import { colorVariants } from '../../constants/colors';

// export const GradientBackground = ({ children, className = '' }) => (
//   <div className={`min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient ${className}`}>
//     {children}
//   </div>
// );

// export const GlassCard = ({ children, className = '', hover = true }) => (
//   <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 transition-all duration-300 ${
//     hover ? 'hover:bg-white/20' : ''
//   } ${className}`}>
//     {children}
//   </div>
// );

// export const StatIconWrapper = ({ color = 'blue', children }) => {
//   const colorVariant = colorVariants[color];
  
//   return (
//     <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to}`}>
//       {children}
//     </div>
//   );
// };

// export const StatusBadge = ({ color = 'blue', children }) => {
//   const colorMap = {
//     blue: 'bg-blue-400/30',
//     green: 'bg-green-400/30',
//     purple: 'bg-purple-400/30',
//     orange: 'bg-orange-400/30',
//     pink: 'bg-pink-400/30',
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white border border-white/20 ${colorMap[color]}`}>
//       {children}
//     </span>
//   );
// };


import React from 'react';

// Enhanced color variants with better opacity values
export const colorVariants = {
  blue: { 
    from: 'from-blue-500/50', 
    to: 'to-blue-700/70',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-200'
  },
  green: { 
    from: 'from-green-500/50', 
    to: 'to-green-700/70',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-200'
  },
  purple: { 
    from: 'from-purple-500/50', 
    to: 'to-purple-700/70',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-200'
  },
  orange: { 
    from: 'from-orange-500/50', 
    to: 'to-orange-700/70',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
    text: 'text-orange-200'
  },
  pink: { 
    from: 'from-pink-500/50', 
    to: 'to-pink-700/70',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-200'
  },
  indigo: { 
    from: 'from-indigo-500/50', 
    to: 'to-indigo-700/70',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    text: 'text-indigo-200'
  },
  red: { 
    from: 'from-red-500/50', 
    to: 'to-red-700/70',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-200'
  },
  teal: { 
    from: 'from-teal-500/50', 
    to: 'to-teal-700/70',
    bg: 'bg-teal-500/20',
    border: 'border-teal-500/30',
    text: 'text-teal-200'
  }
};

// Get color variant with fallback to blue
const getColorVariant = (color) => {
  const defaultColor = 'blue';
  return colorVariants[color] || colorVariants[defaultColor];
};

// Updated GradientBackground to use your colors
export const GradientBackground = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#db2777] text-white animate-gradient ${className}`}>
    {children}
  </div>
);

export const GlassCard = ({ children, className = '', hover = true }) => (
  <div className={`bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 transition-all duration-300 ${
    hover ? 'hover:bg-white/15 hover:shadow-2xl' : ''
  } ${className}`}>
    {children}
  </div>
);

export const StatIconWrapper = ({ color = 'blue', children, className = '' }) => {
  const colorVariant = getColorVariant(color);
  
  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariant.from} ${colorVariant.to} backdrop-blur-sm shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const StatusBadge = ({ color = 'blue', children }) => {
  const colorVariant = getColorVariant(color);
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 backdrop-blur-sm ${colorVariant.bg} ${colorVariant.border}`}>
      {children}
    </span>
  );
};