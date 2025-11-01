import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.tsx'
import { QueryProvider } from './lib/queryClient'
import initI18n from './lib/i18nConfig'
import LoadingScreen from './components/LoadingScreen'
import niceModal from '@ebay/nice-modal-react'

// 创建根元素
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)


function AppWithI18nLoading() {
  const [isI18nLoading, setIsI18nLoading] = React.useState(true)
  const [i18nError, setI18nError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    initI18n()
      .then(() => {
        setIsI18nLoading(false)
      })
      .catch((error) => {
        console.error('Failed to initialize i18n:', error)
        setI18nError(error)
        setIsI18nLoading(false)
      })
  }, [])

  // 显示加载屏幕
  if (isI18nLoading) {
    return <LoadingScreen />
  }

  // 如果有错误，显示错误信息但仍然渲染应用
  if (i18nError) {
    console.error('i18n initialization failed, but continuing with app:', i18nError)
  }

  return (
    <StrictMode>
      <niceModal.Provider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </niceModal.Provider>
    </StrictMode>
  )
}

// 渲染应用
root.render(<AppWithI18nLoading />)
