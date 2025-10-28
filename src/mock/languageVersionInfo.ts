import type { LanguageVersionInfo } from '@/api/language';

// 模拟语言版本信息
export const mockLanguageVersionInfo: Record<string, LanguageVersionInfo> = {
  'zh-CN': { version: '1.2.0', displayName: '简体中文' }, 
  'en-US': { version: '1.3.0', displayName: 'English' },  
  'ja-JP': { version: '1.1.5', displayName: '日本語' }, 
};