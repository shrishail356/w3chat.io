// src/app/chat/hooks/useRecording.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';

export const useRecording = (setInputMessage: (message: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  return { isRecording, startRecording };
};