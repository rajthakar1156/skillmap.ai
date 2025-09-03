import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'gu' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, fallback?: string) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.assessment': 'Assessment',
    'nav.results': 'Results',
    'nav.resume': 'Resume Builder',
    'nav.opportunities': 'Opportunities',
    'nav.start': 'Start Assessment',
    
    // Hero Section
    'hero.title': 'Discover Your Perfect Career with AI',
    'hero.subtitle': 'Get personalized career recommendations powered by advanced AI. Designed specifically for Indian students to navigate the modern job market with confidence.',
    'hero.cta.analysis': 'Start Free Analysis',
    'hero.cta.explore': 'Explore Resources',
    'hero.stats.students': '50,000+ Students Guided',
    'hero.stats.careers': '500+ Career Paths',
    'hero.stats.accuracy': '98% Accuracy Rate',
    
    // Features
    'features.title': 'Why Choose SkillMap.ai?',
    'features.subtitle': 'Advanced AI technology meets deep understanding of the Indian education and job market',
    'features.analysis.title': 'Personalized Analysis',
    'features.analysis.desc': 'AI-powered career matching based on your unique academic profile, interests, and personality traits.',
    'features.insights.title': 'India-Focused Insights',
    'features.insights.desc': 'Salary ranges, job demand, and growth prospects specifically relevant to the Indian job market.',
    'features.connections.title': 'Industry Connections',
    'features.connections.desc': 'Connect your skills with top sectors and companies actively hiring in India.',
    
    // Opportunities
    'opportunities.title': 'Opportunities for You',
    'opportunities.subtitle': 'Discover scholarships, internships, and hackathons tailored to your profile',
    'opportunities.filter.all': 'All Types',
    'opportunities.filter.scholarship': 'Scholarships',
    'opportunities.filter.internship': 'Internships',
    'opportunities.filter.hackathon': 'Hackathons',
    'opportunities.sort.deadline': 'Sort by Deadline',
    'opportunities.sort.relevance': 'Sort by Relevance',
    'opportunities.recommended': 'Recommended for You',
    'opportunities.deadline': 'Deadline',
    'opportunities.apply': 'Apply Now',
    'opportunities.noResults': 'No opportunities found for the selected filters.'
  },
  hi: {
    // Navigation - Hindi
    'nav.home': 'होम',
    'nav.assessment': 'आकलन',
    'nav.results': 'परिणाम',
    'nav.resume': 'रिज्यूमे बिल्डर',
    'nav.opportunities': 'अवसर',
    'nav.start': 'आकलन शुरू करें',
    
    // Hero Section - Hindi
    'hero.title': 'AI के साथ अपना सही करियर खोजें',
    'hero.subtitle': 'उन्नत AI द्वारा संचालित व्यक्तिगत करियर सिफारिशें प्राप्त करें। विशेष रूप से भारतीय छात्रों के लिए डिज़ाइन किया गया।',
    'hero.cta.analysis': 'मुफ्त विश्लेषण शुरू करें',
    'hero.cta.explore': 'संसाधन खोजें',
    'hero.stats.students': '50,000+ छात्र मार्गदर्शित',
    'hero.stats.careers': '500+ करियर पथ',
    'hero.stats.accuracy': '98% सटीकता दर',
    
    // Opportunities - Hindi
    'opportunities.title': 'आपके लिए अवसर',
    'opportunities.subtitle': 'अपनी प्रोफाइल के अनुसार छात्रवृत्ति, इंटर्नशिप और हैकाथॉन खोजें',
    'opportunities.filter.all': 'सभी प्रकार',
    'opportunities.filter.scholarship': 'छात्रवृत्ति',
    'opportunities.filter.internship': 'इंटर्नशिप',
    'opportunities.filter.hackathon': 'हैकाथॉन',
    'opportunities.recommended': 'आपके लिए सुझाया गया',
    'opportunities.deadline': 'अंतिम तिथि',
    'opportunities.apply': 'अभी आवेदन करें'
  },
  gu: {
    // Navigation - Gujarati  
    'nav.home': 'હોમ',
    'nav.assessment': 'મૂલ્યાંકન',
    'nav.results': 'પરિણામો',
    'nav.resume': 'રિઝ્યુમે બિલ્ડર',
    'nav.opportunities': 'તકો',
    'nav.start': 'મૂલ્યાંકન શરૂ કરો',
    
    // Hero Section - Gujarati
    'hero.title': 'AI સાથે તમારી સંપૂર્ણ કારકિર્દી શોધો',
    'hero.subtitle': 'અદ્યતન AI દ્વારા સંચાલિત વ્યક્તિગત કારકિર્દી સિફારિશો મેળવો। ખાસ કરીને ભારતીય વિદ્યાર્થીઓ માટે ડિઝાઇન કરેલ.',
    'hero.cta.analysis': 'મફત વિશ્લેષણ શરૂ કરો',
    'hero.cta.explore': 'સંસાધનો અન્વેષણ કરો',
    
    // Opportunities - Gujarati
    'opportunities.title': 'તમારા માટે તકો',
    'opportunities.subtitle': 'તમારી પ્રોફાઇલ મુજબ શિષ્યવૃત્તિ, ઇન્ટર્નશિપ અને હેકાથોન શોધો',
    'opportunities.filter.scholarship': 'શિષ્યવૃત્તિ',
    'opportunities.filter.internship': 'ઇન્ટર્નશિપ',
    'opportunities.filter.hackathon': 'હેકાથોન',
    'opportunities.recommended': 'તમારા માટે ભલામણ કરેલ',
    'opportunities.apply': 'અત્યારે અરજી કરો'
  },
  ta: {
    // Navigation - Tamil
    'nav.home': 'முகப்பு',
    'nav.assessment': 'மதிப்பீடு',
    'nav.results': 'முடிவுகள்',
    'nav.resume': 'ரெஸ்யூமே பில்டர்',
    'nav.opportunities': 'வாய்ப்புகள்',
    'nav.start': 'மதிப்பீடு தொடங்கு',
    
    // Hero Section - Tamil
    'hero.title': 'AI மூலம் உங்கள் சரியான தொழிலை கண்டறியுங்கள்',
    'hero.subtitle': 'மேம்பட்ட AI மூலம் தனிப்பயனாக்கப்பட்ட தொழில் பரிந்துரைகளைப் பெறுங்கள். குறிப்பாக இந்திய மாணவர்களுக்காக வடிவமைக்கப்பட்டது.',
    'hero.cta.analysis': 'இலவச பகுப்பாய்வு தொடங்கு',
    'hero.cta.explore': 'வளங்களை ஆராயுங்கள்',
    
    // Opportunities - Tamil
    'opportunities.title': 'உங்களுக்கான வாய்ப்புகள்',
    'opportunities.subtitle': 'உங்கள் சுயவிவரத்திற்கு ஏற்ப உதவித்தொகை, பயிற்சி மற்றும் ஹேக்கத்தான் கண்டறியுங்கள்',
    'opportunities.filter.scholarship': 'உதவித்தொகை',
    'opportunities.filter.internship': 'பயிற்சி',
    'opportunities.filter.hackathon': 'ஹேக்கத்தான்',
    'opportunities.recommended': 'உங்களுக்கு பரிந்துரைக்கப்பட்டது',
    'opportunities.apply': 'இப்போது விண்ணப்பிக்க'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('skillmap-language');
    return (stored as Language) || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('skillmap-language', newLanguage);
  };

  const translate = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  useEffect(() => {
    // Load language preference on mount
    const stored = localStorage.getItem('skillmap-language');
    if (stored && stored !== language) {
      setLanguageState(stored as Language);
    }
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    translate,
    isTranslating
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};