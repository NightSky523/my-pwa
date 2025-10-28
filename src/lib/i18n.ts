
import localforage from 'localforage';
import type { LanguageResource } from '@/api/language';

// 配置 localforage
const storage = localforage.createInstance({
  name: 'my-pwa',
  storeName: 'languageCache',
  description: 'Language resources cache'
});

// 缓存语言资源到本地存储
export const cacheLanguageResource = async (language: string, resource: LanguageResource): Promise<void> => {
  try {
    const cacheKey = `language_resource_${language}`;
    await storage.setItem(cacheKey, resource);
    console.log(`Language resource for ${language} cached successfully`);
  } catch (error) {
    console.error('Failed to cache language resource:', error);
  }
};

// 从本地存储获取缓存的语言资源
export const getCachedLanguageResource = async (language: string): Promise<LanguageResource | null> => {
  try {
    const cacheKey = `language_resource_${language}`;
    const cachedResource = await storage.getItem<LanguageResource>(cacheKey);
    
    if (!cachedResource) {
      return null;
    }
    
    return cachedResource;
  } catch (error) {
    console.error('Failed to get cached language resource:', error);
    return null;
  }
};

// 清除指定语言的缓存
export const clearLanguageCache = async (language: string): Promise<void> => {
  try {
    const resourceKey = `language_resource_${language}`;
    const versionKey = `language_version_${language}`;
    
    await Promise.all([
      storage.removeItem(resourceKey),
      storage.removeItem(versionKey)
    ]);
    
    console.log(`Cache cleared for language ${language}`);
  } catch (error) {
    console.error('Failed to clear language cache:', error);
  }
};

// 清除所有语言缓存
export const clearAllLanguageCache = async (): Promise<void> => {
  try {
    const keys = await storage.keys();
    const keysToRemove = keys.filter(key => 
      typeof key === 'string' && 
      (key.startsWith('language_resource_') || key.startsWith('language_version_'))
    );
    
    await Promise.all(keysToRemove.map(key => storage.removeItem(key)));
    
    console.log('All language cache cleared');
  } catch (error) {
    console.error('Failed to clear all language cache:', error);
  }
};
