import { IconPencil, IconTrash } from "../icons/Icons";
import styles from "./ObjectiveActions.module.css";

type ObjectiveActionsProps = {
  onEdit: () => void;
  onRemove: () => void;
  editLabel: string;
  removeLabel: string;
};

export function ObjectiveActions({
  onEdit,
  onRemove,
  editLabel,
  removeLabel,
}: ObjectiveActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={editLabel}
        title={editLabel}
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
      >
        <IconPencil className={styles.icon} />
      </button>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
        aria-label={removeLabel}
        title={removeLabel}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <IconTrash className={styles.icon} />
      </button>
    </div>
  );
}
