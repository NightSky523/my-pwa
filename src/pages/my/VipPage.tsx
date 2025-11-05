import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// VIP价格计划类型定义
interface PricingPlan {
  duration: number; // 月数
  monthlyPrice: number; // 每月价格
  originalPrice: number; // 原价
  discount: number; // 折扣百分比
}

// VIP特权类型定义
interface VipFeature {
  title: string;
  description: string;
}

// VIP等级类型定义
interface VipLevel {
  level: string;
  name: string;
  active?: boolean;
}

export function VipPage() {
  const { t } = useTranslation();
  
  // VIP等级数据
  const vipLevels: VipLevel[] = [
    { level: 'VIP 1', name: '普通会员' },
    { level: 'VIP 2', name: '黄金会员', active: true },
    { level: 'VIP 3', name: '钻石会员' },
  ];
  
  // 价格计划数据
  const pricingPlans: PricingPlan[] = [
    { duration: 1, monthlyPrice: 12, originalPrice: 12, discount: 0 },
    { duration: 3, monthlyPrice: 10, originalPrice: 36, discount: 17 },
    { duration: 12, monthlyPrice: 8.17, originalPrice: 144, discount: 32 },
  ];
  
  // VIP特权数据
  const vipFeatures: VipFeature[] = [
    { title: '功能点', description: '查看更多匹配用户' },
    { title: '功能点', description: '优先展示个人资料' },
    { title: '功能点', description: '发送无限消息' },
  ];
  
  // 选中的计划索引
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1); // 默认选中3个月
  
  // 计算总价
  const calculateTotalPrice = (plan: PricingPlan) => {
    return Math.round(plan.monthlyPrice * plan.duration * 100) / 100;
  };
  

  
  // 购买按钮处理函数
  const handlePurchase = () => {
    // 这里可以添加购买逻辑
    alert('购买功能暂未实现');
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overflow-x-hidden">
    
      <div className="flex-1 p-4 space-y-6">
        {/* VIP等级选择器 */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            {vipLevels.map((level, index) => (
              <div 
                key={index}
                className={`flex-1 text-center py-3 px-2 rounded-lg transition-all ${level.active ? 'bg-primary text-primary-foreground font-medium' : 'bg-secondary text-muted-foreground'}`}
              >
                <p className="text-sm font-bold">{level.level}</p>
                <p className="text-xs">{level.name}</p>
              </div>
            ))}
          </div>
          
          {/* 小圆点指示器 */}
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map((dot) => (
              <div 
                key={dot} 
                className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? 'bg-primary' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
        
        {/* 价格计划选择 */}
        <div className="grid grid-cols-3 gap-3">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${index === selectedPlanIndex ? 'border-2 border-primary bg-primary/5' : 'bg-card'}`}
              onClick={() => setSelectedPlanIndex(index)}
            >
              <p className="text-lg font-bold">{plan.duration}</p>
              <p className="text-sm text-muted-foreground">个月</p>
              {plan.discount > 0 && (
                <p className="text-xs text-red-500 mt-1">节省{plan.discount}%</p>
              )}
              <p className="mt-2 text-sm">¥{plan.monthlyPrice}/月</p>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          自动续订，随时取消；xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx。
        </p>
        
        {/* VIP特权列表 */}
        <div>
          <h2 className="text-lg font-bold mb-3">{t('vip.privileges')}</h2>
          <div className="space-y-3">
            {vipFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start p-3 bg-card rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 底部购买按钮 */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        <button 
          onClick={handlePurchase}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors"
        >
          ¥{calculateTotalPrice(pricingPlans[selectedPlanIndex])} 立即购买
          {selectedPlanIndex > 0 && (
            <span className="text-xs ml-1">已优惠¥{pricingPlans[selectedPlanIndex].originalPrice - calculateTotalPrice(pricingPlans[selectedPlanIndex])}</span>
          )}
        </button>
      </div>
    </div>
  );
}