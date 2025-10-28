import { useLanguage } from '../../../hooks/useLanguage';
import type { Language } from '../../../lib/i18nConfig';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className = '' }: LanguageSelectorProps) => {
  const { currentLanguage, supportedLanguages, changeLanguage, getDisplayName, isLoading } = useLanguage();

  const handleLanguageChange = (language: Language) => {
    if (language !== currentLanguage) {
      changeLanguage(language);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Select
        value={currentLanguage}
        onValueChange={(value: Language) => handleLanguageChange(value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getDisplayName(currentLanguage)} />
        </SelectTrigger>
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language} value={language}>
              {getDisplayName(language)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
