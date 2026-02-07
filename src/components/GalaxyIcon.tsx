"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import React from "react";

export default function GalaxyIcon({
  name,
  size = 18,
}: {
  name: keyof typeof Icons;
  size?: number;
}) {
  // 🔥 THIS LINE FIXES THE ERROR
  const Icon = Icons[name] as React.FC<LucideProps>;

  if (!Icon) return null;

  return (
    <div className="galaxy-float">
      <Icon size={size} />

      <style jsx>{`
        .galaxy-float {
          display: flex;
          animation: float 3.5s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
