import type { CurriculumNode } from "../../data/curriculum";
import type { LearningObjective } from "../../data/types";
import { buildCoverageMatrix } from "../../utils/curriculumCoverage";
import styles from "./CurriculumMiniHeatmap.module.css";

type CurriculumMiniHeatmapProps = {
  module: CurriculumNode;
  objectives: LearningObjective[];
};

const STRENGTH_CLASS: Record<string, string> = {
  none: styles.cellNone,
  weak: styles.cellWeak,
  moderate: styles.cellModerate,
  strong: styles.cellStrong,
};

export function CurriculumMiniHeatmap({ module, objectives }: CurriculumMiniHeatmapProps) {
  const matrix = buildCoverageMatrix(module, objectives);

  if (matrix.pages.length === 0 || matrix.objectives.length === 0) {
    return (
      <section className={styles.panel}>
        <p className={styles.empty}>Not enough content to show coverage matrix.</p>
      </section>
    );
  }

  const cellMap = new Map(
    matrix.cells.map((cell) => [`${cell.objectiveId}:${cell.pageId}`, cell.strength]),
  );

  return (
    <section className={styles.panel} aria-label="Objective by page coverage matrix">
      <h3 className={styles.title}>Coverage matrix</h3>
      <p className={styles.subtitle}>
        Objective × page alignment. Darker cells indicate stronger coverage density.
      </p>

      <div className={styles.scrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col">
                LO / Page
              </th>
              {matrix.pages.map((page) => (
                <th key={page.id} className={styles.colHeader} scope="col">
                  <span className={styles.colHeaderText}>{page.title}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.objectives.map((objective) => (
              <tr key={objective.id}>
                <th className={styles.rowHeader} scope="row">
                  LO {objective.id}
                </th>
                {matrix.pages.map((page) => {
                  const strength =
                    cellMap.get(`${objective.id}:${page.id}`) ?? "none";
                  return (
                    <td key={page.id} className={styles.cell}>
                      <span
                        className={`${styles.cellInner} ${STRENGTH_CLASS[strength]}`}
                        title={
                          strength === "none"
                            ? `LO ${objective.id} not linked to ${page.title}`
                            : `LO ${objective.id} linked to ${page.title}`
                        }
                        aria-label={
                          strength === "none"
                            ? `No link`
                            : `${strength} coverage`
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className={styles.legend} aria-label="Coverage legend">
        <li><span className={`${styles.legendSwatch} ${styles.cellNone}`} /> No link</li>
        <li><span className={`${styles.legendSwatch} ${styles.cellWeak}`} /> Single page</li>
        <li><span className={`${styles.legendSwatch} ${styles.cellModerate}`} /> Moderate</li>
        <li><span className={`${styles.legendSwatch} ${styles.cellStrong}`} /> Strong</li>
      </ul>
    </section>
  );
}
