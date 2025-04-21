const StatCard = ({ title, value, trend, icon, color, iconColor }) => {
  const isPositive = trend.startsWith("+");

  const TrendUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  // Trend Down icon
  const TrendDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );


  return (
    <div className={`${color} rounded-lg p-4 shadow flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-700 font-medium text-sm mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${iconColor}`}>{icon}</div>
      </div>
      <div
        className={`text-sm ${
          isPositive ? "text-green-600" : "text-red-600"
        } mt-auto`}
      >
        {trend} {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
        <span className="text-gray-500 ml-1">from last period</span>
      </div>
    </div>
  );
};

export default StatCard;
