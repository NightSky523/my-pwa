import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onRefresh?: () => Promise<WaterfallItem[]>; // 新增刷新回调
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
  columnWidth = 172,
  columnGutter = 16,
  emptyMessage,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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
  const renderItem = ({ data, index }: { data: WaterfallItem; index: number }) => (
    <WaterfallItemComponent data={data} index={index} />
  );

  if (!items.length && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {emptyMessage || t("gallery.noItems")}
      </div>
    );
  }

  return (
    <div>
      <VirtuosoMasonry
        data={items}
        columnCount={columnCount}
        ItemContent={renderItem}
        useWindowScroll={true}
        initialItemCount={50}
      />
    </div>
  );
};

export default WaterfallGallery;
