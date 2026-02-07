"use client";

import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const modern = (m: Movie) =>
  m.release_date && new Date(m.release_date).getFullYear() >= 2016;

function safeGenres(m: Movie): number[] {
  return Array.isArray(m.genre_ids) ? m.genre_ids : [];
}

function readLocal(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

/* =============== SMART BRAIN =============== */

function userDNA(): number[] {
  const raw = readLocal("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];
  const friendRaw = readLocal("friend-dna");
  const friend: number[] = friendRaw ? JSON.parse(friendRaw) : [];
  const mine = list.flatMap((m) => safeGenres(m));
  return Array.from(new Set([...mine, ...friend]));
}

function mood(m: Movie) {
  const g = safeGenres(m).join(",");

  if (g.includes("27") || g.includes("53")) return "Dark Energy";
  if (g.includes("35")) return "Comfort Zone";
  if (g.includes("10749")) return "Heart Mode";
  if (g.includes("878")) return "Cosmic";
  if (g.includes("16")) return "Anime Soul";
  if (g.includes("28")) return "Adrenaline";

  return "Cinematic";
}

function matchRuntime(m: Movie, runtimeMode: "short" | "medium" | "epic") {
  const rt = m.runtime || 110;

  if (runtimeMode === "short") return rt <= 95;
  if (runtimeMode === "medium") return rt > 95 && rt <= 130;
  if (runtimeMode === "epic") return rt > 130;

  return true;
}

const GENRES: Record<string, number> = {
  Action: 28,
  Romance: 10749,
  Comedy: 35,
  Horror: 27,
  SciFi: 878,
  Mystery: 9648,
  Fantasy: 14,
  Animation: 16,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getStreak() {
  return Number(localStorage.getItem("galaxy-streak") || 0);
}

function VoiceSearch({ onResult }: { onResult: (q: string) => void }) {
  const [listening, setListening] = useState(false);

  function start() {
    const Speech =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Speech) {
      alert("Voice is not supported in this browser.");
      return;
    }

    const rec = new Speech();
    rec.lang = "en-US";
    rec.start();

    setListening(true);

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      onResult(text);
      setListening(false);
    };

    rec.onerror = () => setListening(false);
  }

  return (
    <button
      onClick={start}
      style={{
        padding: "10px 16px",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.2)",
        background: listening
          ? "rgba(255,0,90,.3)"
          : "rgba(0,0,0,.6)",
        color: "white",
      }}
    >
      <span className="icon-inline">
        <GlowIcon name="search" size={14} className="glow-icon" />
        {listening ? "Listening..." : "Speak Search"}
      </span>
    </button>
  );
}

function voiceToQuery(text: string) {
  const t = text.toLowerCase();

  if (t.includes("funny") || t.includes("comedy"))
    return "/discover/movie?with_genres=35";

  if (t.includes("scary") || t.includes("horror"))
    return "/discover/movie?with_genres=27";

  if (t.includes("space") || t.includes("sci"))
    return "/discover/movie?with_genres=878";

  if (t.includes("love") || t.includes("romance"))
    return "/discover/movie?with_genres=10749";

  return "/search/movie?query=" + encodeURIComponent(text);
}

function compatibility(): number {
  const raw = readLocal("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];
  const mine = list.flatMap((m) => safeGenres(m));
  const friendRaw = readLocal("friend-dna");
  if (!friendRaw) return 0;

  const theirs: number[] = JSON.parse(friendRaw);
  const match = mine.filter((g) => theirs.includes(g)).length;

  return Math.round((match / Math.max(mine.length, 1)) * 100);
}

function dailyPick(movies: Movie[]) {
  const day = new Date().getDate();
  return movies[day % movies.length];
}

function secretMode() {
  document.body.style.filter =
    "hue-rotate(" + Math.random() * 360 + "deg)";
}

function backupList() {
  const data = localStorage.getItem("movie-galaxy-list") || "[]";
  const blob = new Blob([data]);
  const url = URL.createObjectURL(blob);
  window.open(url);
}

function TrendBadge({ m }: { m: Movie }) {
  if (m.vote_count > 2000) {
    return (
      <span className="icon-inline">
        <GlowIcon name="flame" size={12} className="glow-icon" />
        Hot
      </span>
    );
  }

  if (m.vote_average > 8) {
    return (
      <span className="icon-inline">
        <GlowIcon name="star" size={12} className="glow-icon" />
        Elite
      </span>
    );
  }

  return null;
}

function timeMatch(runtime?: number) {
  const hour = new Date().getHours();
  const rt = runtime || 110;

  if (hour > 22 && rt > 120)
    return "Too long for tonight";

  if (hour < 18 && rt < 100)
    return "Perfect quick watch";

  return "Good timing";
}

function WhyYouLove({ movie }: { movie: Movie }) {
  const [reasons, setReasons] = useState<string[]>([]);

  useEffect(() => {
    const dna = userDNA();
    const next: string[] = [];

    if (safeGenres(movie).some((g) => dna.includes(g)))
      next.push("Matches genres you already love");

    if (movie.vote_average > 7.8)
      next.push("Highly rated by the galaxy");

    if (safeGenres(movie).includes(878))
      next.push("Strong sci-fi imagination");

    if (safeGenres(movie).includes(18))
      next.push("Emotional storytelling");

    if (safeGenres(movie).includes(28))
      next.push("High adrenaline energy");

    if (!next.length) next.push("Fresh pick outside your usual orbit");

    setReasons(next);
  }, [movie.id, movie.vote_average]);

  return (
    <div
      style={{
        marginTop: 8,
        padding: 10,
        borderRadius: 14,
        background: "rgba(0,0,0,.4)",
        fontSize: 12,
      }}
    >
      <div className="icon-inline" style={{ marginBottom: 6 }}>
        <GlowIcon name="spark" size={12} className="glow-icon" />
        Why you will love it
      </div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {reasons.slice(0, 3).map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

function exportTaste() {
  const dna = userDNA();
  return btoa(JSON.stringify(dna));
}

function importTaste(code: string) {
  if (typeof window === "undefined") return;
  try {
    const data = JSON.parse(atob(code));
    localStorage.setItem("friend-dna", JSON.stringify(data));
  } catch {
    // no-op
  }
}

function FriendMatch() {
  const [code, setCode] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(compatibility());
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ margin: "0 0 10px" }}>
        <span className="icon-inline">
          <GlowIcon name="heart" size={14} className="glow-icon" />
          Match with a friend
        </span>
      </h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => alert(exportTaste())}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(124,58,237,.7)",
            background:
              "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))",
            color: "white",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="spark" size={12} className="glow-icon" />
            Copy My Taste Code
          </span>
        </button>

        <input
          placeholder="Paste friend code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            background: "rgba(10,10,20,.6)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "white",
            minWidth: 220,
          }}
        />

        <button
          onClick={() => {
            importTaste(code);
            setScore(compatibility());
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.2)",
            background: "rgba(0,0,0,.6)",
            color: "white",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="search" size={12} className="glow-icon" />
            Import Friend Taste
          </span>
        </button>
      </div>

      <div style={{ marginTop: 10, color: "#c7b6ff", fontSize: 13 }}>
        Compatibility: {score}%
      </div>
    </div>
  );
}

function MoodSlider({ on }: { on: (q: string) => void }) {
  const [m, setM] = useState(50);

  function apply(v: number) {
    setM(v);

    if (v < 25) on("/discover/movie?with_genres=18");
    else if (v < 50) on("/discover/movie?with_genres=35");
    else if (v < 75) on("/discover/movie?with_genres=28");
    else on("/discover/movie?with_genres=27");
  }

  return (
    <div style={{ margin: "20px 0" }}>
      <div className="icon-inline" style={{ marginBottom: 8 }}>
        <GlowIcon name="spark" size={12} className="glow-icon" />
        Mood Selector
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={m}
        onChange={(e) => apply(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#7c3aed" }}
      />
    </div>
  );
}

function AutoTrailerRow() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [active, setActive] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    tmdb<Res>("/trending/movie/week").then((r) => {
      const m = r.results.filter(modern).slice(0, 10);
      setMovies(m);
      setActive(m[0] || null);
    });
  }, []);

  useEffect(() => {
    if (!active) return;

    tmdb<{ results: any[] }>(`/movie/${active.id}/videos`).then((r) => {
      const t = r.results.find(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      );
      setTrailer(t?.key || null);
    });
  }, [active]);

  return (
    <section style={{ marginBottom: 80 }}>
      <h2 style={{ marginBottom: 12 }}>
        <span className="icon-inline">
          <GlowIcon name="play" size={18} className="glow-icon" />
          Live Preview Row
        </span>
      </h2>

      {trailer && (
        <iframe
          src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&rel=0`}
          allow="autoplay; encrypted-media"
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 20,
            border: "none",
            boxShadow: "0 0 60px rgba(124,58,237,.6)",
            marginBottom: 20,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
        }}
      >
        {movies.map((m) => (
          <div
            key={(m as any).id}
            onMouseEnter={() => setActive(m)}
            style={{
              minWidth: 140,
              cursor: "pointer",
              transform: active?.id === (m as any).id ? "scale(1.1)" : "scale(1)",
              transition: ".3s",
            }}
          >
            <img
              src={(m as any).poster_path ? IMG + (m as any).poster_path : "https://via.placeholder.com/300x450"}
              style={{
                width: "100%",
                borderRadius: 14,
              }}
              alt={(m as any).title || (m as any).name || "Movie poster"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function ScrollTrailer({ movie }: { movie: Movie }) {
  const [key, setKey] = useState("");

  useEffect(() => {
    tmdb<{ results: any[] }>(`/movie/${movie.id}/videos`).then((r) => {
      const t = r.results.find(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (t) setKey(t.key);
    });
    return () => {};
  }, [movie.id]);

  if (!key) return null;

  return (
    <iframe
      src={`https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0&rel=0`}
      allow="autoplay; encrypted-media"
      style={{ width: "100%", aspectRatio: "16/9", borderRadius: 16 }}
    />
  );
}

function DailyChallenge() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());

    const saved = localStorage.getItem("challenge-" + todayKey());

    if (saved) {
      setMovie(JSON.parse(saved));
      setDone(true);
      return;
    }

    tmdb<Res>("/movie/popular").then((r) => {
      const pick = r.results.filter(modern)[Math.floor(Math.random() * 10)];
      setMovie(pick);
    });
  }, []);

  function complete() {
    if (!movie) return;

    localStorage.setItem(
      "challenge-" + todayKey(),
      JSON.stringify(movie)
    );

    const s = getStreak() + 1;
    localStorage.setItem("galaxy-streak", String(s));

    setStreak(s);
    setDone(true);

    saveTonight(movie);
  }

  if (!movie) return null;

  return (
    <section
      style={{
        padding: 30,
        borderRadius: 24,
        background:
          "linear-gradient(135deg,rgba(124,58,237,.25),rgba(0,0,0,.9))",
        marginBottom: 60,
        textAlign: "center",
      }}
    >
      <h2>
        <span className="icon-inline">
          <GlowIcon name="flame" size={18} className="glow-icon" />
          Daily Challenge
        </span>
      </h2>

      <div style={{ marginTop: 10, color: "#facc15" }}>
        Streak: {streak} days
      </div>

      <img
        src={(movie as any).poster_path ? IMG + (movie as any).poster_path : "https://via.placeholder.com/300x450"}
        style={{
          width: 160,
          borderRadius: 16,
          marginTop: 16,
        }}
        alt={(movie as any).title || (movie as any).name || "Movie poster"}
      />

      <div style={{ marginTop: 10 }}>
        {(movie as any).title || (movie as any).name}
      </div>

      <button
        onClick={complete}
        disabled={done}
        style={{
          marginTop: 12,
          padding: "10px 16px",
          borderRadius: 16,
          border: "none",
          background: done
            ? "gray"
            : "linear-gradient(135deg,#7c3aed,#4c1d95)",
          color: "white",
        }}
      >
        <span className="icon-inline">
          <GlowIcon name="moon" size={14} className="glow-icon" />
          {done ? "Completed Today" : "Watch Tonight"}
        </span>
      </button>
    </section>
  );
}

function SharePoster({ movie }: { movie: Movie }) {
  const [img, setImg] = useState<string | null>(null);

  async function create() {
    if (!movie.poster_path) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#05050a";
    ctx.fillRect(0, 0, 1080, 1920);

    const p = new Image();
    p.crossOrigin = "anonymous";
    p.src = IMG + movie.poster_path;

    p.onload = () => {
      ctx.drawImage(p, 140, 200, 800, 1200);

      const title = movie.title || movie.name || "Movie";
      ctx.fillStyle = "white";
      ctx.font = "bold 60px Arial";
      ctx.fillText(title, 120, 1500);

      ctx.fillStyle = "#facc15";
      ctx.font = "40px Arial";
      ctx.fillText("Rating " + movie.vote_average.toFixed(1), 120, 1580);

      ctx.fillStyle = "#aaa";
      ctx.font = "32px Arial";
      ctx.fillText("Movie Galaxy", 120, 1700);

      setImg(canvas.toDataURL("image/png"));
    };
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={create}
        style={{
          padding: "8px 12px",
          borderRadius: 14,
          background: "linear-gradient(135deg,#e1306c,#833ab4)",
          border: "none",
          color: "white",
        }}
      >
        <span className="icon-inline">
          <GlowIcon name="spark" size={14} className="glow-icon" />
          Create Story Image
        </span>
      </button>

      {img && (
        <a
          download={(movie.title || movie.name || "movie") + ".png"}
          href={img}
          style={{ display: "block", marginTop: 10, color: "white" }}
        >
          Download Image
        </a>
      )}
    </div>
  );
}

function WatchParty({ movie }: { movie: Movie }) {
  function copyLink() {
    const link =
      location.origin +
      "/party?movie=" +
      movie.id +
      "&code=" +
      Math.random().toString(36).slice(2, 8);
    navigator.clipboard.writeText(link);
  }

  return (
    <button
      onClick={copyLink}
      style={{
        padding: "6px 10px",
        borderRadius: 12,
        background: "rgba(0,200,255,.2)",
        border: "1px solid rgba(0,200,255,.4)",
        color: "white",
      }}
    >
      <span className="icon-inline">
        <GlowIcon name="spark" size={12} className="glow-icon" />
        Copy Watch Party Link
      </span>
    </button>
  );
}

function saveTonight(m: Movie) {
  localStorage.setItem("tonight", JSON.stringify(m));
  window.location.href = "/tonight";
}

function saveToList(movie: Movie) {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];

  if (!list.find((m) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
  }
}

/* =============== POSTER =============== */

function Poster({
  movie,
  highlight,
  intensity,
  taglines,
  onTagline,
  onChain,
}: {
  movie: Movie;
  highlight?: boolean;
  intensity: number;
  taglines: Record<number, string>;
  onTagline?: (movie: Movie) => void;
  onChain?: (movie: Movie) => void;
}) {
  const [trailer, setTrailer] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [timeLabel, setTimeLabel] = useState("");

  const autoplay = intensity >= 2 ? 1 : 0;
  const muted = intensity === 3 ? 0 : 1;
  const delay =
    intensity === 1 ? 99999 :
    intensity === 2 ? 900 :
    0;

  useEffect(() => {
    if (!hover) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    timer.current = setTimeout(() => {
      tmdb<{ results: any[] }>(`/movie/${movie.id}/videos`).then((r) => {
        const t = r.results.find(
          (v: any) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (t) setTrailer(t.key);
      });
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [hover, movie.id, delay]);

  useEffect(() => {
    setTimeLabel(timeMatch(movie.runtime));
  }, [movie.runtime]);

  const aura =
    intensity === 3
      ? "0 0 50px rgba(255,0,90,.7)"
      : intensity === 1
      ? "0 0 30px rgba(0,255,180,.5)"
      : "0 0 40px rgba(124,58,237,.5)";

  const showTrend = movie.vote_count > 2000 || movie.vote_average > 8;

  return (
    <div style={{ position: "relative" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          cursor: "pointer",
          transition: "all .35s ease",
          transform: hover ? "scale(1.06)" : "scale(1)",
        }}
        onClick={() => (window.location.href = `/movie/${movie.id}`)}
      >
        {hover && trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer}?autoplay=${autoplay}&mute=${muted}&controls=0&rel=0`}
            allow="autoplay; encrypted-media"
            style={{
              width: "100%",
              aspectRatio: "2/3",
              borderRadius: 16,
              border: "none",
              boxShadow: aura,
              pointerEvents: "none",
            }}
          />
        ) : (
          <img
            src={
              movie.poster_path
                ? IMG + movie.poster_path
                : "https://via.placeholder.com/300x450"
            }
            style={{
              width: "100%",
              borderRadius: 16,
              boxShadow: aura,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            padding: "4px 8px",
            borderRadius: 10,
            background: "rgba(0,0,0,.6)",
            backdropFilter: "blur(6px)",
            fontSize: 11,
          }}
        >
          {mood(movie)}
        </div>

        {showTrend && (
          <div
            style={{
              position: "absolute",
              top: 34,
              left: 8,
              padding: "4px 8px",
              borderRadius: 10,
              background: "rgba(0,0,0,.6)",
              fontSize: 11,
            }}
          >
            <TrendBadge m={movie} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "4px 8px",
            borderRadius: 10,
            background: "rgba(0,0,0,.6)",
            fontSize: 11,
          }}
        >
          {intensity === 1 && (
            <span className="icon-inline">
              <GlowIcon name="moon" size={12} className="glow-icon" />
              Chill
            </span>
          )}
          {intensity === 2 && (
            <span className="icon-inline">
              <GlowIcon name="spark" size={12} className="glow-icon" />
              Balanced
            </span>
          )}
          {intensity === 3 && (
            <span className="icon-inline">
              <GlowIcon name="bolt" size={12} className="glow-icon" />
              Unhinged
            </span>
          )}
        </div>

        {hover && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveTonight(movie);
              }}
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: 12,
                background: "rgba(124,58,237,.8)",
                border: "none",
                color: "white",
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="moon" size={14} className="glow-icon" />
                Tonight
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                saveToList(movie);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                background: "rgba(255,0,90,.7)",
                border: "none",
                color: "white",
              }}
            >
              <GlowIcon name="heart" size={18} className="glow-icon" />
            </button>

            {onTagline && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTagline(movie);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 12,
                  background: "rgba(0,200,255,.7)",
                  border: "none",
                  color: "white",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  Tagline
                </span>
              </button>
            )}

            {onChain && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChain(movie);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 12,
                  background: "rgba(0,255,160,.7)",
                  border: "none",
                  color: "black",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  Chain
                </span>
              </button>
            )}

            <span onClick={(e) => e.stopPropagation()}>
              <WatchParty movie={movie} />
            </span>
          </div>
        )}
      </div>

      <div style={{ fontSize: 13, marginTop: 6 }}>
        {movie.title || movie.name}
      </div>

      {taglines[movie.id] && (
        <div
          style={{
            fontSize: 12,
            color: "#c084fc",
            marginTop: 4,
            fontStyle: "italic",
          }}
        >
          "{taglines[movie.id]}"
        </div>
      )}

      <div style={{ color: "#facc15", fontSize: 12, position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: -6,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        >
          <GlowIcon name="star" size={18} className="glow-icon" />
        </span>
        <span style={{ paddingLeft: 12 }}>
          Rating {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div
        style={{
          marginTop: 6,
          height: 4,
          width: "100%",
          background: "rgba(255,255,255,.12)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: Math.min(100, movie.vote_average * 10) + "%",
            height: 4,
            background: "#7c3aed",
          }}
        />
      </div>

      <div style={{ fontSize: 11, color: "#b8b3c7", marginTop: 6 }}>
        {timeLabel}
      </div>

      <WhyYouLove movie={movie} />
      <SharePoster movie={movie} />
    </div>
  );
}

/* =============== CHAPTER =============== */

function Chapter({
  id,
  index,
  activeIndex,
  title,
  subtitle,
  query,
  intensity,
  runtimeMode,
  taglines,
  onTagline,
  onChain,
}: {
  id: string;
  index: number;
  activeIndex: number;
  title: ReactNode;
  subtitle: string;
  query: string;
  intensity: number;
  runtimeMode: "short" | "medium" | "epic";
  taglines: Record<number, string>;
  onTagline: (movie: Movie) => void;
  onChain: (movie: Movie) => void;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    tmdb<Res>(query).then((r) => {
      let data = r.results
        .filter(modern)
        .filter((m) => matchRuntime(m, runtimeMode));

      const dna = userDNA();
      data = data.sort((a, b) => {
        const am = safeGenres(a).filter((g) => dna.includes(g)).length;
        const bm = safeGenres(b).filter((g) => dna.includes(g)).length;
        return bm - am;
      });

      setMovies(data.slice(0, 6));
    });
  }, [query, runtimeMode]);

  return (
    <section
      id={id}
      style={{
        marginBottom: 120,
        opacity: activeIndex >= index ? 1 : 0.35,
        transform: activeIndex === index ? "scale(1.02)" : "scale(1)",
        transition: "all .6s ease",
      }}
    >
      <h1 style={{ fontSize: 38 }}>{title}</h1>
      <p style={{ color: "#bbb", marginBottom: 40 }}>{subtitle}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 28 }}>
        {movies.map((m) => (
          <Poster
            key={m.id}
            movie={m}
            highlight={activeIndex === index}
            intensity={intensity}
            taglines={taglines}
            onTagline={onTagline}
            onChain={onChain}
          />
        ))}
      </div>

      {index === 4 && activeIndex === 4 && movies[0] && (
        <div style={{ marginTop: 24 }}>
          <ScrollTrailer movie={movies[0]} />
        </div>
      )}
    </section>
  );
}

/* =============== PAGE =============== */

export default function GalaxyPicksPage() {
  const sections = ["unknown", "mind", "emotional", "escape", "final"];
  const [active, setActive] = useState(0);
  const [intensity] = useState(2);
  const [runtimeMode, setRuntimeMode] = useState<"short" | "medium" | "epic">("medium");
  const [partyCode, setPartyCode] = useState<string | null>(null);
  const [g1, setG1] = useState<keyof typeof GENRES>("Action");
  const [g2, setG2] = useState<keyof typeof GENRES>("Romance");
  const [fusion, setFusion] = useState<Movie[]>([]);
  const [dailyPool, setDailyPool] = useState<Movie[]>([]);
  const [today, setToday] = useState<Movie | null>(null);
  const [taglines, setTaglines] = useState<Record<number, string>>({});
  const [chainBase, setChainBase] = useState<Movie | null>(null);
  const [chain, setChain] = useState<Movie[]>([]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "o" && e.ctrlKey) {
        window.location.href = "/surprise";
      }
    };

    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  /* SURPRISE ME FEATURE ADDED HERE */
  const surpriseMe = async () => {
    const r = await tmdb<Res>(
      "/discover/movie?primary_release_date.gte=2020-01-01&vote_average.gte=6.2"
    );

    const good = r.results.filter(modern);
    const pick = good[Math.floor(Math.random() * good.length)];

    window.location.href = `/movie/${pick.id}`;
  };

  async function loadFusion() {
    const url =
      `/discover/movie?with_genres=${GENRES[g1]},${GENRES[g2]}` +
      `&sort_by=popularity.desc`;

    const r = await tmdb<Res>(url);

    setFusion(
      r.results
        .filter(modern)
        .slice(0, 8)
    );
  }

  async function generateTagline(movie: Movie) {
    const base =
      movie.title ||
      movie.name ||
      "This movie";

    const moods = [
      "a life-changing journey",
      "a dangerous obsession",
      "a secret that breaks reality",
      "a love beyond logic",
      "a battle you can't escape",
      "the night everything changed",
    ];

    const line =
      base +
      " - " +
      moods[Math.floor(Math.random() * moods.length)];

    setTaglines((t) => ({ ...t, [movie.id]: line }));
  }

  async function loadChain(movie: Movie) {
    setChainBase(movie);

    const r = await tmdb<Res>(`/movie/${movie.id}/similar`);

    const dna = userDNA();

    const ranked = r.results
      .filter(modern)
      .sort((a, b) => {
        const am = safeGenres(a).filter((g) => dna.includes(g)).length;
        const bm = safeGenres(b).filter((g) => dna.includes(g)).length;
        return bm - am;
      });

    setChain(ranked.slice(0, 8));
  }

  useEffect(() => {
    loadFusion();
  }, [g1, g2]);

  useEffect(() => {
    tmdb<Res>("/movie/popular").then((r) => {
      setDailyPool(r.results.filter(modern));
    });
  }, []);

  useEffect(() => {
    if (!dailyPool.length) return;
    setToday(dailyPick(dailyPool));
  }, [dailyPool]);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + window.innerHeight / 3;

      const index = sections.findIndex((id) => {
        const el = document.getElementById(id);
        return el && y < el.offsetTop + el.offsetHeight;
      });

      if (index !== -1) setActive(index);
    };

    window.addEventListener("scroll", handler);
    handler();

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "80px 40px", background: "#05050a", color: "white" }}>

      <header style={{ marginBottom: 100 }}>
        <h1 style={{ fontSize: 52 }}>
          <span className="icon-inline">
            <GlowIcon name="spark" size={20} className="glow-icon" />
            Galaxy Picks
          </span>
        </h1>
        <p>Powered by your taste + cosmic vibes</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
          <button
            onClick={() => setRuntimeMode("short")}
            style={{
              padding: "8px 12px",
              borderRadius: 14,
              border:
                runtimeMode === "short"
                  ? "1px solid rgba(124,58,237,.7)"
                  : "1px solid rgba(255,255,255,.12)",
              background:
                runtimeMode === "short"
                  ? "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))"
                  : "rgba(255,255,255,.06)",
              color: "white",
              cursor: "pointer",
              boxShadow:
                runtimeMode === "short"
                  ? "0 0 18px rgba(124,58,237,.35)"
                  : "none",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="bolt" size={14} className="glow-icon" />
              Under 95 min
            </span>
          </button>
          <button
            onClick={() => setRuntimeMode("medium")}
            style={{
              padding: "8px 12px",
              borderRadius: 14,
              border:
                runtimeMode === "medium"
                  ? "1px solid rgba(124,58,237,.7)"
                  : "1px solid rgba(255,255,255,.12)",
              background:
                runtimeMode === "medium"
                  ? "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))"
                  : "rgba(255,255,255,.06)",
              color: "white",
              cursor: "pointer",
              boxShadow:
                runtimeMode === "medium"
                  ? "0 0 18px rgba(124,58,237,.35)"
                  : "none",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="film" size={14} className="glow-icon" />
              95-130 min
            </span>
          </button>
          <button
            onClick={() => setRuntimeMode("epic")}
            style={{
              padding: "8px 12px",
              borderRadius: 14,
              border:
                runtimeMode === "epic"
                  ? "1px solid rgba(124,58,237,.7)"
                  : "1px solid rgba(255,255,255,.12)",
              background:
                runtimeMode === "epic"
                  ? "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))"
                  : "rgba(255,255,255,.06)",
              color: "white",
              cursor: "pointer",
              boxShadow:
                runtimeMode === "epic"
                  ? "0 0 18px rgba(124,58,237,.35)"
                  : "none",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="spark" size={14} className="glow-icon" />
              130+ min
            </span>
          </button>
        </div>
        <button
          onClick={() => (window.location.href = "/surprise")}
          style={{
            marginTop: 12,
            padding: "10px 16px",
            borderRadius: 16,
            background: "rgba(124,58,237,.2)",
            border: "1px solid rgba(124,58,237,.3)",
            color: "white",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="shuffle" size={14} className="glow-icon" />
            Can't Choose? Surprise Me
          </span>
        </button>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <button
            onClick={() => today && saveTonight(today)}
            disabled={!today}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(124,58,237,.7)",
              background:
                "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))",
              color: "white",
              opacity: today ? 1 : 0.6,
              cursor: today ? "pointer" : "not-allowed",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="star" size={14} className="glow-icon" />
              Todays AI Pick
            </span>
          </button>

          <button
            onClick={secretMode}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(0,0,0,.6)",
              color: "white",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="spark" size={12} className="glow-icon" />
              Secret Mode
            </span>
          </button>

          <button
            onClick={backupList}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(0,0,0,.6)",
              color: "white",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="film" size={12} className="glow-icon" />
              Backup My List
            </span>
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <VoiceSearch
            onResult={(text) => {
              const q = voiceToQuery(text);
              window.location.href = "/search?q=" + encodeURIComponent(q);
            }}
          />
        </div>

        <MoodSlider
          on={(q) =>
            (window.location.href = "/search?q=" + encodeURIComponent(q))
          }
        />

        <FriendMatch />
      </header>

      <AutoTrailerRow />
      <DailyChallenge />

      <section style={{ margin: "60px 0" }}>
        <h2>
          <span className="icon-inline">
            <GlowIcon name="spark" size={18} className="glow-icon" />
            Genre Fusion Lab
          </span>
        </h2>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <select
            value={g1}
            onChange={(e) => setG1(e.target.value as any)}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              background: "rgba(10,10,20,.6)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "white",
            }}
          >
            {Object.keys(GENRES).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>

          <span style={{ alignSelf: "center", color: "#c7b6ff" }}>+</span>

          <select
            value={g2}
            onChange={(e) => setG2(e.target.value as any)}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              background: "rgba(10,10,20,.6)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "white",
            }}
          >
            {Object.keys(GENRES).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>

          <button
            onClick={loadFusion}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(124,58,237,.7)",
              background:
                "linear-gradient(135deg, rgba(124,58,237,.35), rgba(236,72,153,.18))",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 0 18px rgba(124,58,237,.35)",
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="spark" size={14} className="glow-icon" />
              Mix
            </span>
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
            gap: 24,
          }}
        >
          {fusion.map((m) => (
            <Poster
              key={(m as any).id}
              movie={m}
              highlight
              intensity={intensity}
              taglines={taglines}
              onTagline={generateTagline}
              onChain={loadChain}
            />
          ))}
        </div>
      </section>

      {chainBase && (
        <section style={{ margin: "60px 0" }}>
          <h2>
            <span className="icon-inline">
              <GlowIcon name="spark" size={18} className="glow-icon" />
              If you loved{" "}
              <span style={{ color: "#c084fc" }}>
                {chainBase.title || chainBase.name}
              </span>{" "}
              watch:
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
              gap: 24,
              marginTop: 20,
            }}
          >
            {chain.map((m) => (
              <Poster
                key={(m as any).id}
                movie={m}
                highlight
                intensity={intensity}
                taglines={taglines}
                onTagline={generateTagline}
                onChain={loadChain}
              />
            ))}
          </div>
        </section>
      )}

      <Chapter
        id="unknown"
        index={0}
        activeIndex={active}
        intensity={intensity}
        runtimeMode={runtimeMode}
        taglines={taglines}
        onTagline={generateTagline}
        onChain={loadChain}
        title={
          <span className="icon-inline">
            <GlowIcon name="bolt" size={18} className="glow-icon" />
            The Unknown
          </span>
        }
        subtitle="Secret crowd favorites"
        query="/discover/movie?with_genres=28,53&sort_by=popularity.desc"
      />

      <Chapter
        id="mind"
        index={1}
        activeIndex={active}
        intensity={intensity}
        runtimeMode={runtimeMode}
        taglines={taglines}
        onTagline={generateTagline}
        onChain={loadChain}
        title={
          <span className="icon-inline">
            <GlowIcon name="spark" size={18} className="glow-icon" />
            Mind Expanders
          </span>
        }
        subtitle="Movies that bend reality"
        query="/discover/movie?with_genres=9648,878,53&sort_by=popularity.desc"
      />

      <Chapter
        id="emotional"
        index={2}
        activeIndex={active}
        intensity={intensity}
        runtimeMode={runtimeMode}
        taglines={taglines}
        onTagline={generateTagline}
        onChain={loadChain}
        title={
          <span className="icon-inline">
            <GlowIcon name="heart" size={18} className="glow-icon" />
            Emotional Core
          </span>
        }
        subtitle="Feel something real"
        query="/discover/movie?with_genres=18,10749&sort_by=popularity.desc"
      />

      <Chapter
        id="escape"
        index={3}
        activeIndex={active}
        intensity={intensity}
        runtimeMode={runtimeMode}
        taglines={taglines}
        onTagline={generateTagline}
        onChain={loadChain}
        title={
          <span className="icon-inline">
            <GlowIcon name="rocket" size={18} className="glow-icon" />
            Escape
          </span>
        }
        subtitle="No thoughts - just fun"
        query="/discover/movie?with_genres=878,12&sort_by=popularity.desc"
      />

      <Chapter
        id="final"
        index={4}
        activeIndex={active}
        intensity={intensity}
        runtimeMode={runtimeMode}
        taglines={taglines}
        onTagline={generateTagline}
        onChain={loadChain}
        title={
          <span className="icon-inline">
            <GlowIcon name="star" size={18} className="glow-icon" />
            Final Chapter
          </span>
        }
        subtitle="Your destiny movie"
        query="/movie/now_playing"
      />

    </main>
  );
}


