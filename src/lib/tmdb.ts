const API_URL = "https://api.themoviedb.org/3";

export const IMG = "https://image.tmdb.org/t/p/w500";

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
};

function getToken() {
  const token = process.env.NEXT_PUBLIC_TMDB_TOKEN;
  if (!token) {
    throw new Error(
      "Missing TMDB token. Put NEXT_PUBLIC_TMDB_TOKEN in .env.local"
    );
  }
  return token;
}

export async function tmdb<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB error ${res.status}: ${text}`);
  }

  return res.json();
}
