import type { LearningObjective } from "../../data/types";
import {
  getStrictObjectiveView,
  getStrictSubView,
} from "../../utils/objectiveMappingViews";
import {
  ActivityStatus,
  AttentionList,
  MappingDetailShell,
  MappingEmpty,
  MappingLinkRow,
  MappingSection,
  MappingSummary,
} from "./MappingPrimitives";
import styles from "./MappingPrimitives.module.css";

type StrictHierarchyObjectiveDetailProps = {
  objective: LearningObjective;
  selectedSubId: string | null;
  onSelectSub: (subId: string | null) => void;
  onSelectContent?: (contentId: string) => void;
};

export function StrictHierarchyObjectiveDetail({
  objective,
  selectedSubId,
  onSelectSub,
  onSelectContent,
}: StrictHierarchyObjectiveDetailProps) {
  const view = getStrictObjectiveView(objective);
  const selectedSub = selectedSubId ? getStrictSubView(objective, selectedSubId) : null;

  return (
    <MappingDetailShell
      modelLabel="Version 1 · Strict hierarchy"
      modelHint="The learning objective is a container. Pages and activities are mapped through sub-objectives."
    >
      <MappingSummary
        items={[
          { label: "Sub-objectives", value: String(objective.subObjectives.length) },
          { label: "Pages linked", value: String(view.totalPages) },
          { label: "Activities linked", value: String(view.totalActivities) },
        ]}
      />

      <MappingSection
        id={`${objective.id}-relationships`}
        title="Relationships"
        description="Sub-objectives structure this learning objective. Select one to inspect its links."
      >
        {objective.subObjectives.length === 0 ? (
          <MappingEmpty message="No sub-objectives defined" />
        ) : (
          <ul className={styles.subNavList}>
            {view.subObjectives.map(({ sub, status }, index) => (
              <li key={sub.id} className={styles.subNavItem}>
                <button
                  type="button"
                  className={`${styles.subNavBtn} ${selectedSubId === sub.id ? styles.subNavBtnActive : ""}`}
                  onClick={() => onSelectSub(selectedSubId === sub.id ? null : sub.id)}
                  aria-expanded={selectedSubId === sub.id}
                >
                  <span className={styles.subNavIndex}>Sub {index + 1}</span>
                  <span className={styles.subNavTitle}>{sub.title}</span>
                  <ActivityStatus
                    formativeCount={status.formativeCount}
                    summativeCount={status.summativeCount}
                    missingFormative={status.missingFormative}
                    missingSummative={status.missingSummative}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </MappingSection>

      {selectedSub && (
        <div className={styles.subDetail}>
          <button type="button" className={styles.backBtn} onClick={() => onSelectSub(null)}>
            ← Back to objective overview
          </button>
          <p className={styles.parentCrumb}>
            Parent learning objective · <strong>LO {objective.id}</strong>
          </p>
          <h5 className={styles.subDetailTitle}>{selectedSub.sub.title}</h5>

          <MappingSection
            id={`${selectedSub.sub.id}-pages`}
            title="Linked pages"
            description="Pages mapped to this sub-objective, including inherited parent links."
          >
            <div className={styles.nestedBlock}>
              <p className={styles.nestedBlockTitle}>Directly linked to this sub-objective</p>
              {selectedSub.directPages.length === 0 ? (
                <MappingEmpty message="No pages directly linked to this sub-objective" />
              ) : (
                <div className={styles.linkListWrap}>
                  {selectedSub.directPages.map((page) => (
                    <MappingLinkRow
                      key={page.id}
                      title={page.title}
                      meta={page.path}
                      sourceLabel="Directly linked to this sub-objective"
                      sourceVariant="direct"
                      onClick={() => onSelectContent?.(page.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedSub.inheritedPages.length > 0 && (
              <div className={styles.nestedBlock}>
                <p className={styles.nestedBlockTitle}>Inherited from parent objective</p>
                <div className={styles.linkListWrap}>
                  {selectedSub.inheritedPages.map((page) => (
                    <MappingLinkRow
                      key={`inherited-${page.id}`}
                      title={page.title}
                      meta={page.path}
                      sourceLabel="Inherited from parent objective"
                      sourceVariant="inherited"
                      onClick={() => onSelectContent?.(page.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${selectedSub.sub.id}-activities`}
            title="Linked activities"
            description="Scored pages and practice activities mapped to this sub-objective."
          >
            <div className={styles.nestedBlock}>
              <p className={styles.nestedBlockTitle}>Directly linked to this sub-objective</p>
              {selectedSub.directActivities.length === 0 ? (
                <MappingEmpty message="No linked activities" />
              ) : (
                <div className={styles.linkListWrap}>
                  {selectedSub.directActivities.map((activity) => (
                    <MappingLinkRow
                      key={activity.id}
                      title={activity.title}
                      meta={activity.type}
                      sourceLabel="Directly linked to this sub-objective"
                      sourceVariant="direct"
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedSub.inheritedActivities.length > 0 && (
              <div className={styles.nestedBlock}>
                <p className={styles.nestedBlockTitle}>Inherited from parent objective</p>
                <div className={styles.linkListWrap}>
                  {selectedSub.inheritedActivities.map((activity) => (
                    <MappingLinkRow
                      key={`inherited-${activity.id}`}
                      title={activity.title}
                      meta={activity.type}
                      sourceLabel="Inherited from parent objective"
                      sourceVariant="inherited"
                    />
                  ))}
                </div>
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${selectedSub.sub.id}-status`}
            title="Activity coverage"
            description="Whether this sub-objective has enough linked activities."
          >
            <ActivityStatus
              formativeCount={selectedSub.status.formativeCount}
              summativeCount={selectedSub.status.summativeCount}
              missingFormative={selectedSub.status.missingFormative}
              missingSummative={selectedSub.status.missingSummative}
            />
          </MappingSection>
        </div>
      )}

      <MappingSection
        id={`${objective.id}-attention`}
        title="Missing links"
        description="Actionable gaps in mappings for this learning objective."
      >
        <AttentionList items={view.attention} />
      </MappingSection>
    </MappingDetailShell>
  );
}
