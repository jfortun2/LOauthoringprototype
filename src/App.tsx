import { AppShell } from "./components/AppShell/AppShell";
import { AppNavigationProvider, useAppNavigation } from "./context/AppNavigationContext";
import { CurriculumPage } from "./pages/CurriculumPage/CurriculumPage";
import { InsightsPage } from "./pages/InsightsPage/InsightsPage";
import { LearningObjectivesPage } from "./pages/LearningObjectivesPage/LearningObjectivesPage";

function AppContent() {
  const { page } = useAppNavigation();

  if (page === "curriculum") {
    return <CurriculumPage />;
  }

  if (page === "insights") {
    return <InsightsPage />;
  }

  return <LearningObjectivesPage />;
}

export default function App() {
  return (
    <AppNavigationProvider>
      <AppShell>
        <AppContent />
      </AppShell>
    </AppNavigationProvider>
  );
}
