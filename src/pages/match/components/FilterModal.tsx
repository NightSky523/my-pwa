import { useState } from 'react'
import { X, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NiceModal, { useModal } from '@ebay/nice-modal-react'

// 定义筛选条件的类型
interface FilterOptions {
  gender: string
  age: string
  height: string
  city: string
  language: string
  hobby: string
  sport: string
  pet: string
  activity: string
  food: string
}

// 定义组件属性类型
interface FilterModalProps {
  onApply?: (filters: FilterOptions) => void
}

// 创建筛选模态框组件
export const FilterModal = NiceModal.create<FilterModalProps>(({ onApply }) => {
  const modal = useModal()
  
  // 筛选条件状态
  const [filters, setFilters] = useState<FilterOptions>({
    gender: '',
    age: '',
    height: '',
    city: '',
    language: '',
    hobby: '',
    sport: '',
    pet: '',
    activity: '',
    food: ''
  })

  // 处理筛选选项点击
  const handleFilterChange = (category: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [category]: value }))
  }

  // 处理应用筛选
  const handleApply = () => {
    // 如果提供了回调函数,则调用它并传递筛选条件
    if (onApply) {
      onApply(filters)
    }
    // 关闭模态框
    modal.hide()
  }

  // 渲染筛选选项按钮
  const renderFilterOptions = (
    category: keyof FilterOptions,
    options: string[],
    showMore: boolean = true
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          onClick={() => handleFilterChange(category, option)}
          className={`px-3 py-1 rounded-full text-sm ${filters[category] === option ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          type="button"
        >
          {option}
        </button>
      ))}
      {showMore && (
        <button 
          className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground hover:bg-muted/80 flex items-center"
          type="button"
        >
          更多<ChevronRight size={14} className="ml-1" />
        </button>
      )}
    </div>
  )

  // 当模态框不可见时不渲染
  if (!modal.visible) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={modal.hide}
    >
      <div 
        className="bg-background rounded-lg w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 模态框头部 - 固定在顶部 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">我的个性偏好</h3>
          <button 
            onClick={modal.hide} 
            className="p-1 rounded-full hover:bg-muted"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 筛选内容 - 仅内容区域滚动 */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* 性别筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">性别</h4>
            {renderFilterOptions('gender', ['男', '女'], false)}
          </div>
          
          {/* 年龄筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">年龄</h4>
            {renderFilterOptions('age', ['20', '40'], false)}
          </div>
          
          {/* 身高筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">身高</h4>
            {renderFilterOptions('height', ['160', '180'], false)}
          </div>
          
          {/* 城市筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">城市</h4>
            {renderFilterOptions('city', ['上海', '北京', '杭州', '深圳', '重庆'])}
          </div>
          
          {/* 语言筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">语言</h4>
            {renderFilterOptions('language', ['中文', '日语', '英语'])}
          </div>
          
          {/* 爱好筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">爱好</h4>
            {renderFilterOptions('hobby', ['诗歌', '散文', '绘画', '音乐', '摄影'])}
          </div>
          
          {/* 运动筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">运动</h4>
            {renderFilterOptions('sport', ['攀岩', '篮球', '网球', '骑行', '体操', '排球', '瑜伽', '冲浪'])}
          </div>
          
          {/* 宠物筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">宠物</h4>
            {renderFilterOptions('pet', ['猫', '狗', '鸟', '鱼', '兔子', '蛇'])}
          </div>
          
          {/* 活动筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">活动</h4>
            {renderFilterOptions('activity', ['咖啡馆', '茶馆', '餐厅', 'KTV', '剧院', '酒吧', '博物馆', '画廊'])}
          </div>
          
          {/* 美食筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-2">美食</h4>
            {renderFilterOptions('food', ['咖啡', '快餐', '披萨', '川菜', '家常菜', '寿司', '鸡尾酒', '威士忌'])}
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="p-4 border-t">
          <Button 
            className="w-full flex items-center justify-center"
            variant="default"
            size="default"
            onClick={handleApply}
          >
            下一步<ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
})