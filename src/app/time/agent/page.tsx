"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/Header/NavBar";
import { useNetwork } from "@/context/NetworkContext";
import PortfolioSidebar from "@/components/PortfolioSidebar";
import { usePrivy } from "@privy-io/react-auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Message } from "@/types/chat";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

const ChatPage: React.FC = () => {
  const { user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const { connectedAddress } = useNetwork();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_CLIENT_URL;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedSessionId || !user?.id) return;

      try {
        const response = await fetch(`${API_URL}/chat-history/${selectedSessionId}`);
        if (!response.ok) throw new Error('Failed to fetch chat history');

        const data = await response.json();
      
        const transformedMessages = data.chat_history.map((msg: any) => ({
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          transaction_info: msg.transaction_info
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        
      }
    };

    fetchChatHistory();
  }, [selectedSessionId, user?.id]);

  return (
    <div className="relative min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-white">
      <NavBar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        portfolioOpen={portfolioOpen}
        setPortfolioOpen={setPortfolioOpen}
        botType="goku" 
      />

      <div className="flex h-[calc(100vh-64px)]">
        <ChatSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedSessionId={selectedSessionId}
          setSelectedSessionId={setSelectedSessionId}
          botType="goku"
        />

        <div className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${sidebarOpen ? "md:ml-80" : "ml-0"}
        `}>
          <ChatHeader />
          <ChatMessages 
            messages={messages} 
            onSelectQuery={setInputMessage}
            selectedSessionId={selectedSessionId}
            botType="goku"
          />
          <ChatInput 
            inputMessage={inputMessage} 
            setInputMessage={setInputMessage} 
            onSendMessage={(message) => setMessages(prev => [...prev, message])}
            selectedSessionId={selectedSessionId}
            userId={user?.id}
            botType="goku"
          />
        </div>

        {connectedAddress && (
          <PortfolioSidebar 
            isOpen={portfolioOpen}
            walletAddress={connectedAddress}
          />
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ChatPage;