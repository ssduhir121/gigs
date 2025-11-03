export const colors = {
  // Primary Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Gradient Colors
   gradient: {
    from: '#2563eb',    // blue-600
    via: '#0ea5e9',     // sky-500
    to: '#06b6d4',      // cyan-500
  },
  
  // Status Colors
  status: {
    success: '#10b981',    // green-500
    warning: '#f59e0b',    // amber-500
    error: '#ef4444',      // red-500
    info: '#3b82f6',       // blue-500
  },
  
  // Background Colors with opacity for glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
  }
};

export const colorVariants = {
  blue: { from: 'from-blue-400/40', to: 'to-blue-600/60' },
  green: { from: 'from-green-400/40', to: 'to-green-600/60' },
  purple: { from: 'from-purple-400/40', to: 'to-purple-600/60' },
  orange: { from: 'from-orange-400/40', to: 'to-orange-600/60' },
  pink: { from: 'from-pink-400/40', to: 'to-pink-600/60' },
  indigo: { from: 'from-indigo-400/40', to: 'to-indigo-600/60' },
};