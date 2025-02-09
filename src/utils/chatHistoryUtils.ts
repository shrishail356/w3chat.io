import { TransactionInfo } from "@/types/renderTypes";
const API_URL = process.env.NEXT_PUBLIC_CLIENT_URL;
export const pushToChatHistory = async (
    sessionId: string,
    content: string,
    transactionInfo: TransactionInfo
  ) => {
    try {
      const response = await fetch(`${API_URL}/chat-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          role: 'assistant',
          content: content,
          transaction_info: transactionInfo,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to push to chat history');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error pushing to chat history:', error);
      throw error;
    }
  };

  export const pushToChatHistoryNoTransaction = async (
    sessionId: string,
    content: string,

  ) => {
    try {
      const response = await fetch(`${API_URL}/chat-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          role: 'user',
          content: content,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to push to chat history');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error pushing to chat history:', error);
      throw error;
    }
  };

  export const pushToChatHistoryNoAiTransaction = async (
    sessionId: string,
    content: string,

  ) => {
    try {
      const response = await fetch(`${API_URL}/chat-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          role: 'assistant',
          content: content,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to push to chat history');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error pushing to chat history:', error);
      throw error;
    }
  };