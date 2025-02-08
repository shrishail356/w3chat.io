interface BaseServiceData {
    serviceType: string;
    isReadyForTransaction: boolean;
    sessionId: string;
  }
  
  // Token Send
  export interface TokenSendData extends BaseServiceData {
    serviceType: 'tokenSend';
    amount: number | null;
    token: string;
    toAddress: string | null;
  }
  
  // ENS Token Send
  export interface ENSTokenSendData extends BaseServiceData {
    serviceType: 'ensTokenSend';
    amount: number | null;
    token: string;
    domain: string | null;
  }
  
  // Batch Transfer
  interface TransferItem {
    token: string;
    amount: number | null;
    toAddress: string | null;
  }
  
  export interface BatchTransferData extends BaseServiceData {
    serviceType: 'batchTransfer';
    transfers: TransferItem[];
  }
  
  // Swap Two Tokens
  export interface SwapTwoTokensData extends BaseServiceData {
    serviceType: 'swapTwoTokens';
    fromToken: string;
    toToken: string;
    amount: number | null;
  }
  
  // Get Wallet Balances
  export interface GetWalletBalancesData extends BaseServiceData {
    serviceType: 'getWalletBalances';
    addresses: string[];
  }
  
  // Get Wallet Portfolio
  export interface GetWalletPortfolioData extends BaseServiceData {
    serviceType: 'getWalletPortfolio';
    addresses: string[];
  }
  

  // Request Faucet
  export interface RequestFaucetData extends BaseServiceData {
    serviceType: 'requestFaucet';
    network: 'devnet' | 'testnet' | null;
  }
  
  // Union type of all service data types
  export type ServiceData = 
    | TokenSendData
    | ENSTokenSendData
    | BatchTransferData
    | SwapTwoTokensData
    | GetWalletBalancesData
    | GetWalletPortfolioData;
  
  // Generic props interface for all service components
  export interface ServiceComponentProps<T extends ServiceData = ServiceData> {
    sessionId: string;
    serviceType: T['serviceType'];
    parsedData: T;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  // Specific props types for each service component
  export type TokenSendComponentProps = ServiceComponentProps<TokenSendData>;
  export type ENSTokenSendComponentProps = ServiceComponentProps<ENSTokenSendData>;
  export type BatchTransferComponentProps = ServiceComponentProps<BatchTransferData>;
  export type SwapTwoTokensComponentProps = ServiceComponentProps<SwapTwoTokensData>;
  export type GetWalletBalancesComponentProps = ServiceComponentProps<GetWalletBalancesData>;
  export type GetWalletPortfolioComponentProps = ServiceComponentProps<GetWalletPortfolioData>;