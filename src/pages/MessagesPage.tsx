import { Button } from '@/components/ui/button'

export function MessagesPage() {
  // 处理进入聊天按钮点击事件
  const handleStartChat = () => {
    // 这里可以添加进入聊天的逻辑
    console.log('进入聊天')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* 客服图标 */}
      <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-8">
        <span className="text-gray-500 text-lg">客服图标</span>
      </div>
      
      {/* 标题和副标题 */}
      <h1 className="text-2xl font-bold text-foreground mb-2">官方客服</h1>
      <p className="text-muted-foreground mb-12">点击联系客服</p>
      
      {/* 进入聊天按钮 */}
      <Button 
        onClick={handleStartChat}
        variant="secondary"
        size="lg"
        className="px-8"
      >
        进入聊天
      </Button>
    </div>
  )
}