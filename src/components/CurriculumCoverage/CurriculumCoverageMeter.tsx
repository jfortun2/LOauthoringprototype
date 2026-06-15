import type { CurriculumNode } from "../../data/curriculum";
import { getModuleCoverageCounts } from "../../utils/curriculumCoverage";
import styles from "./CurriculumCoverageMeter.module.css";

type CurriculumCoverageMeterProps = {
  module: CurriculumNode;
};

export function CurriculumCoverageMeter({ module }: CurriculumCoverageMeterProps) {
  const counts = getModuleCoverageCounts(module);

  const bars = [
    { label: "Pages", value: counts.pages, max: 6 },
    { label: "Activities", value: counts.activities, max: 4 },
    { label: "Objectives", value: counts.objectives, max: 5 },
  ];

  return (
    <section className={styles.panel} aria-label="Module coverage overview">
      <h3 className={styles.title}>Coverage overview</h3>
      <p className={styles.subtitle}>
        How well this module supports its learning objectives through content and assessments.
      </p>
      <ul className={styles.bars}>
        {bars.map((bar) => {
          const pct = Math.round((bar.value / bar.max) * 100);
          const fillClass =
            pct >= 75 ? styles.fillStrong : pct >= 40 ? styles.fillModerate : styles.fillWeak;

          return (
            <li key={bar.label} className={styles.barRow}>
              <span className={styles.barLabel}>{bar.label}</span>
              <div
                className={styles.barTrack}
                role="meter"
                aria-valuenow={bar.value}
                aria-valuemin={0}
                aria-valuemax={bar.max}
                aria-label={`${bar.label}: ${bar.value}`}
              >
                <span
                  className={`${styles.barFill} ${fillClass}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <span className={styles.barValue}>{bar.value}</span>
            </li>
          );
        })}
      </ul>
      <p className={styles.total}>{counts.totalContent} total content items in module</p>
    </section>
  );
}
