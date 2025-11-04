import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

// 用户个人信息页面组件
export function UserProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme } = useTheme()



  // 处理头像点击
  const handleAvatarClick = () => {
    // 这里可以实现头像上传功能
    console.log('更换头像')
  }

  // 跳转到实名认证页面
  const handleVerifyClick = () => {
    navigate('/my/verification')
  }

  return (
    <div className="flex flex-col h-full bg-background p-4">

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        {/* 头像和基本信息 */}
        <div className="flex flex-col items-center py-6 px-4">
          {/* 头像 */}
          <div 
            className="w-24 h-24 rounded-full bg-card border-2 border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={handleAvatarClick}
          >
            <span className="text-muted-foreground text-sm">点击更换头像</span>
          </div>
          
          {/* 用户名和年龄 */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-foreground">Lisa,26</h2>
            <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
              <span>国籍: 中国</span>
              <span className="ml-2 text-red-500">🇨🇳</span>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex justify-around py-4 px-4 bg-card/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">您被喜欢</p>
            <p className="text-lg font-bold text-primary">99次</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">您被喜欢</p>
            <p className="text-lg font-bold text-primary">99次</p>
          </div>
        </div>

        {/* 个人信息列表 */}
        <div className="mt-4 bg-card border-t border-border">
          {/* 生日信息 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">生日</span>
            <span className="text-sm text-foreground">2025-10-28</span>
          </div>

          {/* 职业信息 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">职业</span>
            <span className="text-sm text-foreground"></span>
          </div>

          {/* 现居城市 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">现居城市</span>
            <span className="text-sm text-foreground"></span>
          </div>

          {/* 身体数据 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">身体数据</span>
            <span className="text-sm text-foreground"></span>
          </div>

          {/* 语言 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">语言</span>
            <span className="text-sm text-foreground"></span>
          </div>

          {/* 标签管理 */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <span className="text-sm text-muted-foreground">标签管理</span>
            <span className="text-sm text-foreground"></span>
          </div>

          {/* 实名认证 - 未认证状态，可点击跳转到认证页面 */}
          <button 
            className="w-full flex items-center justify-between py-3 px-4 border-b border-border text-left"
            onClick={handleVerifyClick}
          >
            <span className="text-sm text-muted-foreground">实名认证</span>
            <span className="text-sm text-amber-500">未认证</span>
          </button>
        </div>

        {/* 隐私协议 */}
        <div className="mt-4 bg-card border-t border-b border-border">
          <button className="w-full flex items-center justify-between py-3 px-4 text-left">
            <span className="text-sm text-muted-foreground">隐私协议</span>
          </button>
        </div>

        {/* 退出登录 */}
        <div className="mt-8 px-4 mb-10">
          <button 
            className="w-full py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            onClick={() => {
              // 退出登录逻辑
              console.log('退出登录')
            }}
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}