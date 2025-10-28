import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getLanguageResource, getLanguageVersionInfo } from "@/api/language";
import {
  loadLanguage,
  getCurrentLanguage,
  checkLanguageVersion,
  isI18nReady,
  isVersionChecked,
  getSupportedLanguages,
} from "../lib/i18nConfig";

// 语言切换hook
export const useLanguage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // 获取语言版本信息（总是获取，用于显示语言名称和支持语言列表）
  const { data: languageVersionInfo, isLoading: isVersionInfoLoading } = useQuery({
    queryKey: ["languageVersionInfo"],
    queryFn: () => getLanguageVersionInfo().then(versionInfo => versionInfo as Record<string, any>),
    staleTime: Infinity,
    // 总是获取语言版本信息，因为我们需要displayName和支持语言列表
  });

  // 直接从已初始化的配置中获取支持的语言列表
  const supportedLanguages = getSupportedLanguages();
  
  // 如果支持的语言列表为空，则从版本信息中提取
  const finalSupportedLanguages = supportedLanguages.length > 0 
    ? supportedLanguages 
    : (languageVersionInfo ? Object.keys(languageVersionInfo) : []);

  const changeLanguageMutation = useMutation({
    mutationFn: async ({
      language,
      forceUpdate = false,
    }: {
      language: string;
      forceUpdate?: boolean;
    }) => {
      const success = await loadLanguage(language, forceUpdate);
      if (!success) {
        throw new Error("Failed to change language");
      }
      return language;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentLanguage"] });
      queryClient.invalidateQueries();
    },
  });

  // 获取当前语言（仅在 i18n 初始化后启用）
  const { data: queriedLanguage } = useQuery<string>({
    queryKey: ["currentLanguage"],
    queryFn: getCurrentLanguage,
    staleTime: 0, // 不缓存，总是获取最新值
    enabled: isI18nReady(),
  });

  // 始终返回一个已定义的语言值，保持受控组件不抖动
  const currentLanguage = (queriedLanguage || "en-US") as string;

  // 如果初始化阶段已对当前语言完成检查，则跳过本次检查
  const skipCheckAfterInit = isVersionChecked(currentLanguage);

  // 检查语言版本是否需要更新（仅在 i18n 初始化后触发，避免重复日志）
  const { data: languageUpdateNeeded = false } = useQuery({
    queryKey: ["languageUpdateNeeded", currentLanguage],
    queryFn: async () => {
      if (!currentLanguage) return false;
      const needsUpdate = await checkLanguageVersion(currentLanguage);
      return needsUpdate;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    enabled: isI18nReady() && !!currentLanguage && !skipCheckAfterInit,
  });

  // 切换语言
  const changeLanguage = (language: string) => {
    changeLanguageMutation.mutate({ language });
  };

  // 获取语言显示名称 - 从语言版本信息中获取
  const getDisplayName = (language: string) => {
    if (languageVersionInfo && languageVersionInfo[language]) {
      return languageVersionInfo[language].displayName || language;
    }
    return language;
  };

  return {
    currentLanguage,
    changeLanguage,
    getDisplayName,
    supportedLanguages: finalSupportedLanguages,
    languageUpdateNeeded,
    isLoading: changeLanguageMutation.isPending || isVersionInfoLoading,
    error: changeLanguageMutation.error,
    t, // 翻译函数
  };
};

// 语言资源hook
export const useLanguageResource = (language: string) => {
  return useQuery({
    queryKey: ["languageResource", language],
    queryFn: () => getLanguageResource(language),
    staleTime: 24 * 60 * 60 * 1000, // 24小时缓存
    enabled: !!language,
  });
};

// 全局语言资源加载状态hook（仅跟踪语言切换中的loading，避免重复请求资源）
export const useLanguageLoadingState = () => {
  const { currentLanguage, isLoading: isChangingLanguage } = useLanguage();

  return {
    isLoading: isChangingLanguage,
    currentLanguage,
  };
};
