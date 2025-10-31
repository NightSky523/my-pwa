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
          <VirtuosoMasonry
            className="h-full overflow-y-auto"
            data={items}
            columnCount={columnCount}
            ItemContent={renderItem}
            useWindowScroll={false}
          />

  );
};

export default WaterfallGallery;