import { useState, useCallback, useMemo } from 'react';
import {
  useGetHotelRequestsQuery,
  useUpdateHotelRequestStatusMutation,
} from '@features/admin/adminHotelRequestsApi';
import { cn } from '@shared/utils/cn';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
  approved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={cn('px-3 py-1 rounded-full text-sm font-medium border', config.color)}>
      {config.label}
    </span>
  );
};

const RequestDetailModal = ({ request, isOpen, onClose, onApprove, onReject, isProcessing }) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [action, setAction] = useState(null);

  if (!isOpen || !request) return null;

  const primaryImage = request.images?.find((img) => img.isPrimary) || request.images?.[0];

  const handleAction = (actionType) => {
    setAction(actionType);
  };

  const confirmAction = () => {
    if (action === 'approve') {
      onApprove(request.id, adminNotes);
    } else {
      onReject(request.id, adminNotes);
    }
    setAction(null);
    setAdminNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{request.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Submitted by {request.user?.firstName} {request.user?.lastName} ({request.user?.email})
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {primaryImage && (
            <div className="mb-4">
              <img
                src={primaryImage.imageUrl}
                alt={request.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Address</h3>
              <p className="text-sm text-gray-600">
                {request.street}, {request.city}, {request.country}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Submitted</h3>
              <p className="text-sm text-gray-600">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {request.description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className="text-sm text-gray-600">{request.description}</p>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about your decision..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          )}

          {request.adminNotes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Admin Notes</h3>
              <p className="text-sm text-gray-600">{request.adminNotes}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>

            {request.status === 'pending' && (
              <>
                {!action ? (
                  <>
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={isProcessing}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={isProcessing}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setAction(null)}
                      disabled={isProcessing}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAction}
                      disabled={isProcessing}
                      className={cn(
                        'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                        action === 'approve'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isProcessing
                        ? 'Processing...'
                        : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function HotelRequestsPage() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: hotelRequests,
    isLoading,
    error,
    refetch,
  } = useGetHotelRequestsQuery(statusFilter === 'all' ? undefined : statusFilter);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateHotelRequestStatusMutation();

  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  }, []);

  const handleApprove = useCallback(
    async (id, adminNotes) => {
      try {
        await updateStatus({ id, status: 'approved', adminNotes }).unwrap();
        handleCloseModal();
        refetch();
      } catch (err) {
        console.error('Failed to approve request:', err);
      }
    },
    [updateStatus, handleCloseModal, refetch]
  );

  const handleReject = useCallback(
    async (id, adminNotes) => {
      try {
        await updateStatus({ id, status: 'rejected', adminNotes }).unwrap();
        handleCloseModal();
        refetch();
      } catch (err) {
        console.error('Failed to reject request:', err);
      }
    },
    [updateStatus, handleCloseModal, refetch]
  );

  const counts = useMemo(() => {
    if (!hotelRequests) return { pending: 0, approved: 0, rejected: 0, all: 0 };
    return {
      pending: hotelRequests.filter((r) => r.status === 'pending').length,
      approved: hotelRequests.filter((r) => r.status === 'approved').length,
      rejected: hotelRequests.filter((r) => r.status === 'rejected').length,
      all: hotelRequests.length,
    };
  }, [hotelRequests]);

  const filteredRequests = useMemo(() => {
    if (!hotelRequests) return [];
    if (statusFilter === 'all') return hotelRequests;
    return hotelRequests.filter((r) => r.status === statusFilter);
  }, [hotelRequests, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load hotel requests. Please try again.</p>
          <button
            onClick={refetch}
            className="mt-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotel Requests</h1>
        <p className="text-gray-600 mt-1">Review and manage hotel listing hotelRequests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'pending', label: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
          { key: 'approved', label: 'Approved', color: 'bg-green-50 border-green-200' },
          { key: 'rejected', label: 'Rejected', color: 'bg-red-50 border-red-200' },
          { key: 'all', label: 'Total', color: 'bg-blue-50 border-blue-200' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              color,
              statusFilter === key ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md'
            )}
          >
            <div className="text-2xl font-bold text-gray-900">{counts[key] || 0}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No {statusFilter !== 'all' ? statusFilter : ''} hotelRequests found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => {
              const primaryImage = request.images?.find((img) => img.isPrimary) || request.images?.[0];
              return (
                <div
                  key={request.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {primaryImage && (
                      <img
                        src={primaryImage.imageUrl}
                        alt={request.name}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {request.name}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {request.street}, {request.city}, {request.country}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        By {request.user?.firstName} {request.user?.lastName} •{' '}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.adminNotes && (
                        <p className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded mt-2">
                          Note: {request.adminNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RequestDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isUpdating}
      />
    </div>
  );
}

export default HotelRequestsPage;
