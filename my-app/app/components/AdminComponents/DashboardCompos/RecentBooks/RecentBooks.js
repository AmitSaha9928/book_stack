import { useRouter } from "next/navigation";

const RecentBooks = ({ recentBooks }) => {
  const router = useRouter();

  const navigateTo = () => {
    router.push("/allbooks");
  };
  const ArrowRightIcon = () => (
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
      className="ml-1"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-2">Title</th>
            <th className="text-left py-2 px-2 hidden sm:table-cell">Author</th>
            <th className="text-left py-2 px-2 hidden md:table-cell">Genre</th>
            <th className="text-left py-2 px-2 hidden lg:table-cell">
              Added On
            </th>
            <th className="text-left py-2 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentBooks.map((book) => (
            <tr key={book._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-2">{book.bookTitle}</td>
              <td className="py-2 px-2 hidden sm:table-cell">
                {book.authorName}
              </td>
              <td className="py-2 px-2 hidden md:table-cell">
                {book.categoryId.categoryName}
              </td>
              <td className="py-2 px-2 hidden lg:table-cell">
                {book.insertionUserId.username}
              </td>
              <td className="py-2 px-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    book.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {book.status === true ? "Active" : "In-active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button
          onClick={navigateTo}
          className="text-blue-500 flex items-center text-sm justify-end w-full"
        >
          View All Books
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default RecentBooks;
