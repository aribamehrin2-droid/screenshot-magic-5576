import { useState } from "react";
import * as Icons from "lucide-react";
import { CAREERS, CUSTOM_CAREER, type Career } from "@/data/careers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function CareerIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Cmp className={className} aria-hidden />;
}

export function CareerStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (career: Career, customName?: string) => void;
}) {
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  return (
    <section aria-labelledby="career-heading" className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 id="career-heading" className="text-2xl font-bold sm:text-3xl">
          Choose your dream career
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
          Pick the role you are aiming for. We will compare your current skills with what that role
          usually needs.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAREERS.map((career) => {
          const active = selected === career.id;
          return (
            <button
              key={career.id}
              type="button"
              onClick={() => {
                setShowCustom(false);
                onSelect(career);
              }}
              aria-pressed={active}
              className={cn(
                "surface-card group flex h-full flex-col items-start gap-3 p-5 text-left hover:-translate-y-1 hover:glow-shadow",
                active && "ring-2 ring-primary",
              )}
            >
              <span
                className={cn(
                  "bg-brand-gradient text-primary-foreground flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                )}
              >
                <CareerIcon name={career.icon} className="size-5" />
              </span>
              <span className="font-semibold">{career.name}</span>
              <span className="text-muted-foreground text-sm">{career.description}</span>
              <span className="text-primary mt-auto pt-2 text-xs font-medium">
                {career.skills.length} core skills
              </span>
            </button>
          );
        })}
      </div>

      <div className="surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">{CUSTOM_CAREER.name}</h3>
            <p className="text-muted-foreground text-sm">{CUSTOM_CAREER.description}</p>
          </div>
          <Button variant="outline" onClick={() => setShowCustom((v) => !v)}>
            {showCustom ? "Cancel" : "Define my own"}
          </Button>
        </div>
        {showCustom && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="custom-career">Career name</Label>
              <Input
                id="custom-career"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Game Developer"
              />
            </div>
            <Button
              disabled={!customName.trim()}
              onClick={() => onSelect(CUSTOM_CAREER, customName.trim())}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
