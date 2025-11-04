import { useTranslation } from 'react-i18next'
import { List, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NiceModal from '@ebay/nice-modal-react'
import { FilterModal } from '@/pages/match/components/FilterModal'

export function MatchPage() {
  const { t } = useTranslation()
  
  // 处理筛选应用
  const handleFilterApply = (filters: any) => {
    // 这里可以添加应用筛选的逻辑
    console.log('应用筛选:', filters)
    // 可以在这里调用API或更新状态来应用筛选
  }

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-6">
        {/* 点击List图标显示筛选模态框 */}
          <List size={24} className="mr-2 cursor-pointer" onClick={() => NiceModal.show(FilterModal, { onApply: handleFilterApply })} />
        <div className="flex items-center text-muted-foreground">
          <span>China</span>
          <MapPin size={16} className="mr-1" />
        </div>
      </div>

      {/* 用户匹配卡片 */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-medium text-foreground mb-4">{t('navigation.match')}</h2>
          
          {/* 用户头像（包含用户信息）- 占满剩余空间 */}
          <div className="flex-1 w-full bg-muted rounded-xl mb-4 overflow-hidden relative">
          {/* 这里后续可以替换为真实头像图片 */}
          <div className="w-full h-full bg-linear-to-br from-muted to-background flex items-center justify-center">
            <span className="text-muted-foreground">头像</span>
          </div>
          
          {/* 用户信息（绝对定位在头像底部，自动适应字体大小和高度） */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 md:p-4 w-full">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
              Mike, 25 <span className="text-gray-200 font-normal">• China</span>
            </h3>
          </div>
        </div>

        {/* AI评价区域 */}
        <div className="mb-6">
          
          {/* AI评价区域 */}
          <div className="bg-muted/50 p-2 md:p-4 rounded-lg text-sm text-muted-foreground overflow-hidden">
            <p className="font-medium mb-1">AI评价/AI总结:</p>
            <p className="word-break-all wrap-break-word whitespace-normal">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 mt-auto">
          <Button 
            className="flex-1 h-10 md:h-16"
            variant="secondary"
            size="default"
          >
            拒绝
          </Button>
          <Button 
            className="flex-1 h-10 md:h-16"
            variant="default"
            size="default"
          >
            喜欢
          </Button>
        </div>
      </div>
      

    </div>
  )
}