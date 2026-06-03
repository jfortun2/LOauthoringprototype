import { useEffect, useState } from "react";
import type { LearningObjective } from "../../data/types";
import { coverageLabel } from "../../utils/mappings";
import { IconChevronDown } from "../icons/Icons";
import { SubObjectiveActivities } from "../SubObjectiveActivities/SubObjectiveActivities";
import { SubObjectiveTags } from "../TagPills/SubObjectiveTags";
import { TagPills } from "../TagPills/TagPills";
import styles from "./ObjectiveCard.module.css";

type ObjectiveCardProps = {
  objective: LearningObjective;
  expanded: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onSelectContent?: (contentId: string) => void;
};

export function ObjectiveCard({
  objective,
  expanded,
  highlighted,
  onToggle,
  onSelectContent,
}: ObjectiveCardProps) {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(
    objective.subObjectives[0]?.id ?? null,
  );

  useEffect(() => {
    setExpandedSubId(objective.subObjectives[0]?.id ?? null);
  }, [objective.id, objective.subObjectives]);

  return (
    <article
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""} ${expanded ? styles.cardExpanded : ""}`}
      id={`objective-${objective.id}`}
    >
      <div className={styles.cardBody}>
        <span className={styles.loLabel}>lo {objective.id}</span>
        <div className={styles.content}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={onToggle}
            aria-expanded={expanded}
          >
            <span className={styles.headerRow}>
              <h3 className={styles.title}>{objective.title}</h3>
              <IconChevronDown
                className={`${styles.headerChevron} ${expanded ? styles.headerChevronExpanded : ""}`}
              />
            </span>
          </button>

          {!expanded && (
            <div className={styles.tags}>
              <TagPills objective={objective} />
            </div>
          )}

          {expanded && (
            <div className={styles.details}>
              <section className={styles.section} aria-labelledby={`${objective.id}-subs`}>
                <div className={styles.sectionHeader}>
                  <h4 className={styles.sectionTitle} id={`${objective.id}-subs`}>
                    Sub-Objectives
                  </h4>
                  <button type="button" className={styles.btnAdd}>
                    Add
                  </button>
                </div>
                <ul className={styles.subList}>
                  {objective.subObjectives.map((sub) => {
                    const subExpanded = expandedSubId === sub.id;
                    return (
                      <li key={sub.id}>
                        <div
                          className={`${styles.subRow} ${subExpanded ? styles.subRowExpanded : styles.subRowCollapsed}`}
                        >
                          {subExpanded ? (
                            <>
                              <p className={`${styles.subTitle} ${styles.subTitleExpanded}`}>
                                {sub.title}
                              </p>
                              <div className={styles.subMeta}>
                                <SubObjectiveTags
                                  formativeCount={sub.formativeCount}
                                  summativeCount={sub.summativeCount}
                                />
                                <SubObjectiveActivities
                                  activities={sub.activities}
                                  subObjectiveId={sub.id}
                                />
                              </div>
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
                              <SubObjectiveTags
                                formativeCount={sub.formativeCount}
                                summativeCount={sub.summativeCount}
                                compact
                              />
                              <span className={styles.subTitle}>{sub.title}</span>
                              <IconChevronDown className={styles.subToggle} aria-hidden />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
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

              <section className={styles.section} aria-labelledby={`${objective.id}-coverage`}>
                <h4 className={styles.sectionTitle} id={`${objective.id}-coverage`}>
                  Coverage
                </h4>
                <p className={styles.coverageValue}>{coverageLabel(objective.coverage)}</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
