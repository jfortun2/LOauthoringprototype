import type { LearningObjective, SubObjective } from "../data/types";
import {
  MIN_FORMATIVE_ACTIVITIES,
  MIN_SUMMATIVE_ACTIVITIES,
} from "./mappings";

export type AssessmentGap = "formative" | "summative";

export type SubObjectiveGap = {
  subObjectiveId: string;
  subTitle: string;
  missing: AssessmentGap[];
};

export type ObjectiveMappingGaps = {
  noPages: boolean;
  noSubObjectives: boolean;
  subObjectiveGaps: SubObjectiveGap[];
};

function missingAssessmentsForSub(sub: SubObjective): AssessmentGap[] {
  const missing: AssessmentGap[] = [];
  if (sub.formativeCount < MIN_FORMATIVE_ACTIVITIES) missing.push("formative");
  if (sub.summativeCount < MIN_SUMMATIVE_ACTIVITIES) missing.push("summative");
  return missing;
}

export function getObjectiveMappingGaps(objective: LearningObjective): ObjectiveMappingGaps {
  const subObjectiveGaps = objective.subObjectives
    .map((sub) => ({
      subObjectiveId: sub.id,
      subTitle: sub.title,
      missing: missingAssessmentsForSub(sub),
    }))
    .filter((gap) => gap.missing.length > 0);

  return {
    noPages: objective.linkedPages.length === 0,
    noSubObjectives: objective.subObjectives.length === 0,
    subObjectiveGaps,
  };
}

export function formatActivityGap(missing: AssessmentGap[]): string {
  if (missing.length === 2) return "Missing formative and summative activities";
  if (missing.includes("formative")) return "Missing formative activities";
  return "Missing summative activities";
}

export { hasMissingActivities as hasMissingAssessments } from "./objectiveMappingViews";
