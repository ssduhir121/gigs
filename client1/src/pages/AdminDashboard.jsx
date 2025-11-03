import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  ShareIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { colors, colorVariants } from '../constants/colors';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentGigs, setRecentGigs] = useState([]);
  const [recentShares, setRecentShares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, gigsRes, sharesRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/gigs'),
        axios.get('/api/admin/shares')
      ]);

      setStats(statsRes.data.data);
      setRecentGigs(gigsRes.data.data.slice(0, 5));
      setRecentShares(sharesRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Admin Dashboard</h1>
          <p className="text-gray-200">Welcome to your administration panel</p>
        </div>

        {/* Stats Grid */}
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
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Gigs */}
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

          {/* Recent Shares */}
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
  );
};

export default AdminDashboard;