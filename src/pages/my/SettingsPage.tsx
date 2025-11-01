import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector'

export function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center py-4 px-4 border-b border-border">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-background transition-colors"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground ml-4">{t('profile.settings')}</h1>
      </div>

      <div className="flex-1 overflow-auto p-4"> 
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('profile.language')}
          </label>
          <LanguageSelector />
        </div>
        
        {/* 其他设置卡片 */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="space-y-4">
            {/* 主题设置按钮 - 统一按钮样式 */}
            <button 
              className="w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 flex justify-between items-center"
              aria-label={t('profile.theme')}
            >
              {t('profile.theme')}
              <span className="text-xs text-muted-foreground">浅色</span>
            </button>
            
            <div className="border-t border-border"></div>
            
            {/* 通知设置按钮 */}
            <button 
              className="w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 flex justify-between items-center"
              aria-label={t('profile.notifications')}
            >
              {t('profile.notifications')}
              <span className="text-xs text-muted-foreground">已开启</span>
            </button>
            
            <div className="border-t border-border"></div>
            
            {/* 关于按钮 - 保持样式一致性 */}
            <button 
              className="w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 flex justify-between items-center"
              aria-label={t('profile.about')}
            >
              {t('profile.about')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}