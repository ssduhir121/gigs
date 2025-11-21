// pages/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShareIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { GradientBackground, GlassCard, StatusBadge, StatIconWrapper } from '../components/common/StyledComponents';

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [teamEmail, setTeamEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchCompanyData();
  }, []);

 const fetchCompanyData = async () => {
  try {
    console.log('Fetching company dashboard...');
    const res = await axios.get('/api/company/dashboard');
    console.log('Company dashboard response:', res.data);
    setCompanyData(res.data.data);
  } catch (error) {
    console.error('Failed to load company dashboard:', error);
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message);
    
    if (error.response?.status === 401) {
      toast.error('Please login to access company dashboard');
    } else if (error.response?.status === 403) {
      toast.error('You need to register a company first');
    } else {
      toast.error(error.response?.data?.message || 'Failed to load company dashboard');
    }
  } finally {
    setLoading(false);
  }
};

  const handleInviteTeamMember = async (e) => {
    e.preventDefault();
    if (!teamEmail.trim()) return;

    setInviteLoading(true);
    try {
      await axios.post('/api/company/team/invite', { email: teamEmail });
      toast.success('Team member invited successfully');
      setTeamEmail('');
      fetchCompanyData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to invite team member');
    } finally {
      setInviteLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <GlassCard className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
    </GlassCard>
  );

  if (loading) {
    return (
      <GradientBackground className="py-8">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">Loading company dashboard...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  if (!companyData) {
    return (
      <GradientBackground className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GlassCard className="p-12">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Company Found</h2>
            <p className="text-gray-300 mb-6">
              You need to register a company to access the company dashboard.
            </p>
            <Link
              to="/company/register"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
            >
              Register Company
            </Link>
          </GlassCard>
        </div>
      </GradientBackground>
    );
  }

  const { company, stats, teamMembers, activeMembers } = companyData;

  return (
    <GradientBackground className="py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-2">
              {company.companyLogo ? (
                <img 
                  src={company.companyLogo} 
                  alt={company.companyName}
                  className="w-12 h-12 rounded-lg mr-4"
                />
              ) : (
                <BuildingOfficeIcon className="w-12 h-12 text-primary-300 mr-4" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{company.companyName}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <StatusBadge color={
                    company.verificationStatus === 'verified' ? 'green' :
                    company.verificationStatus === 'pending' ? 'yellow' : 'red'
                  }>
                    {company.verificationStatus === 'verified' ? 'Verified' :
                     company.verificationStatus === 'pending' ? 'Pending Verification' : 'Rejected'}
                  </StatusBadge>
                  <span className="text-gray-300 text-sm">
                    {company.industry.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchCompanyData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/create-gig"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Gig
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'team', name: 'Team Management', icon: UserGroupIcon },
              { id: 'gigs', name: 'Company Gigs', icon: BriefcaseIcon },
              // 💰 PHASE 2: Advanced tabs (commented)
              /* { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
              { id: 'billing', name: 'Billing', icon: CurrencyDollarIcon } */
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BriefcaseIcon}
                title="Total Gigs"
                value={stats.totalGigs}
                color="blue"
              />
              <StatCard
                icon={ShareIcon}
                title="Shares Completed"
                value={stats.sharesCompleted}
                color="green"
              />
              <StatCard
                icon={CurrencyDollarIcon}
                title="Total Budget"
                value={`$${stats.totalBudget}`}
                subtitle={`$${stats.totalSpent} spent`}
                color="purple"
              />
              <StatCard
                icon={UserGroupIcon}
                title="Team Members"
                value={activeMembers}
                subtitle={`${teamMembers} total`}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Team Management
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Invite team members to collaborate on gig campaigns.
                </p>
                <form onSubmit={handleInviteTeamMember} className="flex space-x-2">
                  <input
                    type="email"
                    value={teamEmail}
                    onChange={(e) => setTeamEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={inviteLoading || !teamEmail.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {inviteLoading ? 'Inviting...' : 'Invite'}
                  </button>
                </form>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Company Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Verification Status</span>
                    <StatusBadge color={
                      company.verificationStatus === 'verified' ? 'green' :
                      company.verificationStatus === 'pending' ? 'yellow' : 'red'
                    }>
                      {company.verificationStatus}
                    </StatusBadge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Team Members</span>
                    <span className="text-white font-medium">{activeMembers} active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Gigs</span>
                    <span className="text-white font-medium">{stats.activeGigs}</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* 💰 PHASE 2: Advanced analytics preview (commented) */}
            {/*
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
              <div className="text-center py-8">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">Advanced analytics available in premium plan</p>
                <button className="mt-2 text-primary-300 hover:text-primary-200 text-sm">
                  Upgrade to unlock
                </button>
              </div>
            </GlassCard>
            */}
          </div>
        )}

        {activeTab === 'team' && (
          <GlassCard className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Team Members ({company.teamMembers.length})
              </h3>
            </div>
            
            <div className="divide-y divide-white/10">
              {company.teamMembers.map((member) => (
                <div key={member.user._id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{member.user.name}</p>
                        <p className="text-sm text-gray-300">{member.user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge color={
                            member.status === 'active' ? 'green' :
                            member.status === 'pending' ? 'yellow' : 'red'
                          }>
                            {member.status}
                          </StatusBadge>
                          <span className="text-xs text-gray-400 capitalize">{member.role}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {member.status === 'pending' && (
                        <>
                          <button className="p-1 text-green-400 hover:text-green-300">
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-300">
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {['owner', 'admin'].includes(company.teamMembers.find(m => m.user._id === member.user._id)?.role) && (
                        <select 
                          className="px-2 py-1 border border-white/20 rounded bg-white/5 text-white text-xs"
                          defaultValue={member.role}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'gigs' && (
          <div>
            <GlassCard className="p-6 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Company Gigs</h3>
                <Link
                  to="/create-gig"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Gig
                </Link>
              </div>
            </GlassCard>

            {/* 💰 PHASE 2: Bulk gig creation (commented) */}
            {/*
            <GlassCard className="p-6 mb-6 bg-gradient-to-r from-blue-400/20 to-purple-400/20 border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white mb-1">Bulk Gig Creation</h4>
                  <p className="text-gray-300 text-sm">Upload CSV to create multiple gigs at once</p>
                </div>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                  Upload CSV
                </button>
              </div>
            </GlassCard>
            */}

            <div className="text-center py-12">
              <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Company Gigs Yet</h3>
              <p className="text-gray-300 mb-6">
                Start creating gigs to promote your content across the platform.
              </p>
              <Link
                to="/create-gig"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Company Gig
              </Link>
            </div>
          </div>
        )}
      </div>
    </GradientBackground>
  );
};

export default CompanyDashboard;