import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';
import { useSafeNavigate } from '../hooks/useSafeNavigate';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { LanguageSelector } from '../components/LanguageSelector';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const [isAgreed, setIsAgreed] = useState(false);
  const { back, to } = useSafeNavigate();

  // Google登录处理
  const handleGoogleLogin = () => {
    if (!isAgreed) return;
    // 实际项目中应实现Google OAuth登录逻辑
    console.log('Google login clicked');
  };

  // 手机号登录处理
  const handlePhoneLogin = () => {
    if (!isAgreed) return;
    // 实际项目中应跳转到手机号验证页面
    console.log('Phone login clicked');
    // 登录成功后跳转到首页
    to('/');
  };

  // 显示更多选项
  const handleShowMoreOptions = () => {
    // 实际项目中可显示邮箱登录等其他选项
    console.log('Show more options clicked');
  };

  // 返回或关闭登录页 - 使用带保底逻辑的返回方法
  const handleClose = () => {
    back(); // 使用带保底的返回方法，自动处理是否有上一页
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-white">
      {/* 顶部控制栏 */}
      <div className="flex justify-between items-center mt-4 mb-8">
        <button 
          onClick={handleClose} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="关闭"
        >
          <X size={20} className="text-gray-500" />
        </button>
        
        {/* 语言选择器 */}
        <LanguageSelector />
      </div>

      {/* 主体内容区 - 优化垂直间距 */}
      <div className="grow flex flex-col items-center max-w-md mx-auto w-full">
        {/* Logo区域 - 减少底部间距 */}
        <div className="mb-12 flex justify-center">
          <div className="w-36 h-20 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-gray-500 text-lg">图标</span>
          </div>
        </div>

        {/* 登录选项按钮 - 调整间距 */}
        <div className="w-full space-y-4 mb-8">
          <Button
            onClick={handleGoogleLogin}
            disabled={!isAgreed}
            variant="secondary"
            size="lg"
            className="w-full py-5 h-auto text-base"
          >
            通过Google继续
          </Button>

          <Button
            onClick={handlePhoneLogin}
            disabled={!isAgreed}
            variant="secondary"
            size="lg"
            className="w-full py-5 h-auto text-base"
          >
            通过手机继续
          </Button>

          <Button
            onClick={handleShowMoreOptions}
            variant="ghost"
            className="w-full text-base"
          >
            显示更多选项
          </Button>
        </div>

        {/* 用户协议同意 - 更紧凑布局 */}
      <div className="w-full mb-8">
        <Label className="flex items-center cursor-pointer w-full justify-center">
          <Checkbox
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            className="mr-2"
          />
          <span className="text-xs text-gray-500">
            我已阅读并同意xxx的用户协议和隐私政策
          </span>
        </Label>
      </div>
      </div>
      
      {/* 添加底部信息区域，填充空白 */}
      <div className="mt-auto text-center text-xs text-gray-400 pb-4">
        <p>© 2023 应用名称 - 保留所有权利</p>
      </div>
    </div>
  );
};