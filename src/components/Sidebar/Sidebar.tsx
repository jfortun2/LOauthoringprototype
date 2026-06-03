import { useLayout } from "../../context/LayoutContext";
import { COURSE_TITLE_SHORT } from "../../data/courseUnits";
import { IconChevronLeft } from "../icons/Icons";
import styles from "./Sidebar.module.css";

function NavIconBook() {
  return (
    <span className={styles.navIcon} aria-hidden>
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <path d="M2 3h7v18H2V3zm9 0h7v18h-7V3z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

function NavIconChalkboard() {
  return (
    <span className={styles.navIcon} aria-hidden>
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <rect x="1" y="3" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 19h8M10 15v4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

function NavIconGraduate() {
  return (
    <span className={styles.navIcon} aria-hidden>
      <svg width="20" height="27" viewBox="0 0 20 27" fill="none">
        <path d="M10 2 1 8l9 6 9-6-9-6z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 11v6c0 2 2.7 4 6 4s6-2 6-4v-6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

export function Sidebar() {
  const { workspaceCollapsed, toggleWorkspace } = useLayout();

  return (
    <aside
      className={`${styles.sidebar} ${workspaceCollapsed ? styles.sidebarCollapsed : ""}`}
      aria-hidden={workspaceCollapsed}
    >
      <div className={styles.logoBar}>
        <img
          className={styles.logo}
          src="/assets/oli-torus-logo.png"
          alt="OLI Torus"
        />
      </div>

      <div className={styles.minimizeWrap}>
        <button
          type="button"
          className={styles.minimizeBtn}
          onClick={toggleWorkspace}
          aria-label="Collapse workspace navigation"
          title="Collapse workspace"
        >
          <IconChevronLeft />
        </button>
      </div>

      <div className={styles.scroll}>
        <p className={styles.sectionLabel}>Workspace</p>
        <nav className={styles.workspace} aria-label="Workspace roles">
          <button type="button" className={`${styles.navItem} ${styles.navItemActive}`}>
            <NavIconBook />
            Course Author
          </button>
          <button type="button" className={styles.navItem}>
            <NavIconChalkboard />
            Instructor
          </button>
          <button type="button" className={styles.navItem}>
            <NavIconGraduate />
            Student
          </button>
        </nav>

        <p className={styles.courseName}>{COURSE_TITLE_SHORT}</p>

        <nav className={styles.navGroup} aria-label="Course navigation">
          <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`}>
            <span className={styles.navIcon}>
              <svg width="19" height="17" viewBox="0 0 19 17" fill="none">
                <path d="M1 8h17M1 1h17M1 15h10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            Overview
          </button>

          <div>
            <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`}>
              <span className={styles.navIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              Create
              <span className={styles.chevron}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </button>
            <div className={styles.submenu}>
              <button type="button" className={`${styles.submenuItem} ${styles.submenuItemActive}`}>
                Objectives
              </button>
              <button type="button" className={styles.submenuItem}>
                Activity Bank
              </button>
              <button type="button" className={styles.submenuItem}>
                Experiments
              </button>
              <button type="button" className={styles.submenuItem}>
                Bibliography
              </button>
              <button type="button" className={styles.submenuItem}>
                Curriculum
              </button>
              <button type="button" className={styles.submenuItem}>
                All Pages
              </button>
              <button type="button" className={styles.submenuItem}>
                All Activities
              </button>
            </div>
          </div>

          <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`}>
            <span className={styles.navIcon}>
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M3 10h14v8H3v-8zM7 3h6v7H7V3z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            Publish
            <span className={styles.chevron}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(-90deg)" }}>
                <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </button>

          <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`}>
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 16l4-8 4 4 4-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            Improve
            <span className={styles.chevron}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(-90deg)" }}>
                <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </button>
        </nav>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.supportBtn}>
          <span className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 13v-1M9 6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          Support
        </button>
        <button type="button" className={styles.exitBtn}>
          <span className={styles.navIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H2v12h4M11 8H6M13 8l-3-3M13 8l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          Exit Project
        </button>
      </div>
    </aside>
  );
}
