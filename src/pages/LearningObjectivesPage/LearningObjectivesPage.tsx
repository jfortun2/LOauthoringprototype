import { useCallback, useMemo, useState } from "react";
import { CourseOutlinePanel } from "../../components/CourseOutlinePanel/CourseOutlinePanel";
import { ObjectiveCard } from "../../components/ObjectiveCard/ObjectiveCard";
import { Pagination } from "../../components/Pagination/Pagination";
import {
  IconChevronDown,
  IconExternalLink,
  IconPlus,
  IconSearch,
  IconSort,
} from "../../components/icons/Icons";
import { courseUnits } from "../../data/courseUnits";
import { TOTAL_OBJECTIVES, objectives } from "../../data/objectives";
import { getContentById } from "../../utils/mappings";
import styles from "./LearningObjectivesPage.module.css";

function matchesSearch(objective: { id: string; title: string }, search: string) {
  const q = search.toLowerCase().trim();
  if (!q) return true;
  return `${objective.id} ${objective.title}`.toLowerCase().includes(q);
}

export function LearningObjectivesPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [highlightedObjectiveId, setHighlightedObjectiveId] = useState<string | null>(null);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const filtered = useMemo(
    () => objectives.filter((o) => matchesSearch(o, search)),
    [search],
  );

  const displayList = useMemo(() => {
    if (!selectedUnitId) return filtered;
    const unit = courseUnits.find((u) => u.id === selectedUnitId);
    if (!unit || unit.objectiveIds.length === 0) return filtered;
    const idSet = new Set(unit.objectiveIds);
    return filtered.filter((o) => idSet.has(o.id));
  }, [selectedUnitId, filtered]);

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
    setHighlightedObjectiveId(id);
  };

  const handleSelectUnit = useCallback((unitId: string) => {
    setSelectedUnitId(unitId);
    setOutlineOpen(true);
  }, []);

  const handleSelectContent = (contentId: string) => {
    const node = getContentById(contentId);
    if (!node) return;
    setOutlineOpen(true);
    const linkedObjective = objectives.find(
      (o) =>
        o.linkedPages.some((p) => p.id === contentId) ||
        o.linkedAssessments.some((a) => a.id === contentId),
    );
    if (linkedObjective) {
      const unit = courseUnits.find((u) => u.objectiveIds.includes(linkedObjective.id));
      if (unit) setSelectedUnitId(unit.id);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.heading}>Learning Objectives</h1>
          <p className={styles.lead}>
            Learning objectives help you to organize course content and determine appropriate
            assessments and instructional strategies. Refer to the{" "}
            <a
              href="https://www.cmu.edu/teaching/designteach/design/learningobjectives.html"
              className={styles.helpLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              CMU Eberly Center guide on learning objectives
              <IconExternalLink />
            </a>{" "}
            to learn more about the importance of attaching learning objectives to pages and
            activities.
          </p>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.searchWrap}>
              <IconSearch className={styles.searchIcon} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search learning objectives"
              />
            </div>
            <button type="button" className={styles.sortDropdown} aria-haspopup="listbox">
              Title
              <IconChevronDown className={styles.sortChevron} />
            </button>
            <button type="button" className={styles.sortBtn} aria-label="Sort">
              <IconSort />
            </button>
          </div>
          <button type="button" className={styles.btnNew}>
            <IconPlus />
            New Objective
          </button>
        </div>

        <div className={styles.listToolbar}>
          <p className={styles.resultCount}>
            Showing result 1 - 20 of {TOTAL_OBJECTIVES} total
          </p>
          <Pagination page={page} pageSize={20} total={TOTAL_OBJECTIVES} onPageChange={setPage} compact />
        </div>

        <div className={styles.contentShell}>
          {!outlineOpen && (
            <CourseOutlinePanel
              open={false}
              onToggle={() => setOutlineOpen(true)}
              selectedUnitId={selectedUnitId}
              onSelectUnit={handleSelectUnit}
            />
          )}

          <div className={styles.listRow}>
            {outlineOpen && (
              <CourseOutlinePanel
                open
                onToggle={() => setOutlineOpen(false)}
                selectedUnitId={selectedUnitId}
                onSelectUnit={handleSelectUnit}
              />
            )}

            <div className={styles.listColumn}>
              <section className={styles.listSection} aria-label="Learning objectives">
                {displayList.length === 0 ? (
                  <div className={styles.emptyState} role="status">
                    <p className={styles.emptyTitle}>No objectives found</p>
                    <p className={styles.emptyText}>
                      {selectedUnitId
                        ? "No objectives are linked to this unit yet."
                        : search.trim()
                          ? "Try a different search term."
                          : "No objectives match your filters."}
                    </p>
                  </div>
                ) : (
                  <ul className={styles.objectiveList}>
                    {displayList.map((objective) => (
                      <li key={objective.id}>
                        <ObjectiveCard
                          objective={objective}
                          expanded={expandedId === objective.id}
                          highlighted={highlightedObjectiveId === objective.id}
                          onToggle={() => toggleExpanded(objective.id)}
                          onSelectContent={handleSelectContent}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
