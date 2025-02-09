// src/app/chat/components/ChatHeader.tsx
import React from 'react';
import Image from 'next/image';
const ChatHeader: React.FC = () => {
  return (
    <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center space-x-2">
      <img
        src="/agents/eigen.png"
        alt="Eigen"
        className="w-8 h-8 rounded-full border border-cyan-500/50"
      />
      <div>
        <h2 className="font-semibold">
          Eigen <span className="text-cyan-400 text-sm">(Bridge Agent)</span>
        </h2>
        <p className="text-xs text-gray-400">
          Your web3 transaction maestro
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;