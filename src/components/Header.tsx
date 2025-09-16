import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Compass, 
  User, 
  BarChart3,
  Shield,
  ChevronDown,
  Languages,
  Target,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useClerk } from "@clerk/clerk-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, translate } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "nav.home", path: "/", icon: Compass },
    { label: "nav.assessment", path: "/profile", icon: User },
    { label: "nav.results", path: "/results", icon: BarChart3 },
    { label: "nav.opportunities", path: "/opportunities", icon: Target },
    { label: "nav.resume", path: "/resume-builder", icon: Shield }
  ];

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu' as Language, name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml' as Language, name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'or' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'as' as Language, name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'ur' as Language, name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img 
              src="/lovable-uploads/b59b9ebf-45c8-4202-854a-64d32ac843ae.png" 
              alt="SkillMap.AI Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SkillMap.ai
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="relative"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {translate(item.label, item.label)}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-4 w-4" />
                  <span className="sr-only">Switch language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto bg-background border shadow-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer transition-colors hover:bg-accent/20 ${language === lang.code ? 'bg-accent/30' : ''}`}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-xs text-muted-foreground">({lang.name})</span>
                      </span>
                      {language === lang.code && <span className="ml-2 text-primary">✓</span>}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative overflow-hidden"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Logout Button - Desktop */}
            <Button
              variant="default"
              size="sm"
              onClick={() => signOut()}
              className="hidden sm:inline-flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {translate('nav.logout', 'Logout')}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {translate(item.label, item.label)}
                </Button>
              ))}
              <div className="pt-2 border-t border-border/40">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {translate('nav.logout', 'Logout')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;