// utils/swap.ts
import { PublicKey } from "@solana/web3.js";
const JUP_API = "https://quote-api.jup.ag/v6";

export async function getSwapQuote(
  inputMint: PublicKey,
  outputMint: PublicKey,
  inputAmount: number,
  slippageBps: number = 300
) {
  const response = await fetch(
    `${JUP_API}/quote?` +
      `inputMint=${inputMint.toString()}` +
      `&outputMint=${outputMint.toString()}` +
      `&amount=${inputAmount}` +
      `&slippageBps=${slippageBps}` +
      `&onlyDirectRoutes=true` +
      `&maxAccounts=20`
  );

  if (!response.ok) {
    throw new Error("Failed to get swap quote");
  }

  return await response.json();
}

export async function getSwapTransaction(
  quoteResponse: any,
  walletPublicKey: string
) {
  const response = await fetch(`${JUP_API}/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: walletPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: "auto",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get swap transaction");
  }

  const { swapTransaction } = await response.json();
  return swapTransaction;
}
