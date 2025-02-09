'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Bot, Menu, X, ChevronDown, LogOut, Copy, ExternalLink, Wallet } from "lucide-react";
import { useNetwork } from '@/context/NetworkContext';
import '@rainbow-me/rainbowkit/styles.css';
import { usePrivy } from '@privy-io/react-auth';
import { useMobile } from '@/context/MobileContext';

interface NavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  portfolioOpen?: boolean;
  setPortfolioOpen?: (open: boolean) => void;
  botType: string;
}

function LoginButton() {
  const {ready, authenticated, login} = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
 
  return (
    <button 
      disabled={disableLogin} 
      onClick={login}
      className={`
        px-3 py-1.5 
        text-sm 
        rounded-lg 
        bg-blue-500 
        text-white 
        transition-colors
        ${disableLogin 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-blue-600'
        }
      `}
    >
      Log in
    </button>
  );
}

function UserProfileButton() {
  const { user, logout } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const { networkType } = useNetwork();
  if (!user?.wallet?.address) return null;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (user.wallet?.address) {
      await navigator.clipboard.writeText(user.wallet.address);
      // You could add a toast notification here
    }
  };

  const openExplorer = () => {
    if (user.wallet?.address) {
      const baseUrl = networkType === 'base_mainnet'
        ? 'https://basescan.org/address/'
        : 'https://sepolia.basescan.org/address/';
      window.open(baseUrl + user.wallet.address, '_blank');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#112240] hover:bg-[#1a3157] 
        border border-white/20 rounded-lg text-white transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
        <span>{formatAddress(user.wallet.address)}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#112240] border border-white/20 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
              <div>
                <p className="text-sm font-medium text-white">Connected Wallet</p>
                <p className="text-xs text-gray-400">{formatAddress(user.wallet.address)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 
                rounded-lg text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy Address
              </button>
              <button
                onClick={openExplorer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 
                rounded-lg text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View on {networkType === 'base_mainnet' ? 'BaseScan' : 'Base Sepolia'}
              </button>
            </div>
          </div>

          {/* Show connected accounts if available */}
          {(user.email || user.discord || user.google) && (
            <div className="p-4 border-b border-white/10">
              <p className="text-xs text-gray-400 mb-2">Connected Accounts</p>
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-white">
                  <span>📧</span>
                  {user.email.address}
                </div>
              )}
              {user.discord && (
                <div className="flex items-center gap-2 text-sm text-white">
                  <span>📱</span>
                  {user.discord.username}
                </div>
              )}
              {user.google && (
                <div className="flex items-center gap-2 text-sm text-white">
                  <span>🔵</span>
                  {user.google.email}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 p-4 text-red-400 hover:bg-white/5 transition-colors rounded-b-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Disconnect Wallet</span>
          </button>
        </div>
      )}
    </div>
  );
}

const NavBar: React.FC<NavBarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  portfolioOpen, 
  setPortfolioOpen, 
  botType 
}) => {
  const { connectedAddress, networkType, setNetworkType } = useNetwork();
  const { isMobile } = useMobile();
  

  const isTransactionBot = botType?.toLowerCase() === "goku";

  const walletButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#112240',
    border: '1px solid #0A192F',
    borderRadius: '12px',
    padding: '0 16px',
    height: '40px',
    color: 'white',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 200ms ease-in-out'
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Replace the existing NetworkSelector component with this:
  const NetworkSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { networkType, setNetworkType, isCorrectNetwork } = useNetwork();
  
    const isValidNetwork = networkType === 'base_mainnet' || networkType === 'arbitrum_mainnet';
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center text-xs sm:text-sm border rounded-lg 
          px-3 py-1.5 text-white cursor-pointer pr-8 font-medium
          focus:outline-none focus:ring-1 transition-colors
          ${isValidNetwork 
            ? 'bg-[#112240] hover:bg-[#1a3157] border-white/20 focus:border-cyan-300 focus:ring-cyan-300' 
            : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 focus:border-red-400 focus:ring-red-400'
          }`}
        >
          <span className="mr-4">
            {!isValidNetwork ? 'Incorrect Network' : 
             networkType === 'base_mainnet' ? 'Base' : 'Arbitrum'}
          </span>
          <ChevronDown className={`w-4 h-4 absolute right-2 ${isValidNetwork ? 'text-cyan-300' : 'text-red-400'}`} />
        </button>
  
        {isOpen && (
          <div className="absolute z-50 mt-3 min-w-[160px] bg-[#112240] border border-white/20 rounded-lg shadow-lg">
            <button
              onClick={() => {
                setNetworkType('base_mainnet');
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-white hover:bg-[#1a3157] first:rounded-t-lg"
            >
              Base
            </button>
            <button
              onClick={() => {
                setNetworkType('arbitrum_mainnet');
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-white hover:bg-[#1a3157] last:rounded-b-lg"
            >
              Arbitrum
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAuthButton = () => {
    const { authenticated } = usePrivy();
    
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <NetworkSelector />
        {authenticated ? <UserProfileButton /> : <LoginButton />}
        {connectedAddress && (
            <button
              onClick={() => setPortfolioOpen && setPortfolioOpen(!portfolioOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Wallet className="w-5 h-5 text-cyan-300" />
            </button>
          )}
      </div>
    );
  }

  return (
    <nav className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="h-full px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          <Link href="/" className="group flex items-center space-x-3">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300" />
            {!isMobile && (
              <span className="text-lg sm:text-xl font-bold tracking-tight">W3Chat.io</span>
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {renderAuthButton()}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
