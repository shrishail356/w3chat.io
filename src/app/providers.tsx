'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import {arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia, polygon, polygonMumbai, mainnet, sepolia} from 'viem/chains';
import {defineChain} from 'viem';
export default function Providers({children}: {children: React.ReactNode}) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
    const warden = defineChain({
        id: 10010, // Replace this with your chain's ID
        name: 'Warden Testnet',
        network: 'warden',
        nativeCurrency: {
          decimals: 6, // Replace this with the number of decimals for your chain's native token
          name: 'WARD',
          symbol: 'WARD',
        },
        rpcUrls: {
          default: {
            http: ['https://evm.chiado.wardenprotocol.org'],
            webSocket: ['wss://evm.chiado.wardenprotocol.org'],
          },
        },
        blockExplorers: {
          default: {name: 'Explorer', url: ''},
        },
    });

    return (
        <PrivyProvider 
            appId={appId}
            config={{
            "appearance": {
                "accentColor": "#6A6FF5",
                "theme": "#FFFFFF",
                "showWalletLoginFirst": true,
                "logo": "https://i.ibb.co/KxCGVV1g/W3chat-io-5-1.png",
                "walletChainType": "ethereum-only",
                "walletList": [
                "okx_wallet",
                "coinbase_wallet",
                "metamask",
                "wallet_connect",
                ]
                
            },
            "loginMethods": [
                "google",
                "github",
                "wallet",
                "email"
            ],
            "fundingMethodConfig": {
                "moonpay": {
                "useSandbox": true
                }
            },
            "embeddedWallets": {
                "requireUserPasswordOnCreate": true,
                "showWalletUIs": true,
                "ethereum": {
                "createOnLogin": "users-without-wallets"
                },
                "solana": {
                "createOnLogin": "off"
                }
            },
            "externalWallets": { 
                "coinbaseWallet": { 
                  // Valid connection options include 'all' (default), 'eoaOnly', or 'smartWalletOnly'
                  "connectionOptions": "smartWalletOnly", 
                }, 
            }, 
            "mfa": {
                "noPromptOnMfaRequired": false
            },
            "defaultChain": base, 
            // Replace this with a list of your desired supported chains
            "supportedChains": [base, baseSepolia, arbitrum, arbitrumSepolia, warden, mainnet, sepolia, polygon, polygonMumbai, optimism, optimismSepolia] 
            }}
>
  {children}
</PrivyProvider>
  );
}

