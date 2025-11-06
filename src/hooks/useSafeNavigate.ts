import { useNavigate } from 'react-router-dom';

/**
 * 带保底逻辑的导航Hook
 * 当使用back()返回上一页时，如果没有上一页历史记录，则自动跳转到首页
 */
export const useSafeNavigate = () => {
  const navigate = useNavigate();

  /**
   * 返回上一页，如果没有上一页则跳转到首页
   * @param fallbackPath 保底路径，默认为首页
   */
  const back = (fallbackPath: string = '/') => {
    // 检查历史记录长度，通常大于2才有可靠的上一页
    if (window.history.length <= 2) {
      navigate(fallbackPath); // 跳转到保底路径
    } else {
      navigate(-1); // 返回上一页
    }
  };

  /**
   * 跳转到指定路径
   * @param path 目标路径
   * @param options 导航选项
   */
  const to = (path: string, options?: any) => {
    navigate(path, options);
  };

  // 返回原始navigate函数以便处理其他导航场景
  return {
    navigate,
    back,
    to
  };
};