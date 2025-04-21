import { AuthContext } from "@/app/context/AuthProvider";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const SidebarContent = () => {
  const { user } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const isActive = (path) => {
    if (!currentPath) return false;
    return (
      currentPath === path || currentPath === `/${path.replace(/^\//, "")}`
    );
  };

  const getLinkClasses = (path) => {
    return `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    } group`;
  };

  const getIconClasses = (path) => {
    return `mr-3 h-6 w-6 ${
      isActive(path)
        ? "text-indigo-500"
        : "text-gray-500 group-hover:text-gray-500"
    }`;
  };

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      <Link href="/dashboard">
        <p className={getLinkClasses("/dashboard")}>
          <svg
            className={getIconClasses("/dashboard")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </p>
      </Link>

      <Link href="/allbooks">
        <p className={getLinkClasses("/allbooks")}>
          <svg
            className={getIconClasses("/allbooks")}
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
          All Books
        </p>
      </Link>

      {user?.user?.userRole === 1 ? (
        <Link href="/addcategory">
          <p className={getLinkClasses("/addcategory")}>
            <svg
              className={getIconClasses("/addcategory")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Add Category
          </p>
        </Link>
      ) : (
        <></>
      )}

      <Link href="/addbook">
        <p className={getLinkClasses("/addbook")}>
          <svg
            className={getIconClasses("/addbook")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          Add Book
        </p>
      </Link>

      {user?.user?.userRole === 1 ? (
        <Link href="/allusers">
          <p className={getLinkClasses("/allusers")}>
            <svg
              className={getIconClasses("/allusers")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            All Users
          </p>
        </Link>
      ) : (
        <>
          <Link href="/allusers">
            <p className={getLinkClasses("/allusers")}>
              <svg
                className={getIconClasses("/allusers")}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              All Users
            </p>
          </Link>
        </>
      )}

      {/* <Link href="/reviews">
        <p className={getLinkClasses("/reviews")}>
          <svg
            className={getIconClasses("/reviews")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          All Reviews
        </p>
      </Link> */}
    </nav>
  );
};

export default SidebarContent;
