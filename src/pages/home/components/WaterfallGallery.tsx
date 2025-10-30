import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

// 自定义hook：获取窗口宽度
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onLoadMore?: () => Promise<WaterfallItem[]>;
  hasMore?: boolean;
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  columnWidth = 172,
  columnGutter = 16,
  emptyMessage,
  onLoadMore,
  hasMore = true,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const windowWidth = useWindowWidth();
  
  // 根据窗口宽度计算列数
  const columnCount = useMemo(() => {
    const containerWidth = windowWidth - 48;
    const effectiveColumnWidth = columnWidth + columnGutter;
    return Math.max(1, Math.floor(containerWidth / effectiveColumnWidth));
  }, [windowWidth, columnWidth, columnGutter]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 加载更多数据的回调函数
  const loadMore = useCallback(async () => {
    if (!onLoadMore || isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const newItems = await onLoadMore();
      if (newItems && newItems.length > 0) {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, isLoading, hasMore]);

  // 处理滚动事件，实现无限滚动
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (!element || !hasMore || isLoading || !onLoadMore) return;
    
    // 检查是否滚动到底部附近
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
    
    if (isNearBottom) {
      loadMore();
    }
  }, [hasMore, isLoading, onLoadMore, loadMore]);

  // 渲染单个瀑布流项
  const ItemContent: React.FC<{ data: WaterfallItem; index: number }> = ({ data, index }) => {
    
    return (
      <div style={{ padding: `${columnGutter/2}px` }}>
        <WaterfallItemComponent data={data} index={index} />
      </div>
    );
  };

  // 空状态
  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">{emptyMessage || t("gallery.noItems")}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto" onScroll={handleScroll}>
      <VirtuosoMasonry
        columnCount={columnCount}
        data={items}
        useWindowScroll={false}
        ItemContent={ItemContent}
      />
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{t("gallery.loading") || "加载中..."}</span>
          </div>
        </div>
      )}
      
      {/* 没有更多数据提示 */}
      {!hasMore && items.length > 0 && (
        <div className="flex justify-center py-4">
          <p className="text-muted-foreground text-sm">
            {t("gallery.noMore") || "没有更多内容了"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterfallGallery;