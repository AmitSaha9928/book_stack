"use client";

// Import necessary libraries and components
import useRequest from "@/app/api/useRequest";
import { AuthContext } from "@/app/context/AuthProvider";
import ProtectedRoute from "@/app/hooks/ProtectedRoute";
import MainLayout from "@/app/layout/MainLayout";
import React, { useState, useEffect, use, useContext } from "react";
import Swal from "sweetalert2"; // For displaying toast notifications

/**
 * Loading spinner component displayed during data fetching operations
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-10 w-10 text-blue-600"
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
  );
}

/**
 * Icon displayed when a book is not found
 */
function BookNotFoundIcon() {
  return (
    <svg
      className="w-16 h-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Icon for displaying book price information
 */
function PriceIcon() {
  return (
    <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Icon for displaying book page count information
 */
function PagesIcon() {
  return (
    <svg
      className="w-6 h-6 text-blue-500"
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

/**
 * Icon for displaying book publication date information
 */
function CalendarIcon() {
  return (
    <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * Star icon component for ratings display and selection
 */
function StarIcon({ filled, onClick, hovered }) {
  return (
    <svg
      className={`w-5 h-5 ${
        filled
          ? "text-yellow-400"
          : hovered
          ? "text-yellow-200"
          : "text-gray-300"
      } cursor-pointer`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
  );
}

/**
 * Component to display a readonly star rating
 */
function ReviewStars({ rating }) {
  const numericRating = Number(rating) || 0;
  const safeRating = Math.min(5, Math.max(0, numericRating));

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < safeRating} />
      ))}
    </div>
  );
}

/**
 * Interactive star rating selector component
 */
function RatingSelector({ rating, setRating }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= rating}
          hovered={star <= hoveredRating}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ))}
    </div>
  );
}

/**
 * Main Book Details Page component
 * Displays a single book with its details, reviews, and rating system
 */
function BookDetailsPage({ params }) {
  // Custom hook for API requests
  const [postRequest, getRequest] = useRequest();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  // State management
  const [book, setBook] = useState(null); // Book details
  const { user, loading, setLoading } = useContext(AuthContext); // User authentication context
  const [reviews, setReviews] = useState([]); // Book reviews
  const [ratings, setRatings] = useState([]); // Book ratings
  const [reviewText, setReviewText] = useState(""); // Current review text input
  const [submitting, setSubmitting] = useState(false); // Form submission state
  const [crtRv, setCrtRv] = useState(false); // Toggle to refresh reviews/ratings
  const [rating, setRating] = useState(0); // Current rating input
  const [userExistingRating, setUserExistingRating] = useState(null); // User's existing rating if any
  const [userExistingReview, setUserExistingReview] = useState(null); // User's existing review if any
  const [averageRating, setAverageRating] = useState(0); // Calculated average rating
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle

  /**
   * Fetches specific book details from the API
   */
  const fetchSpecificBook = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`/books/srcbyid/${id}`);
      setBook(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log("Fetch Specific book error", error);
      setLoading(false);
    }
  };

  /**
   * Fetches all reviews for the current book
   * Also identifies if the current user has an existing review
   */
  const fetchReviews = async () => {
    try {
      const response = await getRequest(`/reviews/srcbyid/${id}`);
      setReviews(response?.data?.data);
      if (user?.user?._id && response?.data?.data) {
        // Check if the current user has already reviewed this book
        const existingReview = response.data.data.find(
          (review) => review.userId?._id === user.user._id
        );
        if (existingReview) {
          setUserExistingReview(existingReview);
          if (isEditing) {
            setReviewText(existingReview.reviews);
          }
        } else {
          setUserExistingReview(null);
          if (!isEditing) {
            setReviewText("");
          }
        }
      }
    } catch (error) {
      console.log("Fetch Reviews Failed", error);
    }
  };

  /**
   * Fetches all ratings for the current book
   * Calculates the average rating and identifies the user's existing rating
   */
  const fetchRatings = async () => {
    try {
      const response = await getRequest(`/ratings/srcbybookid/${id}`);
      if (response?.data?.error === false && response?.data?.data) {
        setRatings(response.data.data);
        
        // Calculate average rating
        const validRatings = response.data.data.filter((r) => r.ratings);
        if (validRatings.length > 0) {
          const sum = validRatings.reduce(
            (acc, curr) => acc + Number(curr.ratings),
            0
          );
          setAverageRating((sum / validRatings.length).toFixed(1));
        }
        
        // Check if the current user has already rated this book
        if (user?.user?._id) {
          const userRating = response.data.data.find(
            (r) => r.userId?._id === user.user._id
          );
          if (userRating) {
            setUserExistingRating(userRating);
            setRating(Number(userRating.ratings));
          } else {
            setUserExistingRating(null);
            if (!isEditing) {
              setRating(0);
            }
          }
        }
      }
    } catch (error) {
      console.log("Fetch Ratings Failed", error);
    }
  };

  // Fetch book details when the component mounts or book ID changes
  useEffect(() => {
    fetchSpecificBook();
  }, [params.id]);

  // Fetch reviews and ratings when user logs in or when a review/rating is added/updated
  useEffect(() => {
    if (user?.user?._id) {
      fetchReviews();
      fetchRatings();
    }
  }, [crtRv, user?.user?._id]);

  /**
   * Handles submission of a review and rating together
   * Creates new or updates existing review and rating
   */
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!reviewText.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a review text!",
      });
      return;
    }

    if (rating === 0) {
      Swal.fire({
        icon: "error",
        title: "Rating Required",
        text: "Please select a star rating before submitting your review.",
      });
      return;
    }

    try {
      setSubmitting(true);
      let ratingResponse;
      const ratingData = {
        userId: user?.user?._id,
        bookId: id,
        ratings: rating,
      };

      // Update or create rating
      if (userExistingRating) {
        ratingResponse = await postRequest(
          `/ratings/update/${userExistingRating._id}`,
          ratingData
        );
      } else {
        ratingResponse = await postRequest("/ratings/crt", ratingData);
      }

      if (ratingResponse?.data?.error === false) {
        const reviewData = {
          userId: user?.user?._id,
          bookId: id,
          reviews: reviewText,
        };

        // Update or create review
        let reviewResponse;
        if (userExistingReview) {
          reviewResponse = await postRequest(
            `/reviews/update/${userExistingReview._id}`,
            reviewData
          );
        } else {
          reviewResponse = await postRequest("/reviews/crt", reviewData);
        }

        if (reviewResponse?.data?.error === false) {
          // Refresh data and reset state
          setCrtRv(!crtRv);
          setIsEditing(false);

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: userExistingReview
              ? "Your review and rating have been updated successfully."
              : "Your review and rating have been added successfully.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to submit review. Please try again.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit rating. Please try again.",
        });
      }

      setSubmitting(false);
    } catch (error) {
      console.log("Submit review/rating error", error);
      setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit. Please try again.",
      });
    }
  };

  /**
   * Handles submission of a rating without a review
   * Creates new or updates existing rating
   */
  const handleRatingOnly = async () => {
    if (rating === 0) {
      Swal.fire({
        icon: "error",
        title: "Rating Required",
        text: "Please select a star rating.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const ratingData = {
        userId: user?.user?._id,
        bookId: id,
        ratings: rating, 
      };

      // Update or create rating
      let ratingResponse;
      if (userExistingRating) {
        ratingResponse = await postRequest(
          `/ratings/update/${userExistingRating._id}`,
          ratingData
        );
      } else {
        ratingResponse = await postRequest("/ratings/crt", ratingData);
      }

      if (ratingResponse?.data?.error === false) {
        // Refresh data
        setCrtRv(!crtRv);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: userExistingRating
            ? "Your rating has been updated successfully."
            : "Your rating has been submitted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit rating. Please try again.",
        });
      }

      setSubmitting(false);
    } catch (error) {
      console.log("Submit rating error", error);
      setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit rating. Please try again.",
      });
    }
  };

  /**
   * Cancels edit mode and resets the review text
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setReviewText("");
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  // Show "book not found" message if the book doesn't exist
  if (!book && !loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <BookNotFoundIcon />
          <h1 className="text-2xl font-bold mt-6">Book Not Found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find the book you're looking for.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="">
          {/* Hero section with book cover and key details */}
          <div className="relative mb-12 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop')] bg-cover opacity-20"></div>
            <div className="relative z-10 px-8 py-16 md:px-16 flex flex-col md:flex-row items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${book?.bookImg}`}
                alt={book.bookTitle}
                className="w-64 h-auto rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-blue-400/30"
              />
              <div className="md:ml-12 mt-8 md:mt-0 text-white">
                <div className="inline-block px-3 py-1 bg-blue-500 bg-opacity-70 rounded-full text-sm font-medium mb-4">
                  {book.categoryId.categoryName}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {book.bookTitle}
                </h1>
                <div className="flex items-center mb-2">
                  <span className="text-lg">by </span>
                  <span className="ml-2 text-xl font-semibold">
                    {book.authorName}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  {/* Display overall rating */}
                  <div className="flex items-center">
                    <ReviewStars rating={averageRating} />
                    <span className="ml-2 text-sm font-medium">
                      {averageRating > 0
                        ? `${averageRating} out of 5`
                        : "No ratings yet"}
                      {ratings.length > 0 &&
                        ` (${ratings.length} ${
                          ratings.length === 1 ? "rating" : "ratings"
                        })`}
                    </span>
                  </div>
                </div>
                {/* Book metadata cards - price, pages, publication date */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center bg-white text-black bg-opacity-20 px-4 py-2 rounded-lg">
                    <PriceIcon />
                    <div className="ml-2">
                      <p className="text-xs opacity-70">Price</p>
                      <p className="font-bold">${book.bookPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg text-black">
                    <PagesIcon />
                    <div className="ml-2">
                      <p className="text-xs opacity-70">Pages</p>
                      <p className="font-bold">{book.amountOfPage}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg text-black">
                    <CalendarIcon />
                    <div className="ml-2">
                      <p className="text-xs opacity-70">Published</p>
                      <p className="font-bold">
                        {new Date(book.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb navigation */}
          <nav className="flex mb-8 text-sm text-gray-500">
            <a
              href="/dashboard"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </a>
            <span className="mx-2">/</span>
            <a
              href="/allbooks"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Books
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{book.bookTitle}</span>
          </nav>

          <div className="animate-fadeIn">
            {/* Book description section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                About this Book
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {book.bookSummary}
              </p>
            </div>

            {/* Reviews and Ratings Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Reviews & Ratings
              </h2>

              {/* Display existing reviews with associated ratings */}
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6 mb-10">
                  {reviews.map((review) => {
                    // Find matching rating for this review
                    const reviewRating = ratings.find(
                      (r) => r.userId?._id === review.userId?._id
                    );
                    const ratingValue = reviewRating
                      ? Number(reviewRating.ratings)
                      : 0;

                    return (
                      <div
                        key={review._id}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-center mb-2">
                          <div className="font-medium text-gray-800">
                            {review.userId?.username}
                          </div>
                          <div className="ml-4 text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mb-2">
                          <ReviewStars rating={ratingValue} />
                        </div>
                        <p className="text-gray-700">{review.reviews}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg mb-10">
                  <p className="mt-4 text-gray-600">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}

              {/* Add new review or Edit existing review form */}
              {!userExistingReview || isEditing ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    {isEditing ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  {user?.user ? (
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Your Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <RatingSelector
                            rating={rating}
                            setRating={setRating}
                          />
                          <span className="ml-2 text-sm text-gray-500">
                            {rating > 0
                              ? `${rating} out of 5 stars`
                              : "Select a rating"}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="review"
                          className="block text-gray-700 mb-2"
                        >
                          Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="review"
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {submitting
                            ? "Submitting..."
                            : isEditing
                            ? "Update Review"
                            : "Submit Review"}
                        </button>

                        {/* Cancel button only shown in edit mode */}
                        {isEditing && (
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600">
                        Please log in to leave a review.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-700 mb-4">
                    You have already reviewed this book. Would you like to edit
                    your review?
                  </p>
                </div>
              )}

              {/* Rating-only option for users who haven't rated yet */}
              {!userExistingRating && !userExistingReview && user?.user && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Just want to rate this book?
                  </h4>
                  <div className="flex items-center">
                    <RatingSelector rating={rating} setRating={setRating} />
                    <button
                      onClick={handleRatingOnly}
                      disabled={submitting || rating === 0}
                      className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Rating Only"}
                    </button>
                  </div>
                </div>
              )}

              {/* Update Rating option for users who have rated but not reviewed */}
              {userExistingRating &&
                !userExistingReview &&
                !isEditing &&
                user?.user && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Update your rating
                    </h4>
                    <div className="flex items-center">
                      <RatingSelector rating={rating} setRating={setRating} />
                      <button
                        onClick={handleRatingOnly}
                        disabled={submitting || rating === 0}
                        className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Updating..." : "Update Rating"}
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default BookDetailsPage;