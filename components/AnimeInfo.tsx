"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Anime = {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  synopsis: string | null;
  images: { webp: { large_image_url: string } };
};

const RANDOM_URL = "https://api.jikan.moe/v4/random/anime";

function AnimeInfo() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [cacheBehavior, setCacheBehavior] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnime(url: string, init?: RequestInit) {
    const startTime = performance.now();
    try {
      setLoading(true);

      const res = await fetch(url, init);
      setDuration(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`Failed to fetch anime, status: ${res.status}`);
      }

      const data = await res.json();
      setAnime(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch anime");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnime(RANDOM_URL, { cache: "no-store" });
  }, []);

  const fetchNewAnime = () => loadAnime(RANDOM_URL, { cache: "no-store" });

  const refetchAnime = (behavior: RequestCache | undefined = "default") => {
    if (anime)
      loadAnime(`https://api.jikan.moe/v4/anime/${anime.mal_id}`, {
        cache: behavior,
      });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:items-start sm:text-left">
        {anime && (
          <Image
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            width={500}
            height={500}
            className="w-48 sm:w-64 lg:w-auto shrink-0"
          />
        )}

        <div className="flex flex-col">
          {error ? (
            <p>{error}</p>
          ) : !anime ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                  {anime.title}
                </h1>
                <p className="text-stone-700">{anime.title_english}</p>
                <p className="text-stone-700">{anime.title_japanese}</p>
              </div>

              <p className="text-base sm:text-lg">{anime.synopsis}</p>
            </>
          )}
        </div>
      </div>
      <p>Duration: {duration?.toFixed(2)}ms</p>
      <div className="flex flex-row gap-4">
        <button
          id="new-anime-btn"
          className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
          onClick={fetchNewAnime}
        >
          Fetch New Anime
        </button>
        <button
          id="refetch-btn"
          className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
          onClick={() => {
            refetchAnime();
          }}
        >
          Refetch Anime (Default Cache Behavior)
        </button>
        <button
          id="refetch-btn"
          className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
          onClick={() => {
            refetchAnime("no-store");
          }}
        >
          Refetch Anime (cache: no-store)
        </button>
      </div>
    </>
  );
}

export default AnimeInfo;
