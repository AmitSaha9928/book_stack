const BooksPagination = ({ currentPage, totalPages, handlePageChange }) => {
  const ChevronLeftIcon = () => (
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
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  // Chevron right icon
  const ChevronRightIcon = () => (
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
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < 4 && totalPages > 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        {/* First Page */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                currentPage === 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="flex items-center justify-center w-10 h-10 text-gray-400">
                ...
              </span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}

        {/* Last Page */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="flex items-center justify-center w-10 h-10 text-gray-400">
                ...
              </span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                currentPage === totalPages
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default BooksPagination;
