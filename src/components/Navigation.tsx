import { Home, Search, Heart, User } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const navigationItems = [
  {
    id: "home",
    icon: Home,
    path: "/",
  },
  {
    id: "search",
    icon: Search,
    path: "/search",
  },
  {
    id: "favorites",
    icon: Heart,
    path: "/favorites",
  },
  {
    id: "profile",
    icon: User,
    path: "/profile",
  },
];

/**
 * 底部导航组件，包含页面内容和底部导航栏
 * 使用固定定位将导航栏固定在底部，页面内容自行处理顶部和底部空间
 */
export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col">
      {/* 主要内容区域，占据剩余空间 */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      
      {/* 底部导航栏，占位方式，高度约80px */}
      <nav className="bg-background border-t border-border h-20 shrink-0">
        <div className="flex items-center justify-around h-full px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200 min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-xs mt-1 font-medium transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t(`navigation.${item.id}`)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
