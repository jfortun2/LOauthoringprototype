import type { LearningObjective } from "../../data/types";
import { getObjectiveTagCounts } from "../../data/objectives";
import { SubObjectiveActivityPreview } from "../SubObjectiveActivityPreview/SubObjectiveActivityPreview";
import styles from "./LearningArchitectureMap.module.css";

type LearningArchitectureMapProps = {
  objective: LearningObjective;
  onSelectPage?: (pageId: string) => void;
  onSelectActivity?: (activityId: string) => void;
  onExpandSub?: (subId: string) => void;
};

export function LearningArchitectureMap({
  objective,
  onSelectPage,
  onSelectActivity,
  onExpandSub,
}: LearningArchitectureMapProps) {
  const counts = getObjectiveTagCounts(objective);
  const formativeLinked = objective.linkedAssessments.filter((a) => a.type === "formative");
  const summativeLinked = objective.linkedAssessments.filter((a) => a.type === "summative");

  return (
    <div className={styles.map} aria-label="Learning architecture map">
      <div className={styles.rootNode}>
        <span className={styles.rootLabel}>Learning objective</span>
        <p className={styles.rootTitle}>{objective.title}</p>
        <div className={styles.rootMeta}>
          <span>{counts.subObjectives} sub-objectives</span>
          <span>{counts.pages} pages</span>
          <span>{counts.formative + counts.summative} assessments</span>
        </div>
      </div>

      <div className={styles.trunk} aria-hidden />

      <div className={styles.branches}>
        <section className={styles.branch} aria-labelledby={`${objective.id}-arch-subs`}>
          <h5 className={styles.branchTitle} id={`${objective.id}-arch-subs`}>
            Sub-objectives
          </h5>
          <ul className={styles.nodeList}>
            {objective.subObjectives.map((sub) => (
              <li key={sub.id} className={styles.nodeItem}>
                <button
                  type="button"
                  className={styles.nodeBtn}
                  onClick={() => onExpandSub?.(sub.id)}
                >
                  <span className={styles.nodeDot} aria-hidden />
                  <span className={styles.nodeText}>{sub.title}</span>
                  <SubObjectiveActivityPreview
                    formativeCount={sub.formativeCount}
                    summativeCount={sub.summativeCount}
                  />
                </button>
              </li>
            ))}
            {objective.subObjectives.length === 0 && (
              <li className={styles.emptyNode}>No sub-objectives defined</li>
            )}
          </ul>
        </section>

        <section className={styles.branch} aria-labelledby={`${objective.id}-arch-pages`}>
          <h5 className={styles.branchTitle} id={`${objective.id}-arch-pages`}>
            Pages
          </h5>
          <ul className={styles.nodeList}>
            {objective.linkedPages.map((page) => (
              <li key={page.id} className={styles.nodeItem}>
                <button
                  type="button"
                  className={styles.nodeBtn}
                  onClick={() => onSelectPage?.(page.id)}
                >
                  <span className={`${styles.nodeDot} ${styles.nodeDotPage}`} aria-hidden />
                  <span className={styles.nodeText}>{page.title}</span>
                  <span className={styles.nodePath}>{page.path}</span>
                </button>
              </li>
            ))}
            {objective.linkedPages.length === 0 && (
              <li className={styles.emptyNode}>No pages linked</li>
            )}
          </ul>
        </section>

        <section className={styles.branch} aria-labelledby={`${objective.id}-arch-activities`}>
          <h5 className={styles.branchTitle} id={`${objective.id}-arch-activities`}>
            Activities
          </h5>
          <ul className={styles.nodeList}>
            {[...formativeLinked, ...summativeLinked].map((activity) => (
              <li key={activity.id} className={styles.nodeItem}>
                <button
                  type="button"
                  className={styles.nodeBtn}
                  onClick={() => onSelectActivity?.(activity.id)}
                >
                  <span
                    className={`${styles.nodeDot} ${activity.type === "summative" ? styles.nodeDotSummative : styles.nodeDotFormative}`}
                    aria-hidden
                  />
                  <span className={styles.nodeText}>{activity.title}</span>
                  <span className={styles.activityType}>{activity.type}</span>
                </button>
              </li>
            ))}
            {formativeLinked.length === 0 && summativeLinked.length === 0 && (
              <li className={styles.emptyNode}>No assessments linked</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
