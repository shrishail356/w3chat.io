import { useState, useEffect } from 'react';

interface UseTypingEffectProps {
  text: string;
  typingSpeed?: number;
  delayBetweenWords?: number;
}

export const useTypingEffect = ({ 
  text, 
  typingSpeed = 50, 
  delayBetweenWords = 150 
}: UseTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    let currentIndex = 0;
    let currentText = '';

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        const nextChar = text[currentIndex];
        currentText += nextChar;
        setDisplayedText(currentText);
        currentIndex++;

        // Calculate delay for next character
        let delay = typingSpeed;
        
        // Add extra delay after punctuation
        if (['.', '!', '?', ','].includes(nextChar)) {
          delay += delayBetweenWords;
        }
        // Add delay for word breaks
        else if (nextChar === ' ') {
          delay += delayBetweenWords / 2;
        }

        setTimeout(typeNextCharacter, delay);
      } else {
        setIsTyping(false);
      }
    };

    typeNextCharacter();

    return () => {
      setDisplayedText('');
      setIsTyping(false);
    };
  }, [text, typingSpeed, delayBetweenWords]);

  return {
    displayedText,
    isTyping
  };
}; 