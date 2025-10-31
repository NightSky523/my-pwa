import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoMasonry, type ItemContent } from "@virtuoso.dev/masonry";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onRefresh?: () => Promise<WaterfallItem[]>; // 新增刷新回调
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  columnWidth = 172,
  columnGutter = 16,
  emptyMessage,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

  // 创建渲染瀑布流项目的组件
  const renderItem: ItemContent<WaterfallItem> = ({ data, index }) => (
    <WaterfallItemComponent data={data} index={index} />
  );

  // 计算列数
  const calculateColumnCount = () => {
    if (!containerRef.current) return 2;
    const containerWidth = containerRef.current.clientWidth;
    return Math.max(1, Math.floor(containerWidth / (columnWidth + columnGutter)));
  };

  // 监听容器大小变化
  const [columnCount, setColumnCount] = useState(calculateColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(calculateColumnCount());
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

      <VirtuosoMasonry
        data={items}
        columnCount={columnCount}
        ItemContent={renderItem}
        useWindowScroll={false}
      />
    </div>
  );
};

export default WaterfallGallery;