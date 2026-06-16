import type { LearningObjective } from "./types";

export type ProficiencyLevel = "high" | "medium" | "low" | "insufficient";

export type ProficiencyDistribution = {
  high: number;
  medium: number;
  low: number;
  insufficient: number;
};

export type ObjectiveProficiency = {
  level: ProficiencyLevel;
  distribution: ProficiencyDistribution;
  learnerCount: number;
  sectionCount: number;
  summary: string;
  /** Secondary metrics for Insights deep-dive */
  attempts: number | null;
  firstAttemptCorrect: number | null;
  eventuallyCorrect: number | null;
  relativeDifficulty: "easier" | "average" | "harder" | null;
};

const MIN_LEARNERS = 10;

export function proficiencyLabel(level: ProficiencyLevel): string {
  switch (level) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    case "insufficient":
      return "Not enough information";
  }
}

function levelFromPercent(percent: number): ProficiencyLevel {
  if (percent >= 70) return "high";
  if (percent >= 50) return "medium";
  return "low";
}

function distributionFromPercent(percent: number): ProficiencyDistribution {
  const high = Math.round(Math.min(percent * 0.9, 85));
  const low = Math.round(Math.max(100 - percent - 15, 5));
  const medium = Math.max(0, 100 - high - low);
  return { high, medium, low, insufficient: 0 };
}

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mockMetrics(objectiveId: string, percent: number) {
  const seed = hashSeed(objectiveId);
  const attempts = 1.2 + (seed % 30) / 10;
  const firstAttemptCorrect = Math.max(20, Math.min(90, percent - 15 + (seed % 12)));
  const eventuallyCorrect = Math.max(firstAttemptCorrect, Math.min(98, percent + 8 + (seed % 10)));
  const diffIndex = seed % 3;
  const relativeDifficulty: ObjectiveProficiency["relativeDifficulty"] =
    diffIndex === 0 ? "easier" : diffIndex === 1 ? "average" : "harder";
  return { attempts, firstAttemptCorrect, eventuallyCorrect, relativeDifficulty };
}

function summaryForLevel(level: ProficiencyLevel, sectionCount: number): string {
  switch (level) {
    case "high":
      return `Most learners across ${sectionCount} section${sectionCount === 1 ? "" : "s"} are meeting proficiency for this objective.`;
    case "medium":
      return `Learner performance is mixed across ${sectionCount} section${sectionCount === 1 ? "" : "s"} — some groups may need additional support.`;
    case "low":
      return `Many learners across ${sectionCount} section${sectionCount === 1 ? "" : "s"} are struggling with this objective.`;
    case "insufficient":
      return "Not enough learner activity yet to estimate course-wide proficiency for this objective.";
  }
}

export function getObjectiveProficiency(objective: LearningObjective): ObjectiveProficiency {
  const sectionCount = Math.max(1, Math.min(6, objective.linkedPages.length + hashSeed(objective.id) % 4));
  const learnerCount =
    objective.performancePercent != null
      ? 40 + (hashSeed(objective.id) % 120)
      : hashSeed(objective.id) % 8;

  if (objective.performancePercent == null || learnerCount < MIN_LEARNERS) {
    return {
      level: "insufficient",
      distribution: { high: 0, medium: 0, low: 0, insufficient: 100 },
      learnerCount,
      sectionCount: objective.performancePercent == null ? 0 : sectionCount,
      summary: summaryForLevel("insufficient", sectionCount),
      attempts: null,
      firstAttemptCorrect: null,
      eventuallyCorrect: null,
      relativeDifficulty: null,
    };
  }

  const level = levelFromPercent(objective.performancePercent);
  const metrics = mockMetrics(objective.id, objective.performancePercent);

  return {
    level,
    distribution: distributionFromPercent(objective.performancePercent),
    learnerCount,
    sectionCount,
    summary: summaryForLevel(level, sectionCount),
    ...metrics,
  };
}

export function hasProficiencyData(proficiency: ObjectiveProficiency): boolean {
  return proficiency.level !== "insufficient";
}
