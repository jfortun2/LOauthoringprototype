import { useCallback, useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/Dialog/ConfirmDialog";
import { EditTitleDialog } from "../../components/Dialog/EditTitleDialog";
import { CourseOutlinePanel } from "../../components/CourseOutlinePanel/CourseOutlinePanel";
import { ObjectiveCard } from "../../components/ObjectiveCard/ObjectiveCard";
import {
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconSort,
} from "../../components/icons/Icons";
import { courseUnits } from "../../data/courseUnits";
import { objectives as initialObjectives } from "../../data/objectives";
import type { LearningObjective } from "../../data/types";
import type { ProductModel } from "../../utils/objectiveMappingViews";
import { hasMissingActivities } from "../../utils/objectiveMappingViews";
import { ProductModelToggle } from "../../components/ObjectiveMapping/ProductModelToggle";
import { getContentById } from "../../utils/mappings";
import styles from "./LearningObjectivesPage.module.css";

function matchesSearch(objective: { id: string; title: string }, search: string) {
  const q = search.toLowerCase().trim();
  if (!q) return true;
  return `${objective.id} ${objective.title}`.toLowerCase().includes(q);
}

type EditTarget = {
  kind: "objective" | "subObjective";
  objectiveId: string;
  subObjectiveId?: string;
  value: string;
};

type RemoveTarget = {
  kind: "objective" | "subObjective";
  objectiveId: string;
  subObjectiveId?: string;
  label: string;
};

export function LearningObjectivesPage() {
  const [objectivesList, setObjectivesList] = useState<LearningObjective[]>(() => initialObjectives);
  const [search, setSearch] = useState("");
  const [missingActivitiesOnly, setMissingActivitiesOnly] = useState(false);
  const [productModel, setProductModel] = useState<ProductModel>("strict");
  const [selectedSubByObjective, setSelectedSubByObjective] = useState<Record<string, string | null>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [highlightedObjectiveId, setHighlightedObjectiveId] = useState<string | null>(null);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const missingActivitiesCount = useMemo(
    () => objectivesList.filter(hasMissingActivities).length,
    [objectivesList],
  );

  const filtered = useMemo(
    () =>
      objectivesList.filter(
        (o) =>
          matchesSearch(o, search) &&
          (!missingActivitiesOnly || hasMissingActivities(o)),
      ),
    [objectivesList, search, missingActivitiesOnly],
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
    if (expandedId === id) {
      setSelectedSubByObjective((current) => ({ ...current, [id]: null }));
    }
  };

  const handleSelectUnit = useCallback((unitId: string) => {
    setSelectedUnitId(unitId);
    setOutlineOpen(true);
  }, []);

  const handleSelectContent = (contentId: string) => {
    const node = getContentById(contentId);
    if (!node) return;
    setOutlineOpen(true);
    const linkedObjective = objectivesList.find(
      (o) =>
        o.linkedPages.some((p) => p.id === contentId) ||
        o.linkedAssessments.some((a) => a.id === contentId),
    );
    if (linkedObjective) {
      const unit = courseUnits.find((u) => u.objectiveIds.includes(linkedObjective.id));
      if (unit) setSelectedUnitId(unit.id);
    }
  };

  const openEditObjective = (objectiveId: string) => {
    const objective = objectivesList.find((o) => o.id === objectiveId);
    if (!objective) return;
    setEditTarget({
      kind: "objective",
      objectiveId,
      value: objective.title,
    });
  };

  const openRemoveObjective = (objectiveId: string) => {
    const objective = objectivesList.find((o) => o.id === objectiveId);
    if (!objective) return;
    setRemoveTarget({
      kind: "objective",
      objectiveId,
      label: objective.title,
    });
  };

  const handleSaveEdit = (value: string) => {
    if (!editTarget) return;

    if (editTarget.kind === "objective") {
      setObjectivesList((current) =>
        current.map((objective) =>
          objective.id === editTarget.objectiveId ? { ...objective, title: value } : objective,
        ),
      );
    } else if (editTarget.subObjectiveId) {
      setObjectivesList((current) =>
        current.map((objective) => {
          if (objective.id !== editTarget.objectiveId) return objective;
          return {
            ...objective,
            subObjectives: objective.subObjectives.map((sub) =>
              sub.id === editTarget.subObjectiveId ? { ...sub, title: value } : sub,
            ),
          };
        }),
      );
    }

    setEditTarget(null);
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;

    if (removeTarget.kind === "objective") {
      setObjectivesList((current) =>
        current.filter((objective) => objective.id !== removeTarget.objectiveId),
      );
      if (expandedId === removeTarget.objectiveId) setExpandedId(null);
      if (highlightedObjectiveId === removeTarget.objectiveId) setHighlightedObjectiveId(null);
    } else if (removeTarget.subObjectiveId) {
      setObjectivesList((current) =>
        current.map((objective) => {
          if (objective.id !== removeTarget.objectiveId) return objective;
          const subObjectives = objective.subObjectives.filter(
            (sub) => sub.id !== removeTarget.subObjectiveId,
          );
          return {
            ...objective,
            subObjectives,
            tagCounts: objective.tagCounts
              ? { ...objective.tagCounts, subObjectives: subObjectives.length }
              : objective.tagCounts,
          };
        }),
      );
    }

    setRemoveTarget(null);
  };

  const editDialogTitle =
    editTarget?.kind === "objective" ? "Edit learning objective" : "Edit sub-objective";
  const editDialogLabel =
    editTarget?.kind === "objective" ? "Objective title" : "Sub-objective title";
  const removeDialogTitle =
    removeTarget?.kind === "objective"
      ? "Remove learning objective?"
      : "Remove sub-objective?";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.heading}>Learning Objectives</h1>
          <p className={styles.lead}>
            Compare two mapping models for learning objectives and sub-objectives. Expand an
            objective to see how pages and activities link in each version.
          </p>
        </header>

        <ProductModelToggle
          value={productModel}
          onChange={(model) => {
            setProductModel(model);
            setSelectedSubByObjective({});
          }}
        />

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
            <button
              type="button"
              className={`${styles.filterPill} ${missingActivitiesOnly ? styles.filterPillActive : ""}`}
              onClick={() => setMissingActivitiesOnly((current) => !current)}
              aria-pressed={missingActivitiesOnly}
            >
              <span className={styles.filterPillDot} aria-hidden />
              Missing activities
              <span className={styles.filterPillCount}>{missingActivitiesCount}</span>
            </button>
          </div>
          <button type="button" className={styles.btnNew}>
            <IconPlus />
            New Objective
          </button>
        </div>

        <div className={styles.listToolbar}>
          <p className={styles.resultCount}>
            {displayList.length} objective{displayList.length === 1 ? "" : "s"}
          </p>
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
                        : missingActivitiesOnly
                          ? "No objectives with missing activity links."
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
                          productModel={productModel}
                          expanded={expandedId === objective.id}
                          highlighted={highlightedObjectiveId === objective.id}
                          selectedSubId={selectedSubByObjective[objective.id] ?? null}
                          onToggle={() => toggleExpanded(objective.id)}
                          onSelectSub={(subId) =>
                            setSelectedSubByObjective((current) => ({
                              ...current,
                              [objective.id]: subId,
                            }))
                          }
                          onSelectContent={handleSelectContent}
                          onEditObjective={openEditObjective}
                          onRemoveObjective={openRemoveObjective}
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

      <EditTitleDialog
        open={editTarget !== null}
        title={editDialogTitle}
        label={editDialogLabel}
        initialValue={editTarget?.value ?? ""}
        onSave={handleSaveEdit}
        onCancel={() => setEditTarget(null)}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        title={removeDialogTitle}
        message={
          removeTarget
            ? `“${removeTarget.label}” will be removed from this prototype session. This cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
