import { useMemo } from "react";
import { ProficiencyBadge } from "../../components/ProficiencyBadge/ProficiencyBadge";
import { useAppNavigation } from "../../context/AppNavigationContext";
import { getObjectiveProficiency, hasProficiencyData } from "../../data/proficiency";
import { objectives } from "../../data/objectives";
import styles from "./InsightsPage.module.css";

function formatPercent(value: number | null): string {
  if (value == null) return "—";
  return `${value}%`;
}

function formatAttempts(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(1);
}

function difficultyLabel(value: "easier" | "average" | "harder" | null): string {
  if (value == null) return "—";
  switch (value) {
    case "easier":
      return "Easier";
    case "average":
      return "Average";
    case "harder":
      return "Harder";
  }
}

function difficultyClass(value: "easier" | "average" | "harder" | null): string {
  switch (value) {
    case "easier":
      return styles.difficultyEasier;
    case "harder":
      return styles.difficultyHarder;
    default:
      return styles.difficultyAverage;
  }
}

export function InsightsPage() {
  const { insightsFilter, clearInsightsFilter } = useAppNavigation();
  const filterId = insightsFilter.objectiveId;

  const rows = useMemo(() => {
    const list = filterId
      ? objectives.filter((o) => o.id === filterId)
      : objectives;
    return list.map((objective) => ({
      objective,
      proficiency: getObjectiveProficiency(objective),
    }));
  }, [filterId]);

  const filteredObjective = filterId
    ? objectives.find((o) => o.id === filterId)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.heading}>Insights</h1>
          <p className={styles.lead}>
            Analyze learner performance across course sections. Proficiency reflects how students
            are doing — not a property of the objective definition.
          </p>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.modeToggle} role="tablist" aria-label="Insights view mode">
            <button type="button" className={`${styles.modeBtn} ${styles.modeBtnActive}`} role="tab" aria-selected>
              By Objective
            </button>
            <button type="button" className={styles.modeBtn} role="tab" aria-selected={false} disabled>
              By Section
            </button>
          </div>
        </div>

        {filteredObjective && (
          <div className={styles.filterBanner} role="status">
            <span>
              Showing insights for <strong>{filteredObjective.title}</strong>
            </span>
            <button type="button" className={styles.clearFilter} onClick={clearInsightsFilter}>
              Show all objectives
            </button>
          </div>
        )}

        <div className={styles.tableWrap}>
          {rows.length === 0 ? (
            <div className={styles.emptyState} role="status">
              No objectives match this filter.
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Objective</th>
                  <th className={styles.proficiencyCol}>Proficiency</th>
                  <th className={styles.metricCol}>Attempts</th>
                  <th className={styles.metricCol}>First try correct</th>
                  <th className={styles.metricCol}>Eventually correct</th>
                  <th className={styles.metricCol}>Relative difficulty</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ objective, proficiency }) => {
                  const hasData = hasProficiencyData(proficiency);
                  return (
                    <tr
                      key={objective.id}
                      className={filterId === objective.id ? styles.rowSelected : undefined}
                    >
                      <td className={styles.objectiveCell}>
                        <span className={styles.objectiveId}>LO {objective.id}</span>
                        <span className={styles.objectiveTitle}>{objective.title}</span>
                      </td>
                      <td className={styles.proficiencyCol}>
                        <ProficiencyBadge level={proficiency.level} />
                      </td>
                      <td className={`${styles.metricCol} ${!hasData ? styles.metricMuted : ""}`}>
                        {formatAttempts(proficiency.attempts)}
                      </td>
                      <td className={`${styles.metricCol} ${!hasData ? styles.metricMuted : ""}`}>
                        {formatPercent(proficiency.firstAttemptCorrect)}
                      </td>
                      <td className={`${styles.metricCol} ${!hasData ? styles.metricMuted : ""}`}>
                        {formatPercent(proficiency.eventuallyCorrect)}
                      </td>
                      <td
                        className={`${styles.metricCol} ${hasData ? difficultyClass(proficiency.relativeDifficulty) : styles.metricMuted}`}
                      >
                        {difficultyLabel(proficiency.relativeDifficulty)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
