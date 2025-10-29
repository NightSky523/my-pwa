import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";
import LanguageLoadingWrapper from "./components/LanguageLoadingWrapper";

function App() {
  return (
    <LanguageLoadingWrapper>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </LanguageLoadingWrapper>
  );
}

export default App;