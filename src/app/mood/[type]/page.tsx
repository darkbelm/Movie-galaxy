import { tmdb, IMG, Movie } from "@/lib/tmdb";
import GlowIcon from "@/components/GlowIcon";

type Res = { results: Movie[] };

const MOODS: Record<
  string,
  { title: string; query: string }
> = {
  happy: {
    title: "Happy Movies",
    query: "/discover/movie?with_genres=35,16&sort_by=popularity.desc",
  },
  sad: {
    title: "Sad Movies",
    query: "/discover/movie?with_genres=18&sort_by=vote_average.desc",
  },
  scary: {
    title: "Scary Movies",
    query: "/discover/movie?with_genres=27&sort_by=popularity.desc",
  },
  romantic: {
    title: "Romantic Movies",
    query: "/discover/movie?with_genres=10749&sort_by=popularity.desc",
  },
  mindblowing: {
    title: "Mind-Blowing Movies",
    query: "/discover/movie?with_genres=878,9648&sort_by=vote_average.desc",
  },
};

export default async function MoodPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const mood = MOODS[type];

  if (!mood) {
    return (
      <div className="text-center py-5">
        <h2>Unknown mood</h2>
        <a href="/" className="btn btn-purple mt-3">Go Home</a>
      </div>
    );
  }

  const data = await tmdb<Res>(mood.query);

  return (
    <>
      <h1 className="fw-bold mb-4">{mood.title}</h1>

      <div className="row g-3">
        {data.results.slice(0, 24).map((m) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={m.id}>
            <a href={`/movie/${m.id}`}>
              <div className="card h-100 position-relative">
                <img
                  src={
                    m.poster_path
                      ? IMG + m.poster_path
                      : "https://via.placeholder.com/500x750?text=No+Poster"
                  }
                  className="card-img-top"
                  alt={m.title}
                />

                <div
                  className="position-absolute bottom-0 start-0 w-100 p-2"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.85), transparent)",
                  }}
                >
                  <div className="fw-semibold small text-truncate">
                    {m.title}
                  </div>
                  <div className="text-warning small">
                    <span className="icon-inline">
                      <GlowIcon name="star" size={12} className="glow-icon" />
                      Rating {m.vote_average?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
