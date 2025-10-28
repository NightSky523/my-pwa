import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Home size={64} className="text-primary mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">{t('home.title')}</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {t('home.subtitle')}
      </p>
      
      <div className="w-full max-w-md space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">功能特性</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('home.features.offline')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('home.features.installable')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('home.features.responsive')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}