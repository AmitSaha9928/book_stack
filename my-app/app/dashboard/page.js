"use client";

import MainLayout from "../layout/MainLayout";
import DashboardHeader from "../components/AdminComponents/DashboardCompos/DashboardHeader/DashHeader";
import StatCard from "../components/AdminComponents/DashboardCompos/StatCard/StatCard";
import RecentBooks from "../components/AdminComponents/DashboardCompos/RecentBooks/RecentBooks";
import useRequest from "../api/useRequest";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import ProtectedRoute from "../hooks/ProtectedRoute";

function Dashboard() {
  const [postRequest, getRequest] = useRequest();
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [ownBooks, setOwnBooks] = useState(0);
  const [categories, setCategories] = useState(0);
  const [recentBooks, setRecentBooks] = useState([]);
  const { user, loading, setLoading } = useContext(AuthContext);

  const fetchAllBooks = async () => {
    try {
      const response = await getRequest("/books/src/all");
      setTotalBooks(response?.data?.data?.length);
    } catch (error) {
      console.log("Failed to Fetch All Books", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setTotalBooks(0);
      }
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await getRequest("/users/src/all");
      setTotalUsers(response?.data?.data.length);
    } catch (error) {
      console.log("Failed to Fetch All The Users", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setTotalUsers(0);
      }
    }
  };

  const fetchOwnBooks = async () => {
    try {
      if (!user?.user?._id) {
        console.log("User ID not available yet");
        return;
      }

      const response = await getRequest(
        `/books/src/by/user/${user?.user?._id}`
      );
      console.log(response?.data?.data, "own books");
      setOwnBooks(response?.data?.data?.length);
    } catch (error) {
      console.log("Failed to Fetch Own Books", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setOwnBooks(0);
      }
    }
  };

  const fetchRecentBooks = async () => {
    try {
      const response = await getRequest("/books/rcnt/src/all");
      setRecentBooks(response?.data?.data);
    } catch (error) {
      console.log("Failed to Fetch Recent Books", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setRecentBooks([]);
      }
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await getRequest("/categories/src/all");
      setCategories(response?.data?.data?.length);
    } catch (error) {
      console.log("Failed to Fetch All Categories", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setCategories(0);
      }
    }
  };

  useEffect(() => {
    if (user?.user) {
      fetchAllBooks();
      fetchAllUsers();
      fetchOwnBooks();
      fetchRecentBooks();
      fetchAllCategories();
    }
  }, [user?.user]);

  const BookIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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
  );

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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
  );

  const ReviewIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

  const NewBookIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      <line x1="12" y1="6" x2="12" y2="14"></line>
      <line x1="8" y1="10" x2="16" y2="10"></line>
    </svg>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="w-full">
          <DashboardHeader />

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Books"
              value={totalBooks}
              trend="+2.5%"
              icon={<BookIcon />}
              color="bg-blue-100"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              trend="+4.2%"
              icon={<UserIcon />}
              color="bg-green-100"
              iconColor="text-green-500"
            />
            <StatCard
              title="Total Categories"
              value={categories}
              trend="-1.1%"
              icon={<ReviewIcon />}
              color="bg-yellow-100"
              iconColor="text-yellow-500"
            />
            <StatCard
              title="Own Books"
              value={ownBooks}
              trend="+12.4%"
              icon={<NewBookIcon />}
              color="bg-purple-100"
              iconColor="text-purple-500"
            />
          </div>

          {/* Recent Books and Pending Reviews */}
          <div className="">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Recently Added Books
              </h2>
              <RecentBooks recentBooks={recentBooks} />
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;
