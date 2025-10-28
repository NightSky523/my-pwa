import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './components/BottomNavigation'
import LanguageLoadingWrapper from './components/LanguageLoadingWrapper'

function App() {

  return (
    <LanguageLoadingWrapper>
      <div className="min-h-screen bg-background">
        <main className="pb-20">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </LanguageLoadingWrapper>
  )
}

export default App
