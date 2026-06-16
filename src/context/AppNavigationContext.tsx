import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { AppPage, InsightsFilter } from "../data/navigation";

type AppNavigationContextValue = {
  page: AppPage;
  setPage: (page: AppPage) => void;
  insightsFilter: InsightsFilter;
  openInsights: (objectiveId?: string) => void;
  clearInsightsFilter: () => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<AppPage>("objectives");
  const [insightsFilter, setInsightsFilter] = useState<InsightsFilter>({ objectiveId: null });

  const openInsights = useCallback((objectiveId?: string) => {
    setInsightsFilter({ objectiveId: objectiveId ?? null });
    setPage("insights");
  }, []);

  const clearInsightsFilter = useCallback(() => {
    setInsightsFilter({ objectiveId: null });
  }, []);

  return (
    <AppNavigationContext.Provider
      value={{ page, setPage, insightsFilter, openInsights, clearInsightsFilter }}
    >
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const value = useContext(AppNavigationContext);
  if (!value) {
    throw new Error("useAppNavigation must be used within AppNavigationProvider");
  }
  return value;
}
