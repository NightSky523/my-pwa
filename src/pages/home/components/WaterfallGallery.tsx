import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoMasonry, type ItemContent } from "@virtuoso.dev/masonry";
import PullToRefresh from "react-pull-to-refresh";
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

  // 使用react-pull-to-refresh的刷新函数
  const handleRefresh = useCallback(async () => {
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
    <div ref={containerRef} className="h-full">
      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={!onRefresh}
        distanceToRefresh={60}
        resistance={2.5}
        icon={
          <div className="flex justify-center py-2 text-sm text-muted-foreground">
            {t("common.pullToRefresh")}
          </div>
        }
        loading={
          <div className="flex justify-center py-2 text-sm text-muted-foreground">
            {t("common.refreshing")}
          </div>
        }
      >
        <div className="h-full">
          <VirtuosoMasonry
            data={items}
            columnCount={columnCount}
            ItemContent={renderItem}
            useWindowScroll={false}
            style={{ height: '100%' }}
          />
        </div>
      </PullToRefresh>
    </div>
  );
};

export default WaterfallGallery;