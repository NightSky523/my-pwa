import React, { StrictMode, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.tsx'
import { QueryProvider } from './lib/queryClient'
import initI18n from './lib/i18nConfig'
import LoadingScreen from './components/LoadingScreen'
import NiceModal from '@ebay/nice-modal-react'
import { DocumentContextProvider } from 'yet-another-react-lightbox'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)


function AppWithI18nLoading() {
  const [isI18nLoading, setIsI18nLoading] = React.useState(true)
  const nodeRef = useRef<Node | null>(null)

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
      <DocumentContextProvider nodeRef={nodeRef}>
        <NiceModal.Provider>
          <QueryProvider>
            <RouterProvider router={router} />
          </QueryProvider>
        </NiceModal.Provider>
      </DocumentContextProvider>
    </StrictMode>
  )
}

root.render(<AppWithI18nLoading />)
