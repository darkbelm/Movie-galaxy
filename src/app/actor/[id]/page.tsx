"use client";
import { useEffect, useState } from "react";
import { tmdb, IMG } from "@/lib/tmdb";

export default function Actor({ params }: any) {
  const [actor, setActor] = useState<any>(null);
  const [known, setKnown] = useState<any[]>([]);

  useEffect(() => {
    tmdb(`/person/${params.id}`).then(setActor);
    tmdb(`/person/${params.id}/movie_credits`).then((r: any) =>
      setKnown(r.cast.slice(0, 12))
    );
  }, []);

  if (!actor) return null;

  return (
    <main style={{ padding: 32, color: "white" }}>
      <h1>{actor.name}</h1>

      <img
        src={IMG + actor.profile_path}
        style={{ width: 220, borderRadius: 18 }}
      />

      <p style={{ maxWidth: 700 }}>{actor.biography}</p>

      <h2>Known For</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,150px)", gap: 20 }}>
        {known.map((m) => (
          <img key={m.id} src={IMG + m.poster_path} style={{ width: "100%" }} />
        ))}
      </div>
    </main>
  );
}
