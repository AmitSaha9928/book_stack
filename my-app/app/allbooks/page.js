"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import BookSearchBar from "../components/AdminComponents/AllBooksCompos/BookSearchBar/BookSearchBar";
import BookFilters from "../components/AdminComponents/AllBooksCompos/BookFilters/BookFilters";
import BookCard from "../components/AdminComponents/AllBooksCompos/BookCard/BookCard";
import BooksPagination from "../components/AdminComponents/AllBooksCompos/BooksPagination/BooksPagination";
import useRequest from "../api/useRequest";
import ProtectedRoute from "../hooks/ProtectedRoute";

/**
 * Component for displaying "no results found" icon
 * Uses an SVG warning/alert icon
 */
const NoResultsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);



/**
 * Loading skeleton placeholder for book cards
 * Displays animated placeholder elements while content is loading
 */
const BookCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="bg-gray-200 h-64 w-full"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

/**
 * AllBooks Component - Main page for displaying book collection
 * Features include search, filtering, pagination and protected routes
 */
function AllBooks() {
  // Custom hooks for API requests
  const [postRequest, getRequest] = useRequest();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const booksPerPage = 8; // Number of books to display per page

  /**
   * Fetches all book categories from the API
   * Updates categories state and handles loading/error states
   */
  const fetchAllCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await getRequest("/categories/src/all");
      setCategories(response?.data?.data || []);
    } catch (error) {
      console.log(error, "Fetch All Categories Error");
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  /**
   * Fetches all books from the API
   * Updates books state and handles loading/error states
   */
  const fetchAllBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRequest("/books/src/all");
      setAllBooks(response?.data?.data || []);
    } catch (error) {
      console.log(error, "Fetch All Books Error");
      setError("Failed to load books");
      setAllBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books and categories on component mount
  useEffect(() => {
    fetchAllBooks();
    fetchAllCategories();
  }, []);

  // Reset to first page when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  /**
   * Filter books based on search query and active category filter
   * Checks both book title and author name for search matches
   */
  const filteredBooks = allBooks.filter((book) => {
    if (
      activeFilter !== "all" &&
      book.categoryId !== activeFilter &&
      book.category !== activeFilter
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = book.bookTitle?.toLowerCase().includes(query);
      const matchesAuthor = book.authorName?.toLowerCase().includes(query);

      if (!matchesTitle && !matchesAuthor) {
        return false;
      }
    }

    return true;
  });

  // Calculate pagination values
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  /**
   * Handles page change and scrolls to top for better UX
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  /**
   * Helper function to get category name from category ID
   */
  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "Unknown Category";
  };

  /**
   * Renders the book list section with appropriate UI states:
   * - Loading skeletons when fetching data
   * - Error message with retry option
   * - No results message with reset filters option
   * - Grid of book cards when data is available
   */
  const renderBooksList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4 text-red-500">
            <NoResultsIcon />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchAllBooks}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (currentBooks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <NoResultsIcon />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
          <p className="text-gray-600">
            We couldn't find any books matching your search criteria. Try
            adjusting your filters or search terms.
          </p>
          {(searchQuery || activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentBooks.map((book) => (
          <BookCard key={book._id || book.id} book={book} />
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Collection</h1>
            <p className="text-gray-600">
              Browse through our extensive collection of books
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full ">
              <BookSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>

          <div className="mb-6">
            {!isLoading && (
              <p className="text-gray-600">
                Showing {currentBooks.length} of {filteredBooks.length} books
                {activeFilter !== "all" &&
                  ` in ${getCategoryNameById(activeFilter)}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            )}
          </div>

          {renderBooksList()}

          {!isLoading && filteredBooks.length > booksPerPage && (
            <BooksPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default AllBooks;