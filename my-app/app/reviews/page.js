"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import useRequest from "../api/useRequest";

function ReviewsPage() {
  const [postRequest, getRequest] = useRequest();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating API call with dummy data
    const fetchReviews = async () => {
      try {
        const response = await getRequest("/reviews/srcall");
        setTimeout(() => {
          setReviews(response?.data?.data);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to fetch reviews");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);



  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Reviews</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Review
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className={`bg-white p-4 rounded-lg shadow ${
                      review.isDeleted ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Book Image */}
                      <div className="w-full md:w-32 mb-4 md:mb-0 md:mr-4">
                        <img
                          src={
                            review.bookId.bookImg || "/images/default-book.png"
                          }
                          alt={review.bookId.bookTitle}
                          className="w-full h-48 md:h-40 object-cover rounded"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h2 className="text-xl font-semibold">
                              {review.bookId.bookTitle}
                            </h2>
                            <p className="text-gray-600">
                              by {review.bookId.authorName}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {/* Status Badge */}
                            {review.isDeleted ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Deleted
                              </span>
                            ) : !review.isActive ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Inactive
                              </span>
                            ) : null}
                          </div>
                        </div>

                       

                        {/* Review Text */}
                        <p className="text-gray-700 mb-4">{review.reviews}</p>

                        {/* Review Metadata */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                              <img
                                src={
                                  review.userId.userImg ||
                                  "/images/default-avatar.png"
                                }
                                alt={review.userId.username}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.userId.firstName} {review.userId.lastName}{" "}
                              (@{review.userId.username})
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-4 space-x-3">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Edit
                          </button>
                          {!review.isDeleted && (
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 text-center text-gray-500 rounded shadow">
                No reviews found
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default ReviewsPage;
