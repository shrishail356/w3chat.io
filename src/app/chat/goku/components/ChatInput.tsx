// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
import React, { useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { Message } from '@/types/chat';
import { useRecording } from '../hooks/useRecording';
import { useNetwork } from '@/context/NetworkContext';
import { useTransactionHandler } from '../hooks/useTransactionHandler';
import TransactionConfirmationModal from '../components/TransactionConfirmationModal';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (message: Message) => void;
  selectedSessionId: string | null;
  userId: string | undefined;
  botType: "goku" | "rose" | "devguru";
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage,
  selectedSessionId,
  userId,
  botType
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isRecording, startRecording } = useRecording(setInputMessage);
  const { connectedAddress } = useNetwork();
  const API_URL = process.env.NEXT_PUBLIC_CLIENT_URL;
  const {
    isModalOpen,
    currentTransaction,
    handleConfirmTransaction,
    closeModal
  } = useTransactionHandler(
    onSendMessage, 
    selectedSessionId, 
    userId,
    botType
  );

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto first to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height based on content, with minimum height
      const newHeight = Math.max(52, Math.min(textarea.scrollHeight, 160));
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Adjust height whenever input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && selectedSessionId) {
      const userMessage: Message = {
        role: "user",
        content: inputMessage,
        timestamp: new Date(),
      };
      onSendMessage(userMessage);
      setInputMessage("");
      
      // Reset height immediately after clearing
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }

      try {
        const response = await fetch(`${API_URL}/chat/goku`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId, 
            session_id: selectedSessionId,
            content: inputMessage,
            wallet_address: connectedAddress,
            bot_type: botType
          })
        });

        const data = await response.json();
        console.log("This is the data that i got from the ai ", data);
        
        const aiMessage: Message = {
          role: "assistant",
          content: data.response.answer,
          timestamp: new Date(),
          parsedData: {
            ...data.response.parsed_data,
            serviceType: data.response.parsed_data.serviceType,
            isReadyForTransaction: data.response.parsed_data.isReadyForTransaction
          }
        };
        onSendMessage(aiMessage);
        
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
        };
        onSendMessage(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  return; // Allow new line
                } else {
                  e.preventDefault();
                  selectedSessionId && handleSendMessage();
                }
              }
            }}
            placeholder="Message Goku..."
            className="w-full bg-white/10 text-white rounded-xl pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 resize-none overflow-hidden block min-h-[52px]"
            disabled={!selectedSessionId}
            rows={1}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              onClick={startRecording}
              className={`p-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "hover:bg-white/10"} transition-all duration-200`}
              disabled={!selectedSessionId}
            >
              <Mic size={20} className={isRecording ? "text-white" : ""} />
            </button>
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-cyan-400 hover:text-cyan-300"
              disabled={!selectedSessionId}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      {currentTransaction && (
        <TransactionConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirmTransaction}
          transaction={currentTransaction}
        />
      )}
    </>
  );
};

export default ChatInput;