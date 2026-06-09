// "use client";

import Link from "next/link";
import React from "react";

type Review = {
  score: number;
  review: string;
};

type Pagination = {
  has_next_page: boolean;
  last_visible_page: number;
};

async function fetchReviews(page: number) {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime/23283/reviews?page=${page}`,
    {
      // cache: "no-store",
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch reviews");

  const data = await res.json();
  return {
    reviews: data.data as Review[],
    pagination: data.pagination as Pagination,
  };
}

export default async function ReviewsSSR({ page = 1 }: { page?: number }) {
  let reviews: Review[] = [];
  let pagination: Pagination | undefined;
  try {
    ({ reviews, pagination } = await fetchReviews(page));
  } catch (err) {
    return (
      <p className="text-center text-red-600 py-8">Error loading reviews</p>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-center py-8">No reviews</p>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold mb-4">Reviews</h1>
      <div className="flex items-center gap-4 mb-4">
        {page > 1 ? (
          <Link
            href={`/?page=${page - 1}`}
            className="bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-md"
          >
            Previous
          </Link>
        ) : (
          <span className="px-3 py-1 text-stone-400">Previous</span>
        )}
        <span>
          Page {page}
          {pagination?.last_visible_page
            ? ` of ${pagination.last_visible_page}`
            : ""}
        </span>
        {pagination?.has_next_page ? (
          <Link
            href={`/?page=${page + 1}`}
            className="bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-md"
          >
            Next
          </Link>
        ) : (
          <span className="px-3 py-1 text-stone-400">Next</span>
        )}
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
