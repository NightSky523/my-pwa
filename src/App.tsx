import { Outlet } from "react-router-dom";
import LanguageLoadingWrapper from "./components/LanguageLoadingWrapper";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <LanguageLoadingWrapper>
        <div className="h-screen bg-background flex flex-col overflow-hidden pt-10 ">
          <Outlet />
        </div>
      </LanguageLoadingWrapper>
    </ThemeProvider>
  );
}

export default App;