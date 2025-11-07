import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Navigation } from "./components/Navigation";
import { HeaderNavigation } from "./components/HeaderNavigation";
import { HomePage } from "./pages/home";
import { MatchPage } from "./pages/match";
import { MessagesPage } from "./pages/messages";
import { ChatPage } from "./pages/messages/ChatPage";
import { ProfilePage } from "./pages/my";
import { SettingsPage } from "./pages/my/SettingsPage";
import { UserProfilePage } from "./pages/my/UserProfilePage";
import { VerificationPage } from "./pages/my/VerificationPage";
import { VipPage } from "./pages/my/VipPage";
import { LoginPage } from "./pages/LoginPage";
import { AnimatePresence, motion } from "framer-motion";

// 动画路由包装组件
const AnimatedRoute = ({
  children,
  routeKey,
  animationType = "slide", // 默认为滑动动画
}: {
  children: React.ReactNode;
  routeKey: string;
  animationType?: "slide" | "scale"; // 动画类型：滑动或放大
}) => {
  // 根据动画类型设置不同的动画参数
  const getAnimationProps = () => {
    switch (animationType) {
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        };
      case "slide":
      default:
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={animationProps.initial}
        animate={animationProps.animate}
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
};

// 路由配置类型定义
export type RouteConfig = {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: RouteConfig[];
  isAnimated?: boolean;
  routeKey?: string;
  showBackButton?: boolean; // 是否显示返回按钮
  title?: string; // 页面标题
  animationType?: "slide" | "scale"; // 动画类型：滑动或放大
};

// 带返回按钮的布局组件
const BackButtonLayout = ({
  children,
  routeKey,
}: {
  children: React.ReactNode;
  routeKey: string;
}) => {
  // 查找当前路由配置
  const findRouteByKey = (
    routes: RouteConfig[],
    key: string
  ): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.routeKey === key) return route;
      if (route.children) {
        const found = findRouteByKey(route.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  // 获取页面标题，直接从路由配置中获取
  const getTitle = (): string => {
    const currentRoute = findRouteByKey(routeConfigs, routeKey);
    return currentRoute?.title || "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* 使用通用顶部导航栏组件 */}
      <HeaderNavigation title={getTitle()} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
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
        path: "messages/chat",
        title: "官方客服",
        element: <ChatPage />,
        routeKey: "chat-page",
        showBackButton: true,
        animationType: "scale", 
      },
      {
        path: "my/settings",
        title: "设置",
        element: <SettingsPage />,
        routeKey: "settings-page",
        showBackButton: true,
      },
      {
        path: "my/profile",
        title: "个人资料",
        element: <UserProfilePage />,
        routeKey: "user-profile-page",
        showBackButton: true,
      },
      {
        path: "my/verification",
        title: "实名认证",
        element: <VerificationPage />,
        routeKey: "verification-page",
        showBackButton: true,
      },
      {
        path: "my/vip",
        title: "会员等级",
        element: <VipPage />,
        routeKey: "vip-page",
        showBackButton: true,
      },
      {
        path: "login",
        element: <LoginPage />,
        routeKey: "login-page",
      },
    ],
  },
];

const processRoutes = (
  routes: RouteConfig[],
  parentIsAnimated?: boolean,
  parentShowBackButton?: boolean
): any[] => {
  return routes.map((route) => {
    const shouldAnimate =
      route.isAnimated !== undefined
        ? route.isAnimated
        : parentIsAnimated !== false;

    // 根据当前路由配置或继承父级配置决定是否显示返回按钮
    const shouldShowBackButton =
      route.showBackButton !== undefined
        ? route.showBackButton
        : parentShowBackButton || false;

    // 先应用返回按钮布局
    let element = route.element;
    if (shouldShowBackButton && route.routeKey) {
      element = (
        <BackButtonLayout routeKey={route.routeKey}>{element}</BackButtonLayout>
      );
    }

    // 再应用动画效果
    const processedElement =
      shouldAnimate && route.routeKey ? (
        <AnimatedRoute routeKey={route.routeKey} animationType={route.animationType}>
          {element}
        </AnimatedRoute>
      ) : (
        element
      );

    const processedRoute: any = {
      ...route,
      element: processedElement,
    };

    if (route.children) {
      processedRoute.children = processRoutes(
        route.children,
        shouldAnimate,
        shouldShowBackButton
      );
    }

    return processedRoute;
  });
};

// 创建路由实例
export const router = createBrowserRouter(processRoutes(routeConfigs));

// 导出路由配置，方便其他地方访问
export { routeConfigs };
