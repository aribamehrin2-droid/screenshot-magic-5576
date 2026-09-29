export function ReadinessGauge({ value }: { value: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;

  return (
    <div
      className="relative mx-auto size-48"
      role="img"
      aria-label={`Career readiness score ${value} percent`}
    >
      <svg viewBox="0 0 200 200" className="size-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-glow)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--muted)" strokeWidth="16" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-brand-gradient text-4xl font-extrabold">{value}%</span>
        <span className="text-muted-foreground text-xs">career readiness</span>
      </div>
    </div>
  );
}
