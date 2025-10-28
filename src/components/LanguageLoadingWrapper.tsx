import React from 'react';
import LoadingScreen from './LoadingScreen';
import { useLanguageLoadingState } from '../hooks/useLanguage';

interface LanguageLoadingWrapperProps {
  children: React.ReactNode;
}

const LanguageLoadingWrapper: React.FC<LanguageLoadingWrapperProps> = ({ children }) => {
  const { isLoading } = useLanguageLoadingState();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default LanguageLoadingWrapper;