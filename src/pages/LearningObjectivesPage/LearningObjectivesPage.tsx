import { useCallback, useMemo, useState } from "react";
import { ContentObjectivesPanel } from "../../components/ContentObjectivesPanel/ContentObjectivesPanel";
import { CourseOutlinePanel } from "../../components/CourseOutlinePanel/CourseOutlinePanel";
import { ObjectiveCard } from "../../components/ObjectiveCard/ObjectiveCard";
import { Pagination } from "../../components/Pagination/Pagination";
import { IconExternalLink, IconSearch } from "../../components/icons/Icons";
import {
  COURSE_ORGANIZATION,
  TOTAL_OBJECTIVES,
  objectives,
} from "../../data/objectives";
import type { ContentNode } from "../../data/types";
import { getContentById, getObjectivesForContent } from "../../utils/mappings";
import styles from "./LearningObjectivesPage.module.css";

function matchesSearch(objective: { id: string; title: string }, search: string, showIds: boolean) {
  const q = search.toLowerCase().trim();
  if (!q) return true;
  const haystack = showIds ? `${objective.id} ${objective.title}` : objective.title;
  return haystack.toLowerCase().includes(q);
}

export function LearningObjectivesPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState<ContentNode | null>(null);
  const [highlightedObjectiveId, setHighlightedObjectiveId] = useState<string | null>(
    null,
  );
  const [showIds, setShowIds] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const filtered = useMemo(
    () => objectives.filter((o) => matchesSearch(o, search, showIds)),
    [search, showIds],
  );

  const contentLinkedObjectives = useMemo(() => {
    if (!selectedContent) return [];
    return getObjectivesForContent(selectedContent.id, objectives).filter((o) =>
      matchesSearch(o, search, showIds),
    );
  }, [selectedContent, search, showIds]);

  const displayList = useMemo(() => {
    if (!selectedContent) return filtered;
    return contentLinkedObjectives;
  }, [selectedContent, filtered, contentLinkedObjectives]);

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
    setHighlightedObjectiveId(id);
  };

  const handleSelectContent = useCallback((node: ContentNode) => {
    setSelectedContent(node);
    const linked = getObjectivesForContent(node.id, objectives);
    if (linked.length === 1) {
      setExpandedId(linked[0].id);
      setHighlightedObjectiveId(linked[0].id);
    }
  }, []);

  const handleSelectObjectiveFromContent = (id: string) => {
    setExpandedId(id);
    setHighlightedObjectiveId(id);
    document
      .getElementById(`objective-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const clearContentSelection = () => {
    setSelectedContent(null);
    setHighlightedObjectiveId(null);
  };

  return (
    <div className={styles.pageLayout}>
      <CourseOutlinePanel
        open={outlineOpen}
        onToggle={() => setOutlineOpen((o) => !o)}
        selectedContentId={selectedContent?.id ?? null}
        onSelectContent={handleSelectContent}
      />

      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <h1 className={styles.heading}>Learning Objectives</h1>
            <p className={styles.lead}>
              Each objective shows linked pages, assessments, coverage, and mastery. Use the
              course content tab on the left to map objectives from a page or activity.
            </p>
            <p className={styles.orgNote}>
              Metrics for organization: <strong>{COURSE_ORGANIZATION}</strong>
            </p>
          </header>

          <div className={styles.toolbar}>
            <fieldset className={styles.fieldGroup}>
              <legend className={styles.legend}>Find objectives</legend>
              <div className={styles.searchWrap}>
                <IconSearch className={styles.searchIcon} />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search objectives…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search learning objectives"
                />
                {search && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className={styles.fieldGroup}>
              <legend className={styles.legend}>Add objective</legend>
              <div className={styles.createRow}>
                <input
                  type="text"
                  className={styles.newObjectiveInput}
                  placeholder="New learning objective"
                  aria-label="New learning objective title"
                />
                <button type="button" className={styles.btnCreate}>
                  Create
                </button>
              </div>
            </fieldset>
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showIds}
                onChange={(e) => setShowIds(e.target.checked)}
              />
              Show objective IDs
            </label>
            <a
              href="https://www.cmu.edu/teaching/designteach/design/learningobjectives.html"
              className={styles.helpLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              CMU guide on learning objectives
              <IconExternalLink />
            </a>
          </div>

          <section className={styles.listSection} aria-label="Learning objectives">
            {selectedContent && (
              <ContentObjectivesPanel
                content={selectedContent}
                linkedObjectives={contentLinkedObjectives}
                activeObjectiveId={highlightedObjectiveId}
                onSelectObjective={handleSelectObjectiveFromContent}
                onClose={clearContentSelection}
              />
            )}

            <div className={styles.listHeader}>
              <p className={styles.resultCount}>
                {displayList.length} shown
                {search.trim() ? ` matching “${search.trim()}”` : ""}
                {selectedContent ? ` for “${selectedContent.title}”` : " (all objectives)"}
              </p>
              <Pagination
                page={page}
                pageSize={20}
                total={TOTAL_OBJECTIVES}
                onPageChange={setPage}
                compact
              />
            </div>

            {displayList.length === 0 ? (
              <div className={styles.emptyState} role="status">
                <p className={styles.emptyTitle}>No objectives found</p>
                <p className={styles.emptyText}>
                  {selectedContent
                    ? "No objectives are linked to this content yet."
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
                      objective={{
                        ...objective,
                        title: showIds
                          ? `[${objective.id}] ${objective.title}`
                          : objective.title,
                      }}
                      expanded={expandedId === objective.id}
                      highlighted={highlightedObjectiveId === objective.id}
                      onToggle={() => toggleExpanded(objective.id)}
                      onSelectContent={(contentId) => {
                        const node = getContentById(contentId);
                        if (node) {
                          setOutlineOpen(true);
                          handleSelectContent(node);
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
