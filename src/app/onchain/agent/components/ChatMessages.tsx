import React, { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import EmptyChat from './EmptyChat';
import TypingMessage from './TypingMessage';
import ServiceComponent from './ServiceComponent';
import {ServiceData} from '@/types/serviceTypes';
import TokenSendResult from './RenderResult/TokenSendResult';
import RequestFaucetResult from './RenderResult/RequestFaucetResult';
import SwapTwoTokensResult from './RenderResult/SwapTwoTokensResult';
import { usePrivy } from "@privy-io/react-auth";
import Image from 'next/image';
import BatchTransferResult from './RenderResult/BatchTransferResult';
interface ChatMessagesProps {
    messages: Message[];
    onSelectQuery: (query: string) => void;
    selectedSessionId: string | null;
    botType: "goku" | "rose" | "devguru";
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onSelectQuery, selectedSessionId, botType }) => {
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(true);
  const previousMessagesLength = useRef(messages.length);
  const isNewUserInput = useRef(false);
  const { user } = usePrivy();
  const formatMessage = (content: string | undefined) => {
    if (!content) return '';
    if (content.includes('### Response:')) {
      return content.split('### Response:')[1].trim();
    }
    if (content.includes('**Response**')) {
      return content.split('**Response**')[1].trim();
    }
    return content;
  };
  
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTypingComplete]);

  // Reset state when session changes
  useEffect(() => {
    setCurrentTypingMessage(null);
    setIsTypingComplete(true);
    previousMessagesLength.current = messages.length;
    isNewUserInput.current = false;
  }, [selectedSessionId]);

  useEffect(() => {
    if (messages.length > previousMessagesLength.current) {
      const latestMessage = messages[messages.length - 1];
      
      // If it's a user message, mark that we're expecting a response
      if (latestMessage.role === 'user') {
        isNewUserInput.current = true;
      }
      // Only animate typing for AI responses that come after user input
      else if (latestMessage.role === 'assistant' && isNewUserInput.current) {
        if (latestMessage.content) {
          setCurrentTypingMessage(latestMessage.content);
          setIsTypingComplete(false);
          isNewUserInput.current = false;  // Reset the flag
        }
      }
    }
    previousMessagesLength.current = messages.length;
  }, [messages]);


  const renderServiceComponent = (parsedData: ServiceData) => {
    return (
      <ServiceComponent
        serviceType={parsedData.serviceType}
        parsedData={parsedData}
        sessionId={selectedSessionId || ''}
        onConfirm={() => {
          console.log("Transaction confirmed", parsedData);
        }}
        onCancel={() => {
          console.log("Transaction cancelled");
        }}
      />
    );
  };

  const renderTransactionResult = (message: Message, index: number) => {
    return (
      <div key={index} className="flex justify-start items-end space-x-2 animate-fadeIn">
        <div className="flex-shrink-0">
          <img
            src={`/img/${botType}.png`}
            alt={botType}
            className="w-8 h-8 rounded-full border-2 border-cyan-500/50"
          />
        </div>
        <div className="flex flex-col max-w-[85%] md:max-w-2xl">
          {message.transaction_info?.service_type === 'tokenSend' ? (
            <TokenSendResult
              status={message.transaction_info.transaction_status}
              transactionHash={message.transaction_info.transaction_hash ?? ''}
              details={message.transaction_info.transaction_details as { amount: number; token: string; recipient: string }}
            />
          ) : message.transaction_info?.service_type === 'snsTokenSend' ? (
            <TokenSendResult
              status={message.transaction_info.transaction_status}
              transactionHash={message.transaction_info.transaction_hash ?? ''}
              details={message.transaction_info.transaction_details as { amount: number; token: string; recipient: string }}
            />
          ) : message.transaction_info?.service_type === 'requestFaucet' ? (
            <RequestFaucetResult
              status={message.transaction_info.transaction_status}
              transactionHash={message.transaction_info.transaction_hash ?? ''}
              details={message.transaction_info.transaction_details as { network: string }}
            />
          ) : message.transaction_info?.service_type === 'swapTwoTokens' ? (
            <SwapTwoTokensResult
              status={message.transaction_info.transaction_status}
              transactionHash={message.transaction_info.transaction_hash ?? ''}
              details={message.transaction_info.transaction_details as { 
                fromToken: string; 
                toToken: string; 
                amount: number; 
                expectedOutput?: number 
              }}
            />
          ) : message.transaction_info?.service_type === 'batchTransfer' ? (
            <BatchTransferResult
              status={message.transaction_info.transaction_status}
              transactionHash={message.transaction_info.transaction_hash ?? ''}
              totalTransfers={message.transaction_info.transaction_details.total_transfers}
              transfers={message.transaction_info.transaction_details.transfers}
              network={message.transaction_info.transaction_details.network}
            />
          ) :  (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
              Transaction Result Pending Implementation
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1 px-2">
            {format(message.timestamp, "h:mm a")}
          </div>
        </div>
      </div>
    );
  };
  
  const renderMessage = (message: Message, index: number) => {
    if (message.role === "assistant" && message.transaction_info) {
      return renderTransactionResult(message, index);
    }

    const showServiceComponent = 
      message.role === "assistant" && 
      message.parsedData?.isReadyForTransaction;

    return (
      <div
        key={index}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        } items-end space-x-2 animate-fadeIn`}
      >
        {message.role === "assistant" && (
          <div className="flex-shrink-0">
            <img
              src={`/img/${botType}.png`}
              alt={botType}
              className="w-8 h-8 rounded-full border-2 border-cyan-500/50"
            />
          </div>
        )}
        <div className="flex flex-col max-w-[85%] md:max-w-2xl">
        {showServiceComponent && message.parsedData ? (
          renderServiceComponent(message.parsedData as ServiceData)
          ) : (
            <div
              className={`p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white"
                  : "bg-white/10 backdrop-blur-md"
              } shadow-lg ${
                message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                wordBreak: "break-word", 
                overflowWrap: "anywhere", 
              }}
            >
              <div className="text-sm sm:text-base prose prose-invert max-w-none">
                {message.role === "assistant" &&
                message.content === currentTypingMessage &&
                !isTypingComplete ? (
                  <>
                    <TypingMessage
                      content={formatMessage(message.content)}
                      onComplete={() => setIsTypingComplete(true)}
                    />
                    <span className="inline-block w-2 h-4 ml-1 bg-cyan-500 animate-pulse" />
                  </>
                ) : (
                  <ReactMarkdown>{formatMessage(message.content)}</ReactMarkdown>
                )}
              </div>
            </div>

          )}
          <div className="text-xs text-gray-400 mt-1 px-2">
            {format(message.timestamp, "h:mm a")}
          </div>
        </div>
        {message.role === "user" && (
          <div className="flex-shrink-0">
            <img
              src={`/img/${botType}.png`}
              alt="User"
              className="w-8 h-8 rounded-full border border-white/20"
            />
          </div>
        )}
      </div>
    );
  };

  if (messages.length === 0 || !selectedSessionId) {
    return <EmptyChat onSelectQuery={onSelectQuery} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-6">
        {messages.map((message, index) => renderMessage(message, index))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;