import React from 'react';
import '@/features/owner/components/StatusBadge.css';

const StatusBadge = ({ status, type = 'room' }) => {
  // Configuration for room statuses
  const roomStatusConfig = {
    occupied: { label: 'Occupied', className: 'status-occupied' },
    available: { label: 'Available', className: 'status-available' },
    cleaning: { label: 'Cleaning', className: 'status-cleaning' },
    maintenance: { label: 'Maintenance', className: 'status-maintenance' },
  };

  // Configuration for booking statuses
  const bookingStatusConfig = {
    active: { label: 'Active', className: 'status-active' },
    upcoming: { label: 'Upcoming', className: 'status-upcoming' },
    checkout: { label: 'Check-out', className: 'status-checkout' },
    completed: { label: 'Completed', className: 'status-completed' },
    cancelled: { label: 'Cancelled', className: 'status-cancelled' },
  };

  const config = type === 'room' ? roomStatusConfig : bookingStatusConfig;
  const currentStatus = config[status.toLowerCase()] || { label: status, className: 'status-default' };

  return (
    <span className={`status-badge ${currentStatus.className}`} role="status">
      <span className="status-dot" aria-hidden="true"></span>
      {currentStatus.label}
    </span>
  );
};

export default StatusBadge;
