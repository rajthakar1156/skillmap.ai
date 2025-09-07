import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'gu' | 'ta' | 'bn' | 'te' | 'mr' | 'kn' | 'ml' | 'or' | 'pa' | 'as' | 'ur';

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
    
    // Voice Interface
    'voice.startListening': 'Start Voice Query',
    'voice.stopListening': 'Stop Listening',
    'voice.listening': 'Listening...',
    'voice.processing': 'Processing your query...',
    'voice.placeholder': 'Ask me about your career path, like "Suggest careers for AI and math"',
    'voice.error': 'Voice recognition not available in your browser',
    'voice.error.process': 'Sorry, I couldn\'t process your request. Please try again.',
    'voice.noSpeech': 'No speech detected. Please try again.',
    'voice.speaking': 'Speaking recommendations...',
    'voice.fallback': 'Use Text Instead',
    'voice.fallback.title': 'Type your question instead:',
    
    // AI Recommendations
    'ai.recommendation': 'Based on your interest in AI, I recommend exploring careers as a Machine Learning Engineer, Data Scientist, or AI Research Scientist. These fields offer excellent growth prospects with average salaries ranging from ₹8-25 lakhs per year in India.',
    'math.recommendation': 'With strong mathematics skills, you could excel as a Data Analyst, Quantitative Analyst, or Operations Research Analyst. The finance and tech sectors highly value mathematical expertise.',
    'programming.recommendation': 'Programming skills open doors to Software Engineering, Web Development, and Mobile App Development. With India\'s booming tech industry, these careers offer great opportunities.',
    'general.recommendation': 'I\'d be happy to help you explore career options! Could you tell me more about your interests, subjects you enjoy, or skills you have? This will help me provide more personalized recommendations.',
    
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
    'opportunities.noResults': 'No opportunities found for the selected filters.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    
    // Additional Recommendations
    'business.recommendation': 'Business and management skills can lead to careers in Product Management, Business Analysis, or Consulting. These roles are in high demand across industries with salaries ranging from ₹6-20 lakhs per year.',
    'creative.recommendation': 'Creative skills can be channeled into UI/UX Design, Graphic Design, or Digital Marketing. The creative industry in India is growing rapidly with new opportunities emerging.',
    
    // Voice Opportunities
    'voice.askAboutOpportunities': 'Ask About Opportunities',
    'opportunities.voice.scholarship': 'I found several scholarships for you! The top ones include KVPY Fellowship and JN Tata Endowment. These offer financial support for your education and research pursuits.',
    'opportunities.voice.internship': 'There are great internship opportunities available! Google Summer of Code is highly recommended for programming students, offering mentorship and stipend.',
    'opportunities.voice.hackathon': 'I found exciting hackathons! Smart India Hackathon and Microsoft Imagine Cup are great for showcasing your innovation skills with substantial prize money.',
    'opportunities.voice.general': 'Based on your profile, I\'ve found several recommended opportunities across scholarships, internships, and hackathons. Would you like me to tell you about a specific type?',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.assessment': 'आकलन',
    'nav.results': 'परिणाम',
    'nav.resume': 'रिज्यूमे बिल्डर',
    'nav.opportunities': 'अवसर',
    'nav.start': 'आकलन शुरू करें',
    
    // Hero Section
    'hero.title': 'AI के साथ अपना सही करियर खोजें',
    'hero.subtitle': 'उन्नत AI द्वारा संचालित व्यक्तिगत करियर सिफारिशें प्राप्त करें। विशेष रूप से भारतीय छात्रों के लिए डिज़ाइन किया गया।',
    'hero.cta.analysis': 'मुफ्त विश्लेषण शुरू करें',
    'hero.cta.explore': 'संसाधन खोजें',
    'hero.stats.students': '50,000+ छात्र मार्गदर्शित',
    'hero.stats.careers': '500+ करियर पथ',
    'hero.stats.accuracy': '98% सटीकता दर',
    
    // Features
    'features.title': 'SkillMap.ai क्यों चुनें?',
    'features.subtitle': 'उन्नत AI तकनीक भारतीय शिक्षा और जॉब मार्केट की गहरी समझ से मिलती है',
    'features.analysis.title': 'व्यक्तिगत विश्लेषण',
    'features.analysis.desc': 'आपकी अनूठी शैक्षणिक प्रोफाइल, रुचियों और व्यक्तित्व लक्षणों के आधार पर AI-संचालित करियर मिलान।',
    'features.insights.title': 'भारत-केंद्रित अंतर्दृष्टि',
    'features.insights.desc': 'वेतन श्रेणी, नौकरी की मांग, और विकास की संभावनाएं विशेष रूप से भारतीय जॉब मार्केट के लिए प्रासंगिक।',
    'features.connections.title': 'उद्योग कनेक्शन',
    'features.connections.desc': 'अपने कौशल को भारत में सक्रिय रूप से भर्ती करने वाले शीर्ष क्षेत्रों और कंपनियों के साथ जोड़ें।',
    
    // Voice Interface
    'voice.startListening': 'वॉयस क्वेरी शुरू करें',
    'voice.stopListening': 'सुनना बंद करें',
    'voice.listening': 'सुन रहे हैं...',
    'voice.processing': 'आपकी क्वेरी प्रोसेस कर रहे हैं...',
    'voice.placeholder': 'मुझसे अपने करियर पथ के बारे में पूछें, जैसे "AI और गणित के लिए करियर सुझाएं"',
    'voice.error': 'आपके ब्राउज़र में वॉयस रिकग्निशन उपलब्ध नहीं है',
    'voice.error.process': 'खुशी की बात है, मैं आपके अनुरोध को प्रोसेस नहीं कर सका। कृपया पुनः प्रयास करें।',
    'voice.noSpeech': 'कोई भाषण का पता नहीं चला। कृपया पुनः प्रयास करें।',
    'voice.speaking': 'सिफारिशें बोल रहे हैं...',
    'voice.fallback': 'बजाय टेक्स्ट का उपयोग करें',
    'voice.fallback.title': 'बजाय अपना प्रश्न टाइप करें:',
    
    // AI Recommendations
    'ai.recommendation': 'AI में आपकी रुचि के आधार पर, मैं मशीन लर्निंग इंजीनियर, डेटा साइंटिस्ट, या AI रिसर्च साइंटिस्ट के रूप में करियर खोजने की सलाह देता हूं। ये क्षेत्र भारत में ₹8-25 लाख प्रति वर्ष की औसत वेतन के साथ उत्कृष्ट विकास संभावनाएं प्रदान करते हैं।',
    'math.recommendation': 'मजबूत गणित कौशल के साथ, आप डेटा एनालिस्ट, क्वांटिटेटिव एनालिस्ट, या ऑपरेशन्स रिसर्च एनालिस्ट के रूप में उत्कृष्ट हो सकते हैं। वित्त और तकनीकी क्षेत्र गणितीय विशेषज्ञता को बहुत महत्व देते हैं।',
    'programming.recommendation': 'प्रोग्रामिंग कौशल सॉफ्टवेयर इंजीनियरिंग, वेब डेवलपमेंट, और मोबाइल ऐप डेवलपमेंट के दरवाजे खोलते हैं। भारत के बूमिंग टेक इंडस्ट्री के साथ, ये करियर बहुत बेहतरीन अवसर प्रदान करते हैं।',
    'business.recommendation': 'व्यवसाय और प्रबंधन कौशल उत्पाद प्रबंधन, व्यवसाय विश्लेषण, या परामर्श में करियर की ओर ले जा सकते हैं। ये भूमिकाएं उद्योगों में उच्च मांग में हैं।',
    'creative.recommendation': 'रचनात्मक कौशल को UI/UX डिज़ाइन, ग्राफिक डिज़ाइन, या डिजिटल मार्केटिंग में चैनल किया जा सकता है। भारत में रचनात्मक उद्योग तेजी से ब रहा है।',
    'general.recommendation': 'मैं आपको करियर विकल्प खोजने में मदद करने के लिए खुश हूं! क्या आप मुझे अपनी रुचियों, पसंदीदा विषयों, या कौशल के बारे में और बता सकते हैं?',
    
    // Opportunities
    'opportunities.title': 'आपके लिए अवसर',
    'opportunities.subtitle': 'अपनी प्रोफाइल के अनुसार छात्रवृत्ति, इंटर्नशिप और हैकाथॉन खोजें',
    'opportunities.filter.all': 'सभी प्रकार',
    'opportunities.filter.scholarship': 'छात्रवृत्ति',
    'opportunities.filter.internship': 'इंटर्नशिप',
    'opportunities.filter.hackathon': 'हैकाथॉन',
    'opportunities.sort.deadline': 'समय सीमा के अनुसार क्रमबद्ध करें',
    'opportunities.sort.relevance': 'प्रासंगिकता के अनुसार क्रमबद्ध करें',
    'opportunities.recommended': 'आपके लिए सुझाया गया',
    'opportunities.deadline': 'अंतिम तिथि',
    'opportunities.apply': 'अभी आवेदन करें',
    'opportunities.noResults': 'चयनित फिल्टर के लिए कोई अवसर नहीं मिला।',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एक त्रुटि हुई',
    'common.retry': 'पुनः प्रयास करें',
    'common.close': 'बंद करें',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.submit': 'जमा करें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.finish': 'समाप्त करें'
  },
  gu: {
    // Navigation
    'nav.home': 'હોમ',
    'nav.assessment': 'મૂલ્યાંકન',
    'nav.results': 'પરિણામો',
    'nav.resume': 'રિઝ્યુમે બિલ્ડર',
    'nav.opportunities': 'તકો',
    'nav.start': 'મૂલ્યાંકન શરૂ કરો',
    
    // Hero Section
    'hero.title': 'AI સાથે તમારી સંપૂર્ણ કારકિર્દી શોધો',
    'hero.subtitle': 'અદ્યતન AI દ્વારા સંચાલિત વ્યક્તિગત કારકિર્દી સિફારિશો મેળવો। ખાસ કરીને ભારતીય વિદ્યાર્થીઓ માટે ડિઝાઇન કરેલ.',
    'hero.cta.analysis': 'મફત વિશ્લેષણ શરૂ કરો',
    'hero.cta.explore': 'સંસાધનો અન્વેષણ કરો',
    'hero.stats.students': '50,000+ વિદ્યાર્થીઓને માર્ગદર્શન',
    'hero.stats.careers': '500+ કારકિર્દીના રસ્તાઓ',
    'hero.stats.accuracy': '98% ચોકસાઈ દર',
    
    // Voice Interface
    'voice.startListening': 'વૉઇસ ક્વેરી શરૂ કરો',
    'voice.stopListening': 'સાંભળવાનું બંધ કરો',
    'voice.listening': 'સાંભળી રહ્યાં છીએ...',
    'voice.processing': 'તમારી ક્વેરી પ્રોસેસ કરી રહ્યાં છીએ...',
    'voice.placeholder': 'મને તમારા કારકિર્દીના રસ્તા વિશે પૂછો, જેમ કે "AI અને ગણિત માટે કારકિર્દી સૂચવો"',
    'voice.error': 'તમારા બ્રાઉઝરમાં વૉઇસ રિકગ્નિશન ઉપલબ્ધ નથી',
    'voice.noSpeech': 'કોઈ વાણીનું પ્રમાણ મળ્યું નથી. કૃપા કરીને ફરી પ્રયાસ કરો.',
    'voice.speaking': 'સિફારિશો બોલી રહ્યાં છીએ...',
    
    // Opportunities
    'opportunities.title': 'તમારા માટે તકો',
    'opportunities.subtitle': 'તમારી પ્રોફાઇલ મુજબ શિષ્યવૃત્તિ, ઇન્ટર્નશિપ અને હેકાથોન શોધો',
    'opportunities.filter.all': 'બધા પ્રકારના',
    'opportunities.filter.scholarship': 'શિષ્યવૃત્તિ',
    'opportunities.filter.internship': 'ઇન્ટર્નશિપ',
    'opportunities.filter.hackathon': 'હેકાથોન',
    'opportunities.recommended': 'તમારા માટે ભલામણ કરેલ',
    'opportunities.deadline': 'છેલ્લી તારીખ',
    'opportunities.apply': 'અત્યારે અરજી કરો'
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.assessment': 'மதிப்பீடு',
    'nav.results': 'முடிவுகள்',
    'nav.resume': 'ரெஸ்யூமே பில்டர்',
    'nav.opportunities': 'வாய்ப்புகள்',
    'nav.start': 'மதிப்பீடு தொடங்கு',
    
    // Hero Section
    'hero.title': 'AI மூலம் உங்கள் சரியான தொழிலை கண்டறியுங்கள்',
    'hero.subtitle': 'மேம்பட்ட AI மூலம் தனிப்பயனாக்கப்பட்ட தொழில் பரிந்துரைகளைப் பெறுங்கள். குறிப்பாக இந்திய மாணவர்களுக்காக வடிவமைக்கப்பட்டது.',
    'hero.cta.analysis': 'இலவச பகுப்பாய்வு தொடங்கு',
    'hero.cta.explore': 'வளங்களை ஆராயுங்கள்',
    'hero.stats.students': '50,000+ மாணவர்களுக்கு வழிகாட்டுதல்',
    'hero.stats.careers': '500+ தொழில் பாதைகள்',
    'hero.stats.accuracy': '98% துல்லியம் விகிதம்',
    
    // Voice Interface
    'voice.startListening': 'குரல் வினவல் தொடங்கு',
    'voice.stopListening': 'கேட்பதை நிறுத்து',
    'voice.listening': 'கேட்டுக்கொண்டிருக்கிறது...',
    'voice.processing': 'உங்கள் வினவலை செயலாக்குகிறது...',
    'voice.placeholder': 'உங்கள் தொழில் பாதையைப் பற்றி என்னிடம் கேளுங்கள், "AI மற்றும் கணிதத்திற்கான தொழிலை பரிந்துரைக்கவும்"',
    'voice.error': 'உங்கள் உலாவியில் குரல் அடையாளம் கிடைக்கவில்லை',
    'voice.noSpeech': 'பேச்சு கண்டறியப்படவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'voice.speaking': 'பரிந்துரைகளைச் சொல்கிறது...',
    
    // Opportunities
    'opportunities.title': 'உங்களுக்கான வாய்ப்புகள்',
    'opportunities.subtitle': 'உங்கள் சுயவிவரத்திற்கு ஏற்ப உதவித்தொகை, பயிற்சி மற்றும் ஹேக்கத்தான் கண்டறியுங்கள்',
    'opportunities.filter.scholarship': 'உதவித்தொகை',
    'opportunities.filter.internship': 'பயிற்சி',
    'opportunities.filter.hackathon': 'ஹேக்கத்தான்',
    'opportunities.recommended': 'உங்களுக்கு பரிந்துரைக்கப்பட்டது',
    'opportunities.apply': 'இப்போது விண்ணப்பிக்க'
  },
  bn: {
    // Navigation - Bengali
    'nav.home': 'হোম',
    'nav.assessment': 'মূল্যায়ন',
    'nav.results': 'ফলাফল',
    'nav.resume': 'রেজিউমে বিল্ডার',
    'nav.opportunities': 'সুযোগ',
    'nav.start': 'মূল্যায়ন শুরু করুন',
    
    // Hero Section - Bengali
    'hero.title': 'AI দিয়ে আপনার নিখুঁত ক্যারিয়ার আবিষ্কার করুন',
    'hero.subtitle': 'উন্নত AI দ্বারা চালিত ব্যক্তিগতকৃত ক্যারিয়ারের সুপারিশ পান। বিশেষভাবে ভারতীয় ছাত্রদের জন্য ডিজাইন করা।',
    'hero.cta.analysis': 'বিনামূল্যে বিশ্লেষণ শুরু করুন',
    'hero.cta.explore': 'সম্পদ অন্বেষণ করুন',
    
    // Voice Interface - Bengali
    'voice.startListening': 'ভয়েস কুয়েরি শুরু করুন',
    'voice.stopListening': 'শোনা বন্ধ করুন',
    'voice.listening': 'শুনছি...',
    'voice.processing': 'আপনার কুয়েরি প্রক্রিয়া করছি...',
    'voice.placeholder': 'আপনার ক্যারিয়ার পথ সম্পর্কে আমাকে জিজ্ঞাসা করুন',
    
    // Opportunities - Bengali
    'opportunities.title': 'আপনার জন্য সুযোগ',
    'opportunities.subtitle': 'আপনার প্রোফাইল অনুযায়ী বৃত্তি, ইন্টার্নশিপ এবং হ্যাকাথন খুঁজুন',
    'opportunities.recommended': 'আপনার জন্য সুপারিশকৃত',
    'opportunities.apply': 'এখনই আবেদন করুন'
  },
  te: {
    // Navigation - Telugu
    'nav.home': 'హోమ్',
    'nav.assessment': 'మూల్యాంకనం',
    'nav.results': 'ఫలితాలు',
    'nav.resume': 'రెజ్యూమే బిల్డర్',
    'nav.opportunities': 'అవకాశాలు',
    'nav.start': 'మూల్యాంకనం ప్రారంభించు',
    
    // Hero Section - Telugu
    'hero.title': 'AI తో మీ పరిపూర్ణ కెరీర్‌ను కనుగొనండి',
    'hero.subtitle': 'అధునాతన AI ద్వారా వ్యక్తిగతీకరించిన కెరీర్ సిఫార్సులను పొందండి। ప్రత్యేకంగా భారతీయ విద్యార్థుల కోసం రూపొందించబడింది.',
    
    // Voice Interface - Telugu
    'voice.startListening': 'వాయిస్ క్వేరీ ప్రారంభించండి',
    'voice.listening': 'వింటున్నాం...',
    'voice.processing': 'మీ క్వేరీని ప్రాసెస్ చేస్తున్నాం...',
    
    // Opportunities - Telugu
    'opportunities.title': 'మీ కోసం అవకాశాలు',
    'opportunities.recommended': 'మీకు సిఫార్సు చేయబడినవి',
    'opportunities.apply': 'ఇప్పుడే దరఖాస్తు చేయండి'
  },
  mr: {
    // Navigation - Marathi
    'nav.home': 'मुख्यपृष्ठ',
    'nav.assessment': 'मूल्यमापन',
    'nav.results': 'परिणाम',
    'nav.resume': 'रिझ्युमे बिल्डर',
    'nav.opportunities': 'संधी',
    'nav.start': 'मूल्यमापन सुरू करा',
    
    // Hero Section - Marathi
    'hero.title': 'AI सह तुमचा परिपूर्ण करिअर शोधा',
    'hero.subtitle': 'प्रगत AI द्वारे चालवलेल्या वैयक्तिक करिअर शिफारसी मिळवा। विशेषतः भारतीय विद्यार्थ्यांसाठी डिझाइन केलेले.',
    
    // Voice Interface - Marathi
    'voice.startListening': 'व्हॉईस क्वेरी सुरू करा',
    'voice.listening': 'ऐकत आहे...',
    'voice.processing': 'तुमची क्वेरी प्रक्रिया करत आहे...',
    
    // Opportunities - Marathi
    'opportunities.title': 'तुमच्यासाठी संधी',
    'opportunities.recommended': 'तुमच्यासाठी शिफारस केलेले',
    'opportunities.apply': 'आत्ताच अर्ज करा'
  },
  kn: {
    // Navigation - Kannada
    'nav.home': 'ಮುಖ್ಯಪುಟ',
    'nav.assessment': 'ಮೌಲ್ಯಮಾಪನ',
    'nav.results': 'ಫಲಿತಾಂಶಗಳು',
    'nav.resume': 'ರೆಸ್ಯೂಮೆ ಬಿಲ್ಡರ್',
    'nav.opportunities': 'ಅವಕಾಶಗಳು',
    'nav.start': 'ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ',
    
    // Hero Section - Kannada
    'hero.title': 'AI ಯೊಂದಿಗೆ ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ವೃತ್ತಿಜೀವನವನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    'hero.subtitle': 'ಸುಧಾರಿತ AI ಯಿಂದ ನಡೆಸಲ್ಪಡುವ ವೈಯಕ್ತಿಕ ವೃತ್ತಿಜೀವನದ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.',
    
    // Voice Interface - Kannada
    'voice.startListening': 'ವಾಯ್ಸ್ ಕ್ವೆರಿ ಪ್ರಾರಂಭಿಸಿ',
    'voice.listening': 'ಕೇಳುತ್ತಿದೆ...',
    'voice.processing': 'ನಿಮ್ಮ ಕ್ವೆರಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...',
    
    // Opportunities - Kannada
    'opportunities.title': 'ನಿಮಗಾಗಿ ಅವಕಾಶಗಳು',
    'opportunities.recommended': 'ನಿಮಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    'opportunities.apply': 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
  },
  ml: {
    // Navigation - Malayalam
    'nav.home': 'ഹോം',
    'nav.assessment': 'വിലയിരുത്തൽ',
    'nav.results': 'ഫലങ്ങൾ',
    'nav.resume': 'റെസ്യൂമെ ബിൽഡർ',
    'nav.opportunities': 'അവസരങ്ങൾ',
    'nav.start': 'വിലയിരുത്തൽ ആരംഭിക്കുക',
    
    // Hero Section - Malayalam
    'hero.title': 'AI ഉപയോഗിച്ച് നിങ്ങളുടെ പൂർണ്ണമായ കരിയർ കണ്ടെത്തുക',
    'hero.subtitle': 'വിപുലമായ AI ഉപയോഗിച്ച് വ്യക്തിഗതമാക്കിയ കരിയർ ശുപാർശകൾ നേടുക. പ്രത്യേകിച്ച് ഇന്ത്യൻ വിദ്യാർത്ഥികൾക്കായി രൂപകൽപ്പന ചെയ്തിട്ടുള്ളത്.',
    
    // Voice Interface - Malayalam
    'voice.startListening': 'വോയ്‌സ് ക്വറി ആരംഭിക്കുക',
    'voice.listening': 'കേൾക്കുന്നു...',
    'voice.processing': 'നിങ്ങളുടെ ക്വറി പ്രോസസ്സ് ചെയ്യുന്നു...',
    
    // Opportunities - Malayalam
    'opportunities.title': 'നിങ്ങൾക്കുള്ള അവസരങ്ങൾ',
    'opportunities.recommended': 'നിങ്ങൾക്കായി ശുപാർശ ചെയ്യുന്നത്',
    'opportunities.apply': 'ഇപ്പോൾ അപേക്ഷിക്കുക'
  },
  or: {
    // Navigation - Odia
    'nav.home': 'ମୁଖ୍ୟପୃଷ୍ଠା',
    'nav.assessment': 'ମୂଲ୍ୟାୟନ',
    'nav.results': 'ଫଳାଫଳ',
    'nav.resume': 'ରେଜ୍ୟୁମ୍ ବିଲ୍ଡର୍',
    'nav.opportunities': 'ସୁଯୋଗ',
    'nav.start': 'ମୂଲ୍ୟାୟନ ଆରମ୍ଭ କରନ୍ତୁ',
    
    // Voice Interface - Odia
    'voice.startListening': 'ଭଏସ୍ କ୍ୱେରୀ ଆରମ୍ଭ କରନ୍ତୁ',
    'voice.listening': 'ଶୁଣୁଛି...',
    
    // Opportunities - Odia
    'opportunities.title': 'ଆପଣଙ୍କ ପାଇଁ ସୁଯୋଗ',
    'opportunities.apply': 'ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ'
  },
  pa: {
    // Navigation - Punjabi
    'nav.home': 'ਘਰ',
    'nav.assessment': 'ਮੁਲਾਂਕਣ',
    'nav.results': 'ਨਤੀਜੇ',
    'nav.resume': 'ਰੈਜ਼ਿਊਮੇ ਬਿਲਡਰ',
    'nav.opportunities': 'ਮੌਕੇ',
    'nav.start': 'ਮੁਲਾਂਕਣ ਸ਼ੁਰੂ ਕਰੋ',
    
    // Voice Interface - Punjabi
    'voice.startListening': 'ਆਵਾਜ਼ ਕਿਊਰੀ ਸ਼ੁਰੂ ਕਰੋ',
    'voice.listening': 'ਸੁਣ ਰਹੇ ਹਾਂ...',
    
    // Opportunities - Punjabi
    'opportunities.title': 'ਤੁਹਾਡੇ ਲਈ ਮੌਕੇ',
    'opportunities.apply': 'ਹੁਣ ਅਰਜ਼ੀ ਦਿਓ'
  },
  as: {
    // Navigation - Assamese
    'nav.home': 'ঘৰ',
    'nav.assessment': 'মূল্যায়ন',
    'nav.results': 'ফলাফল',
    'nav.resume': 'ৰেজিউমে বিল্ডাৰ',
    'nav.opportunities': 'সুযোগ',
    'nav.start': 'মূল্যায়ন আৰম্ভ কৰক',
    
    // Voice Interface - Assamese
    'voice.startListening': 'ভয়েছ কুৱেৰী আৰম্ভ কৰক',
    'voice.listening': 'শুনি আছো...',
    
    // Opportunities - Assamese
    'opportunities.title': 'আপোনাৰ বাবে সুযোগ',
    'opportunities.apply': 'এতিয়াই আবেদন কৰক'
  },
  ur: {
    // Navigation - Urdu
    'nav.home': 'گھر',
    'nav.assessment': 'تشخیص',
    'nav.results': 'نتائج',
    'nav.resume': 'ریزیومے بلڈر',
    'nav.opportunities': 'مواقع',
    'nav.start': 'تشخیص شروع کریں',
    
    // Hero Section - Urdu
    'hero.title': 'AI کے ساتھ اپنا کامل کیریئر دریافت کریں',
    'hero.subtitle': 'جدید AI سے چلنے والی ذاتی کیریئر تجاویز حاصل کریں۔ خاص طور پر ہندوستانی طلباء کے لیے ڈیزائن کیا گیا۔',
    
    // Voice Interface - Urdu
    'voice.startListening': 'آواز کی استفسار شروع کریں',
    'voice.listening': 'سن رہے ہیں...',
    'voice.processing': 'آپ کی استفسار پر عمل کر رہے ہیں...',
    
    // Opportunities - Urdu
    'opportunities.title': 'آپ کے لیے مواقع',
    'opportunities.recommended': 'آپ کے لیے تجویز کردہ',
    'opportunities.apply': 'ابھی درخواست دیں'
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