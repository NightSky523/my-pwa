import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WaterfallGallery from "./components/WaterfallGallery";
import PullToRefresh from "@/components/ui/pull-to-refresh";
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
  sortBy: string = "all" // 新增：支持按筛选条件生成数据
): WaterfallItem[] => {
  const baseItems = Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const randomHeight = Math.floor(Math.random() * 200) + 350; // 350-550px
    return {
      id: `item-${index}-${sortBy}`, // 加入sortBy确保筛选后ID唯一
      title: `Image Item ${index + 1} (${sortBy})`,
      imageUrl: `https://picsum.photos/400/${randomHeight}?random=${index}-${sortBy}`,
    };
  });

  // 根据筛选条件排序（模拟实际业务逻辑）
  if (sortBy === "newest") {
    return [...baseItems].reverse(); // 最新的在前（模拟）
  }
  if (sortBy === "popular") {
    return [...baseItems].sort(() => Math.random() - 0.5); // 随机排序（模拟热门）
  }
  return baseItems;
};

export function HomePage() {
  const { t } = useTranslation();

  // 用state管理已加载的所有数据（包括初始和加载更多的）
  const [items, setItems] = useState<WaterfallItem[]>([]);
  const [sortBy, setSortBy] = useState("all"); // 筛选条件

  // 初始加载或筛选条件变化时，重新加载数据
  useEffect(() => {
    loadInitialData();
  }, [sortBy]); // 筛选条件变化时重新加载

  // 加载初始数据
  const loadInitialData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const initialData = generateMockItems(0, 12, sortBy);
    setItems(initialData);
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    await loadInitialData();
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
        <PullToRefresh onRefresh={handleRefresh}>
          <WaterfallGallery
            initialItems={items}
            columnGutter={16}
            columnWidth={172}
            emptyMessage={t("gallery.noItems")}
          />
        </PullToRefresh>
      </div>
    </div>
  );
}
