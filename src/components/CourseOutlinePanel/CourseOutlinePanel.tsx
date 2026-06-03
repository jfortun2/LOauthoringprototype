import { useEffect, useMemo, useState } from "react";
import { courseContentTree } from "../../data/courseContent";
import type { ContentNode } from "../../data/types";
import { getContentById, getContentPathIds } from "../../utils/mappings";
import { IconActivity, IconPage } from "../icons/Icons";
import styles from "./CourseOutlinePanel.module.css";

type CourseOutlinePanelProps = {
  open: boolean;
  onToggle: () => void;
  selectedContentId: string | null;
  onSelectContent: (node: ContentNode) => void;
};

function ContentTypeIcon({ type }: { type: ContentNode["type"] }) {
  if (type === "page") return <IconPage className={styles.typeIcon} />;
  if (type === "activity") return <IconActivity className={styles.typeIcon} />;
  return null;
}

function TreeNode({
  node,
  depth,
  selectedContentId,
  pathIds,
  onSelectContent,
  expandedIds,
  toggleExpanded,
}: {
  node: ContentNode;
  depth: number;
  selectedContentId: string | null;
  pathIds: Set<string>;
  onSelectContent: (node: ContentNode) => void;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isExpanded = expandedIds.has(node.id);
  const isSelectable = node.type === "page" || node.type === "activity";
  const isSelected = selectedContentId === node.id;
  const isOnPath = pathIds.has(node.id) && !isSelected;
  const paddingLeft = depth * 14 + 4;

  return (
    <li>
      <div
        className={`${styles.row} ${isOnPath ? styles.rowOnPath : ""} ${isSelected ? styles.rowSelected : ""}`}
        style={{ paddingLeft }}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => toggleExpanded(node.id)}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.title}`}
          >
            <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
              ▶
            </span>
          </button>
        ) : (
          <span className={styles.expandSpacer} aria-hidden />
        )}

        {isSelectable ? (
          <button
            type="button"
            className={`${styles.selectBtn} ${styles.selectBtnSelectable}`}
            onClick={() => onSelectContent(node)}
            aria-current={isSelected ? "true" : undefined}
          >
            <ContentTypeIcon type={node.type} />
            <span className={styles.label}>{node.title}</span>
            {node.objectiveIds && node.objectiveIds.length > 0 && (
              <span className={styles.badge}>{node.objectiveIds.length}</span>
            )}
          </button>
        ) : (
          <span className={`${styles.selectBtn} ${isOnPath ? styles.selectBtnSelectable : ""}`}>
            <span className={styles.label}>{node.title}</span>
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className={styles.children}>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedContentId={selectedContentId}
              pathIds={pathIds}
              onSelectContent={onSelectContent}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CourseOutlinePanel({
  open,
  onToggle,
  selectedContentId,
  onSelectContent,
}: CourseOutlinePanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(["seq-1", "unit-2", "mod-2"]),
  );

  const pathIds = useMemo(() => {
    if (!selectedContentId) return new Set<string>();
    const path = getContentPathIds(selectedContentId);
    return new Set(path ?? []);
  }, [selectedContentId]);

  const selectedNode = selectedContentId ? getContentById(selectedContentId) : null;

  useEffect(() => {
    if (!selectedContentId) return;
    const path = getContentPathIds(selectedContentId);
    if (!path) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      path.forEach((id) => next.add(id));
      return next;
    });
  }, [selectedContentId]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.dock}>
      <button
        type="button"
        className={`${styles.railTab} ${open ? styles.railTabOpen : ""}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="course-content-panel"
        title={open ? "Hide course content" : "Browse course content"}
      >
        <span className={`${styles.railIcon} ${open ? styles.railIconOpen : ""}`} aria-hidden>
          ›
        </span>
        Course content
      </button>

      <div className={`${styles.panelWrap} ${open ? styles.panelWrapOpen : ""}`}>
        <aside
          id="course-content-panel"
          className={styles.panel}
          aria-label="Course content outline"
          aria-hidden={!open}
        >
        <div className={styles.header}>
          <h2 className={styles.title}>Course content</h2>
          <p className={styles.hint}>Select a page or activity to filter objectives.</p>
          {selectedNode && (
            <div className={styles.selectedBanner}>
              <strong>Viewing: {selectedNode.title}</strong>
              {selectedNode.type === "activity" ? "Activity" : "Page"} in course
            </div>
          )}
        </div>
        <nav className={styles.tree}>
          <ul className={styles.children}>
            {courseContentTree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedContentId={selectedContentId}
                pathIds={pathIds}
                onSelectContent={onSelectContent}
                expandedIds={expandedIds}
                toggleExpanded={toggleExpanded}
              />
            ))}
          </ul>
        </nav>
          <div className={styles.footer}>
            <button type="button" className={styles.previewBtn}>
              Preview course
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
