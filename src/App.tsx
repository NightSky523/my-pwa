import { Outlet } from "react-router-dom";
import LanguageLoadingWrapper from "./components/LanguageLoadingWrapper";

function App() {
  return (
    <LanguageLoadingWrapper>
      <div className="h-screen bg-background flex flex-col">
        <Outlet />
      </div>
    </LanguageLoadingWrapper>
  );
}

export default App;