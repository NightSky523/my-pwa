import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderNavigationProps {
  title: string
  showBackButton?: boolean
  rightContent?: React.ReactNode
}

// 通用顶部导航栏组件，自动包含返回按钮功能
export function HeaderNavigation({
  title,
  showBackButton = true,
  rightContent
}: HeaderNavigationProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  // 返回上一页
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-border bg-background">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className={`p-2 rounded-full transition-colors mr-2 ${resolvedTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}
            aria-label="返回"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
        )}
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>
      {rightContent}
    </div>
  )
}