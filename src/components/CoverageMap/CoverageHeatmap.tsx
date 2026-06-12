import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { courseContentTree } from "../../data/courseContent";
import type { LearningObjective } from "../../data/types";
import {
  collectExpandableNodeIds,
  getContentPathLabel,
} from "../../utils/coverageColumns";
import {
  buildObjectiveCoverageMap,
  computeCoverageInsights,
  intensityDescription,
  intensityLabel,
  type ContentDetailSelection,
  type CoverageContentItem,
  type CoverageIntensity,
} from "../../utils/coverageMap";
import { ContentDetailPanel } from "./ContentDetailPanel";
import styles from "./CoverageHeatmap.module.css";

type CoverageHeatmapProps = {
  objective: LearningObjective;
  onSelectContent?: (contentId: string) => void;
};

type GapSelection = {
  subObjectiveTitle: string;
  columnLabel: string;
  levelLabel: string;
};

const LEGEND: { intensity: CoverageIntensity; label: string }[] = [
  { intensity: 0, label: "Gap" },
  { intensity: 1, label: "Minimal" },
  { intensity: 2, label: "Light" },
  { intensity: 3, label: "Moderate" },
  { intensity: 4, label: "Strong" },
];

const INTENSITY_CLASS: Record<CoverageIntensity, string> = {
  0: styles.intensity0,
  1: styles.intensity1,
  2: styles.intensity2,
  3: styles.intensity3,
  4: styles.intensity4,
};

function intensityClass(intensity: CoverageIntensity) {
  return INTENSITY_CLASS[intensity] ?? styles.intensity0;
}

export function CoverageHeatmap({ objective, onSelectContent }: CoverageHeatmapProps) {
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<ContentDetailSelection | null>(null);
  const [gapSelection, setGapSelection] = useState<GapSelection | null>(null);
  const [cellItems, setCellItems] = useState<CoverageContentItem[]>([]);

  const expandedGroupSet = useMemo(() => new Set(expandedGroupIds), [expandedGroupIds]);

  const coverageMap = useMemo(
    () => buildObjectiveCoverageMap(objective, expandedGroupSet),
    [objective, expandedGroupIds],
  );
  const { groups, columns, rows, structure } = coverageMap;

  const expandableIds = useMemo(() => collectExpandableNodeIds(groups), [groups]);
  const insights = useMemo(() => computeCoverageInsights(rows), [rows]);
  const columnCount = Math.max(columns.length, 1);
  const canExpand = expandableIds.length > 0;
  const isFullyExpanded = canExpand && expandableIds.every((id) => expandedGroupIds.includes(id));

  useEffect(() => {
    setExpandedGroupIds([]);
    setSelection(null);
    setGapSelection(null);
    setCellItems([]);
  }, [objective.id]);

  const openDetail = (
    item: CoverageContentItem,
    subTitle: string,
    columnLabel: string,
    items: CoverageContentItem[],
  ) => {
    const path =
      item.id.startsWith("page-") || item.id.startsWith("act-")
        ? getContentPathLabel(item.id, courseContentTree)
        : `${columnLabel} · Linked activity`;

    setGapSelection(null);
    setCellItems(items);
    setSelection({
      item,
      subObjectiveTitle: subTitle,
      columnLabel,
      path,
    });

    if (item.id.startsWith("page-") || item.id.startsWith("act-")) {
      onSelectContent?.(item.id);
    }
  };

  const toggleColumn = (columnId: string) => {
    setExpandedGroupIds((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId],
    );
    setSelection(null);
    setGapSelection(null);
    setCellItems([]);
  };

  const expandAll = () => {
    setExpandedGroupIds(expandableIds);
    setSelection(null);
    setGapSelection(null);
    setCellItems([]);
  };

  const collapseAll = () => {
    setExpandedGroupIds([]);
    setSelection(null);
    setGapSelection(null);
    setCellItems([]);
  };

  if (rows.length === 0) {
    return <p className={styles.emptyMap}>No sub-objectives to map.</p>;
  }

  const gridStyle = {
    "--column-count": String(columnCount),
  } as CSSProperties;

  return (
    <div className={styles.mapWrap}>
      <div className={styles.guide}>
        <div className={styles.guideIntro}>
          <p className={styles.guideLead}>
            See where each sub-objective is taught across your course. Rows are sub-objectives;
            columns follow your course structure starting at{" "}
            <strong>{structure.topLevelLabel.toLowerCase()}</strong>.
          </p>
          <p className={styles.structureSummary}>{structure.summary}</p>
        </div>

        <div className={styles.guideCards}>
          <div className={styles.guideCard}>
            <span className={styles.guideCardLabel}>Read the squares</span>
            <p className={styles.guideCardText}>
              Darker blue = stronger coverage. Gray squares are gaps — no linked pages or
              activities for that sub-objective in that part of the course.
            </p>
          </div>
          <div className={styles.guideCard}>
            <span className={styles.guideCardLabel}>Drill down</span>
            <p className={styles.guideCardText}>
              {structure.expandHint}
              {structure.drillDownLabels.length > 0 && (
                <>
                  {" "}
                  Path: {structure.drillDownLabels.join(" · ")}.
                </>
              )}
            </p>
          </div>
          <div className={styles.guideCard}>
            <span className={styles.guideCardLabel}>Take action</span>
            <p className={styles.guideCardText}>
              Click a colored square to see linked content. Click a gray gap to plan where to add
              pages or assessments. Use gaps to balance coverage before publishing.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.insights}>
            <span className={styles.insightItem}>
              <span className={`${styles.insightDot} ${styles.insightDotGap}`} />
              {insights.gapCount} gaps
            </span>
            <span className={styles.insightItem}>
              <span className={`${styles.insightDot} ${styles.insightDotLinked}`} />
              {insights.linkedCellCount} linked
            </span>
          </div>
          {canExpand && (
            <div className={styles.expandControls}>
              <button type="button" className={styles.controlBtn} onClick={expandAll}>
                Expand all
              </button>
              <button
                type="button"
                className={styles.controlBtn}
                onClick={collapseAll}
                disabled={expandedGroupIds.length === 0}
              >
                Collapse to overview
              </button>
            </div>
          )}
        </div>

        <div className={styles.legend} aria-label="Coverage intensity legend">
          {LEGEND.map(({ intensity, label }) => (
            <span
              key={intensity}
              className={styles.legendItem}
              title={intensityDescription(intensity)}
            >
              <span className={`${styles.legendSwatch} ${intensityClass(intensity)}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {canExpand && !isFullyExpanded && (
        <p className={styles.expandCallout}>
          Tip: click <strong>+</strong> on a column header to open{" "}
          {structure.kind === "units"
            ? "modules, sections, or pages"
            : structure.kind === "page-groups"
              ? "individual pages"
              : "the next level down"}
          .
        </p>
      )}

      <div className={styles.scrollArea}>
        <div className={styles.grid} style={gridStyle}>
          <div className={styles.gridRow}>
            <div className={styles.cornerCell}>
              <span className={styles.cornerLabel}>Sub-objective</span>
            </div>
            {columns.map((column) => {
              const isExpanded = expandedGroupIds.includes(column.id);
              return (
                <div key={column.id} className={styles.columnHead} title={column.label}>
                  {column.hasChildren && (
                    <button
                      type="button"
                      className={styles.expandBtn}
                      onClick={() => toggleColumn(column.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${column.label}`}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                  )}
                  <span className={styles.levelBadge}>{column.levelLabel}</span>
                  <span className={styles.columnHeadText}>{column.shortLabel}</span>
                  {column.hasChildren && !isExpanded && (
                    <span className={styles.childHint}>{column.childCount} inside</span>
                  )}
                </div>
              );
            })}
          </div>

          {rows.map(({ subObjective, cells }) => (
            <div key={subObjective.id} className={styles.gridRow}>
              <div className={styles.rowLabel} title={subObjective.title}>
                {subObjective.title}
              </div>
              {cells.map((cell) => {
                const column = columns.find((c) => c.id === cell.columnId);
                if (!column) return null;

                const isGap = cell.intensity === 0;
                const isSelected =
                  !isGap &&
                  selection !== null &&
                  cell.items.length > 0 &&
                  selection.item.id === cell.items[0].id &&
                  selection.subObjectiveTitle === subObjective.title &&
                  selection.columnLabel === column.label;
                const isGapSelected =
                  isGap &&
                  gapSelection !== null &&
                  gapSelection.subObjectiveTitle === subObjective.title &&
                  gapSelection.columnLabel === column.label;

                return (
                  <button
                    key={cell.columnId}
                    type="button"
                    className={`${styles.cell} ${intensityClass(cell.intensity)} ${
                      isGap ? styles.cellGap : ""
                    } ${isSelected || isGapSelected ? styles.cellSelected : ""}`}
                    title={`${column.label}: ${intensityLabel(cell.intensity)} — ${intensityDescription(cell.intensity)}${
                      cell.items.length ? ` · ${cell.items.length} linked` : ""
                    }`}
                    onClick={() => {
                      if (cell.items.length > 0) {
                        openDetail(
                          cell.items[0],
                          subObjective.title,
                          column.label,
                          cell.items,
                        );
                      } else {
                        setSelection(null);
                        setCellItems([]);
                        setGapSelection({
                          subObjectiveTitle: subObjective.title,
                          columnLabel: column.label,
                          levelLabel: column.levelLabel,
                        });
                      }
                    }}
                    aria-label={`${column.label}, ${intensityLabel(cell.intensity)} coverage`}
                  >
                    {!isGap && cell.items.length > 0 && (
                      <span className={styles.cellBadge}>{cell.items.length}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {gapSelection && (
        <div className={styles.gapPanel}>
          <div className={styles.gapPanelHeader}>
            <h5 className={styles.gapPanelTitle}>Coverage gap</h5>
            <button
              type="button"
              className={styles.gapCloseBtn}
              onClick={() => setGapSelection(null)}
              aria-label="Close gap details"
            >
              ×
            </button>
          </div>
          <p className={styles.gapContext}>
            {gapSelection.subObjectiveTitle} · {gapSelection.columnLabel}
          </p>
          <p className={styles.gapText}>
            No pages or activities in this {gapSelection.levelLabel.toLowerCase()} are linked to
            this sub-objective yet. Consider adding a reading, practice activity, or assessment here
            so learners encounter this objective in context.
          </p>
          <ul className={styles.gapActions}>
            <li>Add a formative activity to introduce the concept</li>
            <li>Link an existing page that teaches this sub-objective</li>
            <li>Review neighboring columns for overlap before creating new content</li>
          </ul>
        </div>
      )}

      {selection && (
        <div className={styles.detailWrap}>
          <ContentDetailPanel
            selection={selection}
            cellItems={cellItems}
            onSelectItem={(item) =>
              openDetail(item, selection.subObjectiveTitle, selection.columnLabel, cellItems)
            }
            onClose={() => {
              setSelection(null);
              setCellItems([]);
            }}
          />
        </div>
      )}
    </div>
  );
}
