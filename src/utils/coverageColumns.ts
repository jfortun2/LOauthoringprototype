import type { ContentNode } from "../data/types";

export type CoverageLevel =
  | "unit"
  | "module"
  | "section"
  | "page"
  | "activity"
  | "page-group"
  | "course";

export type CoverageColumn = {
  id: string;
  label: string;
  shortLabel: string;
  level: CoverageLevel;
  levelLabel: string;
  contentNodes: ContentNode[];
  hasChildren: boolean;
  childCount: number;
};

export type CoverageColumnGroup = {
  id: string;
  label: string;
  shortLabel: string;
  level: CoverageLevel;
  levelLabel: string;
  contentNodes: ContentNode[];
  children: CoverageColumnGroup[];
};

export type CoverageStructureKind =
  | "units"
  | "modules"
  | "sections"
  | "pages"
  | "page-groups";

export type CoverageStructureInfo = {
  kind: CoverageStructureKind;
  topLevelLabel: string;
  drillDownLabels: string[];
  summary: string;
  expandHint: string;
};

const PAGE_GROUP_LABELS = ["Beginning", "Middle", "End"];

const LEVEL_LABELS: Record<CoverageLevel, string> = {
  unit: "Unit",
  module: "Module",
  section: "Section",
  page: "Page",
  activity: "Activity",
  "page-group": "Page group",
  course: "Course",
};

function collectPagesAndActivities(node: ContentNode): ContentNode[] {
  const result: ContentNode[] = [];
  function walk(n: ContentNode) {
    if (n.type === "page" || n.type === "activity") result.push(n);
    n.children?.forEach(walk);
  }
  walk(node);
  return result;
}

function findByType(nodes: ContentNode[], type: ContentNode["type"]): ContentNode[] {
  const result: ContentNode[] = [];
  function walk(list: ContentNode[]) {
    for (const node of list) {
      if (node.type === type) result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return result;
}

function shortUnitLabel(title: string) {
  const match = title.match(/^Unit\s+(\d+)/i);
  if (match) return `Unit ${match[1]}`;
  return truncate(title, 14);
}

function shortModuleLabel(title: string) {
  const match = title.match(/^Module\s+(\d+)/i);
  if (match) return `Mod ${match[1]}`;
  const stripped = title.replace(/^Module\s+\d+:\s*/i, "");
  return truncate(stripped, 12);
}

function shortSectionLabel(title: string) {
  const stripped = title.replace(/^Section\s+[A-Z0-9]+:\s*/i, "");
  if (stripped.length <= 14) return stripped;
  const match = title.match(/^Section\s+([A-Z0-9]+)/i);
  if (match) return `Sec ${match[1]}`;
  return truncate(stripped, 12);
}

function shortPageLabel(title: string) {
  return truncate(title, 14);
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function childGroups(node: ContentNode): CoverageColumnGroup[] {
  const children = node.children ?? [];
  const modules = children.filter((c) => c.type === "module");
  if (modules.length > 0) return modules.map((mod) => buildModuleGroup(mod));

  const sections = children.filter((c) => c.type === "section");
  if (sections.length > 0) return sections.map((section) => buildSectionGroup(section));

  const leaves = children.filter((c) => c.type === "page" || c.type === "activity");
  if (leaves.length > 0 && leaves.length <= 12) {
    return leaves.map((leaf) => buildLeafGroup(leaf));
  }

  return [];
}

function buildLeafGroup(node: ContentNode): CoverageColumnGroup {
  const level: CoverageLevel = node.type === "activity" ? "activity" : "page";
  return {
    id: node.id,
    label: node.title,
    shortLabel: shortPageLabel(node.title),
    level,
    levelLabel: LEVEL_LABELS[level],
    contentNodes: [node],
    children: [],
  };
}

function buildSectionGroup(section: ContentNode): CoverageColumnGroup {
  return {
    id: section.id,
    label: section.title,
    shortLabel: shortSectionLabel(section.title),
    level: "section",
    levelLabel: LEVEL_LABELS.section,
    contentNodes: collectPagesAndActivities(section),
    children: childGroups(section),
  };
}

function buildModuleGroup(mod: ContentNode): CoverageColumnGroup {
  return {
    id: mod.id,
    label: mod.title,
    shortLabel: shortModuleLabel(mod.title),
    level: "module",
    levelLabel: LEVEL_LABELS.module,
    contentNodes: collectPagesAndActivities(mod),
    children: childGroups(mod),
  };
}

function buildUnitGroup(unit: ContentNode): CoverageColumnGroup {
  return {
    id: unit.id,
    label: unit.title,
    shortLabel: shortUnitLabel(unit.title),
    level: "unit",
    levelLabel: LEVEL_LABELS.unit,
    contentNodes: collectPagesAndActivities(unit),
    children: childGroups(unit),
  };
}

function binPagesIntoGroups(pages: ContentNode[]): CoverageColumnGroup[] {
  const groupSize = Math.max(1, Math.ceil(pages.length / PAGE_GROUP_LABELS.length));
  return PAGE_GROUP_LABELS.map((label, index) => {
    const slice = pages.slice(index * groupSize, (index + 1) * groupSize);
    return {
      id: `page-group-${index}`,
      label: `${label} (${slice.length} pages)`,
      shortLabel: label,
      level: "page-group" as const,
      levelLabel: LEVEL_LABELS["page-group"],
      contentNodes: slice,
      children: slice.length <= 8 ? slice.map((page) => buildLeafGroup(page)) : [],
    };
  }).filter((group) => group.contentNodes.length > 0);
}

function collectDrillDownLabels(groups: CoverageColumnGroup[]): string[] {
  const labels = new Set<string>();
  function walk(nodes: CoverageColumnGroup[]) {
    for (const node of nodes) {
      if (node.children.length > 0) {
        const childLevel = node.children[0]?.levelLabel;
        if (childLevel) labels.add(`${node.levelLabel}s → ${childLevel}s`);
        walk(node.children);
      }
    }
  }
  walk(groups);
  return [...labels];
}

/** Build expandable column tree from any supported course hierarchy. */
export function getCoverageColumnGroups(tree: ContentNode[]): CoverageColumnGroup[] {
  const units = findByType(tree, "unit");
  if (units.length >= 1) {
    return units.map((unit) => buildUnitGroup(unit));
  }

  const modules = findByType(tree, "module");
  if (modules.length >= 1) {
    return modules.map((mod) => buildModuleGroup(mod));
  }

  const sections = findByType(tree, "section");
  if (sections.length >= 1) {
    return sections.map((section) => buildSectionGroup(section));
  }

  const pages = findByType(tree, "page");
  const activities = findByType(tree, "activity");
  const leaves = [...pages, ...activities];

  if (leaves.length === 0) {
    return [];
  }

  if (leaves.length <= 12) {
    return leaves.map((leaf) => buildLeafGroup(leaf));
  }

  if (pages.length >= 3) {
    return binPagesIntoGroups(pages);
  }

  return [
    {
      id: "course-all",
      label: "Course content",
      shortLabel: "All",
      level: "course",
      levelLabel: LEVEL_LABELS.course,
      contentNodes: leaves,
      children: [],
    },
  ];
}

export function getCoverageStructureInfo(tree: ContentNode[]): CoverageStructureInfo {
  const groups = getCoverageColumnGroups(tree);
  const units = findByType(tree, "unit");
  const modules = findByType(tree, "module");
  const sections = findByType(tree, "section");
  const pages = findByType(tree, "page");

  if (units.length >= 1) {
    const drill = collectDrillDownLabels(groups);
    return {
      kind: "units",
      topLevelLabel: "Units",
      drillDownLabels:
        drill.length > 0 ? drill : ["Units → Modules", "Modules → Sections", "Sections → Pages"],
      summary: `Course is organized by units (${units.length} total). Columns start at the unit level.`,
      expandHint: "Use + on a column header to drill into modules, sections, and pages.",
    };
  }

  if (modules.length >= 1) {
    return {
      kind: "modules",
      topLevelLabel: "Modules",
      drillDownLabels: collectDrillDownLabels(groups),
      summary: `Course is organized by modules (${modules.length} total).`,
      expandHint: "Use + on a column header to drill into sections or pages.",
    };
  }

  if (sections.length >= 1) {
    return {
      kind: "sections",
      topLevelLabel: "Sections",
      drillDownLabels: collectDrillDownLabels(groups),
      summary: `Course is organized by sections (${sections.length} total).`,
      expandHint: "Use + on a column header to drill into individual pages.",
    };
  }

  if (pages.length <= 12) {
    return {
      kind: "pages",
      topLevelLabel: "Pages",
      drillDownLabels: [],
      summary: `Flat course with ${pages.length} pages. Each column is a page or activity.`,
      expandHint: "No drill-down needed — columns already show individual pages.",
    };
  }

  return {
    kind: "page-groups",
    topLevelLabel: "Page groups",
    drillDownLabels: ["Page groups → Pages"],
    summary: `${pages.length} pages grouped for overview. Expand a group to see individual pages.`,
    expandHint: "Use + on a page group to see pages inside it.",
  };
}

function groupToColumn(group: CoverageColumnGroup): CoverageColumn {
  return {
    id: group.id,
    label: group.label,
    shortLabel: group.shortLabel,
    level: group.level,
    levelLabel: group.levelLabel,
    contentNodes: group.contentNodes,
    hasChildren: group.children.length > 0,
    childCount: group.children.length,
  };
}

/** Flatten tree into visible columns based on expanded node ids. */
export function flattenCoverageColumns(
  groups: CoverageColumnGroup[],
  expandedGroupIds: Set<string>,
): CoverageColumn[] {
  const columns: CoverageColumn[] = [];

  function walk(nodes: CoverageColumnGroup[]) {
    for (const node of nodes) {
      const isExpanded = expandedGroupIds.has(node.id) && node.children.length > 0;
      if (isExpanded) {
        walk(node.children);
      } else {
        columns.push(groupToColumn(node));
      }
    }
  }

  walk(groups);
  return columns;
}

export function collectExpandableNodeIds(groups: CoverageColumnGroup[]): string[] {
  const ids: string[] = [];
  function walk(nodes: CoverageColumnGroup[]) {
    for (const node of nodes) {
      if (node.children.length > 0) ids.push(node.id);
      walk(node.children);
    }
  }
  walk(groups);
  return ids;
}

export function getContentPathLabel(contentId: string, tree: ContentNode[]): string {
  function walk(nodes: ContentNode[], trail: string[]): string | null {
    for (const node of nodes) {
      const next = [...trail, node.title];
      if (node.id === contentId) return next.join(" › ");
      if (node.children) {
        const found = walk(node.children, next);
        if (found) return found;
      }
    }
    return null;
  }
  return walk(tree, []) ?? "Course content";
}

/** @deprecated Use getCoverageColumnGroups + flattenCoverageColumns */
export function getCoverageColumns(tree: ContentNode[]): CoverageColumn[] {
  return flattenCoverageColumns(getCoverageColumnGroups(tree), new Set());
}
