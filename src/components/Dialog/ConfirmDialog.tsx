import { useId } from "react";
import styles from "./Dialog.module.css";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Remove",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.dialogTitle} id={titleId}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.btnDanger} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
