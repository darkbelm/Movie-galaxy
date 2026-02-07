"use client";

export default function useClickSound() {
  const play = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
    );
    audio.volume = 0.25;
    audio.play().catch(() => {});
  };

  return play;
}
