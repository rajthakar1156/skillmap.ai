import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInterfaceProps {
  onVoiceQuery: (query: string) => Promise<string>;
  className?: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onVoiceQuery, className = '' }) => {
  const { language, translate } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');

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

  const handleTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await onVoiceQuery(transcript);
      setResponse(result);
      
      // Speak the response
      if (result) {
        speak(result, { lang: getVoiceLang(language) });
      }
    } catch (error) {
      console.error('Voice query error:', error);
      setResponse('Sorry, I couldn\'t process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
    setResponse('');
  };

  if (!voiceSupported) {
    return (
      <Alert className={className}>
        <AlertDescription>
          {translate('voice.error', 'Voice recognition not available in your browser')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="w-5 h-5 text-primary" />
          Voice Assistant
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
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
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
            >
              <VolumeX className="w-4 h-4" />
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
              className="text-center p-3 bg-primary/10 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 text-primary">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">
                  {translate('voice.listening', 'Listening...')}
                </span>
              </div>
              {transcript && (
                <p className="text-sm text-muted-foreground mt-2">
                  "{transcript}"
                </p>
              )}
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {translate('voice.processing', 'Processing your query...')}
                </span>
              </div>
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-3 bg-accent/20 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 text-accent-foreground">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Volume2 className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">
                  {translate('voice.speaking', 'Speaking recommendations...')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Display */}
        {response && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-card border rounded-lg"
          >
            <p className="text-sm leading-relaxed">{response}</p>
            {ttsSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speak(response)}
                className="mt-2 h-8 px-2 text-xs"
              >
                <Volume2 className="w-3 h-3 mr-1" />
                Repeat
              </Button>
            )}
          </motion.div>
        )}

        {/* Error Display */}
        {(voiceError || ttsError) && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              {voiceError || ttsError}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;