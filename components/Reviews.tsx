"use client";

import { notFound } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Review = {
  score: number;
  review: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/anime/23283/reviews?page=1",
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold mb-4">Reviews</h1>
      {reviews.map((review, index) => (
        <div
          key={index}
          className="flex flex-row w-full justify-between bg-stone-100 px-4 py-2 mb-8 h-64 overflow-y-auto"
        >
          <p className="text-3xl font-semibold">{review.score}/10</p>
          <p className="text-lg max-w-3xl overflow-y-auto">{review.review}</p>
        </div>
      ))}
    </div>
  );
}
