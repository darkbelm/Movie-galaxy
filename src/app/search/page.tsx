"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const validYear = (m: Movie) =>
  m.release_date && new Date(m.release_date).getFullYear() >= 2005;

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";

  const [query, setQuery] = useState(q);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    tmdb<Res>(`/search/movie?query=${encodeURIComponent(q)}`)
      .then((r) => setMovies(r.results.filter(validYear)))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main style={{ padding: 32, minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 30, marginBottom: 20 }}>
        <span className="icon-inline">
          <GlowIcon name="search" size={18} className="glow-icon" />
          Search
        </span>
      </h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }
        }}
        style={{
          width: "100%",
          maxWidth: 600,
          padding: "12px 18px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.6)",
          color: "white",
          marginBottom: 32,
        }}
      />

      {loading && (
        <div style={{ color: "#aaa" }}>
          <span className="icon-inline">
            <GlowIcon name="search" size={14} className="glow-icon" />
            Searching...
          </span>
        </div>
      )}

      {!loading && !q && (
        <div style={{ marginTop: 80, textAlign: "center", color: "#aaa" }}>
          <img src="/icon.svg" alt="" style={{ width: 64, height: 64, margin: "0 auto 10px", filter: "drop-shadow(0 0 16px rgba(124,58,237,.9))" }} />
          <h2>Start searching</h2>
        </div>
      )}

      {!loading && q && movies.length === 0 && (
        <div style={{ marginTop: 80, textAlign: "center", color: "#aaa" }}>
          <img src="/icon.svg" alt="" style={{ width: 64, height: 64, margin: "0 auto 10px", filter: "drop-shadow(0 0 16px rgba(124,58,237,.9))" }} />
          <h2>No results found</h2>

          <button
            onClick={() => router.push("/categories")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 20,
              background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
              border: "none",
              color: "white",
            }}
          >
            Browse Categories
          </button>
        </div>
      )}

      {movies.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
            gap: 24,
          }}
        >
          {movies.map((m) => (
            <div key={m.id}>
              {/* ===== CLICKABLE POSTER → DETAILS PAGE ===== */}
              <Link href={`/movie/${m.id}`}>
                <img
                  src={
                    m.poster_path
                      ? IMG + m.poster_path
                      : "https://via.placeholder.com/300x450"
                  }
                  style={{ width: "100%", borderRadius: 14, cursor: "pointer" }}
                  alt={m.title}
                />
              </Link>

              <div style={{ color: "white", fontSize: 13, marginTop: 6 }}>
                {m.title}
              </div>

              <div style={{ color: "#facc15", fontSize: 12 }}>
                <span className="icon-inline">
                  <GlowIcon name="star" size={12} className="glow-icon" />
                  Rating {m.vote_average.toFixed(1)}
                </span>
              </div>

              {/* ===== LOVE BUTTON ===== */}
              <button
                onClick={() => saveToList(m)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "6px 0",
                  borderRadius: 12,
                  background: "rgba(255, 0, 90, .18)",
                  border: "1px solid rgba(255, 0, 90, .25)",
                  color: "white",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="heart" size={14} className="glow-icon" />
                  Add to My List
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function saveToList(movie: Movie) {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];

  if (!list.find((m) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
  }
}


