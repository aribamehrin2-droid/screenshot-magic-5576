import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Download, Moon, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/skillmap/Hero";
import { StepBar } from "@/components/skillmap/StepBar";
import { CareerStep } from "@/components/skillmap/CareerStep";
import { SkillsStep } from "@/components/skillmap/SkillsStep";
import { AnalysisStep } from "@/components/skillmap/AnalysisStep";
import { RoadmapStep } from "@/components/skillmap/RoadmapStep";
import { useSkillMap } from "@/hooks/useSkillMap";
import { analyse, buildRoadmap, type LearningStyle } from "@/lib/skillmap";
import type { Career } from "@/data/careers";

const TITLE = "SkillMap — Compare your skills with your dream career";
const DESCRIPTION =
  "Rate your skills, see your career readiness score and gaps, and get a personalized 3-phase learning roadmap. Free, private and instant.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillMapPage,
});

function SkillMapPage() {
  const { state, update, reset, hydrated } = useSkillMap();

  const analysis = useMemo(
    () => analyse(state.skills, state.careerName || "your target role"),
    [state.skills, state.careerName],
  );

  const phases = useMemo(
    () => buildRoadmap(analysis, state.hours, state.style, state.timeline, state.seed),
    [analysis, state.hours, state.style, state.timeline, state.seed],
  );

  const selectCareer = (career: Career, customName?: string) => {
    update({
      careerId: career.id,
      careerName: customName ?? career.name,
      skills: career.skills.map((s) => ({ ...s, current: 1 })),
      checked: {},
      step: 2,
    });
  };

  const maxReached = state.careerId ? (state.skills.length > 0 ? 4 : 2) : 1;
  const canNext =
    (state.step === 1 && !!state.careerId) ||
    (state.step === 2 && state.skills.length > 0) ||
    state.step === 3;

  if (!hydrated) {
    return <div className="min-h-screen" aria-hidden />;
  }

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => update({ step: 0 })}
            className="flex items-center gap-2"
            aria-label="SkillMap home"
          >
            <span className="bg-brand-gradient text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
              S
            </span>
            <span className="text-lg font-bold">SkillMap</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {state.step >= 4 && (
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="size-4" aria-hidden />
                <span className="hidden sm:inline">Download roadmap</span>
              </Button>
            )}
            {state.step > 0 && (
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="size-4" aria-hidden />
                <span className="hidden sm:inline">Start over</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => update({ dark: !state.dark })}
              aria-label={state.dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {state.dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {state.step === 0 ? (
          <Hero onStart={() => update({ step: 1 })} />
        ) : (
          <div className="space-y-8 py-8">
            <div className="mx-auto max-w-2xl">
              <StepBar step={state.step} maxReached={maxReached} onJump={(s) => update({ step: s })} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {state.step === 1 && (
                <CareerStep selected={state.careerId} onSelect={selectCareer} />
              )}
              {state.step === 2 && (
                <SkillsStep
                  careerName={state.careerName}
                  skills={state.skills}
                  onChange={(skills) => update({ skills })}
                />
              )}
              {state.step === 3 && (
                <AnalysisStep analysis={analysis} careerName={state.careerName} />
              )}
              {state.step === 4 && (
                <RoadmapStep
                  phases={phases}
                  hours={state.hours}
                  style={state.style}
                  timeline={state.timeline}
                  checked={state.checked}
                  onHours={(hours) => update({ hours })}
                  onStyle={(style: LearningStyle) => update({ style })}
                  onTimeline={(timeline) => update({ timeline })}
                  onToggle={(id) =>
                    update((s) => ({ checked: { ...s.checked, [id]: !s.checked[id] } }))
                  }
                  onRegenerate={() => update((s) => ({ seed: s.seed + 1, checked: {} }))}
                />
              )}
            </div>

            <div className="no-print flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => update((s) => ({ step: Math.max(0, s.step - 1) }))}
              >
                <ArrowLeft className="size-4" aria-hidden /> Back
              </Button>
              {state.step < 4 && (
                <Button
                  disabled={!canNext}
                  onClick={() => update((s) => ({ step: Math.min(4, s.step + 1) }))}
                  className="bg-brand-gradient glow-shadow"
                >
                  {state.step === 3 ? "Build my roadmap" : "Continue"}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <p className="text-muted-foreground mx-auto max-w-6xl px-4 text-center text-xs">
          Recommendations are guidance, not guarantees. SkillMap keeps everything on your device.
        </p>
      </footer>
    </div>
  );
}
