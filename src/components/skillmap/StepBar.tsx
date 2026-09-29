import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Career", "Your skills", "Gap analysis", "Roadmap"];

export function StepBar({
  step,
  onJump,
  maxReached,
}: {
  step: number;
  onJump: (s: number) => void;
  maxReached: number;
}) {
  const pct = (step / STEPS.length) * 100;

  return (
    <nav aria-label="Progress" className="no-print w-full">
      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          const reachable = n <= maxReached;
          return (
            <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(n)}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${n}: ${label}`}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-all",
                  active && "bg-brand-gradient border-transparent text-primary-foreground glow-shadow scale-105",
                  done && "border-transparent bg-primary/15 text-primary",
                  !active && !done && "border-border bg-card text-muted-foreground",
                  reachable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-60",
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : n}
              </button>
              <span
                className={cn(
                  "truncate text-[11px] sm:text-xs",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="bg-brand-gradient h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall progress"
        />
      </div>
    </nav>
  );
}
