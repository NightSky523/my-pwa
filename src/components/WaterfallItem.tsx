import React, { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// 定义瀑布流项的数据类型
export interface WaterfallItem {
  id: string;
  title: string;
  imageUrl: string;
  // 可选高度字段，便于排列时减少重排（若没有，仍然可工作）
  height?: number;
}

// 瀑布流项组件
const WaterfallItemComponent: React.FC<{
  data: WaterfallItem;
  index: number;
}> = ({ data, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!data) {
    console.warn("WaterfallItemComponent: Invalid data", data);
    return (
      <div className="group relative w-full">
        <div className="overflow-hidden rounded-lg border border-border bg-card h-full flex flex-col">
          <div className="flex items-center justify-center bg-muted aspect-square">
            <p className="text-muted-foreground">数据加载失败</p>
          </div>
          <div className="p-3"></div>
        </div>
      </div>
    );
  }

  // 给予图片一个初始占位高度以减少布局抖动（如果 data.height 可用则使用）
  const placeholderStyle = data.height
    ? { height: `${data.height}px` }
    : undefined;

  return (
    <div className="group relative w-full">
      <div className="overflow-hidden rounded-lg border border-border bg-card h-full flex flex-col">
        {!imageLoaded && (
          <div
            className="flex items-center justify-center bg-muted z-10 aspect-square"
            style={placeholderStyle}
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <div className="relative w-full">
          <img
            src={data.imageUrl}
            alt={data.title}
            style={placeholderStyle}
            className={cn(
              "w-full object-cover transition-all duration-500 ease-out transform max-h-[400px]",
              imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 text-foreground">
            <MapPin className="inline-block w-4 h-4 text-primary mr-1" />
            {data.title || "未知位置"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {data.title || "未知位置"} #{index + 1}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterfallItemComponent