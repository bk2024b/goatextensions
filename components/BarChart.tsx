import type { DayCount } from "@/lib/stats";

/** Histogramme SVG rendu côté serveur : aucune bibliothèque. */
export function BarChart({ data }: { data: DayCount[] }) {
  const W = 720, H = 200, padL = 28, padB = 22, padT = 8;
  const max = Math.max(1, ...data.map((d) => d.count));
  const bw = (W - padL) / data.length;
  const ih = H - padB - padT;
  const ticks = [0, Math.ceil(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Downloads per day, last ${data.length} days`} className="chart">
      {ticks.map((t) => {
        const y = padT + ih - (t / max) * ih;
        return (
          <g key={t}>
            <line x1={padL} x2={W} y1={y} y2={y} className="grid" />
            <text x={padL - 6} y={y + 4} textAnchor="end" className="axis">{t}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.count / max) * ih;
        return (
          <g key={d.day}>
            <rect x={padL + i * bw + 2} y={padT + ih - h} width={Math.max(1, bw - 4)} height={h} rx="2" className="bar">
              <title>{`${d.day}: ${d.count}`}</title>
            </rect>
            {i % 7 === 0 && <text x={padL + i * bw + bw / 2} y={H - 6} textAnchor="middle" className="axis">{d.day.slice(5)}</text>}
          </g>
        );
      })}
    </svg>
  );
}
