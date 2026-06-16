import type { ReactNode } from "react";
import { LayoutProvider, useLayout } from "../../context/LayoutContext";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const { workspaceCollapsed, toggleWorkspace } = useLayout();

  return (
    <div
      className={`${styles.shell} ${workspaceCollapsed ? styles.shellWorkspaceCollapsed : ""}`}
      data-workspace-collapsed={workspaceCollapsed}
    >
      <Sidebar />
      <div className={styles.mainColumn}>
        <Header />
        {workspaceCollapsed && (
          <button
            type="button"
            className={styles.workspaceExpandTab}
            onClick={toggleWorkspace}
            aria-label="Expand workspace navigation"
            title="Expand workspace"
          >
            › Workspace
          </button>
        )}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <LayoutProvider>
      <AppShellInner>{children}</AppShellInner>
    </LayoutProvider>
  );
}
