import { Outlet } from "react-router-dom";
import LanguageLoadingWrapper from "./components/LanguageLoadingWrapper";

function App() {
  return (
    <LanguageLoadingWrapper>
      <div className="h-screen bg-background flex flex-col overflow-hidden pt-10 ">
        <Outlet />
      </div>
    </LanguageLoadingWrapper>
  );
}

export default App;