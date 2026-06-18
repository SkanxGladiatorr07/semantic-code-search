import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  className = '',
  hoverable = false,
  onClick
}) => {
  const cardClasses = [
    'card',
    hoverable && 'card-hoverable',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
