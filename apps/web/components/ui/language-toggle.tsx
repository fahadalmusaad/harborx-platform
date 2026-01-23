'use client';

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract current locale from pathname
  const currentLocale = pathname.startsWith('/ar') ? 'ar' : 'en';
  const newLocale = currentLocale === 'en' ? 'ar' : 'en';

  const handleToggle = () => {
    // Remove current locale prefix and add new one
    let newPath = pathname.replace(/^\/(en|ar)/, '');
    newPath = `/${newLocale}${newPath || '/'}`;
    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle language"
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">
        {currentLocale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      </span>
    </Button>
  );
}
