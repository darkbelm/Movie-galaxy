"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import useClickSound from "@/components/useClickSound";
import GlowIcon from "@/components/GlowIcon";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const click = useClickSound();

  /* ===== MAGNETIC EFFECT ===== */
  useEffect(() => {
    const items = document.querySelectorAll(".galaxy-nav");

    const move = (e: MouseEvent) => {
      items.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        (el as HTMLElement).style.transform =
          `translate(${x * 0.09}px, ${y * 0.09}px)`;   // smooth intensity
      });
    };

    const reset = () => {
      items.forEach((el) => {
        (el as HTMLElement).style.transform = "translate(0,0)";
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", reset);
    };
  }, []);

  /* ===== SCROLL PROGRESS ===== */
  useEffect(() => {
    const bar = document.getElementById("progress");

    const onScroll = () => {
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const p = (window.scrollY / h) * 100;
      if (bar) bar.style.width = p + "%";
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div
          style={{
            minHeight: "100vh",
            background: "#05050a",
            color: "white",
            margin: 0,
            animation: "pageFade .6s ease",
          }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            style={{ position: "absolute", width: 0, height: 0 }}
          >
            <defs>
              <linearGradient id="galaxy-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6ad5" />
                <stop offset="45%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <radialGradient id="galaxy-fill" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,.95)" />
                <stop offset="40%" stopColor="rgba(255,106,213,.7)" />
                <stop offset="100%" stopColor="rgba(124,58,237,.25)" />
              </radialGradient>
              <filter id="galaxy-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          {/* ===== HEADER ===== */}
          <header
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              background: "rgba(5,5,10,.92)",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              position: "sticky",
              top: 0,
              zIndex: 50,
              backdropFilter: "blur(10px)",
            }}
          >
            <button
              onClick={() => {
                click();
                setOpen(true);
              }}
              aria-label="Open menu"
              style={{
                fontSize: 26,
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                marginRight: 12,
                padding: 8,
                borderRadius: 12,
                backgroundColor: "rgba(124,58,237,.18)",
                boxShadow: "0 0 18px rgba(124,58,237,.35)",
              }}
            >
              <GlowIcon name="menu" size={28} strokeWidth={2.6} className="glow-icon menu-icon" />
            </button>

                        <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 32,
                fontWeight: 800,
                textShadow: "0 0 22px rgba(124,58,237,1)",
                animation: "logoPulse 4s infinite",
              }}
            >
              <img
                src="/icon.svg"
                alt="Movie Galaxy"
                style={{
                  width: 56,
                  height: 56,
                  filter: "drop-shadow(0 0 16px rgba(124,58,237,1))",
                }}
              />
              Movie Galaxy
            </span>

            {/* progress bar */}
            <div
              id="progress"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 2,
                width: "0%",
                background:
                  "linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed)",
              }}
            />
          </header>

          <div style={{ display: "flex" }}>
            {/* ===== SIDEBAR ===== */}
            <aside
              style={{
                width: 230,
                background: "linear-gradient(180deg,#0b0b18,#05050a)",
                padding: "32px 20px",
                borderRight: "1px solid rgba(255,255,255,.06)",
                position: "fixed",
                top: 0,
                left: open ? 0 : -240,
                height: "100vh",
                transition: "left .35s ease",
                zIndex: 100,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: 22,
                  marginBottom: 20,
                }}
              >
                <GlowIcon name="bolt" size={20} className="glow-icon" />
              </button>

              <Nav href="/" label="Welcome" iconName="spark" close={() => setOpen(false)} />
              <Nav href="/home" label="Home" iconName="star" close={() => setOpen(false)} />
              <Nav href="/surprise" label="Galaxy Oracle" iconName="shuffle" close={() => setOpen(false)} />
              <Nav href="/galaxy-picks" label="Galaxy Picks" iconName="spark" close={() => setOpen(false)} />
              <Nav href="/my-list" label="My List" iconName="heart" close={() => setOpen(false)} />
              <Nav href="/tonight" label="Tonight" iconName="moon" close={() => setOpen(false)} />
              <Nav href="/categories" label="Categories" iconName="film" close={() => setOpen(false)} />
              <Nav href="/search" label="Search" iconName="search" close={() => setOpen(false)} />
            </aside>

            {/* overlay */}
            {open && (
              <div
                onClick={() => setOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,.6)",
                  zIndex: 90,
                }}
              />
            )}

            {/* ===== CONTENT ===== */}
            <main
              className="content"
              style={{
                flex: 1,
                marginLeft: 230,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div className="page-crest" aria-hidden="true">
                <img
                  src="/icon.svg"
                  alt=""
                  style={{
                    width: 34,
                    height: 34,
                    filter: "drop-shadow(0 0 14px rgba(124,58,237,1))",
                  }}
                />
              </div>
              <PageTransition>{children}</PageTransition>

              <Footer />
            </main>
          </div>

          {/* ===== GLOBAL STYLES ===== */}
          <style jsx global>{`
            .galaxy-nav {
              transition: transform .18s ease,
                          box-shadow .2s ease,
                          background .2s ease;
            }

            .galaxy-nav:hover {
              box-shadow: 0 0 22px rgba(124,58,237,.6);
            }

            img:hover {
              transform: scale(1.09);
              box-shadow: 0 0 50px rgba(124,58,237,.9);
            }

            @keyframes pageFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes logoPulse {
              0% { text-shadow: 0 0 14px rgba(124,58,237,.7); }
              50% { text-shadow: 0 0 30px rgba(124,58,237,1); }
              100% { text-shadow: 0 0 14px rgba(124,58,237,.7); }
            }

            @keyframes logoOrbit {
              0% { transform: translateZ(0) scale(1); }
              50% { transform: translateZ(0) scale(1.08); }
              100% { transform: translateZ(0) scale(1); }
            }

            .galaxy-logo {
              animation: logoOrbit 4.5s ease-in-out infinite;
            }

            .page-crest {
              position: absolute;
              top: 14px;
              right: 22px;
              z-index: 5;
              opacity: .9;
              pointer-events: none;
              animation: logoOrbit 5.5s ease-in-out infinite;
            }

            h1 {
              position: relative;
              z-index: 0;
            }

            h1::before {
              content: "";
              position: absolute;
              left: -14px;
              top: 50%;
              width: 72px;
              height: 72px;
              transform: translateY(-50%);
              background: url("/icon.svg") no-repeat center/contain;
              opacity: 0.22;
              filter: drop-shadow(0 0 18px rgba(124,58,237,.9));
              z-index: -1;
              pointer-events: none;
            }

            .icon-inline {
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }

            .glow-icon {
              color: #a78bfa;
              filter:
                drop-shadow(0 0 6px rgba(255,106,213,.7))
                drop-shadow(0 0 12px rgba(124,58,237,.8))
                drop-shadow(0 0 16px rgba(34,211,238,.5));
              transform: translateZ(0) scale(1.4);
              transform-origin: center;
            }

            .menu-icon {
              filter:
                drop-shadow(0 0 6px rgba(255,106,213,.6))
                drop-shadow(0 0 12px rgba(124,58,237,.7))
                drop-shadow(0 0 16px rgba(34,211,238,.45));
            }

            .nav-bg {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              opacity: .16;
              z-index: 0;
              pointer-events: none;
            }

            .nav-label {
              position: relative;
              z-index: 1;
            }

            @media (max-width: 900px) {
              .page-crest {
                right: 16px;
                top: 10px;
                opacity: .75;
              }

              h1::before {
                width: 54px;
                height: 54px;
                left: -10px;
                opacity: 0.18;
              }
            }

            @media (max-width: 900px) {
              .content {
                margin-left: 0 !important;
              }
            }
          `}</style>
        </div>
      </body>
    </html>
  );
}

/* ===== NAV ITEM ===== */
function Nav({
  href,
  iconName,
  label,
  close,
}: {
  href: string;
  iconName: "moon" | "star" | "flame" | "film" | "rocket" | "mask" | "skull" | "spark" | "heart" | "search" | "shuffle" | "play" | "bolt";
  label: string;
  close: () => void;
}) {
  const path = usePathname();
  const active = path === href;

  return (
    <Link
      href={href}
      onClick={close}
      className="galaxy-nav"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        color: active ? "#fff" : "#ddd",
        background: active ? "rgba(124,58,237,.22)" : "transparent",
        marginBottom: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span className="nav-label">{label}</span>
      <span className="nav-bg" aria-hidden="true">
        <GlowIcon name={iconName} size={34} className="glow-icon" />
      </span>
    </Link>
  );
}


