import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send, User, Headphones } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'service'
  timestamp: Date
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是官方客服，有什么可以帮助您的吗？',
      sender: 'service',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  // 发送消息
  const handleSendMessage = () => {
    if (inputText.trim() === '') return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // 模拟客服回复
    setTimeout(() => {
      const serviceReply: Message = {
        id: (Date.now() + 1).toString(),
        text: '感谢您的咨询，我会尽快为您处理这个问题。',
        sender: 'service',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, serviceReply])
    }, 1000)
  }

  // 处理输入框按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full">

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* 客服头像 */}
            {message.sender === 'service' && (
              <Avatar className="shrink-0">
                <AvatarImage src="/service-avatar.jpg" alt="客服" />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Headphones className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* 消息内容 */}
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user'
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
            
            {/* 用户头像 */}
            {message.sender === 'user' && (
              <Avatar className="shrink-0">
                <AvatarImage src="/user-avatar.jpg" alt="用户" />
                <AvatarFallback className="bg-green-100 text-green-600">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t p-4 bg-background">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button 
            onClick={handleSendMessage}
            size="icon"
            disabled={inputText.trim() === ''}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}