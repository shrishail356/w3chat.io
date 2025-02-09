// src/types/chat.ts
import { NetworkType } from "@/context/NetworkContext";
import { ServiceData } from "./serviceTypes";

// types/index.ts
export const TOKENS_BASE_MAINNET = {
  USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
  OM: { address: "0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98", decimals: 18 },
  AAVE: { address: "0x63706e401c06ac8513145b7687A14804d17f814b", decimals: 18 },
  RETH: { address: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c", decimals: 18 },
  VIRTUAL: { address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b", decimals: 18 },
  AERO: { address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", decimals: 18 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  USDT: { address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6 },
} as const;

export const TOKENS_BASE_SEPOLIA = {
  USDC: { address: "0x036cbd53842c5426634e7929541ec2318f3dcf7e", decimals: 6 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  ETH : {address: "", decimals:18},
  EURC: {address: "0x808456652fdb597867f38412077a9182bf77359f", decimals: 6},
} as const;

export const TOKENS_ARBITRUM_MAINNET = {
  USDC: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
  WETH: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18 },
} as const;

export const TOKENS_ARBITRUM_SEPOLIA = {
  USDC: { address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", decimals: 6 },
  WETH: { address: "0xE591bf0A0CF924A0674d7792db046B23CEbF5f34", decimals: 18 },
} as const;

export const TOKENS_WARDEN_TESTNET = {
  USDC: { address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", decimals: 6 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
} as const;

// Helper function to get tokens based on network
export const getNetworkTokens = (network: NetworkType) => {
  switch (network) {
    case "base_mainnet":
      return TOKENS_BASE_MAINNET;
    case "base_sepolia":
      return TOKENS_BASE_SEPOLIA;
    case "arbitrum_mainnet":
      return TOKENS_ARBITRUM_MAINNET;
    case "arbitrum_sepolia":
      return TOKENS_ARBITRUM_SEPOLIA;
    case "warden_testnet":
      return TOKENS_WARDEN_TESTNET;
    default:
      return TOKENS_BASE_MAINNET; // Default fallback
  }
};

export type TokenSymbol = keyof typeof TOKENS_BASE_MAINNET;

export enum BotType {
  GOKU = "goku" 
}
  
  export interface UserSession {
    user_id: string;
    bot_type: BotType;
    wallet_address?: string;
    name?: string;
  }
  
  export interface MessageRequest {
    session_id?: string;
    user_id: string;
    bot_type: BotType;
    content: string;
    wallet_address?: string;
  }
 
  export interface ChatHistory {
    id: string;
    title: string;
    timestamp: Date;
    messageCount: number;
  }

export interface ChatMessage {
  role: "user" | "ai";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AITransactionParse {
  recipient: string;
  amount_in_wei: number;
  isERC20: boolean;
  tokenAddress?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  parsedData?: ServiceData;
  transaction_info?: {
    service_type: string;
    transaction_status: 'success' | 'failed' | 'cancelled';
    transaction_hash?: string;
    transaction_details: Record<string, any>;
  };
}

export type BlockchainNetworkVar = string;
  // src/types/chat.ts
  export enum BlockchainNetwork {
    BASE = "base",
  }
  
  export enum TransactionStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    REJECTED = "rejected",
    COMPLETED = "completed",
  }
  

  export interface TransactionContext {
    amount?: number;
    token?: string;
    to_address?: string;
    network?: string;
    status?: TransactionStatus;
    created_at?: string;
    updated_at?: string;
    token_address?: string | null;
  }