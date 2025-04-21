"use client";

import MainLayout from "@/app/layout/MainLayout";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthProvider";
import useRequest from "../api/useRequest";
import Swal from "sweetalert2";
import ProtectedRoute from "../hooks/ProtectedRoute";

// Component for all SVG icons used throughout the book form
// Each function returns an SVG icon with appropriate styling
function BookIcon() {
  return (
    <svg
      className="w-8 h-8 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="w-5 h-5 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-10 h-10 mb-3 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  );
}

function page() {
  // Access authentication context for user data and loading state
  const { user, loading, setLoading } = useContext(AuthContext);
  // Custom hook for API requests
  const [postRequest, getRequest] = useRequest();
  const router = useRouter();
  
  // State management for various component needs
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Initial state for the book form data
  const [bookData, setBookData] = useState({
    bookTitle: "",
    bookSummary: "",
    bookPrice: "",
    amountOfPage: "",
    authorName: "",
    categoryId: "",
    bookThumbnail: null,
    status: true,
  });

  // Fetch all book categories on component mount
  const fetchAllCategories = async () => {
    try {
      const response = await getRequest("/categories/src/all");
      setCategories(response?.data?.data);
    } catch (error) {
      console.log("Fetch All Categories", error);
      if (error?.response?.data?.error === true) {
        setCategories([]);
      }
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Handle changes to form inputs and update state accordingly
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData({
      ...bookData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image file selection and generate preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData({
        ...bookData,
        bookThumbnail: file,
      });

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler with validation and API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      // Validate required fields before submission
      if (
        !bookData.bookTitle ||
        !bookData.bookSummary ||
        !bookData.bookPrice ||
        !bookData.amountOfPage ||
        !bookData.authorName ||
        !bookData.categoryId ||
        !bookData.bookThumbnail
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Prepare FormData object for file upload and form submission
      const formData = new FormData();
      formData.append("bookTitle", bookData.bookTitle);
      formData.append("bookSummary", bookData.bookSummary);
      formData.append("bookPrice", bookData.bookPrice);
      formData.append("amountOfPage", bookData.amountOfPage);
      formData.append("authorName", bookData.authorName);
      formData.append("insertionUserId", user?.user?._id);
      formData.append("categoryId", bookData.categoryId);
      formData.append("bookThumbnail", bookData.bookThumbnail);
      formData.append("status", bookData.status);

      const response = await postRequest("/books/insert", formData);

      // Show success message and redirect on successful submission
      if (response?.data?.error === false) {
        Swal.fire("Successfully Added the Book").then(() => {
          router.push("/allbooks");
        });
      }

      setFormSuccess("Book added successfully!");

      // Reset form and redirect after short delay
      setTimeout(() => {
        setBookData({
          bookTitle: "",
          bookSummary: "",
          bookPrice: "",
          amountOfPage: "",
          authorName: "",
          categoryId: "",
          bookThumbnail: null,
          status: true,
        });
        setImagePreview(null);
        router.push("/allbooks");
      }, 2000);
    } catch (error) {
      setFormError(error.message || "Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-8">
              <BookIcon />
              <h1 className="text-2xl font-bold text-gray-800 ml-3">
                Add New Book
              </h1>
            </div>

            {/* Error notification banner */}
            {formError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <ErrorIcon />
                  <p className="ml-3 text-red-700">{formError}</p>
                </div>
              </div>
            )}

            {/* Success notification banner */}
            {formSuccess && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center">
                  <SuccessIcon />
                  <p className="ml-3 text-green-700">{formSuccess}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book title field - spans full width */}
                <div className="col-span-2">
                  <label
                    htmlFor="bookTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    value={bookData.bookTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter book title"
                    required
                  />
                </div>

                {/* Author name field */}
                <div>
                  <label
                    htmlFor="authorName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={bookData.authorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                {/* Category dropdown populated from API */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={bookData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price field with validation for numeric values */}
                <div>
                  <label
                    htmlFor="bookPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="bookPrice"
                    name="bookPrice"
                    value={bookData.bookPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="29.99"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Page count field */}
                <div>
                  <label
                    htmlFor="amountOfPage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Pages <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amountOfPage"
                    name="amountOfPage"
                    value={bookData.amountOfPage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter total pages"
                    min="1"
                    required
                  />
                </div>

                {/* Book summary text area - spans full width */}
                <div className="col-span-2">
                  <label
                    htmlFor="bookSummary"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Book Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bookSummary"
                    name="bookSummary"
                    value={bookData.bookSummary}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter a summary or description of the book"
                    required
                  ></textarea>
                </div>

                {/* Image upload section with preview functionality */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Cover Image <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload area with drag-and-drop support */}
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="bookThumbnail"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or JPEG (MAX. 2MB)
                          </p>
                        </div>
                        <input
                          id="bookThumbnail"
                          name="bookThumbnail"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                    </div>
                    
                    {/* Image preview area with remove option */}
                    <div className="flex items-center justify-center">
                      {imagePreview ? (
                        <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-md">
                          <img
                            src={imagePreview}
                            alt="Book cover preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setBookData({ ...bookData, bookThumbnail: null });
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 text-sm text-center px-4">
                            Cover preview will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form action buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      <span className="ml-2">Add Book</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default page;