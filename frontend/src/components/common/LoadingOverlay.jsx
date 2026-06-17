const LoadingOverlay = ({ message = 'Loading...', submessage = null }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
        {submessage && <p className="loading-submessage">{submessage}</p>}
      </div>
      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }

        .loading-content {
          background: white;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          min-width: 300px;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .loading-message {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .loading-submessage {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
