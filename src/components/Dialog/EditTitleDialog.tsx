import { useEffect, useId, useState } from "react";
import styles from "./Dialog.module.css";

type EditTitleDialogProps = {
  open: boolean;
  title: string;
  label: string;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
};

export function EditTitleDialog({
  open,
  title,
  label,
  initialValue,
  onSave,
  onCancel,
}: EditTitleDialogProps) {
  const fieldId = useId();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  const trimmed = value.trim();
  const canSave = trimmed.length > 0 && trimmed !== initialValue.trim();

  return (
    <div className={styles.backdrop} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${fieldId}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.dialogTitle} id={`${fieldId}-title`}>
          {title}
        </h2>
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
        <textarea
          id={fieldId}
          className={styles.textarea}
          value={value}
          rows={3}
          autoFocus
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onCancel();
          }}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={!canSave}
            onClick={() => onSave(trimmed)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
