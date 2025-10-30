import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Masonry } from "masonic";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";


interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onLoadMore?: () => Promise<WaterfallItem[]>;
  onRefresh?: () => Promise<void>;
  hasMore?: boolean;
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  columnWidth = 172,
  columnGutter = 16,
  emptyMessage,
  onLoadMore,
  onRefresh,
  hasMore = true,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !onLoadMore) return;
    
    setIsLoading(true);
    try {
      const newItems = await onLoadMore();
      setItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error('加载更多数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore]);

  // 滚动监听器，用于实现无限滚动
  useEffect(() => {
    const handleScroll = () => {
      // 检查是否滚动到页面底部附近
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 && // 距离底部500px时触发
        !isLoading && 
        hasMore && 
        onLoadMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 空状态
  if (!items.length && !isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-muted-foreground">
        {emptyMessage || t("gallery.noItems")}
      </div>
    );
  }

  return (
      <div>
        <Masonry
          items={items}
          columnWidth={columnWidth}
          columnGutter={columnGutter}
          overscanBy={5}
          render={({ data, index }) => (
            <WaterfallItemComponent data={data} index={index} />
          )}
        />

        {/* 加载中 */}
        {isLoading && (
          <div className="flex justify-center py-4 text-muted-foreground">
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            {t("gallery.loading") || "加载中..."}
          </div>
        )}

        {/* 到底了 */}
        {!hasMore && (
          <div className="flex justify-center py-4 text-sm text-muted-foreground">
            {t("gallery.noMore") || "没有更多内容了"}
          </div>
        )}
      </div>
  );
};

export default WaterfallGallery;
