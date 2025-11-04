import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector'
import ThemeSelector from './components/ThemeSelector'
import { useTheme } from '../../contexts/ThemeContext'
import { useState } from 'react'

export function SettingsPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  // 获取当前主题的显示文本
  const getThemeText = () => {
    switch (theme) {
      case 'light': return '浅色'
      case 'dark': return '深色'
      case 'system': return '跟随系统'
      default: return '浅色'
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-auto"> 
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
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              aria-label={t('profile.theme')}
            >
              {t('profile.theme')}
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-1">{getThemeText()}</span>
                <ChevronRight size={16} className={`transition-transform ${showThemeSelector ? 'rotate-90' : ''}`} />
              </div>
            </button>
            
            {/* 主题选择器 - 可展开/收起 */}
            {showThemeSelector && (
              <div className="mt-2 p-2 bg-secondary/50 rounded-md">
                <ThemeSelector />
              </div>
            )}
            
            {showThemeSelector && <div className="border-t border-border"></div>}
            
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