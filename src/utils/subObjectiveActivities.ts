import type { SubObjective, SubObjectiveActivity, SubObjectiveDraft } from "../data/types";

const FORMATIVE_TEMPLATES = [
  "practice_{slug}_q{n}",
  "checkpoint_{slug}_v{n}",
  "survey_ins_diary{n}-q{n}",
  "formative_drill_{slug}_{n}",
];

const SUMMATIVE_TEMPLATES = [
  "quiz_{slug}_v{n}",
  "exam_{slug}_unit{n}",
  "assignment_{slug}_summative{n}",
  "summative_check_{slug}_{n}",
];

function slugFromSubId(subId: string) {
  return subId.replace(/-/g, "_");
}

export function buildSubObjectiveActivities(
  subId: string,
  formativeCount: number,
  summativeCount: number,
  customFormativeTitles?: string[],
): SubObjectiveActivity[] {
  const slug = slugFromSubId(subId);

  const formative: SubObjectiveActivity[] = Array.from({ length: formativeCount }, (_, i) => ({
    id: `${subId}-f-${i}`,
    title:
      customFormativeTitles?.[i] ??
      FORMATIVE_TEMPLATES[i % FORMATIVE_TEMPLATES.length]
        .replace("{slug}", slug)
        .replace("{n}", String(i + 1)),
    type: "formative",
  }));

  const summative: SubObjectiveActivity[] = Array.from({ length: summativeCount }, (_, i) => ({
    id: `${subId}-s-${i}`,
    title: SUMMATIVE_TEMPLATES[i % SUMMATIVE_TEMPLATES.length]
      .replace("{slug}", slug)
      .replace("{n}", String(i + 1)),
    type: "summative",
  }));

  return [...formative, ...summative];
}

type SubObjectiveInput = SubObjectiveDraft;

export function enrichSubObjective(sub: SubObjectiveInput): SubObjective {
  const { activityLinks, linkedPages, ...rest } = sub;
  return {
    ...rest,
    linkedPages: linkedPages ?? [],
    activities: buildSubObjectiveActivities(
      sub.id,
      sub.formativeCount,
      sub.summativeCount,
      activityLinks,
    ),
  };
}

export function defaultActivityTab(activities: SubObjectiveActivity[]): "formative" | "summative" {
  const hasFormative = activities.some((a) => a.type === "formative");
  if (hasFormative) return "formative";
  return "summative";
}
