// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// src/app/chat/hooks/useChatOperations.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChatHistory } from '@/types/chat';

export const useChatOperations = (userId: string | undefined, setSelectedSessionId: (id: string) => void) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_CLIENT_URL;
  const fetchChatHistory = async () => {
    if (!userId) return;
    
    try {
      // Update endpoint URL to match Python backend
      const response = await fetch(`${API_URL}/user-sessions/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        // FastAPI uses 'detail' for error messages
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // The response structure matches exactly, so we can keep this part the same
      const gokuSessions = data.sessions["goku"] || [];
      
      const formattedHistory: ChatHistory[] = gokuSessions
        .sort((a: { created_at: string }, b: { created_at: string }) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((session: { 
          session_id: string; 
          name: string; 
          created_at: string;
          chat_history?: any[];  // Added since it's in the Python response
          wallet_address?: string; // Added since it's in the Python response
        }) => ({
          id: session.session_id,
          title: session.name || '',
          timestamp: new Date(session.created_at),
          messageCount: session.chat_history?.length || 0, // Can now use actual chat history length
          walletAddress: session.wallet_address // If you need this in your ChatHistory type
        }));

      setChatHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const createNewChat = async (connectedAddress: string) => {
    try {
      if (!userId) {
        toast.error("Not signed in");
        return;
      }

      const sessionData = {
        user_id: userId,
        bot_type: "goku", // Note: Assuming this matches your Python BotType enum
        name: `Chat ${chatHistory.length + 1}`,
        wallet_address: connectedAddress
      };

      // Update the endpoint URL to match your Python backend
      const response = await fetch(`${API_URL}/create-session`, { // Removed /api prefix
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Python FastAPI returns error details in the 'detail' field
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newChat: ChatHistory = {
        id: data.session_id,
        title: data.name,
        timestamp: new Date(),
        messageCount: 0,
      };

      setChatHistory([newChat, ...chatHistory]);
      setSelectedSessionId(data.session_id);
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  const deleteChat = async (id: string) => {
    try {
      // Update endpoint URL to match Python backend
      const response = await fetch(`${API_URL}/session/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete chat: ${response.statusText}`);
      }

      await fetchChatHistory();
      setSelectedSessionId("");
      toast.success('Chat deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete chat.');
    }
  };

const updateChatTitle = async (id: string, newTitle: string) => {
    try {
      // Update endpoint URL to match Python backend
      const response = await fetch(`${API_URL}/session/${id}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_title: newTitle }), // This matches the Python TitleUpdate model
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update title: ${response.statusText}`);
      }

      await fetchChatHistory();
      toast.success('Chat title updated.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update title.');
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  return {
    chatHistory,
    editingId,
    editTitle,
    setEditingId,
    setEditTitle,
    createNewChat,
    deleteChat,
    updateChatTitle,
  };
};