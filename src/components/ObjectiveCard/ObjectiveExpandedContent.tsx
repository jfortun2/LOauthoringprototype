import { useEffect, useState } from "react";
import type { LearningObjective } from "../../data/types";
import { getActivityLinkStatus } from "../../utils/objectiveMappingViews";
import { RowExpandChevron } from "../RowExpandChevron/RowExpandChevron";
import { SubObjectiveActivityPreview } from "../SubObjectiveActivityPreview/SubObjectiveActivityPreview";
import { SubObjectiveTags } from "../TagPills/SubObjectiveTags";
import { IconWarningTriangle } from "../icons/Icons";
import { ActivityAttachmentList } from "./ActivityAttachmentList";
import { ObjectiveActions } from "./ObjectiveActions";
import { ObjectivePerformanceSummary } from "./ObjectivePerformanceSummary";
import styles from "./ObjectiveExpandedContent.module.css";

type ObjectiveExpandedContentProps = {
  objective: LearningObjective;
  onSelectContent?: (contentId: string) => void;
  onEditSubObjective: (subObjectiveId: string) => void;
  onRemoveSubObjective: (subObjectiveId: string) => void;
  onViewInsights: () => void;
};

export function ObjectiveExpandedContent({
  objective,
  onSelectContent,
  onEditSubObjective,
  onRemoveSubObjective,
  onViewInsights,
}: ObjectiveExpandedContentProps) {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  useEffect(() => {
    setExpandedSubId(null);
  }, [objective.id]);

  const subObjectives = objective.subObjectives ?? [];

  return (
    <div className={styles.expanded}>
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
              const status = getActivityLinkStatus(sub);
              const hasWarning =
                status.hasNoActivities || status.missingFormative || status.missingSummative;

              return (
                <li key={sub.id}>
                  <div
                    className={`${styles.subRow} ${subExpanded ? styles.subRowExpanded : ""} ${hasWarning ? styles.subRowWarning : ""}`}
                  >
                    {subExpanded ? (
                      <>
                        <div className={styles.subRowTop}>
                          <RowExpandChevron
                            expanded
                            onClick={() => setExpandedSubId(null)}
                            label="Collapse sub-objective"
                          />
                          {hasWarning && (
                            <IconWarningTriangle
                              className={styles.subWarningIcon}
                              aria-label="Missing activity links"
                            />
                          )}
                          <p className={styles.subTitle}>{sub.title}</p>
                          <ObjectiveActions
                            editLabel="Edit sub-objective"
                            removeLabel="Remove sub-objective"
                            onEdit={() => onEditSubObjective(sub.id)}
                            onRemove={() => onRemoveSubObjective(sub.id)}
                          />
                        </div>
                        <div className={styles.subMeta}>
                          <div className={styles.subTagsWrap}>
                            <SubObjectiveTags
                              formativeCount={sub.formativeCount}
                              summativeCount={sub.summativeCount}
                            />
                          </div>
                          <ActivityAttachmentList activities={activities} />
                        </div>
                      </>
                    ) : (
                      <div className={styles.subRowMain}>
                        <RowExpandChevron
                          expanded={false}
                          onClick={() => setExpandedSubId(sub.id)}
                          label="Expand sub-objective"
                        />
                        <button
                          type="button"
                          className={styles.subRowBtn}
                          onClick={() => setExpandedSubId(sub.id)}
                          aria-expanded={false}
                        >
                          {hasWarning && (
                            <IconWarningTriangle
                              className={styles.subWarningIcon}
                              aria-label="Missing activity links"
                            />
                          )}
                          <span className={styles.subTitle}>{sub.title}</span>
                          <SubObjectiveActivityPreview
                            formativeCount={sub.formativeCount}
                            summativeCount={sub.summativeCount}
                          />
                        </button>
                        <ObjectiveActions
                          editLabel="Edit sub-objective"
                          removeLabel="Remove sub-objective"
                          onEdit={() => onEditSubObjective(sub.id)}
                          onRemove={() => onRemoveSubObjective(sub.id)}
                        />
                      </div>
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
                onClick={() => onSelectContent?.(page.id)}
              >
                {page.title}
              </button>
            ))}
          </div>
        )}
      </section>

      <ObjectivePerformanceSummary objective={objective} onViewInsights={onViewInsights} />
    </div>
  );
}
