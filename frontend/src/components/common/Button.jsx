const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'btn-block' : '';
  const classes = [baseClass, variantClass, sizeClass, widthClass, className].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="loading-spinner"></span>}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
