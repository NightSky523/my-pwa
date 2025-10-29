import React, { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// 定义瀑布流项的数据类型
export interface WaterfallItem {
  id: string;
  title: string;
  imageUrl: string;
}

// 瀑布流项组件
const WaterfallItemComponent: React.FC<{
  data: WaterfallItem;
  index: number;
}> = ({ data, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative w-full">
      <div className="overflow-hidden rounded-lg border border-border bg-card h-full flex flex-col">
        {!imageLoaded && (
          <div className="flex items-center justify-center bg-muted z-10 aspect-square">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <div className="relative w-full">
          <img
            src={data.imageUrl}
            alt={data.title}
            className={cn(
              "w-full object-cover transition-all duration-500 ease-out transform max-h-[400px] aspect-auto",
              imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 text-foreground">
            <MapPin className="inline-block w-4 h-4 text-primary mr-1" />
            {data.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {data.title} #{index + 1}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterfallItemComponent;