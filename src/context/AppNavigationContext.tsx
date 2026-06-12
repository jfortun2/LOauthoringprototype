import { createContext, useContext, useState, type ReactNode } from "react";
import type { AppPage } from "../data/navigation";

type AppNavigationContextValue = {
  page: AppPage;
  setPage: (page: AppPage) => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<AppPage>("objectives");

  return (
    <AppNavigationContext.Provider value={{ page, setPage }}>
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
