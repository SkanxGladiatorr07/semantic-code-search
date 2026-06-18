import './StatusBadge.css';

const StatusBadge = ({ status, children }) => {
  const statusMap = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    processing: 'primary',
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'primary'
  };

  const badgeType = statusMap[status?.toLowerCase()] || 'gray';

  return (
    <span className={`badge badge-${badgeType}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
