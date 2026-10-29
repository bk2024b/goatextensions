"use client";
import { useEffect, useState } from "react";

function fmt(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m ${String(s).padStart(2, "0")}s`;
}

/** Démonstration : un compteur qui avance, comme la pastille dans la barre YouTube. */
export function LiveTimer({ start = 4380 }: { start?: number }) {
  const [t, setT] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="pill" aria-hidden="true">
      <span className="dot" />
      {fmt(t)}
    </span>
  );
}
