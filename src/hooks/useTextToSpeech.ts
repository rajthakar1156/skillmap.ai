import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTextToSpeechProps {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useTextToSpeech = ({
  lang = 'en-IN',
  rate = 1,
  pitch = 1,
  volume = 1
}: UseTextToSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, options?: Partial<UseTextToSpeechProps>) => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in your browser');
      return;
    }

    if (!text.trim()) {
      setError('No text to speak');
      return;
    }

    // Stop any current speech
    if (isSpeaking) {
      speechSynthesis.cancel();
    }

    try {
      setError(null);
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure voice settings
      utterance.lang = options?.lang || lang;
      utterance.rate = options?.rate || rate;
      utterance.pitch = options?.pitch || pitch;
      utterance.volume = options?.volume || volume;

      // Find the best voice for the language
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => 
        v.lang.toLowerCase().includes(utterance.lang.toLowerCase())
      ) || voices.find(v => v.lang.includes('en'));
      
      if (voice) {
        utterance.voice = voice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
        utteranceRef.current = null;
      };

      // Start speaking
      speechSynthesis.speak(utterance);

    } catch (err) {
      setIsSpeaking(false);
      setError('Failed to start text-to-speech');
    }
  }, [isSupported, isSpeaking, lang, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, [isSpeaking]);

  const pause = useCallback(() => {
    if (isSpeaking && speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    error,
    isSupported,
    clearError: () => setError(null)
  };
};