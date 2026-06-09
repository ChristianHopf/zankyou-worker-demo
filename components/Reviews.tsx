"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

type Review = {
  score: number;
  review: string;
};

type Pagination = {
  has_next_page: boolean;
  last_visible_page: number;
};

export default function Reviews({ page: initialPage = 1 }: { page?: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.jikan.moe/v4/anime/23283/reviews?page=${page}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        // if (!res.ok) console.log("NOT OKAY THROWING ERROR!");

        const data = await res.json();

        // Server wraps 500 errors in 200 responses?
        if (data.status > 299) throw new Error("Failed to fetch reviews");

        if (cancelled) return;

        setReviews(data.data);
        setHasNextPage(data.pagination?.has_next_page ?? false);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("Failed to fetch reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReviews();

    // return () => {
    //   cancelled = true;
    // };
  }, [page]);

  if (loading) return <p className="text-center py-8 mx-auto">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold mb-4">Reviews</h1>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => {
            setPage((p) => Math.max(1, p - 1));
          }}
          disabled={page <= 1 || loading}
          className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => {
            setPage((p) => p + 1);
          }}
          disabled={!hasNextPage || loading}
          className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md"
        >
          Next
        </button>
      </div>
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
