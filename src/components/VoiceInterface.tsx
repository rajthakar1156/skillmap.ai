import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Square, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CareerRecommendation {
  career: string;
  skillRoadmap: string[];
  missingSkills: string[];
  resources: { title: string; url: string }[];
  description: string;
}

interface VoiceInterfaceProps {
  onVoiceQuery: (query: string) => Promise<string>;
  className?: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onVoiceQuery, className = '' }) => {
  const { language, translate } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [careerRecommendation, setCareerRecommendation] = useState<CareerRecommendation | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');

  // Voice recognition configuration based on selected language
  const getVoiceLang = (lang: string) => {
    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN', 
      'gu': 'gu-IN',
      'ta': 'ta-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'or': 'or-IN',
      'pa': 'pa-IN',
      'as': 'as-IN',
      'ur': 'ur-PK'
    };
    return langMap[lang] || 'en-IN';
  };

  // Update voice recognition when language changes
  useEffect(() => {
    if (isListening) {
      stopListening();
      // Small delay to ensure proper cleanup
      setTimeout(() => {
        startListening();
      }, 300);
    }
  }, [language]);

  // Enhanced AI response parsing for career recommendations
  const parseCareerRecommendation = (responseText: string): CareerRecommendation | null => {
    try {
      // Try to extract structured data from the response
      const careerMatch = responseText.match(/(?:Career|Profession|Job):\s*([^\n]+)/i);
      const skillsMatch = responseText.match(/(?:Skills|Roadmap|Path):\s*([^\n]+)/i);
      const missingMatch = responseText.match(/(?:Missing|Learn|Need):\s*([^\n]+)/i);
      
      if (careerMatch) {
        const career = careerMatch[1].trim();
        const skills = skillsMatch ? 
          skillsMatch[1].split(/[,→>-]/).map(s => s.trim()).filter(Boolean) :
          ['Python', 'Data Analysis', 'Machine Learning', 'Statistics'];
        
        const missing = missingMatch ?
          missingMatch[1].split(/[,→>-]/).map(s => s.trim()).filter(Boolean) :
          ['Advanced ML', 'Deep Learning'];

        return {
          career,
          skillRoadmap: skills,
          missingSkills: missing,
          resources: [
            { title: 'Coursera Data Science', url: 'https://coursera.org/specializations/jhu-data-science' },
            { title: 'Python for Data Science', url: 'https://youtube.com/watch?v=LHBE6Q9XlzI' },
            { title: 'Kaggle Learn', url: 'https://kaggle.com/learn' }
          ],
          description: responseText
        };
      }
    } catch (error) {
      console.error('Error parsing career recommendation:', error);
    }
    return null;
  };

  const handleTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setLastTranscript(transcript);
    setIsProcessing(true);
    setShowFallback(false);
    setCareerRecommendation(null);
    
    try {
      const result = await onVoiceQuery(transcript);
      setResponse(result);
      
      // Parse for structured career recommendation
      const parsedCareer = parseCareerRecommendation(result);
      if (parsedCareer) {
        setCareerRecommendation(parsedCareer);
        // Speak the structured response
        const speakText = `Recommended career: ${parsedCareer.career}. Key skills needed: ${parsedCareer.skillRoadmap.slice(0, 3).join(', ')}. You should focus on learning: ${parsedCareer.missingSkills.join(' and ')}.`;
        speak(speakText, { lang: getVoiceLang(language) });
      } else {
        // Fallback to original response
        speak(result, { lang: getVoiceLang(language) });
      }
    } catch (error) {
      console.error('Voice query error:', error);
      const errorMsg = translate('voice.error.process', 'Sorry, I couldn\'t process your request. Please try again.');
      setResponse(errorMsg);
      setShowFallback(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFallbackSubmit = async () => {
    if (!fallbackText.trim()) return;
    await handleTranscript(fallbackText);
    setFallbackText('');
    setShowFallback(false);
  };

  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    clearError
  } = useVoiceRecognition({
    onTranscript: handleTranscript,
    lang: getVoiceLang(language)
  });

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    error: ttsError,
    isSupported: ttsSupported
  } = useTextToSpeech({
    lang: getVoiceLang(language),
    rate: 0.9,
    pitch: 1,
    volume: 0.8
  });

  const handleVoiceToggle = () => {
    clearError();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  const handleReplay = () => {
    if (careerRecommendation) {
      const speakText = `Recommended career: ${careerRecommendation.career}. Key skills needed: ${careerRecommendation.skillRoadmap.slice(0, 3).join(', ')}. You should focus on learning: ${careerRecommendation.missingSkills.join(' and ')}.`;
      speak(speakText);
    } else if (response) {
      speak(response);
    }
  };

  // Cross-browser compatibility check
  const isVoiceAvailable = () => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isEdge = /Edge/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    
    return voiceSupported && (isChrome || isEdge || isAndroid || !isSafari);
  };

  if (!isVoiceAvailable()) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          {translate('voice.notAvailable', 'Voice Not Available')}
        </CardTitle>
        <CardDescription>
          {translate('voice.notSupported', 'Voice recognition is not supported in your browser. Please use Chrome, Edge, or Android browser for voice features.')}
        </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={() => setShowFallback(true)}
            className="w-full"
          >
            {translate('voice.fallback', 'Use Text Instead')}
          </Button>
          
          {showFallback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-secondary/20 rounded-lg border"
            >
              <h4 className="text-sm font-medium mb-2">
                {translate('voice.fallback.title', 'Type your career question:')}
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fallbackText}
                  onChange={(e) => setFallbackText(e.target.value)}
                  placeholder="e.g., Suggest careers for AI and math"
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                  onKeyPress={(e) => e.key === 'Enter' && handleFallbackSubmit()}
                />
                <Button
                  onClick={handleFallbackSubmit}
                  disabled={!fallbackText.trim() || isProcessing}
                  size="sm"
                >
                  {translate('common.submit', 'Submit')}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="w-5 h-5 text-primary" />
          {translate('voice.title', 'Voice Career Assistant')}
        </CardTitle>
        <CardDescription>
          {translate('voice.placeholder', 'Ask me about your career path, like "Suggest careers for AI and math"')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleVoiceToggle}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className={`flex-1 transition-all duration-300 ${
              isListening 
                ? "bg-destructive hover:bg-destructive/90 shadow-glow animate-pulse" 
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isListening ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Square className="w-4 h-4 mr-2" />
                </motion.div>
                {translate('voice.stopListening', 'Stop Listening')}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                {translate('voice.startListening', 'Start Voice Query')}
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button
              onClick={handleStopSpeaking}
              variant="outline"
              size="lg"
              className="hover:bg-destructive/10"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          )}

          {(voiceError || ttsError) && !isListening && (
            <Button
              onClick={() => setShowFallback(true)}
              variant="outline"
              size="lg"
              className="bg-secondary/50"
            >
              <AlertCircle className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-primary/10 rounded-lg border"
            >
              <div className="flex items-center justify-center gap-2 text-primary mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
                <span className="text-base font-medium">
                  🎙️ {translate('voice.listening', 'Listening...')}
                </span>
              </div>
              
              {/* Enhanced Waveform Animation */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: [8, 20, 8, 24, 8, 16, 8],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              
              {/* Real-time Transcript with typing animation */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-background/80 rounded border shadow-sm"
                >
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    <span className="text-primary">💬</span> "{transcript}"
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="ml-1 text-primary"
                    >
                      |
                    </motion.span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-secondary/50 rounded-lg border"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-base font-medium">
                  🧠 {translate('voice.processing', 'Analyzing your career query...')}
                </span>
              </div>
              {lastTranscript && (
                <p className="text-sm text-muted-foreground mt-2">
                  Query: "{lastTranscript}"
                </p>
              )}
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-accent/20 rounded-lg border"
            >
              <div className="flex items-center justify-center gap-2 text-accent-foreground">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Volume2 className="w-5 h-5" />
                </motion.div>
                <span className="text-base font-medium">
                  🔊 {translate('voice.speaking', 'Speaking recommendations...')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Structured Career Recommendation Display */}
        {careerRecommendation && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  🎯 {translate('voice.career', 'Career')}: {careerRecommendation.career}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Skill Roadmap */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    🛤️ {translate('voice.skillRoadmap', 'Skill Roadmap')}:
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {careerRecommendation.skillRoadmap.map((skill, index) => (
                      <React.Fragment key={skill}>
                        <Badge variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                        {index < careerRecommendation.skillRoadmap.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    📚 {translate('voice.skillsToLearn', 'Skills to Learn')}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {careerRecommendation.missingSkills.map((skill) => (
                      <Badge key={skill} variant="destructive" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    🔗 {translate('voice.resources', 'Recommended Resources')}:
                  </h4>
                  <div className="grid gap-2">
                    {careerRecommendation.resources.map((resource, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-between h-auto p-3"
                        asChild
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <span>{resource.title}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Replay Button */}
                {ttsSupported && (
                  <Button
                    variant="secondary"
                    onClick={handleReplay}
                    className="w-full mt-4"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    🔊 {translate('voice.replay', 'Replay Recommendation')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Fallback Response Display (for non-structured responses) */}
        {response && !careerRecommendation && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card border rounded-lg"
          >
            <p className="text-sm leading-relaxed">{response}</p>
            {ttsSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplay}
                className="mt-3 h-8 px-2 text-xs"
              >
                <Volume2 className="w-3 h-3 mr-1" />
                🔊 Replay
              </Button>
            )}
          </motion.div>
        )}

        {/* Fallback Text Input */}
        {showFallback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-secondary/20 rounded-lg border"
          >
            <h4 className="text-sm font-medium mb-2">
              {translate('voice.fallback.title', 'Type your career question:')}
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                value={fallbackText}
                onChange={(e) => setFallbackText(e.target.value)}
                placeholder="e.g., Suggest careers for AI and math"
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                onKeyPress={(e) => e.key === 'Enter' && handleFallbackSubmit()}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleFallbackSubmit}
                  disabled={!fallbackText.trim() || isProcessing}
                  size="sm"
                  className="flex-1"
                >
                  {translate('common.submit', 'Get Career Advice')}
                </Button>
                <Button
                  onClick={() => setShowFallback(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {(voiceError || ttsError) && !showFallback && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {voiceError || ttsError}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 ml-2"
                onClick={() => setShowFallback(true)}
              >
                {translate('voice.fallback', 'Use Text Instead')}
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;