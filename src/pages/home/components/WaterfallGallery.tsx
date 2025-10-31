import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Masonry, useInfiniteLoader } from "masonic";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onLoadMore?: (startIndex: number, stopIndex: number) => Promise<WaterfallItem[]>;
  onRefresh?: () => Promise<WaterfallItem[]>; // 新增刷新回调
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // infinite loader：注意 totalItems 传入一个较大的值或基于 hasMore 控制逻辑
  const maybeLoadMore = useInfiniteLoader(
    async (startIndex: number, stopIndex: number) => {
      if (!onLoadMore || isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const newItems = await onLoadMore(startIndex, stopIndex);
        if (newItems && newItems.length > 0) {
          setItems((current) => [...current, ...newItems]);
        }
      } catch (error) {
        console.error("加载更多数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    },
    {
      isItemLoaded: (index, itemsArr) => !!itemsArr[index],
      minimumBatchSize: 16,
      threshold: 8,
      totalItems: hasMore ? items.length + 1000 : items.length, // 当有更多时，允许预取（masonic 要求 totalItems）
    }
  );

  // 下拉刷新：轻量实现（仅在容器顶部且移动端触发）
  const touchStartY = useRef<number | null>(null);
  const pullDistance = useRef(0);
  const maxPull = 120;

  const onTouchStart = (e: React.TouchEvent) => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      pullDistance.current = 0;
    } else {
      touchStartY.current = null;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    pullDistance.current = Math.max(0, currentY - (touchStartY.current || 0));
    // 可在此处实现视觉上的拉伸反馈（如 transform），但保持简单
    if (pullDistance.current > maxPull) pullDistance.current = maxPull;
  };

  const runRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      const refreshed = await onRefresh();
      if (refreshed && refreshed.length >= 0) {
        setItems(refreshed);
      }
    } catch (err) {
      console.error("刷新失败", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const onTouchEnd = async () => {
    if (touchStartY.current === null) return;
    if (pullDistance.current > 60) {
      // 触发刷新
      await runRefresh();
    }
    touchStartY.current = null;
    pullDistance.current = 0;
  };

  if (!items.length && !isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {emptyMessage || t("gallery.noItems")}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 刷新提示 */}
      {isRefreshing && (
        <div className="flex justify-center py-2 text-sm text-muted-foreground">
          {t("common.refreshing")}
        </div>
      )}

      <Masonry
        items={items}
        columnWidth={columnWidth}
        columnGutter={columnGutter}
        overscanBy={5}
        onRender={maybeLoadMore}
        render={({ data, index }) => (
          <WaterfallItemComponent data={data} index={index} />
        )}
      />

      {/* 加载中 */}
      {isLoading && (
        <div className="flex justify-center py-4 text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          {t("gallery.loading")}
        </div>
      )}

      {/* 到底了 */}
      {!hasMore && (
        <div className="flex justify-center py-4 text-sm text-muted-foreground">
          {t("gallery.noMore") || t("gallery.loadingMore")}
        </div>
      )}
    </div>
  );
};

export default WaterfallGallery;