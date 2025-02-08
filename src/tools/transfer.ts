//transfer.ts

import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
  } from "@solana/web3.js";
  import { LAMPORTS_PER_SOL } from "@solana/web3.js";
  import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getMint,
  } from "@solana/spl-token";
  import { PRIORITY_FEE, COMPUTE_UNIT_LIMIT } from "@/utils/constant";
  
  export async function createTransferTransaction(
    connection: Connection,
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amount: number,
    mint?: PublicKey
  ): Promise<Transaction> {
    const transaction = new Transaction();
  
    // Add priority fee instruction
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_FEE,
      })
    );
  
    // Set compute unit limit instruction
    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: COMPUTE_UNIT_LIMIT,
      })
    );
  
    if (!mint) {
      // Transfer native SOL
      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(mint, fromPubkey);
      const toAta = await getAssociatedTokenAddress(mint, toPubkey);
      const mintInfo = await getMint(connection, mint);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
  
      // Check if recipient ATA exists, and create it if not
      const toAtaInfo = await connection.getAccountInfo(toAta);
      if (!toAtaInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            fromPubkey,
            toAta,
            toPubkey,
            mint
          )
        );
      }
  
      transaction.add(
        createTransferInstruction(fromAta, toAta, fromPubkey, adjustedAmount)
      );
    }
  
    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;
  
    return transaction;
  }
  