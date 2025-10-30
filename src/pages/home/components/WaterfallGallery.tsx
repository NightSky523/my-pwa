import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MasonryScroller, usePositioner, useContainerPosition, useResizeObserver } from "masonic";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  
  // 监听容器高度变化
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    // 初始设置
    updateHeight();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

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

  // 创建定位器
  const positioner = usePositioner({
    width: containerRef.current?.clientWidth || 800,
    columnWidth,
    columnGutter,
    rowGutter: columnGutter,
  });

  // 获取容器位置
  const { offset } = useContainerPosition(containerRef, [items.length]);

  // 创建调整大小观察器
  const resizeObserver = useResizeObserver(positioner);

  // 渲染单个瀑布流项的组件
  const renderMasonryItem = ({ index, data }: { index: number; data: WaterfallItem }) => (
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

  // 计算瀑布流内容的实际高度
  const masonryHeight = positioner.estimateHeight(items.length, 200) || windowHeight - 200; // 减去一些顶部导航栏的高度

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ height: '100%' }}
    >
      <MasonryScroller
        positioner={positioner}
        offset={offset}
        height={masonryHeight}
        containerRef={containerRef}
        items={items}
        render={renderMasonryItem}
        itemKey={(data: WaterfallItem) => data.id}
        overscanBy={2}
        resizeObserver={resizeObserver}
      />
    </div>
  );
};

export default WaterfallGallery;
