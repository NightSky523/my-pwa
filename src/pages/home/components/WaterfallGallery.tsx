import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Masonry } from "masonic";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";

interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
}

export const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({
  initialItems = [],
  columnWidth = 172,
  columnGutter = 16,
  emptyMessage,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<WaterfallItem[]>(initialItems);
  const prevInitialItemsRef = useRef<WaterfallItem[]>(initialItems);

  // 监听 initialItems 的变化，更新内部 items 状态
  useEffect(() => {
    // 检查是否真的发生了变化（避免不必要的重新渲染）
    if (
      prevInitialItemsRef.current.length !== initialItems.length ||
      prevInitialItemsRef.current.some((item, index) => item.id !== initialItems[index]?.id)
    ) {
      setItems(initialItems);
      prevInitialItemsRef.current = initialItems;
    }
  }, [initialItems]);

  // 渲染单个瀑布流项的组件
  const renderMasonryItem = ({ index, data, width }: { index: number; data: WaterfallItem; width: number }) => (
    <WaterfallItemComponent data={data} index={index} />
  );

  // 如果没有数据，显示空状态
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">{emptyMessage || t("gallery.noItems")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Masonry
        items={items}
        render={renderMasonryItem}
        columnWidth={columnWidth}
        columnGutter={columnGutter}
        rowGutter={columnGutter}
        itemKey={(data: WaterfallItem) => data.id}
        className="w-full"
        overscanBy={2}
      />
    </div>
  );
};

export default WaterfallGallery;
