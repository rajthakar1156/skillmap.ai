import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'gu' as Language, name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' },
    { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml' as Language, name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'pa' as Language, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'as' as Language, name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'ur' as Language, name: 'Urdu', nativeName: 'اردو' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="flex items-center justify-between w-full">
              <span>{lang.nativeName}</span>
              {language === lang.code && <span className="ml-2">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;