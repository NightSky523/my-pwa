import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import WaterfallGallery from './components/WaterfallGallery'
import type { WaterfallItem } from '@/pages/home/components/WaterfallItem'

export function HomePage() {
  const { t } = useTranslation()
  
  // 生成模拟数据
  const generateMockItems = (startIndex: number, count: number): WaterfallItem[] => {
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      const randomHeight = Math.floor(Math.random() * 200) + 150; // 随机高度150-350px
      return {
          id: `item-${index}`,
          title: `Image Item ${index + 1}`,
          imageUrl: `https://picsum.photos/400/${randomHeight}?random=${index}`,
        }
    })
  }
  
  const [items] = useState<WaterfallItem[]>(generateMockItems(0, 12))
  const [hasMore, setHasMore] = useState(true)
  
  // 模拟加载更多数据
  const handleLoadMore = async (): Promise<WaterfallItem[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newItems = generateMockItems(items.length, 8)
    
    // 限制总数量为50，模拟没有更多数据的情况
    if (items.length + newItems.length >= 50) {
      setHasMore(false)
    }
    
    return newItems
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center py-8 px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">{t('home.title')}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          {t('home.subtitle')}
        </p>
      </div>
      
      <WaterfallGallery
        initialItems={items}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        columnGutter={16}
        columnWidth={172}
      />
    </div>
  )
}