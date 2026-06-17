import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${20 + index * 80}px` }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
};

export default ToastContainer;
