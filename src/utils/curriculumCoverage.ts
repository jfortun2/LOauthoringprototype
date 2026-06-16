import type { CurriculumNode } from "../data/curriculum";
import type { LearningObjective } from "../data/types";
import { computeObjectiveEvidence } from "./objectiveEvidence";

export type CurriculumPageNode = {
  id: string;
  title: string;
  type: "page" | "activity-page";
  objectiveIds: string[];
};

export type ModuleInsight = {
  id: string;
  message: string;
  severity: "critical" | "warning" | "info";
};

export type ObjectiveContentLink = {
  objectiveId: string;
  objectiveTitle: string;
  score: number;
  pages: CurriculumPageNode[];
};

export type CoverageMatrixCell = {
  objectiveId: string;
  pageId: string;
  strength: "none" | "weak" | "moderate" | "strong";
};

export type CoverageMatrix = {
  objectives: { id: string; title: string }[];
  pages: { id: string; title: string }[];
  cells: CoverageMatrixCell[];
};

function walkPages(
  nodes: CurriculumNode[],
  result: CurriculumPageNode[] = [],
): CurriculumPageNode[] {
  for (const node of nodes) {
    if (node.type === "page" || node.type === "activity-page") {
      result.push({
        id: node.id,
        title: node.title,
        type: node.type,
        objectiveIds: node.objectiveIds ?? [],
      });
    }
    if (node.children) walkPages(node.children, result);
  }
  return result;
}

export function getModulePages(module: CurriculumNode): CurriculumPageNode[] {
  return walkPages(module.children ?? []);
}

export function getModuleObjectiveIds(module: CurriculumNode): string[] {
  const ids = new Set<string>(module.objectiveIds ?? []);
  for (const page of getModulePages(module)) {
    for (const id of page.objectiveIds) ids.add(id);
  }
  return [...ids];
}

export function getObjectiveContentLinks(
  module: CurriculumNode,
  objectives: LearningObjective[],
): ObjectiveContentLink[] {
  const pages = getModulePages(module);
  const objectiveIds = getModuleObjectiveIds(module);

  return objectiveIds
    .map((objectiveId) => {
      const objective = objectives.find((o) => o.id === objectiveId);
      if (!objective) return null;
      const supportingPages = pages.filter((p) => p.objectiveIds.includes(objectiveId));
      return {
        objectiveId,
        objectiveTitle: objective.title,
        score: computeObjectiveEvidence(objective).score,
        pages: supportingPages,
      };
    })
    .filter((link): link is ObjectiveContentLink => link !== null);
}

export function buildCoverageMatrix(
  module: CurriculumNode,
  objectives: LearningObjective[],
): CoverageMatrix {
  const pages = getModulePages(module);
  const objectiveIds = getModuleObjectiveIds(module);
  const objectiveList = objectiveIds
    .map((id) => objectives.find((o) => o.id === id))
    .filter((o): o is LearningObjective => o !== undefined)
    .map((o) => ({ id: o.id, title: o.title }));

  const cells: CoverageMatrixCell[] = [];
  for (const objective of objectiveList) {
    for (const page of pages) {
      const linked = page.objectiveIds.includes(objective.id);
      let strength: CoverageMatrixCell["strength"] = "none";
      if (linked) {
        const pageCount = pages.filter((p) => p.objectiveIds.includes(objective.id)).length;
        if (pageCount >= 3) strength = "strong";
        else if (pageCount >= 2) strength = "moderate";
        else strength = "weak";
      }
      cells.push({ objectiveId: objective.id, pageId: page.id, strength });
    }
  }

  return {
    objectives: objectiveList,
    pages: pages.map((p) => ({ id: p.id, title: p.title })),
    cells,
  };
}

export function getModuleCoverageCounts(module: CurriculumNode) {
  const pages = getModulePages(module);
  const pageCount = pages.filter((p) => p.type === "page").length;
  const activityCount = pages.filter((p) => p.type === "activity-page").length;
  const objectiveIds = getModuleObjectiveIds(module);

  return {
    pages: pageCount,
    activities: activityCount,
    objectives: objectiveIds.length,
    totalContent: pages.length,
  };
}

export function getModuleInsights(
  module: CurriculumNode,
  objectives: LearningObjective[],
): ModuleInsight[] {
  const insights: ModuleInsight[] = [];
  const pages = getModulePages(module);
  const links = getObjectiveContentLinks(module, objectives);

  for (const link of links) {
    if (link.pages.length === 1) {
      insights.push({
        id: `concentrated-${link.objectiveId}`,
        message: `LO ${link.objectiveId} coverage concentrated in one page (${link.pages[0].title})`,
        severity: "warning",
      });
    }
    if (link.pages.length === 0) {
      insights.push({
        id: `uncovered-${link.objectiveId}`,
        message: `LO ${link.objectiveId} has no supporting content in this module`,
        severity: "critical",
      });
    }

    const objective = objectives.find((o) => o.id === link.objectiveId);
    if (objective) {
      const evidence = computeObjectiveEvidence(objective);
      if (evidence.breakdown.summative === 0) {
        insights.push({
          id: `no-summative-${link.objectiveId}`,
          message: `LO ${link.objectiveId} missing summative assessment support`,
          severity: "warning",
        });
      }
    }
  }

  const activityPages = pages.filter((p) => p.type === "activity-page");
  if (activityPages.length === 0 && pages.length > 0) {
    insights.push({
      id: "no-activities",
      message: "No practice or assessment activities in this module",
      severity: "warning",
    });
  }

  return insights;
}

export function getPageObjectiveLabels(
  page: CurriculumNode,
  objectives: LearningObjective[],
): { id: string; label: string }[] {
  if (!page.objectiveIds?.length) return [];
  return page.objectiveIds
    .map((id) => {
      const objective = objectives.find((o) => o.id === id);
      return objective ? { id, label: `LO ${id}` } : null;
    })
    .filter((entry): entry is { id: string; label: string } => entry !== null);
}
