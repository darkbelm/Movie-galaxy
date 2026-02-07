"use client";

import { useEffect, useState } from "react";
import { IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

export default function MyListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("movie-galaxy-list");
    if (raw) setMovies(JSON.parse(raw));
  }, []);

  // EMPTY STATE
  if (movies.length === 0) {
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          textAlign: "center",
        }}
      >
        <img
          src="/icon.svg"
          alt=""
          style={{
            width: 60,
            height: 60,
            marginBottom: 8,
            filter: "drop-shadow(0 0 16px rgba(124,58,237,.9))",
          }}
        />
        <h2>Your list is empty</h2>
        <p style={{ maxWidth: 320, marginTop: 10 }}>
          Save movies you love and come back anytime.
        </p>

        <a
          href="/home"
          style={{
            marginTop: 24,
            padding: "10px 20px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Browse Movies
        </a>
      </main>
    );
  }

  // NORMAL STATE
  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24, color: "white" }}>
        <span className="icon-inline">
          <GlowIcon name="heart" size={18} className="glow-icon" />
          My List
        </span>
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 24,
        }}
      >
        {movies.map((m) => (
          <div key={m.id}>
            <img
              src={IMG + m.poster_path}
              style={{ width: "100%", borderRadius: 14 }}
              alt={m.title}
            />
            <div style={{ color: "white", fontSize: 13, marginTop: 6 }}>
              {m.title || m.name}
            </div>
            <div style={{ color: "#facc15", fontSize: 12 }}>
              <span className="icon-inline">
                <GlowIcon name="star" size={12} className="glow-icon" />
                Rating {m.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

