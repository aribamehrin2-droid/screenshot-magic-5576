import {
  IMPORTANCE_WEIGHT,
  type Importance,
  type Skill,
  type SkillCategory,
} from "@/data/careers";

export type LearningStyle = "Video" | "Reading" | "Hands-on";

export interface SkillAssessment extends Skill {
  current: number; // 0-5
}

export interface GapEntry extends SkillAssessment {
  gap: number;
  priority: number;
  status: "Strength" | "In Progress" | "Critical Gap";
}

export interface Analysis {
  entries: GapEntry[];
  readiness: number;
  strengths: GapEntry[];
  inProgress: GapEntry[];
  criticalGaps: GapEntry[];
  topGaps: GapEntry[];
  summary: string;
}

export function analyse(skills: SkillAssessment[], careerName: string): Analysis {
  const entries: GapEntry[] = skills.map((sk) => {
    const gap = Math.max(0, sk.target - sk.current);
    const weight = IMPORTANCE_WEIGHT[sk.importance];
    const status: GapEntry["status"] =
      gap <= 0 ? "Strength" : gap <= 1 ? "In Progress" : "Critical Gap";
    return { ...sk, gap, priority: gap * weight, status };
  });

  const totalWeight = entries.reduce(
    (a, e) => a + IMPORTANCE_WEIGHT[e.importance] * e.target,
    0,
  );
  const earned = entries.reduce(
    (a, e) => a + IMPORTANCE_WEIGHT[e.importance] * Math.min(e.current, e.target),
    0,
  );
  const readiness = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  const strengths = entries.filter((e) => e.status === "Strength");
  const inProgress = entries.filter((e) => e.status === "In Progress");
  const criticalGaps = entries.filter((e) => e.status === "Critical Gap");
  const topGaps = [...entries]
    .filter((e) => e.gap > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  const band =
    readiness >= 80
      ? "You are close to job-ready"
      : readiness >= 55
        ? "You have a solid base"
        : readiness >= 30
          ? "You have made a real start"
          : "You are early in the journey";

  const focus = topGaps
    .slice(0, 3)
    .map((g) => g.name)
    .join(", ");

  const summary =
    `${band} for ${careerName}, scoring ${readiness}% readiness. ` +
    `${strengths.length} skill${strengths.length === 1 ? "" : "s"} already meet the target level, ` +
    `${inProgress.length} are close behind, and ${criticalGaps.length} need serious work. ` +
    (focus
      ? `Focus first on ${focus} — these carry the most weight for this role.`
      : `Nothing is far behind, so deepen your strongest skills and start building portfolio work.`);

  return { entries, readiness, strengths, inProgress, criticalGaps, topGaps, summary };
}

export interface Milestone {
  id: string;
  label: string;
  week: number;
}

export interface Phase {
  id: string;
  name: string;
  goal: string;
  skills: GapEntry[];
  weeks: number;
  milestones: Milestone[];
  resources: string[];
  project: string;
}

const RESOURCES: Record<LearningStyle, string[]> = {
  Video: [
    "Structured video course with exercises",
    "Recorded university lectures",
    "Short daily tutorial series",
    "Conference talks and walkthroughs",
  ],
  Reading: [
    "One reference book per skill",
    "Official documentation deep-dive",
    "Written tutorials and cheat sheets",
    "Case studies and technical blogs",
  ],
  "Hands-on": [
    "Guided build-along projects",
    "Practice problem sets and challenges",
    "Open-source issues to fix",
    "Timed mock tasks and reviews",
  ],
};

const PROJECTS: Record<string, string[]> = {
  Technical: [
    "Build a small end-to-end project that uses this skill and write up what you learned",
    "Recreate a real product feature and document your approach",
    "Ship a working prototype and publish the source",
  ],
  Tools: [
    "Set up a complete workflow with these tools and record a short walkthrough",
    "Rebuild an existing project using only these tools",
    "Create a reusable template others can start from",
  ],
  "Soft Skills": [
    "Present your work to a study group and collect written feedback",
    "Write a case study of a project decision you made and why",
    "Run a small group session teaching what you learned",
  ],
};

function projectIdea(skills: GapEntry[], index: number): string {
  const cat: SkillCategory = skills[0]?.category ?? "Technical";
  const pool = PROJECTS[cat] ?? PROJECTS["Technical"] ?? [];
  const names = skills
    .slice(0, 2)
    .map((s) => s.name)
    .join(" + ");
  const idea = pool[index % Math.max(1, pool.length)] ?? "Build a small project that uses these skills";
  return `${idea} (${names || "your target skills"}).`;
}

export function buildRoadmap(
  analysis: Analysis,
  hoursPerWeek: number,
  style: LearningStyle,
  timelineMonths: number,
  seed = 0,
): Phase[] {
  const ranked = [...analysis.entries]
    .filter((e) => e.gap > 0)
    .sort((a, b) => b.priority - a.priority || b.target - a.target);

  const pool = ranked.length
    ? ranked
    : [...analysis.entries].sort((a, b) => b.target - a.target).slice(0, 3);

  const third = Math.ceil(pool.length / 3);
  const buckets: GapEntry[][] = [
    pool.slice(0, third),
    pool.slice(third, third * 2),
    pool.slice(third * 2),
  ];

  const meta = [
    { name: "Foundation", goal: "Close the biggest gaps and build reliable basics." },
    { name: "Intermediate", goal: "Apply skills together on realistic problems." },
    { name: "Job-ready", goal: "Polish, prove and present your work to employers." },
  ];

  const totalWeeks = timelineMonths * 4;
  const totalEffort = pool.reduce((a, s) => a + s.gap * IMPORTANCE_WEIGHT[s.importance], 0) || 1;
  const paceFactor = Math.min(1.6, Math.max(0.6, 10 / Math.max(3, hoursPerWeek)));

  let weekCursor = 0;

  return buckets.map((skills, idx) => {
    const effort = skills.reduce((a, s) => a + s.gap * IMPORTANCE_WEIGHT[s.importance], 0);
    const share = effort / totalEffort;
    const weeks = Math.max(2, Math.round(totalWeeks * share * paceFactor) || 2);

    const milestones: Milestone[] = [];
    const list = skills.length ? skills : pool.slice(0, 2);
    const perSkill = Math.max(1, Math.round(weeks / Math.max(1, list.length)));
    list.forEach((skill, i) => {
      const week = weekCursor + Math.min(weeks, i * perSkill + 1);
      milestones.push({
        id: `${idx}-${skill.id}-a`,
        week,
        label: `Study ${skill.name} up to level ${Math.min(5, skill.current + Math.ceil(skill.gap / 2) || skill.target)} (${IMPORTANCE_WEIGHT[skill.importance] === 3 ? "essential" : "supporting"})`,
      });
      milestones.push({
        id: `${idx}-${skill.id}-b`,
        week: week + 1,
        label: `Practice ${skill.name} on a real task and note what still feels shaky`,
      });
    });
    milestones.push({
      id: `${idx}-review`,
      week: weekCursor + weeks,
      label: `Review phase ${idx + 1}, re-rate these skills and share progress with someone`,
    });

    weekCursor += weeks;

    const styleRes = RESOURCES[style];
    const resources: string[] = [
      styleRes[(idx + seed) % styleRes.length] ?? "Self-paced study on each skill",
      styleRes[(idx + seed + 1) % styleRes.length] ?? "Weekly practice session",
      idx === 2 ? "Mock interviews and portfolio feedback" : "A weekly self-check on progress",
    ];

    const phaseMeta = meta[idx] ?? meta[0]!;

    return {
      id: `phase-${idx}`,
      name: phaseMeta.name,
      goal: phaseMeta.goal,
      skills: list,
      weeks,
      milestones,
      resources,
      project: projectIdea(list, idx + seed),
    };
  });
}

export const importanceOrder: Importance[] = ["Essential", "Important", "Nice-to-have"];
