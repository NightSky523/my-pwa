import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.tsx'
import { QueryProvider } from './lib/queryClient'
import initI18n from './lib/i18nConfig'
import LoadingScreen from './components/LoadingScreen'
import NiceModal from '@ebay/nice-modal-react'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)


function AppWithI18nLoading() {
  const [isI18nLoading, setIsI18nLoading] = React.useState(true)

  React.useEffect(() => {
    initI18n()
      .then(() => {
        setIsI18nLoading(false)
      })
      .catch((error) => {
        console.error('Failed to initialize i18n:', error)
        setIsI18nLoading(false)
      })
  }, [])

  if (isI18nLoading) {
    return <LoadingScreen />
  }


  return (
    <StrictMode>
      <NiceModal.Provider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </NiceModal.Provider>
    </StrictMode>
  )
}

root.render(<AppWithI18nLoading />)
