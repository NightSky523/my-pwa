import { getCachedLanguageResource, cacheLanguageResource } from "@/lib/i18n";
import { mockLanguageResources, mockLanguageVersionInfo } from "@/mock";

// 语言资源接口
export interface LanguageResource {
  [key: string]: string | LanguageResource;
}

// 语言版本信息接口
export interface LanguageVersionInfo {
  version: string;
  displayName?: string;
}

// 获取语言资源的API
export const getLanguageResource = async (language: string): Promise<LanguageResource> => {
  // 首先尝试从本地缓存获取语言资源
  const cachedResource = await getCachedLanguageResource(language);
  if (cachedResource) {
    console.log(`Using cached language resource for ${language}`);
    return cachedResource;
  }
  
  // 获取语言资源
  const resource = mockLanguageResources[language];
  
  // 缓存语言资源
  await cacheLanguageResource(language, resource);
  
  return resource;
};

// 获取语言版本信息
export const getLanguageVersionInfo = async (language?: string): Promise<LanguageVersionInfo | Record<string, LanguageVersionInfo>> => {
  // 模拟API调用获取语言版本信息
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (language) {
    return mockLanguageVersionInfo[language];
  }
  
  return mockLanguageVersionInfo;
};