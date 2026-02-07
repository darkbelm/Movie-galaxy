"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";
import { categories } from "@/lib/categories";

type Res = { results: Movie[] };

const validYear = (m: Movie) =>
  m.release_date && new Date(m.release_date).getFullYear() >= 2005;

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categories.find((c) => c.slug === slug);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!category) return;

    tmdb<Res>(
      `/discover/movie?with_genres=${category.genre}&sort_by=popularity.desc`
    ).then((r) => setMovies(r.results.filter(validYear)));
  }, [category]);

  if (!category) {
    return (
      <p style={{ color: "white", padding: 32 }}>
        Category not found.
      </p>
    );
  }

  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ color: "white", fontSize: 30, marginBottom: 24 }}>
        {category.icon} {category.name}
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
              src={
                m.poster_path
                  ? IMG + m.poster_path
                  : "https://via.placeholder.com/300x450"
              }
              style={{ width: "100%", borderRadius: 14 }}
            />

            <div style={{ color: "white", fontSize: 13, marginTop: 6 }}>
              {m.title}
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
