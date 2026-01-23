'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
