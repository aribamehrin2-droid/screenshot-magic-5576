import { CalendarClock, Lightbulb, PartyPopper, RefreshCw, Sparkles } from "lucide-react";
import type { LearningStyle, Phase } from "@/lib/skillmap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const STYLES: LearningStyle[] = ["Video", "Reading", "Hands-on"];
const TIMELINES = [3, 6, 12] as const;

export function RoadmapStep({
  phases,
  hours,
  style,
  timeline,
  checked,
  onHours,
  onStyle,
  onTimeline,
  onToggle,
  onRegenerate,
}: {
  phases: Phase[];
  hours: number;
  style: LearningStyle;
  timeline: 3 | 6 | 12;
  checked: Record<string, boolean>;
  onHours: (h: number) => void;
  onStyle: (s: LearningStyle) => void;
  onTimeline: (t: 3 | 6 | 12) => void;
  onToggle: (id: string) => void;
  onRegenerate: () => void;
}) {
  const all = phases.flatMap((p) => p.milestones);
  const doneCount = all.filter((m) => checked[m.id]).length;
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0;

  return (
    <section aria-labelledby="roadmap-heading" className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 id="roadmap-heading" className="text-2xl font-bold sm:text-3xl">
          Your personalized roadmap
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
          Built from your biggest gaps, weighted by how much each skill matters.
        </p>
      </header>

      <div className="surface-card no-print grid gap-6 p-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hours">Hours per week: {hours}h</Label>
          <Slider
            id="hours"
            value={[hours]}
            min={2}
            max={40}
            step={1}
            onValueChange={([v]) => onHours(v)}
            aria-label="Study hours per week"
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium">Learning style</span>
          <div role="group" aria-label="Learning style" className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={style === s ? "default" : "outline"}
                aria-pressed={style === s}
                onClick={() => onStyle(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium">Target timeline</span>
          <div role="group" aria-label="Target timeline" className="flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={timeline === t ? "default" : "outline"}
                aria-pressed={timeline === t}
                onClick={() => onTimeline(t)}
              >
                {t} months
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-[200px] flex-1">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Roadmap progress</span>
            <span className="text-muted-foreground">
              {doneCount}/{all.length} milestones
            </span>
          </div>
          <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-brand-gradient h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Milestones completed"
            />
          </div>
        </div>
        <Button variant="outline" onClick={onRegenerate} className="no-print">
          <RefreshCw className="size-4" aria-hidden /> Regenerate
        </Button>
      </div>

      <div className="space-y-4">
        {phases.map((phase, i) => {
          const phaseDone =
            phase.milestones.length > 0 && phase.milestones.every((m) => checked[m.id]);
          return (
            <article
              key={phase.id}
              className={cn(
                "surface-card print-block space-y-4 p-5",
                phaseDone && "ring-2 ring-success",
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand-gradient text-primary-foreground flex size-10 items-center justify-center rounded-xl font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">
                    Phase {i + 1}: {phase.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{phase.goal}</p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <CalendarClock className="size-3.5" aria-hidden /> ~{phase.weeks} weeks
                </Badge>
                {phaseDone && (
                  <Badge className="bg-success text-success-foreground animate-in fade-in gap-1 border-transparent">
                    <PartyPopper className="size-3.5" aria-hidden /> Phase complete!
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {phase.skills.map((s) => (
                  <Badge key={s.id} variant="secondary">
                    {s.name}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Weekly milestones</h4>
                  <ul className="space-y-2">
                    {phase.milestones.map((m) => (
                      <li key={m.id} className="flex items-start gap-3">
                        <Checkbox
                          id={m.id}
                          checked={!!checked[m.id]}
                          onCheckedChange={() => onToggle(m.id)}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={m.id}
                          className={cn(
                            "cursor-pointer text-sm leading-snug",
                            checked[m.id] && "text-muted-foreground line-through",
                          )}
                        >
                          <span className="text-primary font-medium">Week {m.week}: </span>
                          {m.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Recommended resources ({style})</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      {phase.resources.map((r) => (
                        <li key={r} className="flex gap-2">
                          <Sparkles className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-accent/60 rounded-xl p-4">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Lightbulb className="size-4" aria-hidden /> Portfolio project
                    </h4>
                    <p className="text-accent-foreground mt-1 text-sm">{phase.project}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
