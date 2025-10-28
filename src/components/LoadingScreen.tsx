import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isI18nReady } from '../lib/i18nConfig'

export default function LoadingScreen() {

  const shouldUseTranslation = isI18nReady();
  const { t, ready } = shouldUseTranslation ? useTranslation() : { t: (key: string) => key, ready: false };
  

  const displayMessage = !ready ? 'Loading...' : (t('common.loading') || 'Loading...');

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">{displayMessage}</p>
    </div>
  )
}