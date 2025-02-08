// src/types/chat.ts
import { ServiceData } from "./serviceTypes";

// types/index.ts
export const TOKENS = {
  USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
  OM: { address: "0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98", decimals: 18 },
  AAVE: { address: "0x63706e401c06ac8513145b7687A14804d17f814b", decimals: 18 },
  RETH: { address: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c", decimals: 18 },
  VIRTUAL: { address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b", decimals: 18 },
  AERO: { address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", decimals: 18 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  USDT: { address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6 },
} as const;
export type TokenSymbol = keyof typeof TOKENS;


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