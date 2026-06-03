import type { ContentNode } from "../data/types";

export type CoverageColumn = {
  id: string;
  label: string;
  shortLabel: string;
  contentNodes: ContentNode[];
  groupId?: string;
};

export type CoverageColumnGroup = {
  id: string;
  label: string;
  shortLabel: string;
  contentNodes: ContentNode[];
  children: CoverageColumn[];
};

const PAGE_GROUP_LABELS = ["Beginning", "Middle", "End"];

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
  return title.length > 16 ? `${title.slice(0, 14)}…` : title;
}

function shortModuleLabel(title: string) {
  const match = title.match(/^Module\s+(\d+)/i);
  if (match) return `Mod ${match[1]}`;
  const stripped = title.replace(/^Module\s+\d+:\s*/i, "");
  return stripped.length > 14 ? `${stripped.slice(0, 12)}…` : stripped;
}

function binPagesIntoGroups(pages: ContentNode[]): CoverageColumnGroup[] {
  const groupSize = Math.max(1, Math.ceil(pages.length / PAGE_GROUP_LABELS.length));
  return PAGE_GROUP_LABELS.map((label, index) => {
    const slice = pages.slice(index * groupSize, (index + 1) * groupSize);
    return {
      id: `page-group-${index}`,
      label: `${label} (${slice.length} pages)`,
      shortLabel: label,
      contentNodes: slice,
      children: [],
    };
  }).filter((group) => group.contentNodes.length > 0);
}

/** Unit/module tree for expandable heatmap columns. */
export function getCoverageColumnGroups(tree: ContentNode[]): CoverageColumnGroup[] {
  const units = findByType(tree, "unit");
  if (units.length >= 2) {
    return units.map((unit) => {
      const modules = (unit.children ?? []).filter((c) => c.type === "module");
      return {
        id: unit.id,
        label: unit.title,
        shortLabel: shortUnitLabel(unit.title),
        contentNodes: collectPagesAndActivities(unit),
        children: modules.map((mod) => ({
          id: mod.id,
          label: mod.title,
          shortLabel: shortModuleLabel(mod.title),
          contentNodes: collectPagesAndActivities(mod),
          groupId: unit.id,
        })),
      };
    });
  }

  const modules = findByType(tree, "module");
  if (modules.length >= 2) {
    return modules.map((mod) => ({
      id: mod.id,
      label: mod.title,
      shortLabel: shortModuleLabel(mod.title),
      contentNodes: collectPagesAndActivities(mod),
      children: [],
    }));
  }

  const pages = findByType(tree, "page");
  if (pages.length >= 3) {
    return binPagesIntoGroups(pages);
  }

  const leaf = [...findByType(tree, "page"), ...findByType(tree, "activity")];
  if (leaf.length > 0) {
    return [
      {
        id: "course-all",
        label: "Course content",
        shortLabel: "All",
        contentNodes: leaf,
        children: [],
      },
    ];
  }

  return PAGE_GROUP_LABELS.map((label, index) => ({
    id: `generic-${index}`,
    label,
    shortLabel: label,
    contentNodes: [],
    children: [],
  }));
}

/** Flatten groups into visible leaf columns based on which units are expanded. */
export function flattenCoverageColumns(
  groups: CoverageColumnGroup[],
  expandedGroupIds: Set<string>,
): CoverageColumn[] {
  const columns: CoverageColumn[] = [];

  for (const group of groups) {
    const isExpanded = expandedGroupIds.has(group.id) && group.children.length > 0;
    if (isExpanded) {
      columns.push(...group.children);
    } else {
      columns.push({
        id: group.id,
        label: group.label,
        shortLabel: group.shortLabel,
        contentNodes: group.contentNodes,
        groupId: group.id,
      });
    }
  }

  return columns;
}

/** @deprecated Use getCoverageColumnGroups + flattenCoverageColumns */
export function getCoverageColumns(tree: ContentNode[]): CoverageColumn[] {
  return flattenCoverageColumns(getCoverageColumnGroups(tree), new Set());
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
