import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains'

export const getConfig = createConfig({
  chains: [ base, baseSepolia, mainnet, sepolia,],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})