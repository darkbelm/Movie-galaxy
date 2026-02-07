"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = 240);

    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      s: Math.random() * 0.3 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.s;
        if (p.y < 0) p.y = h;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124,58,237,.6)";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = 240;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <footer
      style={{
        marginTop: 120,
        padding: "80px 24px 40px",
        background:
          "linear-gradient(180deg,rgba(5,5,10,0) 0%,rgba(11,11,24,0.9) 40%,#05050a 100%)",
        borderTop: "1px solid rgba(124,58,237,.25)",
        boxShadow: "0 -20px 60px rgba(124,58,237,.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* PARTICLES */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />

      {/* glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg,#7c3aed,#4c1d95,#7c3aed)",
          boxShadow: "0 0 20px rgba(124,58,237,.9)",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 40,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* BRAND */}
        <div>
          <h2
            style={{
              fontSize: 22,
              marginBottom: 12,
              textShadow: "0 0 20px rgba(124,58,237,.9)",
            }}
          >
            🌌 Movie Galaxy
          </h2>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
            Explore the universe of cinema.  
            Discover, preview, and pick the perfect movie for tonight.
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h4 style={{ marginBottom: 12, color: "#fff" }}>Explore</h4>
          <FooterLink href="/home" label="Home" />
          <FooterLink href="/galaxy-picks" label="Galaxy Picks" />
          <FooterLink href="/categories" label="Categories" />
          <FooterLink href="/search" label="Search" />
          <FooterLink href="/my-list" label="My List" />
        </div>

        {/* INFO + LEGAL */}
        <div>
          <h4 style={{ marginBottom: 12, color: "#fff" }}>Info</h4>
          <FooterLink href="/about" label="About" />
          <FooterLink href="/privacy" label="Privacy Policy" />
          <FooterLink href="/terms" label="Terms of Use" />
          <FooterLink href="/dmca" label="DMCA" />
          <FooterLink href="/refund" label="Refund Policy" />
          <FooterLink href="/contact" label="Contact" />
        </div>
      </div>

      {/* BOTTOM */}
      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          color: "#888",
          fontSize: 13,
          borderTop: "1px solid rgba(255,255,255,.06)",
          paddingTop: 20,
          position: "relative",
          zIndex: 2,
        }}
      >
        © {new Date().getFullYear()} Movie Galaxy. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        color: "#bbb",
        textDecoration: "none",
        marginBottom: 8,
        transition: "all .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.textShadow =
          "0 0 12px rgba(124,58,237,.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#bbb";
        e.currentTarget.style.textShadow = "none";
      }}
    >
      {label}
    </Link>
  );
}
