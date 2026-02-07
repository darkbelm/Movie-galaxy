"use client";

import { useEffect, useState, useRef } from "react";
import { use } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const MOVIE_GENRES: Record<string, number> = {
  action: 28,
  comedy: 35,
  horror: 27,
  romance: 10749,
  scifi: 878,
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ CORRECT FOR NEXT 16
  const { slug } = use(params);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popular");
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  // reset when slug / sort changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [slug, sort]);

  // fetch movies
  useEffect(() => {
    if (!hasMore) return;

    let url = "";

    if (MOVIE_GENRES[slug]) {
      const sortBy =
        sort === "rating"
          ? "vote_average.desc&vote_count.gte=200"
          : sort === "newest"
          ? "primary_release_date.desc"
          : "popularity.desc";

      url = `/discover/movie?with_genres=${MOVIE_GENRES[slug]}&sort_by=${sortBy}&primary_release_date.gte=2002-01-01&page=${page}`;
    }

    if (slug === "series") {
      url = `/tv/popular?page=${page}`;
    }

    if (slug === "anime") {
      url = `/discover/tv?with_original_language=ja&with_genres=16&page=${page}`;
    }

    tmdb<Res>(url).then((r) => {
      if (!r.results.length) setHasMore(false);
      setMovies((prev) => [...prev, ...r.results]);
    });
  }, [slug, sort, page]);

  // infinite scroll observer
  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((p) => p + 1);
      }
    });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const hero = movies[0];

  return (
    <div>
      {/* HERO */}
      {hero?.backdrop_path && (
        <div
          style={{
            minHeight: "50vh",
            background: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.9)), url(${IMG}${hero.backdrop_path}) center/cover`,
            display: "flex",
            alignItems: "end",
            padding: "2rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
          }}
        >
          <h1 style={{ color: "white", fontWeight: 700 }}>
            {slug.toUpperCase()}
          </h1>
        </div>
      )}

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          ["popular", "Popular"],
          ["rating", "Top Rated"],
          ["newest", "Newest"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            style={{
              padding: "6px 12px",
              background: sort === k ? "#7c3aed" : "transparent",
              color: "white",
              border: "1px solid #444",
              borderRadius: 6,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="row g-3">
        {movies.map((m) => {
          const name = m.title || (m as any).name || "Untitled";

          return (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={m.id}>
              <a href={`/movie/${m.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#111", padding: 6, borderRadius: 6 }}>
                  <img
                    src={
                      m.poster_path
                        ? IMG + m.poster_path
                        : "https://via.placeholder.com/500x750?text=No+Poster"
                    }
                    style={{ width: "100%", borderRadius: 4 }}
                    alt={name}
                  />
                  <div
                    style={{
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: 6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {name}
                  </div>
                  <div style={{ color: "#f5c518", fontSize: 12 }}>
                    <span className="icon-inline">
                      <GlowIcon name="star" size={12} className="glow-icon" />
                      Rating {m.vote_average?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>

      {/* LOADER */}
      {hasMore && (
        <div
          ref={loader}
          style={{ color: "white", textAlign: "center", margin: 40 }}
        >
          Loading more…
        </div>
      )}
    </div>
  );
}
