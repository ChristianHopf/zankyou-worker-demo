import AnimeInfo from "@/components/AnimeInfo";
import Reviews from "@/components/Reviews";
import ReviewsSSR from "@/components/ReviewsSSR";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center py-8 px-4 sm:py-16 sm:px-16 gap-8 sm:gap-16 sm:items-start">
        <AnimeInfo />

        <p>Rendered at: {new Date().toISOString()}</p>

        <div>
          <button
            id="worker-button"
            className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
          >
            Run Worker Script
          </button>
        </div>

        {/* <div data-reviews-section="true" className="w-full">
          <Reviews />
        </div> */}
      </main>
    </div>
  );
}
