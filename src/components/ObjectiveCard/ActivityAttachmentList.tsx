import type { SubObjectiveActivity } from "../../data/types";
import { IconClipboardList, IconFlag } from "../icons/Icons";
import styles from "./ActivityAttachmentList.module.css";

type ActivityAttachmentListProps = {
  activities: SubObjectiveActivity[];
};

export function ActivityAttachmentList({ activities }: ActivityAttachmentListProps) {
  if (activities.length === 0) return null;

  return (
    <ul className={styles.list} aria-label="Linked activities">
      {activities.map((activity) => (
        <li key={activity.id}>
          <div className={styles.row}>
            <span
              className={`${styles.iconPill} ${
                activity.type === "formative" ? styles.iconPillFormative : styles.iconPillSummative
              }`}
              aria-hidden
            >
              {activity.type === "formative" ? <IconClipboardList /> : <IconFlag />}
            </span>
            <span className={styles.title}>{activity.title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
