import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './components/LanguageSelector'

export function ProfilePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <User size={64} className="text-primary mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">{t('profile.title')}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        这里是您的个人资料页面。
      </p>
      <div className="mt-6 w-full max-w-md space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">个人信息</h3>
          <p className="text-sm text-muted-foreground">用户名：用户</p>
          <p className="text-sm text-muted-foreground">邮箱：user@example.com</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">{t('profile.settings')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('profile.language')}
              </label>
              <LanguageSelector />
            </div>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground">
                {t('profile.theme')}
              </button>
              <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground">
                {t('profile.notifications')}
              </button>
              <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground">
                {t('profile.about')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}