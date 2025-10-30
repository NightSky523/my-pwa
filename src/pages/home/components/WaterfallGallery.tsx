import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Masonry, useInfiniteLoader } from "masonic";
import WaterfallItemComponent, { type WaterfallItem } from "./WaterfallItem";


interface WaterfallGalleryProps {
  initialItems?: WaterfallItem[];
  columnWidth?: number;
  columnGutter?: number;
  emptyMessage?: string;
  onLoadMore?: (startIndex: number, stopIndex: number) => Promise<WaterfallItem[]>;
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

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 使用 useInfiniteLoader 钩子创建无限加载器
  const maybeLoadMore = useInfiniteLoader(
    async (startIndex: number, stopIndex: number) => {
      // 如果没有提供 onLoadMore 函数或者已经在加载中，则不执行
      if (!onLoadMore || isLoading || !hasMore) return;
      
      setIsLoading(true);
      try {
        // 调用父组件提供的加载更多函数
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
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 16, // 每次最少加载16个项目
      threshold: 16, // 距离底部16个项目时开始预加载
      totalItems: items.length,
    }
  );

  // 空状态
  if (!items.length && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {emptyMessage || t("gallery.noItems")}
      </div>
    );
  }

  return (
      <div>
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
            {t("gallery.loading") }
          </div>
        )}

        {/* 到底了 */}
        {!hasMore && (
          <div className="flex justify-center py-4 text-sm text-muted-foreground">
            {t("gallery.noMore")}
          </div>
        )}
      </div>
  );
};

export default WaterfallGallery;
