import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import type { Analysis, GapEntry } from "@/lib/skillmap";
import { LEVEL_LABELS } from "@/data/careers";
import { ReadinessGauge } from "./ReadinessGauge";
import { Badge } from "@/components/ui/badge";

function GroupCard({
  title,
  icon,
  tone,
  entries,
}: {
  title: string;
  icon: React.ReactNode;
  tone: string;
  entries: GapEntry[];
}) {
  return (
    <div className="surface-card print-block flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}>{icon}</span>
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {entries.length}
        </Badge>
      </div>
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nothing in this group yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{e.name}</span>
              <span className="text-muted-foreground shrink-0 text-xs">
                {LEVEL_LABELS[e.current]} → target {e.target}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AnalysisStep({
  analysis,
  careerName,
}: {
  analysis: Analysis;
  careerName: string;
}) {
  const radarData = analysis.entries.map((e) => ({
    skill: e.name.length > 18 ? `${e.name.slice(0, 17)}…` : e.name,
    Current: e.current,
    Required: e.target,
  }));

  const gapData = analysis.topGaps.map((e) => ({
    name: e.name.length > 20 ? `${e.name.slice(0, 19)}…` : e.name,
    gap: e.gap,
    importance: e.importance,
  }));

  return (
    <section aria-labelledby="analysis-heading" className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 id="analysis-heading" className="text-2xl font-bold sm:text-3xl">
          Your skill gap for {careerName}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
          Scores are weighted by how essential each skill is for the role.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card print-block flex flex-col justify-center gap-4 p-5">
          <ReadinessGauge value={analysis.readiness} />
          <p className="text-muted-foreground text-center text-sm">{analysis.summary}</p>
        </div>

        <div className="surface-card print-block p-5 lg:col-span-2">
          <h3 className="mb-2 font-semibold">Current vs required level</h3>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Radar
                  name="Required"
                  dataKey="Required"
                  stroke="var(--primary-glow)"
                  fill="var(--primary-glow)"
                  fillOpacity={0.18}
                />
                <Radar
                  name="Current"
                  dataKey="Current"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--popover-foreground)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GroupCard
          title="Strengths"
          tone="bg-success/15 text-success"
          icon={<CheckCircle2 className="size-4" aria-hidden />}
          entries={analysis.strengths}
        />
        <GroupCard
          title="In progress"
          tone="bg-warning/20 text-warning"
          icon={<TrendingUp className="size-4" aria-hidden />}
          entries={analysis.inProgress}
        />
        <GroupCard
          title="Critical gaps"
          tone="bg-destructive/15 text-destructive"
          icon={<AlertTriangle className="size-4" aria-hidden />}
          entries={analysis.criticalGaps}
        />
      </div>

      {gapData.length > 0 && (
        <div className="surface-card print-block p-5">
          <h3 className="mb-4 font-semibold">Top 5 gaps to close</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} layout="vertical" margin={{ left: 12, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(v: number) => [`${v} level${v === 1 ? "" : "s"} to gain`, "Gap"]}
                />
                <Bar dataKey="gap" radius={[0, 8, 8, 0]}>
                  {gapData.map((d, i) => (
                    <Cell
                      key={d.name}
                      fill={i % 2 === 0 ? "var(--primary)" : "var(--primary-glow)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
