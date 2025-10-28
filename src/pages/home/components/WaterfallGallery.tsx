import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Masonry } from 'masonic';
import WaterfallItemComponent, { type WaterfallItem } from './WaterfallItem';

// 加载更多按钮组件
const LoadMoreButton: React.FC<{
  onLoadMore: () => void;
  loading: boolean;
}> = ({ onLoadMore, loading }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center mt-8 mb-20">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className={cn(
          "px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 flex items-center gap-2",
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90 hover:shadow-md active:scale-95"
        )}
        aria-label={loading ? t('gallery.loadingMore') : t('gallery.loadMore')}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>{t('gallery.loadingMore')}</span>
          </>
        ) : (
          <span>{t('gallery.loadMore')}</span>
        )}
      </button>
    </div>
  );
};

// 瀑布流画廊组件
interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  onLoadMore?: () => Promise<WaterfallItem[]>;
  hasMore?: boolean;
  className?: string;
  emptyMessage?: string;
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  columnWidth = 172,
  columnGutter = 16,
  onLoadMore,
  hasMore = false,
  className,
  emptyMessage,
}) => {
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // 同步 initialItems 的变化
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 使用 useCallback 优化函数引用
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await onLoadMore();
      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
      // 可以添加错误提示 toast
    } finally {
      setLoading(false);
    }
  }, [onLoadMore, loading, hasMore]);

  // 渲染单个项目（优化性能）
  const renderItem = useCallback(
    ({ data, index }: { data: WaterfallItem; index: number }) => (
      <WaterfallItemComponent key={data.id} data={data} index={index} />
    ),
    []
  );

  return (
    <div className={cn("py-8 px-4", className)}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">
            {emptyMessage || t('gallery.noItems')}
          </p>
        </div>
      ) : (
        <div className="max-w-[1084px] mx-auto flex flex-col items-center">
          <Masonry
            items={items}
            columnGutter={columnGutter}
            columnWidth={columnWidth}
            overscanBy={5}
            render={renderItem}
          />
          {hasMore && (
            <LoadMoreButton onLoadMore={handleLoadMore} loading={loading} />
          )}
        </div>
      )}
    </div>
  );
};

export default WaterfallGallery;