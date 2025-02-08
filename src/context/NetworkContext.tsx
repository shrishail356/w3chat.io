"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';

// Network type definition
export type NetworkType = "mainnet" | "sepolia" | "incorrect" | null;

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
  mainnet: 8453,
  sepolia: 84532
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNetwork, setSelectedNetworkState] = useState("Base");
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

    if (numericChainId === CHAIN_IDS.mainnet) {
      setNetworkType("mainnet");
      setIsCorrectNetwork(true);
    } else if (numericChainId === CHAIN_IDS.sepolia) {
      setNetworkType("sepolia");
      setIsCorrectNetwork(true);
    } else {
      setNetworkType("incorrect");
      setIsCorrectNetwork(false);
    }
  };

  const switchNetwork = async (newNetworkType: NetworkType) => {
    if (!wallets?.[0] || newNetworkType === "incorrect") return;
    
    try {
      const chainId = newNetworkType === "mainnet" ? CHAIN_IDS.mainnet : CHAIN_IDS.sepolia;
      await wallets[0].switchChain(chainId);
      setNetworkType(newNetworkType);
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

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};