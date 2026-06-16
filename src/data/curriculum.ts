import type { LearningObjective } from "./types";

export type AppPage = "objectives" | "curriculum";

export type CurriculumView = "basic" | "detailed" | "learning";

export type CurriculumItemType = "page" | "module" | "activity-page" | "section";

export type CurriculumNode = {
  id: string;
  unitId: string;
  type: CurriculumItemType;
  title: string;
  /** Show "Edit Page" link (pages and activity pages) */
  showEditLink?: boolean;
  /** Learning objectives covered by pages and activities in this module */
  objectiveIds?: string[];
  children?: CurriculumNode[];
};

/** Top-level curriculum items per unit (modules may contain nested pages). */
export const curriculumByUnit: Record<string, CurriculumNode[]> = {
  "unit-1": [
    {
      id: "cur-1",
      unitId: "unit-1",
      type: "page",
      title: "Introduction to REAL Chemistry",
      showEditLink: true,
    },
    {
      id: "cur-2",
      unitId: "unit-1",
      type: "page",
      title: "REAL CHEM : Designed for Learning",
      showEditLink: true,
    },
    {
      id: "cur-3",
      unitId: "unit-1",
      type: "module",
      title: "Module 1: Basic Concepts of Matter and Energy",
      objectiveIds: ["1", "3"],
      children: [
        {
          id: "cur-3a",
          unitId: "unit-1",
          type: "page",
          title: "Matter and Its States",
          showEditLink: true,
          objectiveIds: ["1"],
        },
        {
          id: "cur-3b",
          unitId: "unit-1",
          type: "page",
          title: "Energy: Kinetic and Potential",
          showEditLink: true,
          objectiveIds: ["1", "3"],
        },
        {
          id: "cur-3c",
          unitId: "unit-1",
          type: "activity-page",
          title: "Practice: Classifying Matter",
          showEditLink: true,
          objectiveIds: ["3"],
        },
        {
          id: "cur-3d",
          unitId: "unit-1",
          type: "page",
          title: "Conservation of Energy",
          showEditLink: true,
          objectiveIds: ["3"],
        },
      ],
    },
    {
      id: "cur-4",
      unitId: "unit-1",
      type: "module",
      title: "Module 2: Measurements",
      objectiveIds: ["8", "14"],
      children: [
        {
          id: "cur-4a",
          unitId: "unit-1",
          type: "section",
          title: "Section A: Units and Precision",
          children: [
            {
              id: "cur-4a-1",
              unitId: "unit-1",
              type: "page",
              title: "SI Units and Prefixes",
              showEditLink: true,
              objectiveIds: ["8"],
            },
            {
              id: "cur-4a-2",
              unitId: "unit-1",
              type: "page",
              title: "Significant Figures",
              showEditLink: true,
              objectiveIds: ["14"],
            },
          ],
        },
        {
          id: "cur-4b",
          unitId: "unit-1",
          type: "section",
          title: "Section B: Problem Solving",
          children: [
            {
              id: "cur-4b-1",
              unitId: "unit-1",
              type: "page",
              title: "Dimensional Analysis",
              showEditLink: true,
              objectiveIds: ["8", "14"],
            },
            {
              id: "cur-4b-2",
              unitId: "unit-1",
              type: "activity-page",
              title: "Measurements Checkpoint",
              showEditLink: true,
              objectiveIds: ["8"],
            },
          ],
        },
      ],
    },
    {
      id: "cur-5",
      unitId: "unit-1",
      type: "page",
      title: "Unit Key Equations and Key Terms",
      showEditLink: true,
    },
    {
      id: "cur-6",
      unitId: "unit-1",
      type: "activity-page",
      title: "Exploration: Modeling Uncertainty in a Changing Climate",
      showEditLink: true,
    },
    {
      id: "cur-7",
      unitId: "unit-1",
      type: "activity-page",
      title: "Foundations of Chemistry Unit Checkpoint",
      showEditLink: true,
    },
  ],
  "unit-2": [
    {
      id: "cur-8",
      unitId: "unit-2",
      type: "page",
      title: "Atoms and Molecules Overview",
      showEditLink: true,
    },
    {
      id: "cur-9",
      unitId: "unit-2",
      type: "module",
      title: "Module 1: Atomic Structure",
      objectiveIds: ["2", "7"],
      children: [
        {
          id: "cur-9a",
          unitId: "unit-2",
          type: "page",
          title: "Subatomic Particles",
          showEditLink: true,
          objectiveIds: ["2"],
        },
        {
          id: "cur-9b",
          unitId: "unit-2",
          type: "page",
          title: "Isotopes and Atomic Mass",
          showEditLink: true,
          objectiveIds: ["7"],
        },
        {
          id: "cur-9c",
          unitId: "unit-2",
          type: "activity-page",
          title: "Atomic Structure Quiz",
          showEditLink: true,
          objectiveIds: ["2", "7"],
        },
      ],
    },
  ],
};

export function getCurriculumForUnit(unitId: string): CurriculumNode[] {
  return curriculumByUnit[unitId] ?? [];
}

export function findCurriculumNode(
  unitId: string,
  nodeId: string,
  nodes: CurriculumNode[] = getCurriculumForUnit(unitId),
): CurriculumNode | undefined {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findCurriculumNode(unitId, nodeId, node.children);
      if (found) return found;
    }
  }
  return undefined;
}

export function getObjectivesForCurriculumModule(
  item: CurriculumNode,
  objectives: LearningObjective[],
): LearningObjective[] {
  if (item.type !== "module" || !item.objectiveIds?.length) return [];
  const idSet = new Set(item.objectiveIds);
  return objectives.filter((objective) => idSet.has(objective.id));
}
