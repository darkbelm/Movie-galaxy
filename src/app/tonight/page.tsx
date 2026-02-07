"use client";

import { useEffect, useState } from "react";
import { IMG, Movie, tmdb } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

export default function TonightPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("tonight");
    if (raw) {
      const m: Movie = JSON.parse(raw);
      setMovie(m);

      // fetch trailer
      tmdb<{ results: any[] }>(`/movie/${m.id}/videos`).then((r) => {
        const t = r.results?.find(
          (v: any) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (t) setTrailer(t.key);
      });
    }
  }, []);

  if (!movie) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: 20,
        }}
      >
        <span className="icon-inline">
          <GlowIcon name="moon" size={16} className="glow-icon" />
          No movie selected for tonight
        </span>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.95)),
          url(${IMG + movie.backdrop_path}) center/cover`,
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          background: "rgba(0,0,0,.65)",
          padding: 32,
          borderRadius: 24,
          boxShadow: "0 0 80px rgba(124,58,237,.6)",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            marginBottom: 12,
            textShadow: "0 0 20px rgba(124,58,237,.8)",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="moon" size={16} className="glow-icon" />
            Tonight’s Pick
          </span>
        </h1>

        <h2 style={{ fontSize: 28, marginBottom: 6 }}>
          {movie.title || movie.name}
        </h2>

        <p style={{ color: "#facc15", marginBottom: 10 }}>
          <span className="icon-inline">
            <GlowIcon name="star" size={12} className="glow-icon" />
            Rating {movie.vote_average.toFixed(1)}
          </span>
        </p>

        <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.6 }}>
          {movie.overview}
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer}`}
              target="_blank"
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="play" size={14} className="glow-icon" />
                Watch Trailer
              </span>
            </a>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("tonight");
              window.location.href = "/home";
            }}
            style={{
              padding: "10px 20px",
              borderRadius: 20,
              background: "rgba(255,255,255,.1)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="shuffle" size={14} className="glow-icon" />
              Change Movie
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}

