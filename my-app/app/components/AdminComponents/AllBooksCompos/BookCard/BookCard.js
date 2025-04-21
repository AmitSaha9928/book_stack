"use client";

import useRequest from "@/app/api/useRequest";
import Link from "next/link";
import { useEffect, useState } from "react";

// SVG Star Components
const FullStar = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#FBBF24"
    stroke="#FBBF24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EmptyStar = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D1D5DB"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HalfStar = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FBBF24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="url(#halfFill)"
    />
  </svg>
);

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [postRequest, getRequest] = useRequest();

  const fetchReviews = async () => {
    try {
      const response = await getRequest(`/reviews/srcbyid/${book?._id}`);
      setReviews(response?.data?.data);
    } catch (error) {
      console.log("Failed to Fetch the Reviews", error);
    }
  };

  const fetchBookRating = async () => {
    if (!book?._id) return;

    setIsRatingLoading(true);
    try {
      const response = await getRequest(`/ratings/average/${book._id}`);
      if (response?.data?.data) {
        setRating({
          averageRating: response.data.data.averageRating || 0,
          totalRatings: response.data.data.totalRatings || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching book rating:", error);
    } finally {
      setIsRatingLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchBookRating();
  }, [book?._id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FullStar key={`star-${i}`} />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<HalfStar key="half-star" />);
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<EmptyStar key={`empty-star-${i}`} />);
    }

    return stars;
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${book?.bookImg}`}
            alt={`Cover of ${book.title} by ${book.author}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-start mb-2">
            <div className="flex-grow">
              <h3
                className="text-lg font-semibold line-clamp-1"
                title={book?.bookTitle}
              >
                {book?.bookTitle}
              </h3>
              <p className="text-gray-600 text-sm mb-1">{book?.authorName}</p>

              {/* Rating Stars */}
              <div className="flex items-center my-2">
                <div className="flex mr-2">
                  {isRatingLoading ? (
                    <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    renderStars(rating.averageRating)
                  )}
                </div>

                <span className="text-sm text-gray-600">
                  {isRatingLoading ? (
                    <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      {rating.averageRating.toFixed(1)} ({rating.totalRatings})
                    </>
                  )}
                </span>
              </div>

              <p className="text-gray-600 text-sm my-2">
                Total Reviews: {reviews?.length}
              </p>
            </div>
          </div>

          <p
            className="text-gray-700 text-sm mb-3 line-clamp-2"
            title={book.description}
          >
            {book?.bookSummary?.slice(0, 30)}...
          </p>

          <div className="flex items-center mb-3">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              {book.categoryId?.categoryName}
            </span>
          </div>

          <Link href={`/allbooks/${book._id}`}>
            <div className="flex space-x-2">
              <button className="flex-1 border border-blue-300 text-blue-700 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
                <span className="ml-1">Details</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BookCard;
