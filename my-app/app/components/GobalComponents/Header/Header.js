import { AuthContext } from "@/app/context/AuthProvider";
import { useContext } from "react";

const Header = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center lg:hidden">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="ml-2 text-lg font-semibold text-gray-800 lg:hidden">
          BookStack
        </span>
      </div>

      

      <div className="w-full flex items-center justify-end space-x-4">
        <button className="flex items-center text-gray-500 hover:text-gray-700">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user?.user?.userImg}`}
            alt="userProfileImage"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
