import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header} data-node-id="2:1834">
      <div className={styles.logoArea}>
        <img
          className={styles.logo}
          src="/assets/oli-torus-logo.png"
          alt="OLI Torus"
          data-node-id="2:1836"
        />
      </div>
      <div className={styles.titleArea}>
        <h1 className={styles.courseTitle} data-node-id="2:1840">
          Gardening 101
        </h1>
        <button
          type="button"
          className={styles.avatarButton}
          aria-label="Jessica Fortunato user account menu"
          data-node-id="2:1844"
        >
          JF
        </button>
      </div>
    </header>
  );
}
