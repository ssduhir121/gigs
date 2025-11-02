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

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3">
          <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  const DataCard = ({ title, children, emptyMessage, data }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {data.length > 0 ? children : (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to your administration panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <ul className="divide-y divide-gray-100">
              {recentGigs.map((gig) => (
                <li key={gig._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                        {gig.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <UsersIcon className="w-3 h-3 mr-1" />
                        <span>by {gig.user?.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${gig.budget}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
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
            <ul className="divide-y divide-gray-100">
              {recentShares.map((share) => (
                <li key={share._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                        {share.gig?.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <UsersIcon className="w-3 h-3 mr-1" />
                        <span>by {share.user?.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${share.amountEarned?.toFixed(2)}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
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