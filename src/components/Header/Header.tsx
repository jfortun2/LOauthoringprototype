import { COURSE_TITLE } from "../../data/courseUnits";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.courseTitle}>{COURSE_TITLE}</h1>
        <button
          type="button"
          className={styles.avatarButton}
          aria-label="Jessica Fortunato user account menu"
        >
          <span className={styles.avatarInitials}>JF</span>
        </button>
      </div>
    </header>
  );
}
