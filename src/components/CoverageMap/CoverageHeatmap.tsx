import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { courseContentTree } from "../../data/courseContent";
import type { LearningObjective } from "../../data/types";
import {
  buildObjectiveCoverageMap,
  intensityLabel,
  type ContentDetailSelection,
  type CoverageContentItem,
  type CoverageIntensity,
} from "../../utils/coverageMap";
import { getContentPathLabel } from "../../utils/coverageColumns";
import { ContentDetailPanel } from "./ContentDetailPanel";
import styles from "./CoverageHeatmap.module.css";

type CoverageHeatmapProps = {
  objective: LearningObjective;
  onSelectContent?: (contentId: string) => void;
};

const LEGEND: { intensity: CoverageIntensity; label: string }[] = [
  { intensity: 0, label: "None" },
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
  const [cellItems, setCellItems] = useState<CoverageContentItem[]>([]);

  const expandedGroupSet = useMemo(() => new Set(expandedGroupIds), [expandedGroupIds]);

  const coverageMap = useMemo(
    () => buildObjectiveCoverageMap(objective, expandedGroupSet),
    [objective, expandedGroupIds],
  );
  const { groups, columns, rows } = coverageMap;

  const hasExpandableGroups = groups.some((group) => group.children.length > 0);
  const columnCount = Math.max(columns.length, 1);

  useEffect(() => {
    setExpandedGroupIds([]);
    setSelection(null);
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

  const toggleGroup = (groupId: string) => {
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
    setSelection(null);
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
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          Rows are sub-objectives; columns are course structure. Expand a unit to see modules.
        </p>
        <div className={styles.legend}>
          {LEGEND.map(({ intensity, label }) => (
            <span key={intensity} className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${intensityClass(intensity)}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.grid} style={gridStyle}>
          {hasExpandableGroups && (
            <div className={styles.gridRow}>
              <div className={styles.cornerCell} aria-hidden />
              {groups.map((group) => {
                const isExpanded =
                  expandedGroupIds.includes(group.id) && group.children.length > 0;
                const span = isExpanded ? group.children.length : 1;
                const canExpand = group.children.length > 0;

                return (
                  <div
                    key={group.id}
                    className={styles.groupCell}
                    style={{ gridColumn: `span ${span}` }}
                  >
                    {canExpand && (
                      <button
                        type="button"
                        className={styles.expandBtn}
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.label}`}
                      >
                        {isExpanded ? "−" : "+"}
                      </button>
                    )}
                    <span className={styles.groupLabel} title={group.label}>
                      {group.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.gridRow}>
            <div className={styles.cornerCell}>
              <span className={styles.cornerLabel}>Sub-objective</span>
            </div>
            {columns.map((column) => (
              <div key={column.id} className={styles.columnHead} title={column.label}>
                <span className={styles.columnHeadText}>{column.shortLabel}</span>
              </div>
            ))}
          </div>

          {rows.map(({ subObjective, cells }) => (
            <div key={subObjective.id} className={styles.gridRow}>
              <div className={styles.rowLabel} title={subObjective.title}>
                {subObjective.title}
              </div>
              {cells.map((cell) => {
                const column = columns.find((c) => c.id === cell.columnId);
                if (!column) return null;

                const isSelected =
                  selection !== null &&
                  cell.items.length > 0 &&
                  selection.item.id === cell.items[0].id &&
                  selection.subObjectiveTitle === subObjective.title &&
                  selection.columnLabel === column.label;

                return (
                  <button
                    key={cell.columnId}
                    type="button"
                    className={`${styles.cell} ${intensityClass(cell.intensity)} ${
                      isSelected ? styles.cellSelected : ""
                    }`}
                    title={`${column.label}: ${intensityLabel(cell.intensity)}${
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
                      }
                    }}
                    aria-label={`${column.label}, ${intensityLabel(cell.intensity)} coverage`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
