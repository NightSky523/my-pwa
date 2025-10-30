import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number; // 触发刷新的下拉距离阈值
  maxPullDistance?: number; // 最大下拉距离
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  maxPullDistance = 120,
  className,
}) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPassiveSupported = useRef(false);

  // 检测是否支持被动事件监听器
  useEffect(() => {
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() {
          isPassiveSupported.current = true;
          return true;
        }
      });
      window.addEventListener('test', () => {}, options);
      window.removeEventListener('test', () => {});
    } catch (err) {
      isPassiveSupported.current = false;
    }
  }, []);

  // 使用原生事件监听器
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // 只有在页面顶部且没有在刷新时才能触发下拉刷新
      if (container.scrollTop === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      // 只有在向下拉动时才处理
      if (distance > 0) {
        const limitedDistance = Math.min(distance, maxPullDistance);
        setPullDistance(limitedDistance);
        
        // 阻止默认滚动行为，避免页面滚动
        if (distance > 5) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;

      setIsPulling(false);

      // 如果下拉距离超过阈值，触发刷新
      if (pullDistance >= threshold) {
        // 触觉反馈
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        setIsRefreshing(true);
        setPullDistance(0); // 重置下拉距离，隐藏悬浮提示
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      } else {
        // 如果没有达到阈值，回弹到初始位置
        setPullDistance(0);
      }
    };

    // 使用正确的被动事件选项
    const options = isPassiveSupported.current ? { passive: false } : false;
    
    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, threshold, maxPullDistance, onRefresh]);

  // 计算下拉指示器的旋转角度
  const rotation = Math.min((pullDistance / threshold) * 180, 180);

  // 计算下拉指示器的透明度和缩放
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = 0.9 + (Math.min(pullDistance / threshold, 1) * 0.2); // 从0.9缩放到1.1

  // 计算背景色的强度
  const bgIntensity = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full overflow-auto', className)}
      style={{
        // 在刷新时给容器添加padding-top，避免内容被遮挡
        paddingTop: isRefreshing ? '50px' : '0px',
        transition: 'padding-top 0.3s ease',
      }}
    >
      {/* 下拉刷新指示器 */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 z-20',
          isRefreshing ? 'h-12' : 'h-0'
        )}
        style={{
          transform: `translateY(${isRefreshing ? 0 : -100}%)`,
          opacity: isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">{t('common.refreshing')}</span>
        </div>
      </div>

      {/* 下拉提示 - 只在非刷新状态且正在拉动时显示 */}
      {!isRefreshing && (
        <div
          className={cn(
            'absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 pointer-events-none z-20',
            isPulling ? 'h-12' : 'h-0'
          )}
          style={{
            transform: `translateY(${pullDistance}px)`,
            opacity,
          }}
        >
          <div 
            className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border"
            style={{
              transform: `scale(${scale})`,
              backgroundColor: `rgba(var(--background), ${0.6 + (bgIntensity * 0.2)})`,
              borderColor: `rgba(var(--border), ${0.5 + (bgIntensity * 0.5)})`,
            }}
          >
            <div className="relative">
              <ArrowDown
                className="h-5 w-5 text-muted-foreground transition-transform duration-200"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  opacity: pullDistance >= threshold ? 0 : 1,
                }}
              />
              <RefreshCw
                className={cn(
                  "h-5 w-5 text-primary absolute top-0 left-0 transition-all duration-200",
                  pullDistance >= threshold ? 'animate-spin' : ''
                )}
                style={{ 
                  transform: `rotate(${rotation - 180}deg)`,
                  opacity: pullDistance >= threshold ? 1 : 0,
                }}
              />
            </div>
            <span 
              className="text-sm font-medium text-muted-foreground transition-all duration-200"
              style={{
                color: pullDistance >= threshold ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              }}
            >
              {pullDistance >= threshold
                ? t('common.releaseToRefresh')
                : t('common.pullToRefresh')}
            </span>
          </div>
        </div>
      )}

      {/* 内容区域 - 不再使用transform，避免影响高度计算 */}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;