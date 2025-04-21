import React from "react";

const BookFilters = ({
  categories,
  activeFilter,
  setActiveFilter,
  isLoading,
}) => {
  const ChevronDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const handleFilterChange = (e) => {
    setActiveFilter(e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={activeFilter}
        onChange={handleFilterChange}
        disabled={isLoading}
        className={`w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          isLoading ? "bg-gray-100 text-gray-500" : ""
        }`}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {isLoading ? (
          <option disabled>Loading categories...</option>
        ) : (
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))
        )}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <ChevronDownIcon />
        )}
      </div>
    </div>
  );
};

export default BookFilters;
