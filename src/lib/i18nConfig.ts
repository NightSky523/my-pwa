import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localforage from 'localforage';
import { getLanguageResource, getLanguageVersionInfo, type LanguageVersionInfo } from '@/api/language';
import { getCachedLanguageResource, cacheLanguageResource } from './i18n';

// 配置 localforage for version info
const versionStorage = localforage.createInstance({
  name: 'my-pwa',
  storeName: 'languageVersion',
  description: 'Language version info'
});

// 配置 localforage for language preference
const preferenceStorage = localforage.createInstance({
  name: 'my-pwa',
  storeName: 'preferences',
  description: 'User preferences'
});

// 语言类型
export type Language = string;

// 默认语言
const DEFAULT_LANGUAGE: string = 'en-US';

// 支持语言缓存与存储Key
let supportedLanguagesCache: string[] | null = null;
const SUPPORTED_LANGUAGES_STORAGE_KEY = 'supported_languages';

const saveSupportedLanguagesToStorage = async (languages: string[]): Promise<void> => {
  try {
    await preferenceStorage.setItem(SUPPORTED_LANGUAGES_STORAGE_KEY, languages);
  } catch {
    // ignore
  }
};

// 规范化浏览器语言为受支持的 string（优先使用缓存列表，缺失时用前缀兜底）
const normalizeLanguage = (lang: string | null | undefined): string | null => {
  if (!lang) return null;
  const lowered = lang.toLowerCase();
  const list = supportedLanguagesCache;
  if (list && list.length > 0) {
    const fullMatch = list.find(l => l.toLowerCase() === lowered);
    if (fullMatch) return fullMatch;
  }
  // 前缀匹配兜底：en -> en-US, ja -> ja-JP, zh -> zh-CN
  if (lowered.startsWith('en')) return 'en-US';
  if (lowered.startsWith('ja')) return 'ja-JP';
  if (lowered.startsWith('zh')) return 'zh-CN';
  return null;
};

// 初始化状态
let isI18nInitialized = false;
let initPromise: Promise<typeof i18n> | null = null;

// 初始化i18next
const initI18n = async () => {
  // 如果已经初始化，直接返回
  if (isI18nInitialized && initPromise) {
    return initPromise;
  }

  // 创建初始化Promise
  initPromise = (async () => {
    // 首先获取语言版本信息，确保支持的语言列表已加载
    console.log('Fetching language version info first...');
    const versionInfoData = await getLanguageVersionInfo() as Record<string, LanguageVersionInfo>;
    supportedLanguagesCache = Object.keys(versionInfoData);
    await saveSupportedLanguagesToStorage(supportedLanguagesCache);
    console.log('Supported languages loaded:', supportedLanguagesCache);

    // 获取用户偏好语言：localforage > 浏览器语言 > 默认
    const savedLanguageRaw = await preferenceStorage.getItem<string>('language');
    const savedLanguage = normalizeLanguage(savedLanguageRaw);
    // 优先从 navigator.languages 列表中找到第一个可用语言
    const fromNavigatorList = Array.isArray((navigator as any).languages)
      ? ((navigator as any).languages as string[]).map(normalizeLanguage).find(Boolean) || undefined
      : undefined;
    const fromNavigatorSingle = normalizeLanguage(navigator.language);
    const currentLanguage = (savedLanguage || fromNavigatorList || fromNavigatorSingle || DEFAULT_LANGUAGE) 

    // 先尝试从缓存获取语言资源
    const cachedResource = await getCachedLanguageResource(currentLanguage);
    const cachedVersion = await versionStorage.getItem<LanguageVersionInfo>(`language_version_${currentLanguage}`);

    // 如果有缓存资源，先使用缓存初始化
    if (cachedResource && cachedVersion) {
      console.log(`Using cached language resource for ${currentLanguage}`);
      
      await i18n
        .use(initReactI18next)
        .init({
          lng: currentLanguage,
          fallbackLng: DEFAULT_LANGUAGE,
          debug: import.meta.env.DEV,
          
          resources: {
            [currentLanguage]: {
              translation: cachedResource,
            },
          },

          interpolation: {
            escapeValue: false, 
          },
        });
      
      // 标记为已初始化
      isI18nInitialized = true;
      
      // 异步检查是否需要更新
      checkLanguageVersion(currentLanguage).then(shouldUpdate => {
        if (shouldUpdate) {
          console.log(`Language ${currentLanguage} needs update, updating in background...`);
          // 在后台更新语言资源
          loadLanguage(currentLanguage, true).catch(error => {
            console.error('Failed to update language in background:', error);
          });
        }
      }).catch(error => {
        console.error('Failed to check language version:', error);
      });
      
      return i18n;
    }

    // 没有缓存或缓存无效，从服务器获取
    console.log(`No valid cache for ${currentLanguage}, fetching from server`);
    const resources = await getLanguageResource(currentLanguage);
    const versionInfo = versionInfoData[currentLanguage];

    await i18n
      .use(initReactI18next)
      .init({
        lng: currentLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        debug: import.meta.env.DEV,
        
        resources: {
          [currentLanguage]: {
            translation: resources,
          },
        },

        interpolation: {
          escapeValue: false, 
        },
      });

    // 缓存语言资源和版本信息
    await cacheLanguageResource(currentLanguage, resources);
    await saveLanguageVersionInfo(currentLanguage, versionInfo);

    // 标记该语言在初始化阶段已完成版本检查，避免后续重复检查
    setVersionCheckedFlag(currentLanguage);

    isI18nInitialized = true;
    return i18n;
  })();

  return initPromise;
};

// 检查语言版本是否需要更新
export const checkLanguageVersion = async (language: string): Promise<boolean> => {
  try {
    // 如果当前会话已经检查过该语言的版本，则跳过检查
    if (isVersionChecked(language)) {
      console.log(`Version for ${language} already checked in this session`);
      return false;
    }
    
    // 获取服务器上的最新版本信息
    const latestVersionInfoData = await getLanguageVersionInfo(language);
    const latestVersionInfo = latestVersionInfoData as LanguageVersionInfo;
    
    // 获取本地存储的版本信息
    const storedVersionInfo = await versionStorage.getItem<LanguageVersionInfo>(`language_version_${language}`);
    
    // 如果没有本地版本信息，则需要更新
    if (!storedVersionInfo) {
      console.log(`No version info stored for ${language}, will fetch from server`);
      // 标记已检查，避免重复检查
      setVersionCheckedFlag(language);
      return true;
    }
    
    // 检查版本号是否不同
    if (storedVersionInfo.version !== latestVersionInfo.version) {
      console.log(`Version mismatch for ${language}: local=${storedVersionInfo.version}, remote=${latestVersionInfo.version}`);
      // 标记已检查，避免重复检查
      setVersionCheckedFlag(language);
      return true;
    }
    
    // 版本号相同，不需要更新
    console.log(`Language ${language} is up to date (version ${latestVersionInfo.version})`);
    // 标记已检查，避免重复检查
    setVersionCheckedFlag(language);
    return false;
  } catch (error) {
    console.error('Failed to check language version:', error);
    // 出错时默认不更新，使用缓存
    return false;
  }
};

// 保存语言版本信息到本地存储
export const saveLanguageVersionInfo = async (language: string, versionInfo: LanguageVersionInfo): Promise<void> => {
  try {
    await versionStorage.setItem(`language_version_${language}`, versionInfo);
  } catch (error) {
    console.error('Failed to save language version info:', error);
  }
};

// 使用 sessionStorage 存储临时版本检查标志
export const setVersionCheckedFlag = (language: string): void => {
  try {
    sessionStorage.setItem(`language_version_checked_${language}`, 'true');
  } catch (error) {
    console.error('Failed to set version checked flag:', error);
  }
};

// 检查是否已进行版本检查
export const isVersionChecked = (language: string): boolean => {
  try {
    return sessionStorage.getItem(`language_version_checked_${language}`) === 'true';
  } catch (error) {
    console.error('Failed to check version flag:', error);
    return false;
  }
};

// 清除所有版本检查标志
export const clearAllVersionCheckedFlags = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('language_version_checked_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    console.log('All version checked flags cleared from sessionStorage');
  } catch (error) {
    console.error('Failed to clear version checked flags:', error);
  }
};
// 动态加载语言资源
export const loadLanguage = async (language: string, forceUpdate = false): Promise<boolean> => {
  try {
    // 如果强制更新，先清除缓存
    if (forceUpdate) {
      console.log(`Force update requested for ${language}, clearing cache`);
      await versionStorage.removeItem(`language_resource_${language}`);
      await versionStorage.removeItem(`language_version_${language}`);
    }
    
    // 先尝试从缓存获取语言资源
    const cachedResource = await getCachedLanguageResource(language);
    const cachedVersion = await versionStorage.getItem<LanguageVersionInfo>(`language_version_${language}`);

    // 如果有缓存资源且不是强制更新，先使用缓存
    if (cachedResource && cachedVersion && !forceUpdate) {
      console.log(`Using cached language resource for ${language}`);
      
      // 添加语言资源
      i18n.addResourceBundle(language, 'translation', cachedResource, true, true);
      i18n.changeLanguage(language);
      
      // 保存用户语言偏好
      await preferenceStorage.setItem('language', language);
      
      // 标记该语言在切换后已完成版本检查
      setVersionCheckedFlag(language);
      
      // 异步检查是否需要更新
      checkLanguageVersion(language).then(shouldUpdate => {
        if (shouldUpdate) {
          console.log(`Language ${language} needs update, updating in background...`);
          // 在后台更新语言资源
          loadLanguage(language, true).catch(error => {
            console.error('Failed to update language in background:', error);
          });
        }
      }).catch(error => {
        console.error('Failed to check language version:', error);
      });
      
      return true;
    }
    
    // 没有缓存或强制更新，从服务器获取
    console.log(`Loading language resources for ${language} from server`);
    const [resources, versionInfoData] = await Promise.all([
      getLanguageResource(language),
      getLanguageVersionInfo(language)
    ]);
    const versionInfo = versionInfoData as LanguageVersionInfo;
    
    // 添加语言资源
    i18n.addResourceBundle(language, 'translation', resources, true, true);
    i18n.changeLanguage(language);
    
    // 保存用户语言偏好
    await preferenceStorage.setItem('language', language);
    
    // 缓存语言资源和版本信息
    await cacheLanguageResource(language, resources);
    await saveLanguageVersionInfo(language, versionInfo);

    // 标记该语言在切换后已完成版本检查
    setVersionCheckedFlag(language);
    
    console.log(`Language ${language} loaded successfully (version ${versionInfo.version})`);
    return true;
  } catch (error) {
    console.error('Failed to load language:', error);
    return false;
  }
};

// 获取当前语言
export const getCurrentLanguage = async (): Promise<string> => {
  const savedLanguage = await preferenceStorage.getItem<string>('language');
  return (i18n.language || savedLanguage || DEFAULT_LANGUAGE);
};

// 检查i18n是否已初始化
export const isI18nReady = (): boolean => {
  return isI18nInitialized;
};

// 获取初始化Promise
export const getI18nInitPromise = (): Promise<typeof i18n> | null => {
  return initPromise;
};

// 获取已缓存的支持的语言列表
export const getSupportedLanguages = (): string[] => {
  return supportedLanguagesCache || [];
};

export default initI18n;
