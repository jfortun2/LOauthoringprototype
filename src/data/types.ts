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

export type SubObjectiveActivity = {
  id: string;
  title: string;
  type: "formative" | "summative";
};

export type SubObjective = {
  id: string;
  title: string;
  formativeCount: number;
  summativeCount: number;
  activities: SubObjectiveActivity[];
};

/** Used before activity enrichment at load time */
export type SubObjectiveDraft = Omit<SubObjective, "activities"> & {
  activityLinks?: string[];
};

export type ObjectiveTagCounts = {
  pages: number;
  subObjectives: number;
  formative: number;
  summative: number;
};

export type LearningObjective = {
  id: string;
  title: string;
  subObjectives: SubObjective[];
  linkedPages: LinkedPage[];
  linkedAssessments: LinkedAssessment[];
  coverage: CoverageStrength;
  /** Student performance signal: share of learners meeting mastery (0–100) */
  performancePercent: number | null;
  /** Optional display overrides for prototype fidelity */
  tagCounts?: ObjectiveTagCounts;
};

export type LearningObjectiveDraft = Omit<LearningObjective, "subObjectives"> & {
  subObjectives: SubObjectiveDraft[];
};

export type ContentNodeType =
  | "sequence"
  | "unit"
  | "module"
  | "section"
  | "page"
  | "activity";

export type ContentNode = {
  id: string;
  type: ContentNodeType;
  title: string;
  children?: ContentNode[];
  /** Learning objective IDs this page or activity supports */
  objectiveIds?: string[];
};
