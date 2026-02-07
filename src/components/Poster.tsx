"use client";

import { useEffect, useState } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";

export default function Poster({
  movie,
  onClick,
  showMeta = true,
}: {
  movie: Movie;
  onClick?: () => void;
  showMeta?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    if (!hover) return;

    // Only fetch trailer once per poster (lazy on hover)
    if (trailer !== null) return;

    tmdb<{ results: any[] }>(`/movie/${movie.id}/videos`).then((r) => {
      const t = r.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      setTrailer(t?.key ?? "");
    });
  }, [hover, movie.id, trailer]);

  const canPlay = hover && trailer && trailer.length > 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "transform .35s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          transform: hover ? "scale(1.06)" : "scale(1)",
          transition: "transform .35s ease, box-shadow .35s ease",
          boxShadow: hover
            ? "0 0 55px rgba(124,58,237,.7)"
            : "0 0 30px rgba(0,0,0,.6)",
        }}
      >
        {canPlay ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              border: "none",
              display: "block",
              background: "black",
            }}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={
              movie.poster_path
                ? IMG + movie.poster_path
                : "https://via.placeholder.com/300x450"
            }
            style={{ width: "100%", display: "block" }}
            alt={movie.title || (movie as any).name || "Poster"}
          />
        )}
      </div>

      {showMeta && (
        <>
          <div style={{ fontSize: 13, marginTop: 6, color: "white" }}>
            {movie.title || (movie as any).name}
          </div>
          <div style={{ color: "#facc15", fontSize: 12 }}>
            ⭐ {movie.vote_average?.toFixed?.(1) ?? "—"}
          </div>
        </>
      )}
    </div>
  );
}
