import React from "react";

type IconName =
  | "moon"
  | "star"
  | "flame"
  | "film"
  | "rocket"
  | "mask"
  | "skull"
  | "spark"
  | "heart"
  | "search"
  | "shuffle"
  | "play"
  | "bolt"
  | "menu";

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

export default function GlowIcon({
  name,
  size = 16,
  className,
  title,
  strokeWidth,
  style,
}: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "url(#galaxy-stroke)",
    strokeWidth: strokeWidth ?? 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
    "aria-hidden": title ? undefined : true,
    role: title ? "img" : undefined,
  };

  switch (name) {
    case "moon":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M14 3a8 8 0 1 0 7 11 7 7 0 0 1-7-11z" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path
            d="M12 3l2.6 5.6 6.2.9-4.5 4.4 1 6.1-5.3-2.9-5.3 2.9 1-6.1-4.5-4.4 6.2-.9z"
            fill="url(#galaxy-fill)"
            filter="url(#galaxy-glow)"
          />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path
            d="M12 3c3 4 2 6 0 8-2-2-3-4-2-6-3 3-5 6-3 10 1.4 3 4.1 6 5 6s3.6-3 5-6c2-4-0.5-7-3-12z"
            fill="url(#galaxy-fill)"
            filter="url(#galaxy-glow)"
          />
        </svg>
      );
    case "film":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <rect x="3" y="6" width="18" height="12" rx="2" filter="url(#galaxy-glow)" />
          <path d="M7 6v12M17 6v12M3 10h18M3 14h18" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M14 4c3 1 6 5 6 8-3 1-7-1-8-4-1-3 1-4 2-4z" filter="url(#galaxy-glow)" />
          <path d="M6 14l4 4M6 14l-1 5 5-1" filter="url(#galaxy-glow)" />
          <circle cx="13" cy="9" r="1.5" fill="url(#galaxy-fill)" />
        </svg>
      );
    case "mask":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M4 6c3 2 5 2 8 2s5 0 8-2v6c0 4-4 7-8 7s-8-3-8-7z" filter="url(#galaxy-glow)" />
          <path d="M9 11h0M15 11h0" />
          <path d="M9 14c1.5 1 4.5 1 6 0" />
        </svg>
      );
    case "skull":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M12 3c-4.4 0-8 3-8 7 0 3 2 5 4 6v3h8v-3c2-1 4-3 4-6 0-4-3.6-7-8-7z" filter="url(#galaxy-glow)" />
          <circle cx="9" cy="11" r="1.3" fill="url(#galaxy-fill)" />
          <circle cx="15" cy="11" r="1.3" fill="url(#galaxy-fill)" />
          <path d="M10 16h4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path
            d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z"
            fill="url(#galaxy-fill)"
            filter="url(#galaxy-glow)"
          />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path
            d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
            fill="url(#galaxy-fill)"
            filter="url(#galaxy-glow)"
          />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle cx="11" cy="11" r="6" filter="url(#galaxy-glow)" />
          <path d="M16 16l5 5" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "shuffle":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M3 7h5l4 5 4-5h5" filter="url(#galaxy-glow)" />
          <path d="M3 17h5l4-5 4 5h5" filter="url(#galaxy-glow)" />
          <path d="M19 5l2 2-2 2" filter="url(#galaxy-glow)" />
          <path d="M19 15l2 2-2 2" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M8 6l10 6-10 6z" fill="url(#galaxy-fill)" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="url(#galaxy-fill)" filter="url(#galaxy-glow)" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path d="M4 7h16" filter="url(#galaxy-glow)" />
          <path d="M4 12h16" filter="url(#galaxy-glow)" />
          <path d="M4 17h16" filter="url(#galaxy-glow)" />
        </svg>
      );
    default:
      return null;
  }
}
