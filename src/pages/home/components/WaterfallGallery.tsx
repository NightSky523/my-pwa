import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import { Loader2, RefreshCw } from 'lucide-react';
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  emptyMessage?: string;
  onRefresh?: () => Promise<WaterfallItem[]>;
  onLoadMore?: () => Promise<WaterfallItem[]>;
  hasMore?: boolean;
}

// 自定义 Hook 获取窗口宽度
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  emptyMessage,
  onRefresh,
  onLoadMore,
  hasMore = true,
}) => {
  const { t } = useTranslation();
  // 初始化时过滤掉无效数据
  const [items, setItems] = useState<WaterfallItem[]>(initialItems.filter(item => item && item.imageUrl));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 下拉刷新相关状态和引用
  const [refreshingOffset, setRefreshingOffset] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isRefreshingEnabled = !!onRefresh;

  useEffect(() => {
    // 确保只有有效数据才被设置
    setItems(initialItems.filter(item => item && item.imageUrl));
  }, [initialItems]);

  // 下拉刷新相关处理函数
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isRefreshingEnabled || isRefreshing || window.scrollY > 5) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [isRefreshingEnabled, isRefreshing]);

  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || !isRefreshingEnabled || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // 只有向下拉动并且在页面顶部才触发下拉刷新效果
    if (diff > 0 && window.scrollY === 0) {
      // 限制最大下拉距离
      const offset = Math.min(diff * 0.5, 100);
      setRefreshingOffset(offset);
    }
  }, [isPulling, isRefreshingEnabled, isRefreshing]);
  
  // 使用原生事件监听器添加non-passive触摸事件
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !isRefreshingEnabled) return;
    
    const nativeTouchMove = (e: TouchEvent) => {
      if (isPulling && window.scrollY === 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0 && e.cancelable) {
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('touchmove', nativeTouchMove, { passive: false });
    
    return () => {
      element.removeEventListener('touchmove', nativeTouchMove);
    };
  }, [isPulling, isRefreshingEnabled]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !isRefreshingEnabled || isRefreshing) {
      setIsPulling(false);
      return;
    }

    setIsPulling(false);
    
    // 如果下拉距离超过阈值，则触发刷新
    if (refreshingOffset > 60 && onRefresh) {
      setIsRefreshing(true);
      setRefreshingOffset(60); // 设置为固定高度显示刷新动画
      
      try {
        const newItems = await onRefresh();
        if (newItems && Array.isArray(newItems)) {
          setItems(newItems.filter(item => item && item.imageUrl));
        }
      } catch (error) {
        console.error('刷新失败:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setRefreshingOffset(0);
        }, 500);
      }
    } else {
      // 否则回到初始状态
      setRefreshingOffset(0);
    }
  }, [isPulling, isRefreshingEnabled, isRefreshing, refreshingOffset, onRefresh]);

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
        const newItems = await onLoadMore();
        // 确保newItems是有效数组且有数据
        if (newItems && Array.isArray(newItems) && newItems.length > 0) {
          // 过滤出有效数据并添加到现有数据中
          const validNewItems = newItems.filter(item => item && item.imageUrl);
          if (validNewItems.length > 0) {
            setItems(prev => [...prev, ...validNewItems]);
          }
        }
      } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [onLoadMore, isLoadingMore, hasMore]);
  
  // 窗口滚动事件处理 - 更可靠的滚动到底部检测
  useEffect(() => {
    if (!onLoadMore) return;
    
    const handleScroll = () => {
      // 当滚动到距离底部200px时触发加载更多
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // 检查是否滚动到底部且不在加载中且有更多数据
      if (scrollHeight - scrollTop - clientHeight < 200 && !isLoadingMore && hasMore) {
        handleLoadMore();
      }
    };
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      // 清理事件监听器
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore, isLoadingMore, hasMore, handleLoadMore]);

  // 使用自定义 Hook 获取窗口宽度
  const width = useWindowWidth();

  // 根据窗口宽度计算列数
  const columnCount = useMemo(() => {
    if (width < 500) {
      return 2;
    }
    if (width < 800) {
      return 3;
    }
    return 4;
  }, [width]);

  // 创建渲染瀑布流项目的组件
  const renderItem = ({ data, index }: { data: WaterfallItem; index: number }) => {
    // 再次检查数据有效性，作为最后一道防线
    if (!data || !data.imageUrl) {
      return null; // 跳过无效数据
    }
    return <WaterfallItemComponent data={data} index={index} />;
  };

  // 渲染加载更多组件
  const renderFooter = () => {
    return (
      <div className="min-h-[20px]">
        {!hasMore && (
          <div className="flex justify-center items-center py-6 text-sm text-muted-foreground">
            {t("gallery.noMoreItems")}
          </div>
        )}
        
        {isLoadingMore && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">{t("gallery.loadingMore")}</span>
          </div>
        )}
      </div>
    );
  };

  // 渲染下拉刷新指示器
  const renderRefreshIndicator = () => {
    if (!isRefreshingEnabled) return null;
    
    const shouldShowIndicator = refreshingOffset > 0;
    
    return (
      shouldShowIndicator && (
        <div 
          className="flex justify-center items-center text-muted-foreground"
          style={{ height: refreshingOffset, transition: 'height 0.3s ease' }}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
              <span>{t("gallery.refreshing")}</span>
            </>
          ) : (
            <span>
              {refreshingOffset > 60 
                ? t("gallery.releaseToRefresh") 
                : t("gallery.pullToRefresh")
              }
            </span>
          )}
        </div>
      )
    );
  };

  if (!items.length && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {emptyMessage || t("gallery.noItems")}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="touch-manipulation"
    >
      {renderRefreshIndicator()}
      <VirtuosoMasonry
        data={items}
        columnCount={columnCount}
        ItemContent={renderItem}
        useWindowScroll={true}
        initialItemCount={50}
      >
        {renderFooter()}
      </VirtuosoMasonry>
    </div>
  );
};

export default WaterfallGallery;
