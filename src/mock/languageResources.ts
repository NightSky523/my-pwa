import type { LanguageResource } from '@/api/language';



// 模拟语言资源数据
export const mockLanguageResources: Record<string, LanguageResource> = {
  'zh-CN': {
    common: {
      loading: '加载中...',
    },
    gallery: {
      noItems: '暂无内容',
    },
    navigation: {
      home: '首页',
      match: '匹配',
      messages: '消息',
      my: '我的',
    },
    home: {
      title: '欢迎使用PWA应用',
      subtitle: '这是一个现代化的渐进式Web应用',
    },
    match: {
      placeholder: '输入搜索关键词...',
    },
    filters: {
      select: '选择筛选条件',
      all: '全部',
      newest: '最新',
      popular: '热门',
      apply: '应用',
    },
    favorites: {
      title: '我的收藏',
    },
    profile: {
      title: '个人资料',
      settings: '设置',
      language: '语言',
      theme: '主题',
      notifications: '通知',
      about: '关于',
      // 个人资料页面新增翻译
      unverified: '未认证',
      myLikes: '我的喜欢',
      datingHistory: '交往记录',
      aboutUs: '关于我们',
      settingsPage: '设置',
      // 图片轮播区域
      userPhoto: '用户照片',
      // 用户信息
      location: '中国',
      gender: '女',
      ipAddress: 'IP地址: 中国上海',
      // 兴趣标签
      interests: {
        food: '#美食',
        sports: '#运动',
        gaming: '#游戏',
        music: '#音乐',
        nature: '#大自然',
      },
    },
    vip: {
      title: '充值VIP获得更多特权',
      privileges: 'VIP特权',
    },
  },
  'en-US': {
    common: {
      loading: 'Loading...',
    },
    gallery: {
      noItems: 'No items available',
    },
    navigation: {
      home: 'Home',
      match: 'Match',
      messages: 'Messages',
      my: 'My',
    },
    home: {
      title: 'Welcome to PWA App',
      subtitle: 'This is a modern Progressive Web Application',
    },
    match: {
      placeholder: 'Enter search keywords...',
    },
    filters: {
      select: 'Select filter',
      all: 'All',
      newest: 'Newest',
      popular: 'Popular',
      apply: 'Apply',
    },
    favorites: {
      title: 'My Favorites',
    },
    profile: {
      title: 'Profile',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      about: 'About',
      // 个人资料页面新增翻译
      unverified: 'Unverified',
      myLikes: 'My Likes',
      datingHistory: 'Dating History',
      aboutUs: 'About Us',
      settingsPage: 'Settings',
      // 图片轮播区域
      userPhoto: 'User Photo',
      // 用户信息
      location: 'China',
      gender: 'Female',
      ipAddress: 'IP: Shanghai, China',
      // 兴趣标签
      interests: {
        food: '#Food',
        sports: '#Sports',
        gaming: '#Gaming',
        music: '#Music',
        nature: '#Nature',
      },
    },
    vip: {
      title: 'Recharge VIP for More Privileges',
      privileges: 'VIP Benefits',
    },
  },
  'ja-JP': {
    common: {
      loading: '読み込み中...',
    },
    gallery: {
      noItems: 'アイテムがありません',
    },
    navigation: {
      home: 'ホーム',
      match: 'マッチ',
      messages: 'メッセージ',
      my: 'マイ',
    },
    home: {
      title: 'PWAアプリへようこそ',
      subtitle: 'これはモダンなプログレッシブWebアプリケーションです',
    },
    match: {
      placeholder: '検索キーワードを入力...',
    },
    filters: {
      select: 'フィルターを選択',
      all: 'すべて',
      newest: '最新',
      popular: '人気',
      apply: '適用',
    },
    favorites: {
      title: 'マイお気に入り',
    },
    profile: {
      title: 'プロフィール',
      settings: '設定',
      language: '言語',
      theme: 'テーマ',
      notifications: '通知',
      about: 'について',
      // 个人资料页面新增翻译
      unverified: '未認証',
      myLikes: 'いいね',
      datingHistory: '交際履歴',
      aboutUs: '私たちについて',
      settingsPage: '設定',
      // 图片轮播区域
      userPhoto: 'ユーザー写真',
      // 用户信息
      location: '中国',
      gender: '女性',
      ipAddress: 'IP: 中国上海',
      // 兴趣标签
      interests: {
        food: '#美食',
        sports: '#スポーツ',
        gaming: '#ゲーム',
        music: '#音楽',
        nature: '#自然',
      },
    },
    vip: {
      title: 'VIPを充電して特典を増やす',
      privileges: 'VIP特典',
    },
  },
};