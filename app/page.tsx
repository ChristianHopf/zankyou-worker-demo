import Reviews from "@/components/Reviews";
import Image from "next/image";
import { notFound } from "next/navigation";

async function fetchAnimeData() {
  const res = await fetch("https://api.jikan.moe/v4/anime/23283");

  if (!res.ok) notFound();

  return res.json();
}

export default async function Home() {
  const data = await fetchAnimeData();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center py-16 px-16 gap-16 sm:items-start">
        <div className="flex flex-row items-center gap-6 text-center sm:items-start sm:text-left">
          <Image
            src={data.data.images.webp.large_image_url}
            alt={data.data.title}
            width={500}
            height={500}
          />
          <div className="flex flex-col">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold">{data.data.title}</h1>
              <p className="text-stone-700">{data.data.title_english}</p>
              <p className="text-stone-700">{data.data.title_japanese}</p>
            </div>

            <p className="text-lg">{data.data.synopsis}</p>
          </div>
        </div>

        <Reviews />
      </main>
    </div>
  );
}
