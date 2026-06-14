"use client";

import React from "react";

type Props = {};

function FetchActions({}: Props) {
  return (
    <div>
      {/* <button
    id="worker-button"
    className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
  >
    Run Worker Script
  </button> */}
      <button
        id="new-anime-btn"
        className="bg-zinc-100 hover:bg-zinc-200 hover:cursor-pointer px-2 py-1 rounded-md"
        onClick={fetchNewAnime}
      >
        Fetch new anime
      </button>
    </div>
  );
}

export default FetchActions;
