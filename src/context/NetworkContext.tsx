"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';

export type NetworkType = 
  | "base_mainnet" 
  | "base_sepolia" 
  | "arbitrum_mainnet" 
  | "arbitrum_sepolia" 
  | "warden_testnet" 
  | "ethereum_mainnet"
  | "ethereum_sepolia"
  | "polygon_mainnet"
  | "polygon_mumbai"
  | "optimism_mainnet"
  | "optimism_sepolia"
  | "incorrect" 
  | null;

interface NetworkContextType {
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
  connectedAddress: string | null;
  networkType: NetworkType;
  isLoading: boolean;
  setNetworkType: (network: NetworkType) => void;
  isCorrectNetwork: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const CHAIN_IDS = {
  base_mainnet: 8453,
  base_sepolia: 84532,
  arbitrum_mainnet: 42161,
  arbitrum_sepolia: 421614,
  warden_testnet: 10010,
  ethereum_mainnet: 1,
  ethereum_sepolia: 11155111,
  polygon_mainnet: 137,
  polygon_mumbai: 80001,
  optimism_mainnet: 10,
  optimism_sepolia: 11155420
};

const NETWORK_NAMES = {
  base_mainnet: "Base Mainnet",
  base_sepolia: "Base Sepolia",
  arbitrum_mainnet: "Arbitrum Mainnet",
  arbitrum_sepolia: "Arbitrum Sepolia",
  warden_testnet: "Warden Testnet",
  ethereum_mainnet: "Ethereum Mainnet",
  ethereum_sepolia: "Ethereum Sepolia",
  polygon_mainnet: "Polygon Mainnet",
  polygon_mumbai: "Polygon Mumbai",
  optimism_mainnet: "Optimism Mainnet",
  optimism_sepolia: "Optimism Sepolia"
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNetwork, setSelectedNetworkState] = useState(NETWORK_NAMES.base_mainnet);
  const [networkType, setNetworkType] = useState<NetworkType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const { user } = usePrivy();
  const { wallets } = useWallets();

  const validateAndSetNetwork = async () => {
    if (!wallets?.[0]) return;

    const currentChainId = wallets[0].chainId;
    // Extract the numeric chain ID from CAIP-2 format (e.g., "eip155:8453" -> 8453)
    const numericChainId = parseInt(currentChainId.split(":")[1]);

    // Check which network matches the current chain ID
    const matchingNetwork = Object.entries(CHAIN_IDS).find(
      ([_, chainId]) => chainId === numericChainId
    );

    if (matchingNetwork) {
      setNetworkType(matchingNetwork[0] as NetworkType);
      setIsCorrectNetwork(true);
    } else {
      setNetworkType("incorrect");
      setIsCorrectNetwork(false);
    }
  };

  const switchNetwork = async (newNetworkType: NetworkType) => {
    if (!wallets?.[0] || newNetworkType === "incorrect") return;
    
    try {
      const chainId = CHAIN_IDS[newNetworkType as keyof typeof CHAIN_IDS];
      await wallets[0].switchChain(chainId);
      setNetworkType(newNetworkType);
      setSelectedNetworkState(NETWORK_NAMES[newNetworkType as keyof typeof NETWORK_NAMES]);
      setIsCorrectNetwork(true);
    } catch (error) {
      console.error("Failed to switch network:", error);
      setNetworkType("incorrect");
      setIsCorrectNetwork(false);
    }
  };

  // Check network on initial load and when wallet changes
  useEffect(() => {
    if (wallets?.[0]) {
      validateAndSetNetwork();
    }
  }, [wallets]);

  // Check network periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (wallets?.[0]) {
        validateAndSetNetwork();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [wallets]);

  useEffect(() => {
    const savedNetwork = localStorage.getItem("selectedNetwork");
    if (savedNetwork) {
      setSelectedNetworkState(savedNetwork);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedNetwork", selectedNetwork);
  }, [selectedNetwork]);

  const setSelectedNetwork = (network: string) => {
    setSelectedNetworkState(network);
  };

  return (
    <NetworkContext.Provider
      value={{
        selectedNetwork,
        setSelectedNetwork,
        connectedAddress: user?.wallet?.address || null,
        networkType,
        isLoading,
        setNetworkType: switchNetwork,
        isCorrectNetwork
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

// Helper function to get network display name
export const getNetworkDisplayName = (networkType: NetworkType): string => {
  if (!networkType || networkType === "incorrect") return "Incorrect Network";
  return NETWORK_NAMES[networkType];
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};