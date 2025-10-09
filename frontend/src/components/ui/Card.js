const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}
  >
    {children}
  </div>
);

export default Card;
