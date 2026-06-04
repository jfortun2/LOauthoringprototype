import { useEffect, useState } from "react";
import { courseContentTree } from "../../data/courseContent";
import type { LearningObjective } from "../../data/types";
import { getContentPathLabel } from "../../utils/coverageColumns";
import type { ContentDetailSelection, CoverageContentItem } from "../../utils/coverageMap";
import { CoverageHeatmap } from "../CoverageMap/CoverageHeatmap";
import { ContentDetailPanel } from "../CoverageMap/ContentDetailPanel";
import { IconChevronDown } from "../icons/Icons";
import { SubObjectiveActivities } from "../SubObjectiveActivities/SubObjectiveActivities";
import { SubObjectiveActivityPreview } from "../SubObjectiveActivityPreview/SubObjectiveActivityPreview";
import styles from "./ObjectiveExpandedContent.module.css";

type ObjectiveExpandedContentProps = {
  objective: LearningObjective;
  onSelectContent?: (contentId: string) => void;
};

type ExpandedView = "hierarchy" | "coverage";

export function ObjectiveExpandedContent({
  objective,
  onSelectContent,
}: ObjectiveExpandedContentProps) {
  const [view, setView] = useState<ExpandedView>("hierarchy");
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [contentDetail, setContentDetail] = useState<ContentDetailSelection | null>(null);

  useEffect(() => {
    setView("hierarchy");
    setExpandedSubId(null);
    setContentDetail(null);
  }, [objective.id]);

  const openContentDetail = (
    item: CoverageContentItem,
    subTitle: string,
    contextLabel: string,
  ) => {
    const path =
      item.id.startsWith("page-") || item.id.startsWith("act-")
        ? getContentPathLabel(item.id, courseContentTree)
        : contextLabel;

    setContentDetail({
      item,
      subObjectiveTitle: subTitle,
      columnLabel: contextLabel,
      path,
    });

    if (item.id.startsWith("page-") || item.id.startsWith("act-")) {
      onSelectContent?.(item.id);
    }
  };

  const subObjectives = objective.subObjectives ?? [];

  return (
    <div className={styles.expanded}>
      <div className={styles.viewToggle} role="tablist" aria-label="Objective detail view">
        <button
          type="button"
          role="tab"
          aria-selected={view === "hierarchy"}
          className={`${styles.viewBtn} ${view === "hierarchy" ? styles.viewBtnActive : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setView("hierarchy");
          }}
        >
          Hierarchy
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "coverage"}
          className={`${styles.viewBtn} ${view === "coverage" ? styles.viewBtnActive : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setView("coverage");
          }}
        >
          Coverage map
        </button>
      </div>

      <div className={view === "hierarchy" ? undefined : styles.hiddenPanel}>
        <section className={styles.section} aria-labelledby={`${objective.id}-subs`}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle} id={`${objective.id}-subs`}>
                Sub-Objectives
              </h4>
              <button type="button" className={styles.btnAdd}>
                Add
              </button>
            </div>

            {subObjectives.length === 0 ? (
              <p className={styles.emptyHint}>No sub-objectives yet.</p>
            ) : (
              <ul className={styles.subList}>
                {subObjectives.map((sub) => {
                  const subExpanded = expandedSubId === sub.id;
                  const activities = sub.activities ?? [];
                  const formativeCount = activities.filter((a) => a.type === "formative").length;
                  const summativeCount = activities.filter((a) => a.type === "summative").length;

                  return (
                    <li key={sub.id}>
                      <div
                        className={`${styles.subRow} ${subExpanded ? styles.subRowExpanded : ""}`}
                      >
                        {subExpanded ? (
                          <>
                            <p className={`${styles.subTitle} ${styles.subTitleExpanded}`}>
                              {sub.title}
                            </p>
                            <SubObjectiveActivities
                              activities={activities}
                              subObjectiveId={sub.id}
                              onActivityClick={(activity) =>
                                openContentDetail(
                                  {
                                    id: activity.id,
                                    title: activity.title,
                                    kind: "activity",
                                    assessmentType: activity.type,
                                  },
                                  sub.title,
                                  "Linked activities",
                                )
                              }
                            />
                            <button
                              type="button"
                              className={`${styles.subToggle} ${styles.subToggleAbsolute} ${styles.subToggleExpanded}`}
                              onClick={() => setExpandedSubId(null)}
                              aria-label="Collapse sub-objective"
                            >
                              <IconChevronDown />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.subRowBtn}
                            onClick={() => setExpandedSubId(sub.id)}
                            aria-expanded={false}
                          >
                            <span className={styles.subTitle}>{sub.title}</span>
                            <SubObjectiveActivityPreview
                              formativeCount={formativeCount}
                              summativeCount={summativeCount}
                            />
                            <IconChevronDown className={styles.subToggle} aria-hidden />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={styles.section} aria-labelledby={`${objective.id}-pages`}>
            <h4 className={styles.sectionTitle} id={`${objective.id}-pages`}>
              pages
            </h4>
            {objective.linkedPages.length === 0 ? (
              <p className={styles.emptyHint}>No pages linked.</p>
            ) : (
              <div className={styles.pageLinks}>
                {objective.linkedPages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    className={styles.pageLink}
                    onClick={() =>
                      openContentDetail(
                        { id: page.id, title: page.title, kind: "page" },
                        objective.title,
                        "Linked pages",
                      )
                    }
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            )}
        </section>
      </div>

      <section
        className={`${styles.section} ${view === "coverage" ? undefined : styles.hiddenPanel}`}
        aria-labelledby={`${objective.id}-coverage`}
      >
        <h4 className={styles.sectionTitle} id={`${objective.id}-coverage`}>
          coverage
        </h4>
        <CoverageHeatmap objective={objective} onSelectContent={onSelectContent} />
      </section>

      {contentDetail && view === "hierarchy" && (
        <ContentDetailPanel
          selection={contentDetail}
          onSelectItem={(item) =>
            openContentDetail(item, contentDetail.subObjectiveTitle, contentDetail.columnLabel)
          }
          onClose={() => setContentDetail(null)}
        />
      )}
    </div>
  );
}
