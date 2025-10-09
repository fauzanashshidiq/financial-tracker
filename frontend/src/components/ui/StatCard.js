const StatCard = ({ value, label, trend }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">{value}</div>
    <div className="text-gray-600 font-medium">{label}</div>
    {trend && <div className="text-green-500 text-sm mt-1">↑ {trend}</div>}
  </div>
);

export default StatCard;
