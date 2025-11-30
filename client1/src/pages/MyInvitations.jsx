// src/pages/MyInvitations.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  EnvelopeIcon,
  ClockIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EyeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';

const MyInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchInvitations();
  }, [activeTab, pagination.page]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/invitations/received`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: activeTab === 'all' ? undefined : activeTab
        }
      });

      if (response.data.success) {
        setInvitations(response.data.data);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error(error.response?.data?.message || 'Failed to load invitations');
      
      // Mock data for demonstration if API fails
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

const handleAcceptInvitation = async (invitationId) => {
  try {
    setResponding(true);
    const response = await axios.post(`/api/invitations/${invitationId}/accept`, {
      responseMessage: responseMessage.trim() || undefined
    });

    if (response.data.success) {
      toast.success('Invitation accepted successfully!');
      setResponseMessage('');
      setShowDetailsModal(false);
      fetchInvitations();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error accepting invitation:', error);
    
    // More specific error messages
    const errorMessage = error.response?.data?.message || error.message;
    
    if (errorMessage.includes('Compensation is required')) {
      toast.error('This company invitation requires compensation. Please contact the sender.');
    } else if (errorMessage.includes('already applied')) {
      toast.error('You have already applied to this gig. Check your applications.');
    } else if (errorMessage.includes('expired')) {
      toast.error('This invitation has expired.');
    } else {
      toast.error(errorMessage || 'Failed to accept invitation');
    }
  } finally {
    setResponding(false);
  }
};

  const handleRejectInvitation = async (invitationId) => {
    try {
      setResponding(true);
      const response = await axios.post(`/api/invitations/${invitationId}/reject`, {
        responseMessage: responseMessage.trim() || undefined
      });

      if (response.data.success) {
        toast.success('Invitation declined');
        setResponseMessage('');
        setShowDetailsModal(false);
        fetchInvitations();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to reject invitation');
    } finally {
      setResponding(false);
    }
  };

  const getStatusColor = (status, isExpired) => {
    if (isExpired) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status, isExpired) => {
    if (isExpired) return <ClockIcon className="w-4 h-4" />;
    
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'accepted': return <CheckBadgeIconSolid className="w-4 h-4" />;
      case 'rejected': return <XMarkIconSolid className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate counts for tabs
  const calculateTabCounts = () => {
    const pending = invitations.filter(i => i.status === 'pending' && !i.isExpired).length;
    const accepted = invitations.filter(i => i.status === 'accepted').length;
    const rejected = invitations.filter(i => i.status === 'rejected').length;
    const expired = invitations.filter(i => i.isExpired).length;

    return { pending, accepted, rejected, expired };
  };

  const tabCounts = calculateTabCounts();

  const tabs = [
    { id: 'pending', name: 'Pending', count: tabCounts.pending },
    { id: 'accepted', name: 'Accepted', count: tabCounts.accepted },
    { id: 'rejected', name: 'Declined', count: tabCounts.rejected },
    { id: 'expired', name: 'Expired', count: tabCounts.expired },
  ];

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && invitations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your invitations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
              <p className="text-gray-600 mt-2">
                Manage your service gig invitations from companies
              </p>
            </div>
            <button
              onClick={fetchInvitations}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
            </div>
            <p className="text-sm text-gray-600">Total Invitations</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-yellow-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
              <p className="text-2xl font-bold text-gray-900">
                {tabCounts.pending}
              </p>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-green-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckBadgeIcon className="w-6 h-6 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">
                {tabCounts.accepted}
              </p>
            </div>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-red-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <XMarkIcon className="w-6 h-6 text-red-600" />
              <p className="text-2xl font-bold text-gray-900">
                {tabCounts.rejected}
              </p>
            </div>
            <p className="text-sm text-gray-600">Declined</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Invitations List */}
          <div className="p-6">
            {invitations.length === 0 ? (
              <div className="text-center py-12">
                <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} invitations
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'pending' 
                    ? "You don't have any pending invitations at the moment."
                    : `You haven't ${activeTab} any invitations yet.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {/* Company/Sender Logo */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                            {invitation.company ? (
                              <BuildingOfficeIcon className="w-6 h-6" />
                            ) : (
                              <UserIcon className="w-6 h-6" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {invitation.targetGig?.title || 'Private Gig'}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invitation.status, invitation.isExpired)}`}>
                                {getStatusIcon(invitation.status, invitation.isExpired)}
                                <span className="ml-1 capitalize">
                                  {invitation.isExpired ? 'Expired' : invitation.status}
                                </span>
                              </span>
                            </div>

                            <div className="space-y-2">
                              <p className="text-gray-700">{invitation.message}</p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  {invitation.company ? (
                                    <BuildingOfficeIcon className="w-4 h-4" />
                                  ) : (
                                    <UserIcon className="w-4 h-4" />
                                  )}
                                  <span>
                                    {invitation.company?.companyName || invitation.sender?.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CurrencyDollarIcon className="w-4 h-4" />
                                  <span>Budget: ${invitation.targetGig?.budget?.toLocaleString()}</span>
                                </div>
                                {invitation.compensation && (
                                  <div className="flex items-center space-x-1 text-green-600 font-medium">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                    <span>+${invitation.compensation} bonus</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>Received: {formatDate(invitation.sentAt)}</span>
                                </div>
                              </div>

                              {invitation.responseMessage && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-700">
                                    <strong>Your response:</strong> {invitation.responseMessage}
                                  </p>
                                </div>
                              )}

                              {invitation.autoCreatedApplication && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-700 flex items-center">
                                    <CheckBadgeIconSolid className="w-4 h-4 mr-2" />
                                    <strong>Application auto-created and approved!</strong>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedInvitation(invitation);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>

                        {invitation.status === 'pending' && !invitation.isExpired && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptInvitation(invitation._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                            >
                              <CheckBadgeIconSolid className="w-4 h-4 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectInvitation(invitation._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                            >
                              <XMarkIconSolid className="w-4 h-4 mr-1" />
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {invitation.isExpired && invitation.status === 'pending' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-700">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">This invitation has expired</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invitation Details Modal */}
      {showDetailsModal && selectedInvitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedInvitation.targetGig?.title || 'Private Gig'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Invitation from {selectedInvitation.company?.companyName || selectedInvitation.sender?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedInvitation(null);
                    setResponseMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(selectedInvitation.status, selectedInvitation.isExpired)}`}>
                      {getStatusIcon(selectedInvitation.status, selectedInvitation.isExpired)}
                      <span className="ml-1 capitalize">
                        {selectedInvitation.isExpired ? 'Expired' : selectedInvitation.status}
                      </span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Received</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedInvitation.sentAt)}
                    </p>
                  </div>
                </div>

                {/* Sender Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {selectedInvitation.company ? 'Company Details' : 'Sender Details'}
                  </h3>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      {selectedInvitation.company ? (
                        <BuildingOfficeIcon className="w-6 h-6" />
                      ) : (
                        <UserIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedInvitation.company?.companyName || selectedInvitation.sender?.name}
                      </p>
                      <p className="text-sm text-gray-600">{selectedInvitation.sender?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Gig Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Gig Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${selectedInvitation.targetGig?.budget?.toLocaleString()}
                      </p>
                    </div>
                    {selectedInvitation.compensation && (
                      <div>
                        <p className="text-sm text-gray-600">Additional Compensation</p>
                        <p className="text-lg font-semibold text-green-600">
                          +${selectedInvitation.compensation}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedInvitation.targetGig?.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Description</p>
                      <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {selectedInvitation.targetGig.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Invitation Message */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Invitation Message</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{selectedInvitation.message}</p>
                  </div>
                </div>

                {/* Response Section (for pending invitations) */}
                {selectedInvitation.status === 'pending' && !selectedInvitation.isExpired && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Your Response</h3>
                    <div className="space-y-4">
                      <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Add an optional message to the sender..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAcceptInvitation(selectedInvitation._id)}
                          disabled={responding}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                        >
                          <CheckBadgeIconSolid className="w-5 h-5 mr-2" />
                          {responding ? 'Accepting...' : 'Accept Invitation'}
                        </button>
                        <button
                          onClick={() => handleRejectInvitation(selectedInvitation._id)}
                          disabled={responding}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                        >
                          <XMarkIconSolid className="w-5 h-5 mr-2" />
                          {responding ? 'Declining...' : 'Decline Invitation'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Response */}
                {selectedInvitation.responseMessage && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Your Response</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{selectedInvitation.responseMessage}</p>
                    </div>
                  </div>
                )}

                {/* Auto-created Application Info */}
                {selectedInvitation.autoCreatedApplication && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-2 flex items-center">
                      <CheckBadgeIconSolid className="w-5 h-5 mr-2" />
                      Application Created
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your application was automatically created and approved when you accepted this invitation.
                      You can now start sharing the gig!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvitations;