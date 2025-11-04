import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// 主题选项
const themeOptions = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
] as const;

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-2">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex items-center justify-between p-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label={`切换到${option.label}主题`}
          >
            <div className="flex items-center space-x-3">
              <Icon size={18} />
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            {isActive && (
              <div className="w-4 h-4 rounded-full bg-primary-foreground flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;