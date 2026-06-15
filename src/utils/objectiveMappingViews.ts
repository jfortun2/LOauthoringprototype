import type { LearningObjective, LinkedPage, SubObjective, SubObjectiveActivity } from "../data/types";
import {
  MIN_FORMATIVE_ACTIVITIES,
  MIN_SUMMATIVE_ACTIVITIES,
} from "./mappings";

export type ProductModel = "strict" | "flexible";

export type MappingSource =
  | { kind: "direct-lo" }
  | { kind: "inherited-lo" }
  | { kind: "direct-sub"; subObjectiveId: string; subTitle: string };

export type MappedPage = LinkedPage & {
  source: MappingSource;
};

export type MappedActivity = SubObjectiveActivity & {
  source: MappingSource;
};

export type ActivityLinkStatus = {
  formativeCount: number;
  summativeCount: number;
  missingFormative: boolean;
  missingSummative: boolean;
  hasNoActivities: boolean;
};

export type AttentionItem = {
  id: string;
  message: string;
  action?: string;
};

export function getActivityLinkStatus(sub: SubObjective): ActivityLinkStatus {
  const formativeCount = sub.formativeCount;
  const summativeCount = sub.summativeCount;
  return {
    formativeCount,
    summativeCount,
    missingFormative: formativeCount < MIN_FORMATIVE_ACTIVITIES,
    missingSummative: summativeCount < MIN_SUMMATIVE_ACTIVITIES,
    hasNoActivities: formativeCount === 0 && summativeCount === 0,
  };
}

export function sourceLabel(source: MappingSource, model: ProductModel): string {
  switch (source.kind) {
    case "direct-lo":
      return model === "flexible"
        ? "Directly linked to learning objective"
        : "Inherited from parent objective";
    case "inherited-lo":
      return "Inherited from parent objective";
    case "direct-sub":
      return "Directly linked to this sub-objective";
    default:
      return "";
  }
}

export function viaSubLabel(subTitle: string): string {
  const short = subTitle.length > 48 ? `${subTitle.slice(0, 48)}…` : subTitle;
  return `Linked through sub-objective: ${short}`;
}

export function toMappedActivities(
  activities: SubObjectiveActivity[],
  source: MappingSource,
): MappedActivity[] {
  return activities.map((activity) => ({ ...activity, source }));
}

export function toMappedPages(pages: LinkedPage[], source: MappingSource): MappedPage[] {
  return pages.map((page) => ({ ...page, source }));
}

export function countPagesAcrossSubs(objective: LearningObjective): number {
  const ids = new Set<string>();
  for (const sub of objective.subObjectives) {
    for (const page of sub.linkedPages) ids.add(page.id);
  }
  return ids.size;
}

export function countActivitiesAcrossSubs(objective: LearningObjective): number {
  return objective.subObjectives.reduce((total, sub) => total + sub.activities.length, 0);
}

export function getAttentionItems(objective: LearningObjective): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (objective.subObjectives.length === 0) {
    items.push({
      id: "no-subs",
      message: "No sub-objectives defined",
      action: "Add sub-objectives to structure this learning objective",
    });
  }

  for (const sub of objective.subObjectives) {
    const status = getActivityLinkStatus(sub);
    if (status.hasNoActivities) {
      items.push({
        id: `${sub.id}-no-activities`,
        message: `No linked activities on sub-objective ${sub.id}`,
        action: "Link scored pages or practice activities",
      });
    } else {
      if (status.missingFormative) {
        items.push({
          id: `${sub.id}-formative`,
          message: `Sub-objective ${sub.id} has fewer than ${MIN_FORMATIVE_ACTIVITIES} formative activities`,
          action: "Add formative activities",
        });
      }
      if (status.missingSummative) {
        items.push({
          id: `${sub.id}-summative`,
          message: `Sub-objective ${sub.id} has fewer than ${MIN_SUMMATIVE_ACTIVITIES} summative activities`,
          action: "Add summative activities",
        });
      }
    }
    if (sub.linkedPages.length === 0) {
      items.push({
        id: `${sub.id}-no-pages`,
        message: `No pages linked to sub-objective ${sub.id}`,
        action: "Link supporting pages",
      });
    }
  }

  return items;
}

export function hasMissingActivities(objective: LearningObjective): boolean {
  return getAttentionItems(objective).some(
    (item) => item.id.endsWith("-formative") || item.id.endsWith("-summative") || item.id.endsWith("-no-activities"),
  );
}

/** Strict hierarchy: LO is container; content lives on sub-objectives */
export type StrictObjectiveView = {
  subObjectives: Array<{
    sub: SubObjective;
    status: ActivityLinkStatus;
    directPages: MappedPage[];
    directActivities: MappedActivity[];
    inheritedPages: MappedPage[];
    inheritedActivities: MappedActivity[];
  }>;
  attention: AttentionItem[];
  totalPages: number;
  totalActivities: number;
};

export function getStrictObjectiveView(objective: LearningObjective): StrictObjectiveView {
  const inheritedPageSource: MappingSource = { kind: "inherited-lo" };
  const inheritedActivitySource: MappingSource = { kind: "inherited-lo" };
  const inheritedPages = toMappedPages(objective.linkedPages, inheritedPageSource);
  const inheritedActivities = objective.linkedAssessments.map((activity) => ({
    id: activity.id,
    title: activity.title,
    type: activity.type,
    source: inheritedActivitySource,
  }));

  const subObjectives = objective.subObjectives.map((sub) => ({
    sub,
    status: getActivityLinkStatus(sub),
    directPages: toMappedPages(sub.linkedPages, {
      kind: "direct-sub",
      subObjectiveId: sub.id,
      subTitle: sub.title,
    }),
    directActivities: toMappedActivities(sub.activities, {
      kind: "direct-sub",
      subObjectiveId: sub.id,
      subTitle: sub.title,
    }),
    inheritedPages,
    inheritedActivities,
  }));

  return {
    subObjectives,
    attention: getAttentionItems(objective),
    totalPages: countPagesAcrossSubs(objective),
    totalActivities: countActivitiesAcrossSubs(objective),
  };
}

/** Flexible tagging: LO and sub-objectives are both first-class targets */
export type FlexibleObjectiveView = {
  directPages: MappedPage[];
  directActivities: MappedActivity[];
  pagesViaSubs: MappedPage[];
  activitiesViaSubs: MappedActivity[];
  attention: AttentionItem[];
};

export function getFlexibleObjectiveView(objective: LearningObjective): FlexibleObjectiveView {
  const directPages = toMappedPages(objective.linkedPages, { kind: "direct-lo" });
  const directActivities = objective.linkedAssessments.map((activity) => ({
    id: activity.id,
    title: activity.title,
    type: activity.type,
    source: { kind: "direct-lo" as const },
  }));

  const pagesViaSubs: MappedPage[] = [];
  const activitiesViaSubs: MappedActivity[] = [];

  for (const sub of objective.subObjectives) {
    pagesViaSubs.push(
      ...toMappedPages(sub.linkedPages, {
        kind: "direct-sub",
        subObjectiveId: sub.id,
        subTitle: sub.title,
      }),
    );
    activitiesViaSubs.push(
      ...toMappedActivities(sub.activities, {
        kind: "direct-sub",
        subObjectiveId: sub.id,
        subTitle: sub.title,
      }),
    );
  }

  return {
    directPages,
    directActivities,
    pagesViaSubs,
    activitiesViaSubs,
    attention: getAttentionItems(objective),
  };
}

export function getStrictSubView(
  objective: LearningObjective,
  subObjectiveId: string,
) {
  const view = getStrictObjectiveView(objective);
  return view.subObjectives.find((entry) => entry.sub.id === subObjectiveId) ?? null;
}

export function getFlexibleSubView(
  objective: LearningObjective,
  subObjectiveId: string,
) {
  const sub = objective.subObjectives.find((entry) => entry.id === subObjectiveId);
  if (!sub) return null;

  return {
    sub,
    status: getActivityLinkStatus(sub),
    directPages: toMappedPages(sub.linkedPages, {
      kind: "direct-sub",
      subObjectiveId: sub.id,
      subTitle: sub.title,
    }),
    directActivities: toMappedActivities(sub.activities, {
      kind: "direct-sub",
      subObjectiveId: sub.id,
      subTitle: sub.title,
    }),
    parentObjective: objective,
  };
}
