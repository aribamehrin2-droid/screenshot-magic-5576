import { ArrowRight, Map, Radar, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { icon: Radar, title: "See the gap", text: "Compare your level with what the role expects." },
  { icon: Map, title: "Know your score", text: "A weighted readiness score, not a vague vibe." },
  { icon: Route, title: "Get a plan", text: "Three phases with weekly milestones you can tick off." },
];

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="page-aura absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto max-w-3xl space-y-6 px-1 py-12 text-center sm:py-20">
        <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
          For students planning their next step
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Map the gap between <span className="text-brand-gradient">you</span> and your{" "}
          <span className="text-brand-gradient">dream career</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-base sm:text-lg">
          Rate your skills, see exactly where you stand against a real role, and walk away with a
          learning roadmap built around your time and your style.
        </p>
        <Button size="lg" onClick={onStart} className="bg-brand-gradient glow-shadow h-12 px-7 text-base">
          Start mapping my skills
          <ArrowRight className="size-5" aria-hidden />
        </Button>

        <div className="grid gap-4 pt-8 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="surface-card p-5 text-left">
              <Icon className="text-primary size-5" aria-hidden />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
