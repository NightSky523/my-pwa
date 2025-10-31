import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SearchPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Search size={64} className="text-primary mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">{t('navigation.search')}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        在这里您可以搜索您需要的内容。
      </p>
      <div className="mt-6 w-full max-w-md">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )
}