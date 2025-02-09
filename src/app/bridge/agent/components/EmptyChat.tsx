// src/app/chat/components/EmptyChat.tsx
import React from 'react';
import { Bot } from 'lucide-react';
interface EmptyChatProps {
    onSelectQuery: (query: string) => void;
}

const EmptyChat: React.FC<EmptyChatProps> = ({ onSelectQuery }) => {
  const suggestedQueries = [
    "Send 1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "Swap 1 ETH to USDC",
    "Get my wallet balances of all tokens",
    "Swap all my tokens to ETH",
    "/batch",
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Bot className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Welcome to Goku - Your Transaction maestro
          </h3>
          <p className="text-gray-400">
            I am capable of handling Web3 operations such as sending ETH and ERC20 tokens!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectQuery(query);
              }}
              className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-cyan-500/50 w-full md:w-auto"
            >
              <p className="text-sm text-gray-300 truncate">{query}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;