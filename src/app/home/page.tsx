"use client";

import { useEffect, useState, type ReactNode } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const from2015 = (m: Movie) =>
  m.release_date && new Date(m.release_date).getFullYear() >= 2015;

/* ================= SAVE ================= */
function saveTonight(m: Movie) {
  localStorage.setItem("tonight", JSON.stringify(m));
  window.location.href = "/tonight";
}

function saveToList(movie: Movie) {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];

  // prevent duplicates
  if (!list.find((m) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
  }
}

/* ================= POSTER (ADDED FEATURE) ================= */
function Poster({
  movie,
  onPick,
  highlight,
}: {
  movie: Movie;
  onPick?: () => void;
  highlight?: boolean;
}) {
  const [trailer, setTrailer] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover) return;

    tmdb<{ results: any[] }>(`/movie/${movie.id}/videos`).then((r) => {
      const t = r.results?.find(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (t) setTrailer(t.key);
      else setTrailer("");
    });
  }, [hover, movie.id]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        cursor: highlight ? "pointer" : "default",
        transition: "transform .35s ease",
        transform: hover ? "scale(1.06)" : "scale(1)",
      }}
      onClick={onPick}
    >
      {hover && trailer ? (
        <iframe
          src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0`}
          style={{
            width: "100%",
            aspectRatio: "2/3",
            borderRadius: 14,
            border: "none",

            /* ✅ ONLY ADDED LINE */
            pointerEvents: "none",
          }}
        />
      ) : (
        <img
          src={movie.poster_path ? IMG + movie.poster_path : "https://via.placeholder.com/300x450"}
          style={{ width: "100%", borderRadius: 14 }}
        />
      )}
    </div>
  );
}


/* ================= ROW ================= */
function Row({
  title,
  url,
}: {
  title: ReactNode;
  url: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    tmdb<Res>(url).then((r) =>
      setMovies(r.results.filter(from2015).slice(0, 12))
    );
  }, [url]);

  return (
    <section style={{ marginBottom: 70 }}>
      <h2 style={{ color: "white", fontSize: 22, marginBottom: 16 }}>
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 24,
        }}
      >
        {movies.map((m) => (
          <div key={m.id}>
            {/* ✅ poster now has hover trailer preview */}
            <Poster movie={m} onPick={() => saveTonight(m)} highlight />

            {/* ✅ KEEP your name + rating exactly */}
            <div style={{ color: "white", fontSize: 13, marginTop: 6 }}>
              {m.title || m.name}
            </div>
            <div style={{ color: "#facc15", fontSize: 12 }}>
              <span className="icon-inline">
                <GlowIcon name="star" size={12} className="glow-icon" />
                Rating {m.vote_average.toFixed(1)}
              </span>
            </div>

            {/* ✅ KEEP your button exactly */}
            <button
              onClick={() => saveTonight(m)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "6px 0",
                borderRadius: 12,
                background: "rgba(124,58,237,.25)",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="moon" size={14} className="glow-icon" />
                Save for tonight
              </span>
            </button>

            {/* ✅ ADDED: LOVE BUTTON (My List) */}
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
                cursor: "pointer",
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
    </section>
  );
}

/* ================= HERO ================= */
function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    tmdb<Res>("/trending/movie/week").then((r) => {
      const valid = r.results.filter(from2015);
      setMovie(valid[0]);
    });
  }, []);

  if (!movie) return null;

  return (
    <section
      style={{
        height: "70vh",
        borderRadius: 26,
        marginBottom: 70,
        padding: 40,
        display: "flex",
        alignItems: "flex-end",
        background: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.95)),
          url(${IMG + movie.backdrop_path}) center/cover`,
      }}
    >
      <div style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 48, color: "white" }}>{movie.title}</h1>
        <p style={{ color: "#facc15", marginBottom: 6 }}>
          <span className="icon-inline">
            <GlowIcon name="star" size={12} className="glow-icon" />
            Rating {movie.vote_average.toFixed(1)}
          </span>
        </p>
        <p style={{ color: "#ddd", fontSize: 14 }}>{movie.overview}</p>
      </div>
    </section>
  );
}

/* ================= TOP BAR ================= */
function TopBar() {
  const [pick, setPick] = useState<Movie | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    tmdb<Res>("/movie/now_playing").then((r) => {
      const recent = r.results.filter(from2015);
      setPick(recent.sort((a, b) => b.vote_average - a.vote_average)[0]);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginBottom: 30,
      }}
    >
      {pick && (
        <button
          onClick={() => saveTonight(pick)}
          style={{
            padding: "10px 18px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            border: "none",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="moon" size={14} className="glow-icon" />
            Tonight’s Pick
          </span>
        </button>
      )}

      <input
        placeholder="Search the galaxy..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && q.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }
        }}
        style={{
          flex: 1,
          padding: "10px 16px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.6)",
          color: "white",
        }}
      />
    </div>
  );
}

/* ================= PAGE ================= */
export default function HomePage() {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "o" && e.ctrlKey) {
        window.location.href = "/surprise";
      }
    };

    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
      }}
    >
      <TopBar />
      <Hero />

      {/* ===== GALAXY ORACLE PROMO ===== */}
      <section
        style={{
          marginBottom: 60,
          padding: 24,
          borderRadius: 22,
          background:
            "linear-gradient(135deg, rgba(124,58,237,.22), rgba(236,72,153,.12))",
          border: "1px solid rgba(255,255,255,.1)",
          boxShadow: "0 0 40px rgba(124,58,237,.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            <span className="icon-inline">
              <GlowIcon name="shuffle" size={18} className="glow-icon" />
              Galaxy Oracle
            </span>
          </h2>
          <p style={{ color: "#bbb", marginTop: 4 }}>
            Don’t scroll. Let destiny choose a 2020+ movie based on your taste.
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/surprise")}
          style={{
            padding: "12px 18px",
            borderRadius: 18,
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
            border: "none",
            color: "white",
            fontWeight: 800,
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="spark" size={16} className="glow-icon" />
            Open Oracle
          </span>
        </button>
      </section>

      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="flame" size={16} className="glow-icon" />
            Trending Now
          </span>
        }
        url="/trending/movie/week"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="film" size={16} className="glow-icon" />
            Popular Movies
          </span>
        }
        url="/movie/popular"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="star" size={16} className="glow-icon" />
            Top Rated
          </span>
        }
        url="/movie/top_rated"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="rocket" size={16} className="glow-icon" />
            Sci-Fi
          </span>
        }
        url="/discover/movie?with_genres=878"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="mask" size={16} className="glow-icon" />
            Comedy
          </span>
        }
        url="/discover/movie?with_genres=35"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="skull" size={16} className="glow-icon" />
            Horror
          </span>
        }
        url="/discover/movie?with_genres=27"
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="spark" size={16} className="glow-icon" />
            Anime
          </span>
        }
        url="/discover/movie?with_genres=16"
      />
    </main>
  );
}

