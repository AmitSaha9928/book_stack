import SidebarContent from "../SidebarContents/SidebarContents";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthProvider";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { handleLogout } = useContext(AuthContext);
  const router = useRouter();

  const onLogout = async () => {
    const result = await handleLogout();
    if (result) {
      router.push("/login");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>

        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white border-r border-gray-200 shadow-xl">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span className="ml-2 text-lg font-semibold text-gray-800">
                BookStack
              </span>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
          {/* Logout Button for Mobile */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={onLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 flex flex-col border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <svg
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="ml-2 text-lg font-semibold text-gray-800">
              BookStack
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
          {/* Logout Button for Desktop */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={onLogout}
              className="w-full py-2 px-4 bg-red-400 hover:bg-red-500 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center hover:cursor-pointer"
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
