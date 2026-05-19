import { money } from "@/lib/api";

export function SalesChart({ series }: { series: { d: string; v: number }[] }) {
  const w = 600;
  const h = 160;
  const pad = 8;
  const max = Math.max(1, ...series.map((s) => s.v));
  const stepX = (w - pad * 2) / Math.max(1, series.length - 1);
  const points = series
    .map((s, i) => {
      const x = pad + i * stepX;
      const y = h - pad - (s.v / max) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const area = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`;

  const total = series.reduce((s, x) => s + x.v, 0);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-extrabold">Sales Last 30 Days</h3>
          <p className="text-xs text-muted-foreground">Approved order volume from your network</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase">Total</p>
          <p className="text-xl font-extrabold text-success">{money(total)}</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40 mt-4" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.21 258)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.52 0.21 258)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#area-grad)" />
        <polyline
          points={points}
          fill="none"
          stroke="oklch(0.52 0.21 258)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
