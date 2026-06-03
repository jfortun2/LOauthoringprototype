import type { LearningObjective } from "../../data/types";
import { IconChevronDown, IconPencil, IconTrash } from "../icons/Icons";
import { MetricPills } from "../MetricPills/MetricPills";
import { hasCoverageGap } from "../../utils/mappings";
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
  const gap = hasCoverageGap(objective);
  const panelId = `objective-panel-${objective.id}`;

  return (
    <article
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""} ${expanded ? styles.cardExpanded : ""}`}
      id={`objective-${objective.id}`}
    >
      <h3 className={styles.titleHeading}>
        <button
          type="button"
          className={styles.accordionHeader}
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
        >
          <IconChevronDown
            className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ""}`}
          />
          <span className={styles.main}>
            <span className={styles.titleText}>{objective.title}</span>
            <div className={styles.metrics}>
              <MetricPills objective={objective} />
            </div>
          </span>
        </button>
      </h3>

      {expanded && (
        <div className={styles.details} id={panelId} role="region" aria-label="Objective details">
          {gap && (
            <div className={styles.gapCallout} role="status">
              This objective needs linked pages or assessments. Select content in the course
              outline or use Link below.
            </div>
          )}

          <div className={styles.mappingGrid}>
            <section aria-labelledby={`${objective.id}-pages`}>
              <h4 className={styles.sectionTitle} id={`${objective.id}-pages`}>
                Linked pages
              </h4>
              {objective.linkedPages.length === 0 ? (
                <p className={styles.emptyHint}>No pages linked.</p>
              ) : (
                <ul className={styles.list}>
                  {objective.linkedPages.map((page) => (
                    <li key={page.id} className={styles.listItem}>
                      <button
                        type="button"
                        className={styles.contentLink}
                        onClick={() => onSelectContent?.(page.id)}
                      >
                        {page.title}
                      </button>
                      <span className={styles.linkPath}>{page.path}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby={`${objective.id}-assess`}>
              <h4 className={styles.sectionTitle} id={`${objective.id}-assess`}>
                Linked assessments
              </h4>
              {objective.linkedAssessments.length === 0 ? (
                <p className={styles.emptyHint}>No assessments linked.</p>
              ) : (
                <ul className={styles.list}>
                  {objective.linkedAssessments.map((assess) => (
                    <li key={assess.id} className={styles.listItem}>
                      <button
                        type="button"
                        className={styles.contentLink}
                        onClick={() => onSelectContent?.(assess.id)}
                      >
                        {assess.title}
                      </button>
                      <span className={styles.assessType}>{assess.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className={styles.subSection} aria-labelledby={`${objective.id}-subs`}>
            <h4 className={styles.sectionTitle} id={`${objective.id}-subs`}>
              Sub-objectives
            </h4>
            <ul className={styles.list}>
              {objective.subObjectiveItems.map((item) => (
                <li key={item} className={styles.listItem}>
                  <div className={styles.subItem}>{item}</div>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.btnDanger}>
              <IconTrash />
              Remove
            </button>
            <button type="button" className={styles.btnNeutral}>
              <IconPencil />
              Reword
            </button>
            <button type="button" className={styles.btnNeutral}>
              Link page or activity
            </button>
            <button type="button" className={styles.btnNeutral}>
              Add sub-objective
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
