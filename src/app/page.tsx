"use client";

import Link from "next/link";
import GlowIcon from "@/components/GlowIcon";

export default function WelcomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #0b0b18 0%, #05050a 75%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: 24,
      }}
    >
      {/* STARS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.2,
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 700,
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 20,
            textShadow: "0 0 40px rgba(124,58,237,1)",
          }}
        >
          Movie Galaxy
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "#ddd",
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Not every movie is worth your time.  
          <br />
          We guide you to the ones that are.
        </p>

        {/* FEATURE CONSTELLATION */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 50,
          }}
        >
          <span className="feature-chip">
            <span className="icon-inline">
              <GlowIcon name="moon" size={14} className="glow-icon" />
              Tonight
            </span>
          </span>
          <span className="feature-chip">
            <span className="icon-inline">
              <GlowIcon name="spark" size={14} className="glow-icon" />
              Galaxy Picks
            </span>
          </span>
          <span className="feature-chip">
            <span className="icon-inline">
              <GlowIcon name="search" size={14} className="glow-icon" />
              Search
            </span>
          </span>
          <span className="feature-chip">
            <span className="icon-inline">
              <GlowIcon name="film" size={14} className="glow-icon" />
              Categories
            </span>
          </span>
          <span className="feature-chip">
            <span className="icon-inline">
              <GlowIcon name="heart" size={14} className="glow-icon" />
              My List
            </span>
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/home"
          style={{
            display: "inline-block",
            padding: "16px 36px",
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
            boxShadow: "0 0 40px rgba(124,58,237,.8)",
            animation: "pulse 2.5s ease-in-out infinite",
          }}
        >
          <span className="icon-inline">
            <GlowIcon name="rocket" size={16} className="glow-icon" />
            Enter the Galaxy
          </span>
        </Link>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        .feature-chip {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.18);
          color: #ddd;
          background: rgba(124,58,237,.12);
          box-shadow: 0 0 22px rgba(124,58,237,.25);
          font-size: 14px;
          letter-spacing: .2px;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 25px rgba(124,58,237,.6);
          }
          50% {
            box-shadow: 0 0 55px rgba(124,58,237,1);
          }
          100% {
            box-shadow: 0 0 25px rgba(124,58,237,.6);
          }
        }

        .float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
