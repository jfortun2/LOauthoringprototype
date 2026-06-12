import { useEffect, useMemo, useState } from "react";
import { RowExpandChevron } from "../../components/RowExpandChevron/RowExpandChevron";
import { IconChevronRight } from "../../components/icons/Icons";
import { courseUnits } from "../../data/courseUnits";
import {
  getCurriculumForUnit,
  getObjectivesForCurriculumModule,
  type CurriculumNode,
  type CurriculumView,
} from "../../data/curriculum";
import { objectives } from "../../data/objectives";
import type { LearningObjective } from "../../data/types";
import { coverageLabel } from "../../utils/mappings";
import styles from "./CurriculumPage.module.css";

type CurriculumLayout = "list" | "outline";

function IconPage() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5.5 3.5h6.5L14.5 5.5v11H5.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.5v2h2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9h5M7.5 11.5h5M7.5 14h3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconActivityPage() {
  return (
    <span className={styles.activityIconWrap} aria-hidden>
      <IconPage />
      <svg
        className={styles.activityPencil}
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
      >
        <path
          d="M6.8 1.2 8.8 3.2 3.5 8.5 1.5 8.5l.05-2.05L6.8 1.2Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function IconModule() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3.5 6.5 10 3.5l6.5 3v7L10 16.5 3.5 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M10 3.5v13M3.5 6.5 10 9.5l6.5-3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSection() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 5.5h12M4 10h12M4 14.5h8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="3.5"
        width="14"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function IconEllipsisVertical() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="8" cy="3.5" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="8" cy="12.5" r="1.25" />
    </svg>
  );
}

function CurriculumItemIcon({ item }: { item: CurriculumNode }) {
  if (item.type === "module") return <IconModule />;
  if (item.type === "section") return <IconSection />;
  if (item.type === "activity-page") return <IconActivityPage />;
  return <IconPage />;
}

function isContainerNode(item: CurriculumNode): boolean {
  return Boolean(item.children?.length);
}

function CoverageBadge({ coverage }: { coverage: LearningObjective["coverage"] }) {
  const coverageClass =
    coverage === "none"
      ? styles.coverageNone
      : coverage === "weak"
        ? styles.coverageWeak
        : coverage === "moderate"
          ? styles.coverageModerate
          : styles.coverageStrong;

  return (
    <span className={`${styles.coverageBadge} ${coverageClass}`}>{coverageLabel(coverage)}</span>
  );
}

function ModuleObjectivesSummary({ module }: { module: CurriculumNode }) {
  const moduleObjectives = useMemo(
    () => getObjectivesForCurriculumModule(module, objectives),
    [module],
  );

  if (moduleObjectives.length === 0) return null;

  return (
    <section className={styles.moduleSummary} aria-label="Learning objectives covered in this module">
      <h2 className={styles.moduleSummaryTitle}>Learning objectives covered</h2>
      <ul className={styles.moduleSummaryList}>
        {moduleObjectives.map((objective) => (
          <li key={objective.id} className={styles.moduleSummaryItem}>
            <span className={styles.loLabel}>lo {objective.id}</span>
            <span className={styles.moduleSummaryText}>{objective.title}</span>
            <CoverageBadge coverage={objective.coverage} />
          </li>
        ))}
      </ul>
    </section>
  );
}

type ContentRowProps = {
  item: CurriculumNode;
  onNavigate?: () => void;
};

function ContentRow({ item, onNavigate }: ContentRowProps) {
  const navigable = Boolean(onNavigate);
  const titleClass =
    item.type === "module" || item.type === "section" ? styles.containerTitle : styles.pageTitle;

  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        {navigable ? (
          <button type="button" className={styles.navigateBtn} onClick={onNavigate}>
            <span className={styles.rowIcon}>
              <CurriculumItemIcon item={item} />
            </span>
            <span className={titleClass}>{item.title}</span>
            <IconChevronRight className={styles.navigateChevron} />
          </button>
        ) : (
          <>
            <span className={styles.rowIcon}>
              <CurriculumItemIcon item={item} />
            </span>
            <span className={titleClass}>{item.title}</span>
            {item.showEditLink && (
              <button type="button" className={styles.editLink}>
                Edit Page
              </button>
            )}
          </>
        )}
      </div>
      <button type="button" className={styles.menuBtn} aria-label={`Actions for ${item.title}`}>
        <IconEllipsisVertical />
      </button>
    </li>
  );
}

type OutlineNodeProps = {
  item: CurriculumNode;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onNavigate: (path: string[]) => void;
  pathPrefix: string[];
};

function OutlineNode({
  item,
  depth,
  expandedIds,
  onToggle,
  onNavigate,
  pathPrefix,
}: OutlineNodeProps) {
  const hasChildren = isContainerNode(item);
  const expanded = expandedIds.has(item.id);
  const currentPath = [...pathPrefix, item.id];
  const titleClass =
    item.type === "module" || item.type === "section" ? styles.containerTitle : styles.pageTitle;

  return (
    <li className={styles.outlineItem}>
      <div
        className={styles.outlineRow}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {hasChildren ? (
          <RowExpandChevron
            expanded={expanded}
            onClick={() => onToggle(item.id)}
            label={expanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
          />
        ) : (
          <span className={styles.outlineSpacer} aria-hidden />
        )}

        <div className={styles.outlineRowMain}>
          <span className={styles.rowIcon}>
            <CurriculumItemIcon item={item} />
          </span>

          {item.type === "module" ? (
            <button
              type="button"
              className={styles.outlineTitleBtn}
              onClick={() => onNavigate(currentPath)}
            >
              <span className={titleClass}>{item.title}</span>
            </button>
          ) : (
            <span className={titleClass}>{item.title}</span>
          )}

          {item.showEditLink && (
            <button type="button" className={styles.editLink}>
              Edit Page
            </button>
          )}

          {item.type === "module" && item.objectiveIds && (
            <span className={styles.outlineLoCount}>
              {item.objectiveIds.length} LO{item.objectiveIds.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <button type="button" className={styles.menuBtn} aria-label={`Actions for ${item.title}`}>
          <IconEllipsisVertical />
        </button>
      </div>

      {hasChildren && expanded && (
        <ul className={styles.outlineChildren}>
          {item.children!.map((child) => (
            <OutlineNode
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
              pathPrefix={currentPath}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const VIEW_OPTIONS: { value: CurriculumView; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "detailed", label: "Detailed" },
  { value: "learning", label: "Learning" },
];

const LAYOUT_OPTIONS: { value: CurriculumLayout; label: string }[] = [
  { value: "list", label: "List" },
  { value: "outline", label: "Outline" },
];

function resolvePathNodes(unitId: string, path: string[]): CurriculumNode[] {
  const crumbs: CurriculumNode[] = [];
  let nodes = getCurriculumForUnit(unitId);

  for (const id of path) {
    const node = nodes.find((entry) => entry.id === id);
    if (!node) break;
    crumbs.push(node);
    nodes = node.children ?? [];
  }

  return crumbs;
}

export function CurriculumPage() {
  const [unitId, setUnitId] = useState("unit-1");
  const [view, setView] = useState<CurriculumView>("basic");
  const [layout, setLayout] = useState<CurriculumLayout>("list");
  const [path, setPath] = useState<string[]>([]);
  const [outlineExpanded, setOutlineExpanded] = useState<Set<string>>(() => new Set());

  const unit = useMemo(
    () => courseUnits.find((entry) => entry.id === unitId) ?? courseUnits[0],
    [unitId],
  );

  const pathNodes = useMemo(() => resolvePathNodes(unit.id, path), [unit.id, path]);

  const currentContainer = pathNodes.at(-1);
  const parentModule = useMemo(
    () => pathNodes.find((node) => node.type === "module"),
    [pathNodes],
  );

  const listItems = useMemo(() => {
    if (path.length === 0) return getCurriculumForUnit(unit.id);
    return currentContainer?.children ?? [];
  }, [unit.id, path, currentContainer]);

  useEffect(() => {
    setPath([]);
    setOutlineExpanded(new Set());
  }, [unitId]);

  useEffect(() => {
    if (layout !== "outline") return;
    const moduleIds = getCurriculumForUnit(unit.id)
      .filter((item) => item.type === "module")
      .map((item) => item.id);
    setOutlineExpanded(new Set(moduleIds));
  }, [layout, unit.id]);

  const toggleOutlineNode = (id: string) => {
    setOutlineExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigateToPath = (nextPath: string[]) => {
    setPath(nextPath);
    setLayout("list");
  };

  const pageTitle = currentContainer?.title ?? "Curriculum";
  const pageLead = currentContainer
    ? `Pages and activities inside ${currentContainer.title}.`
    : "Create and arrange your learning materials below.";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <button type="button" className={styles.breadcrumbLink} onClick={() => setPath([])}>
            Curriculum
          </button>
          <span className={styles.breadcrumbSep} aria-hidden>
            ›
          </span>
          <button
            type="button"
            className={path.length === 0 ? styles.breadcrumbCurrent : styles.breadcrumbLink}
            onClick={() => setPath([])}
          >
            {unit.title}
          </button>
          {pathNodes.map((node, index) => (
            <span key={node.id} className={styles.breadcrumbSegment}>
              <span className={styles.breadcrumbSep} aria-hidden>
                ›
              </span>
              <button
                type="button"
                className={
                  index === pathNodes.length - 1
                    ? styles.breadcrumbCurrent
                    : styles.breadcrumbLink
                }
                onClick={() => setPath(path.slice(0, index + 1))}
              >
                {node.title}
              </button>
            </span>
          ))}

          <label className={styles.unitSelectWrap}>
            <span className="visually-hidden">Switch unit</span>
            <select
              className={styles.unitSelect}
              value={unit.id}
              onChange={(event) => setUnitId(event.target.value)}
            >
              {courseUnits.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
        </nav>

        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h1 className={styles.heading}>{pageTitle}</h1>
            <p className={styles.lead}>{pageLead}</p>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.importBtn}>
              Import from Google Docs
            </button>

            <fieldset className={styles.viewToggle}>
              <legend className="visually-hidden">Curriculum view</legend>
              {VIEW_OPTIONS.map((option) => (
                <label key={option.value} className={styles.viewOption}>
                  <input
                    type="radio"
                    name="curriculum-view"
                    value={option.value}
                    checked={view === option.value}
                    onChange={() => setView(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>

            {view === "basic" && (
              <fieldset className={styles.viewToggle}>
                <legend className="visually-hidden">Curriculum layout</legend>
                {LAYOUT_OPTIONS.map((option) => (
                  <label key={option.value} className={styles.viewOption}>
                    <input
                      type="radio"
                      name="curriculum-layout"
                      value={option.value}
                      checked={layout === option.value}
                      onChange={() => setLayout(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        </div>

        {view === "basic" ? (
          <>
            {parentModule && layout === "list" && <ModuleObjectivesSummary module={parentModule} />}

            {layout === "list" ? (
              <ul className={styles.list}>
                {listItems.map((item) => (
                  <ContentRow
                    key={item.id}
                    item={item}
                    onNavigate={
                      isContainerNode(item) ? () => setPath([...path, item.id]) : undefined
                    }
                  />
                ))}
              </ul>
            ) : (
              <ul className={styles.outlineList}>
                {getCurriculumForUnit(unit.id).map((item) => (
                  <OutlineNode
                    key={item.id}
                    item={item}
                    depth={0}
                    expandedIds={outlineExpanded}
                    onToggle={toggleOutlineNode}
                    onNavigate={navigateToPath}
                    pathPrefix={[]}
                  />
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className={styles.viewPlaceholder}>
            <p>
              <strong>{view === "detailed" ? "Detailed" : "Learning"} view</strong> is not built in
              this prototype yet. Switch to Basic to browse the curriculum list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
