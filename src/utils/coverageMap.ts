import { courseContentTree } from "../data/courseContent";
import type { ContentNode, LearningObjective, SubObjective } from "../data/types";
import {
  flattenCoverageColumns,
  getCoverageColumnGroups,
  type CoverageColumn,
  type CoverageColumnGroup,
} from "./coverageColumns";

/** 0 = none, 4 = strongest coverage intensity */
export type CoverageIntensity = 0 | 1 | 2 | 3 | 4;

export type CoverageContentItem = {
  id: string;
  title: string;
  kind: "page" | "activity";
  assessmentType?: "formative" | "summative";
};

export type CoverageCell = {
  columnId: string;
  intensity: CoverageIntensity;
  items: CoverageContentItem[];
};

export type SubObjectiveCoverageRow = {
  subObjective: SubObjective;
  cells: CoverageCell[];
};

export type ObjectiveCoverageMap = {
  groups: CoverageColumnGroup[];
  columns: CoverageColumn[];
  rows: SubObjectiveCoverageRow[];
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pseudoIntensity(subId: string, columnId: string): CoverageIntensity {
  const value = hashSeed(`${subId}:${columnId}`) % 5;
  return value as CoverageIntensity;
}

function nodeToItem(node: ContentNode): CoverageContentItem {
  return {
    id: node.id,
    title: node.title,
    kind: node.type === "activity" ? "activity" : "page",
  };
}

function activityToItem(
  activity: SubObjective["activities"][number],
): CoverageContentItem {
  return {
    id: activity.id,
    title: activity.title,
    kind: "activity",
    assessmentType: activity.type,
  };
}

function buildCell(
  objective: LearningObjective,
  sub: SubObjective,
  subIndex: number,
  column: CoverageColumn,
): CoverageCell {
  const activities = sub.activities ?? [];
  const objectiveLinked = column.contentNodes.filter((node) =>
    node.objectiveIds?.includes(objective.id),
  );

  const subLinked = objectiveLinked.filter(
    (_, index) => index % Math.max(objective.subObjectives.length, 1) === subIndex,
  );

  const items: CoverageContentItem[] = subLinked.map(nodeToItem);

  let intensity: CoverageIntensity = 0;

  if (subLinked.length >= 2) {
    intensity = 4;
  } else if (subLinked.length === 1) {
    intensity = 3;
  } else if (objectiveLinked.length > 0) {
    intensity = Math.min(2, pseudoIntensity(sub.id, column.id)) as CoverageIntensity;
    if (intensity >= 1 && items.length === 0) {
      items.push(...activities.slice(0, intensity).map(activityToItem));
    }
  } else {
    intensity = pseudoIntensity(sub.id, column.id);
    if (intensity >= 2) {
      const activityCount = Math.min(intensity - 1, activities.length);
      items.push(...activities.slice(0, activityCount).map(activityToItem));
    }
  }

  return {
    columnId: column.id,
    intensity,
    items,
  };
}

export function buildObjectiveCoverageMap(
  objective: LearningObjective,
  expandedGroupIds: Set<string> = new Set(),
  tree: ContentNode[] = courseContentTree,
): ObjectiveCoverageMap {
  const groups = getCoverageColumnGroups(tree);
  const columns = flattenCoverageColumns(groups, expandedGroupIds);
  const rows = (objective.subObjectives ?? []).map((sub, index) => ({
    subObjective: sub,
    cells: columns.map((column) => buildCell(objective, sub, index, column)),
  }));
  return { groups, columns, rows };
}

export function intensityLabel(intensity: CoverageIntensity): string {
  switch (intensity) {
    case 4:
      return "Strong";
    case 3:
      return "Moderate";
    case 2:
      return "Light";
    case 1:
      return "Minimal";
    default:
      return "None";
  }
}

export type ContentDetailSelection = {
  item: CoverageContentItem;
  subObjectiveTitle: string;
  columnLabel: string;
  path: string;
};
