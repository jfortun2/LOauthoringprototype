import type { CurriculumNode } from "../../data/curriculum";
import type { LearningObjective } from "../../data/types";
import { computeObjectiveEvidence } from "../../utils/objectiveEvidence";
import { getModuleInsights, getObjectiveContentLinks } from "../../utils/curriculumCoverage";
import { IconWarningTriangle } from "../icons/Icons";
import styles from "./CurriculumModuleInsights.module.css";

type CurriculumModuleInsightsProps = {
  module: CurriculumNode;
  objectives: LearningObjective[];
};

export function CurriculumModuleInsights({
  module,
  objectives,
}: CurriculumModuleInsightsProps) {
  const insights = getModuleInsights(module, objectives);

  if (insights.length === 0) return null;

  return (
    <section className={styles.panel} aria-label="Module improvement insights">
      <h3 className={styles.title}>Module insights</h3>
      <ul className={styles.list}>
        {insights.map((insight) => (
          <li
            key={insight.id}
            className={
              insight.severity === "critical"
                ? styles.itemCritical
                : insight.severity === "warning"
                  ? styles.itemWarning
                  : styles.itemInfo
            }
          >
            <IconWarningTriangle className={styles.icon} aria-hidden />
            {insight.message}
          </li>
        ))}
      </ul>
    </section>
  );
}

type CurriculumObjectiveViewProps = {
  module: CurriculumNode;
  objectives: LearningObjective[];
};

export function CurriculumObjectiveView({ module, objectives }: CurriculumObjectiveViewProps) {
  const links = getObjectiveContentLinks(module, objectives);

  if (links.length === 0) {
    return (
      <p className={styles.emptyView}>No learning objectives linked to this module yet.</p>
    );
  }

  return (
    <div className={styles.objectiveView} aria-label="Objectives and supporting content">
      {links.map((link) => {
        const evidence = computeObjectiveEvidence(
          objectives.find((o) => o.id === link.objectiveId)!,
        );

        return (
          <section key={link.objectiveId} className={styles.objectiveBlock}>
            <header className={styles.objectiveHeader}>
              <span className={styles.loTag}>LO {link.objectiveId}</span>
              <h3 className={styles.objectiveTitle}>{link.objectiveTitle}</h3>
              <span className={styles.objectiveScore} aria-label={`Coverage score ${evidence.score}`}>
                {evidence.score}
              </span>
            </header>

            <p className={styles.supportedLabel}>Supported by:</p>
            {link.pages.length === 0 ? (
              <p className={styles.noPages}>No pages in this module support this objective.</p>
            ) : (
              <ul className={styles.pageList}>
                {link.pages.map((page) => (
                  <li key={page.id} className={styles.pageItem}>
                    <span
                      className={
                        page.type === "activity-page" ? styles.pageTypeActivity : styles.pageTypePage
                      }
                    >
                      {page.type === "activity-page" ? "Activity" : "Page"}
                    </span>
                    <span className={styles.pageTitle}>{page.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
