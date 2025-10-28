import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FavoritesPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Heart size={64} className="text-primary mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">{t('navigation.favorites')}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        您收藏的内容将显示在这里。
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Heart size={20} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{t('favorites.title')} {item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}