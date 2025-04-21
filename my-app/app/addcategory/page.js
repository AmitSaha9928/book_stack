"use client";

import React, { useContext, useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import useRequest from "../api/useRequest";
import { AuthContext } from "../context/AuthProvider";
import ProtectedRoute from "../hooks/ProtectedRoute";

function Page() {
  // Access auth context for loading state management
  const { loading, setLoading } = useContext(AuthContext);
  // Custom API request hooks for GET and POST operations
  const [postRequest, getRequest] = useRequest();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", code: "" });
  const [error, setError] = useState("");

  /**
   * Fetches all categories from the API
   * Sets empty array if response contains error
   */
  const fetchAllCategories = async () => {
    try {
      const response = await getRequest("/categories/src/all");
      setCategories(response?.data?.data);
    } catch (error) {
      console.log("Fetch All Categories Error", error?.response?.data);
      if (error?.response?.data?.error === true) {
        setCategories([]);
      }
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  /**
   * Deletes a category by ID
   * Refreshes the category list after successful deletion
   */
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await getRequest(`/categories/rmv/${id}`);
      await fetchAllCategories();
      setLoading(false);
    } catch (error) {
      console.log("Delete Category Error", error?.response?.data);
      setLoading(false);
    }
  };

  /**
   * Adds a new category after validation
   * Handles input validation and API errors
   * Resets form and closes modal on success
   */
  const addCategory = async () => {
    // Validate category name
    if (!newCategory.name || !newCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    // Validate category code
    if (!newCategory.code || !newCategory.code.trim()) {
      setError("Category code is required");
      return;
    }

    // Check for duplicate category code
    if (
      categories.some((category) => category.categoryCode === newCategory.code)
    ) {
      setError("Category code must be unique");
      return;
    }

    try {
      setLoading(true);
      await postRequest("/categories/crt", {
        categoryName: newCategory.name,
        categoryCode: newCategory.code,
      });

      await fetchAllCategories();

      // Reset form state and close modal
      setNewCategory({ name: "", code: "" });
      setError("");
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.log("Add Category Error", error?.response?.data);
      setError(error?.response?.data?.message || "Failed to add category");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="mx-auto">
          {/* Header section with title and Add Category button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Categories</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Add Category
            </button>
          </div>

          {/* Categories table container */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {categories?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category?.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category?.categoryCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => deleteCategory(category._id)}
                            className="text-red-600 hover:text-red-800 font-medium transition duration-300 hover:cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Empty state when no categories exist
              <div className="py-8 text-center text-gray-500">
                No categories found. Add a new category to get started.
              </div>
            )}
          </div>
        </div>

        {/* Modal for adding new category */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Category
                </h3>
              </div>

              <div className="p-6">
                {/* Error message display */}
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Category name input field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                {/* Category code input field with help text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Code
                  </label>
                  <input
                    type="text"
                    value={newCategory.code}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter unique category code"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Code must be unique (e.g., BOOK001, ELEC002)
                  </p>
                </div>

                {/* Modal action buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewCategory({ name: "", code: "" });
                      setError("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
                  >
                    {loading ? <span>Loading...</span> : <span>Create</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}

export default Page;