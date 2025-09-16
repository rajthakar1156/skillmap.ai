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
    'nav.logout': 'Logout',
    
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
    'voice.title': 'Voice Career Assistant',
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
    'voice.notAvailable': 'Voice Not Available',
    'voice.notSupported': 'Voice recognition is not supported in your browser. Please use Chrome, Edge, or Android browser for voice features.',
    'voice.career': 'Career',
    'voice.skillRoadmap': 'Skill Roadmap',
    'voice.skillsToLearn': 'Skills to Learn',
    'voice.resources': 'Recommended Resources',
    'voice.replay': 'Replay Recommendation',
    
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
    
    // Resume Builder
    'resume.builder.title': 'AI-Powered Resume Builder',
    'resume.builder.subtitle': 'Create a professional resume tailored to your career path with AI suggestions',
    'resume.builder.progress': 'Progress',
    'resume.builder.step': 'Step',
    'resume.builder.of': 'of',
    'resume.builder.preview': 'Resume Preview',
    'resume.builder.edit': 'Edit Resume',
    'resume.builder.refresh': 'Refresh Preview',
    'resume.builder.download': 'Download PDF',
    'resume.builder.generating': 'Generating PDF...',
    'resume.builder.template.choose': 'Choose Template',
    'resume.builder.template.description': 'Select a professional template for your resume',
    'resume.builder.personal.title': 'Personal Information',
    'resume.builder.personal.description': 'Enter your basic contact information',
    'resume.builder.personal.fullName': 'Full Name',
    'resume.builder.personal.email': 'Email',
    'resume.builder.personal.phone': 'Phone',
    'resume.builder.personal.location': 'Location',
    'resume.builder.personal.linkedin': 'LinkedIn (Optional)',
    'resume.builder.personal.github': 'GitHub (Optional)',
    'resume.builder.career.title': 'Career Path',
    'resume.builder.career.description': 'Select your target career path',
    'resume.builder.career.select': 'Select your target career',
    'resume.builder.summary.title': 'Professional Summary',
    'resume.builder.summary.description': 'Write a compelling professional summary',
    'resume.builder.summary.placeholder': 'Write a compelling professional summary...',
    'resume.builder.education.title': 'Education',
    'resume.builder.education.description': 'Add your educational background',
    'resume.builder.education.degree': 'Degree',
    'resume.builder.education.institution': 'Institution',
    'resume.builder.education.year': 'Year',
    'resume.builder.education.gpa': 'GPA (Optional)',
    'resume.builder.education.add': 'Add Education',
    'resume.builder.education.remove': 'Remove',
    'resume.builder.skills.title': 'Skills',
    'resume.builder.skills.description': 'List your relevant skills',
    'resume.builder.skills.add': 'Add Skill',
    'resume.builder.experience.title': 'Work Experience',
    'resume.builder.experience.description': 'Add your work experience',
    'resume.builder.experience.jobTitle': 'Job Title',
    'resume.builder.experience.company': 'Company',
    'resume.builder.experience.duration': 'Duration',
    'resume.builder.experience.description.field': 'Description',
    'resume.builder.experience.add': 'Add Experience',
    'resume.builder.projects.title': 'Projects',
    'resume.builder.projects.description': 'Showcase your projects',
    'resume.builder.projects.name': 'Project Name',
    'resume.builder.projects.technologies': 'Technologies Used',
    'resume.builder.projects.link': 'Project Link (Optional)',
    'resume.builder.projects.add': 'Add Project',
    'resume.builder.achievements.title': 'Achievements',
    'resume.builder.achievements.description': 'List your key achievements',
    'resume.builder.achievements.add': 'Add Achievement',
    'resume.builder.preview.resume': 'Preview Resume',
    'resume.builder.back': 'Back to Home',

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
    'nav.logout': 'लॉग आउट',
    
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
    'voice.title': 'वॉयस करियर असिस्टेंट',
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
    'voice.notAvailable': 'वॉयस उपलब्ध नहीं',
    'voice.notSupported': 'आपके ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है। वॉयस सुविधाओं के लिए कृपया Chrome, Edge, या Android ब्राउज़र का उपयोग करें।',
    'voice.career': 'करियर',
    'voice.skillRoadmap': 'कौशल रोडमैप',
    'voice.skillsToLearn': 'सीखने के लिए कौशल',
    'voice.resources': 'अनुशंसित संसाधन',
    'voice.replay': 'सिफारिश रिप्ले करें',
    
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
    
    // Resume Builder
    'resume.builder.title': 'AI-संचालित रिज्यूमे बिल्डर',
    'resume.builder.subtitle': 'AI सुझावों के साथ अपने करियर पथ के अनुकूल एक पेशेवर रिज्यूमे बनाएं',
    'resume.builder.progress': 'प्रगति',
    'resume.builder.step': 'चरण',
    'resume.builder.of': 'का',
    'resume.builder.preview': 'रिज्यूमे पूर्वावलोकन',
    'resume.builder.edit': 'रिज्यूमे संपादित करें',
    'resume.builder.refresh': 'पूर्वावलोकन ताज़ा करें',
    'resume.builder.download': 'PDF डाउनलोड करें',
    'resume.builder.generating': 'PDF जेनेरेट कर रहा है...',
    'resume.builder.template.choose': 'टेम्प्लेट चुनें',
    'resume.builder.template.description': 'अपने रिज्यूमे के लिए एक पेशेवर टेम्प्लेट चुनें',
    'resume.builder.personal.title': 'व्यक्तिगत जानकारी',
    'resume.builder.personal.description': 'अपनी बुनियादी संपर्क जानकारी दर्ज करें',
    'resume.builder.personal.fullName': 'पूरा नाम',
    'resume.builder.personal.email': 'ईमेल',
    'resume.builder.personal.phone': 'फोन',
    'resume.builder.personal.location': 'स्थान',
    'resume.builder.personal.linkedin': 'LinkedIn (वैकल्पिक)',
    'resume.builder.personal.github': 'GitHub (वैकल्पिक)',
    'resume.builder.career.title': 'करियर पथ',
    'resume.builder.career.description': 'अपना लक्ष्य करियर पथ चुनें',
    'resume.builder.career.select': 'अपना लक्ष्य करियर चुनें',
    'resume.builder.summary.title': 'पेशेवर सारांश',
    'resume.builder.summary.description': 'एक आकर्षक पेशेवर सारांश लिखें',
    'resume.builder.summary.placeholder': 'एक आकर्षक पेशेवर सारांश लिखें...',
    'resume.builder.education.title': 'शिक्षा',
    'resume.builder.education.description': 'अपनी शैक्षणिक पृष्ठभूमि जोड़ें',
    'resume.builder.education.degree': 'डिग्री',
    'resume.builder.education.institution': 'संस्थान',
    'resume.builder.education.year': 'वर्ष',
    'resume.builder.education.gpa': 'GPA (वैकल्पिक)',
    'resume.builder.education.add': 'शिक्षा जोड़ें',
    'resume.builder.education.remove': 'हटाएं',
    'resume.builder.skills.title': 'कौशल',
    'resume.builder.skills.description': 'अपने प्रासंगिक कौशल की सूची बनाएं',
    'resume.builder.skills.add': 'कौशल जोड़ें',
    'resume.builder.experience.title': 'कार्य अनुभव',
    'resume.builder.experience.description': 'अपना कार्य अनुभव जोड़ें',
    'resume.builder.experience.jobTitle': 'नौकरी का शीर्षक',
    'resume.builder.experience.company': 'कंपनी',
    'resume.builder.experience.duration': 'अवधि',
    'resume.builder.experience.description.field': 'विवरण',
    'resume.builder.experience.add': 'अनुभव जोड़ें',
    'resume.builder.projects.title': 'प्रोजेक्ट्स',
    'resume.builder.projects.description': 'अपने प्रोजेक्ट्स दिखाएं',
    'resume.builder.projects.name': 'प्रोजेक्ट का नाम',
    'resume.builder.projects.technologies': 'उपयोग की गई तकनीकें',
    'resume.builder.projects.link': 'प्रोजेक्ट लिंक (वैकल्पिक)',
    'resume.builder.projects.add': 'प्रोजेक्ट जोड़ें',
    'resume.builder.achievements.title': 'उपलब्धियां',
    'resume.builder.achievements.description': 'अपनी मुख्य उपलब्धियों की सूची बनाएं',
    'resume.builder.achievements.add': 'उपलब्धि जोड़ें',
    'resume.builder.preview.resume': 'रिज्यूमे पूर्वावलोकन',
    'resume.builder.back': 'होम पर वापस',

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
    'nav.logout': 'લોગ આઉટ',
    
    // Hero Section
    'hero.title': 'AI સાથે તમારી સંપૂર્ણ કારકિર્દી શોધો',
    'hero.subtitle': 'અદ્યતન AI દ્વારા સંચાલિત વ્યક્તિગત કારકિર્દી સિફારિશો મેળવો। ખાસ કરીને ભારતીય વિદ્યાર્થીઓ માટે ડિઝાઇન કરેલ.',
    'hero.cta.analysis': 'મફત વિશ્લેષણ શરૂ કરો',
    'hero.cta.explore': 'સંસાધનો અન્વેષણ કરો',
    'hero.stats.students': '50,000+ વિદ્યાર્થીઓને માર્ગદર્શન',
    'hero.stats.careers': '500+ કારકિર્દીના રસ્તાઓ',
    'hero.stats.accuracy': '98% ચોકસાઈ દર',
    
    // Voice Interface
    'voice.title': 'વૉઇસ કારકિર્દી સહાયક',
    'voice.startListening': 'વૉઇસ ક્વેરી શરૂ કરો',
    'voice.stopListening': 'સાંભળવાનું બંધ કરો',
    'voice.listening': 'સાંભળી રહ્યાં છીએ...',
    'voice.processing': 'તમારી ક્વેરી પ્રોસેસ કરી રહ્યાં છીએ...',
    'voice.placeholder': 'મને તમારા કારકિર્દીના રસ્તા વિશે પૂછો, જેમ કે "AI અને ગણિત માટે કારકિર્દી સૂચવો"',
    'voice.error': 'તમારા બ્રાઉઝરમાં વૉઇસ રિકગ્નિશન ઉપલબ્ધ નથી',
    'voice.noSpeech': 'કોઈ વાણીનું પ્રમાણ મળ્યું નથી. કૃપા કરીને ફરી પ્રયાસ કરો.',
    'voice.speaking': 'સિફારિશો બોલી રહ્યાં છીએ...',
    'voice.fallback': 'તેના બદલે ટેક્સ્ટ વાપરો',
    'voice.fallback.title': 'તેના બદલે તમારો પ્રશ્ન ટાઇપ કરો:',
    'voice.notAvailable': 'વૉઇસ ઉપલબ્ધ નથી',
    'voice.notSupported': 'તમારા બ્રાઉઝરમાં વૉઇસ રિકગ્નિશન સપોર્ટેડ નથી. વૉઇસ ફીચર્સ માટે કૃપા કરીને Chrome, Edge, અથવા Android બ્રાઉઝર વાપરો.',
    'voice.career': 'કારકિર્દી',
    'voice.skillRoadmap': 'કૌશલ્ય રોડમેપ',
    'voice.skillsToLearn': 'શીખવાની કૌશલ્યો',
    'voice.resources': 'ભલામણ કરેલ સંસાધનો',
    'voice.replay': 'સિફારિશ રિપ્લે કરો',
    
    // Resume Builder
    'resume.builder.title': 'AI-સંચાલિત રિઝ્યુમે બિલ્ડર',
    'resume.builder.subtitle': 'AI સૂચનો સાથે તમારા કારકિર્દીના માર્ગને અનુકૂળ એક વ્યાવસાયિક રિઝ્યુમે બનાવો',
    'resume.builder.progress': 'પ્રગતિ',
    'resume.builder.step': 'પગલું',
    'resume.builder.of': 'નું',
    'resume.builder.preview': 'રિઝ્યુમે પૂર્વાવલોકન',
    'resume.builder.edit': 'રિઝ્યુમે સંપાદિત કરો',
    'resume.builder.refresh': 'પૂર્વાવલોકન તાજું કરો',
    'resume.builder.download': 'PDF ડાઉનલોડ કરો',
    'resume.builder.generating': 'PDF જનરેટ કરી રહ્યું છે...',
    'resume.builder.template.choose': 'ટેમ્પલેટ પસંદ કરો',
    'resume.builder.template.description': 'તમારા રિઝ્યુમે માટે એક વ્યાવસાયિક ટેમ્પલેટ પસંદ કરો',
    'resume.builder.personal.title': 'વ્યક્તિગત માહિતી',
    'resume.builder.personal.description': 'તમારી મૂળભૂત સંપર્ક માહિતી દાખલ કરો',
    'resume.builder.personal.fullName': 'પૂરું નામ',
    'resume.builder.personal.email': 'ઈમેલ',
    'resume.builder.personal.phone': 'ફોન',
    'resume.builder.personal.location': 'સ્થાન',
    'resume.builder.personal.linkedin': 'LinkedIn (વૈકલ્પિક)',
    'resume.builder.personal.github': 'GitHub (વૈકલ્પિક)',
    'resume.builder.career.title': 'કારકિર્દીનો માર્ગ',
    'resume.builder.career.description': 'તમારો લક્ષ્ય કારકિર્દીનો માર્ગ પસંદ કરો',
    'resume.builder.career.select': 'તમારો લક્ષ્ય કારકિર્દી પસંદ કરો',
    'resume.builder.summary.title': 'વ્યાવસાયિક સારાંશ',
    'resume.builder.summary.description': 'એક આકર્ષક વ્યાવસાયિક સારાંશ લખો',
    'resume.builder.summary.placeholder': 'એક આકર્ષક વ્યાવસાયિક સારાંશ લખો...',
    'resume.builder.education.title': 'શિક્ષણ',
    'resume.builder.education.description': 'તમારી શૈક્ષણિક પૃષ્ઠભૂમિ ઉમેરો',
    'resume.builder.education.degree': 'ડિગ્રી',
    'resume.builder.education.institution': 'સંસ્થા',
    'resume.builder.education.year': 'વર્ષ',
    'resume.builder.education.gpa': 'GPA (વૈકલ્પિક)',
    'resume.builder.education.add': 'શિક્ષણ ઉમેરો',
    'resume.builder.education.remove': 'દૂર કરો',
    'resume.builder.skills.title': 'કૌશલ્યો',
    'resume.builder.skills.description': 'તમારા સંબંધિત કૌશલ્યોની સૂચિ બનાવો',
    'resume.builder.skills.add': 'કૌશલ્ય ઉમેરો',
    'resume.builder.experience.title': 'કાર્ય અનુભવ',
    'resume.builder.experience.description': 'તમારો કાર્ય અનુભવ ઉમેરો',
    'resume.builder.experience.jobTitle': 'નોકરીનું શીર્ષક',
    'resume.builder.experience.company': 'કંપની',
    'resume.builder.experience.duration': 'અવધિ',
    'resume.builder.experience.description.field': 'વિવરણ',
    'resume.builder.experience.add': 'અનુભવ ઉમેરો',
    'resume.builder.projects.title': 'પ્રોજેક્ટ્સ',
    'resume.builder.projects.description': 'તમારા પ્રોજેક્ટ્સ દર્શાવો',
    'resume.builder.projects.name': 'પ્રોજેક્ટનું નામ',
    'resume.builder.projects.technologies': 'વપરાયેલ તકનીકો',
    'resume.builder.projects.link': 'પ્રોજેક્ટ લિંક (વૈકલ્પિક)',
    'resume.builder.projects.add': 'પ્રોજેક્ટ ઉમેરો',
    'resume.builder.achievements.title': 'સિદ્ધિઓ',
    'resume.builder.achievements.description': 'તમારી મુખ્ય સિદ્ધિઓની સૂચિ બનાવો',
    'resume.builder.achievements.add': 'સિદ્ધિ ઉમેરો',
    'resume.builder.preview.resume': 'રિઝ્યુમે પૂર્વાવલોકન',
    'resume.builder.back': 'હોમ પર પાછા',

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
    'nav.logout': 'வெளியேறு',
    
    // Hero Section
    'hero.title': 'AI மூலம் உங்கள் சரியான தொழிலை கண்டறியுங்கள்',
    'hero.subtitle': 'மேம்பட்ட AI மூலம் தனிப்பயனாக்கப்பட்ட தொழில் பரிந்துரைகளைப் பெறுங்கள். குறிப்பாக இந்திய மாணவர்களுக்காக வடிவமைக்கப்பட்டது.',
    'hero.cta.analysis': 'இலவச பகுப்பாய்வு தொடங்கு',
    'hero.cta.explore': 'வளங்களை ஆராயுங்கள்',
    'hero.stats.students': '50,000+ மாணவர்களுக்கு வழிகாட்டுதல்',
    'hero.stats.careers': '500+ தொழில் பாதைகள்',
    'hero.stats.accuracy': '98% துல்லியம் விகிதம்',
    
    // Voice Interface
    'voice.title': 'குரல் தொழில் உதவியாளர்',
    'voice.startListening': 'குரல் வினவல் தொடங்கு',
    'voice.stopListening': 'கேட்பதை நிறுத்து',
    'voice.listening': 'கேட்டுக்கொண்டிருக்கிறது...',
    'voice.processing': 'உங்கள் வினவலை செயலாக்குகிறது...',
    'voice.placeholder': 'உங்கள் தொழில் பாதையைப் பற்றி என்னிடம் கேளுங்கள், "AI மற்றும் கணிதத்திற்கான தொழிலை பரிந்துரைக்கவும்"',
    'voice.error': 'உங்கள் உலாவியில் குரல் அடையாளம் கிடைக்கவில்லை',
    'voice.error.process': 'மன்னிக்கவும், உங்கள் கோரிக்கையை நான் செயலாக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    'voice.noSpeech': 'பேச்சு கண்டறியப்படவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'voice.speaking': 'பரிந்துரைகளைச் சொல்கிறது...',
    'voice.fallback': 'அதற்கு பதிலாக உரையைப் பயன்படுத்துங்கள்',
    'voice.fallback.title': 'அதற்கு பதிலாக உங்கள் கேள்வியை டைப் செய்யுங்கள்:',
    'voice.notAvailable': 'குரல் கிடைக்கவில்லை',
    'voice.notSupported': 'உங்கள் உலாவியில் குரல் அடையாளம் ஆதரிக்கப்படவில்லை. குரல் அம்சங்களுக்கு Chrome, Edge, அல்லது Android உலாவியைப் பயன்படுத்தவும்.',
    'voice.career': 'தொழில்',
    'voice.skillRoadmap': 'திறன் வழிகாட்டி',
    'voice.skillsToLearn': 'கற்க வேண்டிய திறன்கள்',
    'voice.resources': 'பரிந்துரைக்கப்பட்ட வளங்கள்',
    'voice.replay': 'பரிந்துரை மீண்டும் இயக்கு',
    
    // Resume Builder
    'resume.builder.title': 'AI-சக்தியூட்டப்பட்ட ரெஸ்யூமே பில்டர்',
    'resume.builder.subtitle': 'AI பரிந்துரைகளுடன் உங்கள் தொழில் பாதைக்கு ஏற்ப ஒரு தொழில்முறை ரெஸ்யூமே உருவாக்குங்கள்',
    'resume.builder.progress': 'முன்னேற்றம்',
    'resume.builder.step': 'படி',
    'resume.builder.of': 'இன்',
    'resume.builder.preview': 'ரெஸ்யூமே முன்னோட்டம்',
    'resume.builder.edit': 'ரெஸ்யூமே திருத்து',
    'resume.builder.refresh': 'முன்னோட்டம் புதுப்பிக்கவும்',
    'resume.builder.download': 'PDF பதிவிறக்கம்',
    'resume.builder.generating': 'PDF உருவாக்குகிறது...',
    'resume.builder.template.choose': 'டெம்ப்ளேட் தேர்வு செய்யுங்கள்',
    'resume.builder.template.description': 'உங்கள் ரெஸ்யூமேக்கு ஒரு தொழில்முறை டெம்ப்ளேட் தேர்வு செய்யுங்கள்',
    'resume.builder.personal.title': 'தனிப்பட்ட தகவல்',
    'resume.builder.personal.description': 'உங்கள் அடிப்படை தொடர்பு தகவலை உள்ளிடுங்கள்',
    'resume.builder.personal.fullName': 'முழு பெயர்',
    'resume.builder.personal.email': 'மின்னஞ்சல்',
    'resume.builder.personal.phone': 'தொலைபேசி',
    'resume.builder.personal.location': 'இடம்',
    'resume.builder.personal.linkedin': 'LinkedIn (விருப்பம்)',
    'resume.builder.personal.github': 'GitHub (விருப்பம்)',
    'resume.builder.career.title': 'தொழில் பாதை',
    'resume.builder.career.description': 'உங்கள் இலக்கு தொழில் பாதையை தேர்வு செய்யுங்கள்',
    'resume.builder.career.select': 'உங்கள் இலக்கு தொழிலை தேர்வு செய்யுங்கள்',
    'resume.builder.summary.title': 'தொழில்முறை சுருக்கம்',
    'resume.builder.summary.description': 'ஒரு கவர்ச்சிகரமான தொழில்முறை சுருக்கம் எழுதுங்கள்',
    'resume.builder.summary.placeholder': 'ஒரு கவர்ச்சிகரமான தொழில்முறை சுருக்கம் எழுதுங்கள்...',
    'resume.builder.education.title': 'கல்வி',
    'resume.builder.education.description': 'உங்கள் கல்வி பின்னணியை சேர்க்கவும்',
    'resume.builder.education.degree': 'பட்டம்',
    'resume.builder.education.institution': 'நிறுவனம்',
    'resume.builder.education.year': 'வருடம்',
    'resume.builder.education.gpa': 'GPA (விருப்பம்)',
    'resume.builder.education.add': 'கல்வி சேர்க்கவும்',
    'resume.builder.education.remove': 'நீக்கவும்',
    'resume.builder.skills.title': 'திறன்கள்',
    'resume.builder.skills.description': 'உங்கள் தொடர்புடைய திறன்களை பட்டியலிடுங்கள்',
    'resume.builder.skills.add': 'திறன் சேர்க்கவும்',
    'resume.builder.experience.title': 'வேலை அனுபவம்',
    'resume.builder.experience.description': 'உங்கள் வேலை அனுபவத்தை சேர்க்கவும்',
    'resume.builder.experience.jobTitle': 'வேலை பதவி',
    'resume.builder.experience.company': 'நிறுவனம்',
    'resume.builder.experience.duration': 'காலம்',
    'resume.builder.experience.description.field': 'விவரம்',
    'resume.builder.experience.add': 'அனுபவம் சேர்க்கவும்',
    'resume.builder.projects.title': 'திட்டங்கள்',
    'resume.builder.projects.description': 'உங்கள் திட்டங்களை காட்சிப்படுத்துங்கள்',
    'resume.builder.projects.name': 'திட்டத்தின் பெயர்',
    'resume.builder.projects.technologies': 'பயன்படுத்தப்பட்ட தொழில்நுட்பங்கள்',
    'resume.builder.projects.link': 'திட்ட இணைப்பு (விருப்பம்)',
    'resume.builder.projects.add': 'திட்டம் சேர்க்கவும்',
    'resume.builder.achievements.title': 'சாதனைகள்',
    'resume.builder.achievements.description': 'உங்கள் முக்கிய சாதனைகளை பட்டியலிடுங்கள்',
    'resume.builder.achievements.add': 'சாதனை சேர்க்கவும்',
    'resume.builder.preview.resume': 'ரெஸ்யூமே முன்னோட்டம்',
    'resume.builder.back': 'முகப்புக்கு திரும்பு',

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
    'nav.logout': 'লগ আউট',
    
    // Resume Builder
    'resume.builder.title': 'AI-চালিত রেজিউমে বিল্ডার',
    'resume.builder.subtitle': 'AI সুপারিশ সহ আপনার ক্যারিয়ার পথের জন্য একটি পেশাদার রেজিউমে তৈরি করুন',
    'resume.builder.progress': 'অগ্রগতি',
    'resume.builder.step': 'ধাপ',
    'resume.builder.of': 'এর',
    'resume.builder.preview': 'রেজিউমে পূর্বরূপ',
    'resume.builder.edit': 'রেজিউমে সম্পাদনা করুন',
    'resume.builder.refresh': 'পূর্বরূপ রিফ্রেশ করুন',
    'resume.builder.download': 'PDF ডাউনলোড করুন',
    'resume.builder.generating': 'PDF তৈরি করা হচ্ছে...',
    'resume.builder.template.choose': 'টেমপ্লেট নির্বাচন করুন',
    'resume.builder.template.description': 'আপনার রেজিউমের জন্য একটি পেশাদার টেমপ্লেট নির্বাচন করুন',
    'resume.builder.personal.title': 'ব্যক্তিগত তথ্য',
    'resume.builder.personal.description': 'আপনার মৌলিক যোগাযোগের তথ্য লিখুন',
    'resume.builder.personal.fullName': 'পূর্ণ নাম',
    'resume.builder.personal.email': 'ইমেইল',
    'resume.builder.personal.phone': 'ফোন',
    'resume.builder.personal.location': 'অবস্থান',
    'resume.builder.personal.linkedin': 'LinkedIn (ঐচ্ছিক)',
    'resume.builder.personal.github': 'GitHub (ঐচ্ছিক)',
    'resume.builder.career.title': 'ক্যারিয়ার পথ',
    'resume.builder.career.description': 'আপনার লক্ষ্য ক্যারিয়ার পথ নির্বাচন করুন',
    'resume.builder.career.select': 'আপনার লক্ষ্য ক্যারিয়ার নির্বাচন করুন',
    'resume.builder.summary.title': 'পেশাদার সারাংশ',
    'resume.builder.summary.description': 'একটি আকর্ষণীয় পেশাদার সারাংশ লিখুন',
    'resume.builder.summary.placeholder': 'একটি আকর্ষণীয় পেশাদার সারাংশ লিখুন...',
    'resume.builder.education.title': 'শিক্ষা',
    'resume.builder.education.description': 'আপনার শিক্ষাগত পটভূমি যোগ করুন',
    'resume.builder.education.degree': 'ডিগ্রি',
    'resume.builder.education.institution': 'প্রতিষ্ঠান',
    'resume.builder.education.year': 'বছর',
    'resume.builder.education.gpa': 'GPA (ঐচ্ছিক)',
    'resume.builder.education.add': 'শিক্ষা যোগ করুন',
    'resume.builder.education.remove': 'সরান',
    'resume.builder.skills.title': 'দক্ষতা',
    'resume.builder.skills.description': 'আপনার প্রাসঙ্গিক দক্ষতা তালিকাভুক্ত করুন',
    'resume.builder.skills.add': 'দক্ষতা যোগ করুন',
    'resume.builder.experience.title': 'কাজের অভিজ্ঞতা',
    'resume.builder.experience.description': 'আপনার কাজের অভিজ্ঞতা যোগ করুন',
    'resume.builder.experience.jobTitle': 'কাজের পদবী',
    'resume.builder.experience.company': 'কোম্পানি',
    'resume.builder.experience.duration': 'সময়কাল',
    'resume.builder.experience.description.field': 'বিবরণ',
    'resume.builder.experience.add': 'অভিজ্ঞতা যোগ করুন',
    'resume.builder.projects.title': 'প্রকল্প',
    'resume.builder.projects.description': 'আপনার প্রকল্প প্রদর্শন করুন',
    'resume.builder.projects.name': 'প্রকল্পের নাম',
    'resume.builder.projects.technologies': 'ব্যবহৃত প্রযুক্তি',
    'resume.builder.projects.link': 'প্রকল্প লিঙ্ক (ঐচ্ছিক)',
    'resume.builder.projects.add': 'প্রকল্প যোগ করুন',
    'resume.builder.achievements.title': 'অর্জন',
    'resume.builder.achievements.description': 'আপনার মূল অর্জনের তালিকা করুন',
    'resume.builder.achievements.add': 'অর্জন যোগ করুন',
    'resume.builder.preview.resume': 'রেজিউমে পূর্বরূপ',
    'resume.builder.back': 'হোমে ফিরুন',

    // Common
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'hero.title': 'AI দিয়ে আপনার নিখুঁত ক্যারিয়ার আবিষ্কার করুন',
    'hero.subtitle': 'উন্নত AI দ্বারা চালিত ব্যক্তিগতকৃত ক্যারিয়ারের সুপারিশ পান। বিশেষভাবে ভারতীয় ছাত্রদের জন্য ডিজাইন করা।',
    'hero.cta.analysis': 'বিনামূল্যে বিশ্লেষণ শুরু করুন',
    'hero.cta.explore': 'সম্পদ অন্বেষণ করুন',
    
    // Voice Interface - Bengali
    'voice.title': 'ভয়েস ক্যারিয়ার সহায়ক',
    'voice.startListening': 'ভয়েস কুয়েরি শুরু করুন',
    'voice.stopListening': 'শোনা বন্ধ করুন',
    'voice.listening': 'শুনছি...',
    'voice.processing': 'আপনার কুয়েরি প্রক্রিয়া করছি...',
    'voice.placeholder': 'আপনার ক্যারিয়ার পথ সম্পর্কে আমাকে জিজ্ঞাসা করুন',
    'voice.error': 'আপনার ব্রাউজারে ভয়েস রিকগনিশন উপলব্ধ নেই',
    'voice.error.process': 'দুঃখিত, আমি আপনার অনুরোধ প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    'voice.noSpeech': 'কোন বক্তৃতা সনাক্ত করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    'voice.speaking': 'সুপারিশ বলছি...',
    'voice.fallback': 'পরিবর্তে টেক্সট ব্যবহার করুন',
    'voice.fallback.title': 'পরিবর্তে আপনার প্রশ্ন টাইপ করুন:',
    'voice.notAvailable': 'ভয়েস উপলব্ধ নেই',
    'voice.notSupported': 'আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়। ভয়েস ফিচারের জন্য Chrome, Edge, বা Android ব্রাউজার ব্যবহার করুন।',
    'voice.career': 'ক্যারিয়ার',
    'voice.skillRoadmap': 'দক্ষতা রোডম্যাপ',
    'voice.skillsToLearn': 'শেখার দক্ষতা',
    'voice.resources': 'সুপারিশকৃত সম্পদ',
    'voice.replay': 'সুপারিশ রিপ্লে করুন',
    
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
    'nav.logout': 'లాగ్ అవుట్',
    
    // Hero Section - Telugu
    'hero.title': 'AI తో మీ పరిపూర్ణ కెరీర్‌ను కనుగొనండి',
    'hero.subtitle': 'అధునాతన AI ద్వారా వ్యక్తిగతీకరించిన కెరీర్ సిఫార్సులను పొందండి। ప్రత్యేకంగా భారతీయ విద్యార్థుల కోసం రూపొందించబడింది.',
    
    // Voice Interface - Telugu
    'voice.title': 'వాయిస్ కెరీర్ సహాయకుడు',
    'voice.startListening': 'వాయిస్ క్వేరీ ప్రారంభించండి',
    'voice.stopListening': 'వినడం ఆపండి',
    'voice.listening': 'వింటున్నాం...',
    'voice.processing': 'మీ క్వేరీని ప్రాసెస్ చేస్తున్నాం...',
    'voice.placeholder': 'మీ కెరీర్ మార్గం గురించి నన్ను అడగండి, "AI మరియు గణితం కోసం కెరీర్ సూచించండి"',
    'voice.error': 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు',
    'voice.error.process': 'క్షమించండి, మీ అభ్యర్థనను నేను ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'voice.noSpeech': 'ఎలాంటి మాట కనుగొనబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'voice.speaking': 'సిఫార్సులు చెబుతున్నాం...',
    'voice.fallback': 'బదులుగా టెక్స్ట్ ఉపయోగించండి',
    'voice.fallback.title': 'బదులుగా మీ ప్రశ్నను టైప్ చేయండి:',
    'voice.notAvailable': 'వాయిస్ అందుబాటులో లేదు',
    'voice.notSupported': 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు. వాయిస్ ఫీచర్‌ల కోసం Chrome, Edge, లేదా Android బ్రౌజర్ ఉపయోగించండి.',
    'voice.career': 'కెరీర్',
    'voice.skillRoadmap': 'నైపుణ్య రోడ్‌మ్యాప్',
    'voice.skillsToLearn': 'నేర్చుకోవాల్సిన నైపుణ్యాలు',
    'voice.resources': 'సిఫార్సు చేయబడిన వనరులు',
    'voice.replay': 'సిఫార్సు రీప్లే చేయండి',
    
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
    'nav.logout': 'लॉग आउट',
    
    // Hero Section - Marathi
    'hero.title': 'AI सह तुमचा परिपूर्ण करिअर शोधा',
    'hero.subtitle': 'प्रगत AI द्वारे चालवलेल्या वैयक्तिक करिअर शिफारसी मिळवा। विशेषतः भारतीय विद्यार्थ्यांसाठी डिझाइन केलेले.',
    
    // Voice Interface - Marathi
    'voice.title': 'व्हॉईस करिअर सहाय्यक',
    'voice.startListening': 'व्हॉईस क्वेरी सुरू करा',
    'voice.stopListening': 'ऐकणे थांबवा',
    'voice.listening': 'ऐकत आहे...',
    'voice.processing': 'तुमची क्वेरी प्रक्रिया करत आहे...',
    'voice.placeholder': 'तुमच्या करिअर मार्गाबद्दल मला विचारा, "AI आणि गणितासाठी करिअर सुचवा"',
    'voice.error': 'तुमच्या ब्राउझरमध्ये व्हॉईस रिकग्निशन उपलब्ध नाही',
    'voice.error.process': 'माफ करा, मी तुमची विनंती प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.',
    'voice.noSpeech': 'कोणतेही भाषण आढळले नाही. कृपया पुन्हा प्रयत्न करा.',
    'voice.speaking': 'शिफारसी सांगत आहे...',
    'voice.fallback': 'त्याऐवजी मजकूर वापरा',
    'voice.fallback.title': 'त्याऐवजी तुमचा प्रश्न टाइप करा:',
    'voice.notAvailable': 'व्हॉईस उपलब्ध नाही',
    'voice.notSupported': 'तुमच्या ब्राउझरमध्ये व्हॉईस रिकग्निशनला समर्थन नाही. व्हॉईस वैशिष्ट्यांसाठी Chrome, Edge, किंवा Android ब्राउझर वापरा.',
    'voice.career': 'करिअर',
    'voice.skillRoadmap': 'कौशल्य रोडमॅप',
    'voice.skillsToLearn': 'शिकण्यासाठी कौशल्ये',
    'voice.resources': 'शिफारस केलेली संसाधने',
    'voice.replay': 'शिफारस रिप्ले करा',
    
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
    'nav.logout': 'ಲಾಗ್ ಔಟ್',
    
    // Hero Section - Kannada
    'hero.title': 'AI ಯೊಂದಿಗೆ ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ವೃತ್ತಿಜೀವನವನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    'hero.subtitle': 'ಸುಧಾರಿತ AI ಯಿಂದ ನಡೆಸಲ್ಪಡುವ ವೈಯಕ್ತಿಕ ವೃತ್ತಿಜೀವನದ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.',
    
    // Voice Interface - Kannada
    'voice.title': 'ವಾಯ್ಸ್ ವೃತ್ತಿಜೀವನ ಸಹಾಯಕ',
    'voice.startListening': 'ವಾಯ್ಸ್ ಕ್ವೆರಿ ಪ್ರಾರಂಭಿಸಿ',
    'voice.stopListening': 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
    'voice.listening': 'ಕೇಳುತ್ತಿದೆ...',
    'voice.processing': 'ನಿಮ್ಮ ಕ್ವೆರಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...',
    'voice.placeholder': 'ನಿಮ್ಮ ವೃತ್ತಿಜೀವನದ ಮಾರ್ಗದ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ, "AI ಮತ್ತು ಗಣಿತಕ್ಕಾಗಿ ವೃತ್ತಿಜೀವನವನ್ನು ಸೂಚಿಸಿ"',
    'voice.error': 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ರಿಕಗ್ನಿಷನ್ ಲಭ್ಯವಿಲ್ಲ',
    'voice.error.process': 'ಕ್ಷಮಿಸಿ, ನಾನು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'voice.noSpeech': 'ಯಾವುದೇ ಮಾತು ಪತ್ತೆಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'voice.speaking': 'ವೃತ್ತಿಜೀವನ ಶಿಫಾರಸುಗಳನ್ನು ಹೇಳುತ್ತಿದೆ...',
    'voice.fallback': 'ಬದಲಿಗೆ ಪಠ್ಯವನ್ನು ಬಳಸಿ',
    'voice.fallback.title': 'ಬದಲಿಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ:',
    'voice.notAvailable': 'ವಾಯ್ಸ್ ಲಭ್ಯವಿಲ್ಲ',
    'voice.notSupported': 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ರಿಕಗ್ನಿಷನ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ವಾಯ್ಸ್ ವೈಶಿಷ್ಟ್ಯಗಳಿಗಾಗಿ Chrome, Edge, ಅಥವಾ Android ಬ್ರೌಸರ್ ಬಳಸಿ.',
    'voice.career': 'ವೃತ್ತಿಜೀವನ',
    'voice.skillRoadmap': 'ಕೌಶಲ್ಯ ರೋಡ್‌ಮ್ಯಾಪ್',
    'voice.skillsToLearn': 'ಕಲಿಯಬೇಕಾದ ಕೌಶಲ್ಯಗಳು',
    'voice.resources': 'ಶಿಫಾರಸು ಮಾಡಿದ ಸಂಪನ್ಮೂಲಗಳು',
    'voice.replay': 'ಶಿಫಾರಸು ಮರುಪ್ಲೇ ಮಾಡಿ',
    
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
    'nav.logout': 'ലോഗ് ഔട്ട്',
    
    // Hero Section - Malayalam
    'hero.title': 'AI ഉപയോഗിച്ച് നിങ്ങളുടെ പൂർണ്ണമായ കരിയർ കണ്ടെത്തുക',
    'hero.subtitle': 'വിപുലമായ AI ഉപയോഗിച്ച് വ്യക്തിഗതമാക്കിയ കരിയർ ശുപാർശകൾ നേടുക. പ്രത്യേകിച്ച് ഇന്ത്യൻ വിദ്യാർത്ഥികൾക്കായി രൂപകൽപ്പന ചെയ്തിട്ടുള്ളത്.',
    
    // Voice Interface - Malayalam
    'voice.title': 'വോയ്‌സ് കരിയർ സഹായി',
    'voice.startListening': 'വോയ്‌സ് ക്വറി ആരംഭിക്കുക',
    'voice.stopListening': 'കേൾക്കുന്നത് നിർത്തുക',
    'voice.listening': 'കേൾക്കുന്നു...',
    'voice.processing': 'നിങ്ങളുടെ ക്വറി പ്രോസസ്സ് ചെയ്യുന്നു...',
    'voice.placeholder': 'നിങ്ങളുടെ കരിയർ പാതയെക്കുറിച്ച് എന്നോട് ചോദിക്കുക, "AI ഉം ഗണിതവും കരിയർ നിർദ്ദേശിക്കുക"',
    'voice.error': 'നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്‌സ് റിക്കഗ്നിഷൻ ലഭ്യമല്ല',
    'voice.error.process': 'ക്ഷമിക്കുക, എനിക്ക് നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    'voice.noSpeech': 'സംസാരം കണ്ടെത്തിയില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    'voice.speaking': 'ശുപാർശകൾ പറയുന്നു...',
    'voice.fallback': 'പകരം ടെക്സ്റ്റ് ഉപയോഗിക്കുക',
    'voice.fallback.title': 'പകരം നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുക:',
    'voice.notAvailable': 'വോയ്‌സ് ലഭ്യമല്ല',
    'voice.notSupported': 'നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്‌സ് റിക്കഗ്നിഷൻ പിന്തുണയില്ല. വോയ്‌സ് ഫീച്ചറുകൾക്കായി Chrome, Edge, അല്ലെങ്കിൽ Android ബ്രൗസർ ഉപയോഗിക്കുക.',
    'voice.career': 'കരിയർ',
    'voice.skillRoadmap': 'വൈദഗ്ധ്യ റോഡ്മാപ്പ്',
    'voice.skillsToLearn': 'പഠിക്കേണ്ട വൈദഗ്ധ്യങ്ങൾ',
    'voice.resources': 'ശുപാർശ ചെയ്ത വിഭവങ്ങൾ',
    'voice.replay': 'ശുപാർശ റീപ്ലേ ചെയ്യുക',
    
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
    'nav.logout': 'ଲଗ୍ ଆଉଟ୍',
    
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
    'nav.logout': 'ਲੌਗ ਆਉਟ',
    
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
    'nav.logout': 'লগ আউট',
    
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
    'nav.logout': 'لاگ آؤٹ',
    
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