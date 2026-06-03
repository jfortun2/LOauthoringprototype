import { courseContentTree } from "../data/courseContent";
import type { ContentNode, LearningObjective } from "../data/types";

export function flattenContent(nodes: ContentNode[] = courseContentTree): ContentNode[] {
  const result: ContentNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children) {
      result.push(...flattenContent(node.children));
    }
  }
  return result;
}

export function getContentById(id: string): ContentNode | undefined {
  return flattenContent().find((n) => n.id === id);
}

/** IDs from root to target node (inclusive), for tree expand + path highlight */
export function getContentPathIds(
  targetId: string,
  nodes: ContentNode[] = courseContentTree,
  path: string[] = [],
): string[] | null {
  for (const node of nodes) {
    const nextPath = [...path, node.id];
    if (node.id === targetId) return nextPath;
    if (node.children) {
      const found = getContentPathIds(targetId, node.children, nextPath);
      if (found) return found;
    }
  }
  return null;
}

export function getObjectivesForContent(
  contentId: string,
  objectives: LearningObjective[],
): LearningObjective[] {
  const node = getContentById(contentId);
  if (!node?.objectiveIds?.length) return [];
  const idSet = new Set(node.objectiveIds);
  return objectives.filter((o) => idSet.has(o.id));
}

export function getContentForObjective(objectiveId: string): ContentNode[] {
  return flattenContent().filter(
    (n) =>
      (n.type === "page" || n.type === "activity") &&
      n.objectiveIds?.includes(objectiveId),
  );
}

export function hasCoverageGap(objective: LearningObjective): boolean {
  return objective.linkedPages.length === 0 || objective.linkedAssessments.length === 0;
}

export function coverageLabel(strength: LearningObjective["coverage"]): string {
  switch (strength) {
    case "strong":
      return "Strong coverage";
    case "moderate":
      return "Moderate coverage";
    case "weak":
      return "Weak coverage";
    default:
      return "No coverage";
  }
}
