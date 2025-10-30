import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WaterfallGallery from "./components/WaterfallGallery";
import type { WaterfallItem } from "@/pages/home/components/WaterfallItem";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 生成模拟数据（可根据筛选条件调整）
const generateMockItems = (
  startIndex: number,
  count: number,
  sortBy: string = "all"
): WaterfallItem[] => {
  const baseItems = Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const randomHeight = Math.floor(Math.random() * 200) + 350; // 350-550px
    return {
      id: `item-${index}-${sortBy}`,
      title: `Image Item ${index + 1} (${sortBy})`,
      imageUrl: `https://picsum.photos/400/${randomHeight}?random=${index}-${sortBy}`,
    };
  });

  // 根据筛选条件排序（模拟实际业务逻辑）
  if (sortBy === "newest") {
    return [...baseItems].reverse();
  }
  if (sortBy === "popular") {
    return [...baseItems].sort(() => Math.random() - 0.5);
  }
  return baseItems;
};

export function HomePage() {
  const { t } = useTranslation();

  const [items, setItems] = useState<WaterfallItem[]>([]);
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(0); // 当前页码
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const itemsPerPage = 25; // 每页加载的数量
  const maxPages = 5; // 模拟最多5页数据

  // 初始加载或筛选条件变化时，重新加载数据
  useEffect(() => {
    loadInitialData();
  }, [sortBy]);

  // 加载初始数据
  const loadInitialData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const initialData = generateMockItems(0, itemsPerPage, sortBy);
    setItems(initialData);
    setCurrentPage(0);
    setHasMore(true); // 重置为有更多数据
  };



  // 处理加载更多
  const handleLoadMore = async (): Promise<WaterfallItem[]> => {
    // 模拟网络请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const nextPage = currentPage + 1;
    
    // 模拟数据加载完毕（这里设置最多5页）
    if (nextPage >= maxPages) {
      setHasMore(false);
      return [];
    }
    
    const startIndex = nextPage * itemsPerPage;
    const newItems = generateMockItems(startIndex, itemsPerPage, sortBy);
    
    // 更新items列表，追加新加载的项目
    setItems(prevItems => [...prevItems, ...newItems]);
    setCurrentPage(nextPage);
    return newItems;
  };

  // 处理筛选条件变化
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="shrink-0 shadow-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("home.title")}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t("home.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder={t("filters.select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">{t("filters.all")}</SelectItem>
                    <SelectItem value="newest">
                      {t("filters.newest")}
                    </SelectItem>
                    <SelectItem value="popular">
                      {t("filters.popular")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleSortChange(sortBy)}
              >
                {t("filters.apply")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
          <WaterfallGallery
            initialItems={items}
            columnGutter={16}
            columnWidth={172}
            emptyMessage={t("gallery.noItems")}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        
      </div>
    </div>
  );
}