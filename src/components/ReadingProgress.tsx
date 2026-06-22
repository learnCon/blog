"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 z-50 transition-all duration-150"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
        boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
      }}
    />
  );
}
