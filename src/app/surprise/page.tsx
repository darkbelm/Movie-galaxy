"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const MIN_YEAR = 2020;
const MIN_RATING = 6.5;

function yearOf(m: Movie) {
  const d = (m as any).release_date as string | undefined;
  if (!d) return 0;
  const y = new Date(d).getFullYear();
  return Number.isFinite(y) ? y : 0;
}

function safeGenres(m: Movie): number[] {
  // Movie type in your project may not include genre_ids,
  // but TMDB list endpoints often return it.
  return (((m as any).genre_ids as number[] | undefined) ?? []).filter(
    (n) => typeof n === "number"
  );
}

function moodByGenres(genreIds: number[]) {
  const g = new Set(genreIds);

  if (g.has(27) || g.has(53)) return "Dark Energy";
  if (g.has(35)) return "Comfort Zone";
  if (g.has(10749)) return "Heart Mode";
  if (g.has(878)) return "Cosmic";
  if (g.has(16)) return "Anime Soul";
  if (g.has(28)) return "Adrenaline";
  if (g.has(18)) return "Drama Core";

  return "Cinematic";
}

function saveTonight(m: Movie) {
  localStorage.setItem("tonight", JSON.stringify(m));
  window.location.href = "/tonight";
}

function saveToList(movie: Movie) {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: Movie[] = raw ? JSON.parse(raw) : [];
  if (!list.find((m) => (m as any).id === (movie as any).id)) {
    list.push(movie);
    localStorage.setItem("movie-galaxy-list", JSON.stringify(list));
  }
}

function getUserDNA(): number[] {
  const raw = localStorage.getItem("movie-galaxy-list");
  const list: any[] = raw ? JSON.parse(raw) : [];
  const all = list.flatMap((m) => (m?.genre_ids as number[] | undefined) ?? []);
  // keep only unique + valid
  return Array.from(new Set(all.filter((n) => typeof n === "number")));
}

function pickTopGenres(dna: number[], take = 3) {
  const freq = new Map<number, number>();
  dna.forEach((g) => freq.set(g, (freq.get(g) || 0) + 1));
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([g]) => g);
}

function modern(m: Movie) {
  return m.release_date && new Date(m.release_date).getFullYear() >= MIN_YEAR;
}

type Mood =
  | "any"
  | "action"
  | "funny"
  | "romance"
  | "scary"
  | "smart"
  | "anime";

type MoodIcon =
  | "shuffle"
  | "bolt"
  | "mask"
  | "heart"
  | "skull"
  | "spark";

const MOODS: { id: Mood; label: string; icon: MoodIcon; genres: number[] }[] = [
  { id: "any", label: "Anything", icon: "shuffle", genres: [] },
  { id: "action", label: "Action", icon: "bolt", genres: [28, 12] },
  { id: "funny", label: "Comedy", icon: "mask", genres: [35] },
  { id: "romance", label: "Romance", icon: "heart", genres: [10749, 18] },
  { id: "scary", label: "Horror", icon: "skull", genres: [27, 53] },
  { id: "smart", label: "Mind Bend", icon: "spark", genres: [9648, 878, 53] },
  { id: "anime", label: "Anime", icon: "spark", genres: [16] },
];

function Poster({
  movie,
  intensity,
}: {
  movie: Movie;
  intensity: number;
}) {
  const aura =
    intensity === 3
      ? "0 0 50px rgba(255,0,90,.7)"
      : intensity === 1
      ? "0 0 30px rgba(0,255,180,.5)"
      : "0 0 40px rgba(124,58,237,.5)";

  return (
    <div style={{ position: "relative" }}>
      <img
        src={
          (movie as any).poster_path
            ? IMG + (movie as any).poster_path
            : "https://via.placeholder.com/300x450"
        }
        style={{
          width: "100%",
          borderRadius: 16,
          boxShadow: aura,
        }}
        alt={(movie as any).title || (movie as any).name || "Movie poster"}
      />
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 4,
          fontSize: 11,
          background: "rgba(0,0,0,.6)",
          padding: "2px 6px",
          borderRadius: 8,
        }}
      >
        <span className="icon-inline">
          <GlowIcon name="flame" size={12} className="glow-icon" />
          {Math.round(((movie as any).popularity || 0) / 10)} hype
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 13 }}>
        {(movie as any).title || (movie as any).name}
      </div>
    </div>
  );
}

export default function SurprisePage() {
  const [pick, setPick] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [dnaGenres, setDnaGenres] = useState<number[]>([]);
  const [mood, setMood] = useState<Mood>("any");
  const [intensity, setIntensity] = useState(2); // 1 = chill, 3 = crazy
  const [party, setParty] = useState<Movie[]>([]);
  const [winner, setWinner] = useState<Movie | null>(null);
  const [partyCode, setPartyCode] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    try {
      const dna = getUserDNA();
      setDnaGenres(pickTopGenres(dna, 3));
    } catch {
      setDnaGenres([]);
    }
  }, []);

  useEffect(() => {
    try {
      setOrigin(window.location.origin);
    } catch {
      setOrigin("");
    }
  }, []);

  const moodLabel = useMemo(() => {
    if (!pick) return "";
    return moodByGenres(safeGenres(pick));
  }, [pick]);

  async function startPartyMode() {
    const r = await tmdb<Res>("/movie/popular");
    const pool = r.results.filter(modern);

    const picks = pool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setParty(picks);
    setWinner(null);

    // CREATE INVITE CODE
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem("party-" + code, JSON.stringify(picks));
    setPartyCode(code);
  }

  async function pickMovie() {
    setLoading(true);

    const moodData = MOODS.find((m) => m.id === mood);

    const genreFilter =
      moodData && moodData.genres.length
        ? `&with_genres=${moodData.genres.join(",")}`
        : "";

    // ===== INTENSITY EFFECTS =====
    let sort = "popularity.desc";
    let vote = "";

    if (intensity === 1) {
      sort = "vote_average.desc"; // safer, well loved
      vote = "&vote_count.gte=300"; // known good movies
    }

    if (intensity === 3) {
      sort = "revenue.desc"; // chaotic blockbusters
      vote = "&vote_average.gte=5"; // not only "perfect" movies
    }

    const year = Math.floor(Math.random() * 5) + 2020;

    const res = await tmdb<Res>(
      `/discover/movie?primary_release_date.gte=${year}-01-01${genreFilter}${vote}&sort_by=${sort}`
    );

    const modern = res.results.filter(
      (m) => m.release_date && new Date(m.release_date).getFullYear() >= 2020
    );

    setPick(modern[Math.floor(Math.random() * modern.length)]);
    setLoading(false);
  }

  // auto-pick once on first load
  useEffect(() => {
    pickMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "p") startPartyMode();
      if (e.key === "s") pickMovie();
    };

    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get("party");

    if (code) {
      const saved = localStorage.getItem("party-" + code);
      if (saved) {
        setParty(JSON.parse(saved));
        setPartyCode(code);
      }
    }
  }, []);

  const title = (pick as any)?.title || (pick as any)?.name || "Surprise";
  const poster = (pick as any)?.poster_path ? IMG + (pick as any).poster_path : "";
  const backdrop = (pick as any)?.backdrop_path ? IMG + (pick as any).backdrop_path : "";
  const rating =
    typeof (pick as any)?.vote_average === "number"
      ? (pick as any).vote_average.toFixed(1)
      : "-";
  const year = pick ? yearOf(pick) : 0;
  const overview = (pick as any)?.overview || "No overview available.";
  const inviteUrl =
    partyCode && origin ? `${origin}/surprise?party=${partyCode}` : "";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        color: "white",
        background: "radial-gradient(circle at top,#0b0b18 0%,#05050a 70%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient dust */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 20% 20%, rgba(124,58,237,.18), transparent 55%)," +
            "radial-gradient(circle at 80% 70%, rgba(255,255,255,.06), transparent 55%)," +
            "radial-gradient(circle at 60% 10%, rgba(236,72,153,.10), transparent 60%)",
          filter: "blur(0px)",
        }}
      />

      {/* flash */}
      {flash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 30%, rgba(124,58,237,.28), transparent 55%)",
            animation: "flash .26s ease",
          }}
        />
      )}

      <header style={{ position: "relative", zIndex: 2, marginBottom: 22 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 46,
                fontWeight: 900,
                letterSpacing: 0.2,
                margin: 0,
                textShadow: "0 0 36px rgba(124,58,237,.9)",
              }}
            >
              <span className="icon-inline">
                <GlowIcon name="spark" size={22} className="glow-icon" />
                Galaxy Oracle
              </span>
            </h1>
            <p style={{ marginTop: 6, color: "#cfcfe6", maxWidth: 780 }}>
              A smart "Surprise Me" that only pulls <b>2020+</b> picks with solid
              ratings - and learns from your My List.
            </p>
          </div>

          {/* ===== MOOD SELECTOR ===== */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 14,
                  border:
                    mood === m.id
                      ? "1px solid rgba(124,58,237,.8)"
                      : "1px solid rgba(255,255,255,.12)",
                  background:
                    mood === m.id
                      ? "rgba(124,58,237,.25)"
                      : "rgba(255,255,255,.06)",
                  color: "white",
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name={m.icon} size={14} className="glow-icon" />
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {/* ===== INTENSITY SLIDER ===== */}
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ marginBottom: 6, fontSize: 14, opacity: 0.9 }}>
              <span className="icon-inline">
                <GlowIcon name="bolt" size={14} className="glow-icon" />
                Intensity:
              </span>
              {intensity === 1 && (
                <span className="icon-inline" style={{ marginLeft: 6 }}>
                  <GlowIcon name="moon" size={14} className="glow-icon" />
                  Chill
                </span>
              )}
              {intensity === 2 && (
                <span className="icon-inline" style={{ marginLeft: 6 }}>
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  Balanced
                </span>
              )}
              {intensity === 3 && (
                <span className="icon-inline" style={{ marginLeft: 6 }}>
                  <GlowIcon name="bolt" size={14} className="glow-icon" />
                  Unhinged
                </span>
              )}
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{
                width: 200,
                accentColor: "#7c3aed",
              }}
            />
          </div>

          <button
            onClick={pickMovie}
            disabled={loading}
            style={{
              padding: "12px 18px",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.14)",
              cursor: loading ? "not-allowed" : "pointer",
              color: "white",
              fontWeight: 900,
              letterSpacing: 0.2,
              background:
                "linear-gradient(135deg, rgba(124,58,237,.95), rgba(236,72,153,.75))",
              boxShadow: "0 0 40px rgba(124,58,237,.35)",
              transform: loading ? "scale(1)" : "translateY(0)",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 0 60px rgba(124,58,237,.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,.35)";
            }}
          >
            {loading ? (
              "Summoning..."
            ) : (
              <span className="icon-inline">
                {mood === "any" ? (
                  <GlowIcon name="shuffle" size={16} className="glow-icon" />
                ) : (
                  <GlowIcon
                    name={MOODS.find((m) => m.id === mood)?.icon || "shuffle"}
                    size={16}
                    className="glow-icon"
                  />
                )}
                Surprise Me
              </span>
            )}
          </button>

          <button
            onClick={startPartyMode}
            style={{
              marginTop: 10,
              padding: "10px 16px",
              borderRadius: 16,
              background: "rgba(124,58,237,.2)",
              border: "1px solid rgba(124,58,237,.3)",
              color: "white",
              fontWeight: 800,
            }}
          >
            <span className="icon-inline">
              <GlowIcon name="spark" size={14} className="glow-icon" />
              Party Mode
            </span>
          </button>
        </div>

        {/* taste chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <Chip label={`Year: ${MIN_YEAR}+`} />
            <Chip
              label={
                <span className="icon-inline" style={{ position: "relative" }}>
                  <GlowIcon
                    name="star"
                    size={22}
                    className="glow-icon"
                    style={{
                      position: "absolute",
                      left: -8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                  />
                  <span style={{ paddingLeft: 16 }}>Rating: {MIN_RATING}+</span>
                </span>
              }
            />
          <Chip label={dnaGenres.length ? "Personalized" : "Trending + Modern"} />
        </div>
      </header>

      {/* card */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 22,
          padding: 22,
          borderRadius: 26,
          border: "1px solid rgba(255,255,255,.08)",
          background: backdrop
            ? `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.92)), url(${backdrop}) center/cover`
            : "linear-gradient(135deg,#0b0b18,#05050a)",
          boxShadow: "0 0 70px rgba(124,58,237,.16)",
          overflow: "hidden",
          animation: "cardIn .55s ease",
        }}
      >
        {/* poster */}
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 0 40px rgba(0,0,0,.7)",
            background: "rgba(0,0,0,.35)",
          }}
        >
          {poster ? (
            <img
              src={poster}
              alt={title}
              style={{ width: "100%", display: "block" }}
            />
          ) : (
            <div style={{ padding: 18, color: "#bbb" }}>No poster</div>
          )}
        </div>

        {/* info */}
        <div style={{ alignSelf: "end" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            {moodLabel ? (
              <Chip
                label={
                  <span className="icon-inline">
                    <GlowIcon name="spark" size={12} className="glow-icon" />
                    {moodLabel}
                  </span>
                }
                glow
              />
            ) : null}
            <Chip
              label={
                <span className="icon-inline" style={{ position: "relative" }}>
                  <GlowIcon
                    name="star"
                    size={22}
                    className="glow-icon"
                    style={{
                      position: "absolute",
                      left: -8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                  />
                  <span style={{ paddingLeft: 16 }}>Rating {rating}</span>
                </span>
              }
            />
            <Chip
              label={
                <span className="icon-inline">
                  <GlowIcon name="film" size={12} className="glow-icon" />
                  {year ? year : "-"}
                </span>
              }
            />
          </div>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 900,
              margin: "0 0 10px 0",
              textShadow: "0 0 32px rgba(124,58,237,.45)",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h2>

          <p style={{ color: "#ddd", maxWidth: 900, lineHeight: 1.6 }}>
            {overview}
          </p>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
            Because you liked:{" "}
            {dnaGenres.length ? dnaGenres.slice(0, 3).join(", ") : "recent picks"}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <button
              onClick={() => {
                if (!pick) return;
                window.location.href = `/movie/${(pick as any).id}`;
              }}
              style={btn("primary")}
            >
              <span className="icon-inline">
                <GlowIcon name="search" size={14} className="glow-icon" />
                Open Details
              </span>
            </button>

            <button
              onClick={() => pick && saveTonight(pick)}
              style={btn("glass")}
            >
              <span className="icon-inline">
                <GlowIcon name="moon" size={14} className="glow-icon" />
                Save for Tonight
              </span>
            </button>

            <button
              onClick={() => pick && saveToList(pick)}
              style={btn("love")}
            >
              <span className="icon-inline">
                <GlowIcon name="heart" size={14} className="glow-icon" />
                Add to My List
              </span>
            </button>
          </div>
        </div>
      </section>

      {party.length > 0 && !winner && (
        <section style={{ margin: "60px 0" }}>
          <h2>
            <span className="icon-inline">
              <GlowIcon name="spark" size={18} className="glow-icon" />
              Party Mode - vote!
            </span>
          </h2>

          {partyCode && inviteUrl && (
            <div
              style={{
                marginBottom: 20,
                padding: 14,
                borderRadius: 16,
                background: "rgba(124,58,237,.15)",
                border: "1px solid rgba(124,58,237,.3)",
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                <span className="icon-inline">
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  Invite friends to vote:
                </span>
              </div>

              <input
                readOnly
                value={inviteUrl}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 12,
                  background: "#0006",
                  border: "1px solid #fff2",
                  color: "white",
                }}
              />

              <button
                onClick={() => navigator.clipboard.writeText(inviteUrl)}
                style={{ marginTop: 8 }}
              >
                <span className="icon-inline">
                  <GlowIcon name="spark" size={14} className="glow-icon" />
                  Copy Link
                </span>
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 20,
            }}
          >
            {party.map((m) => (
              <div key={(m as any).id} onClick={() => setWinner(m)}>
                <Poster movie={m} intensity={3} />
                <button style={{ width: "100%", marginTop: 6 }}>
                  <span className="icon-inline">
                    <GlowIcon name="spark" size={14} className="glow-icon" />
                    Vote for this
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {winner && (
        <section
          style={{
            padding: 40,
            borderRadius: 24,
            background: "linear-gradient(135deg,#7c3aed33,#000)",
          }}
        >
          <h2>
            <span className="icon-inline">
              <GlowIcon name="star" size={18} className="glow-icon" />
              The Group Chose:
            </span>
          </h2>

          <Poster movie={winner} intensity={3} />

          <button onClick={() => saveTonight(winner)}>
            <span className="icon-inline">
              <GlowIcon name="moon" size={14} className="glow-icon" />
              Watch Tonight
            </span>
          </button>
        </section>
      )}

      <style jsx global>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes flash {
          from {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @media (max-width: 900px) {
          section {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ---------------- tiny helpers ---------------- */

function Chip({ label, glow }: { label: ReactNode; glow?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        color: "white",
        border: "1px solid rgba(255,255,255,.12)",
        background: "rgba(0,0,0,.35)",
        backdropFilter: "blur(8px)",
        boxShadow: glow ? "0 0 22px rgba(124,58,237,.35)" : "none",
      }}
    >
      {label}
    </span>
  );
}

function btn(kind: "primary" | "glass" | "love") {
  const base: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 18,
    cursor: "pointer",
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,.14)",
    color: "white",
    background: "rgba(255,255,255,.06)",
    transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
  };

  if (kind === "primary") {
    base.background = "linear-gradient(135deg,#7c3aed,#4c1d95)";
    base.border = "none";
    base.boxShadow = "0 0 30px rgba(124,58,237,.35)";
  }

  if (kind === "love") {
    base.background = "rgba(255, 0, 90, .14)";
    base.border = "1px solid rgba(255, 0, 90, .28)";
  }

  return base;
}




