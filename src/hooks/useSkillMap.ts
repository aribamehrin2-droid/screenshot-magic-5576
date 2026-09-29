import { useCallback, useEffect, useState } from "react";
import type { SkillAssessment, LearningStyle } from "@/lib/skillmap";

export interface SkillMapState {
  step: number; // 0 = hero, 1..4 = steps
  careerId: string | null;
  careerName: string;
  skills: SkillAssessment[];
  hours: number;
  style: LearningStyle;
  timeline: 3 | 6 | 12;
  checked: Record<string, boolean>;
  seed: number;
  dark: boolean;
}

export const initialState: SkillMapState = {
  step: 0,
  careerId: null,
  careerName: "",
  skills: [],
  hours: 8,
  style: "Hands-on",
  timeline: 6,
  checked: {},
  seed: 0,
  dark: false,
};

const KEY = "skillmap.v1";

export function useSkillMap() {
  const [state, setState] = useState<SkillMapState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as SkillMapState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state, hydrated]);

  const update = useCallback(
    (patch: Partial<SkillMapState> | ((s: SkillMapState) => Partial<SkillMapState>)) =>
      setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })),
    [],
  );

  const reset = useCallback(
    () => setState((s) => ({ ...initialState, dark: s.dark })),
    [],
  );

  return { state, update, reset, hydrated };
}
