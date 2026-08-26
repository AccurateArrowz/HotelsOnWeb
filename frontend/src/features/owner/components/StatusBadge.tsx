import '@features/owner/components/StatusBadge.css';

interface StatusConfig {
  label: string;
  className: string;
}

interface StatusBadgeProps {
  status: string;
  type?: 'room' | 'booking';
}

const StatusBadge = ({ status, type = 'room' }: StatusBadgeProps) => {
  const roomStatusConfig: Record<string, StatusConfig> = {
    occupied: { label: 'Occupied', className: 'status-occupied' },
    available: { label: 'Available', className: 'status-available' },
    cleaning: { label: 'Cleaning', className: 'status-cleaning' },
    maintenance: { label: 'Maintenance', className: 'status-maintenance' },
  };

  const bookingStatusConfig: Record<string, StatusConfig> = {
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
