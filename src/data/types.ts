export type CoverageStrength = "none" | "weak" | "moderate" | "strong";

export type LinkedPage = {
  id: string;
  title: string;
  path: string;
};

export type LinkedAssessment = {
  id: string;
  title: string;
  type: "formative" | "summative";
};

export type LearningObjective = {
  id: string;
  title: string;
  subObjectiveItems: string[];
  linkedPages: LinkedPage[];
  linkedAssessments: LinkedAssessment[];
  coverage: CoverageStrength;
  /** Student performance signal: share of learners meeting mastery (0–100) */
  performancePercent: number | null;
};

export type ContentNodeType = "sequence" | "unit" | "module" | "page" | "activity";

export type ContentNode = {
  id: string;
  type: ContentNodeType;
  title: string;
  children?: ContentNode[];
  /** Learning objective IDs this page or activity supports */
  objectiveIds?: string[];
};
