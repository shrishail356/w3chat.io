'use client';

import {PrivyProvider} from '@privy-io/react-auth';
// Replace this with any of the networks listed at https://github.com/wevm/viem/blob/main/src/chains/index.ts
import {base, baseSepolia} from 'viem/chains';

export default function Providers({children}: {children: React.ReactNode}) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
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
            "supportedChains": [base, baseSepolia] 
            }}
>
  {children}
</PrivyProvider>
  );
}

