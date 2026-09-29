import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  LEVEL_LABELS,
  type Importance,
  type SkillCategory,
} from "@/data/careers";
import type { SkillAssessment } from "@/lib/skillmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORIES: SkillCategory[] = ["Technical", "Soft Skills", "Tools"];
const IMPORTANCES: Importance[] = ["Essential", "Important", "Nice-to-have"];

function importanceClass(i: Importance) {
  return i === "Essential"
    ? "bg-primary/15 text-primary"
    : i === "Important"
      ? "bg-accent text-accent-foreground"
      : "bg-muted text-muted-foreground";
}

export function SkillsStep({
  careerName,
  skills,
  onChange,
}: {
  careerName: string;
  skills: SkillAssessment[];
  onChange: (skills: SkillAssessment[]) => void;
}) {
  const [draft, setDraft] = useState({
    name: "",
    category: "Technical" as SkillCategory,
    importance: "Important" as Importance,
    target: 4,
  });

  const setLevel = (id: string, value: number) =>
    onChange(skills.map((s) => (s.id === id ? { ...s, current: value } : s)));

  const addSkill = () => {
    const name = draft.name.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${skills.length}`;
    onChange([
      ...skills,
      { id, name, category: draft.category, importance: draft.importance, target: draft.target, current: 1 },
    ]);
    setDraft({ ...draft, name: "" });
  };

  return (
    <section aria-labelledby="skills-heading" className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 id="skills-heading" className="text-2xl font-bold sm:text-3xl">
          Rate your skills
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
          Be honest — this only works if the starting point is real. Target levels come from what{" "}
          {careerName} roles typically expect.
        </p>
      </header>

      {skills.length === 0 && (
        <p className="text-muted-foreground surface-card p-6 text-center text-sm">
          No skills yet. Add the skills your target role needs using the form below.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {skills.map((skill) => (
          <div key={skill.id} className="surface-card space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{skill.name}</h3>
                <p className="text-muted-foreground text-xs">{skill.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("border-transparent", importanceClass(skill.importance))}>
                  {skill.importance}
                </Badge>
                <Badge variant="outline">Target {skill.target}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`slider-${skill.id}`} className="text-sm">
                  Your level
                </Label>
                <span className="text-primary text-sm font-semibold">
                  {LEVEL_LABELS[skill.current]}
                </span>
              </div>
              <Slider
                id={`slider-${skill.id}`}
                value={[skill.current]}
                min={1}
                max={5}
                step={1}
                onValueChange={([v]) => setLevel(skill.id, v)}
                aria-label={`Your level in ${skill.name}`}
              />
              <div className="text-muted-foreground flex justify-between text-[10px]">
                {LEVEL_LABELS.slice(1).map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card space-y-4 p-5">
        <h3 className="font-semibold">Add another skill</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div className="space-y-1.5 lg:col-span-2">
            <Label htmlFor="new-skill">Skill name</Label>
            <Input
              id="new-skill"
              value={draft.name}
              placeholder="e.g. Public speaking"
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-category">Category</Label>
            <Select
              value={draft.category}
              onValueChange={(v) => setDraft({ ...draft, category: v as SkillCategory })}
            >
              <SelectTrigger id="new-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-importance">Importance</Label>
            <Select
              value={draft.importance}
              onValueChange={(v) => setDraft({ ...draft, importance: v as Importance })}
            >
              <SelectTrigger id="new-importance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMPORTANCES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-target">Target level: {draft.target}</Label>
            <Slider
              id="new-target"
              value={[draft.target]}
              min={1}
              max={5}
              step={1}
              onValueChange={([v]) => setDraft({ ...draft, target: v })}
              aria-label="Target level for new skill"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={addSkill} disabled={!draft.name.trim()}>
            <Plus className="size-4" aria-hidden /> Add skill
          </Button>
          {skills.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => onChange(skills.slice(0, -1))}
              aria-label="Remove last skill"
            >
              <Trash2 className="size-4" aria-hidden /> Remove last
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
