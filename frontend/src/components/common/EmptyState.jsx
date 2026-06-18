const EmptyState = ({ icon = '📂', title, message, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title || 'No Data Available'}</h3>
      <p>{message || 'There is nothing to display here yet.'}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
