const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: '24px',
    md: '48px',
    lg: '64px'
  };

  return (
    <div className="loading-state">
      <div 
        className="loading-spinner-lg" 
        style={{ width: sizes[size], height: sizes[size] }}
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
