import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  return createPortal(
    <div className={`toast toast-${type} ${isVisible ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        ×
      </button>
      <style jsx>{`
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          max-width: 500px;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10000;
          transition: all 0.3s ease;
          animation: slideIn 0.3s ease;
        }

        .toast-show {
          opacity: 1;
          transform: translateX(0);
        }

        .toast-hide {
          opacity: 0;
          transform: translateX(100%);
        }

        .toast-success {
          background: #10b981;
          color: white;
        }

        .toast-error {
          background: #ef4444;
          color: white;
        }

        .toast-info {
          background: #3b82f6;
          color: white;
        }

        .toast-warning {
          background: #f59e0b;
          color: white;
        }

        .toast-icon {
          font-size: 20px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-size: 14px;
          line-height: 1.5;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .toast {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default Toast;
