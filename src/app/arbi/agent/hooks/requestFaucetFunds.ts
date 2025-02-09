import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function requestFaucetFunds(
  rpcUrl: string, // Devnet RPC URL
  walletAddress: PublicKey
): Promise<string> {
  try {
    // Always use devnet RPC
    const connection = new Connection(
      process.env.NEXT_PUBLIC_DEVNET_RPC_URL || rpcUrl, 
      'confirmed'
    );

    // Request airdrop
    const tx = await connection.requestAirdrop(
      walletAddress,
      5 * LAMPORTS_PER_SOL
    );

    // Get latest blockhash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction
    await connection.confirmTransaction({
      signature: tx,
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    });

    return tx;
  } catch (error) {
    console.error("Faucet request failed:", error);
    throw error;
  }
}