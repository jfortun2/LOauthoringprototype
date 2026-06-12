import { IconChevronDown } from "../icons/Icons";
import styles from "./RowExpandChevron.module.css";

type RowExpandChevronProps = {
  expanded: boolean;
  onClick: () => void;
  label: string;
};

export function RowExpandChevron({ expanded, onClick, label }: RowExpandChevronProps) {
  return (
    <button
      type="button"
      className={styles.expandBtn}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-expanded={expanded}
      aria-label={label}
    >
      <IconChevronDown
        className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ""}`}
      />
    </button>
  );
}
