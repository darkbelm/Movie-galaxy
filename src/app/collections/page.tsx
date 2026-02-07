import { tmdb, IMG, Movie } from "@/lib/tmdb";
import type { ReactNode } from "react";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

function Row({ title, movies }: { title: ReactNode; movies: Movie[] }) {
  return (
    <section className="mb-5">
      <h3 className="fw-bold mb-3">{title}</h3>
      <div className="row g-3">
        {shuffle(movies)
          .slice(0, 12)
          .map((m) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={m.id}>
              <a href={`/movie/${m.id}`}>
                <img src={IMG + m.poster_path} className="img-fluid rounded" />
              </a>
            </div>
          ))}
      </div>
    </section>
  );
}

export default async function CollectionsPage() {
  const base = "&primary_release_date.gte=2002-01-01";

  const [mind, emotion, twist, alone, classic] = await Promise.all([
    tmdb<Res>(`/discover/movie?with_genres=878,9648${base}`),
    tmdb<Res>(`/discover/movie?with_genres=18${base}`),
    tmdb<Res>(`/discover/movie?with_keywords=10683${base}`),
    tmdb<Res>(`/discover/movie?with_genres=18,9648${base}`),
    tmdb<Res>(`/discover/movie?vote_average.gte=7.5${base}`),
  ]);

  return (
    <div>
      <h1 className="fw-bold mb-4">
        <span className="icon-inline">
          <GlowIcon name="spark" size={18} className="glow-icon" />
          Galaxy Picks
        </span>
      </h1>
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="spark" size={16} className="glow-icon" />
            Mind-Bending
          </span>
        }
        movies={mind.results}
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="heart" size={16} className="glow-icon" />
            Emotional
          </span>
        }
        movies={emotion.results}
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="shuffle" size={16} className="glow-icon" />
            Plot Twist
          </span>
        }
        movies={twist.results}
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="moon" size={16} className="glow-icon" />
            Watch Alone
          </span>
        }
        movies={alone.results}
      />
      <Row
        title={
          <span className="icon-inline">
            <GlowIcon name="film" size={16} className="glow-icon" />
            Modern Classics
          </span>
        }
        movies={classic.results}
      />
    </div>
  );
}
