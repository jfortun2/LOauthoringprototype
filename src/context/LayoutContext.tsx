import { createContext, useContext, useState, type ReactNode } from "react";

type LayoutContextValue = {
  workspaceCollapsed: boolean;
  toggleWorkspace: () => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        workspaceCollapsed,
        toggleWorkspace: () => setWorkspaceCollapsed((c) => !c),
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
