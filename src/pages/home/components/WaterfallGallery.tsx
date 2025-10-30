import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const loadingRef = useRef(false); // 防止重复加载
  
  const windowWidth = useWindowWidth();
  
  // 根据窗口宽度计算列数
  const columnCount = useMemo(() => {
    const containerWidth = windowWidth - 48;
    const effectiveColumnWidth = columnWidth + columnGutter;
    return Math.max(1, Math.floor(containerWidth / effectiveColumnWidth));
  }, [windowWidth, columnWidth, columnGutter]);

  // 同步 initialItems 到 items
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 处理滚动加载更多
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // 滚动到距离底部200px时触发加载
      if (scrollHeight - scrollTop - clientHeight < 200 && hasMore && !loadingRef.current) {
        loadingRef.current = true;
        setIsLoading(true);
        
        onLoadMore()
          .then(newItems => {
            setItems(prev => [...prev, ...newItems]);
          })
          .catch(error => {
            console.error("Failed to load more items:", error);
          })
          .finally(() => {
            setIsLoading(false);
            loadingRef.current = false;
          });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, onLoadMore]);

  // 渲染单个瀑布流项
  const ItemContent: React.FC<{ data: WaterfallItem; index: number }> = ({ data, index }) => {
    if (!data) return null;
    
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
    <div ref={containerRef} className="w-full h-full overflow-auto">
      <VirtuosoMasonry
        columnCount={columnCount}
        data={items}
        useWindowScroll={false}
        initialItemCount={items.length}
        ItemContent={ItemContent}
      />
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center py-2">
          <div className="flex items-center gap-2 text-muted-foreground bg-background px-4 py-2 rounded-full shadow-md">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{t("gallery.loading") || "加载中..."}</span>
          </div>
        </div>
      )}
      
      {/* 没有更多数据提示 */}
      {!hasMore && items.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center py-2">
          <p className="text-muted-foreground text-sm bg-background px-4 py-2 rounded-full shadow-md">
            {t("gallery.noMore") || "没有更多内容了"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterfallGallery;