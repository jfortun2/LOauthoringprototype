import { useEffect, useId, useState } from "react";
import type { SubObjectiveActivity } from "../../data/types";
import { defaultActivityTab } from "../../utils/subObjectiveActivities";
import { IconClipboardList, IconFlag } from "../icons/Icons";
import styles from "./SubObjectiveActivities.module.css";

type ActivityTab = "formative" | "summative";

type SubObjectiveActivitiesProps = {
  activities: SubObjectiveActivity[];
  subObjectiveId: string;
};

export function SubObjectiveActivities({ activities, subObjectiveId }: SubObjectiveActivitiesProps) {
  const baseId = useId();
  const formative = activities.filter((a) => a.type === "formative");
  const summative = activities.filter((a) => a.type === "summative");
  const [tab, setTab] = useState<ActivityTab>(() => defaultActivityTab(activities));

  useEffect(() => {
    setTab(defaultActivityTab(activities));
  }, [subObjectiveId, activities]);

  const visible = tab === "formative" ? formative : summative;
  const panelId = `${baseId}-panel`;

  return (
    <div className={styles.activityPanel}>
      <div role="tablist" aria-label="Filter activities by type" className={styles.tabList}>
        <button
          type="button"
          role="tab"
          id={`${baseId}-formative`}
          aria-selected={tab === "formative"}
          aria-controls={panelId}
          className={`${styles.tab} ${styles.tabFormative} ${tab === "formative" ? styles.tabActive : ""}`}
          onClick={() => setTab("formative")}
        >
          <IconClipboardList className={styles.tabIcon} />
          Formative
          <span className={styles.tabCount}>{formative.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          id={`${baseId}-summative`}
          aria-selected={tab === "summative"}
          aria-controls={panelId}
          className={`${styles.tab} ${styles.tabSummative} ${tab === "summative" ? styles.tabActive : ""}`}
          onClick={() => setTab("summative")}
        >
          <IconFlag className={styles.tabIcon} />
          Summative
          <span className={styles.tabCount}>{summative.length}</span>
        </button>
      </div>

      <div className={styles.listWrap}>
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tab === "formative" ? `${baseId}-formative` : `${baseId}-summative`}
        >
          {visible.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden>
                {tab === "formative" ? <IconClipboardList /> : <IconFlag />}
              </span>
              <p className={styles.emptyTitle}>
                No {tab === "formative" ? "formative" : "summative"} activities
              </p>
              <p className={styles.emptyText}>
                {tab === "formative"
                  ? "Practice checks and low-stakes activities linked to this sub-objective will appear here."
                  : "Quizzes and graded assignments linked to this sub-objective will appear here."}
              </p>
            </div>
          ) : (
            <ul className={styles.activityList}>
              {visible.map((activity) => (
                <li key={activity.id}>
                  <button
                    type="button"
                    className={`${styles.activityItem} ${
                      activity.type === "formative"
                        ? styles.activityItemFormative
                        : styles.activityItemSummative
                    }`}
                  >
                    <span
                      className={`${styles.activityIconWrap} ${
                        activity.type === "formative"
                          ? styles.activityIconFormative
                          : styles.activityIconSummative
                      }`}
                      aria-hidden
                    >
                      {activity.type === "formative" ? (
                        <IconClipboardList />
                      ) : (
                        <IconFlag />
                      )}
                    </span>
                    <span className={styles.activityBody}>
                      <span className={styles.activityTitle}>{activity.title}</span>
                      <span className={styles.activityMeta}>
                        {activity.type === "formative" ? "Practice activity" : "Graded assignment"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
