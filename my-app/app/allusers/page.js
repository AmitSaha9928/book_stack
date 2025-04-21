"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import useRequest from "../api/useRequest";
import Swal from "sweetalert2";
import ProtectedRoute from "../hooks/ProtectedRoute";

/**
 * UsersPage Component
 * Displays a table of all users with their details and provides user management functionality
 * Protected route that requires authentication
 */
function UsersPage() {
  // State management for users data and UI states
  const [users, setUsers] = useState([]); // Stores the list of users fetched from API
  const [loading, setLoading] = useState(true); // Controls loading indicator visibility
  const [error, setError] = useState(null); // Stores any error messages during API calls
  const [postRequest, getRequest] = useRequest(); // Custom hooks for API requests
  const [dltUser, setDltUser] = useState(false); // Toggle state to trigger user list refresh after deletion

  /**
   * Handles user deletion process
   */
  const handleDeleteUser = async (id) => {
    try {
      const response = await getRequest(`/users/delById/${id}`);
      console.log(response, "response");
      if (response?.data?.error === false) {
        // Show success message and refresh user list
        Swal.fire("Successfully Removed").then(() => {
          setDltUser(!dltUser);
        });
      }
    } catch (error) {
      console.log("Failed to Delete User", error);
    }
  };

  /**
   * Fetches all users data when component mounts or after deletion
   * Uses useEffect hook with dltUser dependency to trigger refresh
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getRequest("/users/src/all");
        // Simulate loading with a short delay
        setTimeout(() => {
          setUsers(response?.data?.data);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dltUser]);

  /**
   * Converts numeric role values to human-readable role names
   */
  const getRoleName = (roleNumber) => {
    switch (roleNumber) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Unknown";
    }
  };

  return (
    // Wrap component with authentication check
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Users</h1>
          </div>

          {/* Conditional rendering based on loading and error states */}
          {loading ? (
            // Loading spinner
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            // Error message display
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            // Users table with responsive design
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table body with user data */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        {/* User identity column with avatar and name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user?.userImg}`}
                                alt={user.username}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Contact information column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phoneNumber}
                          </div>
                        </td>
                        {/* User role with color-coded badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.userRole === 1
                            ? "bg-purple-100 text-purple-800"
                            : user.userRole === 2
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                          >
                            {getRoleName(user.userRole)}
                          </span>
                        </td>
                        {/* User status with color-coded indicator */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isDeleted ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Deleted
                            </span>
                          ) : user.isActive ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Inactive
                            </span>
                          )}
                        </td>
                        {/* Action buttons column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            {/* Only show delete button for non-deleted users */}
                            {!user.isDeleted && (
                              <button
                                onClick={() => handleDeleteUser(user?._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Empty state when no users are found
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default UsersPage;