"use client";

import Link from "next/link";
import { categories } from "@/lib/categories";

export default function CategoriesPage() {
  return (
    <main
      style={{
        padding: 32,
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Browse Categories</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
          gap: 24,
        }}
      >
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            style={{
              padding: 28,
              borderRadius: 18,
              background: "rgba(124,58,237,.15)",
              textDecoration: "none",
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              transition: "all .25s ease",
              display: "block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.background = "rgba(124,58,237,.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(124,58,237,.15)";
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
            <div>{c.name}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
 