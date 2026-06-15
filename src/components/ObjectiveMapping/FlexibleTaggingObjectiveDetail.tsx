import type { LearningObjective } from "../../data/types";
import {
  getFlexibleObjectiveView,
  getFlexibleSubView,
  sourceLabel,
  viaSubLabel,
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

type FlexibleTaggingObjectiveDetailProps = {
  objective: LearningObjective;
  selectedSubId: string | null;
  onSelectSub: (subId: string | null) => void;
  onSelectContent?: (contentId: string) => void;
};

export function FlexibleTaggingObjectiveDetail({
  objective,
  selectedSubId,
  onSelectSub,
  onSelectContent,
}: FlexibleTaggingObjectiveDetailProps) {
  const view = getFlexibleObjectiveView(objective);
  const selectedSub = selectedSubId ? getFlexibleSubView(objective, selectedSubId) : null;

  const directPageCount = view.directPages.length;
  const viaSubPageCount = view.pagesViaSubs.length;
  const directActivityCount = view.directActivities.length;
  const viaSubActivityCount = view.activitiesViaSubs.length;

  return (
    <MappingDetailShell
      modelLabel="Version 2 · Flexible tagging"
      modelHint="Learning objectives and sub-objectives are both mapping targets. Direct and indirect links are shown separately."
    >
      <MappingSummary
        items={[
          { label: "Direct pages", value: String(directPageCount) },
          { label: "Pages via sub-objectives", value: String(viaSubPageCount) },
          { label: "Direct activities", value: String(directActivityCount) },
          { label: "Activities via sub-objectives", value: String(viaSubActivityCount) },
        ]}
      />

      {!selectedSub && (
        <>
          <MappingSection
            id={`${objective.id}-direct-pages`}
            title="Directly linked pages"
            description="Pages tagged directly to this learning objective."
          >
            {view.directPages.length === 0 ? (
              <MappingEmpty message="No pages directly linked to this learning objective" />
            ) : (
              <div className={styles.linkListWrap}>
                {view.directPages.map((page) => (
                  <MappingLinkRow
                    key={page.id}
                    title={page.title}
                    meta={page.path}
                    sourceLabel={sourceLabel(page.source, "flexible")}
                    sourceVariant="direct"
                    onClick={() => onSelectContent?.(page.id)}
                  />
                ))}
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${objective.id}-direct-activities`}
            title="Directly linked activities"
            description="Activities tagged directly to this learning objective."
          >
            {view.directActivities.length === 0 ? (
              <MappingEmpty message="No activities directly linked to this learning objective" />
            ) : (
              <div className={styles.linkListWrap}>
                {view.directActivities.map((activity) => (
                  <MappingLinkRow
                    key={activity.id}
                    title={activity.title}
                    meta={activity.type}
                    sourceLabel={sourceLabel(activity.source, "flexible")}
                    sourceVariant="direct"
                  />
                ))}
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${objective.id}-via-pages`}
            title="Pages linked through sub-objectives"
            description="Pages that support this objective because they are tagged to a sub-objective."
          >
            {view.pagesViaSubs.length === 0 ? (
              <MappingEmpty message="No pages linked through sub-objectives" />
            ) : (
              <div className={styles.linkListWrap}>
                {view.pagesViaSubs.map((page) => (
                  <MappingLinkRow
                    key={`${page.source.kind === "direct-sub" ? page.source.subObjectiveId : page.id}-${page.id}`}
                    title={page.title}
                    meta={page.path}
                    sourceLabel={
                      page.source.kind === "direct-sub"
                        ? viaSubLabel(page.source.subTitle)
                        : sourceLabel(page.source, "flexible")
                    }
                    sourceVariant="indirect"
                    onClick={() => onSelectContent?.(page.id)}
                  />
                ))}
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${objective.id}-via-activities`}
            title="Activities linked through sub-objectives"
            description="Activities that support this objective because they are tagged to a sub-objective."
          >
            {view.activitiesViaSubs.length === 0 ? (
              <MappingEmpty message="No activities linked through sub-objectives" />
            ) : (
              <div className={styles.linkListWrap}>
                {view.activitiesViaSubs.map((activity) => (
                  <MappingLinkRow
                    key={activity.id}
                    title={activity.title}
                    meta={activity.type}
                    sourceLabel={
                      activity.source.kind === "direct-sub"
                        ? viaSubLabel(activity.source.subTitle)
                        : sourceLabel(activity.source, "flexible")
                    }
                    sourceVariant="indirect"
                  />
                ))}
              </div>
            )}
          </MappingSection>

          <MappingSection
            id={`${objective.id}-subs`}
            title="Sub-objectives"
            description="Each sub-objective can also be tagged directly. Select one to inspect its own links."
          >
            {objective.subObjectives.length === 0 ? (
              <MappingEmpty message="No sub-objectives defined" />
            ) : (
              <ul className={styles.subNavList}>
                {objective.subObjectives.map((sub, index) => {
                  const status = {
                    formativeCount: sub.formativeCount,
                    summativeCount: sub.summativeCount,
                    missingFormative: sub.formativeCount < 3,
                    missingSummative: sub.summativeCount < 3,
                  };
                  return (
                    <li key={sub.id} className={styles.subNavItem}>
                      <button
                        type="button"
                        className={styles.subNavBtn}
                        onClick={() => onSelectSub(sub.id)}
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
                  );
                })}
              </ul>
            )}
          </MappingSection>
        </>
      )}

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
            id={`${selectedSub.sub.id}-direct-pages`}
            title="Directly linked pages"
          >
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
          </MappingSection>

          <MappingSection
            id={`${selectedSub.sub.id}-direct-activities`}
            title="Directly linked activities"
          >
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
          </MappingSection>

          <MappingSection id={`${selectedSub.sub.id}-status`} title="Activity coverage">
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
