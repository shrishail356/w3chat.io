// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// src/app/chat/components/ChatSidebar.tsx
import React from 'react';
import { Plus, MessageCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { usePrivy } from '@privy-io/react-auth';
import { useNetwork } from '@/context/NetworkContext';
import { useChatOperations } from '../hooks/useChatOperations';

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string) => void;
  botType : "goku" | "rose" | "devguru";
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ sidebarOpen, setSidebarOpen, selectedSessionId, setSelectedSessionId, botType }) => {
  const { user } = usePrivy();
  const { connectedAddress } = useNetwork();
  const {
    chatHistory,
    editingId,
    editTitle,
    setEditingId,
    setEditTitle,
    createNewChat,
    deleteChat,
    updateChatTitle,
  } = useChatOperations(user?.id, setSelectedSessionId);

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleUpdateTitle(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const startEditing = (chat: { id: string; title: string }) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleUpdateTitle = async (id: string) => {
    if (editTitle.trim()) {
      await updateChatTitle(id, editTitle);
      setEditingId(null);
    }
  };

  return (
    <div
    className={`
      fixed md:relative z-20 
      ${sidebarOpen ? "w-80" : "w-0"} 
      h-full bg-white/5 backdrop-blur-md transition-all duration-300 
      border-r border-white/10 overflow-hidden
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      <div className="p-4">
        <button
          onClick={() => connectedAddress && createNewChat(connectedAddress)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl 
            hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 
            flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        <div className="mt-6 space-y-2">
          {chatHistory.map((chat) => (
            <div
                key={chat.id}
                className={`p-3 rounded-xl cursor-pointer ${selectedSessionId === chat.id ? 'bg-blue-500' : 'hover:bg-white/10'}`}
                onClick={() => setSelectedSessionId(chat.id)}
              >
          
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle size={18} className="text-cyan-400" />
                  {editingId === chat.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, chat.id)}
                      onBlur={() => handleUpdateTitle(chat.id)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium">{chat.title}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => startEditing(chat)} 
                    className="hover:text-cyan-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteChat(chat.id)} 
                    className="hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center space-x-2">
                <Clock size={12} />
                <span>{format(chat.timestamp, "MMM d, yyyy h:mm a")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;