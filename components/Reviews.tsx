"use client";

import { notFound } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Review = {
  score: number;
  review: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);

        const res = await fetch(
          "https://api.jikan.moe/v4/anime/23283/reviews",
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();

        setReviews(data.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) return <p className="text-center py-8 mx-auto">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;

  return (
    <div data-reviews="true" className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold mb-4">Reviews</h1>
      <button>Page</button>
      {reviews.map((review, index) => (
        <div
          key={index}
          className="w-full bg-stone-100 mb-8 h-64 overflow-y-auto"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between px-4 py-2 min-h-fit gap-2">
            <p className="text-2xl sm:text-3xl lg:text-5xl font-semibold shrink-0">
              {review.score}/10
            </p>
            <p className="text-sm sm:text-base sm:max-w-lg lg:max-w-3xl">
              {review.review}
            </p>
          </div>
        </div>
        // <div
        //   key={index}
        //   className="flex flex-row w-full justify-between bg-stone-100 px-4 py-2 mb-8 h-64 overflow-y-auto"
        // >
        //   <p className="text-3xl sm:text-xl lg:text-5xl font-semibold">
        //     {review.score}/10
        //   </p>
        //   <p className="sm:max-w-lg lg:max-w-3xl overflow-y-auto">
        //     {review.review}
        //   </p>
        // </div>
      ))}
    </div>
  );
}
