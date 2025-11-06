import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSafeNavigate } from '../../hooks/useSafeNavigate'

// 实名认证页面组件
export function VerificationPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { back } = useSafeNavigate()
  
  // 表单状态
  const [name, setName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [selectedIdType, setSelectedIdType] = useState('id_card')
  const [agreedToTerms, setAgreedToTerms] = useState(false)



  // 提交认证申请
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    if (!name.trim()) {
      alert('请输入真实姓名')
      return
    }
    
    if (!idNumber.trim()) {
      alert('请输入证件号码')
      return
    }
    
    if (!agreedToTerms) {
      alert('请同意服务条款和隐私政策')
      return
    }
    
    // 这里可以实现提交认证信息的逻辑
    console.log('提交认证信息:', { name, idNumber, selectedIdType })
    
    // 模拟提交成功
    alert('认证信息提交成功，请等待审核')
    back() // 使用带保底的返回方法
  }

  return (
    <div className="flex flex-col h-full bg-background p-4">

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto p-4">
        {/* 认证说明 */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-2">认证说明</h2>
          <p className="text-sm text-muted-foreground mb-2">
            为了保障用户的账号安全和平台秩序，请完成实名认证。我们将严格保护您的个人信息安全。
          </p>
          <p className="text-xs text-red-500">
            注意：请确保提供真实有效的身份信息，虚假信息将影响您的账号使用。
          </p>
        </div>

        {/* 认证表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 证件类型选择 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              证件类型
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input 
                  type="radio" 
                  name="idType" 
                  value="id_card" 
                  checked={selectedIdType === 'id_card'}
                  onChange={() => setSelectedIdType('id_card')}
                  className="mr-3 text-primary"
                />
                <span className="text-sm text-foreground">身份证</span>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input 
                  type="radio" 
                  name="idType" 
                  value="passport" 
                  checked={selectedIdType === 'passport'}
                  onChange={() => setSelectedIdType('passport')}
                  className="mr-3 text-primary"
                />
                <span className="text-sm text-foreground">护照</span>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input 
                  type="radio" 
                  name="idType" 
                  value="other" 
                  checked={selectedIdType === 'other'}
                  onChange={() => setSelectedIdType('other')}
                  className="mr-3 text-primary"
                />
                <span className="text-sm text-foreground">其他证件</span>
              </label>
            </div>
          </div>

          {/* 真实姓名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              真实姓名
            </label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的真实姓名"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* 证件号码 */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-foreground mb-2">
              证件号码
            </label>
            <input 
              type="text" 
              id="idNumber" 
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={selectedIdType === 'id_card' ? "请输入18位身份证号码" : "请输入证件号码"}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* 上传证件照片 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              上传证件照片
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-sm text-muted-foreground">正面照</span>
                  <span className="text-xs text-muted-foreground mt-2">点击上传</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-sm text-muted-foreground">反面照</span>
                  <span className="text-xs text-muted-foreground mt-2">点击上传</span>
                </div>
              </div>
            </div>
          </div>

          {/* 服务条款同意 */}
          <div className="flex items-start mt-6">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 mr-3 text-primary"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              我已阅读并同意
              <span className="text-primary ml-1">《服务条款》</span>
              和
              <span className="text-primary ml-1">《隐私政策》</span>
              ，并同意平台收集和使用我的个人信息用于实名认证。
            </label>
          </div>

          {/* 提交按钮 */}
          <button 
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            提交认证
          </button>
        </form>
      </div>
    </div>
  )
}