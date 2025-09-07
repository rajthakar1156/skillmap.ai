import { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseVoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  continuous?: boolean;
  lang?: string;
}

export const useVoiceRecognition = ({ 
  onTranscript, 
  continuous = false,
  lang = 'en-IN' 
}: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const {
    transcript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Update language when it changes
  useEffect(() => {
    if (isListening) {
      // Restart listening with new language
      stopListening();
      setTimeout(() => {
        startListening();
      }, 100);
    }
  }, [lang]);

  // Handle final transcript
  useEffect(() => {
    if (finalTranscript && finalTranscript.trim()) {
      onTranscript(finalTranscript);
      resetTranscript();
      if (!continuous) {
        stopListening();
      }
    }
  }, [finalTranscript, onTranscript, continuous, resetTranscript]);

  const startListening = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setError(null);
      setIsListening(true);
      resetTranscript();
      
      await SpeechRecognition.startListening({
        continuous,
        language: lang,
        interimResults: true,
      });

      // Auto stop after 10 seconds of no speech
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening();
          setError('No speech detected. Please try again.');
        }
      }, 10000);

    } catch (err) {
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  }, [browserSupportsSpeechRecognition, continuous, lang, isListening, resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Handle speech end automatically
  useEffect(() => {
    const handleSpeechEnd = () => {
      if (!continuous && isListening) {
        setTimeout(() => {
          stopListening();
        }, 1000); // Wait 1 second after speech ends
      }
    };

    if (isListening && transcript && !finalTranscript) {
      // Clear and reset timeout when user is speaking
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleSpeechEnd, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [transcript, finalTranscript, isListening, continuous, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      SpeechRecognition.stopListening();
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    clearError: () => setError(null)
  };
};