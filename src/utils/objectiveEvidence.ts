import { getObjectiveTagCounts } from "../data/objectives";
import type { LearningObjective } from "../data/types";
import {
  countUnderAssessedSubObjectives,
  hasWeakCoverage,
  MIN_FORMATIVE_ACTIVITIES,
  MIN_SUMMATIVE_ACTIVITIES,
  subObjectiveNeedsActivities,
} from "./mappings";

export type EvidenceWarning = {
  id: string;
  message: string;
  severity: "critical" | "warning" | "info";
};

export type EvidenceBreakdown = {
  pages: number;
  activities: number;
  formative: number;
  summative: number;
  subObjectives: number;
};

export type FutureMetricSlot = {
  id: string;
  label: string;
  description: string;
};

export type ObjectiveEvidence = {
  score: number;
  strength: LearningObjective["coverage"];
  breakdown: EvidenceBreakdown;
  warnings: EvidenceWarning[];
  /** Placeholder slots for future learning evidence metrics */
  futureMetrics: FutureMetricSlot[];
};

const FUTURE_METRICS: FutureMetricSlot[] = [
  { id: "ftc", label: "First Try Correct", description: "Share of learners correct on first attempt" },
  { id: "ec", label: "Eventually Correct", description: "Share who reach correct after practice" },
  { id: "rd", label: "Relative Difficulty", description: "Compared to course baseline" },
  { id: "attempts", label: "Attempts", description: "Average attempts before mastery" },
];

function strengthFromScore(score: number): LearningObjective["coverage"] {
  if (score >= 75) return "strong";
  if (score >= 25) return "moderate";
  if (score > 0) return "moderate";
  return "none";
}

/** Weak alignment only when sub-objectives lack recommended activities */
export function resolveAlignmentStrength(
  objective: LearningObjective,
  score: number,
): LearningObjective["coverage"] {
  if (hasWeakCoverage(objective)) return "weak";
  return strengthFromScore(score);
}

function uniqueModulesFromPages(objective: LearningObjective): string[] {
  const modules = new Set<string>();
  for (const page of objective.linkedPages) {
    const parts = page.path.split("›").map((p) => p.trim());
    const modulePart = parts.find((p) => p.toLowerCase().startsWith("module"));
    if (modulePart) modules.add(modulePart);
    else if (parts.length > 0) modules.add(parts[parts.length - 1]);
  }
  return [...modules];
}

export function computeObjectiveEvidence(objective: LearningObjective): ObjectiveEvidence {
  const counts = getObjectiveTagCounts(objective);
  const activities = counts.formative + counts.summative;

  let score = 0;
  score += (Math.min(counts.pages, 5) / 5) * 25;
  score += (Math.min(counts.formative, 5) / 5) * 25;
  score += (Math.min(counts.summative, 3) / 3) * 25;
  score += (Math.min(counts.subObjectives, 4) / 4) * 25;

  if (counts.pages === 0) score -= 20;
  if (counts.summative === 0) score -= 15;
  if (counts.formative === 0) score -= 10;
  if (countUnderAssessedSubObjectives(objective) > 0) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const warnings: EvidenceWarning[] = [];

  if (counts.pages === 0) {
    warnings.push({
      id: "no-pages",
      message: "No pages support this objective",
      severity: "critical",
    });
  } else if (counts.pages === 1) {
    warnings.push({
      id: "single-page",
      message: "Only one page supports this objective",
      severity: "warning",
    });
  }

  if (counts.summative === 0) {
    warnings.push({
      id: "no-summative",
      message: "No summative assessment linked",
      severity: "critical",
    });
  }

  if (counts.formative === 0) {
    warnings.push({
      id: "no-formative",
      message: "No formative practice activities linked",
      severity: "warning",
    });
  }

  const underAssessed = countUnderAssessedSubObjectives(objective);
  if (underAssessed > 0) {
    warnings.push({
      id: "under-assessed",
      message: `${underAssessed} sub-objective${underAssessed === 1 ? "" : "s"} below recommended ${MIN_FORMATIVE_ACTIVITIES} formative and ${MIN_SUMMATIVE_ACTIVITIES} summative`,
      severity: "warning",
    });
  }

  const modules = uniqueModulesFromPages(objective);
  if (modules.length === 1 && counts.pages > 1) {
    warnings.push({
      id: "concentrated-module",
      message: `Coverage concentrated in ${modules[0]}`,
      severity: "info",
    });
  }

  if (score < 40 && warnings.length === 0) {
    warnings.push({
      id: "limited-evidence",
      message: "Limited evidence supports this objective",
      severity: "warning",
    });
  }

  for (const sub of objective.subObjectives) {
    if (subObjectiveNeedsActivities(sub)) {
      warnings.push({
        id: `sub-${sub.id}`,
        message: `Sub-objective "${sub.title.slice(0, 40)}${sub.title.length > 40 ? "…" : ""}" needs more activities`,
        severity: "warning",
      });
      break;
    }
  }

  return {
    score,
    strength: resolveAlignmentStrength(objective, score),
    breakdown: {
      pages: counts.pages,
      activities,
      formative: counts.formative,
      summative: counts.summative,
      subObjectives: counts.subObjectives,
    },
    warnings,
    futureMetrics: FUTURE_METRICS,
  };
}

export function evidenceStrengthLabel(strength: LearningObjective["coverage"]): string {
  switch (strength) {
    case "strong":
      return "Strong alignment";
    case "moderate":
      return "Moderate alignment";
    case "weak":
      return "Weak alignment";
    default:
      return "No alignment";
  }
}
