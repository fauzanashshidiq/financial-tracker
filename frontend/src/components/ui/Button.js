const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600",
    ghost: "bg-transparent hover:bg-blue-50 text-blue-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
