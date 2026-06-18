const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <h3>⚠️ Something Went Wrong</h3>
      <p>{message || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          🔄 Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
