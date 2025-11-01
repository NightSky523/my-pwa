import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/home";
import { MatchPage } from "./pages/MatchPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ProfilePage } from "./pages/my";
import { SettingsPage } from "./pages/my/SettingsPage";
import { AnimatePresence, motion } from "framer-motion";

// 动画路由包装组件
const AnimatedRoute = ({
  children,
  routeKey,
}: {
  children: React.ReactNode;
  routeKey: string;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, x: 100 }} // 从右侧进入
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }} // 向右侧退出
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="h-full overflow-auto"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// 路由配置类型定义
export type RouteConfig = {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: RouteConfig[];
  isAnimated?: boolean;
  routeKey?: string;
};

// 路由配置对象
const routeConfigs: RouteConfig[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigation />,
        isAnimated: false, // 在父级统一设置，所有子路由将继承此配置
        children: [
          {
            index: true,
            element: <HomePage />,
            routeKey: "home-page",
          },
          {
            path: "match",
            element: <MatchPage />,
            routeKey: "match-page",
          },
          {
            path: "messages",
            element: <MessagesPage />,
            routeKey: "messages-page",
          },
          {
            path: "my",
            element: <ProfilePage />,
            routeKey: "profile-page",
          },
        ],
      },
      {
        path: "my/settings",
        element: <SettingsPage />,
        isAnimated: true,
        routeKey: "settings-page",
      },
    ],
  },
];

// 处理路由配置，自动应用动画组件
// parentIsAnimated参数用于从父级路由继承动画配置
const processRoutes = (
  routes: RouteConfig[],
  parentIsAnimated?: boolean
): any[] => {
  return routes.map((route) => {
    const shouldAnimate =
      route.isAnimated !== undefined
        ? route.isAnimated
        : parentIsAnimated !== false;

    const processedRoute: any = {
      ...route,
      element:
        shouldAnimate && route.routeKey ? (
          <AnimatedRoute routeKey={route.routeKey}>{route.element}</AnimatedRoute>
        ) : (
          route.element
        ),
    };

    if (route.children) {
      processedRoute.children = processRoutes(route.children, shouldAnimate);
    }

    return processedRoute;
  });
};

// 创建路由实例
export const router = createBrowserRouter(processRoutes(routeConfigs));

// 导出路由配置，方便其他地方访问
export { routeConfigs };
