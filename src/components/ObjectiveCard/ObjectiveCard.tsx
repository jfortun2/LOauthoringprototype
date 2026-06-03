import type { LearningObjective } from "../../data/objectives";
import {
  IconActivities,
  IconPages,
  IconPencil,
  IconSubObjectives,
  IconTrash,
} from "../icons/Icons";
import styles from "./ObjectiveCard.module.css";

type ObjectiveCardProps = {
  objective: LearningObjective;
  expanded: boolean;
  onToggle: () => void;
};

export function ObjectiveCard({
  objective,
  expanded,
  onToggle,
}: ObjectiveCardProps) {
  const showDetails =
    expanded &&
    (objective.subObjectiveItems?.length || objective.pageLinks?.length);

  return (
    <article className={styles.card} data-node-id="2:1343">
      <div className={styles.cardInner}>
        <div className={styles.headerRow}>
          <button
            type="button"
            className={styles.titleButton}
            onClick={onToggle}
            aria-expanded={expanded}
          >
            {objective.title}
          </button>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <IconSubObjectives className={styles.statIcon} />
              <span>Sub-Objectives {objective.subObjectives}</span>
            </div>
            <div className={styles.stat}>
              <IconPages className={styles.statIcon} />
              <span>Pages {objective.pages}</span>
            </div>
            <div className={styles.stat}>
              <IconActivities className={styles.statIcon} />
              <span>Activities {objective.activities}</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className={styles.details}>
            {objective.subObjectiveItems && objective.subObjectiveItems.length > 0 && (
              <section>
                <h3 className={styles.sectionTitle}>Sub-Objectives</h3>
                <ul className={styles.list}>
                  {objective.subObjectiveItems.map((item, index) => {
                    const isLast =
                      index === objective.subObjectiveItems!.length - 1;
                    return (
                      <li
                        key={item}
                        className={`${styles.listItem} ${isLast ? styles.listItemBordered : ""}`}
                      >
                        <div className={styles.listItemText}>{item}</div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {objective.pageLinks && objective.pageLinks.length > 0 && (
              <section>
                <h3 className={styles.sectionTitle}>Pages</h3>
                <ul className={styles.list}>
                  {objective.pageLinks.map((page, index) => {
                    const isLast = index === objective.pageLinks!.length - 1;
                    return (
                      <li
                        key={page}
                        className={isLast ? styles.listItemBordered : styles.listItem}
                      >
                        <a href="#" className={styles.pageLink} onClick={(e) => e.preventDefault()}>
                          {page}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

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
                <span className={styles.btnPlus}>+</span>
                Add existing Sub-Objective
              </button>
              <button type="button" className={styles.btnNeutral}>
                <span className={styles.btnPlus}>+</span>
                Create new Sub-Objective
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
